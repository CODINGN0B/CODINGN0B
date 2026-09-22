import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

const WHEEL_RE = /wheel|tire|rim/i;
const INNER_RE = /brake|metal|chrome|leather|interior|carpet|plastic|steering|nuts/i;

const wireCyan = new THREE.MeshBasicMaterial({ color: "#00F3FF", wireframe: true, transparent: true, opacity: 0.32 });
const wireAmber = new THREE.MeshBasicMaterial({ color: "#FFB000", wireframe: true, transparent: true, opacity: 0.5 });
const xrayOuter = new THREE.MeshBasicMaterial({
  color: "#5ec8e8", transparent: true, opacity: 0.1, depthWrite: false, side: THREE.FrontSide,
});
const xrayInner = new THREE.MeshStandardMaterial({
  color: "#FFB000", transparent: true, opacity: 0.85, roughness: 0.3, metalness: 0.8,
  emissive: "#FFB000", emissiveIntensity: 0.35,
});

function Coupe({ mode }) {
  const { scene } = useGLTF("/models/coupe.glb");

  const roots = useMemo(() => {
    scene.updateMatrixWorld(true);
    const center = new THREE.Box3().setFromObject(scene).getCenter(new THREE.Vector3());
    const rootMeshes = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      if (o.name === "yellow_trim") o.visible = false;
      o.userData.origMat = o.material;
      o.userData.origPos = o.position.clone();
      const matName = o.material && o.material.name;
      if (matName === "Body_Color") {
        o.material.map = null;
        o.material.color.set("#3b4046");
        o.material.metalness = 0.85;
        o.material.roughness = 0.32;
        o.material.needsUpdate = true;
      }
      if (matName === "Ferrari_Yellow") {
        o.material.map = null;
        o.material.color.set("#D4AF37");
        o.material.metalness = 0.9;
        o.material.roughness = 0.3;
        o.material.needsUpdate = true;
      }
      if (matName === "metal_chrome") {
        o.material.color.set("#24272b");
        o.material.metalness = 1;
        o.material.roughness = 0.22;
        o.material.needsUpdate = true;
      }
      let p = o.parent;
      let hasMeshParent = false;
      while (p) {
        if (p.isMesh) { hasMeshParent = true; break; }
        p = p.parent;
      }
      if (!hasMeshParent) rootMeshes.push(o);
    });
    rootMeshes.forEach((o) => {
      const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
      const dir = c.clone().sub(center);
      dir.y = 0;
      if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
      dir.normalize();
      let off;
      if (/^body$/i.test(o.name)) off = new THREE.Vector3(0, 0.85, 0);
      else if (/glass/i.test(o.name)) off = new THREE.Vector3(0, 1.45, 0);
      else if (WHEEL_RE.test(o.name)) off = dir.multiplyScalar(1.05).add(new THREE.Vector3(0, 0.12, 0));
      else off = dir.multiplyScalar(0.55).add(new THREE.Vector3(0, 0.32, 0));
      o.userData.explodePos = o.userData.origPos.clone().add(off);
    });
    return rootMeshes;
  }, [scene]);

  useEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return;
      if (mode === "wireframe") o.material = WHEEL_RE.test(o.name) ? wireAmber : wireCyan;
      else if (mode === "xray")
        o.material = INNER_RE.test(o.name) && !/^body$/i.test(o.name) ? xrayInner : xrayOuter;
      else o.material = o.userData.origMat;
    });
  }, [mode, scene]);

  useFrame((_, delta) => {
    const exploded = mode === "exploded";
    const k = Math.min(1, delta * 3.2);
    roots.forEach((o) => {
      o.position.lerp(exploded ? o.userData.explodePos : o.userData.origPos, k);
    });
  });

  return <primitive object={scene} />;
}

const gearMat = new THREE.MeshStandardMaterial({ color: "#D4AF37", metalness: 0.95, roughness: 0.25, emissive: "#D4AF37", emissiveIntensity: 0.08 });
const steelMat = new THREE.MeshStandardMaterial({ color: "#8a9096", metalness: 0.9, roughness: 0.35 });
const chipMat = new THREE.MeshStandardMaterial({ color: "#00F3FF", emissive: "#00F3FF", emissiveIntensity: 0.9, roughness: 0.3 });

