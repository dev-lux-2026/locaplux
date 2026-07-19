const fs = require("fs");
const path = require("path");

const apiDir = path.join(process.cwd(), "app", "api");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const handlers = ["GET", "POST", "PATCH", "DELETE"];

  handlers.forEach((handler) => {
    const regex = new RegExp(
      `export\\s+async\\s+function\\s+${handler}\\s*\\(([^)]*)\\)`,
      "g"
    );

    content = content.replace(regex, (match, params) => {
      if (params.includes("Request")) return match;

      if (params.includes("{")) {
        return `export async function ${handler}(req, context)`;
      }

      return `export async function ${handler}(req)`;
    });
  });

  fs.writeFileSync(filePath, content, "utf8");
  console.log("✔ Fixed:", filePath);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

console.log("🔧 Fixing API route types...");
walk(apiDir);
console.log("✅ All API routes processed.");
