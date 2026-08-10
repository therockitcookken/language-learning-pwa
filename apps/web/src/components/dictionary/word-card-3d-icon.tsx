'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface WordCard3DIconProps {
  word: string;
  color?: string;
  isChinese?: boolean;
}

function Shape({ color, isChinese }: { color: string; isChinese: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Random rotation offset based on the component mounting
  const offset = useMemo(() => Math.random() * Math.PI, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        {isChinese ? (
          <dodecahedronGeometry args={[1.2, 0]} />
        ) : (
          <icosahedronGeometry args={[1.2, 0]} />
        )}
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.2}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

export function WordCard3DIcon({ word, color = "#f97316", isChinese = true }: WordCard3DIconProps) {
  return (
    <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none overflow-hidden rounded-tr-3xl">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color={color} />
        
        <Shape color={color} isChinese={isChinese} />
        
        <Sparkles 
          count={15} 
          scale={3} 
          size={1.5} 
          speed={0.4} 
          opacity={0.3} 
          color={color} 
        />
      </Canvas>
    </div>
  );
}
