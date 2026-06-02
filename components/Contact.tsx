"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { IconType } from "react-icons";
import { FaArrowRightLong, FaCircleCheck, FaFileLines, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdEmail, MdPhone } from "react-icons/md";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTimeout(() => el.classList.add("visible"), delay);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function Contact() {
  const r1 = useReveal();
  const r2 = useReveal(200);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(74,96,112,0.3)',
    color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    borderRadius: 0,
  };

  const submitContactMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; message: string }) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message.');
      }

      return data;
    },
    onSuccess: () => {
      setSent(true);
      setSubmitError("");
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    },
    onError: (error: Error) => {
      setSubmitError(error.message || 'Failed to send message. Please try again.');
    },
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    setSubmitError("");
    submitContactMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
  };

  return (
    <section id="contact" className="contact-section" style={{ padding: '120px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(0,240,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal" ref={r1} style={{ marginBottom: 60, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Let's Build Together
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300, margin: '16px auto 0' }} />
          <p style={{ marginTop: 20, fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(232,244,248,0.5)', maxWidth: 500, margin: '20px auto 0' }}>
            Have a project in mind or want to discuss opportunities? Let's connect and create something amazing.
          </p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          {/* Left: Info */}
          <div className="reveal" ref={r2}>
            <div style={{ marginBottom: 40 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem', fontWeight: 800,
                lineHeight: 1.2, marginBottom: 16,
              }}>
                <span className="gradient-text">Ready to</span>
                <br />
                <span style={{ color: 'var(--text)' }}>collaborate?</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(232,244,248,0.6)', lineHeight: 1.8 }}>
                I'm currently available for freelance projects, full-time positions, and internships. 
                Based in Jalgaon, India — open to remote work globally.
              </p>
            </div>

            {/* Contact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: MdEmail, label: 'Email', value: 'bhushaningale2006@gmail.com', href: 'mailto:bhushaningale2006@gmail.com' },
                { icon: MdPhone, label: 'Phone', value: '+91 9405932763', href: 'tel:+919405932763' },
                { icon: FaLinkedinIn, label: 'LinkedIn', value: 'Connect on LinkedIn', href: 'https://www.linkedin.com/in/bhushaningale27' },
                { icon: FaGithub, label: 'GitHub', value: 'github.com/bhushan-ingale', href: 'https://github.com/2710-bhushan' },
                { icon: FaFileLines, label: 'Resume', value: 'View Resume (PDF)', href: '/Bhushan_Resume.pdf' },
              ].map((c: { icon: IconType; label: string; value: string; href: string }) => (
                <a key={c.label} href={c.href}
                  target={c.href.startsWith('http') || c.href.endsWith('.pdf') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') || c.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                  className="glass-card hover-target"
                  style={{
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    textDecoration: 'none',
                    transition: 'border-color 0.3s, background 0.3s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,240,255,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,240,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--glass)'; }}
                >
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, display: 'inline-flex' }}>
                    <c.icon />
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--accent)' }}>{c.value}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.8rem', display: 'inline-flex' }}><FaArrowRightLong /></span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-card" style={{
            padding: '36px',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}>
            {sent ? (
              <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16,
              }}>
                <div style={{ fontSize: '3rem', display: 'inline-flex', color: 'var(--accent)' }}><FaCircleCheck /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--accent)' }}>Message Sent!</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,244,248,0.6)', fontSize: '0.9rem' }}>
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Send a Message
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Name</label>
                    <input
                      style={inputStyle}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,240,255,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(74,96,112,0.3)')}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Email</label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,240,255,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(74,96,112,0.3)')}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Message</label>
                    <textarea
                      rows={5}
                      style={{ ...inputStyle, resize: 'none' }}
                      placeholder="Tell me about your project..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,240,255,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(74,96,112,0.3)')}
                    />
                  </div>
                  <button className="btn-primary hover-target" onClick={handleSubmit} style={{ width: '100%', fontSize: '0.75rem' }}>
                    {submitContactMutation.isPending ? 'Sending...' : 'Send Message →'}
                  </button>
                  {submitError && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#ff6b8a' }}>
                      {submitError}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="contact-footer" style={{
          marginTop: 80, paddingTop: 32,
          borderTop: '1px solid rgba(74,96,112,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            © 2025 <span style={{ color: 'var(--accent)' }}>Bhushan Ingale</span> — Designed & Built with passion
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
            MERN STACK · NEXT.JS · FULL STACK
          </div>
        </div>
      </div>
    </section>
  );
}
