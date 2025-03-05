import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import Cell from './Cell';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, ${props => props.isMaximized ? '120px' : '90px'});
  grid-template-rows: repeat(${(props) => props.rows}, ${props => props.isMaximized ? '120px' : '90px'});
  gap: ${props => props.isMaximized ? '8px' : '6px'};
  background: ${props => props.theme === 'light' ? 
    'linear-gradient(145deg, #ffffff, #f5f5f5)' : 
    'linear-gradient(145deg, #2c3138, #23272b)'};
  padding: ${props => props.isMaximized ? '30px' : '20px'};
  border-radius: 16px;
  box-shadow: ${props => props.theme === 'light' ?
    '0 25px 50px rgba(0, 0, 0, 0.2), inset 0 -5px 15px rgba(0, 0, 0, 0.1)' :
    '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 -5px 15px rgba(0, 0, 0, 0.5)'};
  transform: perspective(1200px) rotateX(10deg);
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  width: fit-content;
  margin: 0 auto;
  position: relative;

  &:hover {
    transform: perspective(1200px) rotateX(5deg);
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(${(props) => props.cols}, ${props => props.isMaximized ? '100px' : '80px'});
    grid-template-rows: repeat(${(props) => props.rows}, ${props => props.isMaximized ? '100px' : '80px'});
    gap: ${props => props.isMaximized ? '7px' : '6px'};
    padding: ${props => props.isMaximized ? '25px' : '20px'};
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(${(props) => props.cols}, 60px);
    grid-template-rows: repeat(${(props) => props.rows}, 60px);
    gap: 4px;
    padding: 15px;
    transform: perspective(1200px) rotateX(7deg);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(${(props) => props.cols}, 45px);
    grid-template-rows: repeat(${(props) => props.rows}, 45px);
    gap: 3px;
    padding: 10px;
    transform: perspective(1200px) rotateX(5deg);
  }
`;

const Board = ({ 
  grid, 
  onCellClick, 
  currentPlayer, 
  isAnimating,
  playerColors,
  isMaximized,
  theme
}) => {
  if (!grid.length) return null;

  return (
    <BoardContainer 
      rows={grid.length} 
      cols={grid[0].length}
      isMaximized={isMaximized}
      theme={theme}
    >
      {grid.flat().map((cell, index) => {
        const rowIndex = Math.floor(index / grid[0].length);
        const colIndex = index % grid[0].length;
        return (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            currentPlayer={currentPlayer}
            isAnimating={isAnimating}
            playerColors={playerColors}
            theme={theme}
          />
        );
      })}
    </BoardContainer>
  );
};

export default Board;