"use client";
import { useEffect, useRef, useState } from "react";

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

function ProjectCard({ project, index }: { project: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const pendingTiltRef = useRef({ x: 0, y: 0 });
  const hasGithub = typeof project.github === 'string' && project.github.trim() !== '' && project.github !== '#';

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    pendingTiltRef.current = { x: dy * -5, y: dx * 5 };

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      setTilt(pendingTiltRef.current);
      rafRef.current = null;
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      }}
      className="hover-target"
      style={{
        perspective: 800,
        cursor: 'none',
        willChange: 'transform',
      }}
    >
      <div style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
        transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}>
        <div className="glass-card" style={{
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          borderColor: hovered ? project.color.replace(')', ', 0.4)').replace('rgb', 'rgba') : 'var(--glass-border)',
          transition: 'border-color 0.3s',
        }}>
          {/* Color splash */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${project.accentBg} 0%, transparent 70%)`,
            transition: 'opacity 0.3s',
            opacity: hovered ? 1 : 0.5,
            pointerEvents: 'none',
          }} />

          {/* Number */}
          <div style={{
            position: 'absolute', top: 20, right: 28,
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
            userSelect: 'none',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: project.color, letterSpacing: '0.15em', marginBottom: 8, textTransform: 'uppercase' }}>
              {project.type}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--text)', lineHeight: 1.3, marginBottom: 8,
            }}>
              {project.title}
            </h3>
          </div>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.7,
            color: 'rgba(232,244,248,0.6)', marginBottom: 20,
          }}>
            {project.desc}
          </p>

          {/* Highlights */}
          <div style={{ marginBottom: 20 }}>
            {project.highlights.map((h: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <span style={{ color: project.color, fontSize: '0.7rem', marginTop: 3, flexShrink: 0 }}>◆</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(232,244,248,0.55)', lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {project.tech.map((t: string) => (
              <span key={t} className="tag" style={{ borderColor: `${project.color.replace(')', ', 0.3)').replace('rgb', 'rgba')}`, color: project.color }}>
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="project-links" style={{ display: 'flex', gap: 12 }}>
            <a href={project.demo || '#'} target="_blank" className="hover-target" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              padding: '8px 20px',
              border: `1px solid ${project.color}`,
              color: project.color, textDecoration: 'none',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              transition: 'background 0.3s',
              background: hovered ? `${project.color.replace(')', ', 0.1)').replace('rgb', 'rgba')}` : 'transparent',
            }}>
              Demo →
            </a>
            {hasGithub && (
              <a href={project.github} target="_blank" className="hover-target" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
                padding: '8px 20px',
                border: '1px solid rgba(74,96,112,0.4)',
                color: 'var(--muted)', textDecoration: 'none',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}>
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


const projects = [
  {
    title: "Customer Service Portal",
    type: "Full Stack Service Booking Platform",
    desc: "A real-time online service booking platform developed for customers to hire electricians, plumbers, technicians, and home service providers through a secure digital workflow.",
    highlights: [
      "Real-time service booking and request management",
      "Customer and provider authentication workflow",
      "Modern responsive dashboard with API integration",
    ],
    tech: ['Python', 'Flask', 'JavaScript', 'SQLite3', 'REST API', 'Authentication'],
    color: 'rgb(255, 60, 172)',
    accentBg: 'rgba(255,60,172,0.1)',
    demo: 'https://bhushan2710.pythonanywhere.com',
    github: 'https://github.com/2710-bhushan/Customer_Service_Protal',
  },

   {
    title: "Bank Kisok System",
    type: "Enterprise Banking Management System",
    desc: "A real-time banking kiosk and account management platform developed for handling customer onboarding, KYC verification, account services, transactions, and secure banking operations.",
    highlights: [
      "Customer account creation and KYC verification workflow",
      "Real-time deposit, withdrawal, and balance management system",
      "Secure transaction processing with database integration",
    ],
    tech: ['Java', 'Java Swing', 'MySQL', 'JDBC', 'Authentication'],
    color: 'rgb(0, 240, 255)',
    accentBg: 'rgba(0,240,255,0.1)',
    demo: '#',
    github: 'https://github.com/2710-bhushan/Boi-Kiosk-Software',
  },

  {
    title: "Result Publishing Portal",
    type: "Educational Result Publishing System",
    desc: "A secure result publishing platform developed for schools and colleges to instantly publish examination results online without affecting their existing academic systems.",
    highlights: [
      "Instant online result publishing workflow",
      "Independent portal integration without modifying existing systems",
      "Fast student result search and retrieval functionality",
    ],
    tech: ['Python', 'Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    color: 'rgb(0, 240, 255)',
    accentBg: 'rgba(0,240,255,0.1)',
    demo: 'https://result.pythonanywhere.com',
    github: 'https://result.pythonanywhere.com',
  },

  {
    title: "MediLink Emergency Network",
    type: "Real-Time Healthcare Management Platform",
    desc: "A real-time healthcare emergency platform developed for hospital bed booking, ambulance tracking, emergency requests, and live availability management across multiple city hospitals.",
    highlights: [
      "Real-time hospital bed availability system",
      "Emergency ambulance booking and tracking",
      "Multi-hospital live synchronization workflow",
    ],
    tech: ['Python', 'Flask', 'MongoDB', 'Socket.IO', 'REST API'],
    color: 'rgb(123, 47, 255)',
    accentBg: 'rgba(123,47,255,0.1)',
    demo: 'https://swasthyasetu.pythonanywhere.com/',
    github: 'https://github.com/2710-bhushan/SwasthyaSetu',
  },

{
  title: "Real Internet Banking System",
  type: "Enterprise Internet Banking Management System",
  desc: "A real-time enterprise banking and internet banking platform developed to simulate real-world banking operations including account management, KYC verification, online banking services, secure transactions, balance monitoring, and customer workflow automation.",
  highlights: [
    "Real-time internet banking system with secure customer login",
    "Account creation, KYC verification, deposit, withdrawal, and fund transfer modules",
    "Online banking dashboard with transaction history and balance management",
  ],
  tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Authentication'],
  color: 'rgb(0, 240, 255)',
  accentBg: 'rgba(0,240,255,0.1)',
  demo: '#',
  github: 'https://github.com/2710-bhushan/PHP_Internet_Banking',
},


  {
    title: "MovieStream Hub",
    type: "Online Movie Streaming Platform",
    desc: "A movie streaming and download platform developed for users to explore, watch, and download entertainment content through a responsive web application.",
    highlights: [
      "Online movie streaming and download support",
      "Search and category-based content management",
      "Responsive media-focused user interface",
    ],
    tech: ['Python', 'Flask', 'JavaScript', 'MySQL', 'Bootstrap'],
    color: 'rgb(255, 60, 172)',
    accentBg: 'rgba(255,60,172,0.1)',
    demo: 'https://github.com/2710-bhushan/Movie-Download-WebSite',
    github: 'https://github.com/2710-bhushan/Movie-Download-WebSite',
  },

  {
    title: "PlayVerse Gaming Arena",
    type: "Online Gaming Platform",
    desc: "A browser-based online gaming platform developed for users to access and play interactive games with responsive gameplay and entertainment-focused UI design.",
    highlights: [
      "Interactive browser-based gaming platform",
      "Responsive and user-friendly gaming interface",
      "Multi-game support with optimized performance",
    ],
    tech: ['Python', 'Flask', 'JavaScript', 'HTML', 'CSS'],
    color: 'rgb(0, 240, 255)',
    accentBg: 'rgba(0,240,255,0.1)',
    demo: 'https://github.com/2710-bhushan/Online-Game-Playing',
    github: 'https://github.com/2710-bhushan/Online-Game-Playing',
  },

  {
    title: "FoodFusion POS",
    type: "Restaurant Ordering & POS Platform",
    desc: "A comprehensive restaurant management platform enabling customers to place orders online while restaurant owners manage billing, inventory, and operations in real time.",
    highlights: [
      "Role-based POS system for restaurant operations",
      "Real-time order synchronization between kitchen and billing",
      "Inventory management and analytics dashboard",
    ],
    tech: ['PHP', 'MySQL', 'JavaScript', 'REST APIs'],
    color: 'rgb(123, 47, 255)',
    accentBg: 'rgba(123,47,255,0.1)',
    demo: '#',
    github: '#',
  },

  {
    title: "AI Recipe Intelligence",
    type: "AI / Smart Nutrition Application",
    desc: "An AI-powered nutrition platform developed to generate intelligent recipe recommendations using ingredients, calorie analysis, and personalized food preferences.",
    highlights: [
      "AI-based personalized recipe generation",
      "Ingredient and nutrition filtering workflow",
      "Favorites and recommendation management system",
    ],
    tech: ['Python', 'Flask', 'MySQL', 'AI APIs'],
    color: 'rgb(255, 60, 172)',
    accentBg: 'rgba(255,60,172,0.1)',
    demo: '#',
    github: '#',
  },

  {
    title: "EventSphere",
    type: "College Event Management Platform",
    desc: "A web-based event management system designed for colleges to streamline registrations, participant tracking, notifications, and event coordination workflows.",
    highlights: [
      "Automated participant registration workflow",
      "Real-time event management dashboard",
      "Integrated notification and engagement modules",
    ],
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    color: 'rgb(0, 240, 255)',
    accentBg: 'rgba(0,240,255,0.1)',
    demo: '#',
    github: '#',
  },

  {
    title: "Music Recommendation Engine",
    type: "Machine Learning Application",
    desc: "An intelligent music recommendation system developed using machine learning algorithms to suggest songs based on user preferences and listening patterns.",
    highlights: [
      "Personalized recommendation engine",
      "Behavior and preference-based music suggestions",
      "Enhanced user engagement through smart filtering",
    ],
    tech: ['Python', 'Machine Learning', 'Data Processing'],
    color: 'rgb(123, 47, 255)',
    accentBg: 'rgba(123,47,255,0.1)',
    demo: '#',
    github: '#',
  },

  {
    title: "MediScan OCR",
    type: "AI / OCR Healthcare Platform",
    desc: "An OCR-powered healthcare platform designed to extract and digitize handwritten prescriptions and medical reports for faster healthcare workflows.",
    highlights: [
      "OCR-based medical text extraction",
      "Prescription and report digitization system",
      "Automated healthcare document processing",
    ],
    tech: ['Python', 'OCR', 'Machine Learning', 'Flask'],
    color: 'rgb(255, 60, 172)',
    accentBg: 'rgba(255,60,172,0.1)',
    demo: '#',
    github: '#',
  },
];



export default function Projects() {
  const [projList, setProjList] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.projects)) {
          setProjList(data.projects);
        }
      })
      .catch(err => console.error("Error loading dynamic projects:", err));
  }, []);

  const r1 = useReveal();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const primaryProjectCount = 6;
  const currentProjects = projList || projects;
  const visibleProjects = showAllProjects ? currentProjects : currentProjects.slice(0, primaryProjectCount);
  const hasMoreProjects = currentProjects.length > primaryProjectCount;

  return (
    <section id="projects" className="projects-section" style={{ padding: '120px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" ref={r1} style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Featured Work
          </h2>
          <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
          <p style={{ marginTop: 16, fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(232,244,248,0.5)', maxWidth: 500 }}>
            A selection of projects that showcase my engineering skills and problem-solving approach.
          </p>
        </div>

        <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {visibleProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        {hasMoreProjects && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-primary hover-target"
              onClick={() => setShowAllProjects(v => !v)}
              style={{ fontSize: '0.72rem' }}
            >
              {showAllProjects ? 'Show Less Projects' : 'More Projects'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
