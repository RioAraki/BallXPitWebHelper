export enum BallType {
  BASE = 'BASE',
  EVOLVED = 'EVOLVED',
  FUSED = 'FUSED'
}

export enum BallCategory {
  DAMAGE = 'DAMAGE',
  STATUS = 'STATUS',
  UTILITY = 'UTILITY',
  SPECIAL = 'SPECIAL'
}

export enum BallState {
  UNSELECTED = 'UNSELECTED',
  OWNED = 'OWNED',
  CANDIDATE = 'CANDIDATE'
}

export enum EdgeState {
  COMPLETE = 'COMPLETE',
  PARTIAL = 'PARTIAL'
}

export interface Ball {
  id: string;
  name: string;
  type: BallType;
  category: BallCategory;
  description: string;
  recipe?: string[]; // IDs of balls needed to create this ball (primary recipe)
  alternativeRecipes?: string[][]; // Alternative ways to create this ball
  stats?: {
    damage?: string;
    duration?: string;
    chance?: string;
    cooldown?: string;
    maxStacks?: string;
    radius?: string;
    [key: string]: string | undefined;
  };
  element?: string; // e.g., 'fire', 'ice', 'lightning', 'dark', etc.
  imageUrl?: string; // Path to ball image
}

export interface BallEvolutionNode {
  id: string;
  ball: Ball;
  position: { x: number; y: number };
  parents?: string[]; // IDs of parent balls
  children?: string[]; // IDs of child balls
}

export interface BallNodeData {
  ball: Ball;
  state: BallState;
  missingIngredients?: string[];
  isCandidatePartner?: boolean; // True if this base ball can combine with owned balls
  possibleEvolutions?: string[]; // Names of balls that can be evolved with this partner
  canEvolve?: boolean; // True if all ingredients are owned and can evolve
  evolutionCount?: number; // Number of evolutions this ball can be part of
  onSelect?: (ball: Ball) => void;
  onToggleOwned?: (ballId: string) => void;
  onEvolve?: (ball: Ball) => void; // Called when evolving (consumes ingredients)
}
