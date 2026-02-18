const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

// 1. Copy public/models/Planet.glb → src/assets/Planet.glb so Vite bundles it (hashed URL = no stale cache)
const srcAssets = path.join(root, "src", "assets");
const modelSrc = path.join(root, "public", "models", "Planet.glb");
const modelDest = path.join(srcAssets, "Planet.glb");
if (fs.existsSync(modelSrc)) {
  if (!fs.existsSync(srcAssets)) fs.mkdirSync(srcAssets, { recursive: true });
  fs.copyFileSync(modelSrc, modelDest);
  console.log("prebuild: copied Planet.glb to src/assets");
} else {
  console.warn("prebuild: public/models/Planet.glb not found");
}

// 2. Remove dist for a clean build
const dist = path.join(root, "dist");
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
  console.log("prebuild: removed dist");
}
