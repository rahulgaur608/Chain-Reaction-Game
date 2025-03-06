import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-20px) rotate(5deg) scale(1.1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(97, 218, 251, 0.2),
                0 0 10px rgba(97, 218, 251, 0.2),
                0 0 15px rgba(97, 218, 251, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(97, 218, 251, 0.5),
                0 0 20px rgba(97, 218, 251, 0.3),
                0 0 30px rgba(97, 218, 251, 0.3);
  }
`;

const explode = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.1);
    opacity: 0;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.1);
  }
`;

const shockwave = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const scatter = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
`;

const wobble = keyframes`
  0%, 100% {
    transform: translateX(0) scale(1);
  }
  25% {
    transform: translateX(-2px) scale(1.05);
  }
  75% {
    transform: translateX(2px) scale(0.95);
  }
`;

const lightTheme = {
  background: 'linear-gradient(135deg, #e6e9ef 0%, #ffffff 100%)',
  text: '#2c3138',
  primary: '#61dafb',
  secondary: '#4fa8cc',
  surface: '#ffffff',
  surfaceAlt: '#f0f4f8',
  shadow: 'rgba(0, 0, 0, 0.1)',
  buttonText: '#ffffff',
  accent: '#61dafb',
  shadowDark: '#c8ccd4',
  shadowLight: '#ffffff',
  gradientStart: '#ffffff',
  gradientEnd: '#e6e9ef'
};

const darkTheme = {
  background: 'linear-gradient(135deg, #1a1d21 0%, #2c3138 100%)',
  text: '#ffffff',
  primary: '#61dafb',
  secondary: '#4fa8cc',
  surface: '#2c3138',
  surfaceAlt: '#23272b',
  shadow: 'rgba(0, 0, 0, 0.4)',
  buttonText: '#1a1d21',
  accent: '#61dafb',
  shadowDark: '#1c1f22',
  shadowLight: '#34393f',
  gradientStart: '#2c3138',
  gradientEnd: '#23272b'
};

const Container = styled.div`
  min-height: 100vh;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#282c34'};
  transition: all 0.3s ease;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 30px;
  border-radius: 30px;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(145deg, #ffffff, #e6e6e6)' 
    : 'linear-gradient(145deg, #2c3138, #23272e)'};
  box-shadow: ${props => props.theme === 'light'
    ? '20px 20px 60px rgba(0, 0, 0, 0.1), -20px -20px 60px rgba(255, 255, 255, 0.8)'
    : '20px 20px 60px rgba(0, 0, 0, 0.3), -20px -20px 60px rgba(255, 255, 255, 0.05)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin: 0 0 30px;
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  text-align: center;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #61dafb, #4fa8cc)' : 
    'linear-gradient(145deg, #61dafb, #2c3138)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme === 'light' ?
    '3px 3px 6px rgba(190, 190, 190, 0.8), -3px -3px 6px rgba(255, 255, 255, 0.8)' :
    '3px 3px 6px rgba(28, 31, 34, 0.8), -3px -3px 6px rgba(52, 57, 63, 0.8)'};
  letter-spacing: 2px;
  font-weight: 800;
  position: relative;
  padding: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: ${props => props.theme === 'light' ? 
      'linear-gradient(90deg, transparent, #61dafb, transparent)' : 
      'linear-gradient(90deg, transparent, #61dafb, transparent)'};
    border-radius: 2px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: ${props => props.theme === 'light' ? 
      'linear-gradient(90deg, transparent, #61dafb, transparent)' : 
      'linear-gradient(90deg, transparent, #61dafb, transparent)'};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 15px;
    
    &::before {
      width: 60px;
    }
    
    &::after {
      width: 120px;
    }
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    padding: 10px;
    
    &::before {
      width: 40px;
    }
    
    &::after {
      width: 80px;
    }
  }
