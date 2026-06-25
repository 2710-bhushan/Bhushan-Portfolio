"use client";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { FaBolt, FaLaptopCode, FaRocket, FaScrewdriverWrench } from "react-icons/fa6";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add("visible");
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

import { useState } from "react";

const ICON_MAP: Record<string, IconType> = {
  FaBolt,
  FaRocket,
  FaLaptopCode,
  FaScrewdriverWrench
};

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => {
        if (data && data.about) {
          setAboutData(data.about);
        }
      })
      .catch(err => console.error("Error loading About details:", err));
  }, []);

  const r1 = useReveal(), r2 = useReveal();

  return (
    <section id="about" className="about-section" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {aboutData?.title || "Who I Am"}
        </h2>
        <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
      </div>

      <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        {/* Left: Text */}
        <div className="reveal" ref={r2}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(232,244,248,0.7)', marginBottom: 24 }}>
            {aboutData?.paragraph1 ? (
              <span dangerouslySetInnerHTML={{ __html: aboutData.paragraph1 }} />
            ) : (
              <>I'm a <span style={{ color: 'var(--accent)' }}>Full Stack Developer</span> currently pursuing B.Tech in Computer Engineering at Government College OF Engineering, Jalgaon, with hands-on internship experience building scalable full-stack products.</>
            )}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(232,244,248,0.7)', marginBottom: 32 }}>
            {aboutData?.paragraph2 ? (
              <span dangerouslySetInnerHTML={{ __html: aboutData.paragraph2 }} />
            ) : (
              <>I specialize in building end-to-end web solutions — from designing intuitive React UIs to architecting robust Node.js backends. I've worked as a Full Stack Developer Intern at <span style={{ color: 'var(--accent2)' }}>CodeClause</span>, where I engineered real-time CMS systems and improved performance metrics significantly.</>
            )}
          </p>

          <div className="about-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {(aboutData?.meta || [
              { label: 'Location', value: 'Bhusawal, India' },
              { label: 'Email', value: 'bhushaningale2006@gmail.com' },
              { label: 'Degree', value: 'B.Tech Computer Engineering' },
              { label: 'Status', value: 'Available for hire' },
            ]).map((item: any) => (
              <div key={item.label} style={{ padding: '12px 16px', border: '1px solid var(--glass-border)', background: 'var(--glass)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: 4, textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats cards */}
        <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(aboutData?.stats || [
            { num: '40%', label: 'Latency Reduced', color: 'var(--accent)', iconName: 'FaBolt' },
            { num: '35%', label: 'Faster Page Load', color: 'var(--accent2)', iconName: 'FaRocket' },
            { num: '10+', label: 'Projects Built', color: 'var(--accent3)', iconName: 'FaLaptopCode' },
            { num: 'MERN', label: 'Stack Focus', color: 'var(--gold)', iconName: 'FaScrewdriverWrench' },
          ]).map((s: any, i: number) => {
            const IconComponent = ICON_MAP[s.iconName] || FaLaptopCode;
            return (
              <div key={s.label} className="glass-card hover-lift hover-target" style={{
                padding: '28px 24px',
                borderRadius: 2,
                textAlign: 'center',
                animationDelay: `${i * 0.1}s`,
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  <IconComponent />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.num}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
