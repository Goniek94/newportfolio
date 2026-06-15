"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  type Group,
  type LineSegments,
  type Material,
  type Mesh,
  type Points,
  type ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import { type MotionValue } from "framer-motion";

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

const EARTH_AXIAL_TILT = 0.41; // ~23.5°
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

// ============================ POIs ============================
interface POI {
  name: string;
  lat: number;
  lng: number;
  text: string;
}

const POIS: POI[] = [
  {
    name: "Łódź",
    lat: 51.7592,
    lng: 19.456,
    text: "Home base. Where I architect, code, and deploy.",
  },
  {
    name: "Warsaw",
    lat: 52.2297,
    lng: 21.0122,
    text: "Client meetings, conferences, the Polish tech hub.",
  },
  {
    name: "Łowicz",
    lat: 52.1086,
    lng: 19.9519,
    text: "Roots. Where the work ethic comes from.",
  },
];

function latLngToVec3(lat: number, lng: number, radius: number): Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// ============================ EARTH + MARKERS ============================
interface EarthProps {
  rotation: MotionValue<number>;
  dragOffset: MotionValue<number>;
  approach: MotionValue<number>; // 0 = far dot, 1 = arrived
}

function POIMarker({
  poi,
  visibleNow,
}: {
  poi: POI;
  visibleNow: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [onFront, setOnFront] = useState(true);
  const pos = useMemo(() => latLngToVec3(poi.lat, poi.lng, 1.01), [poi]);
  const worldPosTmp = useMemo(() => new Vector3(), []);
  const cameraDirTmp = useMemo(() => new Vector3(), []);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(worldPosTmp);
    cameraDirTmp.copy(camera.position).normalize();
    const facing = worldPosTmp.clone().normalize().dot(cameraDirTmp) > 0.05;
    if (facing !== onFront) setOnFront(facing);
  });

  if (!visibleNow) return null;

  return (
    <group ref={groupRef} position={pos}>
      <mesh
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color="#FFE082" toneMapped={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={hovered ? 0.55 : 0.25}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {hovered && onFront && (
        <Html
          position={[0, 0.08, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(8, 8, 12, 0.94)",
              border: "1px solid rgba(212, 175, 55, 0.55)",
              borderRadius: "10px",
              padding: "14px 20px",
              minWidth: "260px",
              maxWidth: "320px",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.18)",
              backdropFilter: "blur(8px)",
              transform: "translateY(-8px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#D4AF37",
                  boxShadow: "0 0 10px #D4AF37",
                }}
              />
              <div
                style={{
                  color: "#D4AF37",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                {poi.name}
              </div>
            </div>
            <div
              style={{
                color: "#e0e0e0",
                fontFamily: "var(--font-geist-sans), system-ui",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {poi.text}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function EarthSphere({ rotation, dragOffset, approach }: EarthProps) {
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const mainRef = useRef<Mesh>(null);
  const bloomRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, "/img/Ziemia.png");
  const entry = useEntryProgress();
  const [markersVisible, setMarkersVisible] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    texture.anisotropy = 16;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    /* eslint-enable react-hooks/immutability */
  }, [texture]);

  useFrame(({ clock }) => {
    // Surface rotation: scroll/hold base + drag offset
    const rad = ((rotation.get() + dragOffset.get()) * Math.PI) / 180;
    if (innerRef.current) innerRef.current.rotation.y = rad;

    // Position is driven by APPROACH (0 = far away dot, 1 = arrived). The user
    // holds the button to close the distance and "return to Earth".
    const a = Math.min(1, Math.max(0, approach.get()));
    const e = easeOut(a);
    if (groupRef.current) {
      groupRef.current.position.z = -26 * (1 - e); // far when a=0
      const s = 0.1 + 0.9 * e; // tiny dot → full planet
      groupRef.current.scale.setScalar(s);
      const bob = a >= 0.999 ? Math.sin(clock.elapsedTime * 0.4) * 0.035 : 0;
      groupRef.current.position.y = bob;
    }

    // Reveal POI markers once we're basically docked.
    if (!markersVisible && a > 0.82) setMarkersVisible(true);

    // Texture fades in with the scene materialising (time-based), so the far
    // dot is visible from the first frames without a hard pop.
    const sceneFade = easeOut(entryProgress(entry));
    if (mainRef.current) {
      const m = mainRef.current.material as Material & { opacity?: number };
      m.transparent = true;
      m.opacity = sceneFade;
    }
    if (bloomRef.current) {
      const m = bloomRef.current.material as Material & { opacity?: number };
      m.opacity = 0.22 * sceneFade;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef} rotation={[EARTH_AXIAL_TILT, 0, 0]}>
        <mesh ref={mainRef}>
          <sphereGeometry args={[1, 128, 128]} />
          {/* color multiplies the texture → dims the (otherwise unlit) globe */}
          <meshBasicMaterial map={texture} transparent color="#7d7d7d" />
        </mesh>
        {/* Bloom pass — child of innerRef so it rides with rotation (NO extra rotation set!) */}
        <mesh ref={bloomRef} scale={1.012}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.22}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {POIS.map((poi) => (
          <POIMarker key={poi.name} poi={poi} visibleNow={markersVisible} />
        ))}
      </group>

      {/* Atmosphere rides INSIDE the planet group so it scales/dollies with the
          Earth — a tight rim glow, never a giant central halo. */}
      <AtmosphereLayer scale={1.18} color={[0.2, 0.45, 0.95]} power={3.6} strength={0.65} />
      <AtmosphereLayer scale={1.05} color={[0.45, 0.7, 1.0]} power={6} strength={1.05} />
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

// ============================ NEBULA ============================
const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float time;
  uniform float fade;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      f += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv * 3.0 + vec2(time * 0.012, time * 0.005);
    float n1 = fbm(uv);
    float n2 = fbm(uv * 1.6 + 5.0);

    // Two coloured cloud banks: cool blue on the left, magenta/rose on the right.
    vec3 blue = vec3(0.10, 0.24, 0.70);
    vec3 cyan = vec3(0.12, 0.45, 0.78);
    vec3 magenta = vec3(0.62, 0.14, 0.48);
    vec3 rose = vec3(0.78, 0.24, 0.32);
    vec3 left = mix(blue, cyan, n2);
    vec3 right = mix(magenta, rose, n2);
    vec3 col = mix(left, right, smoothstep(0.25, 0.75, vUv.x));
    col = mix(col * 0.5, col, n1); // brightness variation

    // Cloud density across the whole (viewport-sized) plane, fading at top/bottom
    // and dimmed a touch in the centre where Earth sits.
    float clouds = smoothstep(0.22, 0.80, n1 * 0.65 + n2 * 0.35);
    float vert = 1.0 - smoothstep(0.5, 1.0, abs(vUv.y - 0.5) * 2.0);
    float centerDim = 0.45 + 0.55 * smoothstep(0.0, 0.32, abs(vUv.x - 0.5));
    float density = clouds * 0.95 * vert * centerDim * fade;
    gl_FragColor = vec4(col * density, density);
  }
`;

function Nebula() {
  const matRef = useRef<ShaderMaterial>(null);
  const entry = useEntryProgress();
  const uniforms = useMemo(
    () => ({ time: { value: 0 }, fade: { value: 0 } }),
    [],
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.elapsedTime;
      matRef.current.uniforms.fade.value = easeOut(entryProgress(entry));
    }
  });

  // Plane sized to roughly fill the viewport at this depth, so its full UV maps
  // to the screen (blue left → magenta right actually shows).
  return (
    <mesh position={[0, 0, -30]}>
      <planeGeometry args={[64, 36]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={NEBULA_VERT}
        fragmentShader={NEBULA_FRAG}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

// ============================ DISTANT STARS ============================
function DistantStars({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<Points>(null);
  const entry = useEntryProgress();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const state = [0x9e3779b1];
    const rand = () => {
      state[0] = (state[0] * 1664525 + 1013904223) >>> 0;
      return state[0] / 0xffffffff;
    };
    for (let i = 0; i < count; i++) {
      const r = 15 + rand() * 25;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const tint = rand();
      if (tint < 0.07) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.82; col[i * 3 + 2] = 0.58;
      } else if (tint < 0.14) {
        col[i * 3] = 0.72; col[i * 3 + 1] = 0.82; col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 1;
      }
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.005;
    const m = pointsRef.current.material as Material & { opacity?: number };
    m.opacity = 0.92 * easeOut(entryProgress(entry));
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
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

// ============================ DISTANT PLANETS ============================
/** A far-off planet/moon, lit from one side for a crescent terminator. */
function DistantPlanet({
  position,
  radius,
  color,
  emissive = "#000000",
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive?: string;
}) {
  const ref = useRef<Mesh>(null);
  const entry = useEntryProgress();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.02;
    const m = ref.current.material as Material & { opacity?: number };
    m.transparent = true;
    m.opacity = easeOut(entryProgress(entry));
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.25}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function DistantPlanets() {
  return (
    <group>
      {/* grey moon, lower-left */}
      <DistantPlanet position={[-5.2, -2.6, -7]} radius={0.95} color="#8a8d93" />
      {/* rust-red planet, upper-right */}
      <DistantPlanet position={[6.4, 2.6, -9]} radius={0.8} color="#8a4a32" emissive="#3a1606" />
      {/* tiny pale moon, far upper-left */}
      <DistantPlanet position={[-7.5, 3.4, -12]} radius={0.45} color="#b9bcc4" />
    </group>
  );
}

// ============================ COMETS ============================
/** A handful of shooting stars streaking diagonally with warm tails. */
function Comets({ count = 6 }: { count?: number }) {
  const ref = useRef<LineSegments>(null);
  const entry = useEntryProgress();

  const { positions, vel } = useMemo(() => {
    const pos = new Float32Array(count * 2 * 3);
    const v = new Float32Array(count * 2);
    const state = [0x1234fee1];
    const rand = () => {
      state[0] = (state[0] * 1664525 + 1013904223) >>> 0;
      return state[0] / 0xffffffff;
    };
    for (let i = 0; i < count; i++) {
      const x = -14 + rand() * 28;
      const y = -8 + rand() * 16;
      const z = -6 - rand() * 8;
      const len = 0.8 + rand() * 1.6;
      const idx = i * 6;
      pos[idx] = x; pos[idx + 1] = y; pos[idx + 2] = z;
      pos[idx + 3] = x - len; pos[idx + 4] = y - len * 0.45; pos[idx + 5] = z;
      v[i * 2] = 3 + rand() * 4; // speed
      v[i * 2 + 1] = len;
    }
    return { positions: pos, vel: v };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      const speed = vel[i * 2];
      const len = vel[i * 2 + 1];
      const dx = speed * delta;
      const dy = speed * 0.45 * delta;
      arr[idx] += dx; arr[idx + 1] += dy;
      arr[idx + 3] += dx; arr[idx + 4] += dy;
      // recycle off the right/top edge → back to lower-left
      if (arr[idx] > 16 || arr[idx + 1] > 10) {
        const nx = -16 - Math.random() * 4;
        const ny = -10 + Math.random() * 6;
        arr[idx] = nx; arr[idx + 1] = ny;
        arr[idx + 3] = nx - len; arr[idx + 4] = ny - len * 0.45;
      }
    }
    attr.needsUpdate = true;
    const m = ref.current.material as Material & { opacity?: number };
    m.opacity = 0.85 * easeOut(entryProgress(entry));
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffcf8a"
        transparent
        opacity={0}
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
}

export default function Cosmos({
  rotation,
  dragOffset,
  boost,
  approach,
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
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000004"]} />
      {/* Low ambient + one key light so the distant planets get a crescent
          terminator. Earth/atmosphere/stars use unlit materials, unaffected. */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[-6, 4, 5]} intensity={2.2} color="#fff4e0" />
      <Suspense fallback={null}>
        <Nebula />
        <DistantStars />
        <DistantPlanets />
        <Comets />
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
