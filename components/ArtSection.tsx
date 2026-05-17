'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArtCard from './ArtCard';

gsap.registerPlugin(ScrollTrigger);

const specimens = [
  { id: '001', title: 'Shy Beak', image: '/images/beak1.jpg' },
  { id: '002', title: 'Sacred Poise', image: 'https://images.unsplash.com/photo-1619141242742-459c832db90e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGZsYW1pbmdvJTIwYmVha3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: '003', title: 'Angry Beak', image: '/images/beak2.jpg' },
  { id: '004', title: 'The Observer', image: 'https://images.unsplash.com/photo-1541804537-4cc080a81422?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZsYW1pbmdvJTIwYmVha3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: '005', title: 'Male Shy Hues', image: '/images/beak4.jpg' },
  { id: '006', title: 'Liminal Waters', image: 'https://images.unsplash.com/photo-1580579860154-f6b83cdd6543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY1fHxmbGFtaW5nbyUyMGJlYWt8ZW58MHx8MHx8fDA%3D' },
  { id: '007', title: 'Bold Beak', image: '/images/beak3.jpg' },
  { id: '008', title: 'Flago', image: 'https://images.unsplash.com/photo-1763959173275-69f198ec7cf7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcwfHxmbGFtaW5nbyUyMGJlYWt8ZW58MHx8MHx8fDA%3D' },
];

const ArtSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal header
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="artsection"
      ref={sectionRef} 
      className="relative w-full bg-[#090909] py-24 md:py-40 overflow-hidden"
    >
      {/* Background Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1800px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 xl:gap-52 relative">
          
          {/* LEFT: Heading & Intro */}
          <div ref={headerRef} className="lg:w-[35%] xl:w-[30%] flex flex-col justify-start lg:sticky lg:top-40 h-fit z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-4 h-4 border border-brand-pink/40 rotate-45" />
               <span className="text-[10px] md:text-[11px] tracking-[0.4em] font-medium text-[#8A8178] uppercase">
                 [ ART SECTION ]
               </span>
            </div>

            <h2 className="text-[clamp(3.5rem,7vw,8.5rem)] font-heading font-medium leading-[0.85] tracking-[-0.06em] text-brand-text uppercase mb-10">
              Curated<br />Specimens
            </h2>

            <p className="text-[13px] md:text-[15px] leading-relaxed tracking-wide text-brand-text-secondary max-w-[420px] mb-12">
              A curated collection of rare digital specimens from the Beaks universe. 
              Each piece is a unique expression of evolution and artistry, preserved 
              within the digital archive for the collective memory.
            </p>

            <a 
              href="#" 
              className="group flex items-center gap-6 text-[11px] md:text-[12px] tracking-[0.3em] font-bold text-brand-text uppercase w-fit"
            >
              <span className="relative">
                View Full Archive
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-brand-text transition-all duration-500 group-hover:w-full group-hover:bg-brand-pink" />
                <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-pink transition-all duration-500 group-hover:w-full" />
              </span>
              <span className="text-brand-pink transition-transform duration-500 group-hover:translate-x-3">&rarr;</span>
            </a>
          </div>

          {/* RIGHT: Grid with Technical UI */}
          <div className="lg:w-[65%] xl:w-[70%] relative">
            {/* Artwork Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 relative z-10 border-l border-t border-dashed border-white/10">
              {specimens.map((specimen, i) => (
                <div key={specimen.id} className="relative border-r border-b border-dashed border-white/10 group">
                  <ArtCard 
                    id={specimen.id}
                    title={specimen.title}
                    image={specimen.image}
                  />
                  
                  {/* Plus Sign Components at cell corners */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center z-20 pointer-events-none">
                    <div className="absolute w-3 h-[1px] bg-white/30" />
                    <div className="absolute h-3 w-[1px] bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArtSection;
