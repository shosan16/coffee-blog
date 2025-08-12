'use client';

import { SlidersHorizontal } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { Button } from '@/client/shared/shadcn/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/client/shared/shadcn/sheet';

import FilterActions from '../filter/FilterActions';
import FilterContent from '../filter/FilterContent';

type FilterTriggerButtonProps = {
  /** フィルターSheetの開閉状態 */
  readonly isOpen: boolean;
  /** フィルターSheetの開閉状態変更ハンドラー */
  readonly onOpenChange: (open: boolean) => void;
};

/**
 * フィルタートリガーボタンコンポーネント
 *
 * フィルター条件の設定を行うSheetを開くボタン。
 * アクティブなフィルター数をバッジで表示する。
 */
const FilterTriggerButton = React.memo<FilterTriggerButtonProps>(({ isOpen, onOpenChange }) => {
  // レシピクエリフック
  const { pendingFilters, setFilter, apply, reset, isLoading, hasChanges, activeFilterCount } =
    useRecipeQuery();

  return (
    <div className="border-input border-l">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="h-auto rounded-none border-0 bg-gray-400 px-5 py-5 text-sm font-medium"
            aria-label="フィルター条件を開く"
            aria-expanded={isOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            絞り込み
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground min-w-[20px] rounded-full px-2 py-1 text-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex h-auto flex-col bg-white pb-6"
          aria-describedby="filter-description"
        >
          <div id="filter-description" className="sr-only">
            レシピの絞り込み条件を設定できます。難易度、所要時間、器具、豆の種類などで絞り込みが可能です。
          </div>
          <SheetHeader>
            <SheetTitle>フィルター条件</SheetTitle>
          </SheetHeader>

          {/* フィルター条件の入力フォーム */}
          <FilterContent
            selectedEquipment={pendingFilters.equipment ?? []}
            selectedRoastLevels={pendingFilters.roastLevel ?? []}
            selectedGrindSizes={pendingFilters.grindSize ?? []}
            beanWeightRange={pendingFilters.beanWeight ?? {}}
            waterTempRange={pendingFilters.waterTemp ?? {}}
            waterAmountRange={pendingFilters.waterAmount ?? {}}
            onEquipmentChange={(equipment) => setFilter('equipment', equipment)}
            onRoastLevelChange={(roastLevel) => setFilter('roastLevel', roastLevel)}
            onGrindSizeChange={(grindSize) => setFilter('grindSize', grindSize)}
            onBeanWeightChange={(beanWeight) => setFilter('beanWeight', beanWeight)}
            onWaterTempChange={(waterTemp) => setFilter('waterTemp', waterTemp)}
            onWaterAmountChange={(waterAmount) => setFilter('waterAmount', waterAmount)}
          />

          {/* フィルター操作ボタン */}
          <FilterActions
            onApply={apply}
            onReset={reset}
            isLoading={isLoading}
            hasChanges={hasChanges}
            activeFilterCount={activeFilterCount}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
});

FilterTriggerButton.displayName = 'FilterTriggerButton';

export default FilterTriggerButton;
