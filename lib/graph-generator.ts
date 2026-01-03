import { Ball, BallEvolutionNode, BallState, EdgeState, BallNodeData } from '@/types/ball';
import { Node, Edge } from 'reactflow';

export interface BallNode extends Node {
  data: BallNodeData;
}

export function generateEvolutionGraph(balls: Ball[]): { nodes: BallNode[]; edges: Edge[] } {
  const nodes: BallNode[] = [];
  const edges: Edge[] = [];

  // Separate base balls and evolved balls
  const baseBalls = balls.filter(b => b.type === 'BASE');
  const evolvedBalls = balls.filter(b => b.type === 'EVOLVED');

  // Layout configuration
  const BASE_LAYER_Y = 50;
  const EVOLVED_LAYER_START_Y = 300;
  const HORIZONTAL_SPACING = 200;
  const VERTICAL_SPACING = 200;

  // Create base ball nodes - arrange in a grid
  const baseBallsPerRow = 6;
  baseBalls.forEach((ball, index) => {
    const row = Math.floor(index / baseBallsPerRow);
    const col = index % baseBallsPerRow;

    nodes.push({
      id: ball.id,
      type: 'ballNode',
      position: {
        x: col * HORIZONTAL_SPACING,
        y: BASE_LAYER_Y + row * VERTICAL_SPACING
      },
      data: {
        ball,
        state: BallState.UNSELECTED,
        missingIngredients: []
      }
    });
  });

  // Create evolved ball nodes
  // Position them based on their parent balls
  evolvedBalls.forEach((ball, index) => {
    let posX = 0;
    let posY = EVOLVED_LAYER_START_Y;

    if (ball.recipe && ball.recipe.length > 0) {
      // Find parent nodes and position between them
      const parentNodes = ball.recipe
        .map(parentId => nodes.find(n => n.id === parentId))
        .filter(n => n !== undefined);

      if (parentNodes.length > 0) {
        // Average position of parents
        posX = parentNodes.reduce((sum, node) => sum + node.position.x, 0) / parentNodes.length;
        posY = EVOLVED_LAYER_START_Y + Math.floor(index / 4) * VERTICAL_SPACING;
      }
    }

    // Add some offset to avoid overlapping
    const offset = (index % 3) * 30 - 30;

    nodes.push({
      id: ball.id,
      type: 'ballNode',
      position: {
        x: posX + offset,
        y: posY
      },
      data: {
        ball,
        state: BallState.UNSELECTED,
        missingIngredients: []
      }
    });

    // Create edges from parent balls to this ball
    if (ball.recipe) {
      ball.recipe.forEach((parentId, idx) => {
        edges.push({
          id: `${parentId}-${ball.id}-${idx}`,
          source: parentId,
          target: ball.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: getElementColor(ball.element), strokeWidth: 2 }
        });
      });
    }
  });

  return { nodes, edges };
}

/**
 * Compute which evolved balls can be reached from owned balls
 * Handles multi-stage evolution (recursive dependencies)
 */
/**
 * Get all recipes for a ball (primary + alternatives)
 */
export function getAllRecipes(ball: Ball): string[][] {
  const recipes: string[][] = [];
  if (ball.recipe) {
    recipes.push(ball.recipe);
  }
  if (ball.alternativeRecipes) {
    recipes.push(...ball.alternativeRecipes);
  }
  return recipes;
}

export function computeReachableBalls(
  ownedBallIds: Set<string>,
  allBalls: Ball[]
): Set<string> {
  const reachable = new Set<string>(ownedBallIds);
  let changed = true;

  while (changed) {
    changed = false;

    for (const ball of allBalls) {
      // Skip if already reachable
      if (reachable.has(ball.id)) continue;

      // Get all recipes (primary + alternatives)
      const allRecipes = getAllRecipes(ball);
      if (allRecipes.length === 0) continue;

      // Check if ANY recipe has all ingredients reachable
      const canBeCreated = allRecipes.some(recipe =>
        recipe.every(ingredientId => reachable.has(ingredientId))
      );

      if (canBeCreated) {
        reachable.add(ball.id);
        changed = true;
      }
    }
  }

  return reachable;
}

/**
 * Determine the state of each ball based on ownership
 */
