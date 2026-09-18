import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginView } from "@/components/school/login-view";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Little Gems Academy" },
      {
        name: "description",
        content: "Sign in to Little Gems Academy attendance & school management portal.",
      },
      { property: "og:title", content: "Sign in — Little Gems Academy" },
      {
        property: "og:description",
        content: "Sign in to Little Gems Academy attendance & school management portal.",
      },
    ],
  }),
  component: LoginView,
});
