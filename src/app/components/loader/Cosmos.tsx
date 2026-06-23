"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  type Group,
  type LineSegments,
  type Material,
  type Mesh,
  type ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import { type MotionValue } from "framer-motion";
import SpaceBackground, { CameraRig } from "./SpaceBackground";

/**
 * Loader cosmic scene — interactive 3D Earth with hyperspace-exit entrance.
 *
 *  Entrance (2.5s, ease-out):
 *    - t=0 : everything dark, warp at 5× speed (hyperspace)
 *    - t→1 : warp decelerates to 1×, stars/nebula fade in, Earth dollies
 *            from far-back at scale 0.18 to final position with fade
 *
 *  After entrance:
 *    - Earth rotates from external MotionValue (scroll-velocity boost + hold)
 *    - Drag offset adds manual rotation
 *    - 3 POI markers with hover tooltips, auto-hide when behind globe
 */

const ENTRY_MS = 2500;

// ============================ Entry timer helper ============================
function useEntryProgress() {
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    startRef.current = performance.now();
  }, []);
  return startRef;
}

function entryProgress(startRef: { current: number | null }) {
  if (startRef.current === null) return 0;
  return Math.min((performance.now() - startRef.current) / ENTRY_MS, 1);
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ============================ EARTH ============================
interface EarthProps {
  rotation: MotionValue<number>;
  dragOffset: MotionValue<number>;
  approach: MotionValue<number>; // 0 = far dot, 1 = arrived
}

const EARTH_IMG = "/img/earth%20and%20universe.jpg";

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uFade;
  varying vec2 vUv;
  void main(){
    vec3 col = texture2D(uTex, vUv).rgb;
    // Luminance keys out the black space around the rendered globe, so the real
    // 3D space background shows through — "Earth on Earth, sky on sky".
    float lum = max(col.r, max(col.g, col.b));
    float alpha = smoothstep(0.02, 0.14, lum) * uFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

// The realistic Earth render is composited as a camera-facing billboard with a
// luminance key — a flat globe photo can't be mapped onto a sphere without
// distortion, so we float it in 3D and dolly it in on approach instead.
function EarthSphere({ approach }: EarthProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ShaderMaterial>(null);
  const texture = useLoader(TextureLoader, EARTH_IMG);
  const entry = useEntryProgress();
  const uniforms = useMemo(
    () => ({ uTex: { value: texture }, uFade: { value: 0 } }),
    [texture],
  );

  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    texture.anisotropy = 16;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    /* eslint-enable react-hooks/immutability */
  }, [texture]);

  useFrame(({ clock, camera }) => {
    // Approach drives the dolly: a tiny distant ball → full planet on arrival.
    const a = Math.min(1, Math.max(0, approach.get()));
    const e = easeOut(a);
    if (groupRef.current) {
      groupRef.current.position.z = -26 * (1 - e); // far when a=0
      const s = 0.18 + 0.82 * e; // distant ball → full planet
      groupRef.current.scale.setScalar(s);
      groupRef.current.position.y =
        a >= 0.999 ? Math.sin(clock.elapsedTime * 0.4) * 0.035 : 0;
    }
    // Always face the camera so the render never skews under parallax.
    if (meshRef.current) meshRef.current.lookAt(camera.position);
    if (matRef.current) {
      matRef.current.uniforms.uFade.value = easeOut(entryProgress(entry));
    }
  });

  return (
    <group ref={groupRef}>
      {/* slight x-offset centres the globe disc on the atmosphere glow */}
      <mesh ref={meshRef} position={[-0.08, 0, 0]}>
        <planeGeometry args={[4.2, 2.34]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={EARTH_VERT}
          fragmentShader={EARTH_FRAG}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* subtle atmospheric rim just outside the disc */}
      <AtmosphereLayer scale={1.14} color={[0.3, 0.5, 0.95]} power={3.4} strength={0.45} />
    </group>
  );
}

