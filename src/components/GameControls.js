import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #e0e0e0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 15px;
  padding: 15px;
  box-shadow: ${props => props.theme === 'light' ?
    '10px 10px 20px #bebebe, -10px -10px 20px #ffffff' :
    '10px 10px 20px #1c1f22, -10px -10px 20px #34393f'};
  margin: 10px auto 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: ${props => props.bgColor || (props.theme === 'light' ? '#f5f5f5' : '#2c3138')};
  color: ${props => props.theme === 'light' ? '#2c3138' : 'white'};
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  min-width: 140px;
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme === 'light' ?
      '8px 8px 15px #bebebe, -8px -8px 15px #ffffff' :
      '8px 8px 15px #1c1f22, -8px -8px 15px #34393f'};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${props => props.theme === 'light' ?
      '3px 3px 8px #bebebe, -3px -3px 8px #ffffff' :
      '3px 3px 8px #1c1f22, -3px -3px 8px #34393f'};
  }

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
`;

const GameControls = ({ 
  onReset, 
  onTogglePerformanceMonitor,
  onToggleTheme,
  theme
}) => {
  return (
    <ControlsContainer theme={theme}>
      <ButtonsContainer>
        <Button 
          onClick={onReset} 
          bgColor={theme === 'light' ? 
            'linear-gradient(145deg, #ff7b7b, #ff5252)' : 
            'linear-gradient(145deg, #ff5252, #d63939)'}
          theme={theme}
        >
          Reset Game
        </Button>
        <Button 
          onClick={onTogglePerformanceMonitor}
          theme={theme}
        >
          Toggle Monitor
        </Button>
        <Button 
          onClick={onToggleTheme}
          theme={theme}
        >
          {theme === 'light' ? (
            <>
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
              Dark Mode
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
              Light Mode
            </>
          )}
        </Button>
      </ButtonsContainer>
    </ControlsContainer>
  );
};

export default GameControls; 