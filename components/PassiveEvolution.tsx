'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Passive } from '@/types/passive';
import { allPassives } from '@/data/passives';
import {
  generatePassiveEvolutionGraph,
  getVisiblePassives,
  getAllPassiveRecipes
} from '@/lib/passive-graph-generator';
import { PassiveNode } from './PassiveNode';
import { PassiveDetailPanel } from './PassiveDetailPanel';

const nodeTypes = {
  passiveNode: PassiveNode,
};

export function PassiveEvolution() {
  const [selectedPassive, setSelectedPassive] = useState<Passive | null>(null);
  const [ownedPassiveIds, setOwnedPassiveIds] = useState<Set<string>>(new Set());

  // Toggle passive ownership
  const togglePassiveOwnership = useCallback((passiveId: string) => {
    setOwnedPassiveIds(prev => {
      const next = new Set(prev);
      if (next.has(passiveId)) {
        next.delete(passiveId);
      } else {
        next.add(passiveId);
      }
      return next;
    });
  }, []);

  // Reset all selections
  const handleReset = useCallback(() => {
    setOwnedPassiveIds(new Set());
    setSelectedPassive(null);
  }, []);

  // Evolve a passive (consume ingredients, gain evolved passive)
  const handleEvolve = useCallback((passive: Passive) => {
    const recipes = getAllPassiveRecipes(passive);
    if (recipes.length === 0) return;
    
    setOwnedPassiveIds(prev => {
      const next = new Set(prev);
      
      // Find the first recipe where all ingredients are owned
      const completeRecipe = recipes.find(recipe => 
        recipe.every(id => prev.has(id))
      );
      
      if (!completeRecipe) return prev;
      
      // Remove all ingredients from the complete recipe
      completeRecipe.forEach(ingredientId => {
        next.delete(ingredientId);
      });
      // Add the evolved passive
      next.add(passive.id);
      return next;
    });
  }, []);

  // Get the "relevant" passives for edge filtering
  const relevantPassives = useMemo(
    () => getVisiblePassives(ownedPassiveIds, allPassives),
    [ownedPassiveIds]
  );

  // Generate graph from all passives
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generatePassiveEvolutionGraph(allPassives, ownedPassiveIds, relevantPassives),
    [ownedPassiveIds, relevantPassives]
  );

  // Add callbacks to node data
  const nodesWithCallback = useMemo(
    () =>
      initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onSelect: setSelectedPassive,
          onToggleOwned: togglePassiveOwnership,
          onEvolve: handleEvolve
        }
      })),
    [initialNodes, togglePassiveOwnership, handleEvolve]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithCallback);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when ownership changes
  React.useEffect(() => {
    setNodes(nodesWithCallback);
    setEdges(initialEdges);
  }, [nodesWithCallback, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 items-center">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Reset All
        </button>
        <div className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
          Owned: <span className="font-semibold text-green-400">{ownedPassiveIds.size}</span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="w-full h-full bg-gray-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          elevateEdgesOnSelect={false}
          elevateNodesOnSelect={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
          <Controls className="bg-gray-800 border-gray-700" />
        </ReactFlow>
      </div>

      {/* Passive Detail Panel */}
      <PassiveDetailPanel
        passive={selectedPassive}
        onClose={() => setSelectedPassive(null)}
        ownedPassiveIds={ownedPassiveIds}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 border border-gray-700 rounded p-4 z-10">
        <h3 className="text-sm font-semibold text-white mb-2">Legend</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
            <span>Owned Passive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-white text-xs">⬆</div>
            <span>Ready to Evolve (click to evolve)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-pink-500 flex items-center justify-center text-white text-xs">+</div>
            <span>Candidate Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500"></div>
            <span>Complete Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #6b7280 0, #6b7280 4px, transparent 4px, transparent 8px)' }}></div>
            <span>Partial Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
