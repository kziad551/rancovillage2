"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type BuildingDef = {
  id: string;
  label: string;
  kind: "tower" | "midrise" | "bungalow" | "townhouse" | "gym" | "pool";
  pos: [number, number]; // x, z — y derives from size
  size: [number, number, number];
  setback?: number; // fraction of size used for upper stage
  setbackHeight?: number; // height of upper stage
  href?: string;
  caption?: string;
  grid?: { x: number; y: number };
  color?: string; // base facade color hint
};

const BUILDINGS: BuildingDef[] = [
  {
    id: "apt-a",
    label: "Apartments · Tower",
    kind: "tower",
    pos: [0, 0.4],
    size: [2.4, 5.4, 2.4],
    setback: 0.7,
    setbackHeight: 0.7,
    href: "/apartments",
    caption: "1–3.5 br",
    grid: { x: 5, y: 12 },
    color: "#d6c6a8",
  },
  {
    id: "apt-b",
    label: "Apartments · East Wing",
    kind: "midrise",
    pos: [3.4, -0.7],
    size: [2.0, 3.6, 1.9],
    setback: 0.85,
    setbackHeight: 0.5,
    href: "/apartments",
    caption: "2–3 br",
    grid: { x: 4, y: 9 },
    color: "#cdbd9f",
  },
  {
    id: "apt-c",
    label: "Apartments · West Wing",
    kind: "midrise",
    pos: [-3.4, -0.7],
    size: [2.0, 3.1, 1.9],
    setback: 0.85,
    setbackHeight: 0.5,
    href: "/apartments",
    caption: "1–2 br",
    grid: { x: 4, y: 7 },
    color: "#cdbd9f",
  },
  {
    id: "bun-1",
    label: "Bungalow I",
    kind: "bungalow",
    pos: [-2.6, 3.4],
    size: [1.6, 1.1, 1.6],
    href: "/bungalows",
    caption: "2 br",
    grid: { x: 3, y: 1 },
    color: "#c9a972",
  },
  {
    id: "bun-2",
    label: "Bungalow II",
    kind: "bungalow",
    pos: [-0.5, 3.4],
    size: [1.6, 1.1, 1.6],
    href: "/bungalows",
    caption: "3 br",
    grid: { x: 3, y: 1 },
    color: "#c9a972",
  },
  {
    id: "bun-3",
    label: "Bungalow III",
    kind: "bungalow",
    pos: [1.6, 3.4],
    size: [1.6, 1.1, 1.6],
    href: "/bungalows",
    caption: "4 br",
    grid: { x: 3, y: 1 },
    color: "#c9a972",
  },
  {
    id: "th-1",
    label: "Townhouses I",
    kind: "townhouse",
    pos: [4.6, 2.6],
    size: [1.35, 2.6, 1.35],
    href: "/townhouses",
    caption: "3 br",
    grid: { x: 3, y: 6 },
    color: "#bea380",
  },
  {
    id: "th-2",
    label: "Townhouses II",
    kind: "townhouse",
    pos: [-4.6, 2.6],
    size: [1.35, 2.9, 1.35],
    href: "/townhouses",
    caption: "4 br",
    grid: { x: 3, y: 7 },
    color: "#bea380",
  },
  {
    id: "pool",
    label: "Swimming Pool",
    kind: "pool",
    pos: [0, -3.8],
    size: [3.8, 0.12, 1.9],
    href: "/amenities",
    caption: "25m heated",
  },
  {
    id: "gym",
    label: "Fitness Center",
    kind: "gym",
    pos: [3.9, -3.8],
    size: [1.6, 1.4, 1.3],
    href: "/amenities",
    caption: "24/7",
    grid: { x: 3, y: 3 },
    color: "#b89877",
  },
];

