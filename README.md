# Ball X Pit Web Helper

A comprehensive web helper for the game Ball X Pit, featuring an interactive ball evolution visualization system.

## Features

### Ball Evolution Visualization

An interactive, zoomable graph showing all ball evolution paths in Ball X Pit.

**Includes:**
- 18 Base Balls (Bleed, Burn, Freeze, Ghost, Iron, Lightning, Poison, and more)
- 42 Evolved Balls (created through fusion of base balls)
- Interactive node graph with animated connections
- Detailed ball information panel
- Filter by ball type (All, Base, Evolved)

**Interactions:**
- Click on any ball to view detailed information
- Pan and zoom the graph to explore
- See evolution recipes and paths
- View all stats and abilities

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ReactFlow** - Interactive graph visualization
- **Data sourced from** [Ball Pit Wiki](https://ballpit.fandom.com/wiki/Balls)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd ball-x-pit-helper
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ball-x-pit-helper/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── BallEvolution.tsx    # Main graph component
│   ├── BallNode.tsx         # Custom ball node component
│   └── BallDetailPanel.tsx  # Ball details sidebar
├── data/
│   └── balls.ts             # All ball data (60 balls total)
├── lib/
│   └── graph-generator.ts   # Graph layout and utilities
└── types/
    └── ball.ts              # TypeScript types
```

## Data Structure

Each ball contains:
- **Name & ID**: Unique identifier and display name
- **Type**: BASE or EVOLVED
- **Category**: DAMAGE, STATUS, UTILITY, or SPECIAL
- **Element**: Fire, Ice, Lightning, Blood, etc.
- **Description**: What the ball does
- **Stats**: Damage, duration, chance, cooldown, etc.
- **Recipe**: Parent balls needed for evolution (if applicable)

## Features to Come

Future enhancements planned:
- Build simulator
- Character information
- Run tracker
- Item database

## License

This project is for educational and fan purposes. Ball X Pit is developed by Kenny Sun and published by Devolver Digital.

## Credits

- Game data sourced from [Ball Pit Fandom Wiki](https://ballpit.fandom.com/wiki/Balls)
- Created with Claude Code
