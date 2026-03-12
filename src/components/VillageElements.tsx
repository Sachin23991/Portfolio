import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/* ═══ TORII GATE ═══ */
export function ToriiGate({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[-2.2, 2.5, 0]}>
                <cylinderGeometry args={[0.14, 0.18, 5, 8]} />
                <meshStandardMaterial color="#c0392b" roughness={0.6} />
            </mesh>
            <mesh position={[2.2, 2.5, 0]}>
                <cylinderGeometry args={[0.14, 0.18, 5, 8]} />
                <meshStandardMaterial color="#c0392b" roughness={0.6} />
            </mesh>
            <mesh position={[0, 5.3, 0]}>
                <boxGeometry args={[5.8, 0.3, 0.45]} />
                <meshStandardMaterial color="#a93226" roughness={0.5} />
            </mesh>
            <mesh position={[0, 5.55, 0]}>
                <boxGeometry args={[6.2, 0.15, 0.55]} />
                <meshStandardMaterial color="#922b21" roughness={0.5} />
            </mesh>
            <mesh position={[0, 4.2, 0]}>
                <boxGeometry args={[4.8, 0.18, 0.3]} />
                <meshStandardMaterial color="#c0392b" roughness={0.6} />
            </mesh>
            <mesh position={[0, 4.7, 0]}>
                <boxGeometry args={[1, 0.5, 0.12]} />
                <meshStandardMaterial color="#2c1810" roughness={0.8} />
            </mesh>
        </group>
    );
}

/* ═══ CHERRY TREE ═══ */
export function CherryTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.08, 0.15, 3, 6]} />
                <meshStandardMaterial color="#5c3317" roughness={0.9} />
            </mesh>
            <mesh position={[0.5, 2.8, 0]} rotation={[0, 0, -0.6]}>
                <cylinderGeometry args={[0.03, 0.06, 1.5, 4]} />
                <meshStandardMaterial color="#5c3317" roughness={0.9} />
            </mesh>
            <mesh position={[-0.4, 2.6, 0.2]} rotation={[0.3, 0, 0.5]}>
                <cylinderGeometry args={[0.03, 0.05, 1.2, 4]} />
                <meshStandardMaterial color="#5c3317" roughness={0.9} />
            </mesh>
            <mesh position={[0, 3.8, 0]}>
                <sphereGeometry args={[1.3, 8, 8]} />
                <meshStandardMaterial color="#ffb7c5" transparent opacity={0.85} roughness={0.8} />
            </mesh>
            <mesh position={[0.7, 3.4, 0.4]}>
                <sphereGeometry args={[0.8, 7, 7]} />
                <meshStandardMaterial color="#ff9eb5" transparent opacity={0.8} roughness={0.8} />
            </mesh>
            <mesh position={[-0.6, 3.5, -0.3]}>
                <sphereGeometry args={[0.9, 7, 7]} />
                <meshStandardMaterial color="#ffc8d6" transparent opacity={0.8} roughness={0.8} />
            </mesh>
            <mesh position={[0.2, 4.2, -0.2]}>
                <sphereGeometry args={[0.7, 6, 6]} />
                <meshStandardMaterial color="#ffccd5" transparent opacity={0.75} roughness={0.8} />
            </mesh>
        </group>
    );
}

/* ═══ CHERRY BLOSSOM PARTICLES ═══ */
export function CherryBlossomParticles({ count = 150 }: { count?: number }) {
    const ref = useRef<THREE.Points>(null);
    // Pre-compute per-particle phase offsets so we avoid heavy sin() in the hot loop
    const { positions, phaseOffsets } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const phases = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 1] = Math.random() * 12 + 0.5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 25;
            phases[i] = i * 0.1;
        }
        return { positions: pos, phaseOffsets: phases };
    }, [count]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        const arr = ref.current.geometry.attributes.position.array as Float32Array;
        const t = state.clock.elapsedTime * 0.5;
        const fallSpeed = 0.007 * (delta / 0.016); // frame-rate independent fall
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] -= fallSpeed;
            arr[i * 3] += Math.sin(t + phaseOffsets[i]) * 0.003;
            if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 12;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.07} color="#ffb7c5" transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

/* ═══ STONE LANTERN ═══ */
export function StoneLantern({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.22, 0.28, 0.24, 6]} />
                <meshStandardMaterial color="#888" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.08, 0.1, 0.6, 6]} />
                <meshStandardMaterial color="#999" roughness={0.95} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[0.32, 0.32, 0.32]} />
                <meshStandardMaterial color="#ffdd88" emissive="#ffaa44" emissiveIntensity={1} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
                <coneGeometry args={[0.3, 0.25, 4]} />
                <meshStandardMaterial color="#777" roughness={0.95} />
            </mesh>
            <pointLight position={[0, 1.0, 0]} color="#ffaa44" intensity={1.5} distance={6} decay={2} />
        </group>
    );
}

