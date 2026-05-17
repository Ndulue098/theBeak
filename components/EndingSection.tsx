'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CONTACTS = [
  { label: 'X',      handle: '@thebeaksart',      link: 'https://x.com/thebeaksart' },
  { label: 'MAIL',   handle: 'christianndulue47@gmail.com', link: 'christianndulue47@gmail.com' },
  { label: 'SOURCE', handle: 'THEBEAKSART',        link: 'https://www.behance.net/Kashtalyan' },
];

type FormState = 'idle' | 'sending' | 'sent' | 'error';

const EndingSection: React.FC = () => {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const quoteRef    = useRef<HTMLHeadingElement>(null);
  const formPanelRef= useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);

  const [formOpen, setFormOpen]   = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [fields, setFields]       = useState({ name: '', email: '', message: '' });

  // ── Scroll animations ─────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      // Parallax background
      gsap.to(bgRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end:   'bottom top',
          scrub: true,
        },
      });

      // Quote reveal
      const quoteWords = quoteRef.current?.querySelectorAll('[data-word]') ?? [];
      gsap.fromTo(quoteWords,
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 1.2, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Bottom grid items
      gsap.from('[data-reveal]', {
        y: 40, opacity: 0,
        duration: 1.2, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: {
          trigger: '[data-reveal]',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Form panel open / close ───────────────────────────────────────
  useEffect(() => {
    const panel   = formPanelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    if (formOpen) {
      gsap.set([panel, overlay], { display: 'flex' });
      gsap.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );
      gsap.fromTo(panel,
        { clipPath: 'inset(0 0 100% 0)', y: 40 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.7, ease: 'expo.out' }
      );
      gsap.fromTo(panel.querySelectorAll('[data-field]'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'expo.out', delay: 0.3 }
      );
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
      gsap.to(panel, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5, ease: 'expo.in',
        onComplete: () => {
          gsap.set([panel, overlay], { display: 'none' });
          setFormState('idle');
          setFields({ name: '', email: '', message: '' });
        },
      });
    }
  }, [formOpen]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.message) return;

    setFormState('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      const result = await response.json();

      if (response.ok) {
        setFormState('sent');
      } else {
        console.error('Form error:', result.error);
        setFormState('error');
        // Reset to idle after a few seconds so they can try again
        setTimeout(() => setFormState('idle'), 3000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  return (
    <section
      id="connect"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#070707] overflow-hidden flex flex-col items-center justify-center"
    >

      {/* ── BACKGROUND IMAGE ── */}
      <div ref={bgRef} className="absolute inset-0 scale-110 z-0">
        <Image
          src="/images/endsection.jpg"
          alt="The Beaks Archive"
          fill
          priority
          className="object-cover"
        />
        {/* Multi-layer overlays for cinematic depth */}
        <div className="absolute inset-0 bg-[#070707]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/80 via-transparent to-[#070707]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035] mix-blend-screen"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}
      />

      {/* ── ARCHITECTURAL FRAME ── */}
      <div className="relative z-20 w-full max-w-[1700px] mx-auto min-h-screen flex flex-col justify-between px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-20 md:py-28">

        {/* Corner crosses - Pixel-perfect alignment with dashed border */}
        {[
          'top-4 left-4 md:top-8 md:left-8',
          'top-4 right-4 md:top-8 md:right-8',
          'bottom-4 left-4 md:bottom-8 md:left-8',
          'bottom-4 right-4 md:bottom-8 md:right-8',
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} -translate-x-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center z-30`}>
            <div className={`absolute ${i % 2 === 1 ? 'translate-x-full' : ''} ${i >= 2 ? 'translate-y-full' : ''}`}>
               {/* Centering logic: we want the center of the cross to be exactly at the pos */}
            </div>
            {/* Simple centered cross */}
            <div className="absolute w-5 h-[2px] bg-[#e91e8c]" />
            <div className="absolute h-5 w-[2px] bg-[#e91e8c]" />
          </div>
        ))}

        {/* Dashed border frame */}
        <div className="absolute inset-4 md:inset-8 border border-dashed border-white/8 pointer-events-none z-10" />

        {/* ── TOP LABEL ── */}
        <div className="flex justify-between items-center mb-16 md:mb-24">
          <span className="text-[9px] md:text-[10px] tracking-[0.55em] text-white/40 font-bold uppercase">
            [ THE BEAKS <span className="text-[#e91e8c]">ARCHIVE</span> ]
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.4em] text-white/20 font-bold uppercase hidden md:block">
            EST. 2024
          </span>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Quote */}
          <div className="mb-16 md:mb-20 max-w-5xl">
            <h2
              ref={quoteRef}
              className="font-serif italic text-white font-light leading-[0.88] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 10.5rem)' }}
            >
              {['Art became', 'a species of', 'its own.'].map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span data-word className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* Sub-grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-end">

            {/* LEFT — description + CTA */}
            <div className="flex flex-col gap-10">
              <div data-reveal className="flex items-start gap-5 max-w-md">
                <span className="text-[#e91e8c] font-mono mt-0.5 flex-shrink-0">+</span>
                <p className="text-[11px] md:text-[12px] leading-[2] tracking-[0.18em] uppercase text-white/40 font-medium">
                  Thank you for exploring the Beaks universe.
                  Every piece here is a trace, a memory,
                  a specimen from another dimension.
                </p>
              </div>

              {/* CTA — opens form */}
              <div data-reveal>
                <button
                  onClick={() => setFormOpen(true)}
                  className="group flex flex-col gap-3 text-left"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] md:text-[11px] tracking-[0.45em] font-bold uppercase text-[#e91e8c] group-hover:text-white transition-colors duration-500">
                      Learn more
                    </span>
                    <div className="h-[1px] flex-1 max-w-[100px] bg-[#e91e8c]/30 group-hover:bg-white/30 transition-colors duration-500" />
                    <span className="text-[#e91e8c] group-hover:translate-x-1 transition-transform duration-300 text-sm">→</span>
                  </div>
                  <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 group-hover:text-white/40 transition-colors duration-500 ml-0">
                    Open commission request
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT — contacts */}
            <div data-reveal className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-dashed border-white/10 pb-5">
                <span className="text-[9px] md:text-[10px] tracking-[0.5em] font-bold text-white/40 uppercase font-serif italic">
                  Archive Contacts
                </span>
                <span className="text-[#e91e8c] font-mono text-sm">+</span>
              </div>

              <ul className="flex flex-col gap-5">
                {CONTACTS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.link}
                      target="_blank"
  rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-dashed border-white/5 pb-4 hover:border-[#e91e8c]/20 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.3em] font-mono">
                        <span className="text-white/30 group-hover:text-[#e91e8c] transition-colors duration-300">{item.label}</span>
                        <span className="opacity-15">/</span>
                        <span className="text-white/60 group-hover:text-white transition-colors duration-300">{item.handle}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#e91e8c]/30 group-hover:text-[#e91e8c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-dashed border-white/8 flex flex-wrap justify-between items-center gap-4 text-[8px] md:text-[9px] tracking-[0.5em] font-bold text-white/15 uppercase font-mono">
          <span>MMXXIV</span>
          <span>Created BY Christian.N</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>

      {/* ── FORM OVERLAY ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm items-center justify-center"
        style={{ display: 'none' }}
        onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}
      >
        <div
          ref={formPanelRef}
          className="relative w-full max-w-2xl mx-4 bg-[#0a0a0a] border border-white/10 flex-col"
          style={{ display: 'none', clipPath: 'inset(0 0 100% 0)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Form header */}
          <div className="flex items-center justify-between px-8 md:px-12 py-7 border-b border-white/8">
            <div data-field className="flex items-center gap-4">
              <div className="w-3 h-3 border border-[#e91e8c] rotate-45 flex-shrink-0" />
              <span className="text-[9px] tracking-[0.5em] uppercase font-bold text-white/60">
                Commission Request
              </span>
            </div>
            <button
              onClick={() => setFormOpen(false)}
              className="text-white/30 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {formState === 'sent' ? (
            // ── Success state ──
            <div className="px-8 md:px-12 py-16 flex flex-col items-center text-center gap-6">
              <div className="w-12 h-12 border border-[#e91e8c]/40 rotate-45 flex items-center justify-center">
                <div className="w-6 h-6 bg-[#e91e8c]/20 rotate-[-45deg] flex items-center justify-center">
                  <span className="text-[#e91e8c] text-xs">✓</span>
                </div>
              </div>
              <h3 className="font-heading uppercase font-black text-white text-2xl tracking-[-0.02em]">
                Received.
              </h3>
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 max-w-xs leading-[2]">
                Your message has entered the archive. We&apos;ll be in touch soon.
              </p>
              <button
                onClick={() => setFormOpen(false)}
                className="mt-4 text-[9px] tracking-[0.5em] uppercase font-bold text-[#e91e8c] hover:text-white transition-colors"
              >
                Close Archive ×
              </button>
            </div>

          ) : (
            // ── Form fields ──
            <div className="px-8 md:px-12 py-10 flex flex-col gap-7">

              {/* Name */}
              <div data-field className="flex flex-col gap-2">
                <label className="text-[8px] tracking-[0.5em] uppercase font-bold text-white/30">
                  Your Name
                </label>
                <input
                  type="text"
                  value={fields.name}
                  onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                  placeholder="—"
                  className="w-full bg-transparent border-b border-white/10 focus:border-[#e91e8c]/60 outline-none text-white text-[13px] tracking-[0.1em] py-3 placeholder:text-white/15 transition-colors duration-300"
                />
              </div>

              {/* Email */}
              <div data-field className="flex flex-col gap-2">
                <label className="text-[8px] tracking-[0.5em] uppercase font-bold text-white/30">
                  Email Address
                </label>
                <input
                  type="email"
                  value={fields.email}
                  onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
                  placeholder="—"
                  className="w-full bg-transparent border-b border-white/10 focus:border-[#e91e8c]/60 outline-none text-white text-[13px] tracking-[0.1em] py-3 placeholder:text-white/15 transition-colors duration-300"
                />
              </div>

              {/* Message */}
              <div data-field className="flex flex-col gap-2">
                <label className="text-[8px] tracking-[0.5em] uppercase font-bold text-white/30">
                  Tell Me About Your Vision
                </label>
                <textarea
                  value={fields.message}
                  onChange={e => setFields(f => ({ ...f, message: e.target.value }))}
                  placeholder="—"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[#e91e8c]/60 outline-none text-white text-[13px] tracking-[0.1em] py-3 placeholder:text-white/15 transition-colors duration-300 resize-none"
                />
              </div>

              {/* Submit */}
              <div data-field className="flex items-center justify-between pt-4">
                <span className="text-[8px] tracking-[0.35em] uppercase text-white/20">
                  All fields required
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={formState === 'sending'}
                  className="group relative flex items-center gap-4 px-8 py-4 border border-white/15 hover:border-[#e91e8c]/60 transition-colors duration-500 overflow-hidden"
                >
                  {/* Hover fill */}
                  <div className="absolute inset-0 bg-[#e91e8c]/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  <span className="relative text-[9px] tracking-[0.4em] uppercase font-bold text-white/70 group-hover:text-white transition-colors duration-300">
                    {formState === 'sending' ? 'Transmitting...' : 'Send to Archive'}
                  </span>
                  <span className="relative text-[#e91e8c] group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          )}

          {/* Decorative corner marks */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-4 h-4 flex items-center justify-center`}>
              <div className="absolute w-4 h-[1px] bg-[#e91e8c]/30" />
              <div className="absolute h-4 w-[1px] bg-[#e91e8c]/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EndingSection;