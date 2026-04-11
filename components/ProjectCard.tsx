"use client";

interface ProjectCardProps {
  title: string;
  metrics: string;
  abstract: string;
  imageUrl?: string;
}

export default function ProjectCard({ title, metrics, abstract }: ProjectCardProps) {
  return (
    <div 
      role="article"
      tabIndex={0}
      aria-label={`${title} project card`}
      className="w-[70vw] md:w-[45vw] lg:w-[35vw] h-[65vh] shrink-0 bg-[#0B0B0B] border border-white/10 rounded-3xl relative overflow-hidden group/card cursor-pointer focus:outline-none focus:ring-2 focus:ring-datacyan"
    >
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-datacyan via-transparent to-transparent transition-opacity duration-700"></div>
      
      <div className="absolute right-0 top-0 p-8 opacity-20 transition-opacity duration-500 group-hover/card:opacity-40" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0 0 h 5 v 5 h -5 z M 10 0 h 5 v 5 h -5 z M 20 0 h 5 v 5 h -5 z M 0 10 h 5 v 5 h -5 z M 0 20 h 5 v 5 h -5 z" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-10 right-10 z-10 flex flex-col pointer-events-none">
        <span className="text-data text-datacyan text-sm mb-3 tracking-[0.2em] uppercase origin-left scale-75 md:scale-100" aria-label={`Technologies: ${metrics}`}>[{metrics}]</span>
        <h3 className="text-display text-4xl md:text-5xl text-white mb-6 uppercase tracking-tighter transition-transform duration-500 ease-out group-hover/card:translate-x-4">{title}</h3>
        <p className="text-graphite font-sans text-sm md:text-base leading-relaxed max-w-[80%]">{abstract}</p>
      </div>

      <div className="absolute top-0 left-0 h-full w-1 bg-datacyan transform origin-bottom scale-y-0 group-hover/card:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
    </div>
  );
}