/* ═══ WOODEN SIGN ═══ */
export function WoodenSign({ position, title, content, rotation = [0, 0, 0] as [number, number, number] }: {
    position: [number, number, number]; title: string; content: string; rotation?: [number, number, number];
}) {
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[-1.1, 0.8, 0]}><cylinderGeometry args={[0.05, 0.05, 1.6, 6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
            <mesh position={[1.1, 0.8, 0]}><cylinderGeometry args={[0.05, 0.05, 1.6, 6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
            <mesh position={[0, 1.3, 0]}><boxGeometry args={[2.5, 1, 0.06]} /><meshStandardMaterial color="#8B5E3C" roughness={0.85} /></mesh>
            <mesh position={[0, 1.85, 0]}><boxGeometry args={[2.7, 0.08, 0.1]} /><meshStandardMaterial color="#6B3F1F" roughness={0.9} /></mesh>
            <Text font="/outfit.ttf" fontSize={0.15} position={[0, 1.58, 0.04]} color="#2a1506" anchorX="center" maxWidth={2.2}>{title}</Text>
            <Text font="/outfit.ttf" fontSize={0.09} position={[0, 1.15, 0.04]} color="#3d2112" anchorX="center" anchorY="top" maxWidth={2.2}>{content}</Text>
        </group>
    );
}

/* ═══ PROJECT SHRINE ═══ */
export function ProjectShrine({ position, title, description, accentColor, rotation = [0, 0, 0] as [number, number, number] }: {
    position: [number, number, number]; title: string; description: string; accentColor: string; rotation?: [number, number, number];
}) {
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, 0.1, 0]}><boxGeometry args={[3.5, 0.2, 2]} /><meshStandardMaterial color="#888" roughness={0.95} /></mesh>
            <mesh position={[0, 1.3, 0]}><boxGeometry args={[3, 2.2, 0.12]} /><meshStandardMaterial color="#6B3F1F" roughness={0.8} /></mesh>
            <mesh position={[0, 2.6, 0]}><boxGeometry args={[3.4, 0.15, 0.5]} /><meshStandardMaterial color="#4a2a10" roughness={0.85} /></mesh>
            <mesh position={[0, 2.45, 0.07]}><boxGeometry args={[3.05, 0.06, 0.02]} /><meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} /></mesh>
            <mesh position={[-1.4, 1.3, 0.08]}><cylinderGeometry args={[0.06, 0.06, 2.2, 6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
            <mesh position={[1.4, 1.3, 0.08]}><cylinderGeometry args={[0.06, 0.06, 2.2, 6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
            <Text font="/outfit.ttf" fontSize={0.18} position={[0, 2.1, 0.08]} color={accentColor} anchorX="center" maxWidth={2.6}>{title}</Text>
            <Text font="/outfit.ttf" fontSize={0.09} position={[0, 1.65, 0.08]} color="#e8d5c0" anchorX="center" anchorY="top" maxWidth={2.5}>{description}</Text>
            <pointLight position={[0, 1.5, 0.5]} color={accentColor} intensity={1} distance={5} decay={2} />
        </group>
    );
}

/* ═══ GROUND ═══ */
export function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -30]} receiveShadow>
            <planeGeometry args={[60, 120]} />
            <meshStandardMaterial color="#2d4a27" roughness={0.95} />
        </mesh>
    );
}

/* ═══ STONE PATH ═══ */
export function StonePath() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -35]}>
                <planeGeometry args={[2.5, 100]} />
                <meshStandardMaterial color="#8B7355" roughness={0.95} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.3, 0.02, -35]}>
                <planeGeometry args={[0.06, 100]} />
                <meshStandardMaterial color="#aaa090" roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.3, 0.02, -35]}>
                <planeGeometry args={[0.06, 100]} />
                <meshStandardMaterial color="#aaa090" roughness={0.9} />
            </mesh>
        </group>
    );
}

/* ═══ BAMBOO CLUSTER ═══ */
export function BambooCluster({ position, count = 5 }: { position: [number, number, number]; count?: number }) {
    const stalks = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            x: Math.sin(i * 2.5) * 0.5, z: Math.cos(i * 1.7) * 0.5,
            h: 3 + (i % 3) * 1.5, r: 0.03 + (i % 2) * 0.02
        })), [count]);
    return (
        <group position={position}>
            {stalks.map((s, i) => (
                <mesh key={i} position={[s.x, s.h / 2, s.z]}>
                    <cylinderGeometry args={[s.r, s.r + 0.01, s.h, 6]} />
                    <meshStandardMaterial color="#4a7c3f" roughness={0.7} />
                </mesh>
            ))}
        </group>
    );
}

/* ═══ SMALL BRIDGE ═══ */
export function WoodenBridge({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.3, 0]} rotation={[-0.05, 0, 0]}>
                <boxGeometry args={[2.5, 0.08, 1.5]} />
                <meshStandardMaterial color="#8B5E3C" roughness={0.85} />
            </mesh>
            <mesh position={[-1.2, 0.55, 0]}><boxGeometry args={[0.06, 0.5, 1.5]} /><meshStandardMaterial color="#6B3F1F" roughness={0.9} /></mesh>
            <mesh position={[1.2, 0.55, 0]}><boxGeometry args={[0.06, 0.5, 1.5]} /><meshStandardMaterial color="#6B3F1F" roughness={0.9} /></mesh>
            <mesh position={[-1.2, 0.8, 0]}><boxGeometry args={[0.08, 0.06, 1.6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
            <mesh position={[1.2, 0.8, 0]}><boxGeometry args={[0.08, 0.06, 1.6]} /><meshStandardMaterial color="#5c3317" roughness={0.9} /></mesh>
        </group>
    );
}
