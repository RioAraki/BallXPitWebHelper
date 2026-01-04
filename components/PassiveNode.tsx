'use client';

import React from 'react';
import Image from 'next/image';
import { Handle, Position } from 'reactflow';
import { PassiveNodeData, PassiveState } from '@/types/passive';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface PassiveNodeProps {
  data: PassiveNodeData;
}

export function PassiveNode({ data }: PassiveNodeProps) {
  const { passive, state, isCandidatePartner, possibleEvolutions, canEvolve, evolutionCount, onSelect, onToggleOwned, onEvolve } = data;
  const { getPassiveName, t } = useTranslation();

  const isBaseBall = passive.type === 'BASE';
  const isOwned = state === PassiveState.OWNED;

  const handleClick = () => {
    // If can evolve, do the evolution
    if (canEvolve && onEvolve) {
      onEvolve(passive);
      return;
    }
    // Otherwise toggle ownership
    onToggleOwned?.(passive.id);
  };

  // Determine CSS class for candidate partner glow
  const candidatePartnerClass = isCandidatePartner && !isOwned ? 'candidate-partner-glow' : '';

  // Generate tooltip for candidate partner
  const tooltipText = canEvolve 
    ? 'Click to evolve!'
    : isCandidatePartner && possibleEvolutions && possibleEvolutions.length > 0
      ? `Can evolve into: ${possibleEvolutions.join(', ')}`
      : '';

  // Base style with element-based coloring
  const baseStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    borderRadius: '8px',
    padding: '8px',
    width: '120px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Base passives: no border unless candidate partner
    // Evolved passives: always have border
    borderWidth: isBaseBall ? (isCandidatePartner && !isOwned ? '3px' : (isOwned ? '3px' : '0px')) : '2px',
    borderStyle: isBaseBall ? (isCandidatePartner && !isOwned ? 'solid' : (isOwned ? 'solid' : 'none')) : 'solid',
    borderColor: isBaseBall 
      ? (isOwned ? '#22c55e' : (isCandidatePartner ? '#ec4899' : 'transparent'))
      : (isOwned ? '#22c55e' : '#6b7280')
  };

  return (
    <div
      style={baseStyle}
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${candidatePartnerClass}`}
      onClick={handleClick}
      title={tooltipText}
    >
      {/* Candidate partner indicator */}
      {isCandidatePartner && !isOwned && (
        <div className="absolute -top-2 -left-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
          +
        </div>
      )}
      
      {/* Can evolve indicator */}
      {canEvolve && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 animate-bounce">
          ⬆
        </div>
      )}

      {/* Connection handles - only target handle for evolved passives */}
      <Handle type="source" position={Position.Top} className="bg-gray-400!" />
      {!isBaseBall && <Handle type="target" position={Position.Bottom} className="bg-gray-400!" />}

      {/* Passive Image */}
      <div className="relative mb-1">
        {passive.imageUrl ? (
          <Image 
            src={passive.imageUrl}
            alt={passive.name}
            width={48}
            height={48}
            className="rounded"
            onError={(e) => {
              // Hide broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div 
            className="w-12 h-12 rounded flex items-center justify-center"
            style={{ backgroundColor: '#4b5563' }}
          >
            <span className="text-2xl opacity-50">⚡</span>
          </div>
        )}
        
        {/* Owned indicator badge */}
        {isOwned && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>

      {/* Passive Name */}
      <div className="text-xs text-center font-medium text-white truncate w-full px-1">
        {getPassiveName(passive)}
      </div>

      {/* Evolution count or no evolutions */}
      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
        {evolutionCount !== undefined && evolutionCount > 0
          ? `${evolutionCount} ${evolutionCount > 1 ? t.ui.evolutions.count_other : t.ui.evolutions.count_one}`
          : t.ui.evolutions.none}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(passive);
          }}
          className="ml-1 w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center hover:bg-blue-600"
        >
          i
        </button>
      </div>
    </div>
  );
}
