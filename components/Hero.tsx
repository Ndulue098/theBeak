'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import SplitType from 'split-type';
import FlamingoReveal from './FlamingoReveal';

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headingRef.current) return;

      const split = new SplitType(headingRef.current, { types: 'chars' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Set initial states
      gsap.set('[data-ui], .hero-ui', { opacity: 0 });

      tl.from(split.chars, { y: 120, opacity: 0, stagger: 0.015, duration: 1.8 })
        .from('.manifesto-text p', { y: 40, opacity: 0, duration: 1.5 }, '-=1.4')
        .from('.cta-btn', { x: -40, opacity: 0, duration: 1.2 }, '-=1.0')
        .to('[data-ui], .hero-ui', { opacity: 1, stagger: 0.1, duration: 1 }, '-=0.5')
        .from('.hero-stat', { y: 40, opacity: 0, stagger: 0.1, duration: 1.2 }, '-=0.8')
        .from('.stat-divider', { scaleY: 0, duration: 1 }, '-=1')
        .from('.flamingo-container', { scale: 1.05, opacity: 0, duration: 2.5, ease: 'power4.out' }, 0.2);

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-brand-bg selection:bg-brand-pink selection:text-brand-bg">
      
      {/* Decorative Side Lines & Glows */}
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-brand-pink/20 to-transparent z-10 hidden md:block" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-brand-pink/5 blur-[120px] pointer-events-none" />
      
      <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-brand-pink/20 to-transparent z-10 hidden md:block" />
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-brand-pink/5 blur-[120px] pointer-events-none" />

      {/* Vertical Decorative Text */}
      <div className="absolute left-4 md:left-12 bottom-24 md:bottom-48 origin-bottom-left -rotate-90 text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-brand-text-secondary z-30 hero-ui whitespace-nowrap">
        EDITION.001 / GENESIS
      </div>

      {/* Left side content */}
      <div className="relative w-full md:w-[55%] xl:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 md:px-16 z-20 pt-32 md:pt-20 pb-12 md:pb-20">
        <div className="relative w-full max-w-4xl">
          {/* Huge Typography */}
          <div className="relative inline-block mb-10 md:mb-12 overflow-visible">
            <h1 
              ref={headingRef}
              className="font-heading uppercase font-semibold leading-[0.85]  md:leading-[0.83] tracking-[-0.03em] block"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 15rem)' }}
            >
              THE<br /><span className="-mt-1 md:-mt-4 block">BEAKS</span>
            </h1>
  
            <div className="absolute top-1  -right-6 md:-right-3.5 md:top-4 lg:right-8  lg:top-4   xl:right-14 xl:top-1 w-[80px] md:w-[100px] hero-ui">
              <p className="text-brand-pink text-[clamp(12px,1vw,18px)] italic tracking-tight sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold font-serif leading-tight">
                Art Became <br /> A Species.
              </p>
            </div>
          </div>
          
          <div className="max-w-md manifesto-text font-sans">
            <p className="text-brand-text-secondary text-[12px] sm:text-[13px] md:text-[14px] leading-[1.7] md:leading-[1.8] tracking-[0.05em] mb-10 md:mb-12 uppercase font-medium">
              Sculpted through chaos and precision.The Beaks is an evolving archive of engineered entities shaped by instinct, obsession, and modern myth.
            </p>
            
            <div className="flex flex-row items-center gap-6 sm:gap-12 mb-12 md:mb-20">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="cta-btn relative px-6 sm:px-10 py-4 md:py-5 border border-brand-text/30 text-[9px] md:text-[11px] tracking-[0.2em] uppercase overflow-hidden group hover:border-brand-pink transition-colors font-bold whitespace-nowrap"
              >
                <span className="relative z-10 text-brand-text">ENTER</span>
                <div className="absolute inset-0 bg-brand-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-20"></div>
              </motion.button>
              
              <div className="flex flex-col gap-0.5 hero-ui">
                <span className="text-[9px] text-brand-pink uppercase tracking-widest font-bold">Floor</span>
                <span className="text-[12px] sm:text-[14px] tracking-widest font-medium">- -ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats Section - No wrapping, scrolling on very small screens */}
        <div className="w-full flex items-end gap-x-6 sm:gap-x-10 lg:gap-x-12 overflow-x-auto no-scrollbar pb-2">
          {[
            { label: 'ARTWORKS', value: '001', color: 'text-brand-pink' },
            { label: 'COLLECTORS', value: '11K+', color: 'text-brand-text' },
            { label: 'ARCHIVE', value: 'LIVE', color: 'text-brand-text' },
          ].map((stat, i) => (
            <div key={i} className="flex items-end gap-6 sm:gap-10 lg:gap-12 flex-shrink-0">
              <div className="hero-stat flex flex-col gap-1 sm:gap-2">
                <span className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.2em] font-bold text-brand-text-secondary uppercase">
                  {stat.label}
                </span>
                <span className={`text-[clamp(1.4rem,3vw,3.2rem)] font-heading leading-none ${stat.color} tracking-tight font-bold`}>
                  {stat.value}
                </span>
              </div>
              {i < 3 && (
                <div className="stat-divider hidden sm:block w-[1px] h-8 sm:h-10 lg:h-14 bg-brand-text/15 origin-bottom" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right side reveal interaction */}
      <div className="relative w-full md:w-[50%] xl:w-1/2 min-h-[60vh] md:min-h-0 md:h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 flamingo-container">
        {/* Cinematic Background Lighting */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 40%, rgba(255, 20, 147, 0.08) 0%, transparent 60%)' }}></div>
        
        <div className="relative w-full aspect-square md:h-full md:aspect-auto max-w-3xl overflow-hidden bg-brand-bg shadow-2xl border border-brand-pink/20">
          <FlamingoReveal />
          {/* Label Tag */}
          <div className="absolute top-6 md:top-8 left-6 md:left-8 text-[9px] md:text-[10px] uppercase tracking-widest bg-black/60 px-3 md:px-4 py-1.5 md:py-2 z-30 border border-white/10 backdrop-blur-md hero-ui font-bold">
            ID: FL-0421
          </div>
        </div>
      </div>
    </section>
  );
}

