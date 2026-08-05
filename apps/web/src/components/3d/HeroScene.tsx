'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { BrandLetter3D } from './BrandLetter3D';
import { AnimatedBackground } from './AnimatedBackground';

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <AnimatedBackground />
          <BrandLetter3D />
          
          {/* Subtle contact shadow on the floor to anchor the 3D element */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000" 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
