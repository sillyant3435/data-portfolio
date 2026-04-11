"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Base particle counts — mobile gets 80% reduction for GPU perf
const PARTICLE_COUNT_DESKTOP = 800;
const PARTICLE_COUNT_MOBILE = 150;

// Sphere radius ranges — mobile gets 40% smaller geometry
const RADIUS_DESKTOP = { min: 1.5, max: 3.0 };
const RADIUS_MOBILE = { min: 0.9, max: 1.8 };

function ParticleSphere({ particleCount, radiusRange, pointSize }: {
  particleCount: number;
  radiusRange: { min: number; max: number };
  pointSize: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const isVisibleRef = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track visibility using Intersection Observer to pause animation when off-screen
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Generate initial particle positions forming a "core" sphere
  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        // Distribute points spherically
        const r = radiusRange.min + Math.random() * (radiusRange.max - radiusRange.min);
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
    }
    // Return both the mutable array and a clean copy of the original positions
    return [pos, new Float32Array(pos)];
  }, [particleCount, radiusRange.min, radiusRange.max]);

  useFrame((state, delta) => {
    // Check if canvas is visible (for battery/GPU performance)
    if (!isVisibleRef.current || !pointsRef.current) return;

    // Respect prefers-reduced-motion for accessibility
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
    // 1. Core behavior: Slowly orbit the center
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;

    // 2. Interaction behavior: React to the cursor
    // Project the normalized 2D mouse coordinates (-1 to 1) onto a 3D plane approximating z=0
    const target = new THREE.Vector3(
      (state.mouse.x * state.viewport.width) / 2,
      (state.mouse.y * state.viewport.height) / 2,
      0
    );
    
    // Convert the target from world space to the rotating space of the points
    pointsRef.current.worldToLocal(target);

    // Get the array. Cast to Float32Array
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // We run a fast CPU-side physics model to disperse and return particles
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];
        
        let curX = positions[i3];
        let curY = positions[i3 + 1];
        let curZ = positions[i3 + 2];
        
        // Distance to target in the localized space
        const dx = target.x - x;
        const dy = target.y - y;
        const dz = target.z - z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        // Dispersion force: Push points away if they are within radius (e.g. 1.2 units)
        const force = Math.max(0, 1.2 - dist); 
        
        if (force > 0) {
            // Apply repulsion vector scaled by force and a damper
            curX -= (dx / dist) * force * 0.1;
            curY -= (dy / dist) * force * 0.1;
            curZ -= (dz / dist) * force * 0.1;
        }
        
        // Elasticity force: Always pull particles back to their original position smoothly
        curX += (x - curX) * 0.05;
        curY += (y - curY) * 0.05;
        curZ += (z - curZ) * 0.05;
        
        positions[i3] = curX;
        positions[i3 + 1] = curY;
        positions[i3 + 2] = curZ;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        color="#00F5FF" // Data-Cyan
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending} // Gives a glowing 'cyber/neon' effect when points overlap
        depthWrite={false}
      />
    </points>
  );
}

export default function DataCore() {
  // Use custom hook instead of duplicate resize listeners
  const isMobile = useMediaQuery("(max-width: 768px)");

  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  const radiusRange = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP;
  const pointSize = isMobile ? 0.01 : 0.015;
  const dpr: [number, number] = isMobile ? [1, 1] : [1, 2];

  return (
    <div className="w-full h-full absolute inset-0 mix-blend-screen opacity-90">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} dpr={dpr}>
        <ParticleSphere 
          particleCount={particleCount} 
          radiusRange={radiusRange} 
          pointSize={pointSize} 
        />
      </Canvas>
    </div>
  );
}
