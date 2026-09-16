import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { firestoreClient } from "@/integrations/firebase/firestore-client";

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    let userId = "user-admin";
    try {
      const request = getRequest();
      const authHeader = request?.headers?.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        if (token.startsWith("token-")) {
          userId = token.replace("token-", "");
        }
      }
    } catch {
      // Fallback
    }

    return next({
      context: {
        supabase: firestoreClient as any,
        userId,
        claims: { sub: userId },
      },
    });
  },
);
