"use client";
import { useEffect, useState } from "react";
import { HiBars3 } from "react-icons/hi2";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ["about", "experience", "projects", "skills", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="site-nav" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '0 40px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(2,4,8,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,240,255,0.08)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    }}>
      {/* Logo */}
      <a href="#" className="site-logo" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--accent)',
        textDecoration: 'none',
        letterSpacing: '0.1em',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          width: 32, height: 32,
          border: '1px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 800,
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          background: 'rgba(0,240,255,0.08)',
        }}>BI</span>
        <span className="nav-name" style={{ color: 'var(--text)', fontWeight: 400 }}>Bhushan</span>
        <span className="nav-name">Ingale</span>
      </a>

      {/* Desktop Links */}
      <ul style={{
        display: 'flex', gap: 36, listStyle: 'none',
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em',
      }} className="desktop-nav">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}
              style={{
                color: active === l.href.slice(1) ? 'var(--accent)' : 'var(--muted)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = active === l.href.slice(1) ? 'var(--accent)' : 'var(--muted)')}
            >
              {active === l.href.slice(1) && (
                <span style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0, height: 1,
                  background: 'var(--accent)',
                }} />
              )}
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href="#contact" className="btn-primary hover-target nav-cta" style={{ fontSize: '0.7rem', padding: '8px 20px' }}>
        Hire Me
      </a>

      {/* Mobile menu trigger */}
      <button
        className="mobile-menu-btn"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        style={{
          display: 'none',
          width: 40,
          height: 40,
          border: '1px solid rgba(0,240,255,0.28)',
          background: 'rgba(0,240,255,0.08)',
          color: 'var(--accent)',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        <HiBars3 size={22} />
      </button>

      {/* Mobile overlay */}
      <div
        className="mobile-menu-overlay"
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2,4,8,0.65)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          zIndex: 1100,
        }}
      />

      {/* Mobile right drawer */}
      <aside
        className="mobile-menu-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: 'min(82vw, 320px)',
          background: 'rgba(2,4,8,0.96)',
          borderLeft: '1px solid rgba(0,240,255,0.18)',
          backdropFilter: 'blur(18px)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 1200,
          padding: '22px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em' }}>MENU</span>
          <button
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            style={{
              border: '1px solid rgba(74,96,112,0.45)',
              background: 'transparent',
              color: 'var(--muted)',
              width: 34,
              height: 34,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div className="cyber-divider" style={{ maxWidth: '100%' }} />

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {links.map((l) => (
            <a
              key={`mobile-${l.href}`}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: active === l.href.slice(1) ? 'var(--accent)' : 'var(--text)',
                border: '1px solid rgba(74,96,112,0.35)',
                padding: '11px 12px',
                background: active === l.href.slice(1) ? 'rgba(0,240,255,0.08)' : 'transparent',
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </aside>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}