// -----------------------------------------------------------------------------
// Facade texture: warm stone base + window grid with interior glow
// -----------------------------------------------------------------------------
function makeFacadeTexture(gx: number, gy: number, baseHex: string, seed = 0) {
  const W = 256;
  const H = Math.max(128, Math.round(256 * (gy / Math.max(3, gx)) * 1.2));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(baseHex);
  const baseRGB = `${Math.round(base.r * 255)}, ${Math.round(base.g * 255)}, ${Math.round(base.b * 255)}`;

  // vertical gradient base
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(${baseRGB}, 1)`);
  g.addColorStop(0.6, `rgb(${Math.round(base.r * 220)}, ${Math.round(base.g * 220)}, ${Math.round(base.b * 215)})`);
  g.addColorStop(1, `rgb(${Math.round(base.r * 180)}, ${Math.round(base.g * 175)}, ${Math.round(base.b * 165)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // subtle grain
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(255, 230, 190, ${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // floor lines
  for (let y = 1; y < gy; y++) {
    ctx.fillStyle = "rgba(20, 14, 7, 0.35)";
    ctx.fillRect(0, (y / gy) * H - 0.5, W, 1);
  }

  // window grid
  const padX = 16;
  const padY = 16;
  const cellW = (W - padX * 2) / gx;
  const cellH = (H - padY * 2) / gy;
  const winW = cellW * 0.6;
  const winH = cellH * 0.58;

  // pseudo-random lit/dark pattern stable by seed
  const rng = mulberry32(0xabcd ^ seed);

  for (let y = 0; y < gy; y++) {
    for (let x = 0; x < gx; x++) {
      const r = rng();
      const lit = r > 0.38;
      const px = padX + x * cellW + (cellW - winW) / 2;
      const py = padY + y * cellH + (cellH - winH) / 2;

      // window frame
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(px - 1, py - 1, winW + 2, winH + 2);

      if (lit) {
        const intensity = 0.65 + rng() * 0.3;
        const grad = ctx.createRadialGradient(
          px + winW / 2,
          py + winH / 2,
          0,
          px + winW / 2,
          py + winH / 2,
          Math.max(winW, winH)
        );
        grad.addColorStop(0, `rgba(255, 218, 145, ${intensity})`);
        grad.addColorStop(1, `rgba(220, 160, 90, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(px - 6, py - 6, winW + 12, winH + 12);
        ctx.fillStyle = `rgba(255, 218, 150, ${intensity * 0.9})`;
        ctx.fillRect(px, py, winW, winH);
      } else {
        ctx.fillStyle = "rgba(10, 7, 3, 0.85)";
        ctx.fillRect(px, py, winW, winH);
      }
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeEmissiveTexture(gx: number, gy: number, seed = 0) {
  const W = 256;
  const H = Math.max(128, Math.round(256 * (gy / Math.max(3, gx)) * 1.2));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const padX = 16;
  const padY = 16;
  const cellW = (W - padX * 2) / gx;
  const cellH = (H - padY * 2) / gy;
  const winW = cellW * 0.6;
  const winH = cellH * 0.58;
  const rng = mulberry32(0xabcd ^ seed);
  for (let y = 0; y < gy; y++) {
    for (let x = 0; x < gx; x++) {
      const r = rng();
      const px = padX + x * cellW + (cellW - winW) / 2;
      const py = padY + y * cellH + (cellH - winH) / 2;
      if (r > 0.38) {
        const intensity = 0.65 + rng() * 0.3;
        ctx.fillStyle = `rgba(255, 210, 140, ${intensity})`;
        ctx.fillRect(px, py, winW, winH);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -----------------------------------------------------------------------------
// Building component — ref-based hover (no react re-renders)
// -----------------------------------------------------------------------------
function Building({
  b,
  hoveredRef,
  onPick,
}: {
  b: BuildingDef;
  hoveredRef: React.MutableRefObject<string | null>;
  onPick: (b: BuildingDef) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  const baseH = b.size[1];
  const setback = b.setback ?? 1;
  const upperH = b.setbackHeight ?? 0;
  const lowerH = baseH - upperH;

  const facadeTex = useMemo(
    () => (b.grid ? makeFacadeTexture(b.grid.x, b.grid.y, b.color ?? "#cdbd9f", b.id.length * 13) : null),
    [b.grid, b.color, b.id]
  );
  const emissiveTex = useMemo(
    () => (b.grid ? makeEmissiveTexture(b.grid.x, b.grid.y, b.id.length * 13) : null),
    [b.grid, b.id]
  );

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const hovered = hoveredRef.current;
    const isHovered = hovered === b.id;
    const isDim = hovered !== null && !isHovered;

    const targetY = isHovered ? 0.14 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, dt);

    const opTarget = isDim ? 0.3 : 1;
    const emTarget = isHovered ? 1.2 : 0.55;
    matRefs.current.forEach((m) => {
      if (!m) return;
      m.opacity = THREE.MathUtils.damp(m.opacity, opTarget, 8, dt);
      m.transparent = m.opacity < 0.999;
      if (m.emissiveMap) {
        m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, emTarget, 5, dt);
      }
    });
  });

  if (b.kind === "pool") {
    return (
      <group position={[b.pos[0], 0, b.pos[1]]}>
        <Pool size={b.size} />
        <mesh
          position={[0, 0.08, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            hoveredRef.current = b.id;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            if (hoveredRef.current === b.id) hoveredRef.current = null;
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPick(b);
          }}
        >
          <boxGeometry args={[b.size[0] + 0.2, 0.2, b.size[2] + 0.2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[b.pos[0], 0, b.pos[1]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = b.id;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (hoveredRef.current === b.id) hoveredRef.current = null;
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPick(b);
      }}
    >
      {/* plinth / base */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[b.size[0] + 0.3, 0.08, b.size[2] + 0.3]} />
        <meshStandardMaterial color="#1f1812" roughness={0.92} />
      </mesh>

      {/* main volume with facade */}
      <mesh position={[0, 0.08 + lowerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.size[0], lowerH, b.size[2]]} />
        <meshStandardMaterial
          ref={(m) => {
            if (m) matRefs.current[0] = m;
          }}
          map={facadeTex || undefined}
          emissiveMap={emissiveTex || undefined}
          emissive={emissiveTex ? new THREE.Color("#f6c582") : undefined}
          emissiveIntensity={emissiveTex ? 0.6 : 0}
          color={b.color ?? "#cdbd9f"}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      {/* cornice between stages */}
      {upperH > 0.01 && (
        <mesh position={[0, 0.08 + lowerH, 0]} castShadow>
          <boxGeometry args={[b.size[0] + 0.12, 0.05, b.size[2] + 0.12]} />
          <meshStandardMaterial color="#2a2017" roughness={0.6} />
        </mesh>
      )}

      {/* upper stage (setback) */}
      {upperH > 0.01 && (
        <mesh position={[0, 0.08 + lowerH + upperH / 2 + 0.025, 0]} castShadow receiveShadow>
          <boxGeometry args={[b.size[0] * setback, upperH, b.size[2] * setback]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) matRefs.current[1] = m;
            }}
            color={b.color ?? "#cdbd9f"}
            emissive={new THREE.Color("#f6c582")}
            emissiveIntensity={0.25}
            roughness={0.75}
            metalness={0.04}
          />
        </mesh>
      )}

      {/* roof cap */}
      <mesh position={[0, 0.08 + lowerH + upperH + 0.035, 0]}>
        <boxGeometry args={[b.size[0] * setback + 0.18, 0.07, b.size[2] * setback + 0.18]} />
        <meshStandardMaterial color="#181108" roughness={0.7} />
      </mesh>

      {/* tiny rooftop element for scale */}
      <mesh position={[b.size[0] * setback * 0.3, 0.08 + lowerH + upperH + 0.14, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.18]} />
        <meshStandardMaterial color="#2a2017" roughness={0.85} />
      </mesh>

      {/* ground light wash for lit buildings */}
      {emissiveTex && (
        <pointLight
          position={[0, 0.25, 0]}
          color="#f5b870"
          intensity={0.15}
          distance={3.2}
          decay={2}
        />
      )}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Pool with caustics shader
// -----------------------------------------------------------------------------
function Pool({ size }: { size: [number, number, number] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <group>
      {/* pool deck */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[size[0] + 0.6, 0.04, size[2] + 0.6]} />
        <meshStandardMaterial color="#1a130c" roughness={0.95} />
      </mesh>
      {/* water plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
        <planeGeometry args={[size[0], size[2], 1, 1]} />
        <shaderMaterial
          ref={matRef}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float uTime;
            float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p){
              vec2 i = floor(p); vec2 f = fract(p);
              vec2 u = f*f*(3.0-2.0*f);
              return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
                         mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
            }
            void main() {
              vec2 uv = vUv * 7.0;
              float t = uTime * 0.35;
              float a = noise(uv + vec2(t, -t*0.6));
              float b = noise(uv*1.5 + vec2(-t*0.8, t*0.3));
              float c = smoothstep(0.3, 0.9, a*b*1.6);
              vec3 deep = vec3(0.05, 0.20, 0.35);
              vec3 shallow = vec3(0.40, 0.78, 0.92);
              vec3 col = mix(deep, shallow, c*0.75);
              // edge darken
              float d = distance(vUv, vec2(0.5));
              col *= mix(1.0, 0.7, smoothstep(0.35, 0.55, d));
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Palms (procedural with trunk + fronds)
// -----------------------------------------------------------------------------
function Palms({ count = 22 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number; scale: number }[] = [];
    const rng = mulberry32(7);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rng() * 0.2;
      const r = 7.2 + rng() * 1.6;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      arr.push({ pos: [x, 0, z], rot: rng() * Math.PI * 2, scale: 0.85 + rng() * 0.35 });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((c, i) => {
      c.rotation.z = Math.sin(t * 0.6 + i) * 0.025;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group key={i} position={it.pos} rotation={[0, it.rot, 0]} scale={it.scale}>
          {/* trunk */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 1.5, 7]} />
            <meshStandardMaterial color="#5a4630" roughness={0.95} />
          </mesh>
          {/* crown */}
          {Array.from({ length: 7 }).map((_, j) => {
            const a = (j / 7) * Math.PI * 2;
            return (
              <mesh
                key={j}
                position={[Math.cos(a) * 0.2, 1.55, Math.sin(a) * 0.2]}
                rotation={[0.45, a, 0]}
                castShadow
              >
                <coneGeometry args={[0.09, 0.95, 4]} />
                <meshStandardMaterial color="#475644" roughness={1} />
              </mesh>
            );
          })}
          {/* dome crown cap */}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color="#4a5a40" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Ground with walkways
// -----------------------------------------------------------------------------
function Ground() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const ctx = c.getContext("2d")!;
    // warm sand base
    const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 700);
    g.addColorStop(0, "#2a1e12");
    g.addColorStop(0.6, "#1e150c");
    g.addColorStop(1, "#150f08");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
    // noise
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = `rgba(201, 161, 92, ${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
    }
    // walkways (cross)
    ctx.strokeStyle = "rgba(180, 150, 90, 0.25)";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    ctx.lineTo(1024, 512);
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    ctx.stroke();
    // subtle ring
    ctx.beginPath();
    ctx.arc(512, 512, 320, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(180, 150, 90, 0.15)";
    ctx.lineWidth = 3;
    ctx.stroke();
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial map={tex} color="#1a120a" roughness={1} />
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// Camera — soft idle drift, user can orbit; snap to focus on click
// -----------------------------------------------------------------------------
function CameraController({
  focusRef,
}: {
  focusRef: React.MutableRefObject<BuildingDef | null>;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.8, 0));
  const desired = useRef(new THREE.Vector3(0, 0.8, 0));
  const pos = useRef(new THREE.Vector3());
  const returning = useRef(false);

  useFrame((_, dt) => {
    const focus = focusRef.current;
    if (focus) {
      desired.current.set(focus.pos[0], focus.size[1] * 0.6, focus.pos[1]);
      pos.current.set(focus.pos[0] + 2.8, focus.size[1] + 1.6, focus.pos[1] + 2.8);
      camera.position.lerp(pos.current, Math.min(1, 2.4 * dt));
      target.current.lerp(desired.current, Math.min(1, 3 * dt));
      camera.lookAt(target.current);
      returning.current = true;
    } else if (returning.current) {
      target.current.lerp(new THREE.Vector3(0, 0.8, 0), Math.min(1, 2 * dt));
      camera.lookAt(target.current);
      if (target.current.distanceTo(new THREE.Vector3(0, 0.8, 0)) < 0.05) returning.current = false;
    }
  });
  return null;
}

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------
export type CompoundSceneProps = {
  onPick?: (b: BuildingDef) => void;
};

export default function CompoundScene({ onPick }: CompoundSceneProps) {
  const hoveredRef = useRef<string | null>(null);
  const focusRef = useRef<BuildingDef | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handle = (b: BuildingDef) => {
    focusRef.current = b;
    onPick?.(b);
    setTimeout(() => {
      focusRef.current = null;
    }, 1600);
  };

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.3]}
        performance={{ min: 0.5 }}
        camera={{ position: [9, 6.5, 9], fov: 36 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0E0B08"]} />
          <fog attach="fog" args={["#0E0B08", 18, 42]} />

          <ambientLight intensity={0.28} />
          <hemisphereLight args={["#f5cf9a", "#1a2222", 0.25]} />
          <directionalLight
            position={[7, 11, 5]}
            intensity={1.6}
            color="#ffd59a"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={14}
            shadow-camera-bottom={-14}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#6b7f68" />

          <Ground />
          <Palms count={22} />

          {BUILDINGS.map((b) => (
            <Building key={b.id} b={b} hoveredRef={hoveredRef} onPick={handle} />
          ))}

          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.55}
            scale={30}
            blur={2.6}
            far={12}
            resolution={512}
          />

          <Environment preset="sunset" />
          <CameraController focusRef={focusRef} />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={0.32}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.44}
          />

          <HoverOverlayTracker hoveredRef={hoveredRef} overlayRef={overlayRef} buildings={BUILDINGS} />
        </Suspense>
      </Canvas>

      {/* DOM overlay label — follows hovered building */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-ochre/50 bg-ink/90 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ochre opacity-0 backdrop-blur transition-opacity"
        style={{ willChange: "transform, opacity" }}
      >
        <span data-label>—</span>
        <span className="mx-2 text-ivory/30">·</span>
        <span data-caption className="text-ivory/70">—</span>
      </div>

      {/* drag hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ivory/50">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ochre/70" />
        drag to orbit · click a building
      </div>
    </div>
  );
}

function HoverOverlayTracker({
  hoveredRef,
  overlayRef,
  buildings,
}: {
  hoveredRef: React.MutableRefObject<string | null>;
  overlayRef: React.RefObject<HTMLDivElement>;
  buildings: BuildingDef[];
}) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const lastId = useRef<string | null>("__");

  useFrame(() => {
    const el = overlayRef.current;
    if (!el) return;
    const id = hoveredRef.current;

    if (id !== lastId.current) {
      lastId.current = id;
      const b = buildings.find((x) => x.id === id);
      const labelEl = el.querySelector("[data-label]") as HTMLSpanElement | null;
      const capEl = el.querySelector("[data-caption]") as HTMLSpanElement | null;
      if (b && labelEl && capEl) {
        labelEl.textContent = b.label;
        capEl.textContent = b.caption ?? "";
      }
    }

    if (id) {
      const b = buildings.find((x) => x.id === id);
      if (b) {
        v.set(b.pos[0], b.size[1] + 0.55, b.pos[1]);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
        el.style.opacity = "1";
      }
    } else {
      el.style.opacity = "0";
    }
  });

  return null;
}
