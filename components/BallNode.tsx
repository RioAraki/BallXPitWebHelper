'use client';

import React from 'react';
import Image from 'next/image';
import { Handle, Position } from 'reactflow';
import { Ball, BallState } from '@/types/ball';
import { getNodeStyle } from '@/lib/graph-generator';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface BallNodeProps {
  data: {
    ball: Ball;
    state: BallState;
    missingIngredients?: string[];
    isCandidatePartner?: boolean;
    possibleEvolutions?: string[];
    canEvolve?: boolean;
    evolutionCount?: number;
    onSelect?: (ball: Ball) => void;
    onToggleOwned?: (ballId: string) => void;
    onEvolve?: (ball: Ball) => void;
  };
}

export function BallNode({ data }: BallNodeProps) {
  const { ball, state, missingIngredients, isCandidatePartner, possibleEvolutions, canEvolve, evolutionCount = 0, onSelect, onToggleOwned, onEvolve } = data;
  const { getBallName, t } = useTranslation();

  // Get base style and modify based on ball type and state
  const baseStyle = getNodeStyle(ball, state, isCandidatePartner);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If evolved ball with all ingredients owned, trigger evolution
    if (canEvolve && onEvolve) {
      onEvolve(ball);
    } else {
      onToggleOwned?.(ball.id);
    }
  };

  // Show detail panel on icon click
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(ball);
  };

  // Determine if image should be dimmed
  const isImageDimmed = state === BallState.UNSELECTED && ball.type !== 'BASE';

  // CSS class for candidate partner animation
  const candidatePartnerClass = isCandidatePartner && state !== BallState.OWNED
    ? 'candidate-partner-glow'
    : '';

  const isBaseBall = ball.type === 'BASE';

  // Generate tooltip
  const getTooltip = () => {
    if (canEvolve) return `Click to evolve! (consumes ${ball.recipe?.join(' + ')})`;
    if (isCandidatePartner && possibleEvolutions?.length) return `Can evolve: ${possibleEvolutions.join(', ')}`;
    return undefined;
  };

  return (
    <div
      style={baseStyle}
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${candidatePartnerClass}`}
      onClick={handleClick}
      title={getTooltip()}
    >
      {/* Only show target handle on evolved balls (base balls don't receive edges) */}
      {!isBaseBall && <Handle type="target" position={Position.Bottom} className="bg-gray-400!" />}

      <div className="text-center relative">
        {/* Ownership indicator */}
        {state === BallState.OWNED && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10">
            ✓
          </div>
        )}

        {/* Candidate partner indicator */}
        {isCandidatePartner && state !== BallState.OWNED && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-linear-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10 animate-pulse">
            +
          </div>
        )}

        {/* Can evolve indicator - shows when all ingredients are owned */}
        {canEvolve && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10 animate-bounce">
            ⬆
          </div>
        )}

        {/* Missing ingredients count - only show if can't evolve yet */}
        {!canEvolve && state === BallState.CANDIDATE && missingIngredients && missingIngredients.length > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10">
            {missingIngredients.length}
          </div>
        )}

        {/* Ball Image */}
        <div className="flex justify-center mb-2">
          {ball.imageUrl ? (
            <Image
              src={ball.imageUrl}
              alt={`${ball.name} ball`}
              width={64}
              height={64}
              className="rounded-lg"
              style={{ opacity: isImageDimmed ? 0.3 : 1 }}
            />
          ) : (
            <div
              className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center"
              style={{ opacity: isImageDimmed ? 0.3 : 1 }}
            >
              <span className="text-2xl opacity-50">?</span>
            </div>
          )}
        </div>

        {/* Ball Name */}
        <div className="font-bold text-sm mb-1">{getBallName(ball)}</div>

        {/* Evolution Info */}
        <div className="text-xs opacity-80">
          {evolutionCount > 0
            ? `${evolutionCount} ${evolutionCount > 1 ? t.ui.evolutions.count_other : t.ui.evolutions.count_one}`
            : t.ui.evolutions.none}
        </div>

        {/* Info button */}
        <button
          onClick={handleInfoClick}
          className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors z-10"
          title="View details"
        >
          i
        </button>
      </div>

      <Handle type="source" position={Position.Top} className="bg-gray-400!" />
    </div>
  );
}
