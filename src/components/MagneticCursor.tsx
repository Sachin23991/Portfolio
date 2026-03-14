import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagneticCursorProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  range?: number;
}

export function MagneticCursor({
  children,
  className = '',
  strength = 0.5,
  range = 100,
}: MagneticCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 250, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < range) {
        const force = (range - distance) / range;
        const moveX = deltaX * force * strength;
        const moveY = deltaY * force * strength;

        x.set(moveX);
        y.set(moveY);
        setIsHovered(true);
      } else {
        x.set(0);
        y.set(0);
        setIsHovered(false);
      }
    },
    [range, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`magnetic-cursor ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        scale: isHovered ? 1.1 : 1,
        cursor: 'pointer',
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// Custom cursor with trail effect
interface CustomCursorProps {
  hidden?: boolean;
  cursorSize?: number;
  trailLength?: number;
  cursorColor?: string;
  blendMode?: string;
}

export function CustomCursor({
  hidden = false,
  cursorSize = 20,
  trailLength = 8,
  cursorColor = '#ffb7c5',
  blendMode = 'difference',
}: CustomCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const trailPositions = useRef<Array<{ x: number; y: number }>>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hidden) return;

    const updateCursorPosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add position to trail
      trailPositions.current.push({ x: e.clientX, y: e.clientY });
      if (trailPositions.current.length > trailLength) {
        trailPositions.current.shift();
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursorPosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [hidden, trailLength]);

  if (hidden) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: cursorSize,
          height: cursorSize,
          borderRadius: '50%',
          background: cursorColor,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: blendMode as any,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />

      {/* Cursor outer ring */}
      <motion.div
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: cursorSize * 2,
          height: cursorSize * 2,
          borderRadius: '50%',
          border: `2px solid ${cursorColor}`,
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 0.8 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          mass: 0.3,
        }}
      />

      {/* Trail effect */}
      {trailPositions.current.map((pos, index) => (
        <motion.div
          key={index}
          className="custom-cursor-trail"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: cursorSize * (0.3 + (index / trailLength) * 0.7),
            height: cursorSize * (0.3 + (index / trailLength) * 0.7),
            borderRadius: '50%',
            background: cursorColor,
            pointerEvents: 'none',
            zIndex: 9997 - index,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: pos.x,
            y: pos.y,
            opacity: (index / trailLength) * 0.5,
            scale: index / trailLength,
          }}
          transition={{
            duration: 0.1,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

// Spotlight effect that follows cursor
interface SpotlightProps {
  className?: string;
  radius?: number;
  color?: string;
  opacity?: number;
  blendMode?: string;
}

export function Spotlight({
  className = '',
  radius = 300,
  color = '#ffb7c5',
  opacity = 0.15,
  blendMode = 'overlay',
}: SpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <motion.div
      className={`spotlight ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
        background: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}, transparent)`,
        opacity,
        mixBlendMode: blendMode as any,
      }}
      animate={{
        scale: isMoving ? 1.05 : 1,
      }}
      transition={{
        duration: 0.3,
      }}
    />
  );
}

// Attraction zone - pulls elements toward cursor
interface AttractionZoneProps {
  children: React.ReactNode;
  className?: string;
  range?: number;
  strength?: number;
  reverse?: boolean;
}

export function AttractionZone({
  children,
  className = '',
  range = 200,
  strength = 30,
  reverse = false,
}: AttractionZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      setIsNear(distance < range);

      if (distance < range) {
        setMousePosition({
          x: (deltaX / range) * strength * (reverse ? -1 : 1),
          y: (deltaY / range) * strength * (reverse ? -1 : 1),
        });
      } else {
        setMousePosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [range, strength, reverse]);

  return (
    <motion.div
      ref={ref}
      className={`attraction-zone ${className}`}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isNear ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  );
}
