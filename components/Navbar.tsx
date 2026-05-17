'use client';
 
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
 
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
 
const NAV_LINKS = [
  { label: 'Hero',        href: '#hero',       index: '00' },
  { label: 'Manifesto',   href: '#manifesto',  index: '01' },
  { label: 'Collection',  href: '#collection', index: '02' },
  { label: 'Archive',     href: '#artsection', index: '03' },
  { label: 'Origin',      href: '#origin',     index: '04' },
  { label: 'Connect',      href: '#connect',     index: '05' },
];
 
export default function Navbar() {
  const navRef        = useRef<HTMLElement>(null);
  const logoRef       = useRef<HTMLDivElement>(null);
  const menuRef       = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const linkRefs      = useRef<(HTMLAnchorElement | null)[]>([]);
  const line1Ref      = useRef<HTMLDivElement>(null);
  const line2Ref      = useRef<HTMLDivElement>(null);
  const menuBtnRef    = useRef<HTMLButtonElement>(null);
 
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [activeSection, setActive]    = useState('00');
 
  // ── Entry animation ────────────────────────────────────────────────
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
 
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
 
    gsap.set(el, { opacity: 0 });
 
    tl.to(el,          { opacity: 1, duration: 0.1 })
      .from(logoRef.current, { x: -30, opacity: 0, duration: 1.1 })
      .from(menuBtnRef.current, { x: 30, opacity: 0, duration: 1.1 }, '<');
 
  }, []);
 
  // ── Scroll: shrink nav + track active section ──────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
 
      // Find active section
      const sections = NAV_LINKS.map(l => ({
        index: l.index,
        el: document.querySelector(l.href),
      }));
 
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.el) {
          const top = (s.el as HTMLElement).getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.5) {
            setActive(s.index);
            break;
          }
        }
      }
    };
 
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 
  // ── Menu open / close animation ────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const links   = linkRefs.current.filter(Boolean);
    if (!overlay) return;
 
    if (menuOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
 
      gsap.set(overlay, { display: 'flex' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
 
      tl.fromTo(overlay,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.75 }
      )
      .fromTo(links,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.8, stagger: 0.07 },
        '-=0.4'
      );
 
      // Animate burger → X
      gsap.to(line1Ref.current, { rotate: 45,  y: 5,  duration: 0.4, ease: 'power3.out' });
      gsap.to(line2Ref.current, { rotate: -45, y: -3.5, scaleX: 1, duration: 0.4, ease: 'power3.out' });
 
    } else {
      document.body.style.overflow = '';
 
      const tl = gsap.timeline({ defaults: { ease: 'expo.in' } });
 
      tl.to(links, { y: '-110%', opacity: 0, duration: 0.4, stagger: 0.04 })
        .to(overlay,
          { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' },
          '-=0.2'
        )
        .set(overlay, { display: 'none' });
 
      // Animate X → burger
      gsap.to(line1Ref.current, { rotate: 0, y: 0,   duration: 0.4, ease: 'power3.out' });
      gsap.to(line2Ref.current, { rotate: 0, y: 0, scaleX: 0.625, duration: 0.4, ease: 'power3.out' });
    }
  }, [menuOpen]);
 
  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    
    // Slight delay to allow menu animation to start closing
    setTimeout(() => {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: href,
          autoKill: true
        },
        ease: 'expo.inOut'
      });
    }, 400);
  };
 
  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-700"
        style={{
          padding: scrolled ? '16px 32px' : '28px 40px',
          background: scrolled
            ? 'rgba(8,8,8,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3 cursor-pointer z-[101]"
          onClick={() => handleLinkClick('#hero')}
        >
          <div
            className="flex-shrink-0 border border-[#e91e8c] rotate-45 transition-all duration-500"
            style={{ width: scrolled ? 14 : 17, height: scrolled ? 14 : 17 }}
          />
          <span
            className="font-heading uppercase font-black tracking-[0.28em] text-white transition-all duration-500"
            style={{ fontSize: scrolled ? '9px' : '11px' }}
          >
            THE BEAKS
          </span>
        </div>
 
        {/* Active section indicator — desktop */}
        <div className="hidden md:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          <span className="text-[9px] tracking-[0.5em] uppercase text-[#e91e8c] font-bold">
            {activeSection}
          </span>
          <div className="w-8 h-[1px] bg-white/15" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/25 font-medium">
            {NAV_LINKS.find(l => l.index === activeSection)?.label ?? 'HERO'}
          </span>
        </div>
 
        {/* Burger */}
        <button
          ref={menuBtnRef}
          onClick={() => setMenuOpen(o => !o)}
          className="flex flex-col gap-[5px] items-end cursor-pointer z-[101] group"
          aria-label="Toggle menu"
        >
          <div
            ref={line1Ref}
            className="h-[1px] bg-white origin-center"
            style={{ width: 28 }}
          />
          <div
            ref={line2Ref}
            className="h-[1px] bg-white origin-center"
            style={{ width: 18 }}  // shorter second line
          />
        </button>
      </nav>
 
      {/* ── FULLSCREEN MENU OVERLAY ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[99] bg-[#080808] flex flex-col items-start justify-center"
        style={{
          display: 'none',
          clipPath: 'inset(0 0 100% 0)',
          padding: 'clamp(80px, 12vh, 140px) clamp(40px, 10vw, 160px)',
        }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(233,30,140,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
 
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(233,30,140,0.06) 0%, transparent 60%)' }}
        />
 
        {/* Decorative index label */}
        <span
          className="absolute top-8 right-10 text-[9px] tracking-[0.5em] uppercase text-white/15 font-bold hidden md:block"
        >
          NAVIGATION / ARCHIVE
        </span>
 
        {/* Links */}
        <div ref={menuRef} className="relative z-10 flex flex-col gap-2 md:gap-0 w-full">
          {NAV_LINKS.map((link, i) => (
            <div key={link.index} className="overflow-hidden border-b border-white/5 py-3 md:py-5">
              <a
                ref={el => { linkRefs.current[i] = el; }}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                className="flex items-end gap-6 md:gap-10 group cursor-pointer w-full"
              >
                {/* Index */}
                <span className="text-[10px] tracking-[0.4em] text-[#e91e8c] font-bold mb-1 md:mb-2 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {link.index}
                </span>
 
                {/* Label */}
                <span
                  className="font-heading uppercase font-black text-white leading-none tracking-[-0.03em] group-hover:text-[#e91e8c] transition-colors duration-500"
                  style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
                >
                  {link.label}
                </span>
 
                {/* Arrow — appears on hover */}
                <span
                  className="ml-auto text-[#e91e8c] opacity-0 group-hover:opacity-100 transition-all duration-400 translate-x-[-10px] group-hover:translate-x-0 text-2xl md:text-4xl mb-1 md:mb-2 flex-shrink-0"
                >
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
 
        {/* Bottom meta */}
        <div className="absolute bottom-8 left-[clamp(40px,10vw,160px)] right-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-[1px] h-8 bg-white/10" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-white/20 font-medium">
              888 Artifacts · Genesis Edition
            </span>
          </div>
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/20 font-medium hidden md:block">
            EST. 2024
          </span>
        </div>
      </div>
    </>
  );
}
 