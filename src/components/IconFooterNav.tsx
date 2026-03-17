import { motion } from 'framer-motion';
import {
    Award,
    BarChart3,
    BriefcaseBusiness,
    Download,
    FileText,
    Github,
    Home,
    Instagram,
    LayoutPanelTop,
    Linkedin,
    Mail,
    Medal,
    SquareTerminal,
    Twitter,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback } from 'react';

interface NavItem {
    icon: LucideIcon;
    label: string;
    id?: string;
    href?: string;
    external?: boolean;
}

interface IconFooterNavProps {
    onNavigate?: (id: string) => void;
}

const navItems: NavItem[] = [
    { icon: Home, label: 'Home', id: 'entrance' },
    { icon: FileText, label: 'Services', id: 'services' },
    { icon: UserRound, label: 'About', id: 'about' },
    { icon: BriefcaseBusiness, label: 'Projects', id: 'projects' },
    { icon: SquareTerminal, label: 'Experience', id: 'experience' },
    { icon: LayoutPanelTop, label: 'Skills', id: 'skills' },
    { icon: BarChart3, label: 'Stats', id: 'stats' },
    { icon: Award, label: 'Achievements', id: 'achievements' },
    { icon: Medal, label: 'Certifications', id: 'certificates' },
    { icon: Mail, label: 'Contact', id: 'contact' },
];

const socialItems: NavItem[] = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/Sachin23991/', external: true },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/sachin6/', external: true },
    { icon: Twitter, label: 'X (Twitter)', href: 'https://x.com/MandhiyaRao', external: true },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/sachinraomandhaiya23/', external: true },
    { icon: Mail, label: 'Email', href: 'mailto:sachinraosahab7@gmail.com' },
    { icon: Download, label: 'Download CV', href: '/sachincv.pdf' },
];

export function IconFooterNav({ onNavigate }: IconFooterNavProps) {
    const handleNavClick = useCallback((item: NavItem) => {
        if (item.id && onNavigate) {
            onNavigate(item.id);
        }
    }, [onNavigate]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut' as const,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.05,
                type: 'spring' as const,
                stiffness: 200,
                damping: 20,
            },
        }),
    };

    const iconVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.3, rotate: 5 },
    };

    return (
        <motion.div
            className="icon-footer-nav"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="icon-footer-shell" role="navigation" aria-label="Footer navigation">
                <div className="icon-footer-brand" aria-hidden="true">SR</div>

                <div className="footer-rail-divider" />

                <motion.div className="nav-icons-wrapper">
                    {navItems.map((item, i) => (
                        <motion.button
                            key={item.id}
                            className="nav-icon-btn"
                            custom={i}
                            variants={itemVariants}
                            whileHover="hover"
                            initial="hidden"
                            animate="visible"
                            title={item.label}
                            onClick={() => handleNavClick(item)}
                            aria-label={item.label}
                            type="button"
                        >
                            <motion.span
                                className="icon-inner"
                                variants={iconVariants}
                                initial="rest"
                                whileHover="hover"
                            >
                                <item.icon size={16} strokeWidth={2} />
                            </motion.span>
                            <span className="tooltip">{item.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div className="social-icons-wrapper">
                    {socialItems.map((item, i) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="social-icon-btn"
                            custom={navItems.length + i}
                            variants={itemVariants}
                            whileHover="hover"
                            initial="hidden"
                            animate="visible"
                            title={item.label}
                            aria-label={item.label}
                        >
                            <motion.span
                                className="icon-inner"
                                variants={iconVariants}
                                initial="rest"
                                whileHover="hover"
                            >
                                <item.icon size={16} strokeWidth={2} />
                            </motion.span>
                            <span className="tooltip">{item.label}</span>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
