'use client';

import * as React from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'heart' | 'sparkle' | 'butterfly';
  angle?: number;
  flutterSpeed?: number;
}

export default function Sparkles() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [particlesCount, setParticlesCount] = React.useState(0);
  const [isEnabled, setIsEnabled] = React.useState(true);

  React.useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];

    // Pastel/love colors pool
    const colors = [
      'rgba(255, 182, 193, 0.85)', // Light Pink
      'rgba(255, 105, 180, 0.8)',  // Hot Pink
      'rgba(255, 218, 185, 0.85)', // Peach
      'rgba(230, 230, 250, 0.85)', // Lavender
      'rgba(255, 192, 203, 0.85)', // Pink
      'rgba(255, 228, 225, 0.9)',  // Misty Rose
    ];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic creator for mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.4) return; // limit count

      const particleType = Math.random() > 0.8 ? 'heart' : 'sparkle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 6 + 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        type: particleType,
        angle: Math.random() * Math.PI * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Spawn some passive floating particles (hearts & butterflies)
    const spawnPassiveInterval = setInterval(() => {
      if (particles.length > 80) return; // cap density
      const type = Math.random() > 0.7 ? 'butterfly' : 'heart';
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particles.push({
        x: Math.random() * width,
        y: height + 30,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.2 - 0.4,
        size: type === 'butterfly' ? Math.random() * 8 + 8 : Math.random() * 12 + 8,
        color,
        alpha: 0.8,
        life: 0,
        maxLife: Math.random() * 120 + 150,
        type,
        angle: Math.random() * Math.PI,
        flutterSpeed: Math.random() * 0.05 + 0.02,
      });
    }, 600);

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, -size / 4);
      c.bezierCurveTo(-size / 2, -size * 0.8, -size, -size / 3, -size, size / 3);
      c.bezierCurveTo(-size, size * 0.8, -size / 3, size * 1.1, 0, size * 1.3);
      c.bezierCurveTo(size / 3, size * 1.1, size, size * 0.8, size, size / 3);
      c.bezierCurveTo(size, -size / 3, size / 2, -size * 0.8, 0, -size / 4);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      
      // 4-point star sparkle
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawButterfly = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.globalAlpha = p.alpha;
      c.fillStyle = p.color;

      // flutter math
      const wingScaleX = Math.abs(Math.sin((p.life * (p.flutterSpeed || 0.05))));
      const size = p.size;

      // Draw wings
      c.beginPath();
      // Left wings
      c.ellipse(-size / 2 * wingScaleX, -size / 4, size / 2 * wingScaleX, size / 2, Math.PI / 6, 0, Math.PI * 2);
      c.ellipse(-size / 2 * wingScaleX, size / 4, size / 3 * wingScaleX, size / 3, -Math.PI / 6, 0, Math.PI * 2);
      // Right wings
      c.ellipse(size / 2 * wingScaleX, -size / 4, size / 2 * wingScaleX, size / 2, -Math.PI / 6, 0, Math.PI * 2);
      c.ellipse(size / 2 * wingScaleX, size / 4, size / 3 * wingScaleX, size / 3, Math.PI / 6, 0, Math.PI * 2);
      c.fill();

      // Antennae
      c.strokeStyle = '#e11d48';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, -size / 2);
      c.quadraticCurveTo(-size / 4, -size, -size / 3, -size);
      c.moveTo(0, -size / 2);
      c.quadraticCurveTo(size / 4, -size, size / 3, -size);
      c.stroke();

      c.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Physics
        p.x += p.vx;
        p.y += p.vy;

        // Custom flutter motion for active butterflies
        if (p.type === 'butterfly') {
          p.vx += Math.sin(p.life * 0.06) * 0.15;
        }

        // Fade out
        p.alpha = 1 - p.life / p.maxLife;

        // Draw based on type
        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.alpha, p.color);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.alpha, p.color);
        } else if (p.type === 'butterfly') {
          drawButterfly(ctx, p);
        }

        // Cleanup dead particles
        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      setParticlesCount(particles.length);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(spawnPassiveInterval);
    };
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          id="sparkles-canvas"
          className="pointer-events-none fixed inset-0 z-10 block"
        />
      )}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-md border border-[#ffd6db] text-[10px] font-medium text-pink-600 glass-morphism">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <span>{particlesCount} Sparkles Active</span>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          id="particle-toggle-btn"
          className="ml-2 rounded px-1.5 py-0.5 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold transition-colors uppercase tracking-wider text-[9px]"
        >
          {isEnabled ? 'Pause' : 'Floating'}
        </button>
      </div>
    </>
  );
}
