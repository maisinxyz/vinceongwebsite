"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Bounds, Environment } from "@react-three/drei";
import { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function Model({ shouldSpin }: { shouldSpin: boolean }) {
  const { scene } = useGLTF("/vinceonglogo.glb");
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    // Generate a procedural brushed metal texture.
    // This is CRITICAL for flat geometries (like extruded logos) 
    // to actually catch light and look metallic rather than like flat plastic.
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base color for roughness (mid-grey means somewhat shiny)
      ctx.fillStyle = "#888888"; 
      ctx.fillRect(0, 0, 1024, 1024);
      // Draw thousands of horizontal streaks to simulate brushed silver
      for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 3);
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 3);
      }
    }
    const brushedTexture = new THREE.CanvasTexture(canvas);
    brushedTexture.wrapS = THREE.RepeatWrapping;
    brushedTexture.wrapT = THREE.RepeatWrapping;
    brushedTexture.anisotropy = 16;
    brushedTexture.needsUpdate = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Ensure normals are computed properly for lighting calculations
        child.geometry.computeVertexNormals();
        
        child.material = new THREE.MeshStandardMaterial({
          color: 0xe0e5ec, // Bright silver
          metalness: 1.0, // 100% metal
          roughness: 0.35, // High enough to catch the procedural texture
          roughnessMap: brushedTexture, // Creates anisotropic shine
          bumpMap: brushedTexture, // Physically breaks up the flat face
          bumpScale: 0.002, // Subtle but essential for light catching
          envMapIntensity: 3.5, // High intensity reflections
          transparent: false,
          opacity: 1.0,
        });
        child.material.needsUpdate = true;
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
  const isEducationPage = pathname === "/education" || pathname.startsWith("/education/");
  const isResumePage = pathname === "/resume" || pathname.startsWith("/resume/");
  const shouldSpin = !(isAboutPage || isExperiencePage || isEducationPage || isResumePage);

  return (
    <div className="w-48 h-28 flex items-center justify-center pointer-events-none drop-shadow-[0_8px_24px_rgba(255,255,255,0.4)]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={1.0} />
        {/* Multi-directional colored lights to create dynamic rim lighting as it spins */}
        <directionalLight position={[5, 5, 10]} intensity={2.5} />
        <directionalLight position={[-5, 5, -10]} intensity={1.5} color="#cceeff" />
        <directionalLight position={[0, -5, 5]} intensity={1.0} color="#ffddbb" />
        
        {/* City preset provides high-contrast outdoor reflections perfect for chrome/silver */}
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={0.8}>
            <Model shouldSpin={shouldSpin} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/vinceonglogo.glb");
