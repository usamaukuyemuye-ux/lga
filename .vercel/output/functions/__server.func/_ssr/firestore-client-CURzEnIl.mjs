import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { a as limit, c as query, d as where, f as collection, h as initializeFirestore, i as getDocs, l as setDoc, m as getFirestore, n as getDoc, o as onSnapshot, p as doc, s as orderBy, t as deleteDoc, u as updateDoc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { a as signOut, i as signInWithPopup, n as getAuth, r as onAuthStateChanged, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firestore-client-CURzEnIl.js
var firebase_applet_config_default = {
	projectId: "smart-augury-8c9s2",
	appId: "1:121128187092:web:15631124ffbe857134f741",
	apiKey: "AIzaSyCcjGKnI1RrfoKLEEuQfL6bftFGynHOw3A",
	authDomain: "smart-augury-8c9s2.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-schooltrack-af37bf75-afe2-45b7-9f8a-1db440a9b418",
	storageBucket: "smart-augury-8c9s2.firebasestorage.app",
	messagingSenderId: "121128187092",
	measurementId: "",
	oAuthClientId: "121128187092-r6ifinvf2ktg2v7vo37q1lie8vkuo9er.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
var app = getApps().length ? getApp() : initializeApp(firebase_applet_config_default);
var firestoreInstance;
try {
	firestoreInstance = initializeFirestore(app, {
		experimentalAutoDetectLongPolling: true,
		ignoreUndefinedProperties: true
	}, firebase_applet_config_default.firestoreDatabaseId);
} catch {
	firestoreInstance = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
}
var db = firestoreInstance;
var auth = getAuth(app);
var DEMO_ACCOUNTS = [
	{
		id: "user-admin",
		email: "admin@school.com",
		name: "System Administrator",
		role: "admin",
		password: "Admin123"
	},
	{
		id: "user-owner",
		email: "owner@school.com",
		name: "School Owner",
		role: "owner",
		password: "Owner123"
	},
	{
		id: "user-head-studies",
		email: "headofstudies@school.com",
		name: "Dr. Paul Kayitare (Head of Studies)",
		role: "head_of_studies",
		password: "Studies123"
	},
	{
		id: "user-secretary",
		email: "secretary@school.com",
		name: "Mary Uwase",
		role: "secretary",
		password: "Secretary123"
	},
	{
		id: "user-teacher",
		email: "teacher@school.com",
		name: "Jane Smith",
		role: "teacher",
		password: "Teacher123"
	},
	{
		id: "user-finance",
		email: "finance@school.com",
		name: "Peter Habimana",
		role: "finance",
		password: "Finance123"
	},
	{
		id: "user-parent",
		email: "parent@school.com",
		name: "John Doe Sr.",
		role: "parent",
		password: "Parent123"
	}
];
async function seedInitialData() {
	try {
		try {
			await deleteDoc(doc(db, "profiles", "user-student"));
			await deleteDoc(doc(db, "users", "user-student"));
		} catch {}
		if (typeof window !== "undefined" && localStorage.getItem("schooltrack_seeded_v2")) return;
		if (!(await getDoc(doc(db, "school_settings", "default"))).exists()) await setDoc(doc(db, "school_settings", "default"), {
			id: "default",
			school_name: "SchoolTrack Primary School",
			email: "info@schooltrack.edu",
			phone: "+250 780 000 000",
			address: "Kigali, Rwanda",
			notify_email: "notifications@schooltrack.edu",
			logo_url: null
		});
		for (const acc of DEMO_ACCOUNTS) {
			const profRef = doc(db, "profiles", acc.id);
			if (!(await getDoc(profRef)).exists()) await setDoc(profRef, {
				id: acc.id,
				full_name: acc.name,
				email: acc.email,
				phone: "+250 780 000 000",
				active: true,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			});
			const roleRef = doc(db, "user_roles", `role-${acc.id}`);
			if (!(await getDoc(roleRef)).exists()) await setDoc(roleRef, {
				id: `role-${acc.id}`,
				user_id: acc.id,
				role: acc.role
			});
		}
		for (const c of [
			{
				id: "class-p1",
				name: "Primary 1",
				teacher_id: "user-teacher"
			},
			{
				id: "class-p2",
				name: "Primary 2",
				teacher_id: "user-teacher"
			},
			{
				id: "class-p3",
				name: "Primary 3",
				teacher_id: null
			},
			{
				id: "class-p4",
				name: "Primary 4",
				teacher_id: "user-teacher"
			},
			{
				id: "class-p5",
				name: "Primary 5",
				teacher_id: null
			},
			{
				id: "class-p6",
				name: "Primary 6",
				teacher_id: null
			}
		]) {
			const classRef = doc(db, "classes", c.id);
			if (!(await getDoc(classRef)).exists()) await setDoc(classRef, {
				id: c.id,
				name: c.name,
				teacher_id: c.teacher_id,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		for (const s of [
			{
				id: "std-0001",
				student_code: "STD-0001",
				full_name: "John Doe",
				gender: "male",
				date_of_birth: "2018-03-11",
				class_id: "class-p1",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0001-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-p1-001",
				student_code: "STD-P1-001",
				full_name: "Kevine Uwase",
				gender: "female",
				date_of_birth: "2018-05-19",
				class_id: "class-p1",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-P1-001-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0002",
				student_code: "STD-0002",
				full_name: "Alice Mukamana",
				gender: "female",
				date_of_birth: "2016-07-02",
				class_id: "class-p4",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0002-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0003",
				student_code: "STD-0003",
				full_name: "Eric Niyonzima",
				gender: "male",
				date_of_birth: "2018-01-25",
				class_id: "class-p2",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0003-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0004",
				student_code: "STD-0004",
				full_name: "Grace Ineza",
				gender: "female",
				date_of_birth: "2014-09-14",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0004-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0005",
				student_code: "STD-0005",
				full_name: "Jean Claude Mugisha",
				gender: "male",
				date_of_birth: "2014-04-12",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0005-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0006",
				student_code: "STD-0006",
				full_name: "Divine Uwamahoro",
				gender: "female",
				date_of_birth: "2014-11-20",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0006-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0007",
				student_code: "STD-0007",
				full_name: "Cedric Habimana",
				gender: "male",
				date_of_birth: "2014-06-08",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0007-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0008",
				student_code: "STD-0008",
				full_name: "Kevin Shema",
				gender: "male",
				date_of_birth: "2015-05-15",
				class_id: "class-p5",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0008-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0009",
				student_code: "STD-0009",
				full_name: "Aline Uwera",
				gender: "female",
				date_of_birth: "2015-09-22",
				class_id: "class-p5",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0009-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0010",
				student_code: "STD-0010",
				full_name: "Patrick Mugabo",
				gender: "male",
				date_of_birth: "2015-12-03",
				class_id: "class-p5",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0010-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0011",
				student_code: "STD-0011",
				full_name: "Brian Mutabazi",
				gender: "male",
				date_of_birth: "2017-02-18",
				class_id: "class-p3",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0011-QR",
				religion: "Christian",
				active: true
			},
			{
				id: "std-0012",
				student_code: "STD-0012",
				full_name: "Chantal Mukashyaka",
				gender: "female",
				date_of_birth: "2017-08-30",
				class_id: "class-p3",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-STD-0012-QR",
				religion: "Christian",
				academic_year: "2024-2025",
				active: true
			},
			{
				id: "std-hist-2024",
				student_code: "STD-2024-01",
				full_name: "Yvan Kayihura",
				gender: "male",
				date_of_birth: "2013-04-12",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-HIST-2024-QR",
				religion: "Christian",
				academic_year: "2024-2025",
				active: true
			},
			{
				id: "std-hist-2023",
				student_code: "STD-2023-01",
				full_name: "Nadege Umwali",
				gender: "female",
				date_of_birth: "2012-09-18",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-HIST-2023-QR",
				religion: "Christian",
				academic_year: "2023-2024",
				active: true
			},
			{
				id: "std-hist-2021",
				student_code: "STD-2021-02",
				full_name: "Fabrice Kwizera",
				gender: "male",
				date_of_birth: "2010-06-25",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-HIST-2021-QR",
				religion: "Christian",
				academic_year: "2021-2022",
				active: true
			},
			{
				id: "std-hist-2018",
				student_code: "STD-2018-05",
				full_name: "Sandrine Uwamariya",
				gender: "female",
				date_of_birth: "2007-11-14",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-HIST-2018-QR",
				religion: "Christian",
				academic_year: "2018-2019",
				active: true
			},
			{
				id: "std-hist-2015",
				student_code: "STD-2015-01",
				full_name: "Emmanuel Gasana",
				gender: "male",
				date_of_birth: "2004-03-08",
				class_id: "class-p6",
				parent_id: "user-parent",
				parent_name: "John Doe Sr.",
				parent_email: "parent@school.com",
				parent_phone: "+250 780 000 000",
				address: "Kigali, Rwanda",
				photo_url: null,
				qr_token: "STU-HIST-2015-QR",
				religion: "Christian",
				academic_year: "2015-2016",
				active: true
			}
		]) {
			const sRef = doc(db, "students", s.id);
			if (!(await getDoc(sRef)).exists()) await setDoc(sRef, {
				...s,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		if ((await getDocs(collection(db, "attendance"))).empty) {
			const sampleAtt = [
				{
					id: `att-1`,
					student_id: "std-0001",
					class_id: "class-p4",
					attendance_date: todayStr,
					status: "present",
					arrival_time: "07:45",
					departure_time: null,
					recorded_by: "user-teacher",
					recorded_by_name: "Jane Smith",
					note: "On time, active participation",
					created_at: `${todayStr}T07:45:00.000Z`
				},
				{
					id: `att-2`,
					student_id: "std-0002",
					class_id: "class-p4",
					attendance_date: todayStr,
					status: "late",
					arrival_time: "08:15",
					departure_time: null,
					recorded_by: "user-teacher",
					recorded_by_name: "Jane Smith",
					note: "Late due to rain",
					created_at: `${todayStr}T08:15:00.000Z`
				},
				{
					id: `att-3`,
					student_id: "std-0003",
					class_id: "class-p2",
					attendance_date: todayStr,
					status: "present",
					arrival_time: "07:50",
					departure_time: null,
					recorded_by: "user-secretary",
					recorded_by_name: "Mary Uwase",
					note: "Scanned at main gate",
					created_at: `${todayStr}T07:50:00.000Z`
				}
			];
			for (const a of sampleAtt) await setDoc(doc(db, "attendance", a.id), a);
		}
		if ((await getDocs(collection(db, "announcements"))).empty) await setDoc(doc(db, "announcements", "ann-1"), {
			id: "ann-1",
			title: "Welcome to SchoolTrack Term 2",
			body: "All classes have resumed. QR scanning stations are active at the front gate.",
			action_label: "View Timetable",
			action_url: "/timetable",
			image_url: null,
			created_by: "user-admin",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if ((await getDocs(collection(db, "payments"))).empty) await setDoc(doc(db, "payments", "pay-1"), {
			id: "pay-1",
			student_id: "std-0001",
			amount: 250,
			currency: "USD",
			category: "Tuition",
			method: "Bank Transfer",
			paid_on: todayStr,
			term: "Term 2",
			reference: "TXN-98412",
			status: "completed",
			description: "Term 2 Full Tuition payment",
			recorded_by: "user-finance",
			recorded_by_name: "Peter Habimana",
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (typeof window !== "undefined") localStorage.setItem("schooltrack_seeded_v2", "true");
	} catch (err) {
		console.warn("Auto-seeding encountered non-fatal error:", err);
	}
}
var AUTH_STORAGE_KEY = "schooltrack_firebase_auth_user";
var authSubscribers = /* @__PURE__ */ new Set();
function getStoredUser() {
	try {
		const raw = localStorage.getItem(AUTH_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setStoredUser(user) {
	try {
		if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
		else localStorage.removeItem(AUTH_STORAGE_KEY);
	} catch {}
	const session = user ? {
		access_token: `token-${user.id}`,
		token_type: "bearer",
		user
	} : null;
	authSubscribers.forEach((cb) => cb(user ? "SIGNED_IN" : "SIGNED_OUT", session));
}
var seedRan = false;
async function ensureSeeded() {
	if (!seedRan) {
		seedRan = true;
		await seedInitialData();
	}
}
var relationCache = {
	classes: /* @__PURE__ */ new Map(),
	students: /* @__PURE__ */ new Map()
};
async function resolveRelations(tableName, records, selectClause) {
	if (!records.length) return records;
	const now = Date.now();
	if (selectClause.includes("classes")) {
		const classIds = Array.from(new Set(records.map((r) => r.class_id).filter(Boolean)));
		if (classIds.length) {
			const classMap = {};
			const missingIds = [];
			for (const cid of classIds) {
				const cached = relationCache.classes.get(cid);
				if (cached && cached.expiry > now) classMap[cid] = cached.data;
				else missingIds.push(cid);
			}
			if (missingIds.length) await Promise.all(missingIds.map(async (cid) => {
				try {
					const snap = await getDoc(doc(db, "classes", cid));
					if (snap.exists()) {
						const data = snap.data();
						classMap[cid] = data;
						relationCache.classes.set(cid, {
							data,
							expiry: now + 6e4
						});
					}
				} catch {}
			}));
			records.forEach((r) => {
				if (r.class_id && classMap[r.class_id]) r.classes = { name: classMap[r.class_id].name };
				else r.classes = null;
			});
		}
	}
	if (selectClause.includes("students")) {
		const studentIds = Array.from(new Set(records.map((r) => r.student_id).filter(Boolean)));
		if (studentIds.length) {
			const studentMap = {};
			const missingIds = [];
			for (const sid of studentIds) {
				const cached = relationCache.students.get(sid);
				if (cached && cached.expiry > now) studentMap[sid] = cached.data;
				else missingIds.push(sid);
			}
			if (missingIds.length) await Promise.all(missingIds.map(async (sid) => {
				try {
					const snap = await getDoc(doc(db, "students", sid));
					if (snap.exists()) {
						const data = snap.data();
						studentMap[sid] = data;
						relationCache.students.set(sid, {
							data,
							expiry: now + 6e4
						});
					}
				} catch {}
			}));
			records.forEach((r) => {
				if (r.student_id && studentMap[r.student_id]) {
					const s = studentMap[r.student_id];
					r.students = {
						id: s.id,
						full_name: s.full_name,
						student_code: s.student_code,
						parent_email: s.parent_email,
						class_id: s.class_id
					};
				} else r.students = null;
			});
		}
	}
	return records;
}
var QueryBuilder = class {
	tableName;
	mode = "select";
	payload = null;
	filters = [];
	orderFields = [];
	limitCount;
	selectClause = "*";
	isCountQuery = false;
	isSingle = false;
	isMaybeSingle = false;
	constructor(tableName) {
		this.tableName = tableName;
	}
	select(clause = "*", options) {
		this.selectClause = clause;
		if (options?.head || options?.count === "exact") this.isCountQuery = true;
		return this;
	}
	insert(payload) {
		this.mode = "insert";
		this.payload = payload;
		return this;
	}
	upsert(payload, _options) {
		this.mode = "upsert";
		this.payload = payload;
		return this;
	}
	update(patch) {
		this.mode = "update";
		this.payload = patch;
		return this;
	}
	delete() {
		this.mode = "delete";
		return this;
	}
	eq(field, value) {
		this.filters.push({
			field,
			op: "==",
			value
		});
		return this;
	}
	neq(field, value) {
		this.filters.push({
			field,
			op: "!=",
			value
		});
		return this;
	}
	in(field, values) {
		if (values && values.length > 0) this.filters.push({
			field,
			op: "in",
			value: values.slice(0, 10)
		});
		return this;
	}
	gte(field, value) {
		this.filters.push({
			field,
			op: ">=",
			value
		});
		return this;
	}
	lte(field, value) {
		this.filters.push({
			field,
			op: "<=",
			value
		});
		return this;
	}
	match(record) {
		if (record) for (const [key, value] of Object.entries(record)) this.eq(key, value);
		return this;
	}
	order(field, options) {
		this.orderFields.push({
			field,
			ascending: options?.ascending !== false
		});
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	range(_from, to) {
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
	async execute() {
		if (this.mode === "insert" || this.mode === "upsert") return this.executeInsert();
		if (this.mode === "update") return this.executeUpdate();
		if (this.mode === "delete") return this.executeDelete();
		return this.executeSelect();
	}
	then(onfulfilled, onrejected) {
		return this.execute().then(onfulfilled, onrejected);
	}
	async executeSelect() {
		await ensureSeeded();
		try {
			const colRef = collection(db, this.tableName);
			const constraints = [];
			for (const f of this.filters) constraints.push(where(f.field, f.op, f.value));
			if (this.orderFields.length > 0) for (const o of this.orderFields) constraints.push(orderBy(o.field, o.ascending ? "asc" : "desc"));
			if (this.limitCount) constraints.push(limit(this.limitCount));
			let q;
			let snapshot;
			try {
				q = query(colRef, ...constraints);
				snapshot = await getDocs(q);
			} catch (queryErr) {
				let items = (await getDocs(colRef)).docs.map((d) => ({
					id: d.id,
					...d.data()
				}));
				for (const f of this.filters) if (f.op === "==") items = items.filter((item) => item[f.field] === f.value);
				else if (f.op === "!=") items = items.filter((item) => item[f.field] !== f.value);
				else if (f.op === ">=") items = items.filter((item) => item[f.field] >= f.value);
				else if (f.op === "<=") items = items.filter((item) => item[f.field] <= f.value);
				else if (f.op === "in") items = items.filter((item) => Array.isArray(f.value) && f.value.includes(item[f.field]));
				for (const o of this.orderFields) items.sort((a, b) => {
					const va = a[o.field];
					const vb = b[o.field];
					if (va < vb) return o.ascending ? -1 : 1;
					if (va > vb) return o.ascending ? 1 : -1;
					return 0;
				});
				if (this.limitCount) items = items.slice(0, this.limitCount);
				if (this.isCountQuery) return {
					data: null,
					error: null,
					count: items.length
				};
				const resolved = await resolveRelations(this.tableName, items, this.selectClause);
				if (this.isSingle || this.isMaybeSingle) return {
					data: resolved && resolved.length > 0 ? resolved[0] : null,
					error: null
				};
				return {
					data: resolved,
					error: null,
					count: resolved.length
				};
			}
			if (this.isCountQuery) return {
				data: null,
				error: null,
				count: snapshot.size
			};
			let data = snapshot.docs.map((d) => ({
				id: d.id,
				...d.data()
			}));
			data = await resolveRelations(this.tableName, data, this.selectClause);
			if (this.isSingle || this.isMaybeSingle) return {
				data: data && data.length > 0 ? data[0] : null,
				error: null
			};
			return {
				data,
				error: null,
				count: data.length
			};
		} catch (err) {
			console.error(`Firestore query error on ${this.tableName}:`, err);
			return {
				data: this.isSingle || this.isMaybeSingle ? null : [],
				error: err,
				count: 0
			};
		}
	}
	async executeInsert() {
		await ensureSeeded();
		try {
			const items = Array.isArray(this.payload) ? this.payload : [this.payload];
			const inserted = [];
			for (const item of items) {
				const id = item.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
				const docData = {
					...item,
					id
				};
				if (!docData.created_at) docData.created_at = (/* @__PURE__ */ new Date()).toISOString();
				await setDoc(doc(db, this.tableName, id), docData);
				inserted.push(docData);
			}
			return {
				data: this.isSingle || this.isMaybeSingle ? inserted[0] ?? null : Array.isArray(this.payload) ? inserted : inserted[0],
				error: null
			};
		} catch (err) {
			console.error(`Firestore insert error on ${this.tableName}:`, err);
			return {
				data: null,
				error: err
			};
		}
	}
	async executeUpdate() {
		await ensureSeeded();
		try {
			const queryRes = await this.executeSelect();
			const docsToUpdate = Array.isArray(queryRes.data) ? queryRes.data : queryRes.data ? [queryRes.data] : [];
			for (const d of docsToUpdate) {
				if (!d.id) continue;
				await updateDoc(doc(db, this.tableName, d.id), {
					...this.payload,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
			return {
				data: this.isSingle || this.isMaybeSingle ? docsToUpdate[0] ?? null : docsToUpdate,
				error: null
			};
		} catch (err) {
			console.error(`Firestore update error on ${this.tableName}:`, err);
			return {
				data: null,
				error: err
			};
		}
	}
	async executeDelete() {
		await ensureSeeded();
		try {
			const queryRes = await this.executeSelect();
			const docsToDelete = Array.isArray(queryRes.data) ? queryRes.data : queryRes.data ? [queryRes.data] : [];
			for (const d of docsToDelete) {
				if (!d.id) continue;
				await deleteDoc(doc(db, this.tableName, d.id));
			}
			return {
				data: docsToDelete,
				error: null
			};
		} catch (err) {
			console.error(`Firestore delete error on ${this.tableName}:`, err);
			return {
				data: null,
				error: err
			};
		}
	}
};
var firestoreClient = {
	from(tableName) {
		return new QueryBuilder(tableName);
	},
	select(...args) {
		return new QueryBuilder("default").select(...args);
	},
	channel(channelName) {
		let unsubscribe = null;
		const handlers = [];
		const channelObj = {
			on(event, filter, callback) {
				handlers.push({
					event,
					filter,
					callback
				});
				return channelObj;
			},
			subscribe(callback) {
				for (const h of handlers) {
					const tableName = h.filter?.table || channelName;
					try {
						let initial = true;
						unsubscribe = onSnapshot(query(collection(db, tableName)), (snapshot) => {
							if (initial) {
								initial = false;
								return;
							}
							snapshot.docChanges().forEach((change) => {
								if (change.type === "added" && (!h.filter?.event || h.filter.event === "INSERT" || h.filter.event === "*")) h.callback({
									eventType: "INSERT",
									new: {
										id: change.doc.id,
										...change.doc.data()
									},
									old: null
								});
								else if (change.type === "modified") h.callback({
									eventType: "UPDATE",
									new: {
										id: change.doc.id,
										...change.doc.data()
									},
									old: null
								});
								else if (change.type === "removed") h.callback({
									eventType: "DELETE",
									new: null,
									old: {
										id: change.doc.id,
										...change.doc.data()
									}
								});
							});
						}, (err) => {
							console.warn(`Firestore onSnapshot subscription warning for ${tableName}:`, err);
						});
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
			}
		};
		return channelObj;
	},
	removeChannel(channelObj) {
		if (channelObj && typeof channelObj.unsubscribe === "function") channelObj.unsubscribe();
	},
	async rpc(functionName, args) {
		await ensureSeeded();
		if (functionName === "has_role") {
			const { _user_id, _role } = args;
			return {
				data: !(await getDocs(query(collection(db, "user_roles"), where("user_id", "==", _user_id), where("role", "==", _role)))).empty,
				error: null
			};
		}
		return {
			data: true,
			error: null
		};
	},
	auth: {
		async signInWithPassword(creds) {
			await ensureSeeded();
			const email = creds.email.toLowerCase().trim();
			const demoMatch = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email);
			let userObj;
			if (demoMatch) userObj = {
				id: demoMatch.id,
				email: demoMatch.email,
				user_metadata: { full_name: demoMatch.name }
			};
			else {
				const profSnap = await getDocs(query(collection(db, "profiles"), where("email", "==", email)));
				if (!profSnap.empty) {
					const docData = profSnap.docs[0].data();
					userObj = {
						id: docData.id,
						email: docData.email,
						user_metadata: { full_name: docData.full_name }
					};
				} else {
					const newId = `user-${Date.now()}`;
					const newName = email.split("@")[0] || "User";
					userObj = {
						id: newId,
						email,
						user_metadata: { full_name: newName }
					};
					await setDoc(doc(db, "profiles", newId), {
						id: newId,
						email,
						full_name: newName,
						phone: null,
						active: true,
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					});
					await setDoc(doc(db, "user_roles", `role-${newId}`), {
						id: `role-${newId}`,
						user_id: newId,
						role: "parent"
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
						user: userObj
					}
				},
				error: null
			};
		},
		async signInWithPopup(provider) {
			await ensureSeeded();
			try {
				const fbUser = (await signInWithPopup(auth, provider || new GoogleAuthProvider())).user;
				const userObj = {
					id: fbUser.uid,
					email: fbUser.email || "",
					user_metadata: {
						full_name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
						avatar_url: fbUser.photoURL || void 0
					}
				};
				await setDoc(doc(db, "profiles", fbUser.uid), {
					id: fbUser.uid,
					email: userObj.email,
					full_name: userObj.user_metadata?.full_name || "User",
					phone: fbUser.phoneNumber || null,
					active: true,
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}, { merge: true });
				const isAdminUser = userObj.email === "usamaukuyemuye@gmail.com";
				await setDoc(doc(db, "user_roles", `role-${fbUser.uid}`), {
					id: `role-${fbUser.uid}`,
					user_id: fbUser.uid,
					role: isAdminUser ? "admin" : "parent"
				}, { merge: true });
				setStoredUser(userObj);
				return {
					data: {
						user: userObj,
						session: {
							access_token: await fbUser.getIdToken(),
							token_type: "bearer",
							user: userObj
						}
					},
					error: null
				};
			} catch (err) {
				console.error("Popup sign in error:", err);
				return {
					data: {
						user: null,
						session: null
					},
					error: err
				};
			}
		},
		async signOut() {
			try {
				await signOut(auth);
			} catch {}
			setStoredUser(null);
			return { error: null };
		},
		async getUser() {
			const stored = getStoredUser();
			if (stored) return {
				data: { user: stored },
				error: null
			};
			if (auth.currentUser) {
				const fb = auth.currentUser;
				return {
					data: { user: {
						id: fb.uid,
						email: fb.email || "",
						user_metadata: { full_name: fb.displayName || fb.email?.split("@")[0] || "User" }
					} },
					error: null
				};
			}
			return {
				data: { user: null },
				error: null
			};
		},
		async getSession() {
			const stored = getStoredUser();
			if (stored) return {
				data: { session: {
					access_token: `token-${stored.id}`,
					token_type: "bearer",
					user: stored
				} },
				error: null
			};
			return {
				data: { session: null },
				error: null
			};
		},
		onAuthStateChange(callback) {
			authSubscribers.add(callback);
			const unsubFb = onAuthStateChanged(auth, async (fbUser) => {
				if (fbUser) setStoredUser({
					id: fbUser.uid,
					email: fbUser.email || "",
					user_metadata: { full_name: fbUser.displayName || fbUser.email?.split("@")[0] || "User" }
				});
			});
			return { data: { subscription: { unsubscribe: () => {
				authSubscribers.delete(callback);
				unsubFb();
			} } } };
		}
	}
};
//#endregion
export { seedInitialData as a, firestoreClient as i, db as n, ensureSeeded as r, DEMO_ACCOUNTS as t };
