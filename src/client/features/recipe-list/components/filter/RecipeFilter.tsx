'use client';

import type { RoastLevel, GrindSize } from '@prisma/client';
import { X, Filter, RotateCcw } from 'lucide-react';
import React, { useState, useMemo, useCallback } from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { Button } from '@/client/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

import ConditionFilter from './ConditionFilter';
import EquipmentFilter from './EquipmentFilter';

type RecipeFilterProps = {
  className?: string;
};

const RecipeFilter = React.memo(function RecipeFilter({ className = '' }: RecipeFilterProps) {
  const { filters, pendingFilters, setFilter, apply, reset, isLoading, hasChanges } =
    useRecipeQuery();
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
      setFilter('equipment', equipment);
    },
    [setFilter]
  );

  const handleRoastLevelChange = useCallback(
    (levels: RoastLevel[]): void => {
      setFilter('roastLevel', levels);
    },
    [setFilter]
  );

  const handleGrindSizeChange = useCallback(
    (sizes: GrindSize[]): void => {
      setFilter('grindSize', sizes);
    },
    [setFilter]
  );

  const handleBeanWeightChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      setFilter('beanWeight', range);
    },
    [setFilter]
  );

  const handleWaterTempChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      setFilter('waterTemp', range);
    },
    [setFilter]
  );

  const handleWaterAmountChange = useCallback(
    (range: { min?: number; max?: number }): void => {
      setFilter('waterAmount', range);
    },
    [setFilter]
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
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
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
              <div className="bg-card/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
              </div>
            )}

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
                  onClick={reset}
                  disabled={isLoading || (activeFilterCount === 0 && pendingFilterCount === 0)}
                  className={`px-6 transition-all duration-200 ${
                    activeFilterCount > 0 || pendingFilterCount > 0
                      ? 'border-secondary text-muted-foreground hover:border-border hover:bg-secondary'
                      : 'border-border text-muted-foreground'
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
                  onClick={apply}
                  disabled={isLoading || !hasChanges}
                  variant={hasChanges ? 'default' : 'secondary'}
                  className={`flex-1 transition-all duration-200 ${
                    hasChanges
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 transform shadow-md hover:scale-[1.02]'
                      : 'border-border bg-secondary text-secondary-foreground cursor-not-allowed border'
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
                          ? 'bg-primary-foreground/20 text-primary-foreground animate-bounce'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {pendingFilterCount}
                    </span>
                  )}
                </Button>
              </div>
              {hasChanges && (
                <div className="border-border bg-card mt-3 flex items-center gap-2 rounded-md border p-3">
                  <div className="bg-primary h-2 w-2 animate-pulse rounded-full"></div>
                  <p className="text-card-foreground text-sm font-medium">
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
