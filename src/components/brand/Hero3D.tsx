"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function GoldTorus({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      target.current.x = (event.clientY / window.innerHeight - 0.5) * 0.32;
      target.current.y = (event.clientX / window.innerWidth - 0.5) * 0.45;
    };
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (reduced) return;
    m.rotation.y += delta * 0.08;
    m.rotation.x = THREE.MathUtils.lerp(
      m.rotation.x,
      target.current.x + scroll.current * 0.00012,
      0.045,
    );
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, target.current.y * 0.35, 0.045);
    m.position.y = THREE.MathUtils.lerp(
      m.position.y,
      Math.sin(scroll.current * 0.0018) * 0.18,
      0.05,
    );
  });

  return (
    <mesh ref={mesh} scale={1.12}>
      <torusGeometry args={[1.08, 0.3, 48, 96]} />
      <meshPhysicalMaterial
        color="#b8956a"
        metalness={0.88}
        roughness={0.2}
        reflectivity={0.7}
        clearcoat={0.5}
        clearcoatRoughness={0.22}
        envMapIntensity={0.85}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08, rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="h-full w-full transition-opacity duration-1000 ease-out"
        style={{ opacity: ready ? 0.55 : 0 }}
      >
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.4]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 4.2], fov: 35 }}
          onCreated={() => setReady(true)}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[4.2, 3.4, 6]} intensity={1.15} color="#f4eadc" />
          <pointLight position={[-3.4, -1.6, 2.2]} intensity={0.55} color="#b8956a" />
          <GoldTorus reduced={reduced} />
        </Canvas>
      </div>
    </div>
  );
}
