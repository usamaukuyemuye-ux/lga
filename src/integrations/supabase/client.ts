// Firebase-backed client adapter replacing Lovable Supabase
import { firestoreClient } from "@/integrations/firebase/firestore-client";

// Export the firestoreClient under the familiar 'supabase' interface
export const supabase = firestoreClient as any;
