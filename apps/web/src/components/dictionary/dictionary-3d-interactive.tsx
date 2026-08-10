'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Floating3DWord({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2} position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.25 : 1}
      >
        <dodecahedronGeometry args={[0.7, 0]} />
        <MeshWobbleMaterial
          color={hovered ? '#f97316' : color}
          factor={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#f97316" />

      <Sparkles count={80} scale={12} size={3} speed={0.4} opacity={0.6} color="#fb923c" />

      <Floating3DWord position={[-2.5, 0.5, 0]} color="#38bdf8" label="生產" />
      <Floating3DWord position={[0, -0.5, 1]} color="#f97316" label="QUALITY" />
      <Floating3DWord position={[2.5, 0.8, -0.5]} color="#a855f7" label="安全" />
    </>
  );
}

export function Dictionary3DInteractive() {
  return (
    <div className="w-full h-36 rounded-3xl bg-slate-950/80 border border-slate-800/80 overflow-hidden relative shadow-2xl mb-6 flex items-center justify-between px-6 backdrop-blur-2xl">
      <div className="z-10 max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">THƯ VIỆN THREE.JS 3D CANVAS</span>
        </div>
        <h4 className="text-lg font-black text-white tracking-wide">
          Không Gian Từ Vựng 3D Tương Tác
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Đang hiển thị 20.000 từ Hán ngữ chuẩn 雙字詞 & Anh ngữ kỹ thuật công xưởng được render không gian 3D Three.js real-time.
        </p>
      </div>

      <div className="w-64 h-full absolute right-0 top-0 bottom-0 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene3D />
        </Canvas>
      </div>
    </div>
  );
}
