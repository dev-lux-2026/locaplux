const fs = require("fs");
const path = require("path");

function list(dir, prefix = "") {
  const files = fs.readdirSync(dir);
  let output = "";

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    output += prefix + file + "\n";

    if (stat.isDirectory()) {
      output += list(full, prefix + "  ");
    }
  }

  return output;
}

fs.writeFileSync("arbo.txt", list("."), "utf8");
console.log("Arborescence générée dans arbo.txt");
