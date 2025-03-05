import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Animation for explosions
const explode = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1);
  }
  25% {
    transform: scale(1.5) rotate(90deg);
    opacity: 0.9;
    filter: brightness(1.5);
  }
  50% {
    transform: scale(0.8) rotate(180deg);
    opacity: 0.8;
    filter: brightness(2);
  }
  75% {
    transform: scale(1.2) rotate(270deg);
    opacity: 0.7;
    filter: brightness(1.5);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
    filter: brightness(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) translateX(2px) rotate(5deg);
  }
`;

const particleWave = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 0.3;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const blastWave = keyframes`
  0% {
    transform: scale(0.2);
    opacity: 0.8;
    border-width: 8px;
  }
  50% {
    opacity: 0.5;
    border-width: 4px;
  }
  100% {
    transform: scale(4);
    opacity: 0;
    border-width: 1px;
  }
`;

const CellContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  overflow: visible;
  transform-style: preserve-3d;
  box-shadow: 
    inset 0 2px 5px rgba(255, 255, 255, 0.1),
    inset 0 -2px 5px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: ${(props) => (props.isValid ? '#444' : '#333')};
  }
  
  ${props => props.isExploding && css`
    animation: ${explode} 0.5s ease-in-out;
  `}
`;

const OrbsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
  perspective: 1200px;
  transform-style: preserve-3d;
`;

const getOrbColor = (props) => {
  if (props.playerColors && props.owner > 0) {
    return props.playerColors[props.owner];
  }
  return props.owner === 1 ? '#ff5252' : props.owner === 2 ? '#4285f4' : '#ffffff';
};

const ParticleCore = styled.div`
  width: ${(props) => (props.count >= 3 ? '30%' : '40%')};
  height: ${(props) => (props.count >= 3 ? '30%' : '40%')};
  position: relative;
  animation: ${float} 3s ease-in-out infinite;
  transform-style: preserve-3d;
  will-change: transform;
  
  @media (max-width: 600px) {
    width: ${(props) => (props.count >= 3 ? '25%' : '35%')};
    height: ${(props) => (props.count >= 3 ? '25%' : '35%')};
  }
`;

const getPattern = (index) => {
  const patterns = [
    // Flower of Life
    `repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 60deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from 30deg at 43% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 60deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from -30deg at 57% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 60deg,
      transparent 60deg
    ),
    radial-gradient(
      circle at 50% 50%,
      transparent 30%,
      rgba(255, 255, 255, 0.03) 32%,
      transparent 34%
    )`,
    // Sri Yantra
    `repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 40deg,
      transparent 80deg
    ),
    repeating-conic-gradient(
      from 60deg at 45% 45%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 40deg,
      transparent 80deg
    ),
    repeating-conic-gradient(
      from -60deg at 55% 55%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 40deg,
      transparent 80deg
    ),
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 5px,
      rgba(255, 255, 255, 0.02) 5px,
      rgba(255, 255, 255, 0.02) 10px
    )`,
    // Seed of Life
    `radial-gradient(
      circle at 50% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.03) 27%,
      transparent 29%
    ),
    radial-gradient(
      circle at 35% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.02) 27%,
      transparent 29%
    ),
    radial-gradient(
      circle at 65% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.02) 27%,
      transparent 29%
    ),
    radial-gradient(
      circle at 50% 35%,
      transparent 25%,
      rgba(255, 255, 255, 0.02) 27%,
      transparent 29%
    ),
    radial-gradient(
      circle at 50% 65%,
      transparent 25%,
      rgba(255, 255, 255, 0.02) 27%,
      transparent 29%
    )`,
    // Merkaba
    `repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 60deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from 30deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 60deg,
      transparent 60deg
    ),
    repeating-linear-gradient(
      60deg,
      transparent 0px,
      transparent 10px,
      rgba(255, 255, 255, 0.02) 10px,
      rgba(255, 255, 255, 0.02) 20px
    ),
    repeating-linear-gradient(
      -60deg,
      transparent 0px,
      transparent 10px,
      rgba(255, 255, 255, 0.02) 10px,
      rgba(255, 255, 255, 0.02) 20px
    )`,
    // Tree of Life
    `radial-gradient(
      circle at 50% 30%,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 35% 45%,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 65% 45%,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 20%
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 15px,
      rgba(255, 255, 255, 0.02) 15px,
      rgba(255, 255, 255, 0.02) 30px
    )`,
    // Vesica Piscis
    `radial-gradient(
      ellipse at 35% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.03) 26%,
      transparent 27%
    ),
    radial-gradient(
      ellipse at 65% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.03) 26%,
      transparent 27%
    ),
    conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 180deg,
      transparent 180deg
    )`,
    // Torus Knot
    `repeating-conic-gradient(
      from 0deg at 45% 45%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 30deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from 0deg at 55% 55%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 30deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 45deg,
      transparent 90deg
    )`,
    // Golden Ratio Spiral
    `conic-gradient(
      from 0deg at 61.8% 61.8%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 144deg,
      transparent 144deg
    ),
    conic-gradient(
      from 144deg at 38.2% 38.2%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 144deg,
      transparent 144deg
    ),
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0px,
      transparent 8px,
      rgba(255, 255, 255, 0.02) 8px,
      rgba(255, 255, 255, 0.02) 16px
    )`,
    // Platonic Solids
    `repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.03) 72deg,
      transparent 72deg
    ),
    repeating-conic-gradient(
      from 36deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 72deg,
      transparent 72deg
    ),
    repeating-conic-gradient(
      from -36deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 72deg,
      transparent 72deg
    )`,
    // Metatron's Cube Enhanced
    `radial-gradient(
      circle at 50% 50%,
      transparent 25%,
      rgba(255, 255, 255, 0.03) 26%,
      transparent 27%,
      transparent 32%,
      rgba(255, 255, 255, 0.02) 33%,
      transparent 34%
    ),
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 60deg,
      transparent 60deg
    ),
    repeating-conic-gradient(
      from 30deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, 0.02) 60deg,
      transparent 60deg
    )`
  ];
  return patterns[index % patterns.length];
};

const ParticleInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background: ${props => getOrbColor(props)};
  opacity: 0.9;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  box-shadow:
    inset 0 2px 5px rgba(255, 255, 255, 0.3),
    inset 0 -2px 5px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    background: ${props => getPattern(props.patternIndex)};
    animation: ${rotate} ${props => 8 + props.patternIndex}s linear infinite;
    transform-origin: center;
    transform: translateZ(2px);
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: ${props => {
      const highlights = [
        'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
        'conic-gradient(from 45deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
        'radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)',
        'conic-gradient(from 0deg at 40% 40%, transparent 0%, rgba(255, 255, 255, 0.2) 25%, transparent 50%)'
      ];
      return highlights[props.patternIndex % highlights.length];
    }};
    animation: ${rotate} ${props => 12 - props.patternIndex}s linear infinite reverse;
    transform: translateZ(4px);
    will-change: transform;
  }
`;

const ParticlePattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: ${props => {
    const overlays = [
      'repeating-conic-gradient(from 0deg, transparent 0deg, transparent 30deg, rgba(255, 255, 255, 0.05) 30deg, rgba(255, 255, 255, 0.05) 60deg)',
      'repeating-conic-gradient(from 45deg, transparent 0deg, transparent 45deg, rgba(255, 255, 255, 0.03) 45deg, rgba(255, 255, 255, 0.03) 90deg)',
      'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.05) 25%, transparent 50%, rgba(255, 255, 255, 0.05) 75%)',
      'radial-gradient(circle at 70% 70%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)',
      'repeating-linear-gradient(30deg, transparent 0px, transparent 15px, rgba(255, 255, 255, 0.02) 15px, rgba(255, 255, 255, 0.02) 30px)',
      'conic-gradient(from 90deg, rgba(255, 255, 255, 0.03) 0%, transparent 25%, rgba(255, 255, 255, 0.03) 50%, transparent 75%)',
      'repeating-radial-gradient(circle at center, transparent 0px, transparent 10px, rgba(255, 255, 255, 0.02) 10px, rgba(255, 255, 255, 0.02) 20px)',
      'linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.03) 75%)',
      'repeating-linear-gradient(60deg, transparent 0px, transparent 12px, rgba(255, 255, 255, 0.02) 12px, rgba(255, 255, 255, 0.02) 24px)',
      'conic-gradient(from 120deg, rgba(255, 255, 255, 0.04) 0%, transparent 33%, rgba(255, 255, 255, 0.04) 66%)',
      'repeating-radial-gradient(circle at 60% 40%, transparent 0px, transparent 8px, rgba(255, 255, 255, 0.03) 8px, rgba(255, 255, 255, 0.03) 16px)',
      'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.02) 75%)'
    ];
    return overlays[props.patternIndex % overlays.length];
  }};
  animation: ${rotate} ${props => 15 + props.patternIndex * 3}s linear infinite ${props => props.patternIndex % 2 === 0 ? '' : 'reverse'};
`;

const ParticleWave = styled.div`
  width: 140%;
  height: 140%;
  position: absolute;
  top: -20%;
  left: -20%;
  border-radius: 50%;
  background: ${(props) => {
    const color = getOrbColor(props);
    return `radial-gradient(circle at center, ${color}22, transparent)`;
  }};
  animation: ${particleWave} ${props => 3 + props.offset}s ease-in-out infinite;
