"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Bounds } from "@react-three/drei";
import { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function Model({ shouldSpin }: { shouldSpin: boolean }) {
  const { scene } = useGLTF("/vinceonglogo.glb");
  const groupRef = useRef<THREE.Group>(null);

  const scrollRef = useRef(0);

  useEffect(() => {
    // Apply a material to ensure it responds well to lighting
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals(); // Guarantee smooth shading
        mesh.material = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, // Pure silver reflection
          metalness: 1.0, 
          roughness: 0.05, // Extremely smooth and shiny
          envMapIntensity: 3.0 // Boost environment reflections dramatically
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!shouldSpin) return;
    
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
      scrollRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [shouldSpin]);

  useFrame(() => {
    if (groupRef.current) {
      if (shouldSpin) {
        // Rotate based on scroll progress
        groupRef.current.rotation.y = scrollRef.current * Math.PI * 2;
      } else {
        // Keep it locked at 0 rotation on the About page
        groupRef.current.rotation.y = 0;
      }
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
  const pathname = usePathname();
  const isAboutPage = pathname === "/about" || pathname.startsWith("/about/");
  const isExperiencePage = pathname === "/experience" || pathname.startsWith("/experience/");
  const shouldSpin = !(isAboutPage || isExperiencePage);

  return (
    <div className="w-48 h-28 flex items-center justify-center pointer-events-none drop-shadow-[0_8px_24px_rgba(255,255,255,0.4)]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        {/* Frontal light so it's completely visible before scrolling */}
        <directionalLight position={[0, 0, 10]} intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Bounds fit clip observe margin={0.8}>
            <Model shouldSpin={shouldSpin} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/vinceonglogo.glb");
