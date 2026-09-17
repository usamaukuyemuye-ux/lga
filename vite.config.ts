import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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

