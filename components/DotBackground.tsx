'use client';

import { useEffect, useRef } from 'react';

const SPACING = 28;
const BASE_RADIUS = 1.5;
const MAX_RADIUS = 6;
const INFLUENCE = 130;
const COLOR = { r: 233, g: 30, b: 140 };

interface Dot {
  x: number;
  y: number;
  r: number;
  opacity: number;
  phase: number;      // unique offset for breathing animation
  speed: number;      // unique breathing speed
}

export default function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const mouse = { x: -9999, y: -9999 };
    let dots: Dot[] = [];
    let raf: number;
    let W = 0, H = 0;  // ✅ cached — not read every frame
    let time = 0;

    const buildDots = (w: number, h: number) => {
      dots = [];
      const offX = (w % SPACING) / 2;
      const offY = (h % SPACING) / 2;
      for (let x = offX; x < w; x += SPACING)
        for (let y = offY; y < h; y += SPACING)
          dots.push({
            x, y,
            r: BASE_RADIUS,
            opacity: 0.15,
            phase: Math.random() * Math.PI * 2,   // ✅ unique breath offset per dot
            speed: 0.003 + Math.random() * 0.002, // ✅ slight speed variation
          });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // ✅ setTransform is safer than resetTransform+scale
      buildDots(W, H);
    };

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        const ease = Math.pow(Math.max(0, 1 - dist / INFLUENCE), 2);

        // ✅ Subtle breathing when idle — each dot pulses independently
        const breath = Math.sin(time * d.speed + d.phase);
        const idleR = BASE_RADIUS + breath * 0.4;           // ±0.4px pulse
        const idleO = 0.12 + breath * 0.05;                 // subtle opacity wave

        const targetR = ease > 0.01
          ? BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * ease
          : idleR;

        const targetO = ease > 0.01
          ? 0.15 + 0.85 * ease
          : idleO;

        // ✅ Slower lerp when shrinking back — snappy on approach, lazy on retreat
        d.r       += (targetR - d.r)       * (d.r > targetR ? 0.02 : 0.09);
        d.opacity += (targetO - d.opacity) * (d.opacity > targetO ? 0.02 : 0.09);

        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.1, d.r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${d.opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    // ✅ Mouse
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    // ✅ Touch support
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
    };
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999; };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      // ✅ Debounce resize — no rapid rebuild on every pixel change
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf);
        resize();
        draw();
      }, 100);
    };

    // ✅ pointer-events-none — canvas never blocks clicks/scroll beneath it
    canvas.style.pointerEvents = 'none';

    window.addEventListener('mousemove', onMouseMove);  // ✅ window-level so mouse works even when cursor is over text
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}