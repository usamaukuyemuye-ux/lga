// Production entrypoint for container deployment
const port = process.env.PORT || 3000;
const host = "0.0.0.0";
process.env.NITRO_PORT = String(port);
process.env.PORT = String(port);
process.env.NITRO_HOST = host;
process.env.HOST = host;

console.log(`Starting production server on ${host}:${port}...`);

await import("./.output/server/index.mjs");

// Ensure event loop remains active
setInterval(() => {}, 1 << 30);
