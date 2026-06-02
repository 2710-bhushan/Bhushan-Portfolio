"use client";
import { useEffect, useRef, useState } from "react";

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

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const [filled, setFilled] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setFilled(level), delay);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [level, delay]);

  return (
    <div ref={barRef} style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)', letterSpacing: '0.05em' }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${filled}%`,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: 2,
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1)`,
          boxShadow: `0 0 8px ${color}66`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', right: 0, top: -2, width: 8, height: 7,
            borderRadius: '50%', background: color,
            boxShadow: `0 0 8px ${color}`,
          }} />
        </div>
      </div>
    </div>
  );
}

const skillGroups = [
  {
    label: 'Frontend',
    color: 'rgb(0,240,255)',
    skills: [
      { name: 'React.js / Next.js', level: 90 },
      { name: 'TypeScript', level: 82 },
      { name: 'HTML / CSS', level: 92 },
      { name: 'Redux / TanStack Query', level: 80 },
      { name: 'Tailwind / Bootstrap', level: 88 },
    ],
  },
  {
    label: 'Backend',
    color: 'rgb(123,47,255)',
    skills: [
      { name: 'Node.js / Express.js', level: 87 },
      { name: 'RESTful APIs', level: 90 },
      { name: 'GraphQL', level: 76 },
      { name: 'PHP', level: 75 },
      { name: 'Python / Flask', level: 78 },
      { name: 'Django', level: 92 },
    ],
  },
  {
    label: 'Database & DevOps',
    color: 'rgb(255,60,172)',
    skills: [
      { name: 'MongoDB', level: 86 },
      { name: 'MySQL / PostgreSQL', level: 82 },
      { name: 'Git / GitHub', level: 90 },
      { name: 'Docker', level: 68 },
      { name: 'AWS (EC2/S3)', level: 65 },
    ],
  },
];

const techBubbles = [
  'JavaScript', 'Python', 'PHP', 'Java', 'SQL', 'TypeScript',
  'React.js', 'Next.js', 'Node.js', 'Express.js', 'Django',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Flask', 'REST APIs',
  'Docker', 'AWS', 'Git', 'Postman', 'VS Code', 'TanStack Query'
];

export default function Skills() {
  const r1 = useReveal();

  return (
    <section id="skills" className="skills-section" style={{ padding: '120px 60px', background: 'rgba(5,13,24,0.6)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Technical Arsenal
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
        </div>

        {/* Skill bars grid */}
        <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, marginBottom: 60 }}>
          {skillGroups.map((group, gi) => (
            <div key={group.label} className="glass-card" style={{
              padding: '28px',
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: group.color, letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, boxShadow: `0 0 8px ${group.color}` }} />
                {group.label}
              </div>
              {group.skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} level={s.level} color={group.color} delay={i * 100 + gi * 200} />
              ))}
            </div>
          ))}
        </div>

        {/* All-tech cloud */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
            Technologies & Tools
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {techBubbles.map((t, i) => (
              <div key={t} className="hover-target" style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                padding: '6px 14px',
                border: '1px solid rgba(74,96,112,0.3)',
                color: 'var(--muted)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                cursor: 'none',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={e => {
                const colors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)'];
                const c = colors[i % 3];
                (e.currentTarget as HTMLElement).style.color = c;
                (e.currentTarget as HTMLElement).style.borderColor = c;
                (e.currentTarget as HTMLElement).style.background = c.replace(')', ', 0.08)').replace('var(', 'rgba(').replace('--accent', '0,240,255').replace('2', '123,47,255').replace('3', '255,60,172');
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,96,112,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
