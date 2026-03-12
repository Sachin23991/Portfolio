import { useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Text, Float, Image } from '@react-three/drei';
import * as THREE from 'three';
import {
    ToriiGate, CherryTree, CherryBlossomParticles, StoneLantern,
    WoodenSign, ProjectShrine, Ground, StonePath, BambooCluster, WoodenBridge
} from './VillageElements';

/* ═══ CAMERA RIG — walks through the village as user scrolls ═══ */
function CameraRig() {
    const scroll = useScroll();
    useFrame((state, delta) => {
        const p = scroll.offset;
        const targetZ = 14 - p * 100;
        const targetY = 2.5 + Math.sin(p * Math.PI * 4) * 0.08;
        state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 3, delta);
        state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3, delta);
    });
    return null;
}

/* ═══ MAIN SCENE ═══ */
export function PortfolioScene() {
    return (
        <>
            {/* Warm sunset lighting */}
            <ambientLight intensity={0.35} color="#ffeedd" />
            <directionalLight position={[8, 15, 10]} intensity={0.7} color="#ffd4a0" />
            <hemisphereLight args={['#ffb7a5', '#2d5a27', 0.4]} />
            <fog attach="fog" args={['#c89aa0', 20, 65]} />
            <color attach="background" args={['#2d1b3d']} />

            <ScrollControls pages={10} damping={0.25}>
                <CameraRig />
                <group>
                    <Ground />
                    <StonePath />
                    <CherryBlossomParticles />

                    {/* ═══ ENTRANCE — Torii Gate (Z: 8) ═══ */}
                    <ToriiGate position={[0, 0, 8]} />
                    <StoneLantern position={[-1.5, 0, 9]} />
                    <StoneLantern position={[1.5, 0, 9]} />
                    <CherryTree position={[-4, 0, 10]} scale={1.3} />
                    <CherryTree position={[4.5, 0, 9]} scale={1.1} />
                    <CherryTree position={[-3, 0, 6]} scale={0.9} />
                    <CherryTree position={[3.5, 0, 5]} scale={1.0} />

                    <Text font="/outfit.ttf" fontSize={0.28} position={[0, 4.85, 8]} color="#f5e6d3" anchorX="center">
                        Welcome
                    </Text>

                    {/* ═══ PROFILE SECTION (Z: 2-4) ═══ */}
                    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2} position={[0, 0, 3]}>
                        <Image url="/profile.png" position={[0, 3.5, 0]} scale={[1.8, 2.2]} transparent />
                        <Text font="/outfit.ttf" fontSize={1.2} position={[0, 1.8, 0]} color="#f5e6d3" anchorX="center">
                            SACHIN
                            <meshStandardMaterial color="#f5e6d3" emissive="#f5e6d3" emissiveIntensity={0.3} />
                        </Text>
                        <Text font="/outfit.ttf" fontSize={0.22} position={[0, 1.1, 0]} color="#e8c8a0" anchorX="center">
                            ML and Full Stack Developer
                        </Text>
                    </Float>
                    <Text font="/outfit.ttf" fontSize={0.12} position={[0, 0.6, 1.5]} color="#c0a080" anchorX="center">
                        Scroll to explore my journey
                    </Text>

                    {/* Lanterns along the path */}
                    {[-1, -5, -13, -25, -35, -50, -60, -70].map((z, i) => (
                        <StoneLantern key={`ll${i}`} position={[-1.8, 0, z]} />
                    ))}
                    {[-3, -7, -15, -27, -37, -52, -62, -72].map((z, i) => (
                        <StoneLantern key={`lr${i}`} position={[1.8, 0, z]} />
                    ))}

                    {/* Cherry trees scattered along the village */}
                    <CherryTree position={[-5, 0, -3]} scale={0.8} />
                    <CherryTree position={[5, 0, -10]} scale={1.0} />
                    <CherryTree position={[-4.5, 0, -18]} scale={1.1} />
                    <CherryTree position={[4, 0, -22]} scale={0.9} />
                    <CherryTree position={[-5, 0, -35]} scale={1.2} />
                    <CherryTree position={[5, 0, -42]} scale={0.85} />
                    <CherryTree position={[-4, 0, -55]} scale={1.0} />
                    <CherryTree position={[4.5, 0, -65]} scale={0.95} />

                    {/* Bamboo groves */}
                    <BambooCluster position={[-6, 0, -5]} count={7} />
                    <BambooCluster position={[6, 0, -8]} count={5} />
                    <BambooCluster position={[-5.5, 0, -20]} count={6} />
                    <BambooCluster position={[5.5, 0, -30]} count={4} />
                    <BambooCluster position={[-6, 0, -45]} count={5} />
                    <BambooCluster position={[6, 0, -55]} count={7} />

                    {/* Bridges */}
                    <WoodenBridge position={[0, 0, -9]} />
                    <WoodenBridge position={[0, 0, -56]} />

                    {/* ═══ SKILLS SECTION (Z: -5 to -14) ═══ */}
                    <Text font="/outfit.ttf" fontSize={0.5} position={[0, 3.5, -4]} color="#f5e6d3" anchorX="center">
                        Skills
                        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.3} />
                    </Text>
                    <WoodenSign position={[-3, 0, -7]} title="Languages" content="Python  |  C++  |  JavaScript" rotation={[0, 0.3, 0]} />
                    <WoodenSign position={[3, 0, -9]} title="Frameworks and Tools" content="ExpressJS  |  Scikit-learn  |  Docker  |  AWS" rotation={[0, -0.3, 0]} />
                    <WoodenSign position={[-3, 0, -12]} title="Platforms" content="Hugging Face  |  GitHub  |  Firebase  |  MySQL  |  Power BI" rotation={[0, 0.2, 0]} />

                    {/* ═══ EXPERIENCE SECTION (Z: -16 to -21) ═══ */}
                    <Text font="/outfit.ttf" fontSize={0.5} position={[0, 3.5, -16]} color="#f5e6d3" anchorX="center">
                        Experience
                        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.3} />
                    </Text>
                    <ProjectShrine
                        position={[3, 0, -19]}
                        title="Freelance Full Stack Dev"
                        description="Loan Manager: EMI and Customer Management Web App. Browser-based solution for lenders with dashboards, charts, Firebase auth. Sept-Nov 2025"
                        accentColor="#ffaa44"
                        rotation={[0, -0.4, 0]}
                    />

                    {/* ═══ PROJECTS SECTION (Z: -24 to -55) ═══ */}
                    <Text font="/outfit.ttf" fontSize={0.5} position={[0, 3.5, -24]} color="#f5e6d3" anchorX="center">
                        Projects
                        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.3} />
                    </Text>
                    <ProjectShrine position={[-3.5, 0, -27]} title="UPI Analytics Dashboard" description="Multi-page Power BI dashboard analyzing UPI transactions across India with DAX measures and interactive slicers." accentColor="#ff6b6b" rotation={[0, 0.4, 0]} />
                    <ProjectShrine position={[3.5, 0, -32]} title="Dream Flow AI" description="Career Recommendation AI using DistilBERT, FAISS retrieval, FastAPI backend for personalized career guidance." accentColor="#4ecdc4" rotation={[0, -0.4, 0]} />
                    <ProjectShrine position={[-3.5, 0, -37]} title="K-Means Mall Segments" description="ML clustering on mall customers. K-Means with k=5, Silhouette Score 0.55. Identified high-value customer segments." accentColor="#87CEFA" rotation={[0, 0.4, 0]} />
                    <ProjectShrine position={[3.5, 0, -42]} title="SIPwise AI Health" description="AI health platform with sugar visualizations, Perplexity AI chatbot, gamified challenges, and community leaderboards." accentColor="#90EE90" rotation={[0, -0.4, 0]} />
                    <ProjectShrine position={[-3.5, 0, -47]} title="Grievance Reporter" description="Full-stack enterprise system: Spring Boot, React, Docker. JWT auth, email notifications, admin analytics dashboard." accentColor="#ffe66d" rotation={[0, 0.4, 0]} />
                    <ProjectShrine position={[3.5, 0, -52]} title="DSA Revisor" description="Offline-first study tracker with spaced repetition, gamification, Firebase sync, and progress analytics." accentColor="#ff69b4" rotation={[0, -0.4, 0]} />

                    {/* ═══ ACHIEVEMENTS (Z: -58 to -66) ═══ */}
                    <Text font="/outfit.ttf" fontSize={0.5} position={[0, 3.5, -58]} color="#f5e6d3" anchorX="center">
                        Achievements
                        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.3} />
                    </Text>
                    <WoodenSign position={[-3, 0, -60]} title="Code ECarvan Hackathon" content="Secured 2nd Rank among 700+ participants" rotation={[0, 0.3, 0]} />
                    <WoodenSign position={[3, 0, -62]} title="Hugging Face" content="32K+ downloads: 27K datasets, 5K models" rotation={[0, -0.3, 0]} />
                    <WoodenSign position={[-3, 0, -64]} title="LeetCode" content="300+ problems solved" rotation={[0, 0.2, 0]} />
                    <WoodenSign position={[3, 0, -66]} title="Oracle Certifications" content="OCI Gen AI Professional | OCI Data Science Professional" rotation={[0, -0.2, 0]} />

                    {/* ═══ EDUCATION (Z: -69 to -73) ═══ */}
                    <Text font="/outfit.ttf" fontSize={0.5} position={[0, 3.5, -69]} color="#f5e6d3" anchorX="center">
                        Education
                        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.3} />
                    </Text>
                    <WoodenSign position={[-3, 0, -71]} title="B.Tech CSE — LPU" content="CGPA: 9.02 | Since Aug 2023" rotation={[0, 0.3, 0]} />
                    <WoodenSign position={[3, 0, -73]} title="Intermediate — RKC School" content="92% | 2022-2023" rotation={[0, -0.3, 0]} />

                    {/* ═══ CONTACT SECTION (Z: -77 to -83) ═══ */}
                    <ToriiGate position={[0, 0, -77]} />
                    <StoneLantern position={[-1.5, 0, -78]} />
                    <StoneLantern position={[1.5, 0, -78]} />

                    <Float speed={1.5} floatIntensity={0.2} position={[0, 3.5, -81]}>
                        <Text font="/outfit.ttf" fontSize={0.8} color="#f5e6d3" anchorX="center">
                            Let's Connect
                            <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.4} />
                        </Text>
                    </Float>
                    <Text font="/outfit.ttf" fontSize={0.14} position={[0, 2, -83]} color="#e8c8a0" anchorX="center">sachinraosahab7@gmail.com</Text>
                    <Text font="/outfit.ttf" fontSize={0.14} position={[0, 1.6, -83]} color="#e8c8a0" anchorX="center">github.com/Sachin23991</Text>
                    <Text font="/outfit.ttf" fontSize={0.14} position={[0, 1.2, -83]} color="#e8c8a0" anchorX="center">linkedin.com/in/sachin6</Text>
                </group>
            </ScrollControls>
        </>
    );
}
