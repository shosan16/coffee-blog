'use client';

import type { RoastLevel, GrindSize } from '@prisma/client';
import { Filter, RotateCcw } from 'lucide-react';
import React, { useState, useMemo, useCallback } from 'react';

import { useRecipeFilter } from '@/client/features/recipe-list/hooks/useRecipeFilter';
import { Button } from '@/client/shared/shadcn/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/client/shared/shadcn/sheet';

import ConditionFilter from './ConditionFilter';
import EquipmentFilter from './EquipmentFilter';

/**
 * Sheetベースのフィルターコンポーネント
 *
 * @description 右側からスライドインするSheet形式でフィルター機能を提供
 * モバイル・デスクトップ両方で統一されたUI体験を提供する
 */
export default function RecipeFilterSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    filters,
    pendingFilters,
    updateFilter,
    applyFilters,
    resetFilters,
    isLoading,
    hasChanges,
  } = useRecipeFilter();

  // アクティブフィルター数をカウント（メモ化で再計算を最適化）
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) =>
        key !== 'page' && key !== 'limit' && filters[key as keyof typeof filters] !== undefined
    ).length;
  }, [filters]);

  // フィルター更新処理をメモ化
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          aria-label="フィルター条件を開く"
          aria-expanded={isOpen}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          フィルター
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>フィルター条件</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4 sm:px-6">
          {/* 抽出器具フィルター */}
          <div>
            <EquipmentFilter
              selectedEquipment={pendingFilters.equipment ?? []}
              onChange={handleEquipmentChange}
            />
          </div>

          {/* 抽出条件フィルター */}
          <div>
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
          </div>

          {/* フィルター操作ボタン */}
          <div className="space-y-3 border-t px-4 pt-4 sm:px-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={isLoading || activeFilterCount === 0}
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                リセット
              </Button>
              <Button onClick={applyFilters} disabled={isLoading || !hasChanges} className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                絞り込む
              </Button>
            </div>

            {hasChanges && (
              <div className="text-muted-foreground text-center text-sm">
                変更があります。絞り込むボタンを押して適用してください。
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
