import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import WelcomePage from './components/WelcomePage';
import FloatingBubblesPage from './components/FloatingBubblesPage';
import './App.css';

// Define a consistent color theme
export const THEME_COLORS = {
  light: {
    background: '#f5f5f5',
    text: '#2c3138',
    primary: '#61dafb',
    primaryDark: '#4fa8cc',
    shadow1: 'rgba(0, 0, 0, 0.1)',
    shadow2: 'rgba(255, 255, 255, 0.8)',
    cardBg: 'rgba(255, 255, 255, 0.8)'
  },
  dark: {
    background: '#282c34',
    text: '#ffffff',
    primary: '#61dafb',
    primaryDark: '#2c3138',
    shadow1: 'rgba(0, 0, 0, 0.3)',
    shadow2: 'rgba(255, 255, 255, 0.05)',
    cardBg: 'rgba(40, 44, 52, 0.8)'
  }
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme === 'light' ? THEME_COLORS.light.background : THEME_COLORS.dark.background};
  color: ${props => props.theme === 'light' ? THEME_COLORS.light.text : THEME_COLORS.dark.text};
  transition: all 0.3s ease;
`;

function App() {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    gridSize: { rows: 6, cols: 6 },
    playerCount: 2,
    showWelcome: true
  });
  const [theme, setTheme] = useState('dark');

  const handleEnterGame = (settings) => {
    setGameState({
      isPlaying: true,
      gridSize: settings?.gridSize || gameState.gridSize,
      playerCount: settings?.playerCount || gameState.playerCount,
      showWelcome: false
    });
  };

  const handleStartClick = () => {
    setGameState({
      ...gameState,
      showWelcome: false
    });
  };

  return (
    <AppContainer theme={theme}>
      {gameState.isPlaying ? (
        <Game 
          initialGridSize={gameState.gridSize}
          initialPlayerCount={gameState.playerCount}
          theme={theme}
          setTheme={setTheme}
          themeColors={THEME_COLORS}
        />
      ) : gameState.showWelcome ? (
        <FloatingBubblesPage 
          title="Chain Reaction"
          onEnter={handleStartClick}
          theme={theme}
          setTheme={setTheme}
          themeColors={THEME_COLORS}
        />
      ) : (
        <WelcomePage 
          onEnter={handleEnterGame} 
          theme={theme}
          setTheme={setTheme}
          themeColors={THEME_COLORS}
        />
      )}
    </AppContainer>
  );
}

export default App;
