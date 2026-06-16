import { useEffect, useRef } from 'react';
import { Play, TrendingUp, ChevronRight, Zap, Trophy, Globe } from 'lucide-react';

interface Props { onNavigate: (page: string) => void; }

export default function HeroSection({ onNavigate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width / dpr,
      y: Math.random() * canvas.height / dpr,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.o})`;
        ctx.fill();
      }
      // connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative min-h-[94vh] flex items-center overflow-hidden grad-hero">
      <canvas ref={canvasRef} className="particles-canvas" />
      <div className="absolute inset-0 hero-grid" />

      {/* Floating cards */}
      <div className="absolute top-[18%] right-[8%] animate-float hidden lg:block" style={{ animationDelay: '0s' }}>
        <div className="glass rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-ok/15 grid place-items-center"><Trophy className="w-4 h-4 text-ok" /></div>
          <div><p className="text-[11px] text-t4">Daily Players</p><p className="text-sm font-bold text-t1">2.4M+</p></div>
        </div>
      </div>
      <div className="absolute bottom-[22%] right-[12%] animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
        <div className="glass rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-cyan/15 grid place-items-center"><Globe className="w-4 h-4 text-cyan" /></div>
          <div><p className="text-[11px] text-t4">Games Available</p><p className="text-sm font-bold text-t1">500+</p></div>
        </div>
      </div>
      <div className="absolute top-[38%] left-[4%] animate-float hidden xl:block" style={{ animationDelay: '4s' }}>
        <div className="glass rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-warn/15 grid place-items-center"><Zap className="w-4 h-4 text-warn" /></div>
          <div><p className="text-[11px] text-t4">No Downloads</p><p className="text-sm font-bold text-t1">Instant Play</p></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 w-full py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-[12px] font-medium text-t3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse-dot" />
            🎮 Over 120+ free games available now
          </div>

          <h1 className="font-head text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold leading-[1.08] mb-5">
            <span className="text-t1">Play The </span>
            <span className="text-grad">Best Games</span>
            <br />
            <span className="text-t1">Online</span>
          </h1>

          <p className="text-t3 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
            Explore hundreds of exciting games. Action, racing, puzzles, sports, multiplayer and more — all free, no downloads required.
          </p>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('games')}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl grad-btn text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
              <Play className="w-4 h-4 fill-white" /> Play Now <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => onNavigate('trending')}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl glass text-t1 font-semibold text-sm hover:bg-white/[.08] transition-all">
              <TrendingUp className="w-4 h-4 text-cyan" /> Trending Games
            </button>
          </div>

          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/40">
            {[{ v: '120+', l: 'Free Games' }, { v: '17', l: 'Categories' }, { v: '5M+', l: 'Monthly Players' }, { v: '4.5', l: 'Avg Rating' }].map(s => (
              <div key={s.l}>
                <p className="font-head text-2xl sm:text-3xl font-bold text-t1">{s.v}</p>
                <p className="text-xs text-t4 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
