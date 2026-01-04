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

import { Ball } from '@/types/ball';
import { allBalls } from '@/data/balls';
import {
  generateInteractiveEvolutionGraph,
  getVisibleBalls,
  getAllRecipes
} from '@/lib/graph-generator';
import { BallNode } from './BallNode';
import { BallDetailPanel } from './BallDetailPanel';
import { useTranslation } from '@/lib/i18n/useTranslation';

const nodeTypes = {
  ballNode: BallNode,
};

interface BallEvolutionProps {
  ownedBallIds: Set<string>;
  setOwnedBallIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function BallEvolution({ ownedBallIds, setOwnedBallIds }: BallEvolutionProps) {
  const { t } = useTranslation();
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);

  // Toggle ball ownership
  const toggleBallOwnership = useCallback((ballId: string) => {
    setOwnedBallIds(prev => {
      const next = new Set(prev);
      if (next.has(ballId)) {
        next.delete(ballId);
      } else {
        next.add(ballId);
      }
      return next;
    });
  }, [setOwnedBallIds]);


  // Evolve a ball (consume ingredients, gain evolved ball)
  const handleEvolve = useCallback((ball: Ball) => {
    // Get all recipes for this ball
    const recipes = getAllRecipes(ball);
    if (recipes.length === 0) return;

    setOwnedBallIds(prev => {
      const next = new Set(prev);

      // Find the first recipe where all ingredients are owned
      const completeRecipe = recipes.find(recipe =>
        recipe.every(id => prev.has(id))
      );

      if (!completeRecipe) return prev; // No complete recipe found

      // Remove all ingredients from the complete recipe
      completeRecipe.forEach(ingredientId => {
        next.delete(ingredientId);
      });
      // Add the evolved ball
      next.add(ball.id);
      return next;
    });
  }, [setOwnedBallIds]);

  // Get the "relevant" balls for edge filtering (only owned/candidate/available have edges)
  const relevantBalls = useMemo(
    () => getVisibleBalls(ownedBallIds, allBalls),
    [ownedBallIds]
  );

  // Generate graph from all balls, but only show edges for relevant balls
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateInteractiveEvolutionGraph(allBalls, ownedBallIds, relevantBalls),
    [ownedBallIds, relevantBalls]
  );

  // Add callbacks to node data
  const nodesWithCallback = useMemo(
    () =>
      initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onSelect: setSelectedBall,
          onToggleOwned: toggleBallOwnership,
          onEvolve: handleEvolve,
        },
      })),
    [initialNodes, toggleBallOwnership, handleEvolve]
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
      {/* ReactFlow Graph */}
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

      {/* Ball Detail Panel */}
      <BallDetailPanel
        ball={selectedBall}
        onClose={() => setSelectedBall(null)}
        ownedBallIds={ownedBallIds}
      />

      {/* Legend - Enhanced Visibility */}
      <div className="absolute bottom-6 left-6 bg-gray-900/98 border-3 border-blue-500/70 rounded-lg p-5 z-10 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 text-lg">ℹ️</span>
          </div>
          <h3 className="text-base font-bold text-white">{t.ui.legend.title}</h3>
        </div>
        <div className="space-y-2.5 text-sm text-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">✓</div>
            <span className="font-medium">{t.ui.legend.ownedBall}</span>
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
            <div className="w-5 h-5 rounded bg-blue-500/30 border-2 border-blue-400 shadow-lg"></div>
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
            <span className="text-blue-400">→</span> {t.ui.legend.clickToToggle}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-blue-400">→</span> {t.ui.legend.clickForDetails}
          </p>
        </div>
      </div>
    </div>
  );
}
