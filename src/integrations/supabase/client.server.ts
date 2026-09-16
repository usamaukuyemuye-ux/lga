// Server-side client proxy using Firebase Firestore
import { firestoreClient } from "@/integrations/firebase/firestore-client";

export const supabaseAdmin = firestoreClient as any;