`;

const TitleSubtext = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme === 'light' ? '#4fa8cc' : '#61dafb'};
  text-align: center;
  margin-top: -20px;
  margin-bottom: 30px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.8;
  text-shadow: ${props => props.theme === 'light' ?
    '1px 1px 2px rgba(190, 190, 190, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)' :
    '1px 1px 2px rgba(28, 31, 34, 0.8), -1px -1px 2px rgba(52, 57, 63, 0.8)'};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
`;

const Description = styled.div`
  background: rgba(44, 49, 56, 0.8);
  padding: 20px;
  border-radius: 15px;
  margin: 0;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.4),
    inset 0 -5px 15px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  height: fit-content;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  color: #61dafb;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Text = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #ffffff;
`;

const SettingsSection = styled.div`
  background: ${props => props.theme === 'light' ? 
    `linear-gradient(145deg, ${lightTheme.gradientStart}, ${lightTheme.gradientEnd})` : 
    `linear-gradient(145deg, ${darkTheme.gradientStart}, ${darkTheme.gradientEnd})`};
  box-shadow: ${props => props.theme === 'light' ?
    `12px 12px 24px ${lightTheme.shadowDark}, -12px -12px 24px ${lightTheme.shadowLight}` :
    `12px 12px 24px ${darkTheme.shadowDark}, -12px -12px 24px ${darkTheme.shadowLight}`};
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme === 'light' ?
      `15px 15px 30px ${lightTheme.shadowDark}, -15px -15px 30px ${lightTheme.shadowLight}` :
      `15px 15px 30px ${darkTheme.shadowDark}, -15px -15px 30px ${darkTheme.shadowLight}`};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 25px;
  background: ${props => props.theme === 'light' ? 
    `linear-gradient(145deg, ${lightTheme.gradientStart}, ${lightTheme.gradientEnd})` : 
    `linear-gradient(145deg, ${darkTheme.gradientStart}, ${darkTheme.gradientEnd})`};
  border-radius: 15px;
  box-shadow: ${props => props.theme === 'light' ?
    `inset 8px 8px 16px ${lightTheme.shadowDark}, inset -8px -8px 16px ${lightTheme.shadowLight}` :
    `inset 8px 8px 16px ${darkTheme.shadowDark}, inset -8px -8px 16px ${darkTheme.shadowLight}`};
  gap: 20px;
  transition: all 0.3s ease;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: #61dafb;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const GridPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 12px);
  grid-template-rows: repeat(${props => props.rows}, 12px);
  gap: 2px;
  margin: 15px 0;
  padding: 15px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f5f5f5)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 12px;
  box-shadow: ${props => props.theme === 'light' ?
    'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff' :
    'inset 3px 3px 6px #1c1f22, inset -3px -3px 6px #34393f'};
  transform: perspective(1000px) rotateX(30deg);
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: perspective(1000px) rotateX(40deg) scale(1.1);
  }
`;

const OptionsButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const OptionButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.active ? 
    `linear-gradient(145deg, ${props.theme === 'light' ? lightTheme.primary : darkTheme.primary}, ${props.theme === 'light' ? lightTheme.secondary : darkTheme.secondary})` : 
    props.theme === 'light' ? 
      `linear-gradient(145deg, ${lightTheme.gradientStart}, ${lightTheme.gradientEnd})` : 
      `linear-gradient(145deg, ${darkTheme.gradientStart}, ${darkTheme.gradientEnd})`};
  color: ${(props) => props.active ? 
    props.theme === 'light' ? darkTheme.text : lightTheme.text : 
    props.theme === 'light' ? lightTheme.text : darkTheme.text};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ?
    props.theme === 'light' ?
      `6px 6px 12px ${lightTheme.shadowDark}, -6px -6px 12px ${lightTheme.shadowLight}` :
      `6px 6px 12px ${darkTheme.shadowDark}, -6px -6px 12px ${darkTheme.shadowLight}` :
    props.theme === 'light' ?
      `inset 4px 4px 8px ${lightTheme.shadowDark}, inset -4px -4px 8px ${lightTheme.shadowLight}` :
      `inset 4px 4px 8px ${darkTheme.shadowDark}, inset -4px -4px 8px ${darkTheme.shadowLight}`};
  transform: ${props => props.active ? 'scale(1.05)' : 'scale(1)'};
  min-width: 120px;
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.08)' : 'scale(1.03)'};
    box-shadow: ${props => props.active ?
      props.theme === 'light' ?
        `8px 8px 16px ${lightTheme.shadowDark}, -8px -8px 16px ${lightTheme.shadowLight}` :
        `8px 8px 16px ${darkTheme.shadowDark}, -8px -8px 16px ${darkTheme.shadowLight}` :
      props.theme === 'light' ?
        `inset 6px 6px 12px ${lightTheme.shadowDark}, inset -6px -6px 12px ${lightTheme.shadowLight}` :
        `inset 6px 6px 12px ${darkTheme.shadowDark}, inset -6px -6px 12px ${darkTheme.shadowLight}`};
  }
