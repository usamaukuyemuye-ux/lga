// Script to generate static SPA index.html and .htaccess for Apache/Hostinger public_html
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = 3456;
process.env.PORT = String(PORT);
process.env.NITRO_PORT = String(PORT);
process.env.HOST = "127.0.0.1";
process.env.NITRO_HOST = "127.0.0.1";

console.log("Generating static fallback index.html for Apache/LiteSpeed web servers...");

const server = spawn("node", [".output/server/index.mjs"], {
  env: { ...process.env, PORT: String(PORT), NITRO_PORT: String(PORT) },
  stdio: "inherit",
});

function cleanup() {
  try {
    server.kill();
  } catch {}
}

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function checkReady(attempts = 0) {
  if (attempts > 30) {
    console.error("Timed out waiting for server to launch");
    cleanup();
    process.exit(1);
  }

  http.get(`http://127.0.0.1:${PORT}/`, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      if (res.statusCode === 200 && data.includes("<html")) {
        const outDir = path.resolve(process.cwd(), ".output/public");
        const outFile = path.join(outDir, "index.html");
        fs.writeFileSync(outFile, data, "utf-8");
        console.log(`Successfully generated ${outFile} (${data.length} bytes)`);

        // Also write .htaccess for Hostinger Apache/LiteSpeed SPA fallback and immediate updates
        const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Never cache HTML so updates appear immediately without waiting
<FilesMatch "\\.(html|htm)$">
  <IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </IfModule>
</FilesMatch>
`;
        fs.writeFileSync(path.join(outDir, ".htaccess"), htaccessContent, "utf-8");
        fs.writeFileSync(path.join(process.cwd(), ".htaccess"), htaccessContent, "utf-8");
        fs.writeFileSync(path.join(process.cwd(), "index.html"), data, "utf-8");

        // Keep public/index.html and public/.htaccess fully in sync for web hosts using public_html or public/
        const publicDir = path.resolve(process.cwd(), "public");
        fs.writeFileSync(path.join(publicDir, "index.html"), data, "utf-8");
        fs.writeFileSync(path.join(publicDir, ".htaccess"), htaccessContent, "utf-8");

        // Sync assets directory
        const outAssets = path.join(outDir, "assets");
        const pubAssets = path.join(publicDir, "assets");
        const rootAssets = path.resolve(process.cwd(), "assets");
        if (fs.existsSync(outAssets)) {
          fs.cpSync(outAssets, pubAssets, { recursive: true, force: true });
          fs.cpSync(outAssets, rootAssets, { recursive: true, force: true });
        }

        console.log("Successfully synchronized index.html, .htaccess, and assets across .output/public, public, and root");

        cleanup();
        process.exit(0);
      } else {
        setTimeout(() => checkReady(attempts + 1), 500);
      }
    });
  }).on("error", () => {
    setTimeout(() => checkReady(attempts + 1), 500);
  });
}

setTimeout(() => checkReady(0), 1000);
