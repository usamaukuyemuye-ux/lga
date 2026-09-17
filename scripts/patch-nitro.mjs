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
