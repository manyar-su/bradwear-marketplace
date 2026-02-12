import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

let [major, minor, patch] = pkg.version.split('.').map(Number);

// Logic: increment patch
patch++;

// User rule: "jika sudah ke 10 maka akan menjadi v1.2.0"
// Interpretasi: Jika patch mencapai 10, naikkan minor (+2 sesuai contoh) dan reset patch
if (patch >= 10) {
    minor += 2;
    patch = 0;
}

const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));

console.log(`Version bumped: ${newVersion}`);
