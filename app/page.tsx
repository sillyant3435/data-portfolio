"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DataCore from "@/components/DataCore";
import SkillsDashboard from "@/components/SkillsDashboard";
import HorizontalGallery from "@/components/HorizontalGallery";
import TerminalContactForm from "@/components/TerminalContactForm";
import { SOYAL_DATA } from "@/config/personalConfig";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fix: Prevent auto-scroll to contact section on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Skip all animation on mobile for better performance
    // Mobile animations should be simpler and hardware-accelerated
    if (isMobile) {
      return;
    }

    // 1. Truck'N Roll 'Poster Effect' Slide Layering (Desktop only)
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    
    sections.forEach((panel) => {
      // The horizontal gallery manages its own massive scroll width and pinning.
      // Therefore, it bypasses our global poster effect so it functions normally.
      if (panel.classList.contains('no-global-pin')) return;
      
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "bottom top", 
        pin: true,
        pinSpacing: false,
        animation: gsap.to(panel, {
          scale: 0.93,
          opacity: 0.1,
          borderRadius: "3rem",
          filter: "blur(6px)",
          ease: "none"
        }),
        scrub: 1,
      });
    });

    // 2. High-speed fluid entrance motion blur (Desktop only)
    sections.forEach((panel, index) => {
      if (index === 0) return;
      if (panel.classList.contains('no-global-pin')) return;
      
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
            start: "top 90%",
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
          <h1 className="text-display font-bold leading-none mb-6 group cursor-default pointer-events-auto mix-blend-screen drop-shadow-2xl hero-heading">
            <span className="text-white hover:text-datacyan hover:drop-shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-500">{SOYAL_DATA.name.split(" ")[0]} </span>
             <span className="text-graphite hover:text-white transition-colors duration-500">{SOYAL_DATA.name.split(" ")[1]}.</span>
            </h1>
          <p className="text-data mt-8 text-lg md:text-xl tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            {SOYAL_DATA.role.toUpperCase().replace(' PORTFOLIO', '')}
          </p>
        </div>
      </section>

      {/* PANEL 2: Skills / Live Data Dashboard */}
      <section className="panel w-full h-screen-safe relative flex items-center justify-center bg-[#070707] will-change-transform z-20 origin-top border-t border-white/5">
         <div className="panel-content-wrap w-full max-w-[90rem] px-8 md:px-12 z-10 flex flex-col justify-center">
            <div className="mb-16">
              <h2 className="text-display font-bold tracking-tighter mix-blend-screen" style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.2
              }}>Core <span className="text-datacyan">Engines.</span></h2>
            </div>
            <SkillsDashboard />
         </div>
      </section>

      {/* PANEL 3: Horizontal Gallery Track */}
      {/* Has no-global-pin to prevent ScrollTrigger collision between pinning vertical and horizontal concurrently */}
      <section className="panel no-global-pin w-full relative bg-surface z-30 border-t border-white/5 py-8">
         <div className="panel-content-wrap w-full">
            <HorizontalGallery />
         </div>
      </section>


      {/* PANEL 4: Footer */}
      <section className="panel w-full min-h-screen relative flex flex-col items-center justify-center bg-[#070707] z-40 border-t border-white/5 py-24">
         <div className="panel-content-wrap text-center flex flex-col items-center w-full px-4">
            <h2 className="text-display font-bold mb-12 tracking-tighter mix-blend-screen" style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.2
            }}>Initialize <span className="text-datacyan">Connection.</span></h2>
            <TerminalContactForm />
         </div>
      </section>
    </div>
  );
}
