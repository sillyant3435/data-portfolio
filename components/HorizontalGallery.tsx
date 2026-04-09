"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { SOYAL_DATA } from "@/config/personalConfig";

export default function HorizontalGallery() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const needsScroll = SOYAL_DATA.projects.length > 2;

  useGSAP(() => {
    if (!needsScroll) return; // Do not apply GSAP pinned scrolling if 2 or fewer cards
    
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
  }, { scope: container, dependencies: [needsScroll] });

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
