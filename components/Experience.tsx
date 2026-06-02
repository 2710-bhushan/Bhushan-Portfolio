"use client";
import { useEffect, useRef } from "react";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add("visible"), delay);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

// Array holding work experiences (Optifyx removed, CodeCraft updated to CodeClause)
const experiencesData = [
  {
    id: 1,
    role: "Generative AI Engineer & Full Stack Developer Intern",
    company: "CodeClause",
    location: "Mangaluru, India",
    period: "May 2025 – Dec 2025",
    techStack: ['Python', 'React', 'Node.js', 'Spring Boot', 'MySQL', 'LLMs', 'OpenAI APIs'],
    achievements: [
      { metric: "AI", desc: "Engineered LLM custom code generators & chatbots" },
      { metric: "API", desc: "Integrated OpenAI APIs for business workflows" },
      { metric: "Full-Stack", desc: "Developed scalable web applications" },
    ],
    responsibilities: [
      "Engineered intelligent automation tools using Large Language Models (LLMs), including custom code generators and chatbots.",
      "Integrated OpenAI APIs into web and mobile applications, utilizing Python and NLP to automate complex business workflows.",
      "Developed scalable full-stack web applications using React, Node.js, Spring Boot, and MySQL.",
      "Designed and consumed RESTful APIs to optimize backend logic and ensure responsive frontend performance."
    ]
  },
  {
    id: 2,
    role: "Virtual Intern: Software Engineering & Cyber Security",
    company: "Accenture & Deloitte",
    location: "Remote (Australia)",
    period: "Jan 2026 – Present",
    techStack: ['SDLC', 'Cyber Security', 'System Architecture', 'Risk Assessment'],
    achievements: [
      { metric: "SDLC", desc: "Applied scalable architecture principles" },
      { metric: "Security", desc: "Conducted threat detection simulations" },
      { metric: "Audit", desc: "Identified vulnerabilities & improved protocols" },
    ],
    responsibilities: [
      "Analyzed Software Development Lifecycle (SDLC) methodologies and applied scalable architecture principles to project simulations.",
      "Conducted threat detection simulations and risk assessments to identify security vulnerabilities and recommend protocol improvements."
    ]
  }
];

export default function Experience() {
  const r1 = useReveal();
  const r2 = useReveal(200);
  const r3 = useReveal(400);

  return (
    <section id="experience" className="experience-section" style={{ padding: '120px 60px', background: 'rgba(5,13,24,0.6)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Professional Experience
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
        </div>

        {/* Experience List */}
        <div className="reveal" ref={r2} style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {experiencesData.map((job) => (
            <div key={job.id} className="experience-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              
              {/* Left: Job card */}
              <div className="glass-card" style={{
                padding: '36px',
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 200, height: 200,
                  background: 'radial-gradient(circle, rgba(123,47,255,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div className="experience-job-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ paddingRight: '10px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 6, textTransform: 'uppercase' }}>
                      {job.role}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      {job.company}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                      {job.location}
                    </div>
                  </div>
                  <div className="experience-period" style={{
                    padding: '4px 12px',
                    border: '1px solid rgba(0,240,255,0.2)',
                    background: 'rgba(0,240,255,0.05)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--accent)',
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {job.period}
                  </div>
                </div>

                <div className="cyber-divider" style={{ marginBottom: 20 }} />

                {/* Tech stack used */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: 10, textTransform: 'uppercase' }}>Tech Stack</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {job.techStack.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="experience-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {job.achievements.map((a, i) => (
                    <div key={i} style={{
                      padding: '12px 8px',
                      border: '1px solid rgba(0,240,255,0.1)',
                      background: 'rgba(0,240,255,0.03)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{a.metric}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Highlights list */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 20, textTransform: 'uppercase' }}>
                  Key Responsibilities
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {job.responsibilities.map((resp, i) => (
                    <div key={i} className="glass-card" style={{
                      padding: '16px 20px',
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      transition: 'border-color 0.3s, background 0.3s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,240,255,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,240,255,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--glass)'; }}
                    >
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>▸</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(232,244,248,0.7)', lineHeight: 1.6 }}>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Centered Education Section */}
        <div className="reveal" ref={r3} style={{ marginTop: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 40, textTransform: 'uppercase', textAlign: 'center' }}>
            Education
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 20, width: 'fit-content' }}>
            <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--accent), rgba(0,240,255,0.1))' }} />
            {[
              { school: 'Govt College of Engineering Jalgaon', degree: 'B.Tech Computer Engineering', period: 'Aug 2025 – Jul 2028', grade: 'CGPA: 9.68/10' },
              { school: "GF's Godavari College", degree: 'Diploma — Computer Engineering', period: 'Sep 2022 – Jul 2025', grade: '90.74%' },
            ].map((e, i) => (
              <div key={i} style={{ paddingLeft: 16, paddingBottom: 24, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -14, top: 6, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--muted)', boxShadow: i === 0 ? '0 0 10px var(--accent)' : 'none' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{e.school}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(232,244,248,0.5)', marginBottom: 4 }}>{e.degree}</div>
                <div className="experience-edu-row" style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{e.period}</span>
                  <span className="tag" style={{ fontSize: '0.58rem' }}>{e.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
