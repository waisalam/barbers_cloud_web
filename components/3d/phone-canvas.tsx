"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { drawScene, type SceneIndex } from "./scene-drawings";

// Defined outside component — never recreated
const EMISSIVE_WHITE = new THREE.Color(1, 1, 1);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Runs after mount to configure the renderer without polluting the gl constructor arg
function SceneSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = null;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
  }, [scene, gl]);
  return null;
}

interface PhoneModelProps {
  progressRef: React.MutableRefObject<number>;
  autoPlay: boolean;
}

function PhoneModel({ progressRef, autoPlay }: PhoneModelProps) {
  const groupRef    = useRef<THREE.Group>(null);
  const sceneIdxRef = useRef<SceneIndex>(0);
  const autoTimeRef = useRef(0);

  // useState lazy initializer runs synchronously on first render, client-only.
  // React Strict Mode preserves state across fake unmount/remount, unlike useEffect.
  // This guarantees the texture exists on frame 1 — no blank flash.
  const [screenTexture] = useState<THREE.CanvasTexture>(() => {
    const canvas = document.createElement("canvas");
    canvas.width  = 512;
    canvas.height = 1024;
    drawScene(canvas, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  });

  // Dispose only on true unmount
  useEffect(() => {
    return () => { screenTexture.dispose(); };
  }, [screenTexture]);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    let t: number;
    if (autoPlay) {
      autoTimeRef.current += delta * 0.12;
      t = autoTimeRef.current % 1;
    } else {
      t = progressRef.current;
    }

    let targetRotY: number, targetRotX: number, targetPosY: number, targetScale: number;
    if (t < 0.33) {
      const p = t / 0.33;
      targetRotY  = lerp(0.45, 0.05, p);
      targetRotX  = lerp(-0.06, -0.02, p);
      targetPosY  = lerp(0, 0.08, p);
      targetScale = lerp(1.0, 1.02, p);
    } else if (t < 0.66) {
      const p = (t - 0.33) / 0.33;
      targetRotY  = lerp(0.05, -0.12, p);
      targetRotX  = lerp(-0.02, 0.02, p);
      targetPosY  = lerp(0.08, 0, p);
      targetScale = lerp(1.02, 1.04, p);
    } else {
      const p = (t - 0.66) / 0.34;
      targetRotY  = lerp(-0.12, 0, p);
      targetRotX  = lerp(0.02, 0.06, p);
      targetPosY  = lerp(0, -0.06, p);
      targetScale = lerp(1.04, 1.0, p);
    }

    const speed = Math.min(delta * 4, 1);
    group.rotation.y += (targetRotY  - group.rotation.y) * speed;
    group.rotation.x += (targetRotX  - group.rotation.x) * speed;
    group.position.y += (targetPosY  - group.position.y) * speed;
    group.scale.setScalar(group.scale.x + (targetScale - group.scale.x) * speed);

    const newScene: SceneIndex = t < 0.33 ? 0 : t < 0.66 ? 1 : 2;
    if (newScene !== sceneIdxRef.current) {
      sceneIdxRef.current = newScene;
      const canvas = screenTexture.image as HTMLCanvasElement;
      if (canvas) {
        drawScene(canvas, newScene);
        screenTexture.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Phone body */}
      <RoundedBox args={[1.12, 2.28, 0.115]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial
          color="#0d0d0d"
          metalness={0.88}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </RoundedBox>

      {/* Inner frame — subtle depth ring */}
      <RoundedBox args={[1.06, 2.22, 0.118]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={0.25}
        />
      </RoundedBox>

      {/* Screen — texture available from frame 1 via useState lazy init */}
      <mesh position={[0, 0.04, 0.059]}>
        <planeGeometry args={[0.92, 1.96]} />
        <meshStandardMaterial
          map={screenTexture}
          emissiveMap={screenTexture}
          emissive={EMISSIVE_WHITE}
          emissiveIntensity={0.35}
          roughness={0.06}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic Island */}
      <RoundedBox args={[0.28, 0.068, 0.008]} radius={0.034} smoothness={4} position={[0, 1.02, 0.062]}>
        <meshBasicMaterial color="#000000" />
      </RoundedBox>

      {/* Camera module (back) */}
      <RoundedBox args={[0.32, 0.30, 0.022]} radius={0.06} smoothness={4} position={[0.17, 0.84, -0.072]}>
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.25} metalness={0.7} />
      </RoundedBox>

      {/* Camera lenses */}
      {([[0.06, 0.91], [0.22, 0.84], [0.06, 0.77]] as [number, number][]).map(([lx, ly], i) => (
        <group key={i} position={[lx, ly, -0.082]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.012, 24]} />
            <meshPhysicalMaterial color="#0f0f1a" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0, 0.007]}>
            <cylinderGeometry args={[0.042, 0.042, 0.006, 24]} />
            <meshPhysicalMaterial color="#111122" metalness={0.99} roughness={0.02} />
          </mesh>
        </group>
      ))}

      {/* Side buttons */}
      <RoundedBox args={[0.038, 0.22, 0.044]} radius={0.012} smoothness={2} position={[0.577, 0.18, 0]}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.038, 0.18, 0.044]} radius={0.012} smoothness={2} position={[-0.577, 0.5, 0]}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.038, 0.18, 0.044]} radius={0.012} smoothness={2} position={[-0.577, 0.2, 0]}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Home indicator */}
      <RoundedBox args={[0.28, 0.018, 0.003]} radius={0.009} smoothness={2} position={[0, -0.92, 0.062]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </RoundedBox>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[3.5, 8, 5]} intensity={3.2} color="#ffeedd" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 2, -2]} intensity={8} color="#4466ff" />
      <pointLight position={[0, -4, 3]} intensity={2} color="#ff8833" />
      <pointLight position={[0, 6, -1]} intensity={1.5} color="#ffffff" />
      <pointLight position={[2, 1, 2]} intensity={1} color="#ffd700" />
    </>
  );
}

interface PhoneCanvasProps {
  progressRef: React.MutableRefObject<number>;
  autoPlay?: boolean;
}

export default function PhoneCanvas({ progressRef, autoPlay = false }: PhoneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 40 }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <SceneSetup />
      <Suspense fallback={null}>
        <Lighting />
        <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.18} floatingRange={[-0.06, 0.06]}>
          <PhoneModel progressRef={progressRef} autoPlay={autoPlay} />
        </Float>
      </Suspense>
    </Canvas>
  );
}