export function computeBallStates(
  ownedBallIds: Set<string>,
  allBalls: Ball[]
): Map<string, BallState> {
  const states = new Map<string, BallState>();
  const reachable = computeReachableBalls(ownedBallIds, allBalls);

  for (const ball of allBalls) {
    if (ownedBallIds.has(ball.id)) {
      states.set(ball.id, BallState.OWNED);
    } else if (reachable.has(ball.id) && !ownedBallIds.has(ball.id)) {
      // Can be evolved from owned balls
      states.set(ball.id, BallState.CANDIDATE);
    } else {
      states.set(ball.id, BallState.UNSELECTED);
    }
  }

  return states;
}

/**
 * Compute which ingredients are missing for each ball
 */
export function computeMissingIngredients(
  ball: Ball,
  ownedBallIds: Set<string>
): string[] {
  if (!ball.recipe) return [];

  return ball.recipe.filter(ingredientId => !ownedBallIds.has(ingredientId));
}

/**
 * Compute the number of evolutions each ball can be part of
 * Returns a map of ballId -> number of evolved balls that use this ball as an ingredient
 * Counts each evolved ball only once even if it has multiple recipes
 */
export function computeEvolutionCounts(allBalls: Ball[]): Map<string, number> {
  const evolutionCounts = new Map<string, number>();

  // Initialize all balls with 0
  allBalls.forEach(ball => evolutionCounts.set(ball.id, 0));

  // Count how many evolutions each ball is used in
  const evolvedBalls = allBalls.filter(b => b.type === 'EVOLVED');

  for (const evolvedBall of evolvedBalls) {
    // Get all recipes for this evolved ball
    const recipes = getAllRecipes(evolvedBall);
    if (recipes.length === 0) continue;

    // Track which ingredients we've already counted for this evolved ball
    // (to avoid counting same evolved ball multiple times for same ingredient)
    const countedIngredients = new Set<string>();

    for (const recipe of recipes) {
      for (const ingredientId of recipe) {
        if (countedIngredients.has(ingredientId)) continue;
        countedIngredients.add(ingredientId);

        const currentCount = evolutionCounts.get(ingredientId) || 0;
        evolutionCounts.set(ingredientId, currentCount + 1);
      }
    }
  }

  return evolutionCounts;
}

/**
 * Compute candidate partners for base balls
 * A base ball is a candidate partner if:
 * - It's not owned
 * - There's an evolved ball where:
 *   - ALL ingredients are BASE balls (no evolved ingredients required)
 *   - At least one ingredient is owned
 *   - This base ball is one of the missing ingredients
 * 
 * This does NOT include recursive evolutions like:
 * - Nuclear Bomb = Bomb + Poison (Bomb is evolved, so not direct)
 * Only direct base+base combinations count as candidate partners.
 * 
 * Considers all recipes (primary + alternatives) for each evolved ball.
 */
export function computeCandidatePartners(
  ownedBallIds: Set<string>,
  allBalls: Ball[]
): Map<string, string[]> {
  const candidatePartners = new Map<string, string[]>(); // ballId -> possible evolution names

  // Only process if there are owned balls
  if (ownedBallIds.size === 0) return candidatePartners;

  // Find evolved balls
  const evolvedBalls = allBalls.filter(b => b.type === 'EVOLVED');

  for (const evolvedBall of evolvedBalls) {
    // Get all recipes for this evolved ball
    const recipes = getAllRecipes(evolvedBall);
    if (recipes.length === 0) continue;

    // Check each recipe
    for (const recipe of recipes) {
      // Check if ALL ingredients are base balls
      const allIngredientsAreBase = recipe.every(ingredientId => {
        const ingredientBall = allBalls.find(b => b.id === ingredientId);
        return ingredientBall && ingredientBall.type === 'BASE';
      });

      if (!allIngredientsAreBase) continue; // Skip evolutions that require evolved balls

      // Check if at least one ingredient is owned
      const hasOwnedIngredient = recipe.some(id => ownedBallIds.has(id));
      if (!hasOwnedIngredient) continue;

      // Find base balls in the recipe that are NOT owned (these are candidate partners)
      for (const ingredientId of recipe) {
        if (ownedBallIds.has(ingredientId)) continue; // Skip owned balls

        // This base ball is a candidate partner for this evolution
        const evolutions = candidatePartners.get(ingredientId) || [];
        if (!evolutions.includes(evolvedBall.name)) {
          evolutions.push(evolvedBall.name);
        }
        candidatePartners.set(ingredientId, evolutions);
      }
    }
  }

  return candidatePartners;
}