`;

const PlayerColors = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
  padding: 15px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f5f5f5)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 12px;
  box-shadow: ${props => props.theme === 'light' ?
    'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff' :
    'inset 3px 3px 6px #1c1f22, inset -3px -3px 6px #34393f'};
`;

const PlayerColorButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f0f0f0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 10px;
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.05) translateZ(10px) rotateX(5deg);
    box-shadow: ${props => props.theme === 'light' ?
      '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff' :
      '8px 8px 16px #1c1f22, -8px -8px 16px #34393f'};
  }

  ${props => props.active && css`
    transform: scale(1.05) translateZ(10px) rotateX(5deg);
    box-shadow: 
      0 0 15px ${props.color}40,
      ${props.theme === 'light' ?
        '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff' :
        '8px 8px 16px #1c1f22, -8px -8px 16px #34393f'};
    
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      background: ${props.color}20;
      border-radius: inherit;
      z-index: -1;
      animation: ${ripple} 2s ease-out infinite;
    }
  `}
`;

const ColorIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(145deg, ${props => props.color}, ${props => adjustColor(props.color, -20)});
  box-shadow: ${props => props.theme === 'light' ?
    'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.7)' :
    'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.1)'};
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    filter: blur(2px);
    transition: all 0.3s ease;
  }

  ${props => props.active && css`
    animation: ${wobble} 2s ease-in-out infinite;
    &::before {
      content: '';
      position: absolute;
      top: -15%;
      left: -15%;
      right: -15%;
      bottom: -15%;
      background: ${props.color}20;
      border-radius: 50%;
      z-index: -1;
      animation: ${shockwave} 2s ease-out infinite;
    }
  `}

  &:hover {
    transform: scale(1.1) translateZ(10px);
    &::after {
      transform: scale(1.2) translate(-10%, -10%);
      opacity: 0.8;
    }
  }
`;

const PlayerName = styled.span`
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  font-weight: 600;
  font-size: 0.95rem;
  text-shadow: ${props => props.theme === 'light' ?
    '1px 1px 2px #d1d1d1, -1px -1px 2px #ffffff' :
    '1px 1px 2px #1c1f22, -1px -1px 2px #34393f'};
`;

const FloatingOrb = styled.div`
  position: absolute;
  width: ${props => props.size * 0.8}px;
  height: ${props => props.size * 0.8}px;
  border-radius: 50%;
  background: linear-gradient(145deg, ${props => props.color}, ${props => props.colorDark});
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.3),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  animation: ${bounce} ${props => props.duration}s cubic-bezier(0.36, 0, 0.66, -0.56) infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 0;
  opacity: 0.8;
  transform-style: preserve-3d;
  will-change: transform;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: ${props => props.color}40;
    border-radius: 50%;
    z-index: -1;
    animation: ${ripple} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: ${props => props.delay * 0.5}s;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    filter: blur(2px);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.2) translateZ(20px) rotate(5deg);
    animation-play-state: paused;
    &::before {
      animation-play-state: paused;
    }
    &::after {
      transform: scale(1.2) translate(-10%, -10%);
      opacity: 0.6;
    }
  }
`;

