import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PortfolioScene } from './Scene';

export default function Scene3D() {
    return (
        <div className="scene3d-container" style={{ pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 2.5, 14], fov: 60 }}
                gl={{
                    antialias: false,
                    powerPreference: 'high-performance',
                    alpha: false,
                }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
            >
                <Suspense fallback={null}>
                    <PortfolioScene />
                </Suspense>
            </Canvas>
        </div>
    );
}
