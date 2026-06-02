"use client";
import { useEffect, useRef, useState } from "react";

const ROLES = ["Full Stack Developer", "MERN Stack Engineer", "React Specialist", "API Architect", "UI/UX Enthusiast"];

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }> = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouseMove);

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx / dist * 0.8;
          p.y += dy / dist * 0.8;
        }

        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,240,255,${alpha})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1, i + 6).forEach(p2 => {
          const dx2 = p.x - p2.x, dy2 = p.y - p2.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      frame = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

function Orb3D() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let frame: number;
    const animate = () => {
      angle += 0.005;
      if (orbRef.current) {
        orbRef.current.style.transform = `rotateY(${angle}rad) rotateX(${Math.sin(angle * 0.7) * 0.2}rad)`;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const rings = [0, 30, 60, 90, 120, 150];
  const dots = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div style={{
      width: 340, height: 340,
      position: 'relative',
      perspective: 800,
      flexShrink: 0,
    }}>
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute',
        inset: -40,
        background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(123,47,255,0.08) 50%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse-glow 3s ease-in-out infinite',
      }} />

      <div ref={orbRef} style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
        {/* Core sphere */}
        <div style={{
          position: 'absolute',
          inset: 40,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(0,240,255,0.25) 0%, rgba(123,47,255,0.15) 40%, rgba(2,4,8,0.9) 70%)',
          border: '1px solid rgba(0,240,255,0.25)',
          boxShadow: '0 0 60px rgba(0,240,255,0.15), inset 0 0 40px rgba(0,240,255,0.05)',
        }} />

        {/* Orbital rings */}
        {rings.map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            inset: 20,
            borderRadius: '50%',
            border: `1px solid rgba(0,240,255,${0.06 + i * 0.02})`,
            transform: `rotateX(${r}deg) rotateY(${r * 0.5}deg)`,
            animation: `spin-slow ${8 + i * 2}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }}>
            {i % 2 === 0 && (
              <div style={{
                position: 'absolute',
                top: -3, left: '50%',
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
                transform: 'translateX(-50%)',
              }} />
            )}
          </div>
        ))}

        {/* Floating tech labels */}
        {['React', 'Node', 'Next.js', 'MongoDB'].map((tech, i) => (
          <div key={tech} style={{
            position: 'absolute',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'rgba(0,240,255,0.7)',
            letterSpacing: '0.1em',
            top: `${20 + i * 20}%`,
            left: i % 2 === 0 ? '5%' : '75%',
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}>
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const role = useTypewriter(ROLES);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <section id="home" className="grid-bg hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '100px 60px 60px',
    }}>
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '5%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(123,47,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Data stream lines */}
      {[15, 35, 55, 75, 90].map((left, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${left}%`,
          top: 0,
          width: 1,
          height: '30%',
          background: `linear-gradient(180deg, transparent, rgba(0,240,255,${0.03 + i * 0.01}), transparent)`,
          animation: `data-stream ${5 + i}s linear infinite`,
          animationDelay: `${i * 1.2}s`,
          pointerEvents: 'none',
        }} />
      ))}

      <div className="hero-layout" style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', maxWidth: 1200, margin: '0 auto', gap: 60,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Text content */}
        <div className="hero-text" style={{ flex: 1, maxWidth: 600 }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 24,
            padding: '6px 16px',
            border: '1px solid rgba(0,240,255,0.2)',
            borderRadius: 4,
            background: 'rgba(0,240,255,0.05)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'pulse-glow 2s infinite' }} />
            AVAILABLE FOR HIRE
          </div>

          <div style={{ marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
            Hello, I'm
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'var(--text)' }}>Bhushan</span>
            <br />
            <span className="gradient-text">Ingale</span>
          </h1>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
            marginBottom: 24,
            height: 28,
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--accent)',
          }}>
            <span style={{ color: 'var(--muted)' }}>&gt;</span>
            <span className="type-cursor">{role}</span>
          </div>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(232,244,248,0.6)',
            marginBottom: 40,
            maxWidth: 480,
          }}>
            Crafting scalable web applications with the MERN stack. Passionate about clean architecture, 
            performance optimization, and building seamless user experiences that make a difference.
          </p>

          {/* Stats */}
          <div className="hero-stats" style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
            {[
              { num: '40%', label: 'Latency Cut', suffix: '' },
              { num: '35%', label: 'Faster Pages', suffix: '' },
              { num: '10+', label: 'Projects', suffix: '' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {stat.num}<span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{stat.suffix}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#projects" className="btn-primary hover-target">
              View Projects
            </a>
            <a href="#contact" className="hover-target" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              padding: '12px 32px',
              color: 'var(--muted)',
              border: '1px solid rgba(74,96,112,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s, border-color 0.3s',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,244,248,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,96,112,0.4)'; }}
            >
              Contact Me
            </a>
          </div>

          {/* Social links */}
          <div className="hero-social" style={{ display: 'flex', gap: 20, marginTop: 40, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.2em' }}>CONNECT</span>
            <div className="hero-social-divider" style={{ flex: 1, height: 1, background: 'rgba(74,96,112,0.3)' }} />
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhushaningale27', icon: 'in' },
              { label: 'GitHub', href: 'https://github.com/2710-bhushan', icon: 'gh' },
              { label: 'Mail', href: 'mailto:bhushaningale2006@gmail.com', icon: '@' },
              { label: 'Resume', href: '/Bhushan_Resume.pdf', icon: 'cv' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" className="hover-target" style={{
                width: 36, height: 36,
                border: '1px solid rgba(74,96,112,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--muted)',
                textDecoration: 'none',
                transition: 'all 0.3s',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,240,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,96,112,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 3D Orb */}
        <div className="hero-orb-wrap" style={{ flexShrink: 0 }}>
          <Orb3D />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" style={{
        position: 'absolute',
        bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
        letterSpacing: '0.2em',
        animation: 'float 2s ease-in-out infinite',
      }}>
        <span>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, var(--accent), transparent)' }} />
      </div>
    </section>
  );
}
