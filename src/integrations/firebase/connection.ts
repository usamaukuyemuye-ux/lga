import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function testConnection() {
  try {
    await getDoc(doc(db, "test", "connection"));
  } catch (error) {
    // Gracefully ignore offline or initializing states; Firestore operates smoothly offline
    if (error instanceof Error) {
      if (error.message.includes("offline") || error.message.includes("unavailable")) {
        console.info("Firestore is synchronizing or operating in offline cache mode.");
      } else {
        console.warn("Firestore connection check note:", error.message);
      }
    }
  }
}
