import { useState, useCallback, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

interface UseCipherTextOptions {
  speed?: number;
  maxIterations?: number;
  revealDelay?: number;
  triggerOnView?: boolean;
}

export function useCipherText(
  targetText: string,
  options: UseCipherTextOptions = {}
) {
  const {
    speed = 50,
    maxIterations = 15,
    revealDelay = 0,
    triggerOnView = false,
  } = options;

  const [displayText, setDisplayText] = useState(targetText);
  const [isDecoding, setIsDecoding] = useState(!triggerOnView);
  const intervalRef = useRef<number | null>(null);

  const scramble = useCallback((text: string, iteration: number) => {
    return text
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < iteration) {
          return char;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
  }, []);

  const startDecoding = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsDecoding(true);

    let iteration = 0;
    const targetLength = targetText.length;

    intervalRef.current = window.setInterval(() => {
      setDisplayText(scramble(targetText, iteration));
      iteration++;

      if (iteration >= Math.min(targetLength, maxIterations)) {
        setDisplayText(targetText);
        setIsDecoding(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);
  }, [targetText, speed, maxIterations, scramble]);

  useEffect(() => {
    if (!triggerOnView) {
      const timeout = setTimeout(() => {
        startDecoding();
      }, revealDelay);
      return () => clearTimeout(timeout);
    }
  }, [triggerOnView, revealDelay, startDecoding]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    displayText,
    isDecoding,
    startDecoding,
  };
}
