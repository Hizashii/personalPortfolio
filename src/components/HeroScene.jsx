import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Planet } from "./Planet";
import { Float } from "@react-three/drei";

export default function HeroScene({ scale = 0.80 }) {
  return (
    <figure className="absolute inset-0 -z-50" style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          // crucial: correct output color space
          outputColorSpace: THREE.SRGBColorSpace,
          // crucial: tone mapping (prevents blown highlights)
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 1.5]}                 // cap DPR (big perf win too)
        camera={{ position: [0, 0, 10], fov: 17.5, near: 0.1, far: 100 }}
        frameloop="always"
        shadows={false}
      >
        {/* Simple predictable lighting */}
        <ambientLight intensity={0.90} />
        <directionalLight position={[3, -6, -4]} intensity={1.25} />
        <directionalLight position={[2, -2, 10]} intensity={0.65} />

        <Suspense fallback={null}>
          <Float speed={0.35} floatIntensity={0.5}>
            <Planet scale={scale} />
          </Float>
        </Suspense>
      </Canvas>
    </figure>
  );
}
