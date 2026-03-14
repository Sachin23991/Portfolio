import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticTitleProps {
  text: string;
  className?: string;
  effect?: 'split' | 'wave' | 'blur' | 'gradient' | 'skew';
  animateOnScroll?: boolean;
  mouseParallax?: boolean;
}

export function KineticTitle({
  text,
  className = '',
  effect = 'split',
  animateOnScroll = true,
  mouseParallax = true,
}: KineticTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const words = text.split(' ');
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);

  // Mouse parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!mouseParallax || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseParallax, mouseX, mouseY]);

  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.kinetic-letter');

    gsap.fromTo(
      letters,
      {
        opacity: 0,
        y: 80,
        rotateX: -45,
        filter: 'blur(8px)'
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          once: true,
        },
      }
    );
  }, [animateOnScroll]);

  const renderLetters = (word: string, wordIndex: number) => {
    return word.split('').map((char, charIndex) => {
      const letterIndex = wordIndex * (Math.max(...words.map(w => w.length)) + 1) + charIndex;

      if (char === ' ') {
        return <span key={charIndex}>&nbsp;</span>;
      }

      return (
        <motion.span
          key={charIndex}
          className="kinetic-letter"
          style={{
            display: 'inline-block',
            position: 'relative',
            x: mouseParallax ? parallaxX : 0,
            y: mouseParallax ? parallaxY : 0,
          }}
          onMouseEnter={() => setHoveredWord(letterIndex)}
          onMouseLeave={() => setHoveredWord(null)}
          animate={{
            scale: hoveredWord === letterIndex ? 1.3 : 1,
            color: hoveredWord === letterIndex ? '#ffb7c5' : undefined,
            textShadow: hoveredWord === letterIndex ? '0 0 20px rgba(255, 183, 197, 0.5)' : undefined,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {char}
        </motion.span>
      );
    });
  };

  const effects = {
    split: (
      <span className="kinetic-split">
        {words.map((word, i) => (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.3em' }}>
            {renderLetters(word, i)}
          </span>
        ))}
      </span>
    ),
    wave: (
      <span className="kinetic-wave">
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ),
    blur: (
      <span className="kinetic-blur">
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            initial={{ filter: 'blur(10px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ),
    gradient: (
      <span className="kinetic-gradient">
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.3em',
              background: `linear-gradient(90deg, #ffb7c5 ${i * 20}%, #ffc8d3 ${i * 20 + 50}%, #ff9eb5 ${i * 20 + 100}%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ),
    skew: (
      <span className="kinetic-skew">
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            whileHover={{ skewX: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ),
  };

  return (
    <motion.h2
      ref={containerRef}
      className={`kinetic-title ${className}`}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
      }}
    >
      {effects[effect]}
    </motion.h2>
  );
}

// Animated counter component with ticker effect
interface TickerCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  startOnView?: boolean;
}

export function TickerCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  decimals = 0,
  startOnView = true,
}: TickerCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(value * eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

// Text scramble effect on hover
interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  revealDelay?: number;
}

export function ScrambleText({
  text,
  className = '',
  speed = 50,
  revealDelay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = (finalText: string, iteration: number) => {
    return finalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < iteration) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
  };

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    intervalRef.current = window.setInterval(() => {
      setDisplayText(scramble(text, iteration));
      iteration++;

      if (iteration >= text.length) {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      startScramble();
    }, revealDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, revealDelay]);

  return (
    <span
      className={className}
      onMouseEnter={() => {
        startScramble();
      }}
      onMouseLeave={() => {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }}
    >
      {displayText}
    </span>
  );
}
