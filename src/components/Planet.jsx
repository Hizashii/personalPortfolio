import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Bundled with build so the deployed site always uses this file (no cache serving old model)
import modelUrl from "../assets/Planet.glb?url";

export function Planet(props) {
  const wrapperRef = useRef();
  const gltf = useGLTF(modelUrl);

  const processedScene = useMemo(() => {
    if (!gltf.scene) return null;

    const cloned = gltf.scene.clone(true);
    const group = new THREE.Group();
    group.add(cloned);

    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // center at origin
    cloned.position.sub(center);

    // scale
    const maxSize = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5;
    const scale = targetSize / maxSize;
    group.scale.setScalar(scale);

    // face forward
    group.rotation.y = Math.PI ;

    return group;
  }, [gltf.scene]);

  // Drop in once, no loop
  useGSAP(() => {
    if (!wrapperRef.current) return;

    gsap.from(wrapperRef.current.position, {
      y: 5,
      duration: 1.4,
      ease: "power3.out",
    });

    gsap.from(wrapperRef.current.rotation, {
      x: 0.3,
      z: -0.15,
      duration: 1.4,
      ease: "power3.out",
    });
  }, []);

  if (!processedScene) return null;

  return (
    <group ref={wrapperRef} {...props}>
      <primitive object={processedScene} />
    </group>
  );
}

useGLTF.preload(modelUrl);
