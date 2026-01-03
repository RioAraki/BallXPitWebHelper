import { Passive, PassiveState, PassiveNodeData } from '@/types/passive';
import { Node, Edge } from 'reactflow';

export interface PassiveNode extends Node {
  data: PassiveNodeData;
}

/**
 * Get all recipes for a passive (primary + alternatives)
 */
export function getAllPassiveRecipes(passive: Passive): string[][] {
  const recipes: string[][] = [];
  if (passive.recipe) {
    recipes.push(passive.recipe);
  }
  if (passive.alternativeRecipes) {
    recipes.push(...passive.alternativeRecipes);
  }
  return recipes;
}

/**
 * Compute which evolved passives can be reached from owned passives
 */
export function computeReachablePassives(
  ownedPassiveIds: Set<string>,
  allPassives: Passive[]
): Set<string> {
  const reachable = new Set<string>(ownedPassiveIds);
  let changed = true;

  while (changed) {
    changed = false;

    for (const passive of allPassives) {
      if (reachable.has(passive.id)) continue;

      const allRecipes = getAllPassiveRecipes(passive);
      if (allRecipes.length === 0) continue;

      const canBeCreated = allRecipes.some(recipe =>
        recipe.every(ingredientId => reachable.has(ingredientId))
      );

      if (canBeCreated) {
        reachable.add(passive.id);
        changed = true;
      }
    }
  }

  return reachable;
}

/**
 * Determine the state of each passive based on ownership
 */
export function computePassiveStates(
  ownedPassiveIds: Set<string>,
  allPassives: Passive[]
): Map<string, PassiveState> {
  const states = new Map<string, PassiveState>();
  const reachable = computeReachablePassives(ownedPassiveIds, allPassives);

  for (const passive of allPassives) {
    if (ownedPassiveIds.has(passive.id)) {
      states.set(passive.id, PassiveState.OWNED);
    } else if (reachable.has(passive.id) && !ownedPassiveIds.has(passive.id)) {
      states.set(passive.id, PassiveState.CANDIDATE);
    } else {
      states.set(passive.id, PassiveState.UNSELECTED);
    }
  }

  return states;
}

/**
 * Compute missing ingredients for a passive
 */
export function computeMissingPassiveIngredients(
  passive: Passive,
  ownedPassiveIds: Set<string>
): string[] {
  if (!passive.recipe) return [];
  return passive.recipe.filter(ingredientId => !ownedPassiveIds.has(ingredientId));
}

/**
 * Compute the number of evolutions each passive can be part of
 */
