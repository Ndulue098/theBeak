'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const OriginSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !leftColRef.current || !rightColRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Pin the left side on desktop
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false, // In this specific layout, right col drives height, so false is okay IF section has height
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Pin the top header on mobile
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });
    });

    const ctx = gsap.context(() => {
      // Animate fragments on scroll
      const fragments = gsap.utils.toArray('.archive-fragment');
      fragments.forEach((fragment: any) => {
        gsap.fromTo(fragment, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: fragment,
              start: "top 85%", // Trigger earlier
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Parallax effect for images inside fragments
      const fragmentImages = gsap.utils.toArray('.fragment-image');
      fragmentImages.forEach((img: any) => {
        gsap.to(img, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="origin" ref={sectionRef} className="relative w-full bg-brand-bg text-brand-text pt-0 pb-20 md:py-0 overflow-hidden">
      {/* Background Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen" 
        style={{ backgroundImage: `radial-gradient(circle, var(--color-brand-text) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
      />
      
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row relative">
        
        {/* LEFT SIDEBAR AREA - Pinned */}
        <div 
          ref={leftColRef} 
          className="w-full md:w-[40%] h-[32vh] md:h-screen flex flex-col justify-between pt-[72px] pb-6 px-6 sm:p-12 lg:p-16 xl:p-24 z-30 md:border-r border-brand-text-secondary/20 bg-brand-bg/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-b md:border-b-0 border-brand-text-secondary/10"
        >
          <div className="pt-2 md:pt-0">
            <span className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase text-brand-text-secondary block mb-3 md:mb-8 font-bold">
              / ARCHIVE.001
            </span>
            <h2 className="font-heading uppercase font-semibold leading-[0.82] tracking-[-0.08em]" style={{ fontSize: 'clamp(2.5rem, 8vw, 10rem)' }}>
              THE<br /><span className="text-brand-pink">ORIGIN</span>
            </h2>
          </div>

          <div className="max-w-xs mt-4 md:mt-0 hidden md:block">
            <p className="text-[13px] tracking-[0.14em] leading-[1.9] text-brand-text-secondary uppercase mb-8">
              The first documented emergence of the flock. The birds were never intended for flight. They were intended for forever.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-brand-pink/30" />
                <span className="text-[9px] tracking-[0.3em] font-medium text-brand-text-secondary uppercase">Scroll to explore</span>
              </div>
              <span className="text-[9px] tracking-[0.3em] font-medium text-brand-text-secondary uppercase opacity-50">
                -25.748 / 28.224
              </span>
            </div>
          </div>

          {/* Mobile Scroll Indicator Mini */}
          <div className="md:hidden flex items-center gap-4 opacity-50">
            <div className="w-8 h-[1px] bg-brand-pink/30" />
            <span className="text-[8px] tracking-[0.3em] uppercase">Genesis.1</span>
          </div>
        </div>

        {/* RIGHT CONTENT GRID */}
        <div ref={rightColRef} className="w-full md:w-[60%] flex flex-col gap-24 sm:gap-40 md:gap-60 lg:gap-80 py-12 sm:py-20 px-6 sm:px-8 md:px-12 lg:pr-24">
          
          {/* FRAGMENT 01 — THE CREATOR */}
          <div className="archive-fragment group relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-12 lg:col-span-5 z-10">
               <div className="mb-4 inline-block px-2 py-1 bg-brand-pink/10 border border-brand-pink/20 text-[8px] tracking-[0.4em] font-bold text-brand-pink">
                DOSSIER // 01
               </div>
               <h3 className="text-[22px] sm:text-[24px] md:text-[32px] font-heading font-bold leading-tight mb-4 md:mb-6">
                He did not create characters.<br className="hidden sm:block" />
                He <span className="text-[#7A2E1F]">preserved species.</span>
               </h3>
               <p className="text-[12px] md:text-[13px] tracking-[0.14em] leading-[1.7] md:leading-[1.9] text-brand-text-secondary uppercase mb-6 md:mb-8">
                Years of private studies.<br />
                Thousands of sketches.<br />
                One vision.
               </p>
               <motion.button 
                whileHover={{ x: 10 }}
                className="text-[10px] tracking-[0.4em] uppercase font-bold border-b border-brand-pink/40 pb-2 hover:text-brand-pink transition-colors"
               >
                Read the Archive &rarr;
               </motion.button>
               
               <div className="mt-12 hidden md:block">
                 <p className="font-serif italic text-brand-pink/60 text-[18px] leading-relaxed max-w-[200px]">
                    &ldquo;The lines were not drawn, they were discovered in the silence of the studio.&rdquo;
                 </p>
                 <span className="text-[8px] tracking-widest uppercase opacity-30 block mt-2">- Studio Journals</span>
               </div>
            </div>
            
            <div className="md:col-span-12 lg:col-span-7 relative group">
              <div className="absolute -inset-4 border border-brand-text/5 -rotate-2 pointer-events-none" />
              <div className="absolute inset-0 bg-brand-pink/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative aspect-[4/5] overflow-hidden grayscale brightness-75 contrast-125 border border-white/5 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100">
                <Image 
                  src="/images/artist.jpg"
                  alt="The Creator"
                  fill
                  className="object-cover fragment-image"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tape overlays */}
              <div className="absolute -top-4 left-1/4 w-20 h-8 bg-white/5 backdrop-blur-md -rotate-6 z-20 border border-white/10 opacity-40" />
              <div className="absolute -bottom-6 right-1/3 w-16 h-10 bg-white/5 backdrop-blur-sm rotate-12 z-20 border border-white/10 opacity-30" />
              
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-[9px] tracking-widest border border-white/10 font-bold mix-blend-difference">
                REF: SUB-001
              </div>

              {/* Archival metadata */}
              <div className="absolute -right-8 top-1/2 -rotate-90 origin-right text-[8px] tracking-[0.6em] text-brand-text-secondary opacity-20 hidden xl:block">
                DNA_EXTRACTION_SEQUENCE_042
              </div>
            </div>
          </div>

          {/* FRAGMENT 02 — THE INSPIRATION */}
          <div className="archive-fragment group relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Image (Left) */}
            <div className="md:col-span-12 lg:col-span-7 relative group order-2 lg:order-1">
              <div className="absolute -inset-4 border border-brand-text/5 rotate-2 pointer-events-none" />
              <div className="absolute inset-0 bg-brand-pink/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative aspect-[4/5] overflow-hidden saturate-0 brightness-75 contrast-125 border border-white/5 transition-all duration-700 group-hover:saturate-100 group-hover:brightness-100 group-hover:contrast-100">
                <Image 
                  src="https://picsum.photos/seed/statue/800/1000"
                  alt="The Inspiration"
                  fill
                  className="object-cover fragment-image"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tape overlays */}
              <div className="absolute -bottom-4 left-1/3 w-20 h-8 bg-white/5 backdrop-blur-md rotate-6 z-20 border border-white/10 opacity-40" />
              
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-[9px] tracking-widest border border-white/10 font-bold mix-blend-difference">
                SPECIMEN: X-09
              </div>

              {/* Floating Keywords Style */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 space-y-2 hidden xl:block pointer-events-none">
                {['RITUAL', 'DECAY', 'GEOMETRY'].map((word) => (
                  <div key={word} className="text-[10px] tracking-[0.5em] text-brand-text-secondary opacity-20 uppercase font-mono">
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Text (Right) */}
            <div className="md:col-span-12 lg:col-span-5 z-10 order-1 lg:order-2 lg:pl-12">
               <div className="mb-4 inline-block px-2 py-1 bg-brand-pink/10 border border-brand-pink/20 text-[8px] tracking-[0.4em] font-bold text-brand-pink">
                DOSSIER // 02
               </div>
               <h3 className="text-[22px] sm:text-[24px] md:text-[32px] font-heading font-bold leading-tight mb-4 md:mb-6">
                Nature is not a background.<br className="hidden sm:block" />
                It is <span className="text-[#7A2E1F]">the blueprint.</span>
               </h3>
               <p className="text-[12px] md:text-[13px] tracking-[0.14em] leading-[1.7] md:leading-[1.9] text-brand-text-secondary uppercase mb-6 md:mb-8">
               Obsessive studies of skeletal structures,
growth patterns,
and organic symmetry.

Every form was earned through observation.

               </p>
               
               <div className="mt-12 hidden md:block">
                 <p className="font-serif italic text-brand-pink/60 text-[18px] leading-relaxed max-w-[240px]">
                    &ldquo;We did not invent these creatures.
We uncovered them.&rdquo;
                 </p>
                 <span className="text-[8px] tracking-widest uppercase opacity-30 block mt-2">- Archive Notes </span>
               </div>
            </div>
          </div>

          {/* FRAGMENT 03 — THE COMMUNITY */}
          <div className="archive-fragment group relative grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
             <div className="md:col-span-7 order-2 md:order-1 relative">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10  backdrop-blur-md p-6 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-brand-pink/40 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                             <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-brand-pink/20 border border-brand-pink/30" />
                                <div className="space-y-1 flex-1">
                                    <div className="w-24 h-2 bg-white/20 rounded-full" />
                                    <div className="w-16 h-1 bg-white/10 rounded-full" />
                                </div>
                             </div>
                             <div className="space-y-3">
                                <div className="w-full h-1.5 bg-white/10 rounded-full" />
                                <div className="w-11/12 h-1.5 bg-white/10 rounded-full" />
                                <div className="w-2/3 h-1.5 bg-white/5 rounded-full" />
                             </div>
                             <div className="mt-8 flex justify-between items-center opacity-40">
                                <div className="flex gap-2"><div className="w-2 h-2 bg-white/20"/> <div className="w-8 h-2 bg-white/10"/></div>
                                <span className="text-[7px] font-mono">02:14:42</span>
                             </div>
                        </div>
                        <div className="aspect-video relative grayscale opacity-40 brightness-50 border border-white/5 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100">
                             <Image 
                                src="https://picsum.photos/seed/community1/600/400"
                                alt="Community"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 pt-12">
                         <div className="aspect-square relative grayscale opacity-40 brightness-75 border border-white/5 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100">
                             <Image 
                                src="https://images.unsplash.com/photo-1543260775-945c562403b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxhbWluZ28lMjBmbG9ja3xlbnwwfHwwfHx8MA%3D%3D"
                                alt="Community"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="bg-brand-pink/5 border border-brand-pink/10 backdrop-blur-md p-6 relative overflow-hidden">
                             <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse" />
                             <p className="text-[10px] tracking-[0.2em] font-bold text-brand-pink mb-4">FEEDBACK RECEIVED</p>
                             <div className="space-y-2 opacity-30">
                                <div className="w-full h-[1px] bg-brand-pink" />
                                <div className="w-full h-[1px] bg-brand-pink" />
                                <div className="w-1/2 h-[1px] bg-brand-pink" />
                             </div>
                             <span className="absolute bottom-4 right-4 text-[10px] text-brand-pink/40 font-bold font-mono">LIVE // SYNC</span>
                        </div>
                    </div>
                </div>
                
                {/* Float Labels */}
                <span className="absolute -top-10 right-0 text-[40px] font-heading font-bold opacity-5 uppercase tracking-tighter">Obsessive</span>
                <span className="absolute -bottom-10 left-0 text-[40px] font-heading font-bold opacity-5 uppercase tracking-tighter text-brand-pink">Cult-like</span>
             </div>

             <div className="md:col-span-5 order-1 md:order-2">
                <h3 className="text-[22px] sm:text-[24px] md:text-[32px] font-heading font-bold leading-tight mb-4 md:mb-6">
                    The Flock is not an audience.<br className="hidden sm:block" />
                    It is <span className="text-[#7A2E1F]">part of the work.</span>
                </h3>
                <div className="flex flex-wrap gap-4 opacity-40 text-[9px] tracking-[0.3em] font-bold">
                    <span>COLLECTORS</span>
                    <span>/</span>
                    <span>CURATORS</span>
                    <span>/</span>
                    <span>BUILDERS</span>
                    <span>/</span>
                    <span>BELIEVERS</span>
                </div>
             </div>
          </div>

          {/* FRAGMENT 04 — THE PHILOSOPHY */}
          <div className="archive-fragment relative py-20 sm:py-32 md:py-40 border-t border-brand-text-secondary/20 flex flex-col items-center justify-center text-center">
             <span className="text-[9px] md:text-[10px] tracking-[0.5em] text-brand-gold uppercase font-bold mb-6 md:mb-8 italic">Philosophy</span>
             <h3 className="font-heading font-bold leading-none tracking-tighter uppercase mb-10 md:mb-12" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
                Collecting is <span className="text-[#7A2E1F]">remembering.</span>
             </h3>
             
             <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 max-w-2xl px-4">
                {['We don’t chase rarity.', 'We preserve meaning.', 'The rarest thing is taste.', 'The flock remembers', 'This was built to remain'].map((quote) => (
                  <span key={quote} className="text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] text-brand-text-secondary uppercase font-medium">
                    {quote}
                  </span>
                ))}
             </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default OriginSection;