`;

const BlastRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${props => props.ringIndex === 0 ? '8px' : '4px'} solid ${props => getOrbColor(props)};
  opacity: 0;
  pointer-events: none;
  animation: ${blastWave} ${props => 0.5 + props.ringIndex * 0.1}s ease-out;
  animation-play-state: ${props => props.isExploding ? 'running' : 'paused'};
  animation-delay: ${props => props.ringIndex * 0.1}s;
`;

const createBlastParticleAnimation = (angle, distance) => css`
  0% {
    transform: rotate(${angle}deg) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(${angle}deg) translateX(${distance}px) scale(0);
    opacity: 0;
  }
`;

const BlastParticle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${props => getOrbColor(props)};
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transform-origin: center;
  animation: ${props => keyframes`${props.animationCss}`} 0.7s ease-out;
  animation-play-state: ${props => props.isExploding ? 'running' : 'paused'};
`;

// Color adjustment utility function
const adjustColor = (color, amount) => {
  const clamp = (val) => Math.min(Math.max(val, 0), 255);
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const [r, g, b, a] = color.match(/\d+/g).map(Number);
    return `rgba(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)}, ${a || 1})`;
  }
  
  return color;
};

const Cell = ({ row, col, cell, onClick, currentPlayer, isAnimating, playerColors }) => {
  const [isExploding, setIsExploding] = useState(false);
  const [blastParticles, setBlastParticles] = useState([]);
  
  // Memoize cell validity
  const isValid = React.useMemo(() => 
    cell.owner === 0 || cell.owner === currentPlayer,
    [cell.owner, currentPlayer]
  );
  
  // Memoize explosion handler
  const handleExplosion = React.useCallback(() => {
    if (cell.count > 0 && isAnimating) {
      setIsExploding(true);
      
      const particles = [];
      const particleCount = 8; // Further reduced for performance
      const baseAngle = 360 / particleCount;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = baseAngle * i;
        const distance = 75; // Fixed distance for consistent performance
        particles.push({ 
          angle, 
          animationCss: createBlastParticleAnimation(angle, distance),
          delay: i * 0.02 // Consistent delays
        });
      }
      
      setBlastParticles(particles);
      
      const timer = setTimeout(() => {
        setIsExploding(false);
        setBlastParticles([]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cell.count, isAnimating]);

  useEffect(() => {
    handleExplosion();
  }, [handleExplosion]);

  // Memoize blast effects
  const blastEffects = React.useMemo(() => {
    if (!isExploding) return null;
    
    return (
      <>
        {[0, 1, 2].map((index) => (
          <BlastRing 
            key={`ring-${index}`}
            isExploding={isExploding}
            owner={cell.owner}
            playerColors={playerColors}
            ringIndex={index}
          />
        ))}
        {blastParticles.map((particle, index) => (
          <BlastParticle
            key={`particle-${index}`}
            isExploding={isExploding}
            owner={cell.owner}
            playerColors={playerColors}
            animationCss={particle.animationCss}
            style={{ animationDelay: `${particle.delay}s` }}
          />
        ))}
      </>
    );
  }, [isExploding, cell.owner, playerColors, blastParticles]);

  // Memoize orbs with stable keys
  const orbs = React.useMemo(() => {
    const orbElements = [];
    for (let i = 0; i < cell.count; i++) {
      const patternIndex = (cell.owner + i) % 4;
      orbElements.push(
        <ParticleCore 
          key={`orb-${row}-${col}-${i}`}
          count={cell.count}
          style={{
            transform: `translateZ(${i * 2}px)`,
            animationDelay: `${i * 0.1}s`
          }}
        >
          <ParticleInner
            owner={cell.owner}
            playerColors={playerColors}
            patternIndex={patternIndex}
          />
        </ParticleCore>
      );
    }
    return orbElements;
  }, [cell.count, cell.owner, playerColors, row, col]);

  // Memoize click handler
  const handleClick = React.useCallback(() => {
    if (!isExploding) {
      onClick();
    }
  }, [onClick, isExploding]);

  return (
    <CellContainer 
      onClick={handleClick} 
      isValid={isValid} 
      isExploding={isExploding}
    >
      {blastEffects}
      <OrbsContainer>
        {orbs}
      </OrbsContainer>
    </CellContainer>
  );
};

// Implement deep comparison for props
const propsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.cell.owner === nextProps.cell.owner &&
    prevProps.cell.count === nextProps.cell.count &&
    prevProps.currentPlayer === nextProps.currentPlayer &&
    prevProps.isAnimating === nextProps.isAnimating &&
    prevProps.row === nextProps.row &&
    prevProps.col === nextProps.col
  );
};

export default React.memo(Cell, propsAreEqual); 