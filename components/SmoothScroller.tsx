"use client";

import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState, useCallback } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", checkMobile);
    
    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configure GSAP to update ScrollTrigger with Lenis ticker
    function update(time: number) {
      ScrollTrigger.update();
    }
    
    gsap.ticker.add(update);
    // Prevent GSAP from trying to catch up on dropped frames
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Lenis configuration optimized for both desktop and mobile
  const lenisOptions = isMobile 
    ? {
        // Mobile: lighter smooth scrolling to not interfere with native touch
        lerp: 0.05,
        duration: 0.8,
        smoothWheel: false, // Disable smooth wheel on mobile to respect native scroll
        smoothTouch: true, // Enable smooth touch scrolling
        wheelMultiplier: 1,
      }
    : {
        // Desktop: more pronounced smooth scrolling
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.2,
      };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
