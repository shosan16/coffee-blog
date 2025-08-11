'use client';

import { Filter } from 'lucide-react';
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
  const {
    pendingFilters,
    updateFilter,
    applyChanges,
    resetAll,
    isLoading,
    hasChanges,
    activeFilterCount,
  } = useRecipeQuery();

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
            <Filter className="h-4 w-4" />
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
          className="w-full sm:max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
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
            onEquipmentChange={(equipment) => updateFilter('equipment', equipment)}
            onRoastLevelChange={(roastLevel) => updateFilter('roastLevel', roastLevel)}
            onGrindSizeChange={(grindSize) => updateFilter('grindSize', grindSize)}
            onBeanWeightChange={(beanWeight) => updateFilter('beanWeight', beanWeight)}
            onWaterTempChange={(waterTemp) => updateFilter('waterTemp', waterTemp)}
            onWaterAmountChange={(waterAmount) => updateFilter('waterAmount', waterAmount)}
          />

          {/* フィルター操作ボタン */}
          <FilterActions
            onApply={applyChanges}
            onReset={resetAll}
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
