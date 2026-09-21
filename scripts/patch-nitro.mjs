import fs from "node:fs";
import path from "node:path";

const vercelNodeRuntime = path.resolve("node_modules/nitro/dist/presets/vercel/runtime/vercel.node.mjs");

if (fs.existsSync(vercelNodeRuntime)) {
  let content = fs.readFileSync(vercelNodeRuntime, "utf-8");
  const target = `\tlet ip;\n\tObject.defineProperty(req.socket, "remoteAddress", { get() {\n\t\tconst h = req.headers["x-forwarded-for"];\n\t\treturn ip ??= h?.split?.(",").shift()?.trim();\n\t} });`;
  
  const replacement = `\tlet ip;\n\ttry {\n\t\tObject.defineProperty(req.socket, "remoteAddress", {\n\t\t\tconfigurable: true,\n\t\t\tget() {\n\t\t\t\tconst h = req.headers["x-forwarded-for"];\n\t\t\t\treturn ip ??= h?.split?.(",").shift()?.trim();\n\t\t\t}\n\t\t});\n\t} catch {}`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(vercelNodeRuntime, content, "utf-8");
    console.log("[patch-nitro] Successfully patched vercel.node.mjs for socket.remoteAddress");
  } else if (content.includes("configurable: true")) {
    console.log("[patch-nitro] vercel.node.mjs is already patched");
  } else {
    console.log("[patch-nitro] Target pattern not found in vercel.node.mjs, checking looser match...");
    const looseMatch = /Object\.defineProperty\(req\.socket,\s*"remoteAddress",\s*\{/;
    if (looseMatch.test(content) && !content.includes("configurable: true")) {
      content = content.replace(looseMatch, `try { Object.defineProperty(req.socket, "remoteAddress", { configurable: true, `);
      content = content.replace(/(\n\t\}\s*\);)/, `$1 } catch {}`);
      fs.writeFileSync(vercelNodeRuntime, content, "utf-8");
      console.log("[patch-nitro] Loosely patched vercel.node.mjs");
    }
  }
} else {
  console.log("[patch-nitro] vercel.node.mjs not found at", vercelNodeRuntime);
}

// Also patch .vercel/output if it exists
const serverFuncIndex = path.resolve(".vercel/output/functions/__server.func/index.mjs");
if (fs.existsSync(serverFuncIndex)) {
  let content = fs.readFileSync(serverFuncIndex, "utf-8");
  if (content.includes('Object.defineProperty(req.socket, "remoteAddress"') && !content.includes("configurable: true")) {
    content = content.replace(
      /Object\.defineProperty\(req\.socket,\s*"remoteAddress",\s*\{/g,
      `try { Object.defineProperty(req.socket, "remoteAddress", { configurable: true, `
    );
    fs.writeFileSync(serverFuncIndex, content, "utf-8");
    console.log("[patch-nitro] Patched .vercel/output/functions/__server.func/index.mjs");
  }
}

// Patch Nitro raw asset loader to prevent Vite's CSS parser from treating transformed raw assets as CSS
const nitroCommonPath = path.resolve("node_modules/nitro/dist/_build/common.mjs");
if (fs.existsSync(nitroCommonPath)) {
  let content = fs.readFileSync(nitroCommonPath, "utf-8");
  const targetPattern = 'code: `import {base64ToUint8Array } from "${HELPER_ID}" \\n export default base64ToUint8Array("${Buffer.from(code, "binary").toString("base64")}")`,';
  if (content.includes(targetPattern) && !content.includes('moduleType: "js", // patched')) {
    content = content.replace(
      targetPattern,
      `code: \`import {base64ToUint8Array } from "\${HELPER_ID}" \\n export default base64ToUint8Array("\${Buffer.from(code, "binary").toString("base64")}")\`, moduleType: "js", // patched`
    );
    // Also patch resolveId so virtual:nitro:raw doesn't end in .css, preventing vite:css plugin from running on it
    content = content.replace(
      'return { id: RESOLVED_PREFIX + resolvedId };',
      'return { id: (RESOLVED_PREFIX + resolvedId).endsWith(".css") ? (RESOLVED_PREFIX + resolvedId + "?raw-asset.js") : (RESOLVED_PREFIX + resolvedId) };'
    );
    // Also patch filter in transform/load to match ?raw-asset.js or strip query
    content = content.replace(
      'promises.readFile(id.slice(18),',
      'promises.readFile(id.slice(18).replace(/\\?raw-asset\\.js$/, ""),'
    );
    content = content.replace(
      'const path = id.slice(18);',
      'const path = id.slice(18).replace(/\\?raw-asset\\.js$/, "");'
    );
    fs.writeFileSync(nitroCommonPath, content, "utf-8");
    console.log("[patch-nitro] Patched nitro common.mjs raw asset transform");
  }
}
