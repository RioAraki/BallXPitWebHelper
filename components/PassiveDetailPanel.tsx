'use client';

import React from 'react';
import Image from 'next/image';
import { Passive } from '@/types/passive';
import { allPassives } from '@/data/passives';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface PassiveDetailPanelProps {
  passive: Passive | null;
  onClose: () => void;
  ownedPassiveIds?: Set<string>;
}

// Helper to get all recipes for a passive
function getAllRecipes(passive: Passive): string[][] {
  const recipes: string[][] = [];
  if (passive.recipe) {
    recipes.push(passive.recipe);
  }
  if (passive.alternativeRecipes) {
    recipes.push(...passive.alternativeRecipes);
  }
  return recipes;
}

export function PassiveDetailPanel({ passive, onClose, ownedPassiveIds = new Set() }: PassiveDetailPanelProps) {
  if (!passive) return null;

  const { getPassiveName, getPassiveDescription, getCategoryName } = useTranslation();

  // Get all recipes (primary + alternatives)
  const allRecipes = getAllRecipes(passive);

  // Find child passives (passives that require this passive in any of their recipes)
  const childPassives = allPassives.filter(p => {
    // Check primary recipe
    if (p.recipe?.includes(passive.id)) return true;
    // Check alternative recipes
    if (p.alternativeRecipes?.some(recipe => recipe.includes(passive.id))) return true;
    return false;
  });

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l-2 border-gray-700 shadow-2xl overflow-y-auto z-50">
      <div className="p-6">
        {/* Passive Image */}
        <div className="flex justify-center mb-4">
          {passive.imageUrl ? (
            <Image
              src={passive.imageUrl}
              alt={`${passive.name} passive`}
              width={128}
              height={128}
              className="rounded-xl shadow-lg"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-xl flex items-center justify-center shadow-lg bg-gray-700">
              <span className="text-5xl opacity-50">⚡</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{getPassiveName(passive)}</h2>
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 rounded bg-purple-900/50 text-purple-300">
                {getCategoryName(passive.type)}
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
          <p className="text-white text-sm leading-relaxed">{getPassiveDescription(passive)}</p>
        </div>

        {/* Requirement */}
        {passive.requirement && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">REQUIREMENT</h3>
            <p className="text-yellow-400 text-sm leading-relaxed">{passive.requirement}</p>
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
                // Get passives for this recipe
                const recipePassives = recipe
                  .map(id => allPassives.find(p => p.id === id))
                  .filter(Boolean) as Passive[];
                
                // Check which ingredients are missing for this specific recipe
                const missingInRecipe = recipe.filter(id => !ownedPassiveIds.has(id));
                const isComplete = missingInRecipe.length === 0;

                return (
                  <div key={recipeIdx} className={`bg-gray-800 p-3 rounded ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
                    {allRecipes.length > 1 && (
                      <div className="text-xs text-gray-500 mb-2">Recipe {recipeIdx + 1}</div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {recipePassives.map((parent, idx) => {
                        const isMissing = !ownedPassiveIds.has(parent.id);

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
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={`w-10 h-10 rounded flex items-center justify-center bg-gray-700 ${isMissing ? 'ring-2 ring-red-500' : 'ring-2 ring-green-500'}`}
                                  >
                                    <span className="text-lg opacity-50">⚡</span>
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
                                {getPassiveName(parent)}
                              </span>
                            </div>
                            {idx < recipePassives.length - 1 && (
                              <span className="text-gray-400 text-lg font-bold">+</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <span className="text-gray-400 text-lg font-bold">=</span>
                      <div className="flex flex-col items-center">
                        {passive.imageUrl ? (
                          <Image
                            src={passive.imageUrl}
                            alt={passive.name}
                            width={40}
                            height={40}
                            className="rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-700">
                            <span className="text-lg opacity-50">⚡</span>
                          </div>
                        )}
                        <span className="text-xs mt-1 font-medium text-white">
                          {getPassiveName(passive)}
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

        {/* Evolution Paths (what this passive can evolve into) */}
        {childPassives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              CAN EVOLVE INTO ({childPassives.length})
            </h3>
            <div className="space-y-3">
              {childPassives.map(child => {
                // Get all recipes for this child that include the current passive
                const relevantRecipes: string[][] = [];
                if (child.recipe?.includes(passive.id)) {
                  relevantRecipes.push(child.recipe);
                }
                if (child.alternativeRecipes) {
                  child.alternativeRecipes.forEach(recipe => {
                    if (recipe.includes(passive.id)) {
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
                        .map(id => allPassives.find(p => p.id === id))
                        .filter(Boolean) as Passive[];

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
                                      className={`rounded ${ingredient.id === passive.id ? 'ring-2 ring-blue-500' : ''}`}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className={`w-10 h-10 rounded flex items-center justify-center bg-gray-700 ${ingredient.id === passive.id ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                      <span className="text-lg opacity-50">⚡</span>
                                    </div>
                                  )}
                                  <span className="text-xs mt-1 font-medium text-white">
                                    {getPassiveName(ingredient)}
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
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-700">
                                  <span className="text-lg opacity-50">⚡</span>
                                </div>
                              )}
                              <span className="text-xs mt-1 font-medium text-white">
                                {getPassiveName(child)}
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
