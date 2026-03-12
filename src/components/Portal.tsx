import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial, RoundedBox, Text, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

type ProjectPortalProps = {
    position: [number, number, number];
    color: string;
    text: string;
    isDarkTheme: boolean;
    active: string | null;
    id: string;
    setActive: (id: string | null) => void;
};

// A single Project Portal Component
export const ProjectPortal = ({ position, color, text, isDarkTheme, active, id, setActive }: ProjectPortalProps) => {
    const portalMaterial = useRef<any>(null);

    // Transition between portals
    useFrame((_state, delta) => {
        const isThisActive = active === id;
        if (portalMaterial.current) {
            const step = 2 * delta;
            // Animate blend based on if it's active
            portalMaterial.current.blend = THREE.MathUtils.damp(
                portalMaterial.current.blend,
                isThisActive ? 1 : 0,
                step,
                0.1
            );
        }
    });

    return (
        <group position={position}>
            <Text
                font="/outfit.ttf"
                fontSize={0.4}
                position={[0, 1.2, 0]}
                anchorY="bottom"
                color={isDarkTheme ? 'white' : 'black'}
            >
                {text}
            </Text>

            <RoundedBox
                args={[2.5, 3.5, 0.1]}
                radius={0.1}
                onDoubleClick={() => setActive(active === id ? null : id)}
            >
                <MeshPortalMaterial ref={portalMaterial} blend={0} resolution={512} blur={0} side={THREE.DoubleSide}>
                    <ambientLight intensity={1} />
                    <Environment preset="city" />
                    <color attach="background" args={[color]} />

                    {/* Inside the Portal - 3D Object or screenshot representing project */}
                    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                        <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="#ffffff" wireframe />
                        </mesh>
                    </Float>
                </MeshPortalMaterial>
            </RoundedBox>
        </group>
    );
};
