"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Environment, ContactShadows } from "@react-three/drei";
import { useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

type BuildingDef = {
  id: string;
  label: string;
  type: "apartment" | "bungalow" | "townhouse" | "amenity";
  position: [number, number, number];
  size: [number, number, number];
  href?: string;
  caption?: string;
};

const BUILDINGS: BuildingDef[] = [
  // Central tower - apartments
  { id: "apt-a", label: "Apartments A", type: "apartment", position: [0, 0, 0], size: [2.2, 3.8, 2.2], href: "/apartments", caption: "Tower · 1–3.5 br" },
  { id: "apt-b", label: "Apartments B", type: "apartment", position: [3, 0, -1], size: [1.8, 3.2, 1.8], href: "/apartments", caption: "East wing · 2–3 br" },
  { id: "apt-c", label: "Apartments C", type: "apartment", position: [-3, 0, -1], size: [1.8, 2.8, 1.8], href: "/apartments", caption: "West wing · 1–2 br" },

  // Bungalows - single story row
  { id: "bun-1", label: "Bungalow Row I", type: "bungalow", position: [-2.5, 0, 3], size: [1.3, 0.9, 1.3], href: "/bungalows", caption: "Garden-level · 2 br" },
  { id: "bun-2", label: "Bungalow Row II", type: "bungalow", position: [-0.5, 0, 3], size: [1.3, 0.9, 1.3], href: "/bungalows", caption: "Garden-level · 3 br" },
  { id: "bun-3", label: "Bungalow Row III", type: "bungalow", position: [1.5, 0, 3], size: [1.3, 0.9, 1.3], href: "/bungalows", caption: "Garden-level · 4 br" },

  // Townhouses - 2-3 story
  { id: "th-1", label: "Townhouses I", type: "townhouse", position: [4.2, 0, 2], size: [1.2, 2.1, 1.2], href: "/townhouses", caption: "3 stories · 3 br" },
  { id: "th-2", label: "Townhouses II", type: "townhouse", position: [-4.2, 0, 2], size: [1.2, 2.3, 1.2], href: "/townhouses", caption: "3 stories · 4 br" },

  // Amenities - pool, gym
  { id: "pool", label: "Swimming Pool", type: "amenity", position: [0, 0, -3.2], size: [3.4, 0.15, 1.6], href: "/amenities", caption: "25m heated" },
  { id: "gym", label: "Fitness Center", type: "amenity", position: [3.5, 0, -3.2], size: [1.4, 1.1, 1.1], href: "/amenities", caption: "24/7 · Technogym" },
];

function Building({
  b,
  hovered,
  setHovered,
  onPick,
}: {
  b: BuildingDef;
  hovered: string | null;
  setHovered: (v: string | null) => void;
  onPick: (b: BuildingDef) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const isHovered = hovered === b.id;
  const isDim = hovered !== null && !isHovered;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = isHovered ? b.size[1] / 2 + 0.05 : b.size[1] / 2;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 6, dt);
  });

  const color =
    b.type === "apartment"
      ? "#d8c9a8"
      : b.type === "bungalow"
      ? "#c9a15c"
      : b.type === "townhouse"
      ? "#b28857"
      : b.type === "amenity" && b.id === "pool"
      ? "#4f7fa6"
      : "#8a735a";

  return (
    <group position={[b.position[0], 0, b.position[2]]}>
      <mesh
        ref={ref}
        position={[0, b.size[1] / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(b.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPick(b);
        }}
      >
        <boxGeometry args={b.size} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.03}
          emissive={isHovered ? "#C9A15C" : "#000000"}
          emissiveIntensity={isHovered ? 0.22 : 0}
          transparent
          opacity={isDim ? 0.35 : 1}
        />
      </mesh>

      {/* Roof trim */}
      {b.type !== "amenity" && (
        <mesh position={[0, b.size[1] + 0.02, 0]}>
          <boxGeometry args={[b.size[0] + 0.12, 0.04, b.size[2] + 0.12]} />
          <meshStandardMaterial color="#2a2017" roughness={0.8} />
        </mesh>
      )}

      {/* Hover label */}
      {isHovered && (
        <Html
          position={[0, b.size[1] + 0.4, 0]}
          center
          distanceFactor={8}
          className="pointer-events-none"
        >
          <div className="whitespace-nowrap rounded-full border border-ochre/50 bg-ink/90 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ochre backdrop-blur">
            {b.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function Ground() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    // warm sand base
    ctx.fillStyle = "#1b150d";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = `rgba(201,161,92,${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    return t;
  }, []);

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial map={tex} color="#1b150d" roughness={1} />
      </mesh>
      {/* path grid */}
      <gridHelper args={[20, 20, "#3a2f20", "#241c12"]} position={[0, 0.001, 0]} />
      {/* palm dots */}
      {Array.from({ length: 30 }).map((_, i) => {
        const a = (i / 30) * Math.PI * 2;
        const r = 7 + Math.sin(i * 1.7) * 1.4;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.9, Math.sin(a) * r]} castShadow>
            <coneGeometry args={[0.18, 1.8, 6]} />
            <meshStandardMaterial color="#3d4a36" roughness={1} />
          </mesh>
        );
      })}
    </>
  );
}

function CameraRig({ focus }: { focus: BuildingDef | null }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const pos = useRef(new THREE.Vector3(8, 7, 8));

  useFrame((_, dt) => {
    if (focus) {
      target.current.set(focus.position[0], focus.size[1] / 2, focus.position[2]);
      pos.current.set(
        focus.position[0] + 3.5,
        focus.size[1] + 2,
        focus.position[2] + 3.5
      );
    } else {
      target.current.set(0, 0.8, 0);
      pos.current.set(8, 7, 8);
    }
    camera.position.lerp(pos.current, Math.min(1, 2.2 * dt));
    camera.lookAt(target.current);
  });
  return null;
}

function AutoOrbit({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!enabled) return;
    t.current += dt * 0.04;
    camera.position.x = Math.cos(t.current) * 10;
    camera.position.z = Math.sin(t.current) * 10;
    camera.position.y = 6.5 + Math.sin(t.current * 0.5) * 0.3;
    camera.lookAt(0, 0.8, 0);
  });
  return null;
}

export type CompoundSceneProps = {
  onPick?: (b: BuildingDef) => void;
  autoOrbit?: boolean;
};

export default function CompoundScene({ onPick, autoOrbit = true }: CompoundSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focus, setFocus] = useState<BuildingDef | null>(null);

  const handle = (b: BuildingDef) => {
    setFocus(b);
    onPick?.(b);
    setTimeout(() => setFocus(null), 1600);
  };

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [10, 7, 10], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0E0B08"]} />
        <fog attach="fog" args={["#0E0B08", 18, 36]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.4}
          color="#f5e4c3"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />
        <directionalLight position={[-6, 4, -6]} intensity={0.3} color="#6b7f68" />

        <Ground />

        {BUILDINGS.map((b) => (
          <Building key={b.id} b={b} hovered={hovered} setHovered={setHovered} onPick={handle} />
        ))}

        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.55}
          scale={24}
          blur={2.4}
          far={10}
          resolution={512}
        />
        <Environment preset="sunset" />
        <CameraRig focus={focus} />
        <AutoOrbit enabled={autoOrbit && focus === null && hovered === null} />
      </Suspense>
    </Canvas>
  );
}