/**
 * Check if an evolved ball uses any owned ball in its recipe (recursively)
 * Also returns true if the ball itself is owned
 * Considers all recipes (primary + alternatives)
 */
function isRelatedToOwnedBalls(
  ball: Ball,
  ownedBallIds: Set<string>,
  allBalls: Ball[],
  visitedCache: Map<string, boolean> = new Map()
): boolean {
  // Check cache to avoid recomputation
  if (visitedCache.has(ball.id)) {
    return visitedCache.get(ball.id)!;
  }

  // If this ball is owned, it's definitely related
  if (ownedBallIds.has(ball.id)) {
    visitedCache.set(ball.id, true);
    return true;
  }

  // Get all recipes
  const recipes = getAllRecipes(ball);

  // Base balls are not "related" unless owned (already checked above)
  if (ball.type === 'BASE' || recipes.length === 0) {
    visitedCache.set(ball.id, false);
    return false;
  }

  // Check if any recipe has any ingredient that is owned or related to owned balls
  for (const recipe of recipes) {
    for (const ingredientId of recipe) {
      if (ownedBallIds.has(ingredientId)) {
        // Direct ingredient is owned
        visitedCache.set(ball.id, true);
        return true;
      }

      // Check if ingredient is itself related to owned balls
      const ingredientBall = allBalls.find(b => b.id === ingredientId);
      if (ingredientBall && isRelatedToOwnedBalls(ingredientBall, ownedBallIds, allBalls, visitedCache)) {
        visitedCache.set(ball.id, true);
        return true;
      }
    }
  }

  visitedCache.set(ball.id, false);
  return false;
}

/**
 * Filter balls to show based on owned balls
 * Initial state: Show only base balls
 * After selection: Show base balls + evolved balls related to owned balls + owned evolved balls
 *                  + intermediate evolved balls needed for related evolved balls
 */
export function getVisibleBalls(
  ownedBallIds: Set<string>,
  allBalls: Ball[]
): Ball[] {
  // If nothing owned, show only base balls
  if (ownedBallIds.size === 0) {
    return allBalls.filter(b => b.type === 'BASE');
  }

  const visitedCache = new Map<string, boolean>();
  const visibleIds = new Set<string>();

  // Always show all base balls
  allBalls.filter(b => b.type === 'BASE').forEach(b => visibleIds.add(b.id));

  // Find all evolved balls related to owned balls
  const relatedEvolvedBalls = allBalls.filter(ball => {
    if (ball.type !== 'EVOLVED') return false;
    if (ownedBallIds.has(ball.id)) return true; // Always show owned
    return isRelatedToOwnedBalls(ball, ownedBallIds, allBalls, visitedCache);
  });

  // Add related evolved balls and their intermediate evolved ingredients
  function addBallAndIntermediates(ball: Ball, visited: Set<string> = new Set()) {
    if (visited.has(ball.id)) return;
    visited.add(ball.id);

    visibleIds.add(ball.id);

    // If this ball has evolved ingredients, add them too (they're intermediate steps)
    // Check all recipes (primary + alternatives)
    const recipes = getAllRecipes(ball);
    for (const recipe of recipes) {
      for (const ingredientId of recipe) {
        const ingredientBall = allBalls.find(b => b.id === ingredientId);
        if (ingredientBall && ingredientBall.type === 'EVOLVED') {
          addBallAndIntermediates(ingredientBall, visited);
        }
      }
    }
  }

  // Process all related evolved balls
  relatedEvolvedBalls.forEach(ball => addBallAndIntermediates(ball));

  return allBalls.filter(ball => visibleIds.has(ball.id));
}

/**
 * Calculate evolution depth for each ball (0 for base, 1+ for evolved)
 */
function calculateBallDepth(ball: Ball, allBalls: Ball[], depthCache: Map<string, number> = new Map()): number {
  // Check cache first
  if (depthCache.has(ball.id)) {
    return depthCache.get(ball.id)!;
  }

  // Base balls have depth 0
  if (ball.type === 'BASE' || !ball.recipe || ball.recipe.length === 0) {
    depthCache.set(ball.id, 0);
    return 0;
  }

  // Evolved ball: depth = max(parent depths) + 1
  let maxParentDepth = 0;
  for (const parentId of ball.recipe) {
    const parentBall = allBalls.find(b => b.id === parentId);
    if (parentBall) {
      const parentDepth = calculateBallDepth(parentBall, allBalls, depthCache);
      maxParentDepth = Math.max(maxParentDepth, parentDepth);
    }
  }

  const depth = maxParentDepth + 1;
  depthCache.set(ball.id, depth);
  return depth;
}

