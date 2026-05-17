'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef    = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const fillRef      = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLDivElement>(null);
  const curtain1Ref  = useRef<HTMLDivElement>(null);
  const curtain2Ref  = useRef<HTMLDivElement>(null);
  const lineHRef     = useRef<HTMLDivElement>(null);
  const lineVRef     = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<(HTMLDivElement | null)[]>([]);
  const metaRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    // Lock scroll during load
    document.body.style.overflow = 'hidden';

    // ── Counter from 0 → 100 ──────────────────────────────────────
    let count = 0;
    const duration = 2600; // ms
    const start    = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease the counter — slow start, fast middle, slow end
      const eased    = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const next = Math.floor(eased * 100);

      if (next !== count) {
        count = next;
        if (counterRef.current)
          counterRef.current.textContent = String(count).padStart(3, '0');
        if (fillRef.current)
          fillRef.current.style.transform = `scaleX(${eased})`;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (counterRef.current) counterRef.current.textContent = '100';
        if (fillRef.current)    fillRef.current.style.transform = 'scaleX(1)';
        playExit();
      }
    };

    requestAnimationFrame(tick);

    // ── Entry micro-animations ────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Crosshair lines grow in
    tl.fromTo(lineHRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, transformOrigin: 'left' }
    , 0)
    .fromTo(lineVRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.2, transformOrigin: 'top' }
    , 0)

    // Diamond logo mark
    .fromTo(logoRef.current,
      { scale: 0.6, opacity: 0, rotate: -45 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.0 }
    , 0.2)

    // Tagline words stagger in
    .fromTo(taglineRef.current?.querySelectorAll('[data-word]') ?? [],
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.9, stagger: 0.08 }
    , 0.5)

    // Corner dots
    .fromTo(dotsRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.06 }
    , 0.3)

    // Meta labels
    .fromTo(metaRefs.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }
    , 0.6);

    // ── Exit sequence ─────────────────────────────────────────────
    const playExit = () => {
      const exit = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        },
      });

      // Everything contracts/fades first
      exit
        .to(taglineRef.current?.querySelectorAll('[data-word]') ?? [], {
          y: '-110%', opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.in',
        }, 0)
        .to(logoRef.current, {
          scale: 0.8, opacity: 0, duration: 0.4, ease: 'power3.in',
        }, 0.05)
        .to([lineHRef.current, lineVRef.current], {
          opacity: 0, duration: 0.3,
        }, 0.1)
        .to(dotsRef.current, {
          scale: 0, opacity: 0, duration: 0.3, stagger: 0.04,
        }, 0)
        .to(metaRefs.current, {
          opacity: 0, duration: 0.25,
        }, 0)

        // Curtains wipe up — reveal the page beneath
        .set(curtain1Ref.current, { yPercent: 0 }, 0.35)
        .set(curtain2Ref.current, { yPercent: 0 }, 0.35)
        .to(curtain1Ref.current, {
          yPercent: -100, duration: 0.9, ease: 'expo.inOut',
        }, 0.35)
        .to(curtain2Ref.current, {
          yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.08,
        }, 0.35)

        // Finally fade the loader shell itself
        .to(el, { opacity: 0, duration: 0.3 }, 1.1);
    };

    return () => {
      document.body.style.overflow = '';
      gsap.killTweensOf([
        loaderRef.current,
        logoRef.current,
        taglineRef.current,
        lineHRef.current,
        lineVRef.current,
        curtain1Ref.current,
        curtain2Ref.current,
        ...dotsRef.current,
        ...metaRefs.current,
      ]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CORNER_DOTS = [
    'top-8 left-8',
    'top-8 right-8',
    'bottom-8 left-8',
    'bottom-8 right-8',
  ];

  const META = [
    { text: 'INITIALISING ARCHIVE',  pos: 'top-8   left-1/2 -translate-x-1/2' },
    { text: 'GENESIS EDITION / 888', pos: 'bottom-8 left-1/2 -translate-x-1/2' },
    { text: 'EST. 2024',             pos: 'top-1/2 right-10 -translate-y-1/2'  },
  ];

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[500] bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* ── CURTAINS (exit wipe) ── */}
      <div
        ref={curtain1Ref}
        className="absolute inset-0 bg-[#080808] z-40 translate-y-full"
      />
      <div
        ref={curtain2Ref}
        className="absolute inset-0 z-40 translate-y-full"
        style={{ background: '#e91e8c' }}
      />

      {/* ── CROSSHAIR ── */}
      <div
        ref={lineHRef}
        className="absolute top-1/2 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
      <div
        ref={lineVRef}
        className="absolute left-1/2 top-0 bottom-0 w-[1px] pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />

      {/* ── CORNER DOTS ── */}
      {CORNER_DOTS.map((pos, i) => (
        <div
          key={i}
          ref={el => { dotsRef.current[i] = el; }}
          className={`absolute ${pos} flex items-center justify-center`}
        >
          <div className="w-[5px] h-[5px] bg-[#e91e8c] rotate-45" />
        </div>
      ))}

      {/* ── META LABELS ── */}
      {META.map((m, i) => (
        <span
          key={i}
          ref={el => { metaRefs.current[i] = el; }}
          className={`absolute ${m.pos} text-[8px] md:text-[9px] tracking-[0.5em] uppercase font-bold text-white/20`}
        >
          {m.text}
        </span>
      ))}

      {/* ── DASHED FRAME ── */}
      <div className="absolute inset-8 md:inset-16 border border-dashed border-white/5 pointer-events-none" />

      {/* ── CENTER CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10">

        {/* Diamond logo mark */}
        <div
          ref={logoRef}
          className="relative flex items-center justify-center"
          style={{ width: 56, height: 56 }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 border border-[#e91e8c]/20 rotate-45" />
          {/* Inner diamond */}
          <div className="absolute border border-[#e91e8c]/60 rotate-45"
            style={{ width: 28, height: 28 }}
          />
          {/* Core dot */}
          <div className="w-[5px] h-[5px] bg-[#e91e8c] rounded-full" />
        </div>

        {/* Wordmark */}
        <div ref={taglineRef} className="flex flex-col items-center gap-1 overflow-hidden">
          {['THE', 'BEAKS'].map((word, i) => (
            <div key={i} className="overflow-hidden">
              <span
                data-word
                className="block font-heading uppercase font-black text-white tracking-[0.15em]"
                style={{ fontSize: i === 0 ? 'clamp(2rem, 5vw, 4rem)' : 'clamp(3.2rem, 8vw, 7rem)', lineHeight: 0.85 }}
              >
                {word}
              </span>
            </div>
          ))}
          <div className="overflow-hidden mt-3">
            <span
              data-word
              className="block text-[8px] md:text-[9px] tracking-[0.7em] uppercase font-bold"
              style={{ color: '#e91e8c' }}
            >
              GENESIS ARCHIVE
            </span>
          </div>
        </div>

        {/* Counter + progress bar */}
        <div className="flex flex-col items-center gap-3 mt-4 w-[180px] md:w-[220px]">
          {/* Bar */}
          <div className="w-full h-[1px] bg-white/8 relative overflow-hidden">
            <div
              ref={fillRef}
              className="absolute inset-0 origin-left"
              style={{ background: '#e91e8c', transform: 'scaleX(0)' }}
            />
          </div>

          {/* Counter row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/25 font-bold">
              Loading
            </span>
            <span
              ref={counterRef}
              className="font-heading font-black text-white/60 tabular-nums"
              style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', letterSpacing: '0.05em' }}
            >
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}