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
import { useTranslation } from '@/lib/i18n/useTranslation';

const nodeTypes = {
  passiveNode: PassiveNode,
};

interface PassiveEvolutionProps {
  ownedPassiveIds: Set<string>;
  setOwnedPassiveIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function PassiveEvolution({ ownedPassiveIds, setOwnedPassiveIds }: PassiveEvolutionProps) {
  const { t } = useTranslation();
  const [selectedPassive, setSelectedPassive] = useState<Passive | null>(null);

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
  }, [setOwnedPassiveIds]);

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
  }, [setOwnedPassiveIds]);

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
    <div className="w-full h-full bg-gray-950 relative">
      {/* React Flow Canvas */}
      <div className="w-full h-full">
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

      {/* Legend - Enhanced Visibility */}
      <div className="absolute bottom-6 left-6 bg-gray-900/98 border-3 border-purple-500/70 rounded-lg p-5 z-10 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 text-lg">ℹ️</span>
          </div>
          <h3 className="text-base font-bold text-white">{t.ui.legend.title}</h3>
        </div>
        <div className="space-y-2.5 text-sm text-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">✓</div>
            <span className="font-medium">{t.ui.legend.ownedPassive}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">⬆</div>
            <span className="font-medium">{t.ui.legend.readyToEvolve}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-700 border-2 candidate-partner-glow shadow-lg"></div>
            <span className="font-medium">{t.ui.legend.candidatePartner}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-purple-500/30 border-2 border-purple-400 shadow-lg"></div>
            <span className="font-medium">{t.ui.legend.availableEvolution}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 bg-green-400 rounded shadow-lg"></div>
            <span className="font-medium">{t.ui.legend.completePath}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 border-t-2 border-dashed border-gray-300 rounded"></div>
            <span className="font-medium">{t.ui.legend.partialPath}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-gray-700/50 text-sm text-gray-300 space-y-1">
          <p className="flex items-center gap-2">
            <span className="text-purple-400">→</span> {t.ui.legend.clickToToggle}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-400">→</span> {t.ui.legend.clickForDetails}
          </p>
        </div>
      </div>
    </div>
  );
}
