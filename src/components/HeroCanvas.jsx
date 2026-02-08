import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Planet } from "./Planet";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const SCENE_BG = "#e5e5e0";

function SceneBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(SCENE_BG);
  }, [scene]);
  return null;
}

/** Calls onReady after the first frame has been drawn (model loaded + painted). */
function SceneReady({ onReady }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady?.();
  });
  return null;
}

/**
 * 3D hero — lazy-loaded. Reveal only after first frame so it appears smoothly (no chop).
 * GLB is preloaded in index.html so it can be ready by the time we need it.
 */
export default function HeroCanvas({ isMobile = false, onReady }) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={false}
      gl={{
        powerPreference: "high-performance",
        antialias: !isMobile,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
    >
      <SceneBackground />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Float speed={0.5}>
          <Planet scale={isMobile ? 0.38 : 1} />
        </Float>
        <SceneReady onReady={onReady} />
      </Suspense>
      <Environment resolution={isMobile ? 64 : 128}>
        <group rotation={[-Math.PI / 3, 4, 1]}>
          <Lightformer
            form="circle"
            intensity={2}
            position={[0, 5, -9]}
            scale={10}
          />
          <Lightformer
            form="circle"
            intensity={2}
            position={[0, 3, 1]}
            scale={10}
          />
          <Lightformer
            form="circle"
            intensity={2}
            position={[-5, -1, -1]}
            scale={10}
          />
          <Lightformer
            form="circle"
            intensity={2}
            position={[10, 1, 0]}
            scale={16}
          />
        </group>
      </Environment>
    </Canvas>
  );
}
