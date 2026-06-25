"use client";
import { useEffect, useState } from "react";
import { 
  FaLock, FaPowerOff, FaCertificate, FaAward, FaImages, FaPenNib, 
  FaPlus, FaTrash, FaPen, FaFilePdf, FaCopy, FaCircleCheck, FaArrowUpRightFromSquare 
} from "react-icons/fa6";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"certs" | "achievements" | "media" | "sections">("certs");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Core portfolio state from API
  const [portfolioData, setPortfolioData] = useState<any>({
    hero: null,
    about: null,
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    media: []
  });

  // Load dynamic data
  const loadData = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (data) {
        setPortfolioData({
          hero: data.hero || null,
          about: data.about || null,
          experience: data.experience || null,
          education: data.education || null,
          projects: data.projects || null,
          skills: data.skills || null,
          techBubbles: data.techBubbles || null,
          certifications: data.certifications || [],
          achievements: data.achievements || [],
          media: data.media || []
        });
      }
    } catch (err) {
      console.error("Failed to load portfolio data in admin:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("portfolio_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "M@toshree") {
      setIsAuthenticated(true);
      localStorage.setItem("portfolio_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect admin password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("portfolio_admin_auth");
    setPassword("");
  };

  const showNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  /* ========================================================
     1. CERTIFICATIONS CRUD STATE & FUNCTIONS
     ======================================================== */
  const [certForm, setCertForm] = useState({
    id: "",
    title: "",
    issuer: "",
    date: "",
    url: "",
    image: ""
  });
  const [isEditingCert, setIsEditingCert] = useState(false);

  const resetCertForm = () => {
    setCertForm({ id: "", title: "", issuer: "", date: "", url: "", image: "" });
    setIsEditingCert(false);
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) return;
    setLoading(true);

    try {
      if (isEditingCert && certForm.id) {
        const res = await fetch(`/api/certifications/${certForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certForm)
        });
        if (res.ok) {
          showNotification("Certification updated successfully!");
          resetCertForm();
          loadData();
        }
      } else {
        const res = await fetch("/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certForm)
        });
        if (res.ok) {
          showNotification("Certification added successfully!");
          resetCertForm();
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Error saving certification.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCert = (cert: any) => {
    setCertForm({
      id: cert.id || cert._id,
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date || "",
      url: cert.url || "",
      image: cert.image || ""
    });
    setIsEditingCert(true);
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Certification deleted.");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================================================
     2. ACHIEVEMENTS CRUD STATE & FUNCTIONS
     ======================================================== */
  const [achForm, setAchForm] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
    images: [] as string[]
  });
  const [isEditingAch, setIsEditingAch] = useState(false);
  const [newAchImage, setNewAchImage] = useState("");

  const resetAchForm = () => {
    setAchForm({ id: "", title: "", date: "", description: "", images: [] });
    setIsEditingAch(false);
    setNewAchImage("");
  };

  const handleAchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.title) return;
    setLoading(true);

    try {
      if (isEditingAch && achForm.id) {
        const res = await fetch(`/api/achievements/${achForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(achForm)
        });
        if (res.ok) {
          showNotification("Achievement updated successfully!");
          resetAchForm();
          loadData();
        }
      } else {
        const res = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(achForm)
        });
        if (res.ok) {
          showNotification("Achievement added successfully!");
          resetAchForm();
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Error saving achievement.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAch = (ach: any) => {
    setAchForm({
      id: ach.id || ach._id,
      title: ach.title,
      date: ach.date || "",
      description: ach.description || "",
      images: ach.images || []
    });
    setIsEditingAch(true);
  };

  const handleDeleteAch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Achievement deleted.");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addImageToAch = () => {
    if (!newAchImage.trim()) return;
    setAchForm(prev => ({
      ...prev,
      images: [...prev.images, newAchImage.trim()]
    }));
    setNewAchImage("");
  };

  const removeImageFromAch = (index: number) => {
    setAchForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  /* ========================================================
     3. MEDIA FILES STATE & UPLOAD FUNCTIONS
     ======================================================== */
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        showNotification("File uploaded successfully!");
        setUploadFile(null);
        // Clear input element
        const fileInput = document.getElementById("admin-file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        loadData();
      } else {
        showNotification("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Upload error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file from server?")) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Media deleted from disk and DB.");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  /* ========================================================
     4. OPTIONAL CONTENT OVERRIDES FOR EXISTING SECTIONS
     ======================================================== */
  const [activeSectionSubTab, setActiveSectionSubTab] = useState<"hero" | "about" | "experience" | "projects" | "skills">("hero");

  // Hero custom edit state
  const [heroForm, setHeroForm] = useState({
    greeting: "",
    firstName: "",
    lastName: "",
    statusBadge: "",
    description: "",
    rolesStr: "",
    ctaPrimary: "",
    ctaSecondary: "",
    cvUrl: "",
    statsList: [{ num: "", label: "" }]
  });

  // About custom edit state
  const [aboutForm, setAboutForm] = useState({
    title: "",
    paragraph1: "",
    paragraph2: "",
    metaList: [{ label: "", value: "" }],
    statsList: [{ num: "", label: "", color: "", iconName: "" }]
  });

  // Experience custom edit state
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [educationList, setEducationList] = useState<any[]>([]);

  // Projects custom edit state
  const [projectsList, setProjectsList] = useState<any[]>([]);

  // Skills custom edit state
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [bubblesStr, setBubblesStr] = useState("");

  // Populate Section Editors when dynamic portfolioData changes or loaded
  useEffect(() => {
    if (portfolioData.hero) {
      setHeroForm({
        greeting: portfolioData.hero.greeting || "Hello, I'm",
        firstName: portfolioData.hero.firstName || "Bhushan",
        lastName: portfolioData.hero.lastName || "Ingale",
        statusBadge: portfolioData.hero.statusBadge || "AVAILABLE FOR HIRE",
        description: portfolioData.hero.description || "",
        rolesStr: Array.isArray(portfolioData.hero.roles) ? portfolioData.hero.roles.join(", ") : "",
        ctaPrimary: portfolioData.hero.ctaPrimary || "View Projects",
        ctaSecondary: portfolioData.hero.ctaSecondary || "Contact Me",
        cvUrl: portfolioData.hero.cvUrl || "",
        statsList: portfolioData.hero.stats || [{ num: "", label: "" }]
      });
    } else {
      setHeroForm({
        greeting: "Hello, I'm",
        firstName: "Bhushan",
        lastName: "Ingale",
        statusBadge: "AVAILABLE FOR HIRE",
        description: "Crafting scalable web applications with the MERN stack. Passionate about clean architecture, performance optimization, and building seamless user experiences that make a difference.",
        rolesStr: "Full Stack Developer, MERN Stack Engineer, React Specialist, API Architect, UI/UX Enthusiast",
        ctaPrimary: "View Projects",
        ctaSecondary: "Contact Me",
        cvUrl: "/Bhushan_Resume.pdf",
        statsList: [
          { num: "40%", label: "Latency Cut" },
          { num: "35%", label: "Faster Pages" },
          { num: "10+", label: "Projects" }
        ]
      });
    }

    if (portfolioData.about) {
      setAboutForm({
        title: portfolioData.about.title || "Who I Am",
        paragraph1: portfolioData.about.paragraph1 || "",
        paragraph2: portfolioData.about.paragraph2 || "",
        metaList: portfolioData.about.meta || [{ label: "", value: "" }],
        statsList: portfolioData.about.stats || [{ num: "", label: "", color: "", iconName: "" }]
      });
    } else {
      setAboutForm({
        title: "Who I Am",
        paragraph1: "I'm a <span style=\"color: var(--accent)\">Full Stack Developer</span> currently pursuing B.Tech in Computer Engineering at Government College OF Engineering, Jalgaon, with hands-on internship experience building scalable full-stack products.",
        paragraph2: "I specialize in building end-to-end web solutions — from designing intuitive React UIs to architecting robust Node.js backends. I've worked as a Full Stack Developer Intern at <span style=\"color: var(--accent2)\">CodeClause</span>, where I engineered real-time CMS systems and improved performance metrics significantly.",
        metaList: [
          { label: "Location", value: "Bhusawal, India" },
          { label: "Email", value: "bhushaningale2006@gmail.com" },
          { label: "Degree", value: "B.Tech Computer Engineering" },
          { label: "Status", value: "Available for hire" }
        ],
        statsList: [
          { num: "40%", label: "Latency Reduced", color: "var(--accent)", iconName: "FaBolt" },
          { num: "35%", label: "Faster Page Load", color: "var(--accent2)", iconName: "FaRocket" },
          { num: "10+", label: "Projects Built", color: "var(--accent3)", iconName: "FaLaptopCode" },
          { num: "MERN", label: "Stack Focus", color: "var(--gold)", iconName: "FaScrewdriverWrench" }
        ]
      });
    }

    if (Array.isArray(portfolioData.experience) && portfolioData.experience.length > 0) {
      setJobsList(portfolioData.experience);
    } else {
      setJobsList([
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
            { metric: "Full-Stack", desc: "Developed scalable web applications" }
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
            { metric: "Audit", desc: "Identified vulnerabilities & improved protocols" }
          ],
          responsibilities: [
            "Analyzed Software Development Lifecycle (SDLC) methodologies and applied scalable architecture principles to project simulations.",
            "Conducted threat detection simulations and risk assessments to identify security vulnerabilities and recommend protocol improvements."
          ]
        }
      ]);
    }

    if (Array.isArray(portfolioData.education) && portfolioData.education.length > 0) {
      setEducationList(portfolioData.education);
    } else {
      setEducationList([
        { school: 'Govt College of Engineering Jalgaon', degree: 'B.Tech Computer Engineering', period: 'Aug 2025 – Jul 2028', grade: 'CGPA: 9.68/10' },
        { school: "GF's Godavari College", degree: 'Diploma — Computer Engineering', period: 'Sep 2022 – Jul 2025', grade: '90.74%' }
      ]);
    }

    if (Array.isArray(portfolioData.projects) && portfolioData.projects.length > 0) {
      setProjectsList(portfolioData.projects);
    } else {
      // Default array of 12 projects
      setProjectsList([
        {
          title: "Customer Service Portal",
          type: "Full Stack Service Booking Platform",
          desc: "A real-time online service booking platform developed for customers to hire electricians, plumbers, technicians, and home service providers through a secure digital workflow.",
          highlights: [
            "Real-time service booking and request management",
            "Customer and provider authentication workflow",
            "Modern responsive dashboard with API integration"
          ],
          tech: ['Python', 'Flask', 'JavaScript', 'SQLite3', 'REST API', 'Authentication'],
          color: 'rgb(255, 60, 172)',
          accentBg: 'rgba(255,60,172,0.1)',
          demo: 'https://bhushan2710.pythonanywhere.com',
          github: 'https://github.com/2710-bhushan/Customer_Service_Protal'
        },
        {
          title: "Bank Kisok System",
          type: "Enterprise Banking Management System",
          desc: "A real-time banking kiosk and account management platform developed for handling customer onboarding, KYC verification, account services, transactions, and secure banking operations.",
          highlights: [
            "Customer account creation and KYC verification workflow",
            "Real-time deposit, withdrawal, and balance management system",
            "Secure transaction processing with database integration"
          ],
          tech: ['Java', 'Java Swing', 'MySQL', 'JDBC', 'Authentication'],
          color: 'rgb(0, 240, 255)',
          accentBg: 'rgba(0,240,255,0.1)',
          demo: '#',
          github: 'https://github.com/2710-bhushan/Boi-Kiosk-Software'
        },
        {
          title: "Result Publishing Portal",
          type: "Educational Result Publishing System",
          desc: "A secure result publishing platform developed for schools and colleges to instantly publish examination results online without affecting their existing academic systems.",
          highlights: [
            "Instant online result publishing workflow",
            "Independent portal integration without modifying existing systems",
            "Fast student result search and retrieval functionality"
          ],
          tech: ['Python', 'Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
          color: 'rgb(0, 240, 255)',
          accentBg: 'rgba(0,240,255,0.1)',
          demo: 'https://result.pythonanywhere.com',
          github: 'https://result.pythonanywhere.com'
        },
        {
          title: "MediLink Emergency Network",
          type: "Real-Time Healthcare Management Platform",
          desc: "A real-time healthcare emergency platform developed for hospital bed booking, ambulance tracking, emergency requests, and live availability management across multiple city hospitals.",
          highlights: [
            "Real-time hospital bed availability system",
            "Emergency ambulance booking and tracking",
            "Multi-hospital live synchronization workflow"
          ],
          tech: ['Python', 'Flask', 'MongoDB', 'Socket.IO', 'REST API'],
          color: 'rgb(123, 47, 255)',
          accentBg: 'rgba(123,47,255,0.1)',
          demo: 'https://swasthyasetu.pythonanywhere.com/',
          github: 'https://github.com/2710-bhushan/SwasthyaSetu'
        },
        {
          title: "Real Internet Banking System",
          type: "Enterprise Internet Banking Management System",
          desc: "A real-time enterprise banking and internet banking platform developed to simulate real-world banking operations including account management, KYC verification, online banking services, secure transactions, balance monitoring, and customer workflow automation.",
          highlights: [
            "Real-time internet banking system with secure customer login",
            "Account creation, KYC verification, deposit, withdrawal, and fund transfer modules",
            "Online banking dashboard with transaction history and balance management"
          ],
          tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Authentication'],
          color: 'rgb(0, 240, 255)',
          accentBg: 'rgba(0,240,255,0.1)',
          demo: '#',
          github: 'https://github.com/2710-bhushan/PHP_Internet_Banking'
        },
        {
          title: "MovieStream Hub",
          type: "Online Movie Streaming Platform",
          desc: "A movie streaming and download platform developed for users to explore, watch, and download entertainment content through a responsive web application.",
          highlights: [
            "Online movie streaming and download support",
            "Search and category-based content management",
            "Responsive media-focused user interface"
          ],
          tech: ['Python', 'Flask', 'JavaScript', 'MySQL', 'Bootstrap'],
          color: 'rgb(255, 60, 172)',
          accentBg: 'rgba(255,60,172,0.1)',
          demo: 'https://github.com/2710-bhushan/Movie-Download-WebSite',
          github: 'https://github.com/2710-bhushan/Movie-Download-WebSite'
        }
      ]);
    }

    if (Array.isArray(portfolioData.skills) && portfolioData.skills.length > 0) {
      setSkillsList(portfolioData.skills);
    } else {
      setSkillsList([
        {
          label: 'Frontend',
          color: 'rgb(0,240,255)',
          skills: [
            { name: 'React.js / Next.js', level: 90 },
            { name: 'TypeScript', level: 82 },
            { name: 'HTML / CSS', level: 92 },
            { name: 'Redux / TanStack Query', level: 80 },
            { name: 'Tailwind / Bootstrap', level: 88 }
          ]
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
            { name: 'Django', level: 92 }
          ]
        },
        {
          label: 'Database & DevOps',
          color: 'rgb(255,60,172)',
          skills: [
            { name: 'MongoDB', level: 86 },
            { name: 'MySQL / PostgreSQL', level: 82 },
            { name: 'Git / GitHub', level: 90 },
            { name: 'Docker', level: 68 },
            { name: 'AWS (EC2/S3)', level: 65 }
          ]
        }
      ]);
    }

    if (Array.isArray(portfolioData.techBubbles)) {
      setBubblesStr(portfolioData.techBubbles.join(", "));
    } else {
      setBubblesStr(
        "JavaScript, Python, PHP, Java, SQL, TypeScript, React.js, Next.js, Node.js, Express.js, Django, MongoDB, MySQL, PostgreSQL, Flask, REST APIs, Docker, AWS, Git, Postman, VS Code, TanStack Query"
      );
    }
  }, [portfolioData]);

  // Handle section saving
  const handleSectionSave = async (section: "hero" | "about" | "experience" | "projects" | "skills") => {
    setLoading(true);
    let payloadData: any = {};

    if (section === "hero") {
      payloadData = {
        greeting: heroForm.greeting,
        firstName: heroForm.firstName,
        lastName: heroForm.lastName,
        statusBadge: heroForm.statusBadge,
        description: heroForm.description,
        roles: heroForm.rolesStr.split(",").map(r => r.trim()).filter(Boolean),
        ctaPrimary: heroForm.ctaPrimary,
        ctaSecondary: heroForm.ctaSecondary,
        cvUrl: heroForm.cvUrl,
        stats: heroForm.statsList
      };
    } else if (section === "about") {
      payloadData = {
        title: aboutForm.title,
        paragraph1: aboutForm.paragraph1,
        paragraph2: aboutForm.paragraph2,
        meta: aboutForm.metaList,
        stats: aboutForm.statsList
      };
    } else if (section === "experience") {
      payloadData = jobsList; // Array of jobs and we save education separately in settings
    } else if (section === "projects") {
      payloadData = projectsList;
    } else if (section === "skills") {
      payloadData = skillsList;
    }

    try {
      // Save primary section
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: payloadData })
      });

      // Special handling: save education alongside experience
      if (section === "experience") {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "education", data: educationList })
        });
      }

      // Special handling: save techBubbles alongside skills
      if (section === "skills") {
        const bubbles = bubblesStr.split(",").map(b => b.trim()).filter(Boolean);
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "techBubbles", data: bubbles })
        });
      }

      if (res.ok) {
        showNotification(`${section.toUpperCase()} section updated successfully!`);
        loadData();
      }
    } catch (err) {
      console.error(err);
      showNotification("Error saving section data.");
    } finally {
      setLoading(false);
    }
  };

  /* Helper list operations for section forms */
  const addHeroStat = () => setHeroForm(prev => ({ ...prev, statsList: [...prev.statsList, { num: "", label: "" }] }));
  const removeHeroStat = (index: number) => setHeroForm(prev => ({ ...prev, statsList: prev.statsList.filter((_, i) => i !== index) }));

  const addAboutMeta = () => setAboutForm(prev => ({ ...prev, metaList: [...prev.metaList, { label: "", value: "" }] }));
  const removeAboutMeta = (index: number) => setAboutForm(prev => ({ ...prev, metaList: prev.metaList.filter((_, i) => i !== index) }));

  const addAboutStat = () => setAboutForm(prev => ({ ...prev, statsList: [...prev.statsList, { num: "", label: "", color: "var(--accent)", iconName: "FaLaptopCode" }] }));
  const removeAboutStat = (index: number) => setAboutForm(prev => ({ ...prev, statsList: prev.statsList.filter((_, i) => i !== index) }));

  // Job operations
  const addJob = () => {
    const newJob = {
      id: Date.now(),
      role: "New Role Title",
      company: "Company Name",
      location: "Location",
      period: "Date Range",
      techStack: ["React"],
      achievements: [{ metric: "X%", desc: "Metric outcome" }],
      responsibilities: ["Key responsibility description"]
    };
    setJobsList([...jobsList, newJob]);
  };

  const removeJob = (index: number) => {
    if (confirm("Remove this job position?")) {
      setJobsList(jobsList.filter((_, i) => i !== index));
    }
  };

  // Education operations
  const addEducation = () => {
    setEducationList([...educationList, { school: "School Name", degree: "Degree Title", period: "Dates", grade: "Grade" }]);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  // Project operations
  const addProject = () => {
    const newProj = {
      title: "New Project",
      type: "Project Type",
      desc: "Short summary description.",
      highlights: ["Key highlight 1", "Key highlight 2"],
      tech: ["React", "CSS"],
      color: "rgb(0, 240, 255)",
      accentBg: "rgba(0,240,255,0.1)",
      demo: "#",
      github: "#"
    };
    setProjectsList([...projectsList, newProj]);
  };

  const removeProject = (index: number) => {
    if (confirm("Remove this project?")) {
      setProjectsList(projectsList.filter((_, i) => i !== index));
    }
  };

  // Skill groups operations
  const addSkillGroup = () => {
    const newGroup = {
      label: "New Category",
      color: "rgb(0, 240, 255)",
      skills: [{ name: "Skill Name", level: 80 }]
    };
    setSkillsList([...skillsList, newGroup]);
  };

  const removeSkillGroup = (index: number) => {
    if (confirm("Remove this entire skill category?")) {
      setSkillsList(skillsList.filter((_, i) => i !== index));
    }
  };

  // Render Login overlay if not auth
  if (!isAuthenticated) {
    return (
      <main className="bg-[#020408] min-h-screen flex items-center justify-center p-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="glass-card" style={{
          width: "100%",
          maxWidth: 420,
          padding: "40px",
          border: "1px solid var(--glass-border)",
          background: "var(--glass)",
          backdropFilter: "blur(20px)",
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: "2.4rem", color: "var(--accent)", display: "block", marginBottom: 12 }}>
              <FaLock />
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
              PORTFOLIO<br/><span style={{ color: "var(--accent)" }}>ADMIN CONSOLE</span>
            </h1>
            <div className="cyber-divider" style={{ margin: "16px auto 0", maxWidth: 160 }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                Security Key / Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid var(--glass-border)",
                  color: "white",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem"
                }}
              />
              {authError && (
                <div style={{ color: "var(--accent3)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", marginTop: 6 }}>
                  {authError}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{
                padding: "12px",
                width: "100%",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}
            >
              Verify Identity
            </button>
          </form>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <span style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              DEFAULT KEY: admin123
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#020408] min-h-screen text-[#e8f4f8] p-6 pb-24" style={{ fontFamily: "var(--font-body)", position: "relative" }}>
      {/* Top Navbar */}
      <header style={{
        maxWidth: 1200,
        margin: "0 auto 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 240, 255, 0.08)",
        paddingBottom: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            border: "1px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.95rem", fontWeight: 800,
            background: "rgba(0, 240, 255, 0.08)",
            color: "var(--accent)"
          }}>BI</div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1 }}>
              Bhushan Ingale
            </h1>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.1em" }}>
              CONTROL CENTER
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" target="_blank" style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--accent)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            border: "1px solid rgba(0,240,255,0.2)"
          }}>
            View Website <FaArrowUpRightFromSquare size={10} />
          </a>
          <button 
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid rgba(255,60,172,0.3)",
              color: "rgba(255,60,172,0.8)",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent3)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,60,172,0.8)"}
          >
            <FaPowerOff /> Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
        
        {/* Left Sidebar Navigation */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "certs", label: "Certifications", icon: FaCertificate },
            { id: "achievements", label: "Achievements", icon: FaAward },
            { id: "media", label: "Media Uploads", icon: FaImages },
            { id: "sections", label: "Page Content", icon: FaPenNib }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "14px 18px",
                  background: isActive ? "rgba(0, 240, 255, 0.06)" : "transparent",
                  border: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                  color: isActive ? "var(--accent)" : "var(--muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                <Icon size={14} />
                {tab.label.toUpperCase()}
              </button>
            );
          })}
        </aside>

        {/* Right Dashboard Content */}
        <section>
          {/* Status Save Banner */}
          {saveStatus && (
            <div style={{
              padding: "16px 20px",
              background: "rgba(0, 255, 136, 0.08)",
              border: "1px solid #00ff88",
              color: "#00ff88",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <FaCircleCheck /> {saveStatus}
            </div>
          )}

          {/* TAB 1: CERTIFICATIONS */}
          {activeTab === "certs" && (
            <div className="glass-card" style={{ padding: 32, border: "1px solid var(--glass-border)", background: "var(--glass)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                Manage Certifications & Certificates
              </h2>
              <div className="cyber-divider" style={{ marginBottom: 28, maxWidth: 200 }} />

              {/* Form */}
              <form onSubmit={handleCertSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Certificate Title *</label>
                  <input 
                    type="text"
                    required
                    value={certForm.title}
                    onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Issuer *</label>
                  <input 
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services (AWS)"
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Issue Date</label>
                  <input 
                    type="text"
                    value={certForm.date}
                    onChange={e => setCertForm({ ...certForm, date: e.target.value })}
                    placeholder="e.g. June 2024"
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Credential URL (Verify Link)</label>
                  <input 
                    type="text"
                    value={certForm.url}
                    onChange={e => setCertForm({ ...certForm, url: e.target.value })}
                    placeholder="https://..."
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Certificate Logo/Badge Image URL</label>
                  <input 
                    type="text"
                    value={certForm.image}
                    onChange={e => setCertForm({ ...certForm, image: e.target.value })}
                    placeholder="/uploads/... (Or paste external URL)"
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                  />
                  <small style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: 4, display: "block" }}>
                    Tip: Upload the image under the "Media Uploads" tab first, then copy/paste the URL here!
                  </small>
                </div>

                <div style={{ gridColumn: "span 2", display: "flex", gap: 12, marginTop: 10 }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                    {isEditingCert ? <><FaPen /> Update Certificate</> : <><FaPlus /> Add Certificate</>}
                  </button>
                  {isEditingCert && (
                    <button type="button" onClick={resetCertForm} style={{ padding: "10px 20px", background: "none", border: "1px solid var(--muted)", color: "var(--text)", cursor: "pointer" }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* List */}
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Currently Active Certificates ({portfolioData.certifications.length})
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {portfolioData.certifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", border: "1px dashed var(--glass-border)", color: "var(--muted)" }}>
                    No certifications added yet. Website will show original content.
                  </div>
                ) : (
                  portfolioData.certifications.map((c: any) => (
                    <div key={c.id} style={{ padding: 18, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{c.issuer}</div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "2px 0 6px" }}>{c.title}</h4>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Date: {c.date || "N/A"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleEditCert(c)} style={{ padding: 8, background: "rgba(0,240,255,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", cursor: "pointer" }}>
                          <FaPen size={12} />
                        </button>
                        <button onClick={() => handleDeleteCert(c.id)} style={{ padding: 8, background: "rgba(255,60,172,0.1)", border: "1px solid var(--accent3)", color: "var(--accent3)", cursor: "pointer" }}>
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div className="glass-card" style={{ padding: 32, border: "1px solid var(--glass-border)", background: "var(--glass)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent3)", marginBottom: 6 }}>
                Manage Achievements & Awards
              </h2>
              <div className="cyber-divider" style={{ marginBottom: 28, maxWidth: 200, background: "var(--accent3)" }} />

              {/* Form */}
              <form onSubmit={handleAchSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Achievement / Award Title *</label>
                    <input 
                      type="text"
                      required
                      value={achForm.title}
                      onChange={e => setAchForm({ ...achForm, title: e.target.value })}
                      placeholder="e.g. 1st Place - Smart India Hackathon"
                      style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Date earned</label>
                    <input 
                      type="text"
                      value={achForm.date}
                      onChange={e => setAchForm({ ...achForm, date: e.target.value })}
                      placeholder="e.g. Oct 2025"
                      style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Description & Details</label>
                  <textarea 
                    rows={4}
                    value={achForm.description}
                    onChange={e => setAchForm({ ...achForm, description: e.target.value })}
                    placeholder="Briefly describe the competition, criteria, or scope of this achievement..."
                    style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                  />
                </div>

                {/* Photo Gallery Manager inside Achievement Form */}
                <div style={{ border: "1px solid var(--glass-border)", padding: 20, background: "rgba(0,0,0,0.2)" }}>
                  <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
                    Achievement Photos & Gallery Images
                  </h4>

                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <input 
                      type="text"
                      value={newAchImage}
                      onChange={e => setNewAchImage(e.target.value)}
                      placeholder="Paste image URL (e.g. /uploads/image.jpg)..."
                      style={{ flexGrow: 1, padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.85rem" }}
                    />
                    <button 
                      type="button" 
                      onClick={addImageToAch}
                      style={{ padding: "8px 16px", background: "rgba(255,60,172,0.2)", border: "1px solid var(--accent3)", color: "var(--accent3)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}
                    >
                      ADD TO GALLERY
                    </button>
                  </div>

                  {achForm.images.length === 0 ? (
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "10px 0" }}>
                      No photos added to this achievement yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {achForm.images.map((img, idx) => (
                        <div key={idx} style={{ position: "relative", width: 100, height: 70, border: "1px solid var(--glass-border)", overflow: "hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button 
                            type="button"
                            onClick={() => removeImageFromAch(idx)}
                            style={{
                              position: "absolute", top: 2, right: 2,
                              width: 18, height: 18, borderRadius: "50%",
                              background: "rgba(255,0,0,0.8)", border: "none", color: "white",
                              fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                    {isEditingAch ? <><FaPen /> Update Achievement</> : <><FaPlus /> Add Achievement</>}
                  </button>
                  {isEditingAch && (
                    <button type="button" onClick={resetAchForm} style={{ padding: "10px 20px", background: "none", border: "1px solid var(--muted)", color: "var(--text)", cursor: "pointer" }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* List */}
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Currently Active Achievements ({portfolioData.achievements.length})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {portfolioData.achievements.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", border: "1px dashed var(--glass-border)", color: "var(--muted)" }}>
                    No achievements added yet. Website will show original content.
                  </div>
                ) : (
                  portfolioData.achievements.map((a: any) => (
                    <div key={a.id} style={{ padding: 18, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--accent3)" }}>{a.date || "No Date"}</div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "2px 0 6px" }}>{a.title}</h4>
                        <div style={{ fontSize: "0.8rem", color: "rgba(232,244,248,0.6)", maxWidth: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.description}
                        </div>
                        {Array.isArray(a.images) && a.images.length > 0 && (
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: 6 }}>
                            🖼️ Contains {a.images.length} photos
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleEditAch(a)} style={{ padding: 8, background: "rgba(255,60,172,0.1)", border: "1px solid var(--accent3)", color: "var(--accent3)", cursor: "pointer" }}>
                          <FaPen size={12} />
                        </button>
                        <button onClick={() => handleDeleteAch(a.id)} style={{ padding: 8, background: "rgba(255,60,172,0.1)", border: "1px solid var(--accent3)", color: "var(--accent3)", cursor: "pointer" }}>
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA UPLOADER */}
          {activeTab === "media" && (
            <div className="glass-card" style={{ padding: 32, border: "1px solid var(--glass-border)", background: "var(--glass)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                Media & Document Uploads Manager
              </h2>
              <div className="cyber-divider" style={{ marginBottom: 28, maxWidth: 200 }} />

              {/* Upload form */}
              <form onSubmit={handleFileUpload} style={{ border: "1px dashed var(--glass-border)", padding: 30, textAlign: "center", marginBottom: 40, background: "rgba(0,0,0,0.1)" }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: "2rem", color: "var(--accent)", display: "block", marginBottom: 12 }}>
                    <FaFilePdf />
                  </span>
                  <p style={{ fontSize: "0.85rem", color: "rgba(232,244,248,0.7)" }}>
                    Upload assets like PDF Resumes, certificates, and achievement photos.
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
                  <input 
                    type="file" 
                    id="admin-file-upload"
                    accept="image/*,application/pdf"
                    onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                  />
                  {uploadFile && (
                    <div style={{ fontSize: "0.75rem", color: "var(--accent)" }}>
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                  <button 
                    type="submit" 
                    disabled={!uploadFile || loading} 
                    className="btn-primary" 
                    style={{ padding: "8px 24px", cursor: "pointer", opacity: uploadFile ? 1 : 0.5 }}
                  >
                    Upload Asset to Server
                  </button>
                </div>
              </form>

              {/* Assets list */}
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Uploaded Files List ({portfolioData.media.length})
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {portfolioData.media.length === 0 ? (
                  <div style={{ gridColumn: "span 10", padding: 20, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--glass-border)" }}>
                    No uploaded assets found on disk.
                  </div>
                ) : (
                  portfolioData.media.map((item: any) => {
                    const isPdf = item.type === "application/pdf" || item.name.endsWith(".pdf");
                    return (
                      <div 
                        key={item.id} 
                        className="glass-card" 
                        style={{ 
                          padding: 16, 
                          border: "1px solid var(--glass-border)", 
                          background: "rgba(0,0,0,0.3)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12
                        }}
                      >
                        {/* File preview */}
                        <div style={{ height: 110, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,240,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {isPdf ? (
                            <div style={{ color: "var(--accent3)", textAlign: "center" }}>
                              <FaFilePdf size={40} />
                              <div style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", marginTop: 6 }}>PDF DOCUMENT</div>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                        </div>

                        {/* File metadata */}
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: "0.8rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.name}>
                            {item.name}
                          </h4>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                            Size: {(item.size / 1024).toFixed(1)} KB | {item.type.split("/")[1]?.toUpperCase() || "FILE"}
                          </div>
                        </div>

                        {/* Copy and delete row */}
                        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                          <button 
                            onClick={() => copyToClipboard(item.url, item.id)}
                            style={{ 
                              flexGrow: 1, 
                              padding: "6px", 
                              fontSize: "0.65rem", 
                              fontFamily: "var(--font-mono)",
                              background: copyingId === item.id ? "rgba(0,255,136,0.15)" : "rgba(0,240,255,0.08)",
                              border: copyingId === item.id ? "1px solid #00ff88" : "1px solid rgba(0,240,255,0.2)",
                              color: copyingId === item.id ? "#00ff88" : "var(--accent)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6
                            }}
                          >
                            <FaCopy /> {copyingId === item.id ? "COPIED!" : "COPY URL"}
                          </button>
                          <button 
                            onClick={() => handleDeleteMedia(item.id)}
                            style={{ 
                              padding: "6px 10px", 
                              background: "rgba(255,60,172,0.15)", 
                              border: "1px solid rgba(255,60,172,0.3)", 
                              color: "var(--accent3)", 
                              cursor: "pointer" 
                            }}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SECTION CONTENT */}
          {activeTab === "sections" && (
            <div className="glass-card" style={{ padding: 32, border: "1px solid var(--glass-border)", background: "var(--glass)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                Customize Page Sections
              </h2>
              <div className="cyber-divider" style={{ marginBottom: 28, maxWidth: 200 }} />

              {/* Subtabs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 30, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
                {["hero", "about", "experience", "projects", "skills"].map((sub: any) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSectionSubTab(sub)}
                    style={{
                      padding: "6px 16px",
                      background: activeSectionSubTab === sub ? "rgba(0, 240, 255, 0.1)" : "transparent",
                      border: activeSectionSubTab === sub ? "1px solid var(--accent)" : "1px solid transparent",
                      color: activeSectionSubTab === sub ? "var(--accent)" : "var(--muted)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      textTransform: "uppercase"
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* SECTION SUBTAB 1: HERO */}
              {activeSectionSubTab === "hero" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Greeting</label>
                      <input 
                        type="text"
                        value={heroForm.greeting}
                        onChange={e => setHeroForm({ ...heroForm, greeting: e.target.value })}
                        style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>First Name</label>
                      <input 
                        type="text"
                        value={heroForm.firstName}
                        onChange={e => setHeroForm({ ...heroForm, firstName: e.target.value })}
                        style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Last Name</label>
                      <input 
                        type="text"
                        value={heroForm.lastName}
                        onChange={e => setHeroForm({ ...heroForm, lastName: e.target.value })}
                        style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Status Badge (e.g. AVAILABLE FOR HIRE)</label>
                    <input 
                      type="text"
                      value={heroForm.statusBadge}
                      onChange={e => setHeroForm({ ...heroForm, statusBadge: e.target.value })}
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Typewriter Roles (Comma separated)</label>
                    <input 
                      type="text"
                      value={heroForm.rolesStr}
                      onChange={e => setHeroForm({ ...heroForm, rolesStr: e.target.value })}
                      placeholder="e.g. Full Stack Developer, React Engineer..."
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Hero Introduction Text</label>
                    <textarea 
                      rows={4}
                      value={heroForm.description}
                      onChange={e => setHeroForm({ ...heroForm, description: e.target.value })}
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Stats list slots */}
                  <div>
                    <h4 style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", marginBottom: 12 }}>HERO STATS</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {heroForm.statsList.map((stat, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 10 }}>
                          <input 
                            type="text"
                            value={stat.num}
                            onChange={e => {
                              const newList = [...heroForm.statsList];
                              newList[idx].num = e.target.value;
                              setHeroForm({ ...heroForm, statsList: newList });
                            }}
                            placeholder="Value (e.g. 40%)"
                            style={{ width: "120px", padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text"
                            value={stat.label}
                            onChange={e => {
                              const newList = [...heroForm.statsList];
                              newList[idx].label = e.target.value;
                              setHeroForm({ ...heroForm, statsList: newList });
                            }}
                            placeholder="Label (e.g. Latency Reduced)"
                            style={{ flexGrow: 1, padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <button 
                            type="button" 
                            onClick={() => removeHeroStat(idx)} 
                            style={{ padding: 8, background: "rgba(255,0,0,0.2)", border: "none", color: "white", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addHeroStat}
                        style={{ padding: 6, width: "fit-content", background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
                      >
                        + ADD STAT SLOT
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Primary CTA Button Label</label>
                      <input 
                        type="text"
                        value={heroForm.ctaPrimary}
                        onChange={e => setHeroForm({ ...heroForm, ctaPrimary: e.target.value })}
                        style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Secondary CTA Button Label</label>
                      <input 
                        type="text"
                        value={heroForm.ctaSecondary}
                        onChange={e => setHeroForm({ ...heroForm, ctaSecondary: e.target.value })}
                        style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <button type="button" onClick={() => handleSectionSave("hero")} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                      Save Hero Section
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION SUBTAB 2: ABOUT */}
              {activeSectionSubTab === "about" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Section Header Title</label>
                    <input 
                      type="text"
                      value={aboutForm.title}
                      onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })}
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>About Paragraph 1 (Supports HTML tags like &lt;span style="..."&gt;)</label>
                    <textarea 
                      rows={4}
                      value={aboutForm.paragraph1}
                      onChange={e => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>About Paragraph 2</label>
                    <textarea 
                      rows={4}
                      value={aboutForm.paragraph2}
                      onChange={e => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                      style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Metadata key-value grid */}
                  <div>
                    <h4 style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", marginBottom: 12 }}>METADATA DETAILS GRID</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {aboutForm.metaList.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 10 }}>
                          <input 
                            type="text"
                            value={item.label}
                            onChange={e => {
                              const newList = [...aboutForm.metaList];
                              newList[idx].label = e.target.value;
                              setAboutForm({ ...aboutForm, metaList: newList });
                            }}
                            placeholder="Key (e.g. Email)"
                            style={{ width: "150px", padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text"
                            value={item.value}
                            onChange={e => {
                              const newList = [...aboutForm.metaList];
                              newList[idx].value = e.target.value;
                              setAboutForm({ ...aboutForm, metaList: newList });
                            }}
                            placeholder="Value (e.g. hello@email.com)"
                            style={{ flexGrow: 1, padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <button 
                            type="button" 
                            onClick={() => removeAboutMeta(idx)} 
                            style={{ padding: 8, background: "rgba(255,0,0,0.2)", border: "none", color: "white", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addAboutMeta}
                        style={{ padding: 6, width: "fit-content", background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
                      >
                        + ADD ITEM SLOT
                      </button>
                    </div>
                  </div>

                  {/* About stats cards details */}
                  <div>
                    <h4 style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", marginBottom: 12 }}>ABOUT SECTION STATS CARDS</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {aboutForm.statsList.map((stat, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr 1fr", gap: 10, padding: 12, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                          <input 
                            type="text"
                            value={stat.num}
                            onChange={e => {
                              const newList = [...aboutForm.statsList];
                              newList[idx].num = e.target.value;
                              setAboutForm({ ...aboutForm, statsList: newList });
                            }}
                            placeholder="Val (e.g. 10+)"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text"
                            value={stat.label}
                            onChange={e => {
                              const newList = [...aboutForm.statsList];
                              newList[idx].label = e.target.value;
                              setAboutForm({ ...aboutForm, statsList: newList });
                            }}
                            placeholder="Metric Description"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <input 
                              type="text"
                              value={stat.color}
                              onChange={e => {
                                const newList = [...aboutForm.statsList];
                                newList[idx].color = e.target.value;
                                setAboutForm({ ...aboutForm, statsList: newList });
                              }}
                              placeholder="Color (CSS var)"
                              style={{ width: "50%", padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.75rem" }}
                            />
                            <input 
                              type="text"
                              value={stat.iconName}
                              onChange={e => {
                                const newList = [...aboutForm.statsList];
                                newList[idx].iconName = e.target.value;
                                setAboutForm({ ...aboutForm, statsList: newList });
                              }}
                              placeholder="Icon Component"
                              style={{ width: "50%", padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.75rem" }}
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeAboutStat(idx)} 
                            style={{ background: "rgba(255,0,0,0.2)", border: "none", color: "white", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addAboutStat}
                        style={{ padding: 6, width: "fit-content", background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
                      >
                        + ADD STAT CARD SLOT
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <button type="button" onClick={() => handleSectionSave("about")} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                      Save About Section
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION SUBTAB 3: EXPERIENCE */}
              {activeSectionSubTab === "experience" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                  
                  {/* Jobs List editor */}
                  <div>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                      Work Experiences Positions Editor
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      {jobsList.map((job, idx) => (
                        <div key={job.id || idx} style={{ border: "1px solid var(--glass-border)", padding: 24, background: "rgba(0,0,0,0.2)", position: "relative" }}>
                          <button 
                            type="button"
                            onClick={() => removeJob(idx)}
                            style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,0,0,0.2)", border: "none", color: "white", padding: "6px 12px", cursor: "pointer", fontSize: "0.7rem" }}
                          >
                            Remove Position
                          </button>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16, maxWidth: "80%" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Role Title</label>
                              <input 
                                type="text"
                                value={job.role}
                                onChange={e => {
                                  const newList = [...jobsList];
                                  newList[idx].role = e.target.value;
                                  setJobsList(newList);
                                }}
                                style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Company Name</label>
                              <input 
                                type="text"
                                value={job.company}
                                onChange={e => {
                                  const newList = [...jobsList];
                                  newList[idx].company = e.target.value;
                                  setJobsList(newList);
                                }}
                                style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Location</label>
                              <input 
                                type="text"
                                value={job.location}
                                onChange={e => {
                                  const newList = [...jobsList];
                                  newList[idx].location = e.target.value;
                                  setJobsList(newList);
                                }}
                                style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Date Period</label>
                              <input 
                                type="text"
                                value={job.period}
                                onChange={e => {
                                  const newList = [...jobsList];
                                  newList[idx].period = e.target.value;
                                  setJobsList(newList);
                                }}
                                style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                              />
                            </div>
                          </div>

                          {/* Tech stacks */}
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Tech Stack Tags (Comma separated)</label>
                            <input 
                              type="text"
                              value={Array.isArray(job.techStack) ? job.techStack.join(", ") : ""}
                              onChange={e => {
                                const newList = [...jobsList];
                                newList[idx].techStack = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                setJobsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>

                          {/* Key Responsibilities */}
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Responsibilities highlights (One per line)</label>
                            <textarea 
                              rows={4}
                              value={Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : ""}
                              onChange={e => {
                                const newList = [...jobsList];
                                newList[idx].responsibilities = e.target.value.split("\n").filter(Boolean);
                                setJobsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addJob}
                        style={{ padding: 10, background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                      >
                        + ADD NEW POSITION
                      </button>
                    </div>
                  </div>

                  <div className="cyber-divider" />

                  {/* Education list editor */}
                  <div>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                      Education & Degree Milestones
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {educationList.map((edu, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 60px", gap: 10, padding: 12, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                          <input 
                            type="text" 
                            value={edu.school} 
                            onChange={e => {
                              const newList = [...educationList];
                              newList[idx].school = e.target.value;
                              setEducationList(newList);
                            }}
                            placeholder="School/College Name"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text" 
                            value={edu.degree} 
                            onChange={e => {
                              const newList = [...educationList];
                              newList[idx].degree = e.target.value;
                              setEducationList(newList);
                            }}
                            placeholder="Degree Earned"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text" 
                            value={edu.period} 
                            onChange={e => {
                              const newList = [...educationList];
                              newList[idx].period = e.target.value;
                              setEducationList(newList);
                            }}
                            placeholder="Period Range"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <input 
                            type="text" 
                            value={edu.grade} 
                            onChange={e => {
                              const newList = [...educationList];
                              newList[idx].grade = e.target.value;
                              setEducationList(newList);
                            }}
                            placeholder="Grade/Percentage"
                            style={{ padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                          />
                          <button 
                            type="button" 
                            onClick={() => removeEducation(idx)} 
                            style={{ background: "rgba(255,0,0,0.2)", border: "none", color: "white", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addEducation}
                        style={{ padding: 8, width: "fit-content", background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}
                      >
                        + ADD EDUCATION ENTRY
                      </button>
                    </div>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleSectionSave("experience")} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                      Save Experience & Education Data
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION SUBTAB 4: PROJECTS */}
              {activeSectionSubTab === "projects" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                  <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                    Featured Projects Editor
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    {projectsList.map((proj, idx) => (
                      <div key={idx} style={{ border: "1px solid var(--glass-border)", padding: 24, background: "rgba(0,0,0,0.2)", position: "relative" }}>
                        <button 
                          type="button"
                          onClick={() => removeProject(idx)}
                          style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,0,0,0.2)", border: "none", color: "white", padding: "6px 12px", cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          Remove Project
                        </button>

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 16, maxWidth: "80%" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Project Title</label>
                            <input 
                              type="text" 
                              value={proj.title} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].title = e.target.value;
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Type/Subtitle</label>
                            <input 
                              type="text" 
                              value={proj.type} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].type = e.target.value;
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Accent Card Color (rgb)</label>
                            <input 
                              type="text" 
                              value={proj.color} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].color = e.target.value;
                                newList[idx].accentBg = e.target.value.replace('rgb', 'rgba').replace(')', ',0.1)');
                                setProjectsList(newList);
                              }}
                              placeholder="rgb(0, 240, 255)"
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.75rem" }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Project Description</label>
                          <textarea 
                            rows={3}
                            value={proj.desc} 
                            onChange={e => {
                              const newList = [...projectsList];
                              newList[idx].desc = e.target.value;
                              setProjectsList(newList);
                            }}
                            style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Tech Tags (Comma separated)</label>
                            <input 
                              type="text" 
                              value={Array.isArray(proj.tech) ? proj.tech.join(", ") : ""} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].tech = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Highlights (One per line)</label>
                            <textarea 
                              rows={2}
                              value={Array.isArray(proj.highlights) ? proj.highlights.join("\n") : ""} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].highlights = e.target.value.split("\n").filter(Boolean);
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Demo Live Link</label>
                            <input 
                              type="text" 
                              value={proj.demo} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].demo = e.target.value;
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>GitHub Code Link</label>
                            <input 
                              type="text" 
                              value={proj.github} 
                              onChange={e => {
                                const newList = [...projectsList];
                                newList[idx].github = e.target.value;
                                setProjectsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addProject}
                      style={{ padding: 10, background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                    >
                      + ADD NEW PROJECT
                    </button>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleSectionSave("projects")} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                      Save Projects List
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION SUBTAB 5: SKILLS */}
              {activeSectionSubTab === "skills" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                  <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                    Technical Skill Categories Editor
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    {skillsList.map((group, idx) => (
                      <div key={idx} style={{ border: "1px solid var(--glass-border)", padding: 24, background: "rgba(0,0,0,0.2)", position: "relative" }}>
                        <button 
                          type="button"
                          onClick={() => removeSkillGroup(idx)}
                          style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,0,0,0.2)", border: "none", color: "white", padding: "6px 12px", cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          Remove Category
                        </button>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16, maxWidth: "60%" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Category Label</label>
                            <input 
                              type="text" 
                              value={group.label} 
                              onChange={e => {
                                const newList = [...skillsList];
                                newList[idx].label = e.target.value;
                                setSkillsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Color (e.g. rgb(0,240,255))</label>
                            <input 
                              type="text" 
                              value={group.color} 
                              onChange={e => {
                                const newList = [...skillsList];
                                newList[idx].color = e.target.value;
                                setSkillsList(newList);
                              }}
                              style={{ width: "100%", padding: 6, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontSize: "0.85rem" }}
                            />
                          </div>
                        </div>

                        {/* Skill Bars within Group */}
                        <div>
                          <label style={{ display: "block", fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>Skills List (Format: Name:Level, e.g. React.js:90. One per line)</label>
                          <textarea 
                            rows={4}
                            value={Array.isArray(group.skills) ? group.skills.map((s: any) => `${s.name}:${s.level}`).join("\n") : ""}
                            onChange={e => {
                              const newList = [...skillsList];
                              newList[idx].skills = e.target.value.split("\n").map(line => {
                                const parts = line.split(":");
                                return {
                                  name: parts[0]?.trim() || "",
                                  level: parseInt(parts[1]?.trim() || "50", 10)
                                };
                              }).filter(s => s.name);
                              setSkillsList(newList);
                            }}
                            placeholder="React.js:90&#10;TypeScript:82"
                            style={{ width: "100%", padding: 8, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addSkillGroup}
                      style={{ padding: 10, background: "none", border: "1px dashed var(--glass-border)", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                    >
                      + ADD NEW SKILL CATEGORY
                    </button>
                  </div>

                  <div className="cyber-divider" />

                  {/* Tech cloud bubble string editor */}
                  <div>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>
                      All Technologies & Tools Cloud Bubbles
                    </h3>
                    <label style={{ display: "block", fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Comma-separated keywords</label>
                    <textarea 
                      rows={3}
                      value={bubblesStr}
                      onChange={e => setBubblesStr(e.target.value)}
                      style={{ width: "100%", padding: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontFamily: "inherit" }}
                    />
                  </div>

                  <div>
                    <button type="button" onClick={() => handleSectionSave("skills")} className="btn-primary" style={{ padding: "10px 24px", cursor: "pointer" }}>
                      Save Skills & Tech Cloud
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
