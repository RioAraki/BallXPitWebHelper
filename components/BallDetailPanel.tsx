'use client';

import React from 'react';
import Image from 'next/image';
import { Ball } from '@/types/ball';
import { getElementColor, computeMissingIngredients } from '@/lib/graph-generator';
import { allBalls } from '@/data/balls';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface BallDetailPanelProps {
  ball: Ball | null;
  onClose: () => void;
  ownedBallIds?: Set<string>;
}

export function BallDetailPanel({ ball, onClose, ownedBallIds = new Set() }: BallDetailPanelProps) {
  if (!ball) return null;

  const { getBallName, getBallDescription, getCategoryName, getElementName } = useTranslation();
  const elementColor = getElementColor(ball.element);

  // Get all recipes (primary + alternatives)
  const allRecipes: string[][] = [];
  if (ball.recipe) {
    allRecipes.push(ball.recipe);
  }
  if (ball.alternativeRecipes) {
    allRecipes.push(...ball.alternativeRecipes);
  }

  // Find child balls (balls that require this ball in any of their recipes)
  const childBalls = allBalls.filter(b => {
    // Check primary recipe
    if (b.recipe?.includes(ball.id)) return true;
    // Check alternative recipes
    if (b.alternativeRecipes?.some(recipe => recipe.includes(ball.id))) return true;
    return false;
  });

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l-2 border-gray-700 shadow-2xl overflow-y-auto z-50">
      <div className="p-6">
        {/* Ball Image */}
        <div className="flex justify-center mb-4">
          {ball.imageUrl ? (
            <Image
              src={ball.imageUrl}
              alt={`${ball.name} ball`}
              width={128}
              height={128}
              className="rounded-xl shadow-lg"
              priority
            />
          ) : (
            <div
              className="w-32 h-32 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${elementColor}33` }}
            >
              <span className="text-5xl opacity-50">?</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{getBallName(ball)}</h2>
            <div className="flex gap-2 text-sm">
              <span
                className="px-2 py-1 rounded"
                style={{ backgroundColor: `${elementColor}44`, color: elementColor }}
              >
                {getCategoryName(ball.type)}
              </span>
              <span
                className="px-2 py-1 rounded capitalize"
                style={{ backgroundColor: `${elementColor}22`, color: elementColor }}
              >
                {getElementName(ball.element)}
              </span>
              <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                {getCategoryName(ball.category)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">DESCRIPTION</h3>
          <p className="text-white text-sm leading-relaxed">{getBallDescription(ball)}</p>
        </div>

        {/* Stats */}
        {ball.stats && Object.keys(ball.stats).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">STATS</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ball.stats).map(([key, value]) => (
                <div key={key} className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-white font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evolution Recipes */}
        {allRecipes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              EVOLUTION RECIPE{allRecipes.length > 1 ? 'S' : ''} ({allRecipes.length})
            </h3>
            <div className="space-y-3">
              {allRecipes.map((recipe, recipeIdx) => {
                // Get balls for this recipe
                const recipeBalls = recipe
                  .map(id => allBalls.find(b => b.id === id))
                  .filter(Boolean) as Ball[];
                
                // Check which ingredients are missing for this specific recipe
                const missingInRecipe = recipe.filter(id => !ownedBallIds.has(id));
                const isComplete = missingInRecipe.length === 0;

                return (
                  <div key={recipeIdx} className={`bg-gray-800 p-3 rounded ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
                    {allRecipes.length > 1 && (
                      <div className="text-xs text-gray-500 mb-2">Recipe {recipeIdx + 1}</div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {recipeBalls.map((parent, idx) => {
                        const isMissing = !ownedBallIds.has(parent.id);

                        return (
                          <React.Fragment key={parent.id}>
                            <div
                              className={`flex flex-col items-center transition-all ${
                                isMissing ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="relative">
                                {parent.imageUrl ? (
                                  <Image
                                    src={parent.imageUrl}
                                    alt={parent.name}
                                    width={40}
                                    height={40}
                                    className={`rounded ${isMissing ? 'ring-2 ring-red-500' : 'ring-2 ring-green-500'}`}
                                  />
                                ) : (
                                  <div
                                    className={`w-10 h-10 rounded flex items-center justify-center ${isMissing ? 'ring-2 ring-red-500' : 'ring-2 ring-green-500'}`}
                                    style={{ backgroundColor: `${getElementColor(parent.element)}33` }}
                                  >
                                    <span className="text-lg opacity-50">?</span>
                                  </div>
                                )}
                                {/* Status indicator */}
                                <div
                                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                    isMissing ? 'bg-red-500' : 'bg-green-500'
                                  }`}
                                >
                                  {isMissing ? '✗' : '✓'}
                                </div>
                              </div>
                              <span className="text-xs mt-1 font-medium text-white">
                                {getBallName(parent)}
                              </span>
                            </div>
                            {idx < recipeBalls.length - 1 && (
                              <span className="text-gray-400 text-lg font-bold">+</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <span className="text-gray-400 text-lg font-bold">=</span>
                      <div className="flex flex-col items-center">
                        {ball.imageUrl ? (
                          <Image
                            src={ball.imageUrl}
                            alt={ball.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${elementColor}33` }}
                          >
                            <span className="text-lg opacity-50">?</span>
                          </div>
                        )}
                        <span className="text-xs mt-1 font-medium text-white">
                          {getBallName(ball)}
                        </span>
                      </div>
                    </div>

                    {missingInRecipe.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-red-400">
                        Missing {missingInRecipe.length} ingredient{missingInRecipe.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {isComplete && (
                      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-green-400">
                        ✓ Ready to evolve!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evolution Paths (what this ball can evolve into) */}
        {childBalls.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              CAN EVOLVE INTO ({childBalls.length})
            </h3>
            <div className="space-y-3">
              {childBalls.map(child => {
                // Get all recipes for this child that include the current ball
                const relevantRecipes: string[][] = [];
                if (child.recipe?.includes(ball.id)) {
                  relevantRecipes.push(child.recipe);
                }
                if (child.alternativeRecipes) {
                  child.alternativeRecipes.forEach(recipe => {
                    if (recipe.includes(ball.id)) {
                      relevantRecipes.push(recipe);
                    }
                  });
                }

                return (
                  <div
                    key={child.id}
                    className="bg-gray-800 p-3 rounded"
                  >
                    {relevantRecipes.map((recipe, recipeIdx) => {
                      const ingredients = recipe
                        .map(id => allBalls.find(b => b.id === id))
                        .filter(Boolean) as Ball[];

                      return (
                        <div key={recipeIdx} className={recipeIdx > 0 ? 'mt-3 pt-3 border-t border-gray-700' : ''}>
                          {relevantRecipes.length > 1 && (
                            <div className="text-xs text-gray-500 mb-2">Recipe {recipeIdx + 1}</div>
                          )}
                          {/* Evolution equation with pictures */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {ingredients.map((ingredient, idx) => (
                              <React.Fragment key={ingredient.id}>
                                <div className="flex flex-col items-center">
                                  {ingredient.imageUrl ? (
                                    <Image
                                      src={ingredient.imageUrl}
                                      alt={ingredient.name}
                                      width={40}
                                      height={40}
                                      className={`rounded ${ingredient.id === ball.id ? 'ring-2 ring-blue-500' : ''}`}
                                    />
                                  ) : (
                                    <div
                                      className={`w-10 h-10 rounded flex items-center justify-center ${ingredient.id === ball.id ? 'ring-2 ring-blue-500' : ''}`}
                                      style={{ backgroundColor: `${getElementColor(ingredient.element)}33` }}
                                    >
                                      <span className="text-lg opacity-50">?</span>
                                    </div>
                                  )}
                                  <span className="text-xs mt-1 font-medium text-white">
                                    {getBallName(ingredient)}
                                  </span>
                                </div>
                                {idx < ingredients.length - 1 && (
                                  <span className="text-gray-400 text-lg font-bold">+</span>
                                )}
                              </React.Fragment>
                            ))}
                            <span className="text-gray-400 text-lg font-bold">=</span>
                            <div className="flex flex-col items-center">
                              {child.imageUrl ? (
                                <Image
                                  src={child.imageUrl}
                                  alt={child.name}
                                  width={40}
                                  height={40}
                                  className="rounded"
                                />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded flex items-center justify-center"
                                  style={{ backgroundColor: `${getElementColor(child.element)}33` }}
                                >
                                  <span className="text-lg opacity-50">?</span>
                                </div>
                              )}
                              <span className="text-xs mt-1 font-medium text-white">
                                {getBallName(child)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
