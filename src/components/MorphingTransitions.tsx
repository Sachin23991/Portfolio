import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MorphingTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wave';
  duration?: number;
  threshold?: number;
}

export function MorphingTransition({
  children,
  className = '',
  transitionType = 'fade',
  duration = 1,
  threshold = 0.1,
}: MorphingTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration } },
    },
    slide: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0, transition: { duration } },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration } },
    },
    dissolve: {
      hidden: { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
      visible: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration } },
    },
    wave: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { opacity: 1, rotate: 0, transition: { duration } },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`morphing-transition ${className}`}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants[transitionType]}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  layers?: number;
  speed?: number;
}

export function ParallaxSection({
  children,
  className = '',
  layers = 3,
  speed = 0.5,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = 1 - rect.top / window.innerHeight;
      setOffset(scrollProgress * speed * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`parallax-section ${className}`} style={{ overflow: 'hidden' }}>
      {Array.from({ length: layers }).map((_, i) => (
        <motion.div
          key={i}
          className="parallax-layer"
          style={{
            y: offset * (i + 1) * 0.3,
            opacity: 1 - i * 0.2,
            filter: `blur(${i * 2}px)`,
          }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}

interface WaveTransitionProps {
  isAnimating: boolean;
  color?: string;
  duration?: number;
  waveCount?: number;
}

export function WaveTransition({
  isAnimating,
  color = '#ffb7c5',
  duration = 1,
  waveCount = 5,
}: WaveTransitionProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9998,
        pointerEvents: 'none',
        display: 'flex',
      }}
    >
      <AnimatePresence>
        {isAnimating &&
          Array.from({ length: waveCount }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                flex: 1,
                height: '100%',
                background: color,
                transformOrigin: 'bottom',
              }}
              initial={{ scaleY: 0, rotate: (i - waveCount / 2) * 5 }}
              animate={{ scaleY: 1, rotate: 0 }}
              exit={{ scaleY: 0 }}
              transition={{
                duration,
                delay: i * 0.1,
                ease: [0.87, 0, 0.13, 1],
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

interface GradientFlowProps {
  isTransitioning: boolean;
  colors?: string[];
  duration?: number;
}

export function GradientFlow({
  isTransitioning,
  colors = ['#ffb7c5', '#ffc8d3', '#ff9eb5', '#f5d0a9'],
  duration = 1.5,
}: GradientFlowProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9997,
            pointerEvents: 'none',
            background: `linear-gradient(45deg, ${colors?.join(', ')})`,
            backgroundSize: '400% 400%',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.8,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration,
            backgroundPosition: {
              duration: duration * 2,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      )}
    </AnimatePresence>
  );
}

export function useSectionVisibility(options: {
  threshold?: number;
  rootMargin?: string;
  onEnter?: () => void;
  onLeave?: () => void;
} = {}) {
  const {
    threshold = 0.1,
    rootMargin = '-100px',
    onEnter,
    onLeave,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible) {
          onEnter?.();
        } else {
          onLeave?.();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, onEnter, onLeave]);

  return { ref, isVisible };
}

export function useScrollMorph(options: {
  startOffset?: string;
  endOffset?: string;
  fromValues?: Record<string, any>;
  toValues?: Record<string, any>;
} = {}) {
  const {
    startOffset = 'top center',
    endOffset = 'bottom center',
    fromValues = { opacity: 0, y: 100, scale: 0.9 },
    toValues = { opacity: 1, y: 0, scale: 1 },
  } = options;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: startOffset,
        end: endOffset,
        scrub: true,
      },
    });

    tl.fromTo(element, fromValues, toValues);

    return () => {
      tl.kill();
    };
  }, [startOffset, endOffset, fromValues, toValues]);

  return ref;
}
