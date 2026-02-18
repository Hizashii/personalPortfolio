const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const srcAssets = path.join(root, "src", "assets");
const modelSrc = path.join(root, "public", "models", "Planet.glb");
const modelDest = path.join(srcAssets, "Planet.glb");

if (!fs.existsSync(modelSrc)) {
  console.warn("copy-model: public/models/Planet.glb not found");
  process.exit(0);
}
if (!fs.existsSync(srcAssets)) fs.mkdirSync(srcAssets, { recursive: true });
fs.copyFileSync(modelSrc, modelDest);
console.log("copy-model: Planet.glb → src/assets");
