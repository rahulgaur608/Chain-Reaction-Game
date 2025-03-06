import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../context/PlayerContext';

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
  font-size: 2.5rem;
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
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin: 20px 0;
  color: ${props => props.theme === 'light' ? '#4fa8cc' : '#61dafb'};
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background: ${props => props.theme === 'light' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(44, 49, 56, 0.7)'};
  box-shadow: ${props => props.theme === 'light'
    ? '5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.5)'
    : '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.02)'};
`;

const PlayerName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PlayerLabel = styled.span`
  font-weight: bold;
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
`;

const PlayerNameInput = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme === 'light' 
    ? '#f0f0f0' 
    : '#3a3f47'};
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  box-shadow: ${props => props.theme === 'light'
    ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)'
    : 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)'};
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: ${props => props.theme === 'light'
      ? 'inset 3px 3px 7px rgba(0, 0, 0, 0.1), inset -3px -3px 7px rgba(255, 255, 255, 0.5), 0 0 0 2px rgba(97, 218, 251, 0.3)'
      : 'inset 3px 3px 7px rgba(0, 0, 0, 0.2), inset -3px -3px 7px rgba(255, 255, 255, 0.05), 0 0 0 2px rgba(97, 218, 251, 0.3)'};
  }
`;

const UpdateNameButton = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(145deg, #61dafb, #4fa8cc)' 
    : 'linear-gradient(145deg, #61dafb, #2c3138)'};
  color: ${props => props.theme === 'light' ? '#ffffff' : '#ffffff'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const ConnectionStatus = styled.div`
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 20px;
  background: ${props => props.connected 
    ? 'linear-gradient(145deg, #4CAF50, #388E3C)' 
    : 'linear-gradient(145deg, #F44336, #D32F2F)'};
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  background: ${props => props.active 
    ? props.theme === 'light' 
      ? 'linear-gradient(145deg, #61dafb, #4fa8cc)' 
      : 'linear-gradient(145deg, #61dafb, #2c3138)'
    : props.theme === 'light'
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(44, 49, 56, 0.5)'
  };
  color: ${props => props.active 
    ? '#ffffff' 
    : props.theme === 'light' ? '#2c3138' : '#ffffff'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => !props.active && (props.theme === 'light' 
      ? 'rgba(97, 218, 251, 0.2)' 
      : 'rgba(97, 218, 251, 0.2)')};
  }
`;

const CreateRoomForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme === 'light' 
    ? '#f0f0f0' 
    : '#3a3f47'};
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  box-shadow: ${props => props.theme === 'light'
    ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)'
    : 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)'};
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: ${props => props.theme === 'light'
      ? 'inset 3px 3px 7px rgba(0, 0, 0, 0.1), inset -3px -3px 7px rgba(255, 255, 255, 0.5), 0 0 0 2px rgba(97, 218, 251, 0.3)'
      : 'inset 3px 3px 7px rgba(0, 0, 0, 0.2), inset -3px -3px 7px rgba(255, 255, 255, 0.05), 0 0 0 2px rgba(97, 218, 251, 0.3)'};
  }
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme === 'light' 
    ? '#f0f0f0' 
    : '#3a3f47'};
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
  box-shadow: ${props => props.theme === 'light'
    ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)'
    : 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.05)'};
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: ${props => props.theme === 'light'
      ? 'inset 3px 3px 7px rgba(0, 0, 0, 0.1), inset -3px -3px 7px rgba(255, 255, 255, 0.5), 0 0 0 2px rgba(97, 218, 251, 0.3)'
      : 'inset 3px 3px 7px rgba(0, 0, 0, 0.2), inset -3px -3px 7px rgba(255, 255, 255, 0.05), 0 0 0 2px rgba(97, 218, 251, 0.3)'};
  }
`;

const Button = styled.button`
  padding: 15px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(145deg, #61dafb, #4fa8cc)' 
    : 'linear-gradient(145deg, #61dafb, #2c3138)'};
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  &:disabled {
    background: ${props => props.theme === 'light' 
      ? '#cccccc' 
      : '#555555'};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RoomList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'light' 
      ? '#f0f0f0' 
      : '#3a3f47'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'light' 
      ? '#cccccc' 
      : '#555555'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme === 'light' 
      ? '#bbbbbb' 
      : '#666666'};
  }
`;

const RoomCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  background: ${props => props.theme === 'light' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(44, 49, 56, 0.7)'};
  box-shadow: ${props => props.theme === 'light'
    ? '5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.5)'
    : '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.02)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme === 'light'
      ? '7px 7px 15px rgba(0, 0, 0, 0.07), -7px -7px 15px rgba(255, 255, 255, 0.7)'
      : '7px 7px 15px rgba(0, 0, 0, 0.3), -7px -7px 15px rgba(255, 255, 255, 0.03)'};
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
`;

const RoomDetails = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
  font-size: 0.9rem;
  color: ${props => props.theme === 'light' ? '#666666' : '#aaaaaa'};
`;

const RoomDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const JoinButton = styled(Button)`
  padding: 8px 15px;
  margin-left: 10px;
`;

const NoRoomsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme === 'light' ? '#666666' : '#aaaaaa'};
  font-style: italic;
`;

const BackButton = styled(Button)`
  margin-top: 20px;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(145deg, #f0f0f0, #e6e6e6)' 
    : 'linear-gradient(145deg, #3a3f47, #2c3138)'};
  color: ${props => props.theme === 'light' ? '#2c3138' : '#ffffff'};
`;