/**
 * Enhanced graph generation with ball states and layered layout
 * @param balls - All balls to display as nodes
 * @param ownedBallIds - Set of owned ball IDs
 * @param relevantBalls - Optional subset of balls that should have edges (for "Show All" mode filtering)
 */
export function generateInteractiveEvolutionGraph(
  balls: Ball[],
  ownedBallIds: Set<string>,
  relevantBalls?: Ball[]
): { nodes: BallNode[]; edges: Edge[] } {
  const ballStates = computeBallStates(ownedBallIds, balls);
  const candidatePartners = computeCandidatePartners(ownedBallIds, balls);
  const evolutionCounts = computeEvolutionCounts(balls);
  const nodes: BallNode[] = [];
  const edges: Edge[] = [];

  // Create node ID set for edge filtering
  const nodeIds = new Set(balls.map(b => b.id));
  
  // Create set of ball IDs that should have edges (if relevantBalls provided)
  const relevantIds = relevantBalls ? new Set(relevantBalls.map(b => b.id)) : nodeIds;

  // Layout configuration
  const BASE_LAYER_Y = 700; // Base balls at bottom
  const VERTICAL_SPACING = 280; // Space between layers
  const HORIZONTAL_SPACING = 190; // Space between balls in same layer
  const NODE_WIDTH = 170; // Node width including padding

  // Calculate depth for all balls
  const depthCache = new Map<string, number>();
  balls.forEach(ball => calculateBallDepth(ball, balls, depthCache));

  // Group balls by depth
  const ballsByDepth = new Map<number, Ball[]>();
  balls.forEach(ball => {
    const depth = depthCache.get(ball.id) || 0;
    if (!ballsByDepth.has(depth)) {
      ballsByDepth.set(depth, []);
    }
    ballsByDepth.get(depth)!.push(ball);
  });

  // Get max depth to calculate layer positions
  const maxDepth = Math.max(...Array.from(depthCache.values()));

  // Store node positions for parent lookup
  const nodePositions = new Map<string, { x: number; y: number }>();
  
  // Store layer bounds to center base balls later
  const layerBounds = new Map<number, { minX: number; maxX: number }>();

  // First pass: position all nodes
  for (let depth = 0; depth <= maxDepth; depth++) {
    const layerBalls = ballsByDepth.get(depth) || [];

    // Calculate Y position (higher depth = higher on screen = lower Y value)
    const layerY = BASE_LAYER_Y - (depth * VERTICAL_SPACING);

    // For evolved balls, calculate ideal positions based on parents first
    const ballPositions: { ball: Ball; idealX: number }[] = [];

    layerBalls.forEach((ball) => {
      let idealX = 0;

      if (depth === 0) {
        // Base balls will be evenly distributed later
        idealX = 0; // Placeholder
      } else {
        // Evolved balls: position based on parent positions
        if (ball.recipe && ball.recipe.length > 0) {
          const parentPositions = ball.recipe
            .map(parentId => nodePositions.get(parentId))
            .filter(pos => pos !== undefined);

          if (parentPositions.length > 0) {
            // Average X position of parents
            idealX = parentPositions.reduce((sum, pos) => sum + pos.x, 0) / parentPositions.length;
          }
        }
      }

      ballPositions.push({ ball, idealX });
    });

    // For base balls (depth 0), distribute evenly starting from 0
    if (depth === 0) {
      ballPositions.forEach((item, index) => {
        item.idealX = index * HORIZONTAL_SPACING;
      });
    } else {
      // Sort evolved balls by their ideal X position
      ballPositions.sort((a, b) => a.idealX - b.idealX);

      // Place nodes with guaranteed minimum spacing
      layoutLayerWithoutOverlap(ballPositions, NODE_WIDTH);
    }

    // Calculate layer bounds
    if (ballPositions.length > 0) {
      const xValues = ballPositions.map(bp => bp.idealX);
      layerBounds.set(depth, {
        minX: Math.min(...xValues),
        maxX: Math.max(...xValues)
      });
    }

    // Store positions for this pass
    ballPositions.forEach(({ ball, idealX }) => {
      const position = { x: idealX, y: layerY };
      nodePositions.set(ball.id, position);
    });
  }

  // Calculate the center of all evolved layers combined
  let allEvolvedMinX = Infinity;
  let allEvolvedMaxX = -Infinity;
  for (let depth = 1; depth <= maxDepth; depth++) {
    const bounds = layerBounds.get(depth);
    if (bounds) {
      allEvolvedMinX = Math.min(allEvolvedMinX, bounds.minX);
      allEvolvedMaxX = Math.max(allEvolvedMaxX, bounds.maxX);
    }
  }

  // Only apply offset if there are evolved balls to center against
  const hasEvolvedBalls = allEvolvedMinX !== Infinity && allEvolvedMaxX !== -Infinity;
  
  if (hasEvolvedBalls) {
    const evolvedCenter = (allEvolvedMinX + allEvolvedMaxX) / 2;

    // Calculate base balls center
    const baseBounds = layerBounds.get(0);
    const baseCenter = baseBounds ? (baseBounds.minX + baseBounds.maxX) / 2 : 0;

    // Calculate offset to center base balls under evolved balls
    const baseOffset = evolvedCenter - baseCenter;

    // Apply offset to base ball positions
    const baseBalls = ballsByDepth.get(0) || [];
    baseBalls.forEach(ball => {
      const pos = nodePositions.get(ball.id);
      if (pos) {
        pos.x += baseOffset;
      }
    });
  }

  // Create nodes with final positions
  for (let depth = 0; depth <= maxDepth; depth++) {
    const layerBalls = ballsByDepth.get(depth) || [];
    const layerY = BASE_LAYER_Y - (depth * VERTICAL_SPACING);

    layerBalls.forEach((ball) => {
      const pos = nodePositions.get(ball.id);
      const position = pos || { x: 0, y: layerY };

      // Check if this ball is a candidate partner
      const possibleEvolutions = candidatePartners.get(ball.id);
      const isCandidatePartner = possibleEvolutions && possibleEvolutions.length > 0;

      // Check if this evolved ball can be created (any recipe has all ingredients owned, not already owned)
      const recipes = getAllRecipes(ball);
      const canEvolve = ball.type === 'EVOLVED' 
        && recipes.length > 0
        && recipes.some(recipe => recipe.every(id => ownedBallIds.has(id)))
        && !ownedBallIds.has(ball.id);

      nodes.push({
        id: ball.id,
        type: 'ballNode',
        position,
        draggable: false, // Nodes are not movable
        zIndex: 10, // Ensure nodes render above edges
        data: {
          ball,
          state: ballStates.get(ball.id) || BallState.UNSELECTED,
          missingIngredients: computeMissingIngredients(ball, ownedBallIds),
          isCandidatePartner: isCandidatePartner || false,
          possibleEvolutions: possibleEvolutions || [],
          canEvolve,
          evolutionCount: evolutionCounts.get(ball.id) || 0
        }
      });
    });
  }

  // Create edges only for relevant balls (not for balls only visible due to "Show All")
  // Track edges we've already created to avoid duplicates
  const createdEdges = new Set<string>();

  balls.forEach(ball => {
    // Only create edges for balls that are in the relevant set
    if (!relevantIds.has(ball.id)) return;
    
    // Get all recipes (primary + alternatives)
    const recipes = getAllRecipes(ball);
    
    // Also mark as complete if the evolved ball itself is already owned
    // (the evolution was already completed)
    const isEvolvedBallOwned = ownedBallIds.has(ball.id);

    recipes.forEach((recipe, recipeIdx) => {
      // Check if ALL ingredients are owned for this specific recipe
      const allIngredientsOwned = recipe.every(id => ownedBallIds.has(id));

      recipe.forEach((parentId, idx) => {
        if (!nodeIds.has(parentId)) return; // Skip if parent not visible

        // Create unique edge key to avoid duplicates
        const edgeKey = `${parentId}-${ball.id}`;
        if (createdEdges.has(edgeKey)) return;
        createdEdges.add(edgeKey);

        // Edge is complete when ALL ingredients in ANY recipe are owned OR the evolved ball is already owned
        const anyRecipeComplete = recipes.some(r => r.every(id => ownedBallIds.has(id)));
        const edgeState = (anyRecipeComplete || isEvolvedBallOwned) ? EdgeState.COMPLETE : EdgeState.PARTIAL;

        edges.push({
          // Include state in ID to force re-render when state changes
          id: `${parentId}-${ball.id}-${recipeIdx}-${idx}-${edgeState}`,
          source: parentId,
          target: ball.id,
          type: 'default', // 'default' uses bezier curves
          animated: edgeState === EdgeState.COMPLETE,
          zIndex: 0, // Ensure edges render behind nodes
          style: {
            // Complete paths are green and solid, partial paths use element color and dashed
            stroke: edgeState === EdgeState.COMPLETE ? '#4ade80' : getElementColor(ball.element),
            strokeWidth: edgeState === EdgeState.COMPLETE ? 3 : 2,
            strokeDasharray: edgeState === EdgeState.COMPLETE ? 'none' : '5,5'
          }
        });
      });
    });
  });

  return { nodes, edges };
}

