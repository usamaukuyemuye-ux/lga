import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query as fsQuery,
  where as fsWhere,
  orderBy as fsOrderBy,
  limit as fsLimit,
  QueryConstraint,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { db, auth } from "./config";
import { handleFirestoreError, OperationType } from "./errors";
import { DEMO_ACCOUNTS, seedInitialData } from "./seed";

const AUTH_STORAGE_KEY = "schooltrack_firebase_auth_user";

interface LocalSessionUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface LocalSession {
  access_token: string;
  token_type: string;
  user: LocalSessionUser;
}

type AuthCallback = (event: string, session: LocalSession | null) => void;
const authSubscribers = new Set<AuthCallback>();

function getStoredUser(): LocalSessionUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: LocalSessionUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  const session = user
    ? {
        access_token: `token-${user.id}`,
        token_type: "bearer",
        user,
      }
    : null;
  authSubscribers.forEach((cb) => cb(user ? "SIGNED_IN" : "SIGNED_OUT", session));
}

// Ensure initial seed is run once
let seedRan = false;
export async function ensureSeeded() {
  if (!seedRan) {
    seedRan = true;
    await seedInitialData();
  }
}

// In-memory cache for joined relations (classes, students, profiles) with TTL
const relationCache = {
  classes: new Map<string, { data: any; expiry: number }>(),
  students: new Map<string, { data: any; expiry: number }>(),
};

async function resolveRelations(tableName: string, records: any[], selectClause: string) {
  if (!records.length) return records;
  const now = Date.now();

  // Resolve classes(name)
  if (selectClause.includes("classes")) {
    const classIds = Array.from(
      new Set(records.map((r) => r.class_id).filter(Boolean)),
    ) as string[];
    if (classIds.length) {
      const classMap: Record<string, any> = {};
      const missingIds: string[] = [];

      for (const cid of classIds) {
        const cached = relationCache.classes.get(cid);
        if (cached && cached.expiry > now) {
          classMap[cid] = cached.data;
        } else {
          missingIds.push(cid);
        }
      }

      if (missingIds.length) {
        await Promise.all(
          missingIds.map(async (cid) => {
            try {
              const snap = await getDoc(doc(db, "classes", cid));
              if (snap.exists()) {
                const data = snap.data();
                classMap[cid] = data;
                relationCache.classes.set(cid, { data, expiry: now + 60000 });
              }
            } catch {
              // ignore
            }
          }),
        );
      }

      records.forEach((r) => {
        if (r.class_id && classMap[r.class_id]) {
          r.classes = { name: classMap[r.class_id].name };
        } else {
          r.classes = null;
        }
      });
    }
  }

  // Resolve students(...)
  if (selectClause.includes("students")) {
    const studentIds = Array.from(
      new Set(records.map((r) => r.student_id).filter(Boolean)),
    ) as string[];
    if (studentIds.length) {
      const studentMap: Record<string, any> = {};
      const missingIds: string[] = [];

      for (const sid of studentIds) {
        const cached = relationCache.students.get(sid);
        if (cached && cached.expiry > now) {
          studentMap[sid] = cached.data;
        } else {
          missingIds.push(sid);
        }
      }

      if (missingIds.length) {
        await Promise.all(
          missingIds.map(async (sid) => {
            try {
              const snap = await getDoc(doc(db, "students", sid));
              if (snap.exists()) {
                const data = snap.data();
                studentMap[sid] = data;
                relationCache.students.set(sid, { data, expiry: now + 60000 });
              }
            } catch {
              // ignore
            }
          }),
        );
      }

      records.forEach((r) => {
        if (r.student_id && studentMap[r.student_id]) {
          const s = studentMap[r.student_id];
          r.students = {
            id: s.id,
            full_name: s.full_name,
            student_code: s.student_code,
            parent_email: s.parent_email,
            class_id: s.class_id,
          };
        } else {
          r.students = null;
        }
      });
    }
  }

  return records;
}

class QueryBuilder {
  private tableName: string;
  private mode: "select" | "insert" | "upsert" | "update" | "delete" = "select";
  private payload: any = null;
  private filters: {
    field: string;
    op: "<" | "<=" | "==" | ">" | ">=" | "!=" | "in";
    value: any;
  }[] = [];
  private orderFields: { field: string; ascending: boolean }[] = [];
  private limitCount?: number;
  private selectClause = "*";
  private isCountQuery = false;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(clause = "*", options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    this.selectClause = clause;
    if (options?.head || options?.count === "exact") {
      this.isCountQuery = true;
    }
    return this;
  }

  insert(payload: any | any[]) {
    this.mode = "insert";
    this.payload = payload;
    return this;
  }

