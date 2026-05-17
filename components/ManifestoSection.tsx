'use client';
 
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotBackground from './DotBackground';
 
gsap.registerPlugin(ScrollTrigger);
 
interface ManifestoProps {
  statements?: string[];
}
 
const DEFAULT_STATEMENTS = [
  "ART BECAME A SPECIES.",
  "NOT BORN. CURATED.",
  "THE WALLS COULD NOT CONTAIN IT.",
  "THE FLOCK WATCHES.",
];
 
const STATEMENT_META = [
  { index: '01', tag: 'GENESIS'    },
  { index: '02', tag: 'DOCTRINE'   },
  { index: '03', tag: 'EXPANSION'  },
  { index: '04', tag: 'COLLECTIVE' },
];
 
const splitLines = (text: string): [string, string] => {
  const words = text.split(' ');
  const mid   = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};
 
const ManifestoSection: React.FC<ManifestoProps> = ({
  statements = DEFAULT_STATEMENTS,
}) => {
  const sectionRef      = useRef<HTMLElement>(null);
  const barRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef         = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLSpanElement>(null);
  const tagRef          = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
 
  // activeIndex only drives pointer-events — everything else is GSAP
  const [activeIndex, setActiveIndex] = useState(0);
 
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── Scoped helpers ──────────────────────────────────────────────
      const words = (i: number) => el.querySelectorAll<HTMLElement>(`[data-statement="${i}"] [data-word]`);
      const line  = (i: number) => el.querySelector<HTMLElement>(`[data-statement="${i}"] [data-line]`);

      const showMeta = (i: number) => {
        if (counterRef.current) counterRef.current.textContent = String(i + 1).padStart(2, '0');
        if (tagRef.current)     tagRef.current.textContent     = STATEMENT_META[i]?.tag ?? '';
        gsap.fromTo(metaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
        );
        gsap.fromTo(progressLineRef.current,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 0.7, ease: 'expo.out', overwrite: true }
        );
      };

      const hideMeta = () => {
        gsap.to(metaRef.current,         { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', overwrite: true });
        gsap.to(progressLineRef.current, { scaleX: 0, duration: 0.2, ease: 'power2.in', transformOrigin: 'right', overwrite: true });
      };

      // ── Initial State ───────────────────────────────────────────────
      statements.forEach((_, i) => {
        gsap.set(words(i), { y: '105%', opacity: 0 });
        gsap.set(line(i),  { scaleX: 0, transformOrigin: 'left' });
      });
      
      // ── Create the Master Stepper Trigger ───────────────────────────
      let currentIdx = -1;

      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${statements.length * 100}vh`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(
            Math.floor(progress * statements.length),
            statements.length - 1
          );

          if (index !== currentIdx) {
            const dir = index > currentIdx ? 1 : -1;
            const from = currentIdx;
            currentIdx = index;
            setActiveIndex(index);

            // Animate OUT previous
            if (from !== -1) {
              gsap.to(words(from), {
                y: dir > 0 ? '-105%' : '105%',
                opacity: 0,
                duration: 0.5,
                stagger: 0.02,
                ease: 'power2.in',
                overwrite: true
              });
              gsap.to(line(from), {
                scaleX: 0,
                duration: 0.3,
                ease: 'power2.in',
                transformOrigin: dir > 0 ? 'right' : 'left',
                overwrite: true
              });
              hideMeta();
            }

            // Animate IN current
            gsap.fromTo(words(index),
              { y: dir > 0 ? '105%' : '-105%', opacity: 0 },
              {
                y: '0%', opacity: 1,
                duration: 0.8, stagger: 0.05, ease: 'expo.out', delay: 0.1,
                overwrite: true
              }
            );
            gsap.fromTo(line(index),
              { scaleX: 0, transformOrigin: 'left' },
              {
                scaleX: 1, duration: 0.7, ease: 'expo.out', delay: 0.3,
                overwrite: true
              }
            );

            // Progress bars
            barRefs.current.forEach((b, i) => {
              if (b) gsap.to(b, { height: i <= index ? '100%' : '0%', duration: 0.4, ease: 'power2.out', overwrite: true });
            });

            showMeta(index);
          }
        }
      });
    }, el);

    return () => ctx.revert();
  }, [statements]);
 
  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Dot background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DotBackground />
      </div>
 
      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.9) 100%)' }}
      />
 
      {/* Top / bottom rules */}
      <div className="absolute top-0   inset-x-0 h-[1px] bg-white/5 z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-white/5 z-20 pointer-events-none" />
 
      {/* ── LEFT — vertical progress bars ── */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-[6px] pointer-events-none">
        {statements.map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden"
            style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.07)' }}
          >
            <div
              ref={(el) => { barRefs.current[i] = el; }}
              className="absolute top-0 left-0 w-full"
              style={{ background: '#e91e8c', height: '0%' }}
            />
          </div>
        ))}
      </div>
 
      {/* ── RIGHT — decorative vertical label ── */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 pointer-events-none">
        <div className="w-[1px] h-14 bg-white/10" />
        <span
          className="text-[8px] tracking-[0.5em] uppercase text-white/15 font-medium"
          style={{ writingMode: 'vertical-rl' }}
        >
          PHILOSOPHY
        </span>
        <div className="w-[1px] h-14 bg-white/10" />
      </div>
 
      {/* ── TOP CORNERS ── */}
      <div className="absolute top-7 left-10 md:left-16 z-40 pointer-events-none">
        <span className="text-[9px] tracking-[0.45em] uppercase text-white/15 font-bold">
          THE BEAKS / MANIFESTO
        </span>
      </div>
      <div className="absolute top-7 right-10 z-40 hidden md:block pointer-events-none">
        <span className="text-[9px] tracking-[0.45em] uppercase text-white/15 font-bold">
          EST. 2024
        </span>
      </div>
 
      {/* ── STATEMENT STACK ── */}
      {statements.map((text, i) => {
        const [line1, line2] = splitLines(text);
        const meta           = STATEMENT_META[i];
 
        return (
          <div
            key={i}
            data-statement={i}
            className="absolute inset-0 flex flex-col items-start justify-center px-12 md:px-20 lg:px-32 xl:px-40 z-30"
            style={{ pointerEvents: i === activeIndex ? 'auto' : 'none' }}
          >
            {/* Tag */}
            <div className="overflow-hidden mb-5 md:mb-7">
              <span
                data-word
                className="block text-[10px] md:text-[11px] tracking-[0.55em] uppercase font-bold"
                style={{ color: '#e91e8c' }}
              >
                {meta?.index} — {meta?.tag}
              </span>
            </div>
 
            {/* Line 1 — solid white */}
            <div className="overflow-hidden">
              <h2
                data-word
                className="block font-heading uppercase font-black text-white leading-[0.83] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3rem, 10.5vw, 11rem)' }}
              >
                {line1}
              </h2>
            </div>
 
            {/* Line 2 — outlined pink */}
            {line2 && (
              <div className="overflow-hidden">
                <h2
                  data-word
                  className="block font-heading uppercase font-black leading-[0.83] tracking-[-0.03em]"
                  style={{
                    fontSize: 'clamp(3rem, 10.5vw, 11rem)',
                    WebkitTextStroke: '1.5px rgba(233,30,140,0.7)',
                    color: 'transparent',
                  }}
                >
                  {line2}
                </h2>
              </div>
            )}
 
            {/* Gradient rule */}
            <div
              data-line
              className="mt-8 md:mt-10 h-[1px] w-full max-w-md"
              style={{
                background: 'linear-gradient(to right, rgba(233,30,140,0.5), transparent)',
              }}
            />
          </div>
        );
      })}
 
      {/* ── BOTTOM META BAR ── */}
      <div
        ref={metaRef}
        className="absolute bottom-8 md:bottom-10 left-12 md:left-16 right-10 z-40 flex items-end justify-between pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-5">
          {/* Ghost counter */}
          <span
            ref={counterRef}
            className="font-heading font-black leading-none select-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: 'rgba(255,255,255,0.05)' }}
          >
            01
          </span>
          <div className="flex flex-col gap-1.5">
            <span
              ref={tagRef}
              className="text-[9px] tracking-[0.5em] uppercase font-bold"
              style={{ color: '#e91e8c' }}
            >
              GENESIS
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">
              Scroll · Arrow keys
            </span>
          </div>
        </div>
 
        {/* Progress line + counter */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            {String(activeIndex + 1).padStart(2, '0')} / {String(statements.length).padStart(2, '0')}
          </span>
          <div className="w-28 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              ref={progressLineRef}
              className="absolute inset-y-0 left-0"
              style={{ background: '#e91e8c', width: '100%', transform: 'scaleX(0)', transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default ManifestoSection;