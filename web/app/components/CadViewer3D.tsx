"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function AssemblyModel() {
  const { scene } = useGLTF("/cad/assembly.glb");
  const groupRef = useRef<THREE.Group>(null);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#4af",
        wireframe: true,
      });
    }
  });

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef} scale={0.12} position={[0, -1.5, 0]} rotation={[0.3, 0, 0.15]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function CadViewer3D() {
  return (
    <div
      className="relative w-full rounded-xl border border-cyan-900/40 overflow-hidden"
      style={{
        height: "380px",
        background: "radial-gradient(ellipse at center, #0a1628 0%, #060d1a 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,200,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full text-cyan-600 text-sm font-mono">
            Loading 3D model...
          </div>
        }
      >
        <Canvas camera={{ position: [6, 4, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#4488ff" />
          <AssemblyModel />
          <OrbitControls enablePan={false} minDistance={5} maxDistance={20} />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-3 left-4 text-[10px] text-cyan-700 font-mono tracking-wider uppercase">
        Interactive 3D — Drag to rotate · Scroll to zoom
      </div>
      <div className="absolute top-3 right-4 text-[10px] text-cyan-600/60 font-mono">
        경로 2 Assembly
      </div>
    </div>
  );
}
