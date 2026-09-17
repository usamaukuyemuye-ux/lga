import { defineConfig } from "@lovable.dev/vite-tanstack-config";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

export default defineConfig({
  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : "node-server"),
    vercel: {
      entryFormat: "node",
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});