function PartLabel({ position, en, tc, visible }) {
  if (!visible) return null;
  return (
    <Html position={position} center distanceFactor={7} zIndexRange={[50, 0]} style={{ pointerEvents: "none" }}>
      <div className="glass metallic-edge whitespace-nowrap rounded-md px-2.5 py-1 font-tech text-[9px] uppercase tracking-[0.18em] text-zinc-200">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#00F3FF] align-middle" />
        {en} <span className="text-[#D4AF37]">{tc}</span>
      </div>
    </Html>
  );
}

function SubAssemblies({ mode }) {
  const gearRef = useRef();
  const showLabels = mode === "exploded" || mode === "xray";
  const spread = mode === "exploded" ? 1.35 : 1;
  const g = useRef({ x: 0 });
  useFrame((state, delta) => {
    if (gearRef.current) gearRef.current.rotation.z += delta * 0.8;
    g.current.x += (spread - g.current.x) * Math.min(1, delta * 3);
    const s = g.current.x;
    if (gearRef.current) gearRef.current.position.set(1.55 * s, 0.55, 0.85 * s);
  });
  return (
    <group>
      <group ref={gearRef} position={[1.55, 0.55, 0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={gearMat}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} material={gearMat} rotation={[0, (i / 8) * Math.PI * 2, 0]} position={[Math.sin((i / 8) * Math.PI * 2) * 0.18, 0, Math.cos((i / 8) * Math.PI * 2) * 0.18]}>
            <boxGeometry args={[0.05, 0.05, 0.07]} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
          <cylinderGeometry args={[0.05, 0.05, 0.09, 16]} />
        </mesh>
      </group>
      <group position={[-1.5 * spread, 0.42, -0.75 * spread]}>
        <mesh material={steelMat} position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.12]} />
        </mesh>
        <mesh material={steelMat} position={[-0.125, 0.1, 0]}>
          <boxGeometry args={[0.05, 0.24, 0.12]} />
        </mesh>
        <mesh material={gearMat} position={[0.1, 0.05, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
        </mesh>
      </group>
      <group position={[0.1, 0.5, -1.55 * spread]}>
        <mesh material={steelMat}>
          <boxGeometry args={[0.3, 0.16, 0.2]} />
        </mesh>
        <mesh material={chipMat} position={[0, 0.085, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.1]} />
        </mesh>
      </group>
      <PartLabel position={[1.55 * spread, 0.95, 0.85 * spread]} en="Precision Gears" tc="精密齒輪" visible={showLabels} />
      <PartLabel position={[-1.5 * spread, 0.85, -0.75 * spread]} en="Structural Bracket" tc="結構支架" visible={showLabels} />
      <PartLabel position={[0.1, 0.85, -1.55 * spread]} en="Connector Enclosure" tc="連接器外殼" visible={showLabels} />
    </group>
  );
}

export function ModelLoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="glass absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl px-6 py-3" data-testid="model-loading">
      <span className="font-tech text-[11px] uppercase tracking-[0.3em] text-[#00F3FF]">
        Loading 3D Asset 加載中 {progress.toFixed(0)}%
      </span>
    </div>
  );
}

export default function CarShowcase({ mode }) {
  const isTouch = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches, []);
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [4.6, 1.5, 4.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
      data-testid="car-canvas"
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[6, 7, 4]} angle={0.5} penumbra={0.6} intensity={140} color="#ffe9c4" />
      <spotLight position={[-7, 4, -5]} angle={0.6} penumbra={0.8} intensity={60} color="#00F3FF" />
      <pointLight position={[0, 2, 6]} intensity={20} color="#FFB000" />
      <Suspense fallback={null}>
        <group position={[0, -0.32, 0]}>
          <Coupe mode={mode} />
          <SubAssemblies mode={mode} />
        </group>
        <ContactShadows position={[0, -0.33, 0]} opacity={0.65} scale={13} blur={2.4} far={4} color="#000000" />
      </Suspense>
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isTouch}
        autoRotate
        autoRotateSpeed={0.7}
        target={[0, 0.35, 0]}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/coupe.glb");
