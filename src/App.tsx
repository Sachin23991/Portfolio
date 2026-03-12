import { useEffect, useMemo, useRef, useCallback } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useMotionValue,
    useTransform,
    useInView,
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Scene3D from './components/Scene3D';

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
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
};
const heroChild = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: smoothEase } },
};
const heroStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};
const pillPop = {
    hidden: { opacity: 0, scale: 0.6, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 15 } },
};
const pillContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

/* ─── 3D Tilt Card ─── */
function TiltCard({
    children,
    className,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            x.set((e.clientX - rect.left) / rect.width - 0.5);
            y.set((e.clientY - rect.top) / rect.height - 0.5);
        },
        [x, y]
    );
    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' as const }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={scaleIn}
            whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
            <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
        </motion.div>
    );
}

/* ─── Animated Section Title ─── */
function AnimatedTitle({ children, className }: { children: string; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const words = children.split(' ');
    return (
        <h2 ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    style={{ display: 'inline-block', marginRight: '0.3em', overflow: 'hidden' }}
                    initial={{ opacity: 0, y: 50, rotateX: -60 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ type: 'spring' as const, damping: 14, stiffness: 100, delay: i * 0.08 }}
                >
                    {word}
                </motion.span>
            ))}
        </h2>
    );
}

/* ─── Magnetic Button ─── */
function MagneticButton({ children, className, href, download, target, rel }: {
    children: React.ReactNode;
    className?: string;
    href?: string;
    download?: boolean;
    target?: string;
    rel?: string;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const bx = useMotionValue(0);
    const by = useMotionValue(0);
    const springX = useSpring(bx, { stiffness: 250, damping: 20 });
    const springY = useSpring(by, { stiffness: 250, damping: 20 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            bx.set((e.clientX - rect.left - rect.width / 2) * 0.25);
            by.set((e.clientY - rect.top - rect.height / 2) * 0.25);
        },
        [bx, by]
    );
    const handleMouseLeave = useCallback(() => {
        bx.set(0);
        by.set(0);
    }, [bx, by]);

    return (
        <motion.a
            ref={ref}
            className={className}
            href={href}
            download={download}
            target={target}
            rel={rel}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
        >
            {children}
        </motion.a>
    );
}

/* ─── App ─── */
function App() {
    const bgRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Mouse parallax for hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const parallaxX = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), { stiffness: 100, damping: 30 });
    const parallaxY = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), { stiffness: 100, damping: 30 });

    const petalStyles = useMemo(
        () =>
            Array.from({ length: 25 }, () => ({
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${14 + Math.random() * 10}s`,
                fontSize: `${10 + Math.random() * 14}px`,
                opacity: 0.5 + Math.random() * 0.5,
            })),
        []
    );

    const handleScroll = useCallback(() => {
        const y = window.scrollY;
        if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.35}px) scale(1.1)`;
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        },
        [mouseX, mouseY]
    );

    useEffect(() => {
        document.body.classList.add('loaded');

        // Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            lenis.destroy();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleScroll, handleMouseMove]);

    return (
        <div className="app">
            {/* ═══ 3D BACKGROUND ═══ */}
            <Scene3D />

            {/* ═══ SCROLL PROGRESS ═══ */}
            <motion.div className="scroll-progress-bar" style={{ scaleX: smoothProgress }} />

            {/* ═══ NAVBAR ═══ */}
            <motion.nav
                className="navbar"
                id="navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            >
                <motion.span
                    className="nav-brand"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    S.
                </motion.span>
                <div className="nav-links">
                    {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((label, i) => (
                        <motion.a
                            key={label}
                            href={`#${label === 'Home' ? 'entrance' : label.toLowerCase()}`}
                            className="nav-link"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            whileHover={{ y: -2, color: '#ffb7c5' }}
                        >
                            {label}
                        </motion.a>
                    ))}
                </div>
                <MagneticButton href="/sachincv.pdf" download className="nav-resume-btn">
                    Resume
                </MagneticButton>
            </motion.nav>

            {/* ═══ ENTRANCE ═══ */}
            <section className="entrance-section" id="entrance">
                <div ref={bgRef} className="entrance-bg" style={{ transform: 'translateY(0) scale(1.1)' }} />
                <div className="entrance-overlay" />
                <div className="petals-container">
                    {petalStyles.map((style, i) => (
                        <div key={i} className="petal" style={style} />
                    ))}
                </div>

                <motion.div
                    className="entrance-content visible"
                    style={{ x: parallaxX, y: parallaxY }}
                    variants={heroStagger}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p className="welcome-text" variants={heroChild}>
                        Welcome
                    </motion.p>

                    <motion.div
                        className="profile-frame"
                        variants={heroChild}
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <div className="profile-ring" />
                        <img src="/profile.png" alt="Sachin" className="profile-image" />
                    </motion.div>

                    <motion.h1 className="hero-name" variants={heroChild}>
                        Sachin
                    </motion.h1>
                    <motion.p className="hero-subtitle" variants={heroChild}>
                        ML &amp; Full Stack Developer
                    </motion.p>
                    <motion.p className="hero-tagline" variants={heroChild}>
                        Passionate about building intelligent systems &amp; beautiful interfaces.
                    </motion.p>
                    <motion.p className="hero-tagline" variants={heroChild}>
                        B.Tech CSE student with hands-on experience in AI, web development &amp; data science.
                    </motion.p>
                    <motion.p className="hero-tagline" variants={heroChild}>
                        Turning ideas into impactful, real-world solutions.
                    </motion.p>

                    <motion.div
                        className="scroll-indicator"
                        variants={heroChild}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <span className="scroll-text">Scroll to explore</span>
                        <div className="scroll-arrow" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ ABOUT ME ═══ */}
            <section className="about-section" id="about">
                <div className="about-intro" style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
                    <AnimatedTitle className="section-title">My Story</AnimatedTitle>
                    <motion.div
                        className="title-line"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    />
                </div>

                <motion.div
                    className="story-grid"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {[
                        { icon: '🎓', heading: 'The Foundation', text: <>Computer Science student at <strong>Lovely Professional University</strong> with a <strong>9.02 CGPA</strong>.</> },
                        { icon: '💡', heading: 'The Passion', text: <>Building at the intersection of <strong>AI and web development</strong> — from ML pipelines to full-stack apps.</> },
                        { icon: '🏆', heading: 'The Hustle', text: <><strong>2nd Rank</strong> among 700+ at Code ECarvan Hackathon. <strong>300+</strong> LeetCode problems solved.</> },
                        { icon: '🌍', heading: 'The Impact', text: <><strong>32K+ downloads</strong> on Hugging Face. Oracle certified in <strong>Gen AI &amp; Data Science</strong>.</> },
                    ].map((card) => (
                        <TiltCard key={card.heading} className="story-card">
                            <div className="story-icon">{card.icon}</div>
                            <h3 className="story-heading">{card.heading}</h3>
                            <p className="story-text">{card.text}</p>
                        </TiltCard>
                    ))}
                </motion.div>

                <motion.div
                    style={{ textAlign: 'center', marginTop: '2rem', position: 'relative', zIndex: 2 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <MagneticButton href="/sachincv.pdf" download className="resume-btn">
                        <span className="resume-btn-icon">↓</span>
                        Download Resume
                    </MagneticButton>
                </motion.div>
            </section>

            {/* ═══ SKILLS SECTION ═══ */}
            <section className="skills-section" id="skills">
                <div className="skills-bg" />
                <div className="skills-overlay" />

                <div className="skills-content">
                    <div style={{ textAlign: 'center' }}>
                        <AnimatedTitle className="section-title">Skills &amp; Tools</AnimatedTitle>
                        <motion.div
                            className="title-line"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>

                    {[
                        {
                            title: 'Languages',
                            skills: [
                                { name: 'Python', icon: 'python/python-original.svg' },
                                { name: 'C++', icon: 'cplusplus/cplusplus-original.svg' },
                                { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
                                { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
                                { name: 'HTML5', icon: 'html5/html5-original.svg' },
                                { name: 'CSS3', icon: 'css3/css3-original.svg' },
                            ],
                        },
                        {
                            title: 'Frameworks & Libraries',
                            skills: [
                                { name: 'React', icon: 'react/react-original.svg' },
                                { name: 'Express.js', icon: 'express/express-original.svg' },
                                { name: 'Node.js', icon: 'nodejs/nodejs-original.svg' },
                                { name: 'FastAPI', icon: 'fastapi/fastapi-original.svg' },
                                { name: 'Spring Boot', icon: 'spring/spring-original.svg' },
                                { name: 'Pandas', icon: 'pandas/pandas-original.svg' },
                                { name: 'NumPy', icon: 'numpy/numpy-original.svg' },
                                { name: 'TensorFlow', icon: 'tensorflow/tensorflow-original.svg' },
                                { name: 'Scikit-learn', icon: 'scikitlearn/scikitlearn-original.svg' },
                                { name: 'TailwindCSS', icon: 'tailwindcss/tailwindcss-original.svg' },
                                { name: 'Three.js', icon: 'threejs/threejs-original.svg' },
                            ],
                        },
                        {
                            title: 'Tools & Platforms',
                            skills: [
                                { name: 'Docker', icon: 'docker/docker-original.svg' },
                                { name: 'AWS', icon: 'amazonwebservices/amazonwebservices-plain-wordmark.svg' },
                                { name: 'MySQL', icon: 'mysql/mysql-original.svg' },
                                { name: 'Firebase', icon: 'firebase/firebase-plain.svg' },
                                { name: 'GitHub', icon: 'github/github-original.svg' },
                                { name: 'Git', icon: 'git/git-original.svg' },
                                { name: 'Power BI', icon: 'azure/azure-original.svg' },
                            ],
                            extra: { name: 'Hugging Face', emoji: '🤗' },
                        },
                    ].map((category) => (
                        <motion.div
                            className="skill-category"
                            key={category.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeInUp}
                        >
                            <h3 className="skill-category-title">{category.title}</h3>
                            <motion.div
                                className="skill-pills"
                                variants={pillContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-40px' }}
                            >
                                {category.skills.map((s) => (
                                    <motion.div
                                        className="skill-pill"
                                        key={s.name}
                                        variants={pillPop}
                                        whileHover={{
                                            y: -6,
                                            scale: 1.08,
                                            borderColor: '#ffb7c5',
                                            boxShadow: '0 8px 30px rgba(255,183,197,0.2)',
                                            transition: { type: 'spring', stiffness: 300 },
                                        }}
                                    >
                                        <img
                                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.icon}`}
                                            alt={s.name}
                                            className="skill-icon"
                                        />
                                        <span>{s.name}</span>
                                    </motion.div>
                                ))}
                                {category.extra && (
                                    <motion.div
                                        className="skill-pill"
                                        variants={pillPop}
                                        whileHover={{
                                            y: -6,
                                            scale: 1.08,
                                            borderColor: '#ffb7c5',
                                            boxShadow: '0 8px 30px rgba(255,183,197,0.2)',
                                            transition: { type: 'spring', stiffness: 300 },
                                        }}
                                    >
                                        <span className="skill-emoji">{category.extra.emoji}</span>
                                        <span>{category.extra.name}</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══ EXPERIENCE SECTION ═══ */}
            <section className="experience-section parallax-section" id="experience">
                <div className="section-bg" style={{ backgroundImage: "url('/experience-bg.png')" }} />
                <div className="section-overlay dark" />

                <div className="section-content">
                    <div style={{ textAlign: 'center' }}>
                        <AnimatedTitle className="section-title">Experience</AnimatedTitle>
                        <motion.div
                            className="title-line"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>

                    <div className="timeline">
                        <motion.div
                            className="timeline-item"
                            initial={{ opacity: 0, x: -80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <motion.div
                                className="timeline-dot"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                            />
                            <motion.div
                                className="timeline-content"
                                whileHover={{ y: -6, borderColor: 'rgba(255,183,197,0.5)', boxShadow: '0 12px 40px rgba(255,183,197,0.12)' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <h3 className="timeline-role">Freelance Full Stack Developer</h3>
                                <div className="timeline-meta">
                                    <span className="timeline-company">GitHub (Freelance)</span>
                                    <span className="timeline-date">Oct 2024 - Present</span>
                                </div>
                                <p className="timeline-desc">
                                    Developed <strong>Loan Manager</strong>, a private, full-stack financial application to manage
                                    EMI-based loans for clients. Features dynamic amortization schedules, payment tracking,
                                    interactive collection dashboards, and data exports.
                                </p>
                                <motion.div
                                    className="timeline-tags"
                                    variants={pillContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {['HTML/CSS/JS', 'Firebase', 'Chart.js', 'SheetJS'].map((tag) => (
                                        <motion.span key={tag} variants={pillPop}>
                                            {tag}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ PROJECTS SECTION ═══ */}
            <section className="projects-section parallax-section" id="projects">
                <div className="section-bg" style={{ backgroundImage: "url('/projects-bg.png')" }} />
                <div className="section-overlay mystical" />

                <div className="section-content">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <AnimatedTitle className="section-title">Featured Projects</AnimatedTitle>
                        <motion.div
                            className="title-line"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        <motion.p
                            className="section-subtitle"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            A showcase of intelligent systems and elegant interfaces
                        </motion.p>
                    </div>

                    <motion.div
                        className="projects-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {[
                            {
                                title: 'UPI Transaction Analytics',
                                desc: 'Interactive dashboard analyzing 1M+ UPI transactions across India. Features time-based trends, bank-wise performance, regional deep-dives, and fraud monitoring.',
                                tags: ['Power BI', 'Data Analytics', 'Business Intelligence'],
                                link: 'https://github.com/Sachin23991/power-bi-Project',
                            },
                            {
                                title: 'CareerFlow NextGen',
                                desc: 'All-in-One AI-Powered Career Platform featuring an intelligent ATS resume builder, Sancara AI career co-pilot, and robust mentorship connections.',
                                tags: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'AI'],
                                link: 'https://careerflow-nextgen-landing.vercel.app/',
                            },
                            {
                                title: 'DSA Revisor',
                                desc: 'Comprehensive DSA practice tracking platform featuring a spaced repetition engine, robust analytics, and gamification with XP, levels, and badges.',
                                tags: ['HTML/CSS/JS', 'Firebase', 'Spaced Repetition'],
                                link: 'https://github.com/Sachin23991/DSA-REVISOR',
                            },
                            {
                                title: 'Grievance Reporter',
                                desc: 'Full-stack public grievance management platform enabling citizens to report issues. Features real-time tracking, role-based admin oversight, and email notifications.',
                                tags: ['Spring Boot 3', 'React', 'MySQL', 'Docker'],
                                link: 'https://grievance-reporter.vercel.app/',
                            },
                            {
                                title: 'AnimeInformation',
                                desc: 'Comprehensive full-stack web application designed to create, manage, and explore a rich anime database. Features detailed character profiles, episode tracking, and admin dashboard.',
                                tags: ['Django', 'Python', 'SQLite', 'JavaScript'],
                                link: 'https://animeinformation.onrender.com/',
                            },
                            {
                                title: 'SIPwise',
                                desc: 'AI-powered health awareness platform educating users about sugary drinks. Features interactive sugar visualizations, gamified daily challenges, and an AI-driven wellness chatbot.',
                                tags: ['Node.js', 'Express.js', 'Firebase', 'Perplexity AI'],
                                link: 'https://github.com/Sachin23991/sipwise',
                            },
                        ].map((project) => (
                            <TiltCard key={project.title} className="project-card">
                                <div className="project-card-inner">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-desc">{project.desc}</p>
                                    <div className="project-tags">
                                        {project.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                    {project.link !== '#' ? (
                                        <motion.a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="project-link"
                                            whileHover={{ x: 4 }}
                                        >
                                            View Project <span>→</span>
                                        </motion.a>
                                    ) : (
                                        <span
                                            className="project-link"
                                            style={{
                                                cursor: 'not-allowed',
                                                color: 'rgba(255, 183, 197, 0.4)',
                                            }}
                                        >
                                            🔒 Private Project
                                        </span>
                                    )}
                                </div>
                            </TiltCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ EDUCATION & CONTACT SECTION ═══ */}
            <section className="contact-section parallax-section" id="contact">
                <div className="section-bg" style={{ backgroundImage: "url('/contact-bg.png')" }} />
                <div className="section-overlay dark" />

                <div className="section-content contact-layout">
                    <motion.div
                        className="education-column"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={fadeInRight}
                    >
                        <AnimatedTitle className="section-title">Education</AnimatedTitle>
                        <motion.div
                            className="title-line"
                            style={{ margin: '0 0 2rem 0' }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />

                        <motion.div
                            className="edu-card"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ x: 6, borderColor: 'rgba(255,183,197,0.4)' }}
                        >
                            <h4 className="edu-degree">B.Tech in Computer Science &amp; Engineering</h4>
                            <p className="edu-school">Lovely Professional University (LPU)</p>
                            <p className="edu-date">2022 - 2026 | CGPA: 9.02</p>
                        </motion.div>
                        <motion.div
                            className="edu-card"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            whileHover={{ x: 6, borderColor: 'rgba(255,183,197,0.4)' }}
                        >
                            <h4 className="edu-degree">Intermediate (Class 12th)</h4>
                            <p className="edu-school">Pragati Public School</p>
                            <p className="edu-date">2021 | Score: 85%</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="contact-column"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={fadeInLeft}
                    >
                        <AnimatedTitle className="section-title">Let's Connect</AnimatedTitle>
                        <motion.div
                            className="title-line"
                            style={{ margin: '0 0 2rem 0' }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        <motion.p
                            className="contact-text"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            I'm always open to discussing new projects, creative ideas, or opportunities to be
                            part of your vision. Drop me an email directly or find me on my social links below!
                        </motion.p>

                        <motion.div
                            className="contact-links"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {[
                                { href: 'mailto:sachinraosahab7@gmail.com', icon: '📧', label: 'Email Me', value: 'sachinraosahab7@gmail.com' },
                                { href: 'https://linkedin.com/in/sachin6/', icon: '🔗', label: 'Connect on', value: 'LinkedIn', external: true },
                                { href: 'https://github.com/Sachin23991/', icon: '💻', label: 'Follow on', value: 'GitHub', external: true },
                                { href: 'https://huggingface.co/Sachin21112004', icon: '🤗', label: 'Explore my Models', value: 'Hugging Face', external: true },
                            ].map((link) => (
                                <motion.a
                                    key={link.value}
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noreferrer' : undefined}
                                    className="contact-link-card"
                                    variants={scaleIn}
                                    whileHover={{
                                        y: -5,
                                        scale: 1.03,
                                        borderColor: 'rgba(255,183,197,0.5)',
                                        boxShadow: '0 10px 30px rgba(255,183,197,0.1)',
                                        transition: { type: 'spring', stiffness: 300 },
                                    }}
                                >
                                    <span className="contact-icon">{link.icon}</span>
                                    <div className="contact-link-info">
                                        <span>{link.label}</span>
                                        <strong>{link.value}</strong>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                <motion.footer
                    className="footer"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <p>© {new Date().getFullYear()} Sachin. Crafted with passion &amp; intelligence.</p>
                </motion.footer>
            </section>
        </div>
    );
}

export default App;
