"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SOYAL_DATA } from "@/config/personalConfig";

const calculateRadarPoints = (scores: number[]) => {
  const maxRadius = 45;
  const centerX = 50;
  const centerY = 50;
  
  return scores.map((score, i) => {
    const radius = Math.max((score / 100) * maxRadius, 5); // Ensure points don't collapse to 0 natively
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
};

export default function SkillsDashboard() {
  const container = useRef(null);

  const radarScores = [
    SOYAL_DATA.skillsRadar.sql,
    SOYAL_DATA.skillsRadar.python,
    SOYAL_DATA.skillsRadar.viz,
    SOYAL_DATA.skillsRadar.stats,
    SOYAL_DATA.skillsRadar.modeling,
    SOYAL_DATA.skillsRadar.etl
  ];
  
  // Calculate dynamic geometry based precisely on real configuration data
  const dynamicRadarGeometry = calculateRadarPoints(radarScores);

  useGSAP(() => {
    // Generate the animated SVG stroke draws dynamically 
    const paths = gsap.utils.toArray<SVGPathElement>('.line-chart-path');
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      
      // Starting state: pushed out of frame
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      
      // Animate stroke to 0 offset (drawing effect) matching scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: path,
          start: "top 85%", // Trigger when element hits bottom 15% of screen
        }
      });
    });

    // Radar Chart drawing specifically
    const radarLines = gsap.utils.toArray<SVGPathElement>('.radar-outline');
    radarLines.forEach(line => {
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 2.5,
        delay: 0.2, // Small delay for effect
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: line,
          start: "top 80%",
        }
      });
      
      // Subtly fade in the polygon solid fill afterwards
      gsap.to('.radar-fill', {
        opacity: 0.2,
        duration: 2,
        delay: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: line, start: "top 80%" }
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {/* Skill 1: Python - Freeform pulsing Line Chart */}
      <div className="bg-charcoal border border-white/10 rounded-xl p-8 relative overflow-hidden group">
        {/* Neon accent top border active on hover */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-datacyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-display text-2xl text-white mb-2">Python <span className="text-datacyan text-sm ml-2 font-mono">v3.12</span></h3>
        <p className="text-data text-xs mb-6 opacity-70">Data Processing & Modeling Streams</p>
        
        <div className="h-32 w-full relative">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path d="M 0 10 H 100 M 0 25 H 100 M 0 40 H 100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <path d="M 25 0 V 50 M 50 0 V 50 M 75 0 V 50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            
            <path 
              className="line-chart-path drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]"
              d="M 0 45 C 10 40, 20 20, 30 25 S 50 10, 60 15 S 80 5, 100 2"
              fill="none" 
              stroke="#00F5FF" 
              strokeWidth="2" 
              vectorEffect="non-scaling-stroke"
            />
            <path 
              className="opacity-10 drop-shadow-[0_0_20px_rgba(0,245,255,1)]"
              d="M 0 45 C 10 40, 20 20, 30 25 S 50 10, 60 15 S 80 5, 100 2 L 100 50 L 0 50 Z"
              fill="url(#python-gradient)" 
            />
            <defs>
              <linearGradient id="python-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5FF" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Skill 2: SQL - Histogram/Line architecture */}
      <div className="bg-charcoal border border-white/10 rounded-xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-datacyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-display text-2xl text-white mb-2">SQL <span className="text-datacyan text-sm ml-2 font-mono">Query</span></h3>
        <p className="text-data text-xs mb-6 opacity-70">Database Architecture & Indexing</p>
        
        <div className="h-32 w-full relative">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
             <path d="M 0 10 H 100 M 0 25 H 100 M 0 40 H 100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <path d="M 25 0 V 50 M 50 0 V 50 M 75 0 V 50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            
            <path 
              className="line-chart-path drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
              d="M 0 40 L 10 40 L 15 15 L 25 20 L 35 5 L 45 45 L 60 30 L 75 10 L 85 15 L 100 5"
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="1.5" 
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Skill 3: Power BI - Interactive Reports */}
      <div className="bg-charcoal border border-white/10 rounded-xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-datacyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-display text-2xl text-white mb-2">Power BI <span className="text-datacyan text-sm ml-2 font-mono">Reports</span></h3>
        <p className="text-data text-xs mb-6 opacity-70">Interactive Dashboards & Reporting</p>
        
        <div className="h-32 w-full relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-[80%] h-[100%] overflow-visible">
            {/* Radar Spiderweb backbones */}
            <polygon points="50,5  90,25  90,75  50,95  10,75  10,25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <polygon points="50,20 75,35  75,65  50,80  25,65  25,35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <polygon points="50,35 62,42  62,58  50,65  38,58  38,42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Spiderweb axes */}
            <line x1="50" y1="50" x2="50" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="50" x2="90" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="50" x2="90" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="50" x2="50" y2="95" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="50" x2="10" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="50" x2="10" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* Closed Polygon structure forming the exact computed boundary */}
            <path 
              className="radar-outline drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]"
              d={`M ${dynamicRadarGeometry} Z`}
              fill="none" 
              stroke="#00F5FF" 
              strokeWidth="2.5" 
            />
            {/* The fill fading in beneath the stroke */}
            <polygon 
              className="radar-fill opacity-0"
              points={dynamicRadarGeometry}
              fill="#00F5FF" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
