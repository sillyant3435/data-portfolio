"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { SOYAL_DATA } from "@/config/personalConfig";

export default function HorizontalGallery() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const needsScroll = SOYAL_DATA.projects.length > 2;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useGSAP(() => {
    // On mobile, skip GSAP pinning entirely — use native touch scroll instead
    if (isMobile || !needsScroll) return;
    
    // Determine translation amount: Width of content track minus the viewport screen width
    const getScrollAmount = () => {
        const trackEl = track.current;
        if (!trackEl) return 0;
        return trackEl.scrollWidth - window.innerWidth;
    };

    const tween = gsap.to(track.current, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      // End controls how long we pin before releasing. 
      end: () => `+=${getScrollAmount()}`, 
      pin: true,
      animation: tween,
      scrub: 1, // Smooth dampening on scrub
      invalidateOnRefresh: true, // Recalculate on screen resize natively
    });
  }, { scope: container, dependencies: [needsScroll, isMobile] });

  // Mobile layout: native horizontal scroll with snap
  if (isMobile) {
    return (
      <div ref={container} className="w-full bg-surface border-y border-white/5 relative py-16">
        {/* Section header */}
        <div className="px-6 mb-8">
          <h2 className="text-display text-3xl text-white">Project <span className="text-datacyan">Matrix.</span></h2>
          <p className="text-data text-xs opacity-60 mt-2 tracking-widest">{"// SWIPE TO BROWSE [X-AXIS]"}</p>
        </div>

        {/* Native horizontal scroll track */}
        <div 
          ref={track}
          className="mobile-scroll-track flex flex-nowrap gap-6 px-6 pb-4"
        >
          {SOYAL_DATA.projects.map((proj) => (
            <div key={proj.id} className="mobile-scroll-card shrink-0">
              <ProjectCard 
                title={proj.title}
                metrics={proj.metrics}
                abstract={proj.abstract}
                imageUrl={proj.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout: GSAP-pinned horizontal gallery
  return (
    <div ref={container} className="h-screen w-full overflow-hidden bg-surface flex flex-col justify-center border-y border-white/5 relative">
       {/* Background typography tracking section status */}
      <div className="absolute top-12 left-12 z-20">
         <h2 className="text-display text-4xl text-white">Project <span className="text-datacyan">Matrix.</span></h2>
         {needsScroll && <p className="text-data text-sm opacity-60 mt-2 tracking-widest">{"// SCROLL TO PAN [X-AXIS]"}</p>}
      </div>

      {/* The track containing the posters */}
      <div 
        ref={track} 
        className={`flex flex-col md:flex-row items-center h-full pt-20 group/track ${needsScroll ? 'w-max px-[20vw] flex-nowrap gap-24' : 'w-full justify-center flex-wrap md:flex-nowrap gap-8 md:gap-16'}`}
      >
        {SOYAL_DATA.projects.map((proj) => (
          <ProjectCard 
             key={proj.id}
             title={proj.title}
             metrics={proj.metrics}
             abstract={proj.abstract}
             imageUrl={proj.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
