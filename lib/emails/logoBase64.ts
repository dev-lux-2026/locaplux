import fs from "fs";
import path from "path";

// On charge le logo Base64 depuis un fichier externe
export const LOGO_BASE64 = fs.readFileSync(
  path.join(process.cwd(), "lib/emails/logoBase64.txt"),
  "utf8"
);
