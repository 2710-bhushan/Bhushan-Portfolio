"use client";
import { useEffect, useRef, useState } from "react";
import { FaAward, FaImage } from "react-icons/fa6";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTimeout(() => el.classList.add("visible"), delay);
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const r1 = useReveal();

  useEffect(() => {
    fetch("/api/achievements")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAchievements(data);
        }
      })
      .catch(err => console.error("Failed to load achievements:", err));
  }, []);

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="achievements-section" style={{ padding: '120px 60px', background: 'rgba(5,13,24,0.6)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Honors & Achievements
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
          <p style={{ marginTop: 16, fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(232,244,248,0.5)', maxWidth: 500 }}>
            Awards, competitions, and milestones reached throughout my professional journey.
          </p>
        </div>

        {/* Achievements list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {achievements.map((ach, index) => {
            const hasImages = Array.isArray(ach.images) && ach.images.length > 0;
            return (
              <div 
                key={ach.id || index}
                className="glass-card"
                style={{
                  padding: '36px',
                  borderRadius: 2,
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Accent Blob */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 250, height: 250,
                  background: 'radial-gradient(circle, rgba(255,60,172,0.06) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div className="ach-layout" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  
                  {/* Top content row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ color: 'var(--accent3)', fontSize: '1.2rem', display: 'flex' }}><FaAward /></span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          Achievement
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
                        {ach.title}
                      </h3>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      border: '1px solid rgba(255,60,172,0.2)',
                      background: 'rgba(255,60,172,0.05)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--accent3)',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap'
                    }}>
                      {ach.date}
                    </div>
                  </div>

                  <div className="cyber-divider" style={{ opacity: 0.5 }} />

                  {/* Body description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'rgba(232,244,248,0.7)',
                    maxWidth: 800
                  }}>
                    {ach.description}
                  </p>

                  {/* Photo Gallery */}
                  {hasImages && (
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaImage /> Photo Gallery ({ach.images.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {ach.images.map((imgUrl: string, imgIdx: number) => (
                          <div 
                            key={imgIdx}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="hover-target"
                            style={{
                              width: 140,
                              height: 90,
                              overflow: 'hidden',
                              border: '1px solid var(--glass-border)',
                              position: 'relative',
                              cursor: 'pointer',
                              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={imgUrl} 
                              alt={`Achievement thumbnail ${imgIdx + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div 
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2,4,8,0.92)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={lightboxImage} 
                alt="Enlarged achievement view" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '90vh', 
                  objectFit: 'contain',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} 
              />
              <button 
                onClick={() => setLightboxImage(null)}
                style={{
                  position: 'absolute',
                  top: -40,
                  right: 0,
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '2rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
