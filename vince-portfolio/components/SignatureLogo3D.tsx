"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Bounds } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/vinceonglogo.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Apply a material to ensure it responds well to lighting
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0, 
        metalness: 1.0, 
        roughness: 0.15 
      });
    }
  });

  useFrame(() => {
    if (groupRef.current) {
      // Read the scroll position to rotate the logo (similar to the previous effect)
      const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
      const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      
      // Rotate based on scroll progress (0 to 2*PI radians = 0 to 360 deg)
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, -10 * (Math.PI / 180)]}>
        {/* Rotate the mesh 90 degrees around the X-axis to face forward */}
        <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  );
}

export default function SignatureLogo3D() {
  return (
    <div className="w-48 h-28 flex items-center justify-center pointer-events-none drop-shadow-[0_8px_24px_rgba(255,255,255,0.4)]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        {/* Frontal light so it's completely visible before scrolling */}
        <directionalLight position={[0, 0, 10]} intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={0.5} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={0.8}>
            <Model />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/vinceonglogo.glb");
