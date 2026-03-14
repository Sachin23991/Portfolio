import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollytellingRevealProps {
  children: React.ReactNode;
  className?: string;
  revealType?: 'fade' | 'slide' | 'scale' | 'blur' | 'rotate';
  stagger?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function ScrollytellingReveal({
  children,
  className = '',
  revealType = 'fade',
  stagger = 0.1,
  rootMargin = '-100px',
  once = true,
}: ScrollytellingRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('[data-reveal]');
    if (elements.length === 0) return;

    elements.forEach((el) => {
      switch (revealType) {
        case 'slide':
          gsap.set(el, { opacity: 0, y: 60 });
          break;
        case 'scale':
          gsap.set(el, { opacity: 0, scale: 0.8 });
          break;
        case 'blur':
          gsap.set(el, { opacity: 0, filter: 'blur(10px)' });
          break;
        case 'rotate':
          gsap.set(el, { opacity: 0, rotation: -10, y: 40 });
          break;
        default:
          gsap.set(el, { opacity: 0, y: 40 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: `top ${rootMargin}`,
        end: 'bottom 80%',
        toggleActions: 'play none none reverse',
        scrub: false,
        once,
      },
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      rotation: 0,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [revealType, stagger, rootMargin, once]);

  return (
    <div ref={containerRef} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => {
          if (typeof child === 'string' || typeof child === 'number') {
            return (
              <span key={index} data-reveal>
                {child}
              </span>
            );
          }
          return (
            <div key={index} data-reveal>
              {child}
            </div>
          );
        })
        : children}
    </div>
  );
}

export function useScrollReveal(options: {
  triggerOffset?: string;
  animationType?: 'fade' | 'slide' | 'slideUp' | 'slideDown' | 'scale' | 'blur' | 'rotate' | 'zoom';
  duration?: number;
  once?: boolean;
} = {}) {
  const {
    triggerOffset = '-100px',
    animationType = 'fade',
    duration = 0.8,
    once = true,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const fromValues: Record<string, any> = {
      fade: { opacity: 0, y: 40 },
      slide: { opacity: 0, x: -60 },
      slideUp: { opacity: 0, y: 80 },
      slideDown: { opacity: 0, y: -80 },
      scale: { opacity: 0, scale: 0.8 },
      blur: { opacity: 0, filter: 'blur(10px)' },
      rotate: { opacity: 0, rotation: -15 },
      zoom: { opacity: 0, scale: 1.2 },
    };

    gsap.fromTo(
      element,
      fromValues[animationType] || fromValues.fade,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        rotation: 0,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: `top ${triggerOffset}`,
          toggleActions: 'play none none reverse',
          once,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [triggerOffset, animationType, duration, once]);

  return elementRef;
}