  upsert(payload: any | any[], _options?: { onConflict?: string }) {
    this.mode = "upsert";
    this.payload = payload;
    return this;
  }

  update(patch: Record<string, any>) {
    this.mode = "update";
    this.payload = patch;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, op: "==", value });
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push({ field, op: "!=", value });
    return this;
  }

  in(field: string, values: any[]) {
    if (values && values.length > 0) {
      this.filters.push({ field, op: "in", value: values.slice(0, 10) }); // Firestore in max 10
    }
    return this;
  }

  gte(field: string, value: any) {
    this.filters.push({ field, op: ">=", value });
    return this;
  }

  lte(field: string, value: any) {
    this.filters.push({ field, op: "<=", value });
    return this;
  }

  match(record: Record<string, any>) {
    if (record) {
      for (const [key, value] of Object.entries(record)) {
        this.eq(key, value);
      }
    }
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderFields.push({
      field,
      ascending: options?.ascending !== false,
    });
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(_from: number, to: number) {
    this.limitCount = to + 1;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limit(1);
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    this.limit(1);
    return this;
  }

  async execute(): Promise<{ data: any; error: any; count?: number }> {
    if (this.mode === "insert" || this.mode === "upsert") {
      return this.executeInsert();
    }
    if (this.mode === "update") {
      return this.executeUpdate();
    }
    if (this.mode === "delete") {
      return this.executeDelete();
    }
    return this.executeSelect();
  }

  // Make QueryBuilder awaitable
  then(onfulfilled?: ((value: any) => any) | null, onrejected?: ((reason: any) => any) | null) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async executeSelect(): Promise<{ data: any; error: any; count?: number }> {
    await ensureSeeded();
    try {
      const colRef = collection(db, this.tableName);
      const constraints: QueryConstraint[] = [];

      // Apply Firestore filters safely
      for (const f of this.filters) {
        constraints.push(fsWhere(f.field, f.op, f.value));
      }

      if (this.orderFields.length > 0) {
        for (const o of this.orderFields) {
          constraints.push(fsOrderBy(o.field, o.ascending ? "asc" : "desc"));
        }
      }

      if (this.limitCount) {
        constraints.push(fsLimit(this.limitCount));
      }

      let q;
      let snapshot;
      try {
        q = fsQuery(colRef, ...constraints);
        snapshot = await getDocs(q);
      } catch (queryErr) {
        // Fallback for composite index requirement in Firestore: fetch without order/limit and filter/sort in memory
        const allSnap = await getDocs(colRef);
        let items = allSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Apply filters in memory
        for (const f of this.filters) {
          if (f.op === "==") {
            items = items.filter((item: any) => item[f.field] === f.value);
          } else if (f.op === "!=") {
            items = items.filter((item: any) => item[f.field] !== f.value);
          } else if (f.op === ">=") {
            items = items.filter((item: any) => item[f.field] >= f.value);
          } else if (f.op === "<=") {
            items = items.filter((item: any) => item[f.field] <= f.value);
          } else if (f.op === "in") {
            items = items.filter(
              (item: any) => Array.isArray(f.value) && f.value.includes(item[f.field]),
            );
          }
        }

        // Apply sorting in memory
        for (const o of this.orderFields) {
          items.sort((a: any, b: any) => {
            const va = a[o.field];
            const vb = b[o.field];
            if (va < vb) return o.ascending ? -1 : 1;
            if (va > vb) return o.ascending ? 1 : -1;
            return 0;
          });
        }

        if (this.limitCount) {
          items = items.slice(0, this.limitCount);
        }

        if (this.isCountQuery) {
          return { data: null, error: null, count: items.length };
        }

        const resolved = await resolveRelations(this.tableName, items, this.selectClause);
        if (this.isSingle || this.isMaybeSingle) {
          return { data: resolved && resolved.length > 0 ? resolved[0] : null, error: null };
        }
        return { data: resolved, error: null, count: resolved.length };
      }

      if (this.isCountQuery) {
        return { data: null, error: null, count: snapshot.size };
      }

      let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data = await resolveRelations(this.tableName, data, this.selectClause);

      if (this.isSingle || this.isMaybeSingle) {
        return { data: data && data.length > 0 ? data[0] : null, error: null };
      }

      return { data, error: null, count: data.length };
    } catch (err: any) {
      console.error(`Firestore query error on ${this.tableName}:`, err);
      return { data: this.isSingle || this.isMaybeSingle ? null : [], error: err, count: 0 };
    }
  }

  private async executeInsert(): Promise<{ data: any; error: any }> {
    await ensureSeeded();
    try {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted: any[] = [];

      for (const item of items) {
        const id = item.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const docData = { ...item, id };
        if (!docData.created_at) {
          docData.created_at = new Date().toISOString();
        }
        await setDoc(doc(db, this.tableName, id), docData);
        inserted.push(docData);
      }

      const returnData =
        this.isSingle || this.isMaybeSingle
          ? (inserted[0] ?? null)
          : Array.isArray(this.payload)
            ? inserted
            : inserted[0];

      return {
        data: returnData,
        error: null,
      };
    } catch (err: any) {
      console.error(`Firestore insert error on ${this.tableName}:`, err);
      return { data: null, error: err };
    }
  }

  private async executeUpdate(): Promise<{ data: any; error: any }> {
    await ensureSeeded();
    try {
      // Find matching documents according to this.filters
      const queryRes = await this.executeSelect();
      const docsToUpdate = Array.isArray(queryRes.data)
        ? queryRes.data
        : queryRes.data
          ? [queryRes.data]
          : [];

      for (const d of docsToUpdate) {
        if (!d.id) continue;
        const docRef = doc(db, this.tableName, d.id);
        const updatePayload = {
          ...this.payload,
          updated_at: new Date().toISOString(),
        };
        await updateDoc(docRef, updatePayload);
      }

      const returnData =
        this.isSingle || this.isMaybeSingle ? (docsToUpdate[0] ?? null) : docsToUpdate;

      return { data: returnData, error: null };
    } catch (err: any) {
      console.error(`Firestore update error on ${this.tableName}:`, err);
      return { data: null, error: err };
    }
  }

  private async executeDelete(): Promise<{ data: any; error: any }> {
    await ensureSeeded();
    try {
      const queryRes = await this.executeSelect();
      const docsToDelete = Array.isArray(queryRes.data)
        ? queryRes.data
        : queryRes.data
          ? [queryRes.data]
          : [];

      for (const d of docsToDelete) {
        if (!d.id) continue;
        await deleteDoc(doc(db, this.tableName, d.id));
      }

      return { data: docsToDelete, error: null };
    } catch (err: any) {
      console.error(`Firestore delete error on ${this.tableName}:`, err);
      return { data: null, error: err };
    }
  }
}

