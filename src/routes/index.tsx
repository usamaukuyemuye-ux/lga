import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "@/components/school/login-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Gems Academy — Sign in" },
      {
        name: "description",
        content: "Sign in to Little Gems Academy school attendance and management portal.",
      },
      { property: "og:title", content: "Little Gems Academy — Sign in" },
      {
        property: "og:description",
        content: "Sign in to Little Gems Academy school attendance and management portal.",
      },
    ],
  }),
  component: LoginView,
});
