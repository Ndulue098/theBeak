'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { motion } from 'framer-motion';

export default function FlamingoReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Movement proxy
    const pos = { x: 0, y: 0, r: 0 };
    const mouse = { x: 0, y: 0 };

    const xTo = gsap.quickTo(pos, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(pos, 'y', { duration: 0.8, ease: 'power3.out' });
    const rTo = gsap.quickTo(pos, 'r', { duration: 1.2, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouse.x = x;
      mouse.y = y;
      
      xTo(x);
      yTo(y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        mouse.x = x;
        mouse.y = y;
        
        xTo(x);
        yTo(y);
        rTo(window.innerWidth < 768 ? 150 : 250);
      }
    };

    const handleMouseEnter = () => rTo(window.innerWidth < 768 ? 150 : 250);
    const handleMouseLeave = () => rTo(0);
    const handleTouchStart = () => rTo(window.innerWidth < 768 ? 150 : 250);
    const handleTouchEnd = () => rTo(0);

    // Update function for custom animation loop
    const update = () => {
      if (revealsRef.current) {
        gsap.set(revealsRef.current, {
          clipPath: `circle(${pos.r}px at ${pos.x}px ${pos.y}px)`,
        });
      }
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: pos.x,
          y: pos.y,
          width: pos.r * 1.6,
          height: pos.r * 1.6,
        });
      }
    };

    gsap.ticker.add(update);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      gsap.ticker.remove(update);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-none group bg-brand-bg md:rounded-r-[4vw]"
    >
      {/* Base Layer: Top Image (Default) */}
      <div className="absolute inset-0">
        <Image 
          src="/images/ftop.jpg"
          alt="Realistic Flamingo"
          fill
          className="object-cover scale-110 group-hover:scale-105 transition-transform duration-[3s] ease-out brightness-[0.9]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Mask Layer: Bottom Image (Revealed on Hover) */}
      <div 
        ref={revealsRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'circle(0px at 50% 50%)' }}
      >
        <Image 
          src="/images/fbottom.jpg"
          alt="Artistic Flamingo"
          fill
          className="object-cover scale-110 group-hover:scale-105 transition-transform duration-[3s] ease-out"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Interactive Cursor Guide */}
      <div 
        ref={cursorRef}
        className="absolute top-0 left-0 w-[400px] h-[400px] border border-brand-pink/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20 hidden group-hover:block"
      >
        <div className="absolute inset-0 rounded-full bg-brand-pink/5 blur-2xl" />
      </div>

      {/* Labels */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col gap-3 items-center"
        >
          <span className="text-[9px] tracking-[0.5em] text-brand-pink font-bold uppercase">DISCOVER THE ARCHIVE</span>
          <div className="w-1 h-1 bg-brand-pink rounded-full shadow-[0_0_10px_#FF1493]"></div>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-brand-pink/40 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-brand-pink/40 pointer-events-none" />
    </div>
  );
}

