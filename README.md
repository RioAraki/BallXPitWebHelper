# Ball X Pit Web Helper

A comprehensive web helper for the game Ball X Pit, featuring interactive evolution visualization for both balls and passives.

> **⚠️ Data Disclaimer**
> All game data is sourced from [ballpit.fandom.com](https://ballpit.fandom.com) and is not guaranteed to be the latest or correct. Please verify critical information with the official game.

## Features

### 🎱 Balls Tab - Interactive Ball Evolution

An interactive, zoomable graph showing all ball evolution paths in Ball X Pit.

**Includes:**
- 18 Base Balls (Bleed, Burn, Freeze, Ghost, Iron, Lightning, Poison, and more)
- 42 Evolved Balls (created through fusion of base balls)
- Interactive node graph with layered layout (organized by evolution depth)
- Visual states: Owned (green), Candidate (blue pulsing), Unselected (dimmed)
- Detailed ball information panel

**Interactions:**
- Click balls to mark as owned and see available evolutions
- Only shows relevant evolution paths based on owned balls
- Pan and zoom the graph to explore
- Click 'i' button to view detailed information
- See evolution recipes and required ingredients
- View all stats and abilities

### ⚡ Passives Tab - Interactive Passive Evolution

Similar interactive system for passive abilities in Ball X Pit.

**Features:**
- Passive evolution visualization
- Mark owned passives
- See available passive combinations
- Detailed passive information

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **ReactFlow** - Interactive graph visualization
- **Data source:** [Ball Pit Fandom Wiki](https://ballpit.fandom.com) (community-maintained, may not reflect latest game version)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
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
BallXPitWebHelper/
├── app/
│   ├── globals.css          # Global styles + animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── MainContent.tsx      # Tab container (Balls/Passives)
│   ├── BallEvolution.tsx    # Balls tab - evolution graph
│   ├── PassiveEvolution.tsx # Passives tab - evolution graph
│   ├── BallNode.tsx         # Custom ball node component
│   └── BallDetailPanel.tsx  # Ball/passive details sidebar
├── data/
│   └── balls.ts             # All ball data (60 balls total)
├── lib/
│   └── graph-generator.ts   # Graph layout, algorithms, and utilities
├── types/
│   └── ball.ts              # TypeScript types
└── public/
    └── balls/               # Ball images (60 PNG files)
```

## Data Structure

### Balls

Each ball contains:
- **Name & ID**: Unique identifier and display name
- **Type**: BASE or EVOLVED
- **Category**: DAMAGE, STATUS, UTILITY, or SPECIAL
- **Element**: Fire, Ice, Lightning, Blood, etc.
- **Description**: What the ball does
- **Stats**: Damage, duration, chance, cooldown, etc.
- **Recipe**: Parent balls needed for evolution (if applicable)
- **Alternative Recipes**: Multiple ways to create the same evolved ball
- **Image URL**: Path to ball icon

### Passives

Similar structure for passive abilities with their own evolution paths.

## Key Features

### Smart Evolution Filtering
- Only shows balls/passives related to what you own
- Layered layout organizes items by evolution depth
- Candidate partners highlighted with rainbow glow
- Visual indicators for missing ingredients

### Visual States
- **Owned** (green checkmark): Items you have
- **Ready to Evolve** (green arrow, bouncing): Click to evolve immediately
- **Candidate Partner** (rainbow glow): Base items that can combine with owned items
- **Available Evolution** (blue): Evolved items you can create

## Future Enhancements

Planned features:
- Build simulator
- Character information
- Run tracker
- Item database
- Import/export saved progress

## License

This project is for educational and fan purposes. Ball X Pit is developed by Kenny Sun and published by Devolver Digital.

## Credits

- Game data sourced from [Ball Pit Fandom Wiki](https://ballpit.fandom.com) (community-maintained)
- Ball X Pit is developed by Kenny Sun and published by Devolver Digital
- Created with Claude Code

## Contributing

If you notice outdated or incorrect game data, please:
1. Verify the correct information in the latest game version
2. Check [ballpit.fandom.com](https://ballpit.fandom.com) for updates
3. Submit an issue or pull request with corrections
