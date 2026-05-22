'use client';
import { useRef, useState, useCallback, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  glareOpacity = 0.15,
  scale = 1.02,
  style,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * maxTilt;
        const rotateX = -((y - centerY) / centerY) * maxTilt;

        setTransform(
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`
        );

        // Glare
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlareStyle({
          opacity: glareOpacity,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,200,255,0.35), transparent 60%)`,
        });
      });
    },
    [maxTilt, glareOpacity, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setGlareStyle({ opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper tilt-card-base ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        ...style,
      }}
    >
      {children}
      <div
        className="tilt-glare"
        style={{
          ...glareStyle,
        }}
      />
    </div>
  );
}
