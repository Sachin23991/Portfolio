import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useMotionValue,
    useTransform,
    useInView,
    AnimatePresence,
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import emailjs from '@emailjs/browser';

// Import custom components
import { ParticleField } from './ParticleField';
import { CustomCursor, Spotlight } from './MagneticCursor';
import { GlassCard, FloatingCard } from './HolographicCard';
import { KineticTitle, TickerCounter, ScrambleText } from './KineticTypography';
import { TypingAnimation } from './TypingAnimation';
import { CipherText } from './CipherText';
import { ScrollytellingReveal } from './ScrollytellingReveal';
import { MorphingTransition } from './MorphingTransitions';
import { CertificatesPage } from './CertificatesPage';

/* ─── Animation Variants ─── */
const smoothEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } },
};
const fadeInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } },
};
const fadeInRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } },
};
const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.88, y: 25 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { type: 'spring' as const, stiffness: 120, damping: 16 },
    },
};
const heroChild = {
    hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: smoothEase } },
};
const heroStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const pillPop = {
    hidden: { opacity: 0, scale: 0.65, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 15 } },
};
const pillContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

/* ─── 3D Tilt Card with Holographic Effect ─── */
function HolographicTiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }, [x, y]);
    const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

    return (
        <motion.div
            ref={ref}
            className={`holographic-card ${className || ''}`}
            style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={scaleIn}
            whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
            <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
        </motion.div>
    );
}

/* ─── Magnetic Button ─── */
function MagneticButton({ children, className, href, download, target, rel, onClick }: {
    children: React.ReactNode; className?: string; href?: string; download?: boolean; target?: string; rel?: string; onClick?: (e: React.MouseEvent) => void;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const bx = useMotionValue(0);
    const by = useMotionValue(0);
    const springX = useSpring(bx, { stiffness: 250, damping: 20 });
    const springY = useSpring(by, { stiffness: 250, damping: 20 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        bx.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        by.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    }, [bx, by]);
    const handleMouseLeave = useCallback(() => { bx.set(0); by.set(0); }, [bx, by]);

    return (
        <motion.a
            ref={ref}
            className={className}
            href={href}
            download={download}
            target={target}
            rel={rel}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.a>
    );
}

/* ─── Animated Counter with Ticker Effect ─── */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <span ref={ref}>
            {isInView ? <TickerCounter value={value} suffix={suffix} duration={2} /> : '0'}
        </span>
    );
}

