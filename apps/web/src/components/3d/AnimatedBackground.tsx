'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function AnimatedBackground() {
  const lightRef1 = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);

  // Animate the point lights to create a dynamic shifting shadow/light effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef1.current) {
      lightRef1.current.position.x = Math.sin(t * 0.5) * 5;
      lightRef1.current.position.z = Math.cos(t * 0.5) * 5;
    }
    if (lightRef2.current) {
      lightRef2.current.position.x = Math.sin(t * 0.3 + Math.PI) * 5;
      lightRef2.current.position.z = Math.cos(t * 0.3 + Math.PI) * 5;
    }
  });

  return (
    <group>
      {/* Dynamic colored lights based on project accent (Orange & Indigo) */}
      <pointLight ref={lightRef1} color="#f97316" intensity={20} distance={15} position={[5, 2, 0]} castShadow />
      <pointLight ref={lightRef2} color="#6366f1" intensity={20} distance={15} position={[-5, -2, 0]} castShadow />
      
      {/* Ambient fill light */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Background Plane to receive shadows */}
      <mesh receiveShadow position={[0, 0, -3]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Floating particles for a premium ambient effect */}
      <Sparkles 
        count={100} 
        scale={12} 
        size={2} 
        speed={0.4} 
        opacity={0.3} 
        color="#f97316" 
      />
      <Sparkles 
        count={100} 
        scale={12} 
        size={1.5} 
        speed={0.2} 
        opacity={0.2} 
        color="#6366f1" 
      />
    </group>
  );
}