// ============================ ATMOSPHERE ============================
const ATMOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAG = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  uniform float power;
  uniform float strength;
  uniform float fade;
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
    gl_FragColor = vec4(glowColor * intensity * strength * fade, intensity * fade);
  }
`;

function AtmosphereLayer({
  scale,
  color,
  power,
  strength,
}: {
  scale: number;
  color: [number, number, number];
  power: number;
  strength: number;
}) {
  const entry = useEntryProgress();
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      glowColor: { value: color },
      power: { value: power },
      strength: { value: strength },
      fade: { value: 0 },
    }),
    [color, power, strength],
  );

  useFrame(() => {
    if (matRef.current) {
      // Atmosphere now scales with the planet group, so it's safe to show from
      // the start — a subtle rim that settles in quickly.
      const p = entryProgress(entry);
      matRef.current.uniforms.fade.value = easeOut(Math.min(1, 0.3 + p * 2));
    }
  });

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ATMOSPHERE_VERT}
        fragmentShader={ATMOSPHERE_FRAG}
        uniforms={uniforms}
        blending={AdditiveBlending}
        side={BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================ WARP STREAKS ============================
function WarpStreaks({
  boost,
  count = 180,
}: {
  boost: MotionValue<number>;
  count?: number;
}) {
  const ref = useRef<LineSegments>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 2 * 3);
    const state = [0xabcd1234];
    const rand = () => {
      state[0] = (state[0] * 1664525 + 1013904223) >>> 0;
      return state[0] / 0xffffffff;
    };
    for (let i = 0; i < count; i++) {
      const radius = 2 + rand() * 18;
      const angle = rand() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = -30 + rand() * 38;
      const idx = i * 6;
      arr[idx] = x; arr[idx + 1] = y; arr[idx + 2] = z;
      arr[idx + 3] = x; arr[idx + 4] = y; arr[idx + 5] = z - 0.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Streaks read as throttle: barely drifting when idle, rushing forward as
    // you hold the button and accelerate toward Earth.
    const boostMag = Math.abs(boost.get());
    const speed = delta * (1.2 + boostMag * 12);

    // Faster = longer motion-blur streaks
    const targetLen = 0.5 + boostMag * 2.5;

    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      arr[idx + 2] += speed;
      arr[idx + 5] += speed;
      // Maintain streak length (recompute trailing vertex)
      arr[idx + 5] = arr[idx + 2] - targetLen;

      if (arr[idx + 2] > 8) {
        const radius = 2 + Math.random() * 18;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        arr[idx] = x; arr[idx + 1] = y; arr[idx + 2] = -30;
        arr[idx + 3] = x; arr[idx + 4] = y; arr[idx + 5] = -30 - targetLen;
      }
    }
    attr.needsUpdate = true;

    // Streaks read as forward motion, not a hyperspace flash — keep them dim.
    const m = ref.current.material as Material & { opacity?: number };
    m.opacity = 0.4;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.4}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ============================ ROOT ============================
interface CosmosProps {
  rotation: MotionValue<number>;
  dragOffset: MotionValue<number>;
  boost: MotionValue<number>;
  approach: MotionValue<number>;
  lowPower?: boolean;
}

export default function Cosmos({
  rotation,
  dragOffset,
  boost,
  approach,
  lowPower = false,
}: CosmosProps) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#000004"]} />
      <ambientLight intensity={1} />
      {/* Parallax disabled on touch (no cursor) for performance */}
      <CameraRig enabled={!lowPower} />
      <Suspense fallback={null}>
        <SpaceBackground
          lowPower={lowPower}
          dragOffset={dragOffset}
          approach={approach}
        />
        <WarpStreaks boost={boost} />
        <EarthSphere
          rotation={rotation}
          dragOffset={dragOffset}
          approach={approach}
        />
      </Suspense>
    </Canvas>
  );
}
