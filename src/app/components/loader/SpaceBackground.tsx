"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  AdditiveBlending,
  type Material,
  type Mesh,
  type Points,
  type ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import { type MotionValue } from "framer-motion";

/**
 * SpaceBackground — a real 3D cosmic backdrop for the loader scene.
 *
 *   • Dense PlaneGeometry textured with the nebula photo, displaced by an
 *     animated noise field in a custom vertex shader → it slowly "breathes"
 *     and you feel like you're drifting into space (not a flat pasted image).
 *   • A separate Points layer of nearer stars that parallaxes faster.
 *   • Texture is cover-fitted in the shader (like background-size: cover) so
 *     it is never ugly-stretched.
 *
 *  ── Tuning knobs (all in this file) ──────────────────────────────
 *   DISPLACEMENT strength  → NEBULA_STRENGTH (and `uStrength`)
 *   ANIMATION speed        → NEBULA_SPEED (uTime multipliers in the shader)
 *   PARTICLE count         → STAR_COUNT_HI / STAR_COUNT_LO
 *   PARALLAX strength       → handled in Cosmos (CameraRig amount) + drag factor
 *   BLOOM strength          → in Cosmos (<Bloom intensity .../>)
 */

const TEX_PATH = "/textures/space.jpg"; // ← drop a higher-res nebula here to upgrade
// Optional: /textures/space-depth.jpg — not required; displacement is procedural
// noise so the scene never crashes if a depth map is missing.

const NEBULA_STRENGTH = 1.35; // displacement amount (units)
const NEBULA_SPEED = 1; // global breathing-speed multiplier
const STAR_COUNT_HI = 1500;
const STAR_COUNT_LO = 500;

// Plane lives just behind the Earth; sized to comfortably cover the viewport.
const PLANE_W = 110;
const PLANE_H = 73;
const PLANE_Z = -30;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;
  varying float vDisp;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vUv = uv;
    float n  = fbm(uv * 3.0 + uTime * 0.05);
    float n2 = fbm(uv * 6.0 - uTime * 0.03);
    float disp = (n * 0.7 + n2 * 0.3 - 0.5) * uStrength;
    vDisp = disp;
    vec3 pos = position + normal * disp; // plane normal is +Z → depth ripple
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uPlaneAspect;
  uniform float uTexAspect;
  uniform float uFade;
  varying vec2 vUv;
  varying float vDisp;

  void main(){
    // cover-fit (background-size: cover) so the texture is never stretched
    vec2 scale = uPlaneAspect > uTexAspect
      ? vec2(1.0, uTexAspect / uPlaneAspect)
      : vec2(uPlaneAspect / uTexAspect, 1.0);
    vec2 uv = (vUv - 0.5) * scale + 0.5;

    vec3 col = texture2D(uTex, uv).rgb;
    // depth shading from the displacement → crests glow, troughs sink
    col *= 0.58 + vDisp * 0.45;
    // gentle radial falloff so the centre (where Earth sits) stays calm
    float vig = smoothstep(1.15, 0.15, length(vUv - 0.5));
    col *= mix(0.65, 1.05, vig);
    gl_FragColor = vec4(col * uFade, uFade);
  }
`;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// ── Deformed nebula plane ─────────────────────────────────────
function DisplacedNebula({
  lowPower,
  approach,
}: {
  lowPower: boolean;
  approach: MotionValue<number>;
}) {
  const tex = useLoader(TextureLoader, TEX_PATH);
  const matRef = useRef<ShaderMaterial>(null);
  const meshRef = useRef<Mesh>(null);
  const reduced = usePrefersReducedMotion();
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: NEBULA_STRENGTH },
      uTex: { value: tex },
      uPlaneAspect: { value: PLANE_W / PLANE_H },
      uTexAspect: { value: 1.5 },
      uFade: { value: 0 },
    }),
    [tex],
  );

  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
    const img = tex.image as { width?: number; height?: number } | undefined;
    if (img?.width && img?.height) {
      uniforms.uTexAspect.value = img.width / img.height;
    }
    uniforms.uStrength.value = reduced
      ? NEBULA_STRENGTH * 0.25
      : lowPower
        ? NEBULA_STRENGTH * 0.7
        : NEBULA_STRENGTH;
    /* eslint-enable react-hooks/immutability */
  }, [tex, uniforms, reduced, lowPower]);

  useFrame(() => {
    if (!matRef.current || startRef.current === null) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    // breathing — frozen when the user prefers reduced motion
    matRef.current.uniforms.uTime.value = reduced ? 0 : elapsed * NEBULA_SPEED;
    // fade in over ~2s
    const fade = Math.min(1, elapsed / 2);
    matRef.current.uniforms.uFade.value = 1 - Math.pow(1 - fade, 3);
    // eases a touch closer as you dive toward Earth
    if (meshRef.current) {
      meshRef.current.position.z = PLANE_Z + approach.get() * 5;
    }
  });

  const segX = lowPower ? 64 : 150;
  const segY = lowPower ? 44 : 100;

  return (
    <mesh ref={meshRef} position={[0, 0, PLANE_Z]}>
      <planeGeometry args={[PLANE_W, PLANE_H, segX, segY]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Near star particles (parallax depth layer) ────────────────
function NearStars({
  lowPower,
  dragOffset,
}: {
  lowPower: boolean;
  dragOffset: MotionValue<number>;
}) {
  const ref = useRef<Points>(null);
  const spin = useRef(0);
  const startRef = useRef<number | null>(null);
  const count = lowPower ? STAR_COUNT_LO : STAR_COUNT_HI;

  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const state = [0x9e3779b1];
    const rand = () => {
      state[0] = (state[0] * 1664525 + 1013904223) >>> 0;
      return state[0] / 0xffffffff;
    };
    for (let i = 0; i < count; i++) {
      const r = 8 + rand() * 18;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = rand();
      if (t < 0.08) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.84; col[i * 3 + 2] = 0.6;
      } else if (t < 0.16) {
        col[i * 3] = 0.7; col[i * 3 + 1] = 0.82; col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 1;
      }
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || startRef.current === null) return;
    spin.current += delta * 0.006;
    ref.current.rotation.y = spin.current - dragOffset.get() * 0.0009;
    const m = ref.current.material as Material & { opacity?: number };
    const elapsed = (performance.now() - startRef.current) / 1000;
    m.opacity = 0.9 * Math.min(1, elapsed / 2);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default function SpaceBackground({
  lowPower = false,
  dragOffset,
  approach,
}: {
  lowPower?: boolean;
  dragOffset: MotionValue<number>;
  approach: MotionValue<number>;
}) {
  return (
    <group>
      <DisplacedNebula lowPower={lowPower} approach={approach} />
      <NearStars lowPower={lowPower} dragOffset={dragOffset} />
    </group>
  );
}

// ── Subtle camera parallax following the cursor ───────────────
export function CameraRig({ enabled = true }: { enabled?: boolean }) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  useFrame((state) => {
    if (!enabled) return;
    const amt = 0.6; // PARALLAX strength
    state.camera.position.x +=
      (target.current.x * amt - state.camera.position.x) * 0.04;
    state.camera.position.y +=
      (-target.current.y * amt - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