const GridCell = styled.div`
  background: ${props => {
    if (props.active) return props.color;
    return props.theme === 'light' ? 
      'linear-gradient(145deg, #ffffff, #f0f0f0)' : 
      'linear-gradient(145deg, #2c3138, #23272b)';
  }};
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  position: relative;
  box-shadow: ${props => props.theme === 'light' ?
    'inset 1px 1px 2px #d1d1d1, inset -1px -1px 2px #ffffff' :
    'inset 1px 1px 2px #1c1f22, inset -1px -1px 2px #34393f'};
  
  &::before {
    content: '${props => props.capacity}';
    position: absolute;
    font-size: 6px;
    color: ${props => props.theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
    z-index: 1;
    transition: all 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 2px;
    background: ${props => props.active ? `${props.color}40` : 'transparent'};
    animation: ${props => props.active ? ripple : 'none'} 1.5s ease-out infinite;
    z-index: -1;
  }

  ${props => props.isCritical && css`
    animation: ${wobble} 1s ease-in-out infinite;
    &::after {
      animation: ${shockwave} 1.5s ease-out infinite;
      background: ${props.color}80;
    }
    &::before {
      animation: ${pulse} 1s ease-in-out infinite;
      transform: scale(1.2);
    }
  `}

  &:hover {
    transform: translateZ(2px) scale(1.1);
    background: ${props => props.color};
    box-shadow: ${props => props.theme === 'light' ?
      '2px 2px 4px #d1d1d1, -2px -2px 4px #ffffff' :
      '2px 2px 4px #1c1f22, -2px -2px 4px #34393f'};
    
    &::before {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
  }
`;

const Button = styled.button`
  padding: 15px 35px;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.primary ? darkTheme.text : props.theme === 'light' ? lightTheme.text : darkTheme.text};
  background: ${props => props.primary ? 
    `linear-gradient(145deg, ${lightTheme.primary}, ${lightTheme.secondary})` : 
    props.theme === 'light' ? 
      `linear-gradient(145deg, ${lightTheme.gradientStart}, ${lightTheme.gradientEnd})` : 
      `linear-gradient(145deg, ${darkTheme.gradientStart}, ${darkTheme.gradientEnd})`};
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme === 'light' ?
    `8px 8px 16px ${lightTheme.shadowDark}, -8px -8px 16px ${lightTheme.shadowLight}` :
    `8px 8px 16px ${darkTheme.shadowDark}, -8px -8px 16px ${darkTheme.shadowLight}`};
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme === 'light' ?
      `12px 12px 24px ${lightTheme.shadowDark}, -12px -12px 24px ${lightTheme.shadowLight}` :
      `12px 12px 24px ${darkTheme.shadowDark}, -12px -12px 24px ${darkTheme.shadowLight}`};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: ${props => props.theme === 'light' ?
      `4px 4px 8px ${lightTheme.shadowDark}, -4px -4px 8px ${lightTheme.shadowLight}` :
      `4px 4px 8px ${darkTheme.shadowDark}, -4px -4px 8px ${darkTheme.shadowLight}`};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const HowToPlaySection = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f0f0f0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 15px;
  padding: 25px;
  box-shadow: ${props => props.theme === 'light' ?
    '10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff' :
    '10px 10px 20px #1c1f22, -10px -10px 20px #34393f'};
`;

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
`;

const RuleItem = styled.div`
  padding: 20px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f5f5f5)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  border-left: 4px solid ${props => props.color || '#61dafb'};
  box-shadow: ${props => props.theme === 'light' ?
    'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff' :
    'inset 3px 3px 6px #1c1f22, inset -3px -3px 6px #34393f'};
  
  h4 {
    margin: 0 0 12px;
    color: ${props => props.color || '#61dafb'};
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: ${props => props.theme === 'light' ?
      '1px 1px 2px #d1d1d1, -1px -1px 2px #ffffff' :
      '1px 1px 2px #1c1f22, -1px -1px 2px #34393f'};
  }
  
  ul {
    margin: 8px 0 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
    }
  }
