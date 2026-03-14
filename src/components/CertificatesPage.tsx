import { motion } from 'framer-motion';
import { KineticTitle } from './KineticTypography';
import { ScrollytellingReveal } from './ScrollytellingReveal';

const CERTIFICATES_DATA = [
    {
        image: '/certificates/courseera.png',
        title: 'Machine Learning Specialization',
        issuer: 'Coursera - Stanford University',
        date: '2024',
        description: 'Comprehensive 3-course specialization covering supervised learning, unsupervised learning, and best practices in ML. Mastered algorithms including linear regression, neural networks, and decision trees.'
    },
    {
        image: '/certificates/udemy.png',
        title: 'Complete Web Development Bootcamp',
        issuer: 'Udemy',
        date: '2024',
        description: 'Full-stack development course covering HTML, CSS, JavaScript, Node.js, React, and databases. Built multiple real-world projects including e-commerce sites and web applications.'
    },
    {
        image: '/certificates/code3601.png',
        title: 'Data Structures & Algorithms',
        issuer: 'Coding Ninjas',
        date: '2024',
        description: 'Intensive DSA training covering arrays, linked lists, trees, graphs, dynamic programming, and competitive programming. Solved 300+ problems on platforms like LeetCode and CodeChef.'
    },
    {
        image: '/certificates/code3602.png',
        title: 'Advanced Competitive Programming',
        issuer: 'Coding Ninjas',
        date: '2025',
        description: 'Advanced problem-solving course focusing on complex algorithms, graph theory, number theory, and optimization techniques. Participated in multiple coding contests and hackathons.'
    }
];

const CERTIFICATIONS_DATA = [
    {
        image: '/certification/generativeai.png',
        title: 'Oracle Cloud Infrastructure Gen AI Professional',
        issuer: 'Oracle',
        date: 'Oct 2025',
        description: 'Professional certification in Generative AI covering large language models, prompt engineering, RAG architectures, and AI integration. Learned to build and deploy production-ready AI applications using Oracle Cloud.'
    },
    {
        image: '/certification/datascience.png',
        title: 'Oracle Cloud Infrastructure Data Science Professional',
        issuer: 'Oracle',
        date: 'Oct 2025',
        description: 'Comprehensive data science certification covering machine learning workflows, model training, deployment, and MLOps. Gained expertise in data preprocessing, feature engineering, and model evaluation using Oracle Data Science platform.'
    }
];

interface CertificatesPageProps {
    onClose: () => void;
}

export function CertificatesPage({ onClose }: CertificatesPageProps) {
    return (
        <motion.div
            className="stats-page-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="stats-bg" style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: "url('/projects-bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                zIndex: -1,
                pointerEvents: 'none'
            }} />
            <div className="stats-page">
                <button className="stats-close-btn" onClick={onClose}>✕ Back to Portfolio</button>

                {/* Certificates Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <KineticTitle text="Certificates" className="section-title" effect="split" />
                    <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                    <p className="section-subtitle" style={{ marginTop: '1rem' }}>Professional certifications and course completions</p>
                </div>

                <ScrollytellingReveal revealType="slide" stagger={0.15}>
                    <div className="achievements-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '4rem' }}>
                        {CERTIFICATES_DATA.map((cert, index) => (
                            <motion.div
                                key={index}
                                className="achievement-card"
                                data-reveal
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                style={{
                                    background: 'rgba(32, 18, 40, 0.72)',
                                    borderColor: 'rgba(255, 183, 197, 0.18)',
                                    flexDirection: 'column',
                                    alignItems: 'stretch'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    marginBottom: '1rem',
                                    background: 'rgba(0,0,0,0.3)'
                                }}>
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.05)'
                                        }}
                                    />
                                </div>
                                <div className="achievement-info" style={{ flex: 1 }}>
                                    <span className="achievement-year">{cert.date}</span>
                                    <h4 style={{ fontSize: '1rem', margin: '0.4rem 0' }}>{cert.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>{cert.issuer}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{cert.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollytellingReveal>

                {/* Certifications Section */}
                <div style={{ textAlign: 'center', margin: '5rem 0 3rem' }}>
                    <KineticTitle text="Professional Certifications" className="section-title" effect="wave" />
                    <motion.div className="title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
                </div>

                <ScrollytellingReveal revealType="slide" stagger={0.2}>
                    <div className="achievements-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                        {CERTIFICATIONS_DATA.map((cert, index) => (
                            <motion.div
                                key={index}
                                className="achievement-card"
                                data-reveal
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                style={{
                                    background: 'rgba(28, 21, 44, 0.74)',
                                    borderColor: 'rgba(126, 184, 255, 0.2)',
                                    flexDirection: 'column',
                                    alignItems: 'stretch'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '220px',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    marginBottom: '1rem',
                                    background: 'rgba(0,0,0,0.3)'
                                }}>
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.05)'
                                        }}
                                    />
                                </div>
                                <div className="achievement-info" style={{ flex: 1 }}>
                                    <span className="achievement-year">{cert.date}</span>
                                    <h4 style={{ fontSize: '1.05rem', margin: '0.4rem 0' }}>{cert.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>{cert.issuer}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{cert.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollytellingReveal>
            </div>
        </motion.div>
    );
}
