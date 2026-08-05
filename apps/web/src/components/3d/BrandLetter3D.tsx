'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Text, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

export function BrandLetter3D() {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Subtle pulsing animation for the material emission
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime();
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float
        speed={2} // Animation speed, defaults to 1
        rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
        floatIntensity={0.5} // Up/down float intensity
        floatingRange={[-0.1, 0.1]} 
      >
        <Center position={[0, 0.5, 0]}>
          <Text3D
            font="/fonts/gentilis_regular.typeface.json"
            size={3.5}
            height={0.4}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={16}
          >
            A
            <meshPhysicalMaterial
              ref={materialRef}
              color="#f8fafc"
              emissive="#f97316" // Orange accent
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.8}
              transmission={0.5} // Glass-like
              thickness={1.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text3D>
        </Center>

        {/* Serif subtitle overlaying or underneath the 3D letter */}
        <Center position={[0, -2, 0.5]}>
          <Text
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWbn2PKw.woff" // Elegant serif font
            fontSize={0.5}
            letterSpacing={0.2}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            L A N G U A G E
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </Text>
        </Center>
      </Float>
    </group>
  );
}
