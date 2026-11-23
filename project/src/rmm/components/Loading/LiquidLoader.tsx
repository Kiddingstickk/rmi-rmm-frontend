
import React, { useEffect, useRef } from 'react';
import './LiquidLoader.css';

interface LiquidLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const SEGMENTS = 96;
const TRANSITION_MS = 1300;
const CENTER = 100;

const smoothStep = (value: number) => {
  return value * value * (3 - 2 * value);
};

// Each shape is described by a continuous radial curve.
const getRadius = (shape: number, angle: number): number => {
  switch (shape) {
    // Original circle
    case 0:
      return 76;

    // Organic, curved ninja star
    case 1:
      return 55 + 27 * Math.pow(
        (1 + Math.cos(8 * angle)) / 2,
        2.2
      );

    // Rounded three-sided shape
    case 2:
      return 68 + 12 * Math.cos(3 * angle - 0.4);

    // Five curved sides
    case 3:
      return 70 + 9 * Math.cos(5 * angle + 0.3);

    // Eight curved sides
    case 4:
      return 72 + 7 * Math.cos(8 * angle - 0.2);

    // Asymmetric F1-track-inspired outline
    case 5:
      return (
        70 +
        9 * Math.cos(2 * angle - 0.5) +
        6 * Math.sin(3 * angle + 0.8) +
        5 * Math.cos(5 * angle - 1.1) +
        3 * Math.sin(angle - 0.6)
      );

    default:
      return 76;
  }
};

// Creates a smooth closed curve from evenly spaced points.
const createPath = (
  currentShape: number,
  nextShape: number,
  progress: number
): string => {
  const points: { x: number; y: number }[] = [];

  const easedProgress = smoothStep(progress);

  for (let i = 0; i < SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2;

    const radiusA = getRadius(currentShape, angle);
    const radiusB = getRadius(nextShape, angle);

    const radius =
      radiusA + (radiusB - radiusA) * easedProgress;

    points.push({
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
    });
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < SEGMENTS; i++) {
    const previous = points[(i - 1 + SEGMENTS) % SEGMENTS];
    const current = points[i];
    const next = points[(i + 1) % SEGMENTS];
    const afterNext = points[(i + 2) % SEGMENTS];

    const cp1 = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };

    const cp2 = {
      x: next.x - (afterNext.x - current.x) / 6,
      y: next.y - (afterNext.y - current.y) / 6,
    };

    path +=
      ` C ${cp1.x} ${cp1.y}` +
      ` ${cp2.x} ${cp2.y}` +
      ` ${next.x} ${next.y}`;
  }

  return path + ' Z';
};

const LiquidLoader: React.FC<LiquidLoaderProps> = ({
  message = 'Something good is loading.',
  fullScreen = false,
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;

      const totalShapes = 6;
      const currentStep = Math.floor(elapsed / TRANSITION_MS);

      const currentShape = currentStep % totalShapes;
      const nextShape = (currentShape + 1) % totalShapes;

      const progress =
        (elapsed % TRANSITION_MS) / TRANSITION_MS;

      if (pathRef.current) {
        pathRef.current.setAttribute(
          'd',
          createPath(currentShape, nextShape, progress)
        );
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      className={`liquid-loader ${fullScreen ? 'liquid-loader-fullscreen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="liquid-loader-stage">
        <svg
          viewBox="0 0 200 200"
          className="liquid-loader-svg"
        >
          <path
            ref={pathRef}
            d={createPath(0, 1, 0)}
            fill="#213A6B"
          />

          <text
            x="100"
            y="108"
            textAnchor="middle"
            dominantBaseline="middle"
            className="liquid-loader-inner-text"
          >
            RMM
          </text>
        </svg>
      </div>

      <p className="liquid-loader-message">{message}</p>
      <span className="liquid-loader-caption">PLEASE WAIT</span>
    </div>
  );
};

export default LiquidLoader;