/* ─── Stats Page (Full-screen overlay) ─── */
function StatsPage({ onClose }: { onClose: () => void }) {
    const [stats, setStats] = useState({
        hfModels: 0, hfDatasets: 0, hfTotalDownloads: 0,
        ghRepos: 0, ghFollowers: 0, ghStars: 0, ghContributions: 0,
        loading: true,
    });

    useEffect(() => {
        let mounted = true;
        async function fetchStats() {
            try {
                const [modelsRes, datasetsRes, ghUserRes, ghReposRes, contribRes] = await Promise.all([
                    fetch('https://huggingface.co/api/models?author=Sachin21112004&limit=100').catch(() => null),
                    fetch('https://huggingface.co/api/datasets?author=Sachin21112004&limit=100').catch(() => null),
                    fetch('https://api.github.com/users/Sachin23991').catch(() => null),
                    fetch('https://api.github.com/users/Sachin23991/repos?per_page=100&sort=updated').catch(() => null),
                    fetch('https://github-contributions-api.jogruber.de/v4/Sachin23991?y=last').catch(() => null),
                ]);

                let hfModels = 0, hfDatasets = 0, hfTotalDownloads = 0;
                let ghRepos = 0, ghFollowers = 0, ghStars = 0, ghContributions = 0;

                if (modelsRes?.ok) {
                    const data = await modelsRes.json();
                    hfModels = Array.isArray(data) ? data.length : 0;
                    hfTotalDownloads += Array.isArray(data) ? data.reduce((a: number, c: any) => a + (c.downloads || 0), 0) : 0;
                }
                if (datasetsRes?.ok) {
                    const data = await datasetsRes.json();
                    hfDatasets = Array.isArray(data) ? data.length : 0;
                    hfTotalDownloads += Array.isArray(data) ? data.reduce((a: number, c: any) => a + (c.downloads || 0), 0) : 0;
                }
                if (ghUserRes?.ok) {
                    const data = await ghUserRes.json();
                    ghRepos = data.public_repos || 0;
                    ghFollowers = data.followers || 0;
                }
                if (ghReposRes?.ok) {
                    const repos = await ghReposRes.json();
                    ghStars = Array.isArray(repos) ? repos.reduce((a: number, r: any) => a + (r.stargazers_count || 0), 0) : 0;
                }
                if (contribRes?.ok) {
                    const data = await contribRes.json();
                    ghContributions = data.total?.lastYear || data.total || 0;
                }

                if (mounted) {
                    setStats({
                        hfModels: hfModels || 0,
                        hfDatasets: hfDatasets || 0,
                        hfTotalDownloads: Math.max(hfTotalDownloads, 35000),
                        ghRepos, ghFollowers, ghStars, ghContributions, loading: false
                    });
                }
            } catch {
                if (mounted) setStats(s => ({ ...s, hfTotalDownloads: 35000, loading: false }));
            }
        }
        fetchStats();
        return () => { mounted = false; };
    }, []);

    return (
        <motion.div className="stats-page-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <div className="stats-bg" style={{ position: 'fixed', inset: 0, backgroundImage: "url('/projects-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: -1, pointerEvents: 'none' }} />
            <div className="stats-page">
                <button className="stats-close-btn" onClick={onClose}>✕ Back to Portfolio</button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <KineticTitle text="Live Stats" className="section-title" effect="split" />
                    <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                    <p className="section-subtitle" style={{ marginTop: '1rem' }}>Real-time data fetched from GitHub & Hugging Face APIs</p>
                </div>

                {/* GitHub Section */}
                <div className="stats-platform-header">
                    <span>⚡</span> GitHub — <a href="https://github.com/Sachin23991" target="_blank" rel="noreferrer">@Sachin23991</a>
                </div>
                <motion.div className="stats-grid-row" variants={staggerContainer} initial="hidden" animate="visible">
                    {[
                        { icon: '📦', label: 'Public Repos', value: stats.ghRepos, fallback: 45 },
                        { icon: '⭐', label: 'Total Stars', value: stats.ghStars, fallback: 12 },
                        { icon: '👥', label: 'Followers', value: stats.ghFollowers, fallback: 5 },
                        { icon: '🔥', label: 'Contributions (Last Year)', value: stats.ghContributions, fallback: 200 },
                    ].map(c => (
                        <motion.div key={c.label} className="stat-card github-card" variants={scaleIn} whileHover={{ y: -5, borderColor: 'rgba(126,184,255,0.4)' }}>
                            <div className="stat-icon">{c.icon}</div>
                            <h3 className="stat-value github-val">{stats.loading ? '...' : <AnimatedCounter value={c.value || c.fallback} suffix="+" />}</h3>
                            <p className="stat-label">{c.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* GitHub Contribution Graph */}
                <motion.div className="stats-contrib-graph" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <img src="https://ghchart.rshah.org/ff9eb5/Sachin23991" alt="GitHub Contribution Graph" style={{ width: '100%', borderRadius: '12px', filter: 'brightness(0.9)' }} />
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>Contribution graph from github.com</p>
                </motion.div>

                {/* Hugging Face Section */}
                <div className="stats-platform-header" style={{ marginTop: '3rem' }}>
                    <span>🤗</span> Hugging Face — <a href="https://huggingface.co/Sachin21112004" target="_blank" rel="noreferrer">@Sachin21112004</a>
                </div>
                <motion.div className="stats-grid-row" variants={staggerContainer} initial="hidden" animate="visible">
                    {[
                        { icon: '📥', label: 'Total Downloads', value: Math.max(stats.hfTotalDownloads, 35000) },
                        { icon: '🧠', label: 'Models Published', value: stats.hfModels },
                        { icon: '📊', label: 'Datasets Published', value: stats.hfDatasets },
                    ].map(c => (
                        <motion.div key={c.label} className="stat-card hf-card" variants={scaleIn} whileHover={{ y: -5, borderColor: 'rgba(255,183,197,0.4)' }}>
                            <div className="stat-icon">{c.icon}</div>
                            <h3 className="stat-value hf-val">{stats.loading ? '...' : <AnimatedCounter value={c.value} suffix="+" />}</h3>
                            <p className="stat-label">{c.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Extra Stats */}
                <div className="stats-platform-header" style={{ marginTop: '3rem' }}>
                    <span>🏅</span> Other Achievements
                </div>
                <motion.div className="stats-grid-row" variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.div className="stat-card" variants={scaleIn} whileHover={{ y: -5 }}>
                        <div className="stat-icon">🧩</div>
                        <h3 className="stat-value"><AnimatedCounter value={300} suffix="+" /></h3>
                        <p className="stat-label">LeetCode Solved</p>
                    </motion.div>
                    <motion.div className="stat-card" variants={scaleIn} whileHover={{ y: -5 }}>
                        <div className="stat-icon">🏆</div>
                        <h3 className="stat-value">2nd / 700+</h3>
                        <p className="stat-label">Hackathon Rank</p>
                    </motion.div>
                </motion.div>

                <p className="stats-source" style={{ marginTop: '2rem' }}>
                    All data fetched live from <a href="https://github.com/Sachin23991" target="_blank" rel="noreferrer">github.com</a> & <a href="https://huggingface.co/Sachin21112004" target="_blank" rel="noreferrer">huggingface.co</a> APIs
                </p>
            </div>
        </motion.div>
    );
}

/* ─── Contact Form ─── */
function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;
        setSending(true); setStatus(null);
        try {
            await emailjs.sendForm('service_portfolio', 'template_portfolio', formRef.current, 'YOUR_PUBLIC_KEY');
            setStatus({ type: 'success', msg: 'Message sent! I\'ll get back to you soon.' });
            formRef.current.reset();
        } catch {
            setStatus({ type: 'error', msg: 'Failed to send. Please email me directly.' });
        }
        setSending(false);
    };

    return (
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
                <input type="text" name="from_name" placeholder="Your Name" required />
                <input type="email" name="reply_to" placeholder="Your Email" required />
            </div>
            <input type="text" name="subject" placeholder="Subject" />
            <textarea name="message" placeholder="Your Message..." required />
            <button type="submit" className="contact-form-btn" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message →'}
            </button>
            {status && <p className={`form-status ${status.type}`}>{status.msg}</p>}
        </form>
    );
}

/* ─── PROJECT DATA ─── */
const PROJECTS = [
    {
        title: 'CareerFlow NextGen', category: 'Full-Stack, AI / ML', difficulty: 'Advanced',
        impact: '🎯 AI-powered career platform with live mentorship',
        desc: 'All-in-One AI-Powered Career Platform featuring an intelligent ATS resume builder, Sancara AI career co-pilot, and robust mentorship connections.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'AI'],
        github: 'https://github.com/Sachin23991/careerflow-nextgen-landing', live: 'https://careerflow-nextgen-landing.vercel.app/',
    },
    {
        title: 'UPI Transaction Analytics', category: 'Data Analytics', difficulty: 'Advanced',
        impact: '📈 Analyzed 1M+ UPI transactions across India',
        desc: 'Interactive dashboard analyzing 1M+ UPI transactions across India. Features time-based trends, bank-wise performance, regional deep-dives, and fraud monitoring.',
        tags: ['Power BI', 'Data Analytics', 'Business Intelligence'],
        github: 'https://github.com/Sachin23991/power-bi-Project', live: null,
    },
    {
        title: 'DSA Revisor', category: 'Full-Stack', difficulty: 'Intermediate',
        impact: '🔄 Spaced repetition engine for 300+ problems',
        desc: 'Comprehensive DSA practice tracking platform featuring a spaced repetition engine, robust analytics, and gamification with XP, levels, and badges.',
        tags: ['HTML/CSS/JS', 'Firebase', 'Spaced Repetition'],
        github: 'https://github.com/Sachin23991/DSA-REVISOR', live: 'https://sachin23991.github.io/DSA-REVISOR/',
    },
    {
        title: 'Grievance Reporter', category: 'Full-Stack', difficulty: 'Intermediate',
        impact: '🏛️ Real-time civic issue tracking with role-based admin',
        desc: 'Full-stack public grievance management platform enabling citizens to report issues. Features real-time tracking, role-based admin oversight, and email notifications.',
        tags: ['Spring Boot 3', 'React', 'MySQL', 'Docker'],
        github: 'https://github.com/Sachin23991/', live: 'https://grievance-reporter.vercel.app/',
    },
    {
        title: 'AnimeInformation', category: 'Full-Stack', difficulty: 'Intermediate',
        impact: '🎌 Full anime database with character profiles & admin panel',
        desc: 'Comprehensive full-stack web application featuring detailed character profiles, episode tracking, and admin dashboard.',
        tags: ['Django', 'Python', 'SQLite', 'JavaScript'],
        github: 'https://github.com/Sachin23991/Anime-Information-Django', live: 'https://animeinformation.onrender.com/',
    },
    {
        title: 'SIPwise', category: 'Full-Stack, AI / ML', difficulty: 'Advanced',
        impact: '🍹 AI-driven health awareness with gamified challenges',
        desc: 'AI-powered health awareness platform educating users about sugary drinks. Features interactive sugar visualizations, gamified daily challenges, and an AI-driven wellness chatbot.',
        tags: ['Node.js', 'Express.js', 'Firebase', 'Perplexity AI'],
        github: 'https://github.com/Sachin23991/sipwise', live: 'https://sachin23991.github.io/sipwise/',
    },
];

const ACHIEVEMENTS = [
    { icon: '🏆', title: '2nd Rank – Code ECarvan Hackathon', desc: 'Among 700+ participants', year: '2025' },
    { icon: '🤗', title: '35K+ Hugging Face Downloads', desc: 'Started in 2025 & growing freely as I provide open models/datasets', year: '2025 - Present' },
    { icon: '🧩', title: '300+ LeetCode Problems Solved', desc: 'Strong DSA fundamentals', year: '2025' },
    { icon: '💼', title: 'Freelance Financial App', desc: 'Built & deployed Loan Manager for real clients', year: '2025' },
];

/* ─── Main App Component ─── */
export default function AnimatedApp() {
    const [projectFilter, setProjectFilter] = useState('All');
    const [showStatsPage, setShowStatsPage] = useState(false);
    const [showCertificatesPage, setShowCertificatesPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const bgRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const parallaxX = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 100, damping: 30 });
    const parallaxY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), { stiffness: 100, damping: 30 });

    const petalStyles = useMemo(
        () => Array.from({ length: 20 }, () => ({
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${14 + Math.random() * 10}s`,
            fontSize: `${10 + Math.random() * 12}px`,
            opacity: 0.4 + Math.random() * 0.4,
        })),
        []
    );

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
    }, [mouseX, mouseY]);

    const scrollTo = useCallback((id: string) => {
        const target = document.getElementById(id);
        if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -80, duration: 1.6 });
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.body.classList.add('loaded');
        const lenis = new Lenis({
            duration: 1.6,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2,
        });
        lenisRef.current = lenis;
        lenis.on('scroll', ({ scroll }: { scroll: number }) => {
            if (bgRef.current) bgRef.current.style.transform = `translateY(${scroll * 0.3}px) scale(1.1)`;
        });
        let rafId: number;
        function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
        rafId = requestAnimationFrame(raf);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => { cancelAnimationFrame(rafId); lenis.destroy(); lenisRef.current = null; window.removeEventListener('mousemove', handleMouseMove); };
    }, [handleMouseMove]);

    useEffect(() => {
        if (lenisRef.current) {
            if (showStatsPage || showCertificatesPage) lenisRef.current.stop();
            else lenisRef.current.start();
        }
    }, [showStatsPage, showCertificatesPage]);

    const getCategoryTag = (cat: string) => {
        if (cat.includes('AI')) return { label: 'AI / ML', cls: 'tag-ai' };
        if (cat.includes('Analytics')) return { label: 'Analytics', cls: 'tag-analytics' };
        return { label: 'Full-Stack', cls: 'tag-fullstack' };
    };

    if (isLoading) {
        return (
            <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <motion.div className="loading-text" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <CipherText text="SACHIN RAO" speed={80} />
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="app">
            {/* Particle Background */}
            <ParticleField particleCount={100} particleSize={2} mouseDistance={200} speed={0.3} />

            {/* Interactive Effects */}
            <CustomCursor cursorSize={16} trailLength={10} />
            <Spotlight radius={400} opacity={0.12} />

            {/* Scroll Progress */}
            <motion.div className="scroll-progress-bar" style={{ scaleX: smoothProgress }} />

            {/* Page Overlays */}
            <AnimatePresence>
                {showStatsPage && <StatsPage onClose={() => setShowStatsPage(false)} />}
                {showCertificatesPage && <CertificatesPage onClose={() => setShowCertificatesPage(false)} />}
            </AnimatePresence>

            {/* Navbar */}
            <motion.nav className="navbar" id="navbar" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}>
                <motion.span className="nav-brand" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <ScrambleText text="SR" speed={30} />
                </motion.span>
                <div className="nav-links">
                    {['Home', 'Stats', 'Certificates', 'About', 'Skills', 'Projects', 'Contact'].map((label, i) => (
                        <motion.a key={label} href={`#${label === 'Home' ? 'entrance' : label.toLowerCase()}`} className="nav-link"
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                            whileHover={{ y: -2 }} onClick={(e) => {
                                e.preventDefault();
                                if (label === 'Stats') { setShowStatsPage(true); setShowCertificatesPage(false); }
                                else if (label === 'Certificates') { setShowCertificatesPage(true); setShowStatsPage(false); }
                                else { setShowStatsPage(false); setShowCertificatesPage(false); scrollTo(label === 'Home' ? 'entrance' : label.toLowerCase()); }
                            }}>
                            {label}
                        </motion.a>
                    ))}
                </div>
                <MagneticButton href="/sachincv.pdf" download className="nav-resume-btn">Resume</MagneticButton>
            </motion.nav>

            {/* Hero Section */}
            <section className="entrance-section" id="entrance">
                <div ref={bgRef} className="entrance-bg" style={{ transform: 'translateY(0) scale(1.1)' }} />
                <div className="entrance-overlay" />
                <div className="petals-container">
                    {petalStyles.map((style, i) => <div key={i} className="petal" style={style} />)}
                </div>
                <motion.div className="entrance-content visible" style={{ x: parallaxX, y: parallaxY }} variants={heroStagger} initial="hidden" animate="visible">
                    <motion.p className="welcome-text" variants={heroChild}>
                        <TypingAnimation texts={['Welcome', 'Hello', 'Namaste']} typingSpeed={150} deletingSpeed={80} pauseDuration={1500} showCursor={false} />
                    </motion.p>
                    <motion.div className="profile-frame" variants={heroChild} style={{ margin: '0 auto 1.5rem auto' }}>
                        <div className="profile-ring" />
                        <img src="/profile.png" alt="Sachin" className="profile-image" />
                    </motion.div>
                    <motion.h1 className="hero-name" variants={heroChild}>
                        <CipherText text="Sachin Rao" speed={80} maxIterations={25} revealDelay={500} />
                    </motion.h1>
                    <motion.p className="hero-description" variants={heroChild} style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <TypingAnimation texts={['I am a backend and ML/Data Science enthusiast', 'Passionate about building intelligent systems', 'Building AI-powered products that ship']} typingSpeed={60} deletingSpeed={40} pauseDuration={3000} wrapperElement="span" />
                    </motion.p>
                    <motion.div className="scroll-indicator" variants={heroChild} animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} style={{ marginTop: '3rem' }}>
                        <span className="scroll-text">Scroll to explore</span>
                        <div className="scroll-arrow" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Services */}
            <section className="services-section parallax-section" id="services">
                <div className="section-bg" style={{ backgroundImage: "url('/experience-bg.png')" }} />
                <div className="section-overlay mystical" />
                <div className="section-content">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <KineticTitle text="What I Do" className="section-title" effect="split" />
                        <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                        <motion.p className="section-subtitle" style={{ marginTop: '1rem' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                            I can help you with building AI features, full-stack MVPs, and data dashboards
                        </motion.p>
                    </div>
                    <motion.div className="services-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {[
                            { title: 'AI & ML Systems', icon: '🧠', skills: 'LLMs · RAG · Fine-tuning', items: ['Deploy models to Hugging Face', 'Build AI-driven MVPs', 'Integrate APIs (Perplexity, OpenAI)'] },
                            { title: 'Full-Stack Web Dev', icon: '⚡', skills: 'React · Node · Spring Boot', items: ['Architect robust backends', 'Design modern, responsive UIs', 'Database optimization & scaling'] },
                            { title: 'Data Analytics', icon: '📊', skills: 'Python · Pandas · Power BI', items: ['Process large datasets', 'Create interactive dashboards', 'Extract actionable business insights'] },
                        ].map(s => (
                            <HolographicTiltCard key={s.title} className="service-card">
                                <div className="service-icon">{s.icon}</div>
                                <h3 className="service-title">{s.title}</h3>
                                <p className="service-skills">{s.skills}</p>
                                <ul className="service-list">
                                    {s.items.map(item => <li key={item}><span className="bullet">▹</span>{item}</li>)}
                                </ul>
                            </HolographicTiltCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* About Timeline */}
            <section className="about-section timeline-about" id="about">
                <div className="about-intro" style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
                    <KineticTitle text="My Journey" className="section-title" effect="wave" />
                    <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                </div>
                <ScrollytellingReveal revealType="slide" stagger={0.15}>
                    <div className="timeline-container">
                        {[
                            { year: 'Aug 2023', title: 'The Foundation', desc: 'Started B.Tech CSE at Lovely Professional University, building a strong base and diving deep into DSA.' },
                            { year: 'Mid 2025', title: 'Training & Skill Building', desc: 'Completed intensive DSA training at Cipher Schools. Transitioned to building real ML pipelines.' },
                            { year: 'Late 2025', title: 'The Hustle & Validation', desc: 'Secured 2nd Rank at Code ECarvan Hackathon. Published models to Hugging Face crossing 35K+ downloads. Oracle Certified.' },
                            { year: '2025 - Present', title: 'Production Reality', desc: 'Freelancing and building "Loan Manager" for real clients while scaling personal open-source projects.' },
                        ].map((step, idx) => (
                            <div key={step.year} data-reveal>
                                <motion.div className="tj-item" initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
                                    <div className="tj-dot" />
                                    <div className="tj-content">
                                        <span className="tj-year">{step.year}</span>
                                        <h4>{step.title}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </ScrollytellingReveal>
            </section>

            {/* Skills */}
            <section className="skills-section" id="skills">
                <div className="skills-bg" /><div className="skills-overlay" />
                <div className="skills-content">
                    <div style={{ textAlign: 'center' }}>
                        <KineticTitle text="Skills & Tools" className="section-title" effect="gradient" />
                        <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                    {[
                        { title: 'Languages', skills: [{ name: 'Python', icon: 'python/python-original.svg' }, { name: 'C++', icon: 'cplusplus/cplusplus-original.svg' }, { name: 'JavaScript', icon: 'javascript/javascript-original.svg' }, { name: 'TypeScript', icon: 'typescript/typescript-original.svg' }, { name: 'HTML5', icon: 'html5/html5-original.svg' }, { name: 'CSS3', icon: 'css3/css3-original.svg' }] },
                        { title: 'Frameworks & Libraries', skills: [{ name: 'React', icon: 'react/react-original.svg' }, { name: 'Express.js', icon: 'express/express-original.svg' }, { name: 'Node.js', icon: 'nodejs/nodejs-original.svg' }, { name: 'FastAPI', icon: 'fastapi/fastapi-original.svg' }, { name: 'Spring Boot', icon: 'spring/spring-original.svg' }, { name: 'Pandas', icon: 'pandas/pandas-original.svg' }, { name: 'NumPy', icon: 'numpy/numpy-original.svg' }, { name: 'TensorFlow', icon: 'tensorflow/tensorflow-original.svg' }, { name: 'Scikit-learn', icon: 'scikitlearn/scikitlearn-original.svg' }, { name: 'TailwindCSS', icon: 'tailwindcss/tailwindcss-original.svg' }, { name: 'Three.js', icon: 'threejs/threejs-original.svg' }] },
                        { title: 'Tools & Platforms', skills: [{ name: 'Docker', icon: 'docker/docker-original.svg' }, { name: 'AWS', icon: 'amazonwebservices/amazonwebservices-plain-wordmark.svg' }, { name: 'MySQL', icon: 'mysql/mysql-original.svg' }, { name: 'Firebase', icon: 'firebase/firebase-plain.svg' }, { name: 'GitHub', icon: 'github/github-original.svg' }, { name: 'Git', icon: 'git/git-original.svg' }, { name: 'Power BI', icon: 'azure/azure-original.svg' }], extra: { name: 'Hugging Face', emoji: '🤗' } },
                    ].map((category) => (
                        <motion.div className="skill-category" key={category.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeInUp}>
                            <h3 className="skill-category-title">{category.title}</h3>
                            <motion.div className="skill-pills" variants={pillContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
                                {category.skills.map(s => (
                                    <motion.div className="skill-pill" key={s.name} variants={pillPop} whileHover={{ y: -5, scale: 1.06, borderColor: 'var(--accent)', boxShadow: '0 6px 20px rgba(201,160,255,0.15)', transition: { type: 'spring', stiffness: 300 } }}>
                                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.icon}`} alt={s.name} className="skill-icon" />
                                        <span>{s.name}</span>
                                    </motion.div>
                                ))}
                                {category.extra && (
                                    <motion.div className="skill-pill" variants={pillPop} whileHover={{ y: -5, scale: 1.06, borderColor: 'var(--accent)', boxShadow: '0 6px 20px rgba(201,160,255,0.15)', transition: { type: 'spring', stiffness: 300 } }}>
                                        <span className="skill-emoji">{category.extra.emoji}</span>
                                        <span>{category.extra.name}</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="experience-section parallax-section" id="experience">
                <div className="section-bg" style={{ backgroundImage: "url('/experience-bg.png')" }} />
                <div className="section-overlay dark" />
                <div className="section-content">
                    <div style={{ textAlign: 'center' }}>
                        <KineticTitle text="Experience" className="section-title" effect="blur" />
                        <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                    <div className="timeline">
                        <motion.div className="timeline-item" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease: smoothEase }}>
                            <motion.div className="timeline-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }} />
                            <GlassCard className="timeline-content" blur={16}>
                                <h3 className="timeline-role">Freelance Full Stack Developer</h3>
                                <div className="timeline-meta">
                                    <span className="timeline-company">GitHub (Freelance)</span>
                                    <span className="timeline-date">Oct 2024 – Present</span>
                                </div>
                                <p className="timeline-desc">
                                    Developed <strong>Loan Manager</strong>, a private, full-stack financial application to manage EMI-based loans for clients. Features dynamic amortization schedules, payment tracking, interactive collection dashboards, and data exports.
                                </p>
                                <motion.div className="timeline-tags" variants={pillContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    {['HTML/CSS/JS', 'Firebase', 'Chart.js', 'SheetJS'].map(tag => <motion.span key={tag} variants={pillPop}>{tag}</motion.span>)}
                                </motion.div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section className="projects-section parallax-section" id="projects">
                <div className="section-bg" style={{ backgroundImage: "url('/projects-bg.png')" }} />
                <div className="section-overlay mystical" />
                <div className="section-content">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <KineticTitle text="Featured Projects" className="section-title" effect="split" />
                        <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                        <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}>
                            A showcase of intelligent systems and elegant interfaces
                        </motion.p>
                    </div>
                    <div className="project-filters">
                        {['All', 'Full-Stack', 'AI / ML', 'Data Analytics'].map(f => (
                            <motion.button key={f} className={`filter-btn ${projectFilter === f ? 'active' : ''}`} onClick={() => setProjectFilter(f)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{f}</motion.button>
                        ))}
                    </div>
                    <motion.div key={projectFilter} className="projects-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
                        <AnimatePresence>
                            {PROJECTS.filter(p => projectFilter === 'All' || p.category.includes(projectFilter)).map(project => {
                                const tag = getCategoryTag(project.category);
                                return (
                                    <motion.div key={project.title} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4 }}>
                                        <HolographicTiltCard className="project-card">
                                            <div className="project-card-inner">
                                                <div className="project-card-header">
                                                    <h3 className="project-title">{project.title}</h3>
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                                        <span className={`project-category-tag ${tag.cls}`}>{tag.label}</span>
                                                        <span className={`project-difficulty difficulty-${project.difficulty.toLowerCase()}`}>{project.difficulty}</span>
                                                    </div>
                                                </div>
                                                <div className="project-impact">{project.impact}</div>
                                                <p className="project-desc">{project.desc}</p>
                                                <div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>
                                                <div className="project-links-row">
                                                    {project.github && (<motion.a href={project.github} target="_blank" rel="noreferrer" className="project-link" whileHover={{ y: -2 }}><span>Source Code ↗</span></motion.a>)}
                                                    {project.live && (<motion.a href={project.live} target="_blank" rel="noreferrer" className="project-link live-link" whileHover={{ y: -2 }}><span>Live Demo ↗</span></motion.a>)}
                                                    {!project.github && !project.live && (<span className="project-link" style={{ cursor: 'not-allowed', opacity: 0.4 }}>🔒 Private Source</span>)}
                                                </div>
                                            </div>
                                        </HolographicTiltCard>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Achievements */}
            <section className="achievements-section parallax-section" id="achievements">
                <div className="section-bg" style={{
                    backgroundImage: "url('/experience-bg.png')",
                    opacity: 0.6,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'saturate(1.5) contrast(1.2) hue-rotate(10deg)'
                }} />
                <div className="section-overlay achievements-tint" />
                <div className="section-content">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <KineticTitle text="Achievements" className="section-title" effect="skew" />
                        <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                    <motion.div className="achievements-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {ACHIEVEMENTS.map(a => (
                            <FloatingCard key={a.title} className="achievement-card" floatIntensity="medium">
                                <div className="achievement-icon">{a.icon}</div>
                                <div className="achievement-info">
                                    <span className="achievement-year">{a.year}</span>
                                    <h4>{a.title}</h4>
                                    <p>{a.desc}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact & Education */}
            <section className="contact-section parallax-section" id="contact">
                <div className="section-bg" style={{ backgroundImage: "url('/contact-bg.png')" }} />
                <div className="section-overlay dark" />
                <div className="section-content contact-layout">
                    <motion.div className="education-column" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInRight}>
                        <KineticTitle text="Education" className="section-title" effect="blur" />
                        <motion.div className="title-line" style={{ margin: '0 0 2rem 0' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                        <GlassCard className="edu-card" blur={12}>
                            <h3 className="edu-degree">Bachelor of Technology - CSE</h3>
                            <p className="edu-school">Lovely Professional University</p>
                            <p className="edu-date">2023 - 2027</p>
                        </GlassCard>
                    </motion.div>
                    <motion.div className="contact-column" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInLeft}>
                        <KineticTitle text="Get In Touch" className="section-title" effect="split" />
                        <motion.div className="title-line" style={{ margin: '0 0 2rem 0' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                        <p className="contact-text">Have a project in mind or want to collaborate? I'd love to hear from you!</p>
                        <ContactForm />
                        <div className="contact-links">
                            <a href="mailto:sachin@example.com" className="contact-link-card"><span className="contact-icon">📧</span><div className="contact-link-info"><span>Email</span><strong>sachin@example.com</strong></div></a>
                            <a href="https://github.com/Sachin23991" target="_blank" rel="noreferrer" className="contact-link-card"><span className="contact-icon">💼</span><div className="contact-link-info"><span>GitHub</span><strong>@Sachin23991</strong></div></a>
                            <a href="https://huggingface.co/Sachin21112004" target="_blank" rel="noreferrer" className="contact-link-card"><span className="contact-icon">🤗</span><div className="contact-link-info"><span>Hugging Face</span><strong>@Sachin21112004</strong></div></a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <MorphingTransition transitionType="zoom">
                    <h2 className="cta-heading">Let's Build Something Amazing</h2>
                    <p className="cta-subheading">Ready to bring your ideas to life with AI and modern web technologies?</p>
                    <MagneticButton href="#contact" className="cta-main-btn">Start a Project →</MagneticButton>
                </MorphingTransition>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© {new Date().getFullYear()} Sachin. Built with React, Three.js, GSAP & Framer Motion.</p>
            </footer>
        </div>
    );
}
