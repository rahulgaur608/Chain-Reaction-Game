# Chain Reaction Game

A strategic multiplayer game where players compete through explosive chain reactions. Built with React and styled-components.

## Features

- Modern neumorphic UI design
- Light/Dark theme support
- Multiple grid size options (6x6, 8x8, 9x6, 10x10, 12x8, 15x10)
- 2-4 player support
- Smooth animations and transitions
- Responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahulgaur608/Chain-Reaction-Game-.git
```

2. Navigate to the project directory:
```bash
cd chain-reaction-game
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to Play

1. Select grid size and number of players
2. Players take turns placing orbs in cells
3. When a cell reaches its capacity, it explodes:
   - Corner cells: 2 orbs
   - Edge cells: 3 orbs
   - Center cells: 4 orbs
4. Explosions send orbs to adjacent cells
5. Chain reactions occur when receiving cells reach capacity
6. Last player with orbs on the board wins

## Built With

- React
- styled-components
- Modern JavaScript (ES6+)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
