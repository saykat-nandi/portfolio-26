"use client";

import { useEffect, useRef } from "react";

interface Gyroscope3DProps {
  className?: string;
}

export default function Gyroscope3D({ className = "" }: Gyroscope3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let size = 430;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      const parentWidth = parent?.clientWidth ?? 0;
      size = parentWidth > 0 ? Math.min(parentWidth, 450) : 430;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Cursor tracking (slightly slower damping than the foreground nameplate)
    let targetNx = 0;
    let targetNy = 0;
    let currentNx = 0;
    let currentNy = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetNx = e.clientX / window.innerWidth - 0.5;
      targetNy = e.clientY / window.innerHeight - 0.5;
    };

    const onPointerLeave = () => {
      targetNx = 0;
      targetNy = 0;
    };

    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });
    }

    // 3D rotation helper (X -> Y -> Z)
    const projectPoint = (
      x: number,
      y: number,
      z: number,
      rx: number,
      ry: number,
      rz: number,
      cx: number,
      cy: number
    ) => {
      // Rotate X
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);
      // Rotate Y
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      // Rotate Z
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      const fov = 680;
      const scale = fov / (fov + z2);
      return {
        x: cx + x3 * scale,
        y: cy + y3 * scale,
        z: z2,
        scale,
      };
    };

    // Orbital node angles
    let nodeAngleInner = 0.65;
    let nodeAngleOuter = 3.8;
    let rafId = 0;

    const render = () => {
      if (!prefersReduced) {
        currentNx += (targetNx - currentNx) * 0.055;
        currentNy += (targetNy - currentNy) * 0.055;
        nodeAngleInner += 0.0045;
        nodeAngleOuter -= 0.0032;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const outerRadius = size * 0.435;
      const innerRadius = size * 0.37;
      const segments = 128;

      // Assembly cursor tilt (same family as nameplate, slightly gentler)
      const cursorTiltX = -currentNy * 0.42;
      const cursorTiltY = currentNx * 0.52;

      // 1. Outer Ring: Razor 1px obsidian rgba(17,17,17,0.22)
      const outerRx = 0.32 + cursorTiltX;
      const outerRy = -0.18 + cursorTiltY;
      const outerRz = -0.22;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = Math.cos(theta) * outerRadius;
        const py = Math.sin(theta) * outerRadius;
        const p = projectPoint(px, py, 0, outerRx, outerRy, outerRz, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(17, 17, 17, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Inner Ring: Crisp 1.5px Signal Orange #FF4500
      const innerRx = -0.26 + cursorTiltX * 1.15;
      const innerRy = 0.22 + cursorTiltY * 1.15;
      const innerRz = 0.18;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = Math.cos(theta) * innerRadius;
        const py = Math.sin(theta) * innerRadius;
        const p = projectPoint(px, py, 0, innerRx, innerRy, innerRz, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "#FF4500";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Two Small Signal Nodes Crawling Along the Tracks
      const drawSignalNode = (
        angle: number,
        radius: number,
        rx: number,
        ry: number,
        rz: number
      ) => {
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;
        const p = projectPoint(nx, ny, 0, rx, ry, rz, cx, cy);

        // Soft signal halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 69, 0, 0.22)";
        ctx.fill();

        // Crisp core LED dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4500";
        ctx.fill();
      };

      drawSignalNode(nodeAngleInner, innerRadius, innerRx, innerRy, innerRz);
      drawSignalNode(nodeAngleOuter, outerRadius, outerRx, outerRy, outerRz);

      if (!prefersReduced) {
        rafId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex items-center justify-center select-none ${className}`}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