export function computePassiveEvolutionCounts(allPassives: Passive[]): Map<string, number> {
  const evolutionCounts = new Map<string, number>();

  allPassives.forEach(passive => evolutionCounts.set(passive.id, 0));

  const evolvedPassives = allPassives.filter(p => p.type === 'EVOLVED');

  for (const evolvedPassive of evolvedPassives) {
    const recipes = getAllPassiveRecipes(evolvedPassive);
    if (recipes.length === 0) continue;

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
 * Compute candidate partners for base passives
 */
export function computePassiveCandidatePartners(
  ownedPassiveIds: Set<string>,
  allPassives: Passive[]
): Map<string, string[]> {
  const candidatePartners = new Map<string, string[]>();

  if (ownedPassiveIds.size === 0) return candidatePartners;

  const evolvedPassives = allPassives.filter(p => p.type === 'EVOLVED');

  for (const evolvedPassive of evolvedPassives) {
    const recipes = getAllPassiveRecipes(evolvedPassive);
    if (recipes.length === 0) continue;

    for (const recipe of recipes) {
      // Check if ALL ingredients are base passives
      const allIngredientsAreBase = recipe.every(ingredientId => {
        const ingredientPassive = allPassives.find(p => p.id === ingredientId);
        return ingredientPassive && ingredientPassive.type === 'BASE';
      });

      if (!allIngredientsAreBase) continue;

      // Check if at least one ingredient is owned
      const hasOwnedIngredient = recipe.some(id => ownedPassiveIds.has(id));
      if (!hasOwnedIngredient) continue;

      // Find base passives in the recipe that are NOT owned
      for (const ingredientId of recipe) {
        if (ownedPassiveIds.has(ingredientId)) continue;

        const evolutions = candidatePartners.get(ingredientId) || [];
        if (!evolutions.includes(evolvedPassive.name)) {
          evolutions.push(evolvedPassive.name);
        }
        candidatePartners.set(ingredientId, evolutions);
      }
    }
  }

  return candidatePartners;
}

/**
 * Check if an evolved passive is related to owned passives
 */
function isRelatedToOwnedPassives(
  passive: Passive,
  ownedPassiveIds: Set<string>,
  allPassives: Passive[],
  visitedCache: Map<string, boolean> = new Map()
): boolean {
  if (visitedCache.has(passive.id)) {
    return visitedCache.get(passive.id)!;
  }

  if (ownedPassiveIds.has(passive.id)) {
    visitedCache.set(passive.id, true);
    return true;
  }

  const recipes = getAllPassiveRecipes(passive);

  if (passive.type === 'BASE' || recipes.length === 0) {
    visitedCache.set(passive.id, false);
    return false;
  }

  for (const recipe of recipes) {
    for (const ingredientId of recipe) {
      if (ownedPassiveIds.has(ingredientId)) {
        visitedCache.set(passive.id, true);
        return true;
      }

      const ingredientPassive = allPassives.find(p => p.id === ingredientId);
      if (ingredientPassive && isRelatedToOwnedPassives(ingredientPassive, ownedPassiveIds, allPassives, visitedCache)) {
        visitedCache.set(passive.id, true);
        return true;
      }
    }
  }

  visitedCache.set(passive.id, false);
  return false;
}

/**
 * Get visible passives based on owned passives
 */
export function getVisiblePassives(
  ownedPassiveIds: Set<string>,
  allPassives: Passive[]
): Passive[] {
  if (ownedPassiveIds.size === 0) {
    return allPassives.filter(p => p.type === 'BASE');
  }

  const visitedCache = new Map<string, boolean>();
  const visibleIds = new Set<string>();

  // Always show all base passives
  allPassives.filter(p => p.type === 'BASE').forEach(p => visibleIds.add(p.id));

  // Find all evolved passives related to owned passives
  const relatedEvolvedPassives = allPassives.filter(passive => {
    if (passive.type !== 'EVOLVED') return false;
    if (ownedPassiveIds.has(passive.id)) return true;
    return isRelatedToOwnedPassives(passive, ownedPassiveIds, allPassives, visitedCache);
  });

  // Add related evolved passives and their intermediates
  function addPassiveAndIntermediates(passive: Passive, visited: Set<string> = new Set()) {
    if (visited.has(passive.id)) return;
    visited.add(passive.id);

    visibleIds.add(passive.id);

    const recipes = getAllPassiveRecipes(passive);
    for (const recipe of recipes) {
      for (const ingredientId of recipe) {
        const ingredientPassive = allPassives.find(p => p.id === ingredientId);
        if (ingredientPassive && ingredientPassive.type === 'EVOLVED') {
          addPassiveAndIntermediates(ingredientPassive, visited);
        }
      }
    }
  }

  for (const passive of relatedEvolvedPassives) {
    addPassiveAndIntermediates(passive);
  }

  return allPassives.filter(p => visibleIds.has(p.id));
}

/**
 * Generate the passive evolution graph
 */
export function generatePassiveEvolutionGraph(
  passives: Passive[],
  ownedPassiveIds: Set<string>,
  relevantPassives: Passive[]
): { nodes: PassiveNode[]; edges: Edge[] } {
  const nodes: PassiveNode[] = [];
  const edges: Edge[] = [];

  // Compute states and helper data
  const passiveStates = computePassiveStates(ownedPassiveIds, passives);
  const candidatePartners = computePassiveCandidatePartners(ownedPassiveIds, passives);
  const evolutionCounts = computePassiveEvolutionCounts(passives);

  // Separate base and evolved passives
  const basePassivesAll = passives.filter(p => p.type === 'BASE');
  const evolvedPassives = passives.filter(p => p.type === 'EVOLVED');

  // Find which base passives can evolve (are ingredients for evolved passives)
  const evolvableIds = new Set<string>();
  for (const evolved of evolvedPassives) {
    const recipes = getAllPassiveRecipes(evolved);
    for (const recipe of recipes) {
      recipe.forEach(id => evolvableIds.add(id));
    }
  }

  // Split base passives into evolvable and non-evolvable
  const evolvableBasePassives = basePassivesAll.filter(p => evolvableIds.has(p.id));
  const nonEvolvableBasePassives = basePassivesAll.filter(p => !evolvableIds.has(p.id));

  // Layout configuration
  const nodeWidth = 140;
  const nodeHeight = 120;
  const horizontalSpacing = 20;
  const verticalSpacing = 80;
  const passivesPerRow = 9;

  // Create a set of relevant IDs for edge filtering
  const relevantIds = new Set(relevantPassives.map(p => p.id));

  // Calculate row width
  const rowWidth = passivesPerRow * (nodeWidth + horizontalSpacing) - horizontalSpacing;

  // Position evolved passives at top (row 0)
  const evolvedPositions = new Map<string, { x: number; y: number }>();
  const totalEvolvedWidth = evolvedPassives.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
  const evolvedStartX = (rowWidth - totalEvolvedWidth) / 2;

  evolvedPassives.forEach((passive, index) => {
    evolvedPositions.set(passive.id, {
      x: evolvedStartX + index * (nodeWidth + horizontalSpacing),
      y: 50
    });
  });

  // Position evolvable base passives below evolved (starting at row 1)
  const basePositions = new Map<string, { x: number; y: number }>();
  const evolvableRowCount = Math.ceil(evolvableBasePassives.length / passivesPerRow);
  
  evolvableBasePassives.forEach((passive, index) => {
    const row = Math.floor(index / passivesPerRow);
    const col = index % passivesPerRow;
    const rowItemCount = row === evolvableRowCount - 1 
      ? evolvableBasePassives.length - row * passivesPerRow 
      : passivesPerRow;
    const rowStartX = (rowWidth - (rowItemCount * (nodeWidth + horizontalSpacing) - horizontalSpacing)) / 2;
    
    basePositions.set(passive.id, {
      x: rowStartX + col * (nodeWidth + horizontalSpacing),
      y: 250 + row * (nodeHeight + verticalSpacing)
    });
  });

  // Position non-evolvable base passives below evolvable ones
  const nonEvolvableStartY = 250 + evolvableRowCount * (nodeHeight + verticalSpacing) + 50;
  
  nonEvolvableBasePassives.forEach((passive, index) => {
    const row = Math.floor(index / passivesPerRow);
    const col = index % passivesPerRow;
    const totalRows = Math.ceil(nonEvolvableBasePassives.length / passivesPerRow);
    const rowItemCount = row === totalRows - 1 
      ? nonEvolvableBasePassives.length - row * passivesPerRow 
      : passivesPerRow;
    const rowStartX = (rowWidth - (rowItemCount * (nodeWidth + horizontalSpacing) - horizontalSpacing)) / 2;
    
    basePositions.set(passive.id, {
      x: rowStartX + col * (nodeWidth + horizontalSpacing),
      y: nonEvolvableStartY + row * (nodeHeight + verticalSpacing)
    });
  });

  // Create nodes
  const nodeIds = new Set<string>();

  passives.forEach(passive => {
    nodeIds.add(passive.id);

    const position = passive.type === 'BASE' 
      ? basePositions.get(passive.id)! 
      : evolvedPositions.get(passive.id)!;

    const possibleEvolutions = candidatePartners.get(passive.id);
    const isCandidatePartner = possibleEvolutions && possibleEvolutions.length > 0;

    // Check if this evolved passive can be created
    const recipes = getAllPassiveRecipes(passive);
    const canEvolve = passive.type === 'EVOLVED'
      && recipes.length > 0
      && recipes.some(recipe => recipe.every(id => ownedPassiveIds.has(id)))
      && !ownedPassiveIds.has(passive.id);

    nodes.push({
      id: passive.id,
      type: 'passiveNode',
      position,
      draggable: false,
      zIndex: 10,
      data: {
        passive,
        state: passiveStates.get(passive.id) || PassiveState.UNSELECTED,
        missingIngredients: computeMissingPassiveIngredients(passive, ownedPassiveIds),
        isCandidatePartner: isCandidatePartner || false,
        possibleEvolutions: possibleEvolutions || [],
        canEvolve,
        evolutionCount: evolutionCounts.get(passive.id) || 0
      }
    });
  });

  // Create edges
  const createdEdges = new Set<string>();

  passives.forEach(passive => {
    if (!relevantIds.has(passive.id)) return;

    const recipes = getAllPassiveRecipes(passive);
    const isEvolvedPassiveOwned = ownedPassiveIds.has(passive.id);

    recipes.forEach((recipe, recipeIdx) => {
      const allIngredientsOwned = recipe.every(id => ownedPassiveIds.has(id));

      recipe.forEach((parentId, idx) => {
        if (!nodeIds.has(parentId)) return;

        const edgeKey = `${parentId}-${passive.id}`;
        if (createdEdges.has(edgeKey)) return;
        createdEdges.add(edgeKey);

        const anyRecipeComplete = recipes.some(r => r.every(id => ownedPassiveIds.has(id)));
        const isComplete = anyRecipeComplete || isEvolvedPassiveOwned;

        edges.push({
          id: `${parentId}-${passive.id}-${recipeIdx}-${idx}-${isComplete ? 'complete' : 'partial'}`,
          source: parentId,
          target: passive.id,
          type: 'default',
          animated: isComplete,
          zIndex: 0,
          style: {
            stroke: isComplete ? '#4ade80' : '#6b7280',
            strokeWidth: isComplete ? 3 : 2,
            strokeDasharray: isComplete ? 'none' : '5,5'
          }
        });
      });
    });
  });

  return { nodes, edges };
}
