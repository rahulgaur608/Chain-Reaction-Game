import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import styled from 'styled-components';
import Board from './Board';
import GameControls from './GameControls';
import PerformanceMonitor from './PerformanceMonitor';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  gap: 20px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)' : 
    'linear-gradient(135deg, #1a1d21 0%, #2c3138 100%)'};
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 15px;
  margin: 0 auto;
  padding: 15px;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #e0e0e0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 15px;
  box-shadow: ${props => props.theme === 'light' ?
    '10px 10px 20px #bebebe, -10px -10px 20px #ffffff' :
    '10px 10px 20px #1c1f22, -10px -10px 20px #34393f'};

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 800px;
  }
`;

const StatusMessage = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 12px 20px;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => getPlayerColor(props.currentPlayer)};
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f0f0f0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  border-radius: 10px;
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme === 'light' ?
      '8px 8px 15px #bebebe, -8px -8px 15px #ffffff' :
      '8px 8px 15px #1c1f22, -8px -8px 15px #34393f'};
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1.1rem;
    padding: 10px 15px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  z-index: 10;
`;

const MaximizeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #e0e0e0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  color: ${props => props.theme === 'light' ? '#2c3138' : 'white'};
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme === 'light' ?
      '8px 8px 15px #bebebe, -8px -8px 15px #ffffff' :
      '8px 8px 15px #1c1f22, -8px -8px 15px #34393f'};
  }

  &:active {
    transform: scale(0.95);
    box-shadow: ${props => props.theme === 'light' ?
      '3px 3px 8px #bebebe, -3px -3px 8px #ffffff' :
      '3px 3px 8px #1c1f22, -3px -3px 8px #34393f'};
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    border-radius: 22.5px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const BoardWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  z-index: 2;
`;

const GameBoard = styled.div`
  position: relative;
  width: fit-content;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme === 'light' ? 
    'rgba(255, 255, 255, 0.9)' : 
    'rgba(44, 49, 56, 0.8)'};
  border-radius: 15px;
  box-shadow: ${props => props.theme === 'light' ?
    '15px 15px 30px #bebebe, -15px -15px 30px #ffffff' :
    '15px 15px 30px #1c1f22, -15px -15px 30px #34393f'};
`;

const GameInfo = styled.div`
  margin-bottom: 20px;
  padding: 15px 30px;
  background: ${props => props.theme === 'light' ? 
    'rgba(255, 255, 255, 0.9)' : 
    'rgba(44, 49, 56, 0.8)'};
  border-radius: 10px;
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  text-align: center;
`;

const ThemeToggle = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #e0e0e0)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  box-shadow: ${props => props.theme === 'light' ?
    '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' :
    '5px 5px 10px #1c1f22, -5px -5px 10px #34393f'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  }
`;

// Player colors
const PLAYER_COLORS = {
  1: '#ff5252', // Red
  2: '#4285f4', // Blue
  3: '#8bc34a', // Green
  4: '#ffeb3b', // Yellow
};

// Get player color by player number
const getPlayerColor = (playerNumber) => {
  return PLAYER_COLORS[playerNumber] || '#ffffff';
};

