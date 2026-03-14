import { useEffect, useRef } from 'react';
import { useCipherText } from '../hooks/useCipherText';

interface CipherTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  speed?: number;
  maxIterations?: number;
  revealDelay?: number;
  triggerOnView?: boolean;
}

export function CipherText({
  text,
  className = '',
  as: Component = 'span',
  speed = 50,
  maxIterations = 15,
  revealDelay = 0,
  triggerOnView = false,
}: CipherTextProps) {
  const { displayText, isDecoding, startDecoding } = useCipherText(text, {
    speed,
    maxIterations,
    revealDelay,
    triggerOnView,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!triggerOnView || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isDecoding) {
          startDecoding();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [triggerOnView, isDecoding, startDecoding]);

  const ComponentEl = Component as any;

  return (
    <ComponentEl
      ref={elementRef}
      className={`${className} ${isDecoding ? 'cipher-decoding' : ''}`}
    >
      {displayText}
    </ComponentEl>
  );
}
