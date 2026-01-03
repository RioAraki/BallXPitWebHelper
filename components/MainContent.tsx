'use client';

import React, { useState } from 'react';
import { BallEvolution } from './BallEvolution';
import { PassiveEvolution } from './PassiveEvolution';

type Tab = 'balls' | 'passives';

export function MainContent() {
  const [activeTab, setActiveTab] = useState<Tab>('balls');
  const [ownedBallIds, setOwnedBallIds] = useState<Set<string>>(new Set());
  const [ownedPassiveIds, setOwnedPassiveIds] = useState<Set<string>>(new Set());

  // Get description based on active tab
  const getDescription = () => {
    if (activeTab === 'balls') {
      return 'Click on the balls to mark as owned and see available evolutions';
    }
    return 'Click on the passives to mark as owned and see available evolutions';
  };

  // Reset handler
  const handleReset = () => {
    if (activeTab === 'balls') {
      setOwnedBallIds(new Set());
    } else {
      setOwnedPassiveIds(new Set());
    }
  };

  // Get owned count based on active tab
  const ownedCount = activeTab === 'balls' ? ownedBallIds.size : ownedPassiveIds.size;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-950">
      {/* Unified Compact Header */}
      <div className="bg-gray-900/98 border-b-2 border-blue-500/50 shadow-xl shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title + Tabs */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                Ball x Pit Helper
              </h1>

              {/* Tab Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('balls')}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all text-sm ${
                    activeTab === 'balls'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🎱 Balls
                </button>
                <button
                  onClick={() => setActiveTab('passives')}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all text-sm ${
                    activeTab === 'passives'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  ⚡ Passives
                </button>
              </div>
            </div>

            {/* Center: Description */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300">
                {getDescription()}
              </p>
            </div>

            {/* Right: Controls */}
            <div className="flex gap-2 items-center">
              <div className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm border border-gray-700 whitespace-nowrap">
                Owned: <span className="font-semibold text-green-400">{ownedCount}</span>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg text-sm whitespace-nowrap"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'balls' && (
          <BallEvolution
            ownedBallIds={ownedBallIds}
            setOwnedBallIds={setOwnedBallIds}
          />
        )}
        {activeTab === 'passives' && (
          <PassiveEvolution
            ownedPassiveIds={ownedPassiveIds}
            setOwnedPassiveIds={setOwnedPassiveIds}
          />
        )}
      </div>
    </div>
  );
}
