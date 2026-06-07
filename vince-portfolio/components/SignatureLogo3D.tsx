"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Bounds } from "@react-three/drei";
import { useRef, Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function LocalMetalEnvironment() {
  const { gl } = useThree();
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const makeFace = (top: string, middle: string, bottom: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext("2d");
      if (!context) return canvas;

      const gradient = context.createLinearGradient(0, 0, 128, 128);
      gradient.addColorStop(0, top);
      gradient.addColorStop(0.48, middle);
      gradient.addColorStop(1, bottom);
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);

      context.fillStyle = "rgba(255,255,255,0.86)";
      context.fillRect(10, 12, 92, 10);
      context.fillStyle = "rgba(120,150,170,0.55)";
      context.fillRect(34, 76, 82, 8);
      context.fillStyle = "rgba(20,24,28,0.72)";
      context.fillRect(0, 104, 128, 24);

      return canvas;
    };

    const cubeTexture = new THREE.CubeTexture([
      makeFace("#f6f8ff", "#9daebb", "#16191d"),
      makeFace("#eef2f7", "#7d8992", "#0d0f12"),
      makeFace("#ffffff", "#bdc7cf", "#272b30"),
      makeFace("#d9e0e8", "#65717c", "#050607"),
      makeFace("#ffffff", "#a7b8c8", "#111417"),
      makeFace("#ced8e2", "#52606a", "#030405"),
    ]);
    cubeTexture.colorSpace = THREE.SRGBColorSpace;
    cubeTexture.needsUpdate = true;

    const pmrem = new THREE.PMREMGenerator(gl);
    const generatedEnvMap = pmrem.fromCubemap(cubeTexture).texture;
    pmrem.dispose();

    setEnvMap(generatedEnvMap);

    return () => {
      cubeTexture.dispose();
      generatedEnvMap.dispose();
    };
  }, [gl]);

  if (!envMap) return null;
  return <primitive object={envMap} attach="environment" />;
}

function Model({ shouldSpin }: { shouldSpin: boolean }) {
  const { scene } = useGLTF("/vinceonglogo.glb");
  const groupRef = useRef<THREE.Group>(null);

  const scrollRef = useRef(0);

  useEffect(() => {
    // Apply a material to ensure it responds well to lighting
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: 0xc0c0c0, 
          metalness: 1.0, 
          roughness: 0.12,
          clearcoat: 0.55,
          clearcoatRoughness: 0.18,
          envMapIntensity: 1.9,
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
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={1.2} />
        {/* Frontal light so it's completely visible before scrolling */}
        <directionalLight position={[0, 0, 10]} intensity={1.35} />
        <directionalLight position={[10, 10, 10]} intensity={0.7} />
        <directionalLight position={[-8, 4, 6]} intensity={0.35} />
        <LocalMetalEnvironment />
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
