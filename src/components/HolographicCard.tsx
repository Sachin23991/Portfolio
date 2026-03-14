import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  glowColor?: string;
  borderRadius?: string;
  scaleOnHover?: boolean;
}

export function HolographicCard({
  children,
  className = '',
  intensity = 'medium',
  glowColor = '#ffb7c5',
  borderRadius = '16px',
  scaleOnHover = true,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const intensityValues = {
    low: { opacity: 0.3, blur: 20 },
    medium: { opacity: 0.5, blur: 30 },
    high: { opacity: 0.7, blur: 40 },
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const shearX = useTransform(rotateX, (val) => `${val * 0.1}deg`);
  const shearY = useTransform(rotateY, (val) => `${val * 0.1}deg`);

  const glowOpacity = useTransform(
    mouseY,
    [-0.5, -0.25, 0, 0.25, 0.5],
    [0.2, 0.4, 0.6, 0.4, 0.2]
  );

  const glowX = useTransform(mouseX, (val) => `${50 + val * 100}%`);
  const glowY = useTransform(mouseY, (val) => `${50 + val * 100}%`);

  return (
    <motion.div
      ref={cardRef}
      className={`holographic-card ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        borderRadius,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovering && scaleOnHover ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {/* Holographic gradient overlay */}
      <motion.div
        className="holographic-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: `
            radial-gradient(
              circle at ${glowX} ${glowY},
              ${glowColor}33 0%,
              transparent 50%
            )
          `,
          opacity: isHovering ? glowOpacity : 0,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Iridescent sheen */}
      <motion.div
        className="holographic-sheen"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: `
            linear-gradient(
              ${useTransform(mouseX, (val) => 45 + val * 30)}deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 100%
            )
          `,
          opacity: isHovering ? 0.5 : 0,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Rainbow edge effect */}
      <motion.div
        className="holographic-edge"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius,
          background: isHovering
            ? `conic-gradient(from ${useTransform(mouseX, (val) => 180 + val * 180)}deg, 
                #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, 
                #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)`
            : 'transparent',
          filter: `blur(${intensityValues[intensity].blur}px)`,
          opacity: isHovering ? intensityValues[intensity].opacity : 0,
          zIndex: 1,
        }}
      />

      {/* Card content */}
      <motion.div
        className="holographic-content"
        style={{
          position: 'relative',
          zIndex: 4,
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${rotateX}) 
            rotateY(${rotateY}) 
            skew(${shearX}, ${shearY})
          `,
        }}
      >
        {children}
      </motion.div>

      {/* Reflection layer */}
      <motion.div
        className="holographic-reflection"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: `
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0) 100%
            )
          `,
          opacity: isHovering ? 0.3 : 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </motion.div>
  );
}

// Glass morphism card with dynamic lighting
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  borderOpacity?: number;
  backgroundOpacity?: number;
}

export function GlassCard({
  children,
  className = '',
  blur = 20,
  borderOpacity = 0.2,
  backgroundOpacity = 0.1,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const gradientX = useTransform(mouseX, (val) => `${val * 100}%`);
  const gradientY = useTransform(mouseY, (val) => `${val * 100}%`);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic light follow effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(
              circle at ${gradientX} ${gradientY},
              rgba(255, 255, 255, 0.15) 0%,
              transparent 40%
            )
          `,
          pointerEvents: 'none',
        }}
      />
      {children}
    </motion.div>
  );
}

// 3D floating card with shadow
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  floatIntensity?: 'low' | 'medium' | 'high';
  rotationIntensity?: 'low' | 'medium' | 'high';
}

export function FloatingCard({
  children,
  className = '',
  floatIntensity = 'medium',
  rotationIntensity = 'medium',
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const floatValues = {
    low: { y: 5, duration: 3 },
    medium: { y: 15, duration: 4 },
    high: { y: 25, duration: 5 },
  };

  const rotationValues = {
    low: { max: 3 },
    medium: { max: 6 },
    high: { max: 10 },
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const rotateX = mousePos.y * -rotationValues[rotationIntensity].max;
  const rotateY = mousePos.x * rotationValues[rotationIntensity].max;

  return (
    <motion.div
      ref={cardRef}
      className={`floating-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      animate={{
        y: [-floatValues[floatIntensity].y, floatValues[floatIntensity].y, -floatValues[floatIntensity].y],
      }}
      transition={{
        duration: floatValues[floatIntensity].duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.3s ease',
        }}
      >
        {children}
      </motion.div>

      {/* Dynamic shadow */}
      <motion.div
        className="floating-shadow"
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '20px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          filter: 'blur(10px)',
          zIndex: -1,
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: floatValues[floatIntensity].duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
