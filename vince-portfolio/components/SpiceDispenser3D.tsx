"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   SPICE DISPENSER 3D MODEL (Procedural)
   Built from Three.js primitives
═══════════════════════════════════════════ */

function BasePlate() {
  return (
    <mesh position={[0, -0.05, 0]}>
      <boxGeometry args={[2.5, 0.1, 2.5]} />
      <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function CylindricalBody() {
  return (
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.6, 0.6, 2.5, 32]} />
      <meshStandardMaterial color="#7a7a7a" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function Hopper({ isOpen }: { isOpen: boolean }) {
  const lidRef = useRef<THREE.Mesh>(null);
  const targetRotation = isOpen ? -Math.PI / 4 : 0;

  useFrame(() => {
    if (lidRef.current) {
      lidRef.current.rotation.z += (targetRotation - lidRef.current.rotation.z) * 0.08;
    }
  });

  return (
    <group position={[0, 3.0, 0]}>
      {/* Funnel body */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.6, 0.6, 32]} />
        <meshStandardMaterial color="#6a6a6a" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.06, 32]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function StepperMotor({ isSpinning, isCalibrating }: { isSpinning: boolean; isCalibrating: boolean }) {
  const shaftRef = useRef<THREE.Mesh>(null);
  const spinProgress = useRef(0);
  const calibrationPhase = useRef(0);
  const calibrationCycles = useRef(0);

  useFrame((_, delta) => {
    if (!shaftRef.current) return;

    if (isSpinning) {
      spinProgress.current += delta * 5.2;
      shaftRef.current.rotation.z = spinProgress.current;
      if (spinProgress.current >= Math.PI * 2) {
        spinProgress.current = 0;
      }
    } else if (isCalibrating) {
      calibrationPhase.current += delta * 3;
      const angle = Math.sin(calibrationPhase.current) * (Math.PI / 36);
      shaftRef.current.rotation.z = angle;

      if (calibrationPhase.current >= Math.PI * 2) {
        calibrationPhase.current = 0;
        calibrationCycles.current++;
      }
    } else {
      shaftRef.current.rotation.z += (0 - shaftRef.current.rotation.z) * 0.05;
      spinProgress.current = 0;
      calibrationPhase.current = 0;
      calibrationCycles.current = 0;
    }
  });

  return (
    <group position={[0.85, 1.2, 0]}>
      {/* Motor body */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Motor shaft */}
      <mesh ref={shaftRef} position={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#999" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.26]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function DispensingSpout() {
  return (
    <group position={[0, 0.15, 0.65]}>
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#6a6a6a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SpiceDispenserModel({
  isSpinning,
  isCalibrating,
  hopperOpen,
}: {
  isSpinning: boolean;
  isCalibrating: boolean;
  hopperOpen: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow idle rotation
  useFrame((_, delta) => {
    if (groupRef.current && !isSpinning && !isCalibrating) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <BasePlate />
      <CylindricalBody />
      <Hopper isOpen={hopperOpen} />
      <StepperMotor isSpinning={isSpinning} isCalibrating={isCalibrating} />
      <DispensingSpout />
    </group>
  );
}

/* ═══════════════════════════════════════════
   EXPORTED 3D VIEWER COMPONENT
═══════════════════════════════════════════ */

export default function SpiceDispenser3D() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hopperOpen, setHopperOpen] = useState(false);
  const [status, setStatus] = useState("IDLE");

  const handleDispense = () => {
    if (isSpinning || isCalibrating) return;
    setIsSpinning(true);
    setStatus("DISPENSING...");
    setTimeout(() => {
      setIsSpinning(false);
      setStatus("DISPENSE COMPLETE");
      setTimeout(() => setStatus("IDLE"), 2000);
    }, 1200);
  };

  const handleCalibrate = () => {
    if (isSpinning || isCalibrating) return;
    setIsCalibrating(true);
    setStatus("CALIBRATING...");
    setTimeout(() => {
      setIsCalibrating(false);
      setStatus("CALIBRATION COMPLETE");
      setTimeout(() => setStatus("IDLE"), 2000);
    }, 3000);
  };

  const handleReset = () => {
    setIsSpinning(false);
    setIsCalibrating(false);
    setHopperOpen(false);
    setStatus("RESET");
    setTimeout(() => setStatus("IDLE"), 1000);
  };

  const handleToggleHopper = () => {
    setHopperOpen(!hopperOpen);
    setStatus(hopperOpen ? "HOPPER CLOSED" : "HOPPER OPENED");
    setTimeout(() => setStatus("IDLE"), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-void border border-steel/30 overflow-hidden viewer-3d line-grid-bg">
        <Canvas
          camera={{ position: [3, 3, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />

          <SpiceDispenserModel
            isSpinning={isSpinning}
            isCalibrating={isCalibrating}
            hopperOpen={hopperOpen}
          />

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={!isSpinning && !isCalibrating}
            autoRotateSpeed={0.5}
          />
          <Environment preset="studio" />
        </Canvas>

        {/* Corner labels */}
        <div className="absolute top-3 left-3 font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-widest pointer-events-none">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "DISPENSE", action: handleDispense, active: isSpinning },
          { label: "CALIBRATE", action: handleCalibrate, active: isCalibrating },
          { label: "RESET", action: handleReset, active: false },
          {
            label: hopperOpen ? "CLOSE HOPPER" : "OPEN HOPPER",
            action: handleToggleHopper,
            active: hopperOpen,
          },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] tracking-wider px-4 py-3 border transition-all duration-200 ${
              btn.active
                ? "border-silver/60 text-chalk bg-steel/40"
                : "border-steel/40 text-silver/60 hover:border-silver/40 hover:text-chalk"
            }`}
          >
            [ {btn.label} ]
          </button>
        ))}
      </div>

      {/* Status LCD Display */}
      <div className="bg-void border border-steel/30 px-5 py-3 flex items-center gap-2">
        <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/40 tracking-widest">
          STATUS:
        </span>
        <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-chalk tracking-widest">
          {status}
        </span>
        <span className="animate-blink text-chalk text-sm ml-0.5">_</span>
      </div>

      {/* Placeholder note */}
      <p className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/25 tracking-widest text-center">
        [ PLACEHOLDER — 3D MODEL TO BE REPLACED WITH ACTUAL CAD EXPORT ]
      </p>
    </div>
  );
}