export const firestoreClient = {
  from(tableName: string) {
    return new QueryBuilder(tableName);
  },

  select(...args: any[]) {
    return new QueryBuilder("default").select(...args);
  },

  channel(channelName: string) {
    let unsubscribe: (() => void) | null = null;
    const handlers: Array<{
      event: string;
      filter: any;
      callback: (payload: any) => void;
    }> = [];

    const channelObj = {
      on(event: string, filter: any, callback: (payload: any) => void) {
        handlers.push({ event, filter, callback });
        return channelObj;
      },
      subscribe(callback?: (status: string) => void) {
        for (const h of handlers) {
          const tableName = h.filter?.table || channelName;
          try {
            let initial = true;
            const q = fsQuery(collection(db, tableName));
            unsubscribe = onSnapshot(
              q,
              (snapshot) => {
                if (initial) {
                  initial = false;
                  return;
                }
                snapshot.docChanges().forEach((change) => {
                  if (
                    change.type === "added" &&
                    (!h.filter?.event || h.filter.event === "INSERT" || h.filter.event === "*")
                  ) {
                    h.callback({
                      eventType: "INSERT",
                      new: { id: change.doc.id, ...change.doc.data() },
                      old: null,
                    });
                  } else if (change.type === "modified") {
                    h.callback({
                      eventType: "UPDATE",
                      new: { id: change.doc.id, ...change.doc.data() },
                      old: null,
                    });
                  } else if (change.type === "removed") {
                    h.callback({
                      eventType: "DELETE",
                      new: null,
                      old: { id: change.doc.id, ...change.doc.data() },
                    });
                  }
                });
              },
              (err) => {
                console.warn(`Firestore onSnapshot subscription warning for ${tableName}:`, err);
              },
            );
          } catch (err) {
            console.warn(`Firestore channel error on ${tableName}:`, err);
          }
        }
        if (callback) callback("SUBSCRIBED");
        return channelObj;
      },
      unsubscribe() {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      },
    };
    return channelObj;
  },

  removeChannel(channelObj: any) {
    if (channelObj && typeof channelObj.unsubscribe === "function") {
      channelObj.unsubscribe();
    }
  },

  async rpc(functionName: string, args: Record<string, any>) {
    await ensureSeeded();
    if (functionName === "has_role") {
      const { _user_id, _role } = args;
      const q = fsQuery(
        collection(db, "user_roles"),
        fsWhere("user_id", "==", _user_id),
        fsWhere("role", "==", _role),
      );
      const snap = await getDocs(q);
      return { data: !snap.empty, error: null };
    }
    return { data: true, error: null };
  },

  auth: {
    async signInWithPassword(creds: { email: string; password?: string }) {
      await ensureSeeded();
      const email = creds.email.toLowerCase().trim();

      // Check if matches demo accounts
      const demoMatch = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email);

      let userObj: LocalSessionUser;

      if (demoMatch) {
        userObj = {
          id: demoMatch.id,
          email: demoMatch.email,
          user_metadata: { full_name: demoMatch.name },
        };
      } else {
        // Query profiles for existing user
        const profSnap = await getDocs(
          fsQuery(collection(db, "profiles"), fsWhere("email", "==", email)),
        );
        if (!profSnap.empty) {
          const docData = profSnap.docs[0].data();
          userObj = {
            id: docData.id,
            email: docData.email,
            user_metadata: { full_name: docData.full_name },
          };
        } else {
          // Create new user profile in Firestore
          const newId = `user-${Date.now()}`;
          const newName = email.split("@")[0] || "User";
          userObj = {
            id: newId,
            email,
            user_metadata: { full_name: newName },
          };
          await setDoc(doc(db, "profiles", newId), {
            id: newId,
            email,
            full_name: newName,
            phone: null,
            active: true,
            created_at: new Date().toISOString(),
          });
          await setDoc(doc(db, "user_roles", `role-${newId}`), {
            id: `role-${newId}`,
            user_id: newId,
            role: "parent",
          });
        }
      }

      setStoredUser(userObj);
      return {
        data: {
          user: userObj,
          session: {
            access_token: `token-${userObj.id}`,
            token_type: "bearer",
            user: userObj,
          },
        },
        error: null,
      };
    },

    async signInWithPopup(provider?: any) {
      await ensureSeeded();
      try {
        const prov = provider || new GoogleAuthProvider();
        const res = await signInWithPopup(auth, prov);
        const fbUser = res.user;

        const userObj: LocalSessionUser = {
          id: fbUser.uid,
          email: fbUser.email || "",
          user_metadata: {
            full_name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
            avatar_url: fbUser.photoURL || undefined,
          },
        };

        // Upsert into Firestore profiles
        await setDoc(
          doc(db, "profiles", fbUser.uid),
          {
            id: fbUser.uid,
            email: userObj.email,
            full_name: userObj.user_metadata?.full_name || "User",
            phone: fbUser.phoneNumber || null,
            active: true,
            created_at: new Date().toISOString(),
          },
          { merge: true },
        );

        // Assign Admin role if user email matches admin
        const isAdminUser = userObj.email === "usamaukuyemuye@gmail.com";
        await setDoc(
          doc(db, "user_roles", `role-${fbUser.uid}`),
          {
            id: `role-${fbUser.uid}`,
            user_id: fbUser.uid,
            role: isAdminUser ? "admin" : "parent",
          },
          { merge: true },
        );

        setStoredUser(userObj);
        return {
          data: {
            user: userObj,
            session: {
              access_token: await fbUser.getIdToken(),
              token_type: "bearer",
              user: userObj,
            },
          },
          error: null,
        };
      } catch (err: any) {
        console.error("Popup sign in error:", err);
        return { data: { user: null, session: null }, error: err };
      }
    },

    async signOut() {
      try {
        await fbSignOut(auth);
      } catch {
        // ignore
      }
      setStoredUser(null);
      return { error: null };
    },

    async getUser() {
      const stored = getStoredUser();
      if (stored) {
        return { data: { user: stored }, error: null };
      }
      if (auth.currentUser) {
        const fb = auth.currentUser;
        const u: LocalSessionUser = {
          id: fb.uid,
          email: fb.email || "",
          user_metadata: {
            full_name: fb.displayName || fb.email?.split("@")[0] || "User",
          },
        };
        return { data: { user: u }, error: null };
      }
      return { data: { user: null }, error: null };
    },

    async getSession() {
      const stored = getStoredUser();
      if (stored) {
        return {
          data: {
            session: {
              access_token: `token-${stored.id}`,
              token_type: "bearer",
              user: stored,
            },
          },
          error: null,
        };
      }
      return { data: { session: null }, error: null };
    },

    onAuthStateChange(callback: AuthCallback) {
      authSubscribers.add(callback);
      // Also register Firebase native listener
      const unsubFb = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const u: LocalSessionUser = {
            id: fbUser.uid,
            email: fbUser.email || "",
            user_metadata: {
              full_name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
            },
          };
          setStoredUser(u);
        }
      });

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authSubscribers.delete(callback);
              unsubFb();
            },
          },
        },
      };
    },
  },
};
