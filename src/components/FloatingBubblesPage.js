import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from 'styled-components';

// Styled components to replace Tailwind classes
const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${props => props.theme === 'light' 
    ? '#f5f5f5' 
    : '#282c34'};
  transition: background 0.3s ease;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const TitleContainer = styled(motion.div)`
  max-width: 64rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  letter-spacing: -0.05em;
  
  @media (min-width: 640px) {
    font-size: 5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const WordSpan = styled.span`
  display: inline-block;
  margin-right: 1rem;
  &:last-child {
    margin-right: 0;
  }
`;

const LetterSpan = styled(motion.span)`
  display: inline-block;
  background: ${props => props.theme === 'light'
    ? 'linear-gradient(to right, #61dafb, #4fa8cc)'
    : 'linear-gradient(to right, #61dafb, #2c3138)'};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ButtonContainer = styled.div`
  display: inline-block;
  position: relative;
  background: ${props => props.theme === 'light'
    ? 'rgba(97, 218, 251, 0.3)'
    : 'rgba(97, 218, 251, 0.2)'};
  padding: 1px;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  overflow: hidden;
  box-shadow: ${props => props.theme === 'light'
    ? '5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.8)'
    : '5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.05)'};
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme === 'light'
      ? '8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(255, 255, 255, 0.8)'
      : '8px 8px 15px rgba(0, 0, 0, 0.4), -8px -8px 15px rgba(255, 255, 255, 0.05)'};
  }
`;

const StyledButton = styled.button`
  border-radius: 0.95rem;
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(40, 44, 52, 0.8)'};
  color: ${props => props.theme === 'light' ? '#4fa8cc' : '#61dafb'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(97, 218, 251, 0.3)'
    : 'rgba(97, 218, 251, 0.2)'};
  
  &:hover {
    background: ${props => props.theme === 'light'
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(40, 44, 52, 0.9)'};
    transform: translateY(-2px);
  }
`;

const ButtonText = styled.span`
  opacity: 0.9;
  transition: opacity 0.3s ease;
  
  ${ButtonContainer}:hover & {
    opacity: 1;
  }
`;

const ButtonArrow = styled.span`
  margin-left: 0.75rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  
  ${ButtonContainer}:hover & {
    opacity: 1;
    transform: translateX(6px);
  }
`;

const ThemeToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background: ${props => props.theme === 'light'
    ? 'linear-gradient(145deg, #ffffff, #e6e6e6)'
    : 'linear-gradient(145deg, #2c3138, #23272e)'};
  box-shadow: ${props => props.theme === 'light'
    ? '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff'
    : '5px 5px 10px #1a1d22, -5px -5px 10px #343b46'};
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: rotate(15deg) scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// SVG Icons for theme toggle
const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="#61dafb"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="#61dafb" strokeWidth="2" />
    <path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="#61dafb"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Bubble component
function Bubble({ x, y, size, color }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.7, 0.3, 0.7],
        scale: [1, 1.2, 1],
        x: x + Math.random() * 100 - 50,
        y: y + Math.random() * 100 - 50,
      }}
      transition={{
        duration: 5 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  );
}

// FloatingBubbles component
function FloatingBubbles() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 5,
      color: `rgba(97, 218, 251, ${Math.random() * 0.3 + 0.1})`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg style={{ width: '100%', height: '100%' }}>
        <title>Floating Bubbles</title>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} {...bubble} />
        ))}
      </svg>
    </div>
  );
}

// Main component
const FloatingBubblesPage = ({ title = "Chain Reaction", onEnter, theme, setTheme }) => {
  const words = title.split(" ");

  return (
    <PageContainer theme={theme}>
      <FloatingBubbles />
      
      <ThemeToggleButton 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
        theme={theme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </ThemeToggleButton>

      <ContentContainer>
        <TitleContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Title>
            {words.map((word, wordIndex) => (
              <WordSpan key={wordIndex}>
                {word.split("").map((letter, letterIndex) => (
                  <LetterSpan
                    key={`${wordIndex}-${letterIndex}`}
                    theme={theme}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                  >
                    {letter}
                  </LetterSpan>
                ))}
              </WordSpan>
            ))}
          </Title>

          <ButtonContainer theme={theme}>
            <StyledButton theme={theme} onClick={onEnter}>
              <ButtonText>Start Game</ButtonText>
              <ButtonArrow>→</ButtonArrow>
            </StyledButton>
          </ButtonContainer>
        </TitleContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default FloatingBubblesPage; 