const MultiplayerLobby = ({ theme, onBack, onStartGame }) => {
  const { 
    playerId, 
    isConnected, 
    connectedPlayers, 
    gameRooms, 
    currentRoom,
    createRoom, 
    joinRoom, 
    leaveRoom,
    makeMove 
  } = usePlayer();
  
  const [activeTab, setActiveTab] = useState('join');
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedGridSize, setSelectedGridSize] = useState({ rows: 6, cols: 6 });
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(2);
  
  const gridSizeOptions = [
    { label: '6x6', value: { rows: 6, cols: 6 } },
    { label: '8x8', value: { rows: 8, cols: 8 } },
    { label: '9x6', value: { rows: 9, cols: 6 } },
    { label: '10x10', value: { rows: 10, cols: 10 } },
    { label: '12x8', value: { rows: 12, cols: 8 } },
    { label: '15x10', value: { rows: 15, cols: 10 } }
  ];
  
  const playerCountOptions = [2, 3, 4];
  
  // If we're in a room and it's in 'playing' status, start the game
  useEffect(() => {
    if (currentRoom && currentRoom.gameState.status === 'playing') {
      onStartGame({
        gridSize: currentRoom.settings.gridSize,
        playerCount: currentRoom.settings.playerCount,
        isMultiplayer: true,
        room: currentRoom
      });
    }
  }, [currentRoom, onStartGame]);
  
  const handleUpdateName = (e) => {
    e.preventDefault();
    // This would call a function from the PlayerContext to update the name
    // For now, we'll just update the local state
    setPlayerName(playerName);
  };
  
  const handleCreateRoom = (e) => {
    e.preventDefault();
    createRoom(roomName, {
      gridSize: selectedGridSize,
      playerCount: selectedPlayerCount
    });
  };
  
  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
  };
  
  return (
    <Container theme={theme}>
      <Content theme={theme}>
        <Title theme={theme}>Multiplayer Lobby</Title>
        
        <PlayerInfo theme={theme}>
          <PlayerName>
            <PlayerLabel theme={theme}>Player ID:</PlayerLabel>
            <span>{playerId ? playerId.substring(0, 8) + '...' : 'Loading...'}</span>
          </PlayerName>
          
          <PlayerName style={{ marginLeft: '20px' }}>
            <PlayerLabel theme={theme}>Name:</PlayerLabel>
            <PlayerNameInput 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              theme={theme}
            />
            <UpdateNameButton 
              onClick={handleUpdateName}
              theme={theme}
            >
              Update
            </UpdateNameButton>
          </PlayerName>
          
          <ConnectionStatus connected={isConnected}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </ConnectionStatus>
        </PlayerInfo>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'join'} 
            onClick={() => setActiveTab('join')}
            theme={theme}
          >
            Join Game
          </Tab>
          <Tab 
            active={activeTab === 'create'} 
            onClick={() => setActiveTab('create')}
            theme={theme}
          >
            Create Game
          </Tab>
        </TabContainer>
        
        {activeTab === 'join' ? (
          <>
            <Subtitle theme={theme}>Available Games</Subtitle>
            <RoomList theme={theme}>
              {gameRooms && gameRooms.length > 0 ? (
                gameRooms.map(room => (
                  <RoomCard key={room.id} theme={theme}>
                    <RoomInfo>
                      <RoomName theme={theme}>{room.name}</RoomName>
                      <RoomDetails theme={theme}>
                        <RoomDetail>
                          <span>Grid:</span>
                          <span>{`${room.settings.gridSize.rows}x${room.settings.gridSize.cols}`}</span>
                        </RoomDetail>
                        <RoomDetail>
                          <span>Players:</span>
                          <span>{`${room.players.length}/${room.settings.playerCount}`}</span>
                        </RoomDetail>
                        <RoomDetail>
                          <span>Status:</span>
                          <span>{room.gameState.status}</span>
                        </RoomDetail>
                      </RoomDetails>
                    </RoomInfo>
                    <JoinButton 
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.players.length >= room.settings.playerCount || room.gameState.status !== 'waiting'}
                      theme={theme}
                    >
                      Join
                    </JoinButton>
                  </RoomCard>
                ))
              ) : (
                <NoRoomsMessage theme={theme}>
                  No game rooms available. Create one to get started!
                </NoRoomsMessage>
              )}
            </RoomList>
          </>
        ) : (
          <>
            <Subtitle theme={theme}>Create New Game</Subtitle>
            <CreateRoomForm onSubmit={handleCreateRoom}>
              <FormGroup>
                <Label theme={theme}>Room Name</Label>
                <Input 
                  type="text" 
                  value={roomName} 
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  theme={theme}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label theme={theme}>Grid Size</Label>
                <Select 
                  value={JSON.stringify(selectedGridSize)} 
                  onChange={(e) => setSelectedGridSize(JSON.parse(e.target.value))}
                  theme={theme}
                >
                  {gridSizeOptions.map(option => (
                    <option key={option.label} value={JSON.stringify(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label theme={theme}>Number of Players</Label>
                <Select 
                  value={selectedPlayerCount} 
                  onChange={(e) => setSelectedPlayerCount(Number(e.target.value))}
                  theme={theme}
                >
                  {playerCountOptions.map(count => (
                    <option key={count} value={count}>
                      {count} Players
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <Button 
                type="submit"
                theme={theme}
                disabled={!isConnected}
              >
                Create Game
              </Button>
            </CreateRoomForm>
          </>
        )}
        
        <BackButton 
          onClick={onBack}
          theme={theme}
        >
          Back to Menu
        </BackButton>
      </Content>
    </Container>
  );
};

export default MultiplayerLobby; 