const Game = ({ initialGridSize, initialPlayerCount, theme, setTheme }) => {
  // Default grid size
  const [gridSize, setGridSize] = useState(initialGridSize || { rows: 6, cols: 6 });
  const [grid, setGrid] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1 (Red), 2 for Player 2 (Blue), etc.
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerCount, setPlayerCount] = useState(initialPlayerCount || 2); // Default to 2 players
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const renderTimeRef = useRef(0);
  const cellUpdateCountRef = useRef(0);
  const performanceMetricsRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Calculate the maximum capacity for a cell based on its position
  const getMaxCapacity = (row, col) => {
    const isCorner =
      (row === 0 && col === 0) ||
      (row === 0 && col === gridSize.cols - 1) ||
      (row === gridSize.rows - 1 && col === 0) ||
      (row === gridSize.rows - 1 && col === gridSize.cols - 1);

    const isEdge =
      row === 0 || col === 0 || row === gridSize.rows - 1 || col === gridSize.cols - 1;

    if (isCorner) return 2;  // Corner cells: 2 adjacent cells
    if (isEdge) return 3;    // Edge cells: 3 adjacent cells
    return 4;                // Center cells: 4 adjacent cells
  };

  // Check if a cell is critical (one orb below critical mass)
  const isCriticalCell = (cell, row, col) => {
    const maxCapacity = getMaxCapacity(row, col);
    return cell.count === maxCapacity - 1;
  };

  // Get contiguous blocks of critical cells
  const getContiguousBlocks = (grid, player) => {
    const visited = new Set();
    const blocks = [];
    
    const dfs = (row, col, block) => {
      const key = `${row},${col}`;
      if (visited.has(key)) return;
      
      const cell = grid[row][col];
      if (cell.owner !== player || !isCriticalCell(cell, row, col)) return;
      
      visited.add(key);
      block.push([row, col]);
      
      // Check adjacent cells
      const adjacent = getAdjacentCells(row, col);
      for (const [adjRow, adjCol] of adjacent) {
        dfs(adjRow, adjCol, block);
      }
    };
    
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (!visited.has(`${row},${col}`)) {
          const cell = grid[row][col];
          if (cell.owner === player && isCriticalCell(cell, row, col)) {
            const block = [];
            dfs(row, col, block);
            if (block.length > 0) blocks.push(block);
          }
        }
      }
    }
    
    return blocks;
  };

  // Evaluate board position using heuristics
  const evaluateBoard = (grid, player) => {
    let value = 0;
    const opponent = player === 1 ? 2 : 1;
    
    // Check for win/loss
    let playerOrbs = 0;
    let opponentOrbs = 0;
    
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cell = grid[row][col];
        
        if (cell.count > 0) {
          if (cell.owner === player) {
            playerOrbs++;
            
            // Add value for each orb
            value += 1;
            
            // Check adjacent enemy critical cells
            const adjacent = getAdjacentCells(row, col);
            let hasEnemyCritical = false;
            
            for (const [adjRow, adjCol] of adjacent) {
              const adjCell = grid[adjRow][adjCol];
              if (adjCell.owner === opponent && isCriticalCell(adjCell, adjRow, adjCol)) {
                hasEnemyCritical = true;
                value -= 5 - getMaxCapacity(adjRow, adjCol);
              }
            }
            
            // Bonus for safe cells
            if (!hasEnemyCritical) {
              const isCorner = (row === 0 || row === gridSize.rows - 1) && 
                             (col === 0 || col === gridSize.cols - 1);
              const isEdge = row === 0 || row === gridSize.rows - 1 || 
                            col === 0 || col === gridSize.cols - 1;
              
              if (isCorner) value += 3;
              else if (isEdge) value += 2;
              
              if (isCriticalCell(cell, row, col)) value += 2;
            }
          } else if (cell.owner === opponent) {
            opponentOrbs++;
          }
        }
      }
    }
    
    // Add value for contiguous blocks of critical cells
    const blocks = getContiguousBlocks(grid, player);
    for (const block of blocks) {
      value += block.length * 2;
    }
    
    // Check win/loss conditions
    if (opponentOrbs === 0 && playerOrbs > 0) return 10000;
    if (playerOrbs === 0 && opponentOrbs > 0) return -10000;
    
    return value;
  };

  // Memoize the grid capacity map
  const capacityMap = React.useMemo(() => {
    const map = Array(gridSize.rows).fill(null).map(() => Array(gridSize.cols).fill(0));
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        map[row][col] = getMaxCapacity(row, col);
      }
    }
    return map;
  }, [gridSize.rows, gridSize.cols]);

  // Progressive loading for large grids
  const initializeGridProgressively = useCallback(async (rows, cols) => {
    setIsLoading(true);
    
    return new Promise(resolve => {
      const newGrid = [];
      let currentRow = 0;
      
      const processNextBatch = () => {
        const batchSize = 4; // Process 4 rows at a time
        const startTime = performance.now();
        
        for (let i = 0; i < batchSize && currentRow < rows; i++) {
          newGrid[currentRow] = Array(cols).fill(null).map(() => ({
            owner: 0,
            count: 0,
          }));
          currentRow++;
        }
        
        renderTimeRef.current = performance.now() - startTime;
        
        if (currentRow < rows) {
          requestAnimationFrame(processNextBatch);
        } else {
          setIsLoading(false);
          resolve(newGrid);
        }
      };
      
      requestAnimationFrame(processNextBatch);
    });
  }, []);

  // Update reset game to use progressive loading
  const resetGame = useCallback(async () => {
    if (gridSize.rows * gridSize.cols > 64) { // Progressive loading for larger grids
      const newGrid = await initializeGridProgressively(gridSize.rows, gridSize.cols);
      setGrid(newGrid);
    } else {
      const newGrid = Array(gridSize.rows)
        .fill(null)
        .map(() =>
          Array(gridSize.cols).fill(null).map(() => ({
            owner: 0,
            count: 0,
          }))
        );
      setGrid(newGrid);
    }
    
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setIsAnimating(false);
  }, [gridSize, initializeGridProgressively]);

  useEffect(() => {
    resetGame();
  }, [gridSize, resetGame]);

  // Memoize adjacent cells calculation
  const getAdjacentCells = useCallback((row, col) => {
    return [
      row > 0 ? [row - 1, col] : null,
      row < gridSize.rows - 1 ? [row + 1, col] : null,
      col > 0 ? [row, col - 1] : null,
      col < gridSize.cols - 1 ? [row, col + 1] : null,
    ].filter(Boolean);
  }, [gridSize.rows, gridSize.cols]);

  // Performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      if (performanceMetricsRef.current) {
        performanceMetricsRef.current.updateMetrics({
          renderTime: renderTimeRef.current,
          cellUpdates: cellUpdateCountRef.current
        });
        cellUpdateCountRef.current = 0;
      }
    };

    const intervalId = setInterval(updateMetrics, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Update processExplosions to track performance
  const processExplosions = useCallback((currentGrid, startRow, startCol) => {
    const startTime = performance.now();
    
    const newGrid = JSON.parse(JSON.stringify(currentGrid));
    const explosionQueue = [[startRow, startCol]];
    const processed = new Set();
    const updates = new Map();
    
    while (explosionQueue.length > 0) {
      const [row, col] = explosionQueue.shift();
      const key = `${row},${col}`;
      
      if (processed.has(key)) continue;
      processed.add(key);
      cellUpdateCountRef.current++;
      
      const cell = newGrid[row][col];
      const maxCapacity = capacityMap[row][col];
      
      if (cell.count >= maxCapacity) {
        // Reset current cell
        updates.set(key, { owner: 0, count: 0 });
        
        // Get adjacent cells
        const adjacentCells = getAdjacentCells(row, col);
        
        // Distribute orbs
        for (const [adjRow, adjCol] of adjacentCells) {
          const adjKey = `${adjRow},${adjCol}`;
          const currentUpdate = updates.get(adjKey) || newGrid[adjRow][adjCol];
          
          const newCount = currentUpdate.count + 1;
          updates.set(adjKey, {
            owner: currentPlayer,
            count: newCount
          });
          
          if (newCount >= capacityMap[adjRow][adjCol]) {
            explosionQueue.push([adjRow, adjCol]);
          }
        }
      }
    }
    
    renderTimeRef.current = performance.now() - startTime;
    
    // Apply all updates at once
    updates.forEach((value, key) => {
      const [row, col] = key.split(',').map(Number);
      newGrid[row][col] = value;
    });
    
    // Check win condition
    const activePlayers = new Set();
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cell = newGrid[row][col];
        if (cell.count > 0) {
          activePlayers.add(cell.owner);
        }
      }
    }
    
    if (activePlayers.size === 1 && activePlayers.has(currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
    }
    
    setGrid(newGrid);
    setIsAnimating(false);
    togglePlayer();
  }, [currentPlayer, gridSize.rows, gridSize.cols, capacityMap, getAdjacentCells]);

  // Optimize cell click handler
  const handleCellClick = useCallback((row, col) => {
    if (gameOver || isAnimating) return;

    const cell = grid[row][col];
    const maxCapacity = capacityMap[row][col];
    
    // Check if the move is valid
    if (cell.owner !== 0 && cell.owner !== currentPlayer) return;
    if (cell.count + 1 > maxCapacity) return;

    // Update the grid with the new orb
    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = {
      owner: currentPlayer,
      count: cell.count + 1,
    };

    // Check if the cell will explode
    if (newGrid[row][col].count >= maxCapacity) {
      setIsAnimating(true);
      setGrid(newGrid);
      setTimeout(() => {
        processExplosions(newGrid, row, col);
      }, 300);
    } else {
      setGrid(newGrid);
      togglePlayer();
    }
  }, [gameOver, isAnimating, grid, currentPlayer, capacityMap, processExplosions]);

  // Toggle between players
  const togglePlayer = () => {
    let nextPlayer = currentPlayer + 1;
    if (nextPlayer > playerCount) {
      nextPlayer = 1;
    }
    setCurrentPlayer(nextPlayer);
  };

  // Change the grid size
  const changeGridSize = (rows, cols) => {
    setGridSize({ rows, cols });
  };
  
  // Change the number of players
  const changePlayerCount = (count) => {
    setPlayerCount(count);
    resetGame();
  };

  // Get player name by number
  const getPlayerName = (playerNumber) => {
    return `Player ${playerNumber}`;
  };

  // Toggle performance monitor
  const togglePerformanceMonitor = useCallback(() => {
    setShowPerformanceMonitor(prev => !prev);
  }, []);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <GameContainer theme={theme}>
      <ControlsContainer theme={theme}>
        <GameControls
          onReset={resetGame}
          onTogglePerformanceMonitor={togglePerformanceMonitor}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        {gameOver ? (
          <StatusMessage currentPlayer={winner} theme={theme}>
            {getPlayerName(winner)} wins!
          </StatusMessage>
        ) : (
          <StatusMessage currentPlayer={currentPlayer} theme={theme}>
            {getPlayerName(currentPlayer)}'s turn
          </StatusMessage>
        )}
      </ControlsContainer>
      
      <BoardWrapper>
        <GameBoard theme={theme}>
          <MaximizeButton onClick={toggleMaximize} theme={theme} title={isMaximized ? "Minimize" : "Maximize"}>
            {isMaximized ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            )}
          </MaximizeButton>
          <Suspense fallback={<LoadingOverlay>Loading game board...</LoadingOverlay>}>
            <Board
              grid={grid}
              onCellClick={handleCellClick}
              currentPlayer={currentPlayer}
              isAnimating={isAnimating}
              playerColors={PLAYER_COLORS}
              isMaximized={isMaximized}
              theme={theme}
            />
          </Suspense>
          {isLoading && <LoadingOverlay>Initializing game board...</LoadingOverlay>}
        </GameBoard>
      </BoardWrapper>
      
      <PerformanceMonitor
        ref={performanceMetricsRef}
        isVisible={showPerformanceMonitor}
        theme={theme}
      />
    </GameContainer>
  );
};

export default Game; 