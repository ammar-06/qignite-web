'use client';
import { motion } from 'framer-motion';

const letters = ['Q', 'i', 'g', 'n', 'i', 't', 'e'];

const containerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letterVariants: any = {
  hidden: {
    opacity: 0,
    y: 80,
    rotateX: -90,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 14,
      stiffness: 120,
    },
  },
};

const taglineVariants: any = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: 0.7 },
  },
};

const glowVariants: any = {
  animate: {
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

const floatingVariants: any = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    rotateX: [0, 15, -5, 0],
    rotateY: [0, -15, 10, 0],
    rotateZ: [0, 4, -2, 0],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.15, // Staggers the continuous floating wave
    },
  }),
  hover: {
    scale: 1.2,
    rotateX: 25,
    rotateY: 20,
    y: -15,
    transition: { type: 'spring', stiffness: 400, damping: 12 },
  },
};

export default function QigniteHero() {
  return (
    <div className="qignite-hero-wrap">
      {/* Animated glow behind the text */}
      <motion.div
        variants={glowVariants}
        animate="animate"
        style={{
          position: 'absolute',
          inset: '-40px -60px',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,200,255,0.18), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateZ(-100px)',
        }}
      />

      {/* Letter-by-letter "Qignite" */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          gap: '0.02em',
          position: 'relative',
          zIndex: 1,
          transformStyle: 'preserve-3d',
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            style={{
              display: 'inline-block',
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.span
              custom={i}
              variants={floatingVariants}
              animate="animate"
              whileHover="hover"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 13vw, 11rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                background:
                  i === 0
                    ? 'linear-gradient(135deg, #ffffff 0%, #00c8ff 100%)'
                    : i < 3
                    ? `linear-gradient(135deg, hsl(${195 + i * 15}, 100%, ${70 - i * 3}%) 0%, hsl(${210 + i * 10}, 100%, 55%) 100%)`
                    : `linear-gradient(135deg, hsl(${220 + (i - 3) * 10}, 100%, 60%) 0%, hsl(${240 + (i - 3) * 8}, 100%, 50%) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transformOrigin: 'center center',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              {letter}
            </motion.span>
          </motion.span>
        ))}
      </motion.div>

      {/* Tagline beneath */}
      <motion.p
        variants={taglineVariants}
        initial="hidden"
        animate="visible"
        style={{
          fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--clr-accent)',
          fontWeight: 500,
          marginTop: '0.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
      </motion.p>
    </div>
  );
}