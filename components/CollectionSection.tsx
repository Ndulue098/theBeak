'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArtworkCard from './ArtworkCard';

gsap.registerPlugin(ScrollTrigger);

const artworks = [
  { title: "The Sovereign Observer", image: "/images/pic1.jpg", id: "01" },
  { title: "Static Bloom", image: "/images/pic2.jpg", id: "02" },
  { title: "Ghost in the Flock", image: "/images/pic3.jpg", id: "03" },
  { title: "The Classic Beak", image: "/images/pic4.jpg", id: "04" },
  { title: "Viper & Velvet", image: "/images/pic5.jpg", id: "05" },
];

const CollectionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = React.useState<{ top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate particles on client only to avoid hydration mismatch
    const newParticles = [...Array(25)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${7 + Math.random() * 12}s`,
    }));
    requestAnimationFrame(() => {
      setParticles(newParticles);
    });
  }, []);

  useEffect(() => {
  if (!containerRef.current || !horizontalRef.current) return;

  const ctx = gsap.context(() => {
    const horizontal = horizontalRef.current!;

    const scrollTween = gsap.to(horizontal, {
      x: () => -(horizontal.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        // ✅ correct end — scrollable distance only, not full scrollWidth
        end: () => `+=${horizontal.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1.5,           // ✅ slower scrub — less jumpy feel
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current)
            progressRef.current.style.width = `${self.progress * 100}%`;
        },
      },
    });

    const cards = gsap.utils.toArray<HTMLElement>('.artwork-card');

    cards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>('.artwork-card-inner');
      if (!inner) return;

      // ✅ Entry — blur fades out and card grows as it approaches center
      // Wide start/end range = gradual, not snappy
      gsap.fromTo(inner,
        {
          scale: 0.82,
          filter: 'blur(14px)',
          opacity: 0.25,
        },
        {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power1.out',   // ✅ power1 not power2 — more linear, less pop
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: 'left right',          // ✅ starts animating as soon as card enters viewport
            end: 'center center-=5%',     // ✅ fully revealed when card hits center
            scrub: 2,                     // ✅ lagged scrub — feels slow and deliberate
          },
        }
      );

      // ✅ Exit — card shrinks and blurs as it leaves center
      gsap.fromTo(inner,
        {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
        },
        {
          scale: 0.82,
          filter: 'blur(14px)',
          opacity: 0.25,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: 'center center+=5%',   // ✅ starts fading just after center
            end: 'right left',            // ✅ fully gone when card exits left of viewport
            scrub: 2,
          },
        }
      );
    });

    // Float on inner — unchanged
    const inners = gsap.utils.toArray<HTMLElement>('.artwork-card-inner');
    inners.forEach((inner, i) => {
      gsap.to(inner, {
        y: -12,
        duration: 3 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    gsap.to('.bg-title', {
      x: -300,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

  }, containerRef);

  return () => ctx.revert();
  }, []);

  return (
    <section 
      id="collection"
      ref={containerRef} 
      className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden"
    >
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(240,106,167,0.05)_0%,transparent_60%)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(157,124,74,0.05)_0%,transparent_60%)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 text-white">
          {particles.map((p, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-brand-pink/30 rounded-full blur-[0.5px] animate-pulse"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
            />
          ))}
        </div>
      </div>

      {/* Massive Editorial Background Title */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 select-none z-0 overflow-hidden pointer-events-none">
        <h2 className="bg-title font-heading uppercase font-bold text-brand-text/[0.03] leading-[0.8] whitespace-nowrap" style={{ fontSize: 'min(25vw, 40vh)' }}>
          FLOCK
        </h2>
      </div>

      {/* Horizontal Content Carrier */}
      <div 
        ref={horizontalRef} 
        className="relative h-full flex items-center gap-[10vw] sm:gap-[15vw] px-6 sm:px-[15vw] z-20"
      >
        {/* Intro Space */}
        <div className="flex-shrink-0 sm:w-[40vw] w-[70vw] flex flex-col justify-center">
            <span className="text-brand-pink text-[10px] sm:text-[12px] tracking-[0.4em] font-bold uppercase mb-6">/ CATALOGUE.001</span>
            <h3 className="text-[clamp(2.5rem,8vw,8rem)] font-heading font-bold text-white leading-[0.9] uppercase tracking-tighter mb-10">
                Artifacts<br/> From The<br />Archive
            </h3>
            <div className="w-20 h-[1px] bg-brand-pink/40 " />
        </div>

        {artworks.map((art, i) => (
          <ArtworkCard 
            key={i} 
            image={art.image} 
            title={art.title} 
            index={art.id} 
          />
        ))}

        {/* Outro Space */}
        <div className="flex-shrink-0 w-[40vw] flex flex-col justify-center text-right items-end mr-10 md:mr-20">
            <h3 className="text-[clamp(2rem,8vw,8rem)] font-heading font-bold text-white leading-[0.9] uppercase tracking-tighter mb-10 opacity-20">
                The Flock<br />Expands
            </h3>
            <span className="text-brand-pink text-[9px] md:text-[10px] tracking-[0.4em] font-bold uppercase">Archive Established: 2024</span>
        </div>
        
        <div className="flex-shrink-0 w-[10vw] md:w-[12vw] flex flex-col justify-center text-right items-end mr-10 md:mr-10">
          <h2 className="text-[10px] tracking-[1em] opacity-10 uppercase font-mono">End</h2>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 md:gap-6">
        <span className="text-[8px] md:text-[9px] tracking-[0.3em] font-bold text-brand-text-secondary uppercase">Exploration</span>
        <div className="w-32 sm:w-48 h-[1px] bg-white/10 relative">
          <div 
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-brand-pink collection-progress-bar" 
            style={{ width: '0%' }} 
          />
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
