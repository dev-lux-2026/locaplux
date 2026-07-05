const fs = require("fs");
const path = require("path");

const exts = [".ts", ".tsx", ".js", ".jsx", ".json"];
const ignoreDirs = ["node_modules", ".next", "prisma/migrations", "app/seller_backup", "app/vendors_backup"];

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (!ignoreDirs.some((d) => full.includes(d))) walk(full);
      continue;
    }

    if (!exts.includes(path.extname(full))) continue;

    let content = fs.readFileSync(full, "utf8");
    let updated = content;

    updated = updated.replace(/\bpartnerId\b/g, "partnerId");
    updated = updated.replace(/\bpartner\b/g, "partner");
    updated = updated.replace(/\bpartnerStatus\b/g, "PartnerStatus");
    updated = updated.replace(/\bOrderpartner\b/g, "OrderPartner");
    updated = updated.replace(/\bordersAspartner\b/g, "ordersAsPartner");
    updated = updated.replace(/\/partner\b/g, "/partner");
    updated = updated.replace(/"partner"/g, '"partner"');

    if (updated !== content) {
      fs.writeFileSync(full, updated, "utf8");
      console.log("✔ Updated:", full);
    }
  }
}

walk(process.cwd());
console.log("Migration partner → partner terminée.");