/**
 * Layout a layer of nodes without overlap while trying to stay close to ideal positions
 */
function layoutLayerWithoutOverlap(
  ballPositions: { ball: Ball; idealX: number }[],
  nodeWidth: number
): void {
  if (ballPositions.length === 0) return;

  // Place nodes ensuring no overlap (left to right)
  // Each node must be at least nodeWidth apart from the previous
  for (let i = 1; i < ballPositions.length; i++) {
    const prev = ballPositions[i - 1];
    const curr = ballPositions[i];
    
    // Ensure minimum spacing from previous node
    const minX = prev.idealX + nodeWidth;
    if (curr.idealX < minX) {
      curr.idealX = minX;
    }
  }
}

export function getElementColor(element?: string): string {
  const colorMap: Record<string, string> = {
    fire: '#ff4500',
    ice: '#4da6ff',
    lightning: '#ffd700',
    blood: '#8b0000',
    poison: '#9370db',
    dark: '#2f2f2f',
    light: '#fffacd',
    spirit: '#e6e6fa',
    metal: '#778899',
    demon: '#8b008b',
    laser: '#00ffff',
    earth: '#8b4513',
    wind: '#87ceeb',
    charm: '#ff69b4',
    creature: '#228b22',
    bio: '#00ff00',
    shadow: '#4b0082',
    rage: '#dc143c',
    void: '#000000',
    explosive: '#ff8c00',
    twilight: '#9370db',
    'frost-fire': '#6495ed',
    parasite: '#556b2f',
    nuclear: '#adff2f',
    nature: '#32cd32'
  };

  return colorMap[element || ''] || '#888888';
}

