import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

// Create context
const PlayerContext = createContext();

// Define the server URL - replace with your actual server URL when deployed
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

export const PlayerProvider = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [gameRooms, setGameRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize player ID and socket connection
  useEffect(() => {
    // Check if player ID exists in localStorage
    let storedPlayerId = localStorage.getItem('chainReactionPlayerId');
    
    if (!storedPlayerId) {
      // Generate a new UUID if none exists
      storedPlayerId = uuidv4();
      localStorage.setItem('chainReactionPlayerId', storedPlayerId);
    }
    
    setPlayerId(storedPlayerId);

    // Initialize socket connection
    const socketConnection = io(SERVER_URL, {
      autoConnect: false, // Don't connect automatically
      query: { playerId: storedPlayerId }
    });

    setSocket(socketConnection);

    // Clean up on unmount
    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  // Set up socket event listeners when socket is available
  useEffect(() => {
    if (!socket) return;

    // Connect to the socket server
    socket.connect();

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('playerList', (players) => {
      setConnectedPlayers(players);
    });

    socket.on('roomList', (rooms) => {
      setGameRooms(rooms);
    });

    socket.on('joinedRoom', (room) => {
      setCurrentRoom(room);
    });

    socket.on('leftRoom', () => {
      setCurrentRoom(null);
    });

    socket.on('gameState', (gameState) => {
      // Handle game state updates
      console.log('Game state updated:', gameState);
      // You'll need to implement this based on your game's state management
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('playerList');
      socket.off('roomList');
      socket.off('joinedRoom');
      socket.off('leftRoom');
      socket.off('gameState');
    };
  }, [socket]);

  // Create a new game room
  const createRoom = (roomName, settings) => {
    if (!socket || !isConnected) return;
    
    socket.emit('createRoom', {
      roomName,
      settings,
      createdBy: playerId
    });
  };

  // Join an existing game room
  const joinRoom = (roomId) => {
    if (!socket || !isConnected) return;
    
    socket.emit('joinRoom', {
      roomId,
      playerId
    });
  };

  // Leave the current game room
  const leaveRoom = () => {
    if (!socket || !isConnected || !currentRoom) return;
    
    socket.emit('leaveRoom', {
      roomId: currentRoom.id,
      playerId
    });
  };

  // Make a move in the game
  const makeMove = (move) => {
    if (!socket || !isConnected || !currentRoom) return;
    
    socket.emit('makeMove', {
      roomId: currentRoom.id,
      playerId,
      move
    });
  };

  // Value object to be provided to consumers
  const value = {
    playerId,
    isConnected,
    connectedPlayers,
    gameRooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook for using the player context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext; 