'use client';

import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
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

import ConditionFilter from '../filter/ConditionFilter';
import EquipmentFilter from '../filter/EquipmentFilter';

type FilterTriggerButtonProps = {
  /** フィルターパネルの表示状態 */
  readonly isOpen: boolean;
  /** フィルターパネルの開閉制御ハンドラー */
  readonly onOpenChange: (open: boolean) => void;
};

/**
 * フィルタートリガーボタンコンポーネント
 *
 * ユーザーが好みのコーヒーレシピを効率的に見つけるための詳細条件設定を提供。
 * 器具、焙煎度、豆の重量など専門的な条件で絞り込み可能。
 * アクティブなフィルター数を視覚的に表示し、現在の絞り込み状況を把握できる。
 *
 * @param isOpen - フィルターパネルの表示状態
 * @param onOpenChange - フィルターパネルの開閉制御ハンドラー
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
          <div className="mt-6 space-y-6 px-4 sm:px-6">
            {/* 抽出器具フィルター */}
            <div>
              <EquipmentFilter
                selectedEquipment={pendingFilters.equipment ?? []}
                onChange={(equipment) => setFilter('equipment', equipment)}
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
                onRoastLevelChange={(roastLevel) => setFilter('roastLevel', roastLevel)}
                onGrindSizeChange={(grindSize) => setFilter('grindSize', grindSize)}
                onBeanWeightChange={(beanWeight) => setFilter('beanWeight', beanWeight)}
                onWaterTempChange={(waterTemp) => setFilter('waterTemp', waterTemp)}
                onWaterAmountChange={(waterAmount) => setFilter('waterAmount', waterAmount)}
              />
            </div>
          </div>

          {/* フィルター操作ボタン */}
          <div className="space-y-3 border-t px-4 pt-4 sm:px-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={reset}
                disabled={isLoading || activeFilterCount === 0}
                className="flex-1"
                type="button"
                aria-label={`フィルターをリセット（現在 ${activeFilterCount} 件設定中）`}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                リセット
              </Button>

              <Button
                onClick={apply}
                disabled={isLoading || !hasChanges}
                className="flex-1"
                type="button"
                aria-label={hasChanges ? 'フィルター変更を適用' : 'フィルター変更なし'}
              >
                <Filter className="mr-2 h-4 w-4" />
                絞り込む
              </Button>
            </div>

            {/* 変更状態の表示 */}
            {hasChanges && (
              <div
                className="text-muted-foreground text-center text-sm"
                role="status"
                aria-live="polite"
              >
                変更があります。絞り込むボタンを押して適用してください。
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});

FilterTriggerButton.displayName = 'FilterTriggerButton';

export default FilterTriggerButton;
