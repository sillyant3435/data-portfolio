"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DataCore from "@/components/DataCore";
import SkillsDashboard from "@/components/SkillsDashboard";
import HorizontalGallery from "@/components/HorizontalGallery";
import TerminalContactForm from "@/components/TerminalContactForm";
import { SOYAL_DATA } from "@/config/personalConfig";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useGSAP(() => {
    // 1. Truck'N Roll 'Poster Effect' Slide Layering
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    
    sections.forEach((panel, i) => {
      // The horizontal gallery manages its own massive scroll width and pinning.
      // Therefore, it bypasses our global poster effect so it functions normally.
      if (panel.classList.contains('no-global-pin')) return;
      
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        // Mobile: extend the end point to give more breathing room before fade
        end: isMobile ? "bottom bottom" : "bottom top", 
        pin: true,
        pinSpacing: false, // Prevents creating white space, allowing next section to overlay
        animation: gsap.to(panel, {
          scale: isMobile ? 0.96 : 0.93,
          opacity: 0.1,
          borderRadius: "3rem",
          filter: isMobile ? "blur(3px)" : "blur(6px)",
          ease: "none"
        }),
        scrub: 1, // Add slight dampen to scrub for smoothness
      });
    });

    // 2. High-speed fluid entrance motion blur
    sections.forEach((panel, i) => {
      if (i === 0) return; // Skip Hero since it mounts immediately
      if (panel.classList.contains('no-global-pin')) return; // Fix: Prevent Y transform on horizontal tracks which breaks fixed position pinning
      
      const content = panel.querySelector('.panel-content-wrap');
      if (!content) return;

      gsap.fromTo(content, 
        { y: 150, filter: "blur(20px)", opacity: 0, scale: 0.98 },
        {
          y: 0,
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 90%", // Trigger slightly before it comes into view 
            end: "top 30%",
            scrub: 1, 
          }
        }
      );
    });
  }, { scope: container, dependencies: [isMobile] });

  return (
    <div ref={container} className="relative w-full text-white bg-charcoal overflow-hidden">
      
      {/* PANEL 1: The Hero */}
      <section className="panel w-full h-screen-safe relative flex items-center justify-center bg-charcoal will-change-transform z-10 origin-top">
        <div className="absolute inset-0 z-0">
          <DataCore />
        </div>
        <div className="panel-content-wrap z-10 text-center relative pointer-events-none w-full px-4">
          <h1 className="text-display text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none mb-6 group cursor-default pointer-events-auto mix-blend-screen drop-shadow-2xl">
            <span className="text-white hover:text-datacyan hover:drop-shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-500">{SOYAL_DATA.name.split(" ")[0]}</span>
            <br />
            <span className="text-graphite hover:text-white transition-colors duration-500">{SOYAL_DATA.name.split(" ")[1]}.</span>
          </h1>
          <p className="text-data mt-8 text-lg md:text-xl tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            {`// ${SOYAL_DATA.role} Portfolio`}
          </p>
        </div>
      </section>

      {/* PANEL 2: Skills / Live Data Dashboard */}
      <section className="panel w-full h-screen-safe relative flex items-center justify-center bg-[#070707] will-change-transform z-20 origin-top border-t border-white/5">
         <div className="panel-content-wrap w-full max-w-[90rem] px-8 md:px-12 z-10 flex flex-col justify-center">
            <div className="mb-16">
              <h2 className="text-display text-5xl md:text-7xl font-bold tracking-tighter mix-blend-screen">Core <span className="text-datacyan">Engines.</span></h2>
              <p className="text-data text-sm opacity-50 mt-4">{"// LIVE TELEMETRY STREAMS"}</p>
            </div>
            <SkillsDashboard />
         </div>
      </section>

      {/* PANEL 3: Horizontal Gallery Track */}
      {/* Has no-global-pin to prevent ScrollTrigger collision between pinning vertical and horizontal concurrently */}
      <section className="panel no-global-pin w-full relative bg-surface z-30 border-t border-white/5">
         <div className="panel-content-wrap w-full">
            <HorizontalGallery />
         </div>
      </section>


      {/* PANEL 4: Footer */}
      <section className="panel w-full min-h-screen relative flex flex-col items-center justify-center bg-[#070707] z-40 border-t border-white/5 py-24">
         <div className="panel-content-wrap text-center flex flex-col items-center w-full px-4">
            <h2 className="text-display text-4xl md:text-6xl font-bold mb-12 tracking-tighter mix-blend-screen">Initialize <span className="text-datacyan">Connection.</span></h2>
            <TerminalContactForm />
         </div>
      </section>
    </div>
  );
}
