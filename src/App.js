import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import WelcomePage from './components/WelcomePage';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme === 'light' ? '#f5f5f5' : '#282c34'};
  color: ${props => props.theme === 'light' ? '#2c3138' : 'white'};
  transition: all 0.3s ease;
`;

function App() {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    gridSize: { rows: 6, cols: 6 },
    playerCount: 2
  });
  const [theme, setTheme] = useState('dark');

  const handleEnterGame = (settings) => {
    setGameState({
      isPlaying: true,
      gridSize: settings.gridSize,
      playerCount: settings.playerCount
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
        />
      ) : (
        <WelcomePage 
          onEnter={handleEnterGame} 
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </AppContainer>
  );
}

export default App;
