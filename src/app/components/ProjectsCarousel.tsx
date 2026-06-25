"use client";

import { useEffect, useRef } from "react";
import { projects as allProjects, Project } from "../data/projects";

// A 3D ring of project frames that auto-rotates. Drag to spin, hover slows it,
// click a frame to open it. Pure CSS 3D transforms — only the ring's rotateY is
// updated per frame, so it's cheap.

type FrameData = { src: string; title: string; category: string; project: Project };

export default function ProjectsCarousel({
  onSelect,
}: {
  onSelect: (p: Project) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    angle: 0,
    vel: 0,
    dragging: false,
    lastX: 0,
    moved: 0,
    hover: false,
  });

  const baseFrames: FrameData[] = allProjects
    .filter((p) => p.image)
    .map((p) => ({
      src: p.image as string,
      title: p.title,
      category: p.category,
      project: p,
    }));
  // Repeat the projects so the ring stays full (no big empty gaps) — each
  // copy still links back to its real project.
  const TARGET = 8;
  const frames: FrameData[] =
    baseFrames.length === 0
      ? []
      : Array.from({ length: Math.max(TARGET, baseFrames.length) }, (_, i) => ({
          ...baseFrames[i % baseFrames.length],
        }));
  const N = Math.max(frames.length, 1);

  useEffect(() => {
    const ring = ringRef.current;
    const stage = stageRef.current;
    if (!ring || !stage) return;

    const step = 360 / N;

    const layout = () => {
      const w = stage.clientWidth || 1000;
      const frameW = w < 640 ? 230 : w < 1100 ? 320 : 380;
      // radius so frames sit side-by-side without overlapping
      const radius = Math.round((frameW * 1.4) / (2 * Math.tan(Math.PI / N)));
      Array.from(ring.children).forEach((c, i) => {
        const el = c as HTMLElement;
        el.style.width = `${frameW}px`;
        el.style.transform = `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`;
      });
    };
    layout();
    window.addEventListener("resize", layout);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = state.current;
      if (!s.dragging) {
        const base = s.hover ? 5 : 20; // deg/s idle spin (slower on hover)
        s.vel *= 0.93; // inertia decay
        s.angle += (base + s.vel) * dt;
      }
      ring.style.transform = `rotateX(-8deg) rotateY(${s.angle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, [N]);

  // --- pointer drag to spin ---
  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.moved = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.moved += Math.abs(dx);
    s.angle += dx * 0.35;
    s.vel = dx * 4; // carry momentum on release
  };
  const onPointerUp = () => {
    state.current.dragging = false;
  };

  const handleFrameClick = (p: Project) => {
    // ignore if this was a drag, not a click
    if (state.current.moved > 8) return;
    onSelect(p);
  };

  return (
    <div className="relative w-full select-none">
      {/* heading */}
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
            ◆ Selected work
          </span>
          <h2 className="mt-2 text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
            Shipped in production
          </h2>
        </div>
        <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          drag to spin · click to open
        </span>
      </div>

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={() => (state.current.hover = true)}
        onMouseLeave={() => (state.current.hover = false)}
        className="relative h-[300px] w-full cursor-grab active:cursor-grabbing touch-pan-y md:h-[380px]"
        style={{ perspective: "1400px" }}
      >
        {/* side fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-[#050505] to-transparent" />

        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 h-px w-px"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {frames.map((f, i) => (
            <button
              key={`${f.title}-${i}`}
              onClick={() => handleFrameClick(f.project)}
              className="group absolute left-0 top-0 overflow-hidden rounded-xl border border-[#ffffff14] bg-[#0c0c0c] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* browser chrome */}
              <div className="flex h-6 w-full items-center gap-1.5 border-b border-[#ffffff10] bg-[#151515] px-3">
                <span className="h-2 w-2 rounded-full bg-[#ff5f56]/60" />
                <span className="h-2 w-2 rounded-full bg-[#ffbd2e]/60" />
                <span className="h-2 w-2 rounded-full bg-[#27c93f]/60" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.src}
                alt={f.title}
                draggable={false}
                className="aspect-[16/10] w-full object-cover object-top opacity-85 transition-opacity duration-300 group-hover:opacity-100"
              />
              {/* label overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-8">
                <span className="text-sm font-black uppercase tracking-tight text-white">
                  {f.title}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                  view →
                </span>
              </div>
              {/* gold hover ring */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:ring-[#D4AF37]/60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