export function getNodeStyle(
  ball: Ball,
  state?: BallState,
  isCandidatePartner?: boolean
): React.CSSProperties {
  const baseColor = getElementColor(ball.element);
  const isBaseBall = ball.type === 'BASE';

  // Base style using non-shorthand properties only
  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${baseColor}22 0%, ${baseColor}44 100%)`,
    borderRadius: '12px',
    padding: '12px',
    minWidth: '150px',
    color: '#fff',
    boxShadow: `0 4px 6px ${baseColor}33`,
  };

  // Base balls: no border by default (only background)
  if (isBaseBall) {
    style.borderWidth = '0px';
    style.borderStyle = 'none';
    style.borderColor = 'transparent';
    
    // Candidate partner: colorful animated border (handled by CSS class)
    // Just set initial border so animation can take over
    if (isCandidatePartner && state !== BallState.OWNED) {
      style.borderWidth = '3px';
      style.borderStyle = 'solid';
      style.borderColor = '#ec4899'; // Initial color, will be animated by CSS
    }
    
    // Owned base ball: green border
    if (state === BallState.OWNED) {
      style.borderWidth = '3px';
      style.borderStyle = 'solid';
      style.borderColor = '#22c55e';
      style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6), 0 4px 6px rgba(0, 0, 0, 0.3)';
      style.transform = 'scale(1.02)';
    }
  } else {
    // Evolved balls: keep border
    style.borderWidth = '2px';
    style.borderStyle = 'solid';
    style.borderColor = baseColor;

    // Owned evolved ball
    if (state === BallState.OWNED) {
      style.borderWidth = '3px';
      style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6), 0 4px 6px rgba(0, 0, 0, 0.3)';
      style.transform = 'scale(1.02)';
    }

    // Candidate evolved ball (can be created from owned balls)
    if (state === BallState.CANDIDATE) {
      style.borderWidth = '3px';
      style.borderColor = '#3b82f6';
      style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)';
    }

    // Unselected evolved ball
    if (state === BallState.UNSELECTED) {
      style.opacity = 0.4;
      style.filter = 'grayscale(0.7)';
    }
  }

  return style;
}
