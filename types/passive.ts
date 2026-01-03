export enum PassiveType {
  BASE = 'BASE',
  EVOLVED = 'EVOLVED'
}

export enum PassiveState {
  UNSELECTED = 'UNSELECTED',
  OWNED = 'OWNED',
  CANDIDATE = 'CANDIDATE'
}

export interface Passive {
  id: string;
  name: string;
  type: PassiveType;
  description: string;
  recipe?: string[]; // IDs of passives needed to create this passive (for evolved)
  alternativeRecipes?: string[][]; // Alternative ways to create this passive
  requirement?: string; // Special requirement to obtain this passive
  imageUrl?: string; // Path to passive image
}

export interface PassiveNodeData {
  passive: Passive;
  state: PassiveState;
  missingIngredients?: string[];
  isCandidatePartner?: boolean;
  possibleEvolutions?: string[];
  canEvolve?: boolean;
  evolutionCount?: number;
  onSelect?: (passive: Passive) => void;
  onToggleOwned?: (passiveId: string) => void;
  onEvolve?: (passive: Passive) => void;
}
