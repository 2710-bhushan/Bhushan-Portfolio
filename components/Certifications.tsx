"use client";
import { useEffect, useRef, useState } from "react";
import { FaCertificate, FaArrowUpRightFromSquare } from "react-icons/fa6";

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

export default function Certifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const r1 = useReveal();

  useEffect(() => {
    fetch("/api/certifications")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCerts(data);
        }
      })
      .catch(err => console.error("Failed to load certifications:", err));
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="certifications-section" style={{ padding: '120px 60px', background: 'rgba(5,13,24,0.4)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Licenses & Certifications
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
          <p style={{ marginTop: 16, fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(232,244,248,0.5)', maxWidth: 500 }}>
            Verifiable credentials and professional certifications I have earned.
          </p>
        </div>

        {/* Certs Grid */}
        <div className="certs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {certs.map((cert, index) => {
            const hasUrl = typeof cert.url === 'string' && cert.url.trim() !== '' && cert.url !== '#';
            const hasCertificateFile = typeof cert.image === 'string' && cert.image.trim() !== '' && cert.image !== '#';
            
            return (
              <div 
                key={cert.id || index}
                className="glass-card hover-lift hover-target"
                style={{
                  padding: '30px',
                  borderRadius: 2,
                  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow splash */}
                <div style={{
                  position: 'absolute', top: -30, right: -30,
                  width: 100, height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Left side: Icon or Image */}
                <div style={{ flexShrink: 0 }}>
                  {cert.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      onClick={() => setSelectedCert(cert.image)}
                      style={{ 
                        width: 56, 
                        height: 56, 
                        objectFit: 'cover', 
                        border: '1px solid rgba(0,240,255,0.2)',
                        cursor: 'pointer',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: 56,
                      height: 56,
                      border: '1px solid rgba(0,240,255,0.18)',
                      background: 'rgba(0,240,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      color: 'var(--accent)',
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}>
                      <FaCertificate />
                    </div>
                  )}
                </div>

                {/* Right side: Content */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {cert.issuer}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>
                    {cert.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                      {cert.date}
                    </span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {hasCertificateFile && (
                        <button
                          onClick={() => setSelectedCert(cert.image)}
                          className="hover-target"
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--accent)',
                            background: 'none',
                            border: 'none',
                            borderBottom: '1px dashed var(--accent)',
                            padding: '2px 0',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
                        >
                          View Certificate
                        </button>
                      )}
                      {hasUrl && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover-target" 
                          style={{ 
                            fontSize: '0.72rem', 
                            color: 'var(--accent)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 4,
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
                        >
                          Verify <FaArrowUpRightFromSquare size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Dynamic Certificate Modal */}
      {selectedCert && (
        <div 
          onClick={() => setSelectedCert(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2,4,8,0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              width: '90%', 
              maxWidth: 960, 
              height: '85vh', 
              background: 'rgba(5,13,24,0.85)',
              border: '1px solid rgba(0,240,255,0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              boxShadow: '0 0 60px rgba(0,240,255,0.15)',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                CERTIFICATE CREDENTIAL VIEW
              </span>
              <button 
                onClick={() => setSelectedCert(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ flexGrow: 1, overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {selectedCert.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={selectedCert} 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Certificate PDF Viewer"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={selectedCert} 
                  alt="Credential Certificate" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }} 
                />
              )}
            </div>
            
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 20 }}>
              <a 
                href={selectedCert} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  border: '1px solid rgba(0,240,255,0.25)',
                  padding: '6px 16px',
                  background: 'rgba(0,240,255,0.04)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,240,255,0.04)'}
              >
                OPEN IN NEW TAB ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
