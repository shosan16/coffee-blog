'use client';

import { RoastLevel, GrindSize } from '@prisma/client';
import { X, Filter, RotateCcw } from 'lucide-react';
import React, { useState, useMemo, useCallback } from 'react';

import { useRecipeFilter } from '@/client/features/recipes/hooks/useRecipeFilter';
import { Button } from '@/client/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

import ActiveFilters from './ActiveFilters';
import ConditionFilter from './ConditionFilter';
import EquipmentFilter from './EquipmentFilter';

type RecipeFilterProps = {
  className?: string;
};

const RecipeFilter = React.memo(function RecipeFilter({ className = '' }: RecipeFilterProps) {
  const {
    filters,
    pendingFilters,
    updateFilter,
    applyFilters,
    resetFilters,
    isLoading,
    hasChanges,
  } = useRecipeFilter();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) =>
        key !== 'page' && key !== 'limit' && filters[key as keyof typeof filters] !== undefined
    ).length;
  }, [filters]);

  const pendingFilterCount = useMemo(() => {
    return Object.keys(pendingFilters).filter(
      (key) =>
        key !== 'page' &&
        key !== 'limit' &&
        pendingFilters[key as keyof typeof pendingFilters] !== undefined
    ).length;
  }, [pendingFilters]);

  const handleEquipmentChange = useCallback(
    (equipment: string[]): void => {
      updateFilter('equipment', equipment);
    },
    [updateFilter]
  );

  const handleRoastLevelChange = useCallback(
    (levels: RoastLevel[]): void => {
      updateFilter('roastLevel', levels);
    },
    [updateFilter]
  );

  const handleGrindSizeChange = useCallback(
    (sizes: GrindSize[]): void => {
      updateFilter('grindSize', sizes);
    },
    [updateFilter]
  );

  const handleBeanWeightChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      updateFilter('beanWeight', range);
    },
    [updateFilter]
  );

  const handleWaterTempChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      updateFilter('waterTemp', range);
    },
    [updateFilter]
  );

  const handleWaterAmountChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      updateFilter('waterAmount', range);
    },
    [updateFilter]
  );

  return (
    <div className={className}>
      {/* フィルター開閉ボタン（モバイル用） */}
      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>フィルター</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <X className={`h-4 w-4 transition-transform ${isOpen ? '' : 'rotate-45'}`} />
        </Button>
      </div>

      {/* フィルターコンテンツ */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">フィルター条件</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 読み込み中のオーバーレイ */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-black"></div>
              </div>
            )}

            {/* アクティブフィルター表示 */}
            <ActiveFilters />

            {/* 器具フィルター */}
            <EquipmentFilter
              selectedEquipment={pendingFilters.equipment ?? []}
              onChange={handleEquipmentChange}
            />

            {/* 抽出条件フィルター */}
            <ConditionFilter
              roastLevels={pendingFilters.roastLevel ?? []}
              grindSizes={pendingFilters.grindSize ?? []}
              beanWeight={pendingFilters.beanWeight ?? {}}
              waterTemp={pendingFilters.waterTemp ?? {}}
              waterAmount={pendingFilters.waterAmount ?? {}}
              onRoastLevelChange={handleRoastLevelChange}
              onGrindSizeChange={handleGrindSizeChange}
              onBeanWeightChange={handleBeanWeightChange}
              onWaterTempChange={handleWaterTempChange}
              onWaterAmountChange={handleWaterAmountChange}
            />

            {/* 絞り込みボタン */}
            <div className="border-t pt-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  disabled={isLoading || (activeFilterCount === 0 && pendingFilterCount === 0)}
                  className={`px-6 transition-all duration-200 ${
                    activeFilterCount > 0 || pendingFilterCount > 0
                      ? 'border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <RotateCcw
                    className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                      isLoading ? 'animate-spin' : ''
                    }`}
                  />
                  リセット
                </Button>
                <Button
                  onClick={applyFilters}
                  disabled={isLoading || !hasChanges}
                  variant={hasChanges ? 'default' : 'secondary'}
                  className={`flex-1 transition-all duration-200 ${
                    hasChanges
                      ? 'transform bg-black text-white shadow-md hover:scale-[1.02] hover:bg-black'
                      : 'cursor-not-allowed border border-black bg-white text-black'
                  } ${isLoading ? 'animate-pulse' : ''}`}
                >
                  <Filter
                    className={`mr-2 h-4 w-4 transition-transform duration-200 ${hasChanges ? 'scale-110' : ''}`}
                  />
                  絞り込む
                  {pendingFilterCount > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs transition-all duration-200 ${
                        hasChanges
                          ? 'animate-bounce bg-white/20 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {pendingFilterCount}
                    </span>
                  )}
                </Button>
              </div>
              {hasChanges && (
                <div className="mt-3 flex items-center gap-2 rounded-md border border-black bg-white p-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-black"></div>
                  <p className="text-sm font-medium text-black">
                    変更があります。
                    <br />
                    絞り込むボタンを押して適用してください。
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default RecipeFilter;
