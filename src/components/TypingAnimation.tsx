import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorChar?: string;
  className?: string;
  wrapperElement?: string;
  autoStart?: boolean;
  startOnView?: boolean;
}

export function TypingAnimation({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  showCursor = true,
  cursorChar = '|',
  className = '',
  wrapperElement = 'span',
  autoStart = true,
  startOnView = false,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(autoStart && !startOnView);
  const timeoutRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const currentText = texts[textIndex];

  const type = useCallback(() => {
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setIsPaused(true);
        const nextTextIndex = (textIndex + 1) % texts.length;
        setTextIndex(nextTextIndex);
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
        }, pauseDuration);
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        timeoutRef.current = setTimeout(type, deletingSpeed);
      }
    } else {
      if (displayText.length === currentText.length) {
        setIsPaused(true);
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      } else {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        timeoutRef.current = setTimeout(type, typingSpeed);
      }
    }
  }, [
    isDeleting,
    displayText,
    currentText,
    textIndex,
    texts.length,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  useEffect(() => {
    if (!hasStarted || isPaused) return;

    timeoutRef.current = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasStarted, isPaused, type, isDeleting, deletingSpeed, typingSpeed]);

  useEffect(() => {
    if (!startOnView || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const Component = wrapperElement as any;

  return (
    <Component ref={elementRef} className={`typing-animation ${className}`}>
      <span className="typing-text">{displayText}</span>
      {showCursor && (
        <motion.span
          className="typing-cursor"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        >
          {cursorChar}
        </motion.span>
      )}
    </Component>
  );
}

// Multi-line typing effect with code-like appearance
interface CodeTypingProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  showCursor?: boolean;
  className?: string;
  language?: string;
}

export function CodeTyping({
  lines,
  typingSpeed = 50,
  lineDelay = 300,
  showCursor = true,
  className = '',
  language = 'javascript',
}: CodeTypingProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLineContent, setCurrentLineContent] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      return;
    }

    const currentLine = lines[currentLineIndex];

    if (currentLineContent.length < currentLine.length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentLineContent(currentLine.substring(0, currentLineContent.length + 1));
      }, typingSpeed);
    } else {
      setVisibleLines((prev) => [...prev, currentLine]);
      setCurrentLineContent('');
      timeoutRef.current = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, lineDelay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentLineIndex, currentLineContent, lines, typingSpeed, lineDelay]);

  return (
    <div className={`code-typing ${className}`} data-language={language}>
      <pre>
        <code>
          {visibleLines.map((line, i) => (
            <div key={i} className="code-line">
              <span className="line-number">{i + 1}</span>
              <span className="line-content">{line}</span>
            </div>
          ))}
          {currentLineContent && (
            <div className="code-line typing">
              <span className="line-number">{visibleLines.length + 1}</span>
              <span className="line-content">
                {currentLineContent}
                {showCursor && (
                  <motion.span
                    className="cursor"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </span>
            </div>
          )}
        </code>
      </pre>
    </div>
  );
}

// Terminal-style typing effect
interface TerminalTypingProps {
  commands: Array<{ command: string; output?: string }>;
  typingSpeed?: number;
  lineDelay?: number;
  className?: string;
  autoExecute?: boolean;
}

export function TerminalTyping({
  commands,
  typingSpeed = 80,
  lineDelay = 500,
  className = '',
  autoExecute = true,
}: TerminalTypingProps) {
  const [history, setHistory] = useState<Array<{ command: string; output?: string; completed: boolean }>>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoExecute) return;

    if (currentCommandIndex >= commands.length) {
      setIsComplete(true);
      return;
    }

    const currentCmd = commands[currentCommandIndex];

    if (currentInput.length < currentCmd.command.length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentInput(currentCmd.command.substring(0, currentInput.length + 1));
      }, typingSpeed);
    } else {
      timeoutRef.current = setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { command: currentCmd.command, output: currentCmd.output, completed: true },
        ]);
        setCurrentInput('');
        setCurrentCommandIndex((prev) => prev + 1);
      }, lineDelay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentCommandIndex, currentInput, commands, typingSpeed, lineDelay, autoExecute]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentInput]);

  return (
    <div ref={terminalRef} className={`terminal-typing ${className}`}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn close"></span>
          <span className="terminal-btn minimize"></span>
          <span className="terminal-btn maximize"></span>
        </div>
        <span className="terminal-title">terminal</span>
      </div>
      <div className="terminal-body">
        {history.map((item, i) => (
          <div key={i} className="terminal-entry">
            <div className="terminal-command">
              <span className="prompt">$</span> {item.command}
            </div>
            {item.output && <div className="terminal-output">{item.output}</div>}
          </div>
        ))}
        {currentInput && (
          <div className="terminal-entry">
            <div className="terminal-command">
              <span className="prompt">$</span> {currentInput}
              <motion.span
                className="cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▋
              </motion.span>
            </div>
          </div>
        )}
        {isComplete && (
          <div className="terminal-entry">
            <div className="terminal-command">
              <span className="prompt">$</span>
              <motion.span
                className="cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▋
              </motion.span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
