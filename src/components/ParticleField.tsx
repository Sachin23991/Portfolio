import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
  particleCount?: number;
  particleSize?: number;
  connectionDistance?: number;
  mouseDistance?: number;
  particleColor?: string;
  connectionColor?: string;
  speed?: number;
}

export function ParticleField({
  particleCount = 150,
  particleSize = 2,
  connectionDistance = 150,
  mouseDistance = 200,
  particleColor = '#ffb7c5',
  connectionColor = '#ffb7c5',
  speed = 0.3,
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 500;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 1000 - 200;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle material
    const material = new THREE.PointsMaterial({
      color: particleColor,
      size: particleSize,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse movement
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      const positions = particles.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Apply velocity
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Mouse attraction/repulsion
        const dx = mouseRef.current.x * 500 - positions[i3];
        const dy = mouseRef.current.y * 500 - positions[i3 + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const force = (mouseDistance - distance) / mouseDistance;
          const angle = Math.atan2(dy, dx);
          const repelForce = force * 2;

          positions[i3] -= Math.cos(angle) * repelForce;
          positions[i3 + 1] -= Math.sin(angle) * repelForce;
        }

        // Boundary wrapping
        const limit = 1000;
        if (positions[i3] > limit) positions[i3] = -limit;
        if (positions[i3] < -limit) positions[i3] = limit;
        if (positions[i3 + 1] > limit) positions[i3 + 1] = -limit;
        if (positions[i3 + 1] < -limit) positions[i3 + 1] = limit;
        if (positions[i3 + 2] > 500) positions[i3 + 2] = -500;
        if (positions[i3 + 2] < -500) positions[i3 + 2] = 500;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Gentle rotation
      particles.rotation.z = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      geometry.dispose();
      material.dispose();
    };
  }, [particleCount, particleSize, connectionDistance, mouseDistance, particleColor, connectionColor, speed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}
