'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SmoothScroll from '@/components/SmoothScroll';
import ManifestoSection from '@/components/ManifestoSection';
import OriginSection from '@/components/OriginSection';
import CollectionSection from '@/components/CollectionSection';
import ArtSection from '@/components/ArtSection';
import EndingSection from '@/components/EndingSection';
import Loader from '@/components/Loader';



export default function Home() {
    const [loaded, setLoaded] = useState(false);

  return (
    <>
          {!loaded && <Loader onComplete={() => setLoaded(true)} />}

    <SmoothScroll>
      <main className="relative min-h-screen selection:bg-brand-gold selection:text-brand-bg">
        <Navbar />
        <Hero />
        <ManifestoSection />
        <CollectionSection />
        <ArtSection />
        <OriginSection />
        <EndingSection />
      </main>
    </SmoothScroll>
    </>
  );
}