`;

const PLAYER_COLORS = {
  1: '#ff5252', // Red
  2: '#4285f4', // Blue
  3: '#8bc34a', // Green
};

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

const WelcomePage = ({ onEnter, theme, setTheme }) => {
  const [selectedGridSize, setSelectedGridSize] = useState({ rows: 6, cols: 6 });
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(2);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCell, setActiveCell] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const gridSizeOptions = [
    { label: '6x6', rows: 6, cols: 6 },
    { label: '8x8', rows: 8, cols: 8 },
    { label: '9x6', rows: 9, cols: 6 },
    { label: '10x10', rows: 10, cols: 10 },
    { label: '12x8', rows: 12, cols: 8 },
    { label: '15x10', rows: 15, cols: 10 }
  ];

  const playerCountOptions = [2, 3];

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (clientX / innerWidth) * 100,
      y: (clientY / innerHeight) * 100
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleStartGame = () => {
    onEnter({
      gridSize: selectedGridSize,
      playerCount: selectedPlayerCount
    });
  };

  const getCellCapacity = (row, col, rows, cols) => {
    // Corner cells
    if ((row === 0 && col === 0) || 
        (row === 0 && col === cols - 1) ||
        (row === rows - 1 && col === 0) ||
        (row === rows - 1 && col === cols - 1)) {
      return 2;
    }
    // Edge cells
    if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
      return 3;
    }
    // Center cells
    return 4;
  };

  const renderGridPreview = () => {
    const cells = [];
    for (let i = 0; i < selectedGridSize.rows; i++) {
      for (let j = 0; j < selectedGridSize.cols; j++) {
        const isActive = activeCell?.row === i && activeCell?.col === j;
        const capacity = getCellCapacity(i, j, selectedGridSize.rows, selectedGridSize.cols);
        const isCritical = isActive && capacity > 1; // Show critical state on hover

        cells.push(
          <GridCell
            key={`${i}-${j}`}
            active={isActive}
            isCritical={isCritical}
            color={PLAYER_COLORS[1]}
            capacity={capacity}
            delay={(i + j) * 50}
            theme={theme}
            onMouseEnter={() => setActiveCell({ row: i, col: j })}
            onMouseLeave={() => setActiveCell(null)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <Container theme={theme}>
      <ThemeToggleButton 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
        theme={theme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </ThemeToggleButton>
      {[...Array(3)].map((_, i) => (
        <FloatingOrb
          key={i}
          size={60 - i * 10}
          color={PLAYER_COLORS[(i % 3) + 1]}
          colorDark={PLAYER_COLORS[(i % 3) + 1]}
          duration={4 + i}
          delay={i}
          top={20 + (mousePosition.y * 0.1) + (i * 10)}
          left={15 + (mousePosition.x * 0.1) + (i * 12)}
        />
      ))}
      
      <Content theme={theme}>
        <Title theme={theme}>Chain Reaction</Title>
        <TitleSubtext theme={theme}>Strategic Multiplayer Game</TitleSubtext>
        
        <MainContent>
          <SettingsSection theme={theme}>
            <SettingsGrid>
              <ControlSection theme={theme}>
                <SectionTitle>Grid Size</SectionTitle>
                <GridPreview rows={selectedGridSize.rows} cols={selectedGridSize.cols}>
                  {renderGridPreview()}
                </GridPreview>
                <OptionsButtons>
                  {gridSizeOptions.map((size) => (
                    <OptionButton
                      key={size.label}
                      active={selectedGridSize.rows === size.rows && selectedGridSize.cols === size.cols}
                      onClick={() => setSelectedGridSize({ rows: size.rows, cols: size.cols })}
                      theme={theme}
                    >
                      {size.label}
                    </OptionButton>
                  ))}
                </OptionsButtons>
              </ControlSection>

              <ControlSection theme={theme}>
                <SectionTitle>Players</SectionTitle>
                <PlayerColors>
                  {[...Array(selectedPlayerCount)].map((_, index) => (
                    <PlayerColorButton
                      key={index + 1}
                      color={PLAYER_COLORS[index + 1]}
                      active={true}
                      theme={theme}
                    >
                      <ColorIndicator color={PLAYER_COLORS[index + 1]} />
                      <PlayerName>Player {index + 1}</PlayerName>
                    </PlayerColorButton>
                  ))}
                </PlayerColors>
                <OptionsButtons>
                  {playerCountOptions.map((count) => (
                    <OptionButton
                      key={count}
                      active={selectedPlayerCount === count}
                      onClick={() => setSelectedPlayerCount(count)}
                      theme={theme}
                    >
                      {count} Players
                    </OptionButton>
                  ))}
                </OptionsButtons>
              </ControlSection>
            </SettingsGrid>
          </SettingsSection>

          <ButtonContainer>
            <Button primary onClick={handleStartGame}>
              Start Game
            </Button>
            <Button 
              onClick={() => setShowRules(!showRules)}
              theme={theme}
            >
              {showRules ? 'Hide Rules' : 'Show Rules'}
            </Button>
          </ButtonContainer>

          {showRules && (
            <HowToPlaySection theme={theme}>
              <Subtitle>How to Play</Subtitle>
              <Text>
                Chain Reaction is a strategic multiplayer game where players compete to control the board through explosive chain reactions. Master the art of positioning and timing to eliminate your opponents!
              </Text>
              
              <RulesList>
                <RuleItem color="#4285f4" theme={theme}>
                  <h4>Cell Capacities</h4>
                  Each cell has a maximum capacity based on its position:
                  <ul>
                    <li>Corner cells (2 neighbors): Max 2 orbs</li>
                    <li>Edge cells (3 neighbors): Max 3 orbs</li>
                    <li>Center cells (4 neighbors): Max 4 orbs</li>
                  </ul>
                </RuleItem>

                <RuleItem color="#ff5252" theme={theme}>
                  <h4>Basic Gameplay</h4>
                  <ul>
                    <li>Players take turns placing one orb in any cell</li>
                    <li>You can only place orbs in empty cells or cells you own</li>
                    <li>Each player has their own color (Red, Blue, or Green)</li>
                    <li>The game supports 2-3 players</li>
                  </ul>
                </RuleItem>

                <RuleItem color="#8bc34a" theme={theme}>
                  <h4>Chain Reactions</h4>
                  <ul>
                    <li>When a cell reaches its capacity, it explodes</li>
                    <li>Explosion sends one orb to each adjacent cell (up, down, left, right)</li>
                    <li>Adjacent cells become owned by the player who triggered the explosion</li>
                    <li>If any receiving cell reaches its capacity, it also explodes</li>
                    <li>This continues until no more cells are at capacity</li>
                  </ul>
                </RuleItem>

                <RuleItem color="#ffeb3b" theme={theme}>
                  <h4>Strategy Tips</h4>
                  <ul>
                    <li>Watch for critical cells (one orb away from explosion)</li>
                    <li>Use corner and edge cells strategically due to lower capacity</li>
                    <li>Create chain reactions to convert multiple opponent cells</li>
                    <li>Protect your critical mass cells from opponent takeovers</li>
                    <li>Plan multiple moves ahead to set up combinations</li>
                  </ul>
                </RuleItem>

                <RuleItem color="#61dafb" theme={theme}>
                  <h4>Winning the Game</h4>
                  <ul>
                    <li>Eliminate all other players' orbs from the board to win</li>
                    <li>A player is eliminated when they have no orbs left</li>
                    <li>The last player with orbs on the board wins</li>
                  </ul>
                </RuleItem>
              </RulesList>
            </HowToPlaySection>
          )}
        </MainContent>
      </Content>
    </Container>
  );
};

export default WelcomePage; 