"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, Vignette, SMAA } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------
export type BuildingDef = {
  id: string;
  label: string;
  kind: "tower" | "midrise" | "bungalow" | "townhouse" | "gym" | "pool";
  pos: [number, number];
  size: [number, number, number];
  setback?: number;
  setbackHeight?: number;
  href?: string;
  caption?: string;
  grid?: { x: number; y: number };
  color?: string;
  balconies?: boolean;
  frontFace?: "north" | "south" | "east" | "west";
};

const BUILDINGS: BuildingDef[] = [
  {
    id: "apt-a",
    label: "Apartments · Tower",
    kind: "tower",
    pos: [0, 0.4],
    size: [2.4, 5.4, 2.4],
    setback: 0.72,
    setbackHeight: 0.7,
    href: "/apartments",
    caption: "1–3.5 br",
    grid: { x: 5, y: 12 },
    color: "#d8c6a4",
    balconies: true,
    frontFace: "south",
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
    balconies: true,
    frontFace: "west",
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
    balconies: true,
    frontFace: "east",
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
    balconies: true,
    frontFace: "west",
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
    balconies: true,
    frontFace: "east",
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
// Texture helpers
// -----------------------------------------------------------------------------
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFacadeTexture(gx: number, gy: number, baseHex: string, seed = 0) {
  const W = 256;
  const H = Math.max(128, Math.round(256 * (gy / Math.max(3, gx)) * 1.2));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const base = new THREE.Color(baseHex);

  // vertical gradient base
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgb(${base.r * 255 | 0}, ${base.g * 255 | 0}, ${base.b * 255 | 0})`);
  g.addColorStop(0.6, `rgb(${base.r * 220 | 0}, ${base.g * 220 | 0}, ${base.b * 215 | 0})`);
  g.addColorStop(1, `rgb(${base.r * 180 | 0}, ${base.g * 175 | 0}, ${base.b * 165 | 0})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // stone grain
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = `rgba(255, 230, 190, ${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(20, 14, 7, ${Math.random() * 0.12})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1);
  }

  // floor lines
  for (let y = 1; y < gy; y++) {
    ctx.fillStyle = "rgba(12, 8, 4, 0.45)";
    ctx.fillRect(0, (y / gy) * H - 0.5, W, 1);
  }

  // windows
  const padX = 16;
  const padY = 18;
  const cellW = (W - padX * 2) / gx;
  const cellH = (H - padY * 2) / gy;
  const winW = cellW * 0.62;
  const winH = cellH * 0.58;

  const rng = mulberry32(0xabcd ^ seed);

  for (let y = 0; y < gy; y++) {
    for (let x = 0; x < gx; x++) {
      const r = rng();
      const lit = r > 0.36;
      const px = padX + x * cellW + (cellW - winW) / 2;
      const py = padY + y * cellH + (cellH - winH) / 2;

      // sill shadow under each window
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(px - 2, py + winH - 1, winW + 4, 3);

      // window frame
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(px - 1, py - 1, winW + 2, winH + 2);

      if (lit) {
        const intensity = 0.7 + rng() * 0.25;
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
        ctx.fillStyle = `rgba(255, 218, 150, ${intensity * 0.92})`;
        ctx.fillRect(px, py, winW, winH);
      } else {
        ctx.fillStyle = "rgba(10, 7, 3, 0.88)";
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
  const padY = 18;
  const cellW = (W - padX * 2) / gx;
  const cellH = (H - padY * 2) / gy;
  const winW = cellW * 0.62;
  const winH = cellH * 0.58;
  const rng = mulberry32(0xabcd ^ seed);
  for (let y = 0; y < gy; y++) {
    for (let x = 0; x < gx; x++) {
      const r = rng();
      const px = padX + x * cellW + (cellW - winW) / 2;
      const py = padY + y * cellH + (cellH - winH) / 2;
      if (r > 0.36) {
        const intensity = 0.7 + rng() * 0.25;
        ctx.fillStyle = `rgba(255, 212, 145, ${intensity})`;
        ctx.fillRect(px, py, winW, winH);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// -----------------------------------------------------------------------------
// Building component
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
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

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

  const baseColor = useMemo(() => new THREE.Color(b.color ?? "#cdbd9f"), [b.color]);
  const dimColor = useMemo(() => baseColor.clone().multiplyScalar(0.32), [baseColor]);

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const hovered = hoveredRef.current;
    const isHovered = hovered === b.id;
    const isDim = hovered !== null && !isHovered;

    const targetY = isHovered ? 0.14 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, dt);

    const emTarget = isHovered ? 1.3 : 0.6;
    const factor = Math.min(1, 6 * dt);
    matRefs.current.forEach((m) => {
      if (!m) return;
      m.color.lerp(isDim ? dimColor : baseColor, factor);
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
          position={[0, 0.1, 0]}
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
          <boxGeometry args={[b.size[0] + 0.3, 0.3, b.size[2] + 0.3]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    );
  }

  // precompute balcony slab positions based on frontFace
  const balconyOffsets = useMemo(() => {
    if (!b.balconies) return [];
    const floors = b.grid?.y ?? 0;
    const lowerFloors = Math.floor(floors * (lowerH / baseH));
    const out: { y: number; side: [number, number, number]; normal: [number, number, number] }[] = [];
    const floorStep = lowerH / Math.max(1, lowerFloors);
    // position projecting slab on front face
    const f = b.frontFace ?? "south";
    const fx = b.size[0];
    const fz = b.size[2];
    for (let i = 1; i < lowerFloors; i++) {
      const y = 0.08 + i * floorStep - 0.04;
      if (f === "south") out.push({ y, side: [fx * 0.85, 0.06, 0.35], normal: [0, 0, fz / 2 + 0.15] });
      else if (f === "north") out.push({ y, side: [fx * 0.85, 0.06, 0.35], normal: [0, 0, -(fz / 2 + 0.15)] });
      else if (f === "east") out.push({ y, side: [0.35, 0.06, fz * 0.85], normal: [fx / 2 + 0.15, 0, 0] });
      else if (f === "west") out.push({ y, side: [0.35, 0.06, fz * 0.85], normal: [-(fx / 2 + 0.15), 0, 0] });
    }
    return out;
  }, [b.balconies, b.grid, b.size, b.frontFace, lowerH, baseH]);

  // water tanks + rooftop clutter for buildings with roofs
  const roofY = 0.08 + lowerH + upperH + 0.075;
  const hasRooftopKit = b.kind === "tower" || b.kind === "midrise" || b.kind === "townhouse";

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

      {/* main volume */}
      <mesh position={[0, 0.08 + lowerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.size[0], lowerH, b.size[2]]} />
        <meshStandardMaterial
          ref={(m) => {
            matRefs.current[0] = m;
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

      {/* balcony slabs */}
      {balconyOffsets.map((s, i) => (
        <group key={i}>
          <mesh position={[s.normal[0], s.y, s.normal[2]]} castShadow>
            <boxGeometry args={s.side} />
            <meshStandardMaterial color="#e8ddca" roughness={0.75} />
          </mesh>
          {/* railing top rail */}
          <mesh position={[s.normal[0], s.y + 0.18, s.normal[2]]}>
            <boxGeometry args={[s.side[0] - 0.05, 0.02, s.side[2] - 0.05]} />
            <meshStandardMaterial color="#2d241a" roughness={0.5} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* cornice */}
      {upperH > 0.01 && (
        <mesh position={[0, 0.08 + lowerH, 0]} castShadow>
          <boxGeometry args={[b.size[0] + 0.14, 0.05, b.size[2] + 0.14]} />
          <meshStandardMaterial color="#2a2017" roughness={0.6} />
        </mesh>
      )}

      {/* upper setback */}
      {upperH > 0.01 && (
        <mesh position={[0, 0.08 + lowerH + upperH / 2 + 0.025, 0]} castShadow receiveShadow>
          <boxGeometry args={[b.size[0] * setback, upperH, b.size[2] * setback]} />
          <meshStandardMaterial
            ref={(m) => {
              matRefs.current[1] = m;
            }}
            color={b.color ?? "#cdbd9f"}
            emissive={new THREE.Color("#f6c582")}
            emissiveIntensity={0.25}
            roughness={0.75}
            metalness={0.04}
          />
        </mesh>
      )}

      {/* roof slab / parapet */}
      <mesh position={[0, roofY, 0]}>
        <boxGeometry args={[b.size[0] * setback + 0.2, 0.06, b.size[2] * setback + 0.2]} />
        <meshStandardMaterial color="#1a130b" roughness={0.8} />
      </mesh>
      {/* parapet ring (4 thin walls) */}
      {(["n", "s", "e", "w"] as const).map((side) => {
        const w = b.size[0] * setback + 0.18;
        const d = b.size[2] * setback + 0.18;
        let pos: [number, number, number] = [0, roofY + 0.1, 0];
        let scale: [number, number, number] = [w, 0.14, 0.04];
        if (side === "n") pos = [0, roofY + 0.1, -d / 2];
        else if (side === "s") pos = [0, roofY + 0.1, d / 2];
        else if (side === "e") {
          pos = [w / 2, roofY + 0.1, 0];
          scale = [0.04, 0.14, d];
        } else {
          pos = [-w / 2, roofY + 0.1, 0];
          scale = [0.04, 0.14, d];
        }
        return (
          <mesh key={side} position={pos}>
            <boxGeometry args={scale} />
            <meshStandardMaterial color="#1f1710" roughness={0.8} />
          </mesh>
        );
      })}

      {/* rooftop water tanks + AC unit */}
      {hasRooftopKit && (
        <group position={[0, roofY + 0.08, 0]}>
          <mesh position={[b.size[0] * setback * 0.2, 0.15, -b.size[2] * setback * 0.2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.28, 8]} />
            <meshStandardMaterial color="#e8ddca" roughness={0.85} />
          </mesh>
          <mesh position={[b.size[0] * setback * 0.2 + 0.22, 0.13, -b.size[2] * setback * 0.2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.24, 8]} />
            <meshStandardMaterial color="#d8ccb7" roughness={0.85} />
          </mesh>
          {/* AC unit */}
          <mesh position={[-b.size[0] * setback * 0.25, 0.08, b.size[2] * setback * 0.2]} castShadow>
            <boxGeometry args={[0.3, 0.15, 0.22]} />
            <meshStandardMaterial color="#2f2a22" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* vent pipe */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
            <meshStandardMaterial color="#2a231a" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      )}

      {/* warm ground wash for lit buildings */}
      {emissiveTex && (
        <pointLight position={[0, 0.2, 0]} color="#f5b870" intensity={0.18} distance={3.4} decay={2} />
      )}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Pool (caustics shader)
// -----------------------------------------------------------------------------
function Pool({ size }: { size: [number, number, number] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <group>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[size[0] + 0.8, 0.04, size[2] + 0.8]} />
        <meshStandardMaterial color="#1a130c" roughness={0.95} />
      </mesh>
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
              float c = smoothstep(0.3, 0.9, a*b*1.7);
              vec3 deep = vec3(0.04, 0.18, 0.32);
              vec3 shallow = vec3(0.42, 0.82, 0.94);
              vec3 col = mix(deep, shallow, c*0.8);
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
// Palms (enhanced)
// -----------------------------------------------------------------------------
function Palms({ count = 18 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number; scale: number }[] = [];
    const rng = mulberry32(7);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rng() * 0.2;
      const r = 7.4 + rng() * 1.4;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        rot: rng() * Math.PI * 2,
        scale: 0.85 + rng() * 0.35,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((c, i) => {
      c.rotation.z = Math.sin(t * 0.55 + i) * 0.025;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group key={i} position={it.pos} rotation={[0, it.rot, 0]} scale={it.scale}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 1.5, 7]} />
            <meshStandardMaterial color="#5a4630" roughness={0.95} />
          </mesh>
          {Array.from({ length: 8 }).map((_, j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <mesh
                key={j}
                position={[Math.cos(a) * 0.22, 1.55, Math.sin(a) * 0.22]}
                rotation={[0.5, a, 0]}
                castShadow
              >
                <coneGeometry args={[0.09, 1.0, 4]} />
                <meshStandardMaterial color="#455740" roughness={1} />
              </mesh>
            );
          })}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#4a5a40" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Perimeter walls + main gate
// -----------------------------------------------------------------------------
function Perimeter() {
  const walls = [
    { pos: [0, 0.4, 8.6] as [number, number, number], size: [18, 0.8, 0.18] as [number, number, number] },
    { pos: [0, 0.4, -8.6] as [number, number, number], size: [18, 0.8, 0.18] as [number, number, number] },
    { pos: [8.6, 0.4, 0] as [number, number, number], size: [0.18, 0.8, 18] as [number, number, number] },
    { pos: [-8.6, 0.4, 0] as [number, number, number], size: [0.18, 0.8, 18] as [number, number, number] },
  ];
  return (
    <group>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} castShadow receiveShadow>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color="#2b2219" roughness={0.85} />
        </mesh>
      ))}
      {/* pillar posts */}
      {[-8.6, -4, 0, 4, 8.6].flatMap((x) =>
        [-8.6, 8.6].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.55, z]} castShadow>
            <boxGeometry args={[0.26, 1.1, 0.26]} />
            <meshStandardMaterial color="#39302a" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Gate() {
  // entrance at +z (south side): gap in the south wall
  return (
    <group position={[0, 0, 8.6]}>
      {/* left wing */}
      <mesh position={[-1.4, 0.4, 0]} castShadow>
        <boxGeometry args={[1.4, 0.8, 0.18]} />
        <meshStandardMaterial color="#2b2219" roughness={0.85} />
      </mesh>
      {/* right wing */}
      <mesh position={[1.4, 0.4, 0]} castShadow>
        <boxGeometry args={[1.4, 0.8, 0.18]} />
        <meshStandardMaterial color="#2b2219" roughness={0.85} />
      </mesh>
      {/* gate posts */}
      <mesh position={[-0.7, 0.9, 0]} castShadow>
        <boxGeometry args={[0.35, 1.8, 0.35]} />
        <meshStandardMaterial color="#ded0b1" roughness={0.7} />
      </mesh>
      <mesh position={[0.7, 0.9, 0]} castShadow>
        <boxGeometry args={[0.35, 1.8, 0.35]} />
        <meshStandardMaterial color="#ded0b1" roughness={0.7} />
      </mesh>
      {/* lintel */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[1.7, 0.24, 0.35]} />
        <meshStandardMaterial color="#2b2219" roughness={0.8} />
      </mesh>
      {/* gate sign plate (emissive) */}
      <mesh position={[0, 1.95, 0.19]}>
        <boxGeometry args={[1.2, 0.16, 0.02]} />
        <meshStandardMaterial
          color="#0f0a05"
          emissive={new THREE.Color("#f5b870")}
          emissiveIntensity={1.6}
          roughness={0.3}
        />
      </mesh>
      {/* guardhouse */}
      <mesh position={[-1.9, 0.35, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#d1bf9b" roughness={0.8} />
      </mesh>
      <mesh position={[-1.9, 0.72, 0.6]} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.8]} />
        <meshStandardMaterial color="#1a130b" roughness={0.8} />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Parking + cars
// -----------------------------------------------------------------------------
function Parking() {
  const spots = useMemo(() => {
    const rng = mulberry32(42);
    const out: { pos: [number, number, number]; color: string; rot: number; occupied: boolean }[] = [];
    const carColors = ["#1a1a1a", "#e8e5e0", "#2f3940", "#5b4834", "#7a5a3b", "#252525"];
    // east-side lot
    for (let i = 0; i < 6; i++) {
      const x = 7.4;
      const z = -5.2 + i * 0.9;
      out.push({
        pos: [x, 0, z],
        color: carColors[Math.floor(rng() * carColors.length)],
        rot: Math.PI / 2,
        occupied: rng() > 0.25,
      });
    }
    return out;
  }, []);

  return (
    <group>
      {/* paved area */}
      <mesh rotation-x={-Math.PI / 2} position={[7.4, 0.015, -3.1]} receiveShadow>
        <planeGeometry args={[1.7, 5.8]} />
        <meshStandardMaterial color="#15110c" roughness={1} />
      </mesh>
      {/* spot lines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={i}
          rotation-x={-Math.PI / 2}
          position={[7.4, 0.018, -5.65 + i * 0.9]}
          receiveShadow
        >
          <planeGeometry args={[1.5, 0.03]} />
          <meshStandardMaterial color="#cbb585" roughness={0.7} />
        </mesh>
      ))}
      {/* cars */}
      {spots
        .filter((s) => s.occupied)
        .map((s, i) => (
          <group key={i} position={s.pos} rotation={[0, s.rot, 0]}>
            {/* body */}
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.2, 0.3]} />
              <meshStandardMaterial color={s.color} roughness={0.4} metalness={0.5} />
            </mesh>
            {/* roof */}
            <mesh position={[-0.05, 0.29, 0]} castShadow>
              <boxGeometry args={[0.42, 0.12, 0.26]} />
              <meshStandardMaterial color={s.color} roughness={0.4} metalness={0.5} />
            </mesh>
            {/* wheels */}
            {[
              [0.25, 0.07, 0.16],
              [-0.25, 0.07, 0.16],
              [0.25, 0.07, -0.16],
              [-0.25, 0.07, -0.16],
            ].map((w, j) => (
              <mesh key={j} position={w as [number, number, number]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
                <meshStandardMaterial color="#0b0b0b" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Lampposts (light sources for bloom)
// -----------------------------------------------------------------------------
function Lampposts() {
  const positions: [number, number][] = [
    [5.5, 5.5],
    [-5.5, 5.5],
    [5.5, -5.5],
    [-5.5, -5.5],
    [0, 6.2],
    [6.2, 0],
    [-6.2, 0],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={[p[0], 0, p[1]]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 1.5, 6]} />
            <meshStandardMaterial color="#12100a" roughness={0.75} metalness={0.5} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial
              color="#1a120a"
              emissive={new THREE.Color("#ffd08a")}
              emissiveIntensity={3.2}
              roughness={0.3}
            />
          </mesh>
          <pointLight position={[0, 1.55, 0]} color="#ffcf84" intensity={0.25} distance={3.5} decay={2} />
        </group>
      ))}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Hedges around bases
// -----------------------------------------------------------------------------
function Hedges() {
  const hedges = useMemo(() => {
    const out: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    const rng = mulberry32(13);
    // border hedges along main walkways
    for (let i = -6; i <= 6; i += 1.2) {
      out.push({
        pos: [i, 0.12, 6.9],
        size: [0.8 + rng() * 0.15, 0.25, 0.3],
      });
      out.push({
        pos: [i, 0.12, -6.9],
        size: [0.8 + rng() * 0.15, 0.25, 0.3],
      });
    }
    return out;
  }, []);
  return (
    <group>
      {hedges.map((h, i) => (
        <mesh key={i} position={h.pos} castShadow receiveShadow>
          <boxGeometry args={h.size} />
          <meshStandardMaterial color="#3b4a35" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Ground
// -----------------------------------------------------------------------------
function Ground() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const ctx = c.getContext("2d")!;
    // warm radial base
    const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 720);
    g.addColorStop(0, "#2a1e12");
    g.addColorStop(0.55, "#1e150c");
    g.addColorStop(1, "#120c06");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
    // grain
    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = `rgba(201, 161, 92, ${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
    }
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(10, 7, 3, ${Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1 + Math.random() * 2, 1);
    }
    // walkways (cross)
    ctx.strokeStyle = "rgba(170, 140, 80, 0.22)";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    ctx.lineTo(1024, 512);
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    ctx.stroke();
    // ring
    ctx.beginPath();
    ctx.arc(512, 512, 300, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(170, 140, 80, 0.15)";
    ctx.lineWidth = 4;
    ctx.stroke();
    // inner ring walkway edges
    ctx.setLineDash([20, 14]);
    ctx.beginPath();
    ctx.arc(512, 512, 310, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120, 95, 55, 0.3)";
    ctx.lineWidth = 1;
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
// Camera controller — cinematic focus on click
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
// Hover overlay tracker
// -----------------------------------------------------------------------------
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
        camera={{ position: [10, 6.8, 10], fov: 34 }}
        gl={{
          antialias: false,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0E0B08"]} />
          <fog attach="fog" args={["#0E0B08", 20, 50]} />

          <ambientLight intensity={0.22} />
          <hemisphereLight args={["#f5cf9a", "#1a2222", 0.28]} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.7}
            color="#ffd59a"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={16}
            shadow-camera-bottom={-16}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#6b7f68" />

          <Ground />
          <Perimeter />
          <Gate />
          <Palms count={18} />
          <Hedges />
          <Lampposts />
          <Parking />

          {BUILDINGS.map((b) => (
            <Building key={b.id} b={b} hoveredRef={hoveredRef} onPick={handle} />
          ))}

          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.5}
            scale={34}
            blur={2.8}
            far={14}
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
            autoRotateSpeed={0.3}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.44}
          />

          <HoverOverlayTracker hoveredRef={hoveredRef} overlayRef={overlayRef} buildings={BUILDINGS} />

          <EffectComposer multisampling={0} enableNormalPass>
            <SSAO
              blendFunction={BlendFunction.MULTIPLY}
              samples={18}
              radius={0.14}
              intensity={30}
              luminanceInfluence={0.5}
              worldDistanceThreshold={8}
              worldDistanceFalloff={1}
              worldProximityThreshold={6}
              worldProximityFalloff={1}
            />
            <Bloom
              mipmapBlur
              luminanceThreshold={0.55}
              luminanceSmoothing={0.25}
              intensity={0.9}
            />
            <Vignette eskil={false} offset={0.32} darkness={0.55} />
            <SMAA />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-ochre/50 bg-ink/90 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ochre opacity-0 backdrop-blur transition-opacity"
        style={{ willChange: "transform, opacity" }}
      >
        <span data-label>—</span>
        <span className="mx-2 text-ivory/30">·</span>
        <span data-caption className="text-ivory/70">—</span>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ivory/50">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ochre/70" />
        drag to orbit · click a building
      </div>
    </div>
  );
}
