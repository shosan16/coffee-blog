'use client';

import { Filter, RotateCcw } from 'lucide-react';
import { memo, useEffect, useRef, type JSX } from 'react';

import { Button } from '@/client/shared/shadcn/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/client/shared/shadcn/sheet';

import type { UseRecipeQueryReturn } from '../../hooks/useRecipeQuery';
import ConditionFilter from '../filter/ConditionFilter';
import EquipmentFilter from '../filter/EquipmentFilter';

type FilterSheetProps = {
  /** フィルターパネルの表示状態 */
  readonly isOpen: boolean;
  /** フィルターパネルの開閉制御ハンドラー */
  readonly onOpenChange: (open: boolean) => void;
  /** レシピ検索とフィルター操作の状態管理 */
  readonly queryResult: UseRecipeQueryReturn;
};

/**
 * フィルターシートコンポーネント
 *
 * レシピフィルター条件の設定・操作を行うシートUI。
 * 器具、焙煎度、豆の重量など詳細な条件設定と、
 * フィルターの適用・リセット機能を提供する。
 *
 * @param isOpen フィルターパネルの表示状態
 * @param onOpenChange フィルターパネルの開閉制御ハンドラー
 * @param queryResult レシピ検索とフィルター操作の状態管理
 */
function FilterSheet({ isOpen, onOpenChange, queryResult }: FilterSheetProps): JSX.Element {
  const { pendingFilters, setFilter, apply, reset, isLoading, hasChanges, activeFilterCount } =
    queryResult;

  const sheetContentRef = useRef<HTMLDivElement>(null);

  // モーダル内での MultiCombobox 自動フォーカスがドロップダウン開閉を引き起こし、
  // ユーザーの意図しない UI 操作が発生する問題を解決するため、
  // シート開始時に明示的にコンテナにフォーカスを設定
  useEffect(() => {
    if (isOpen && sheetContentRef.current) {
      sheetContentRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-auto flex-col bg-white pb-6"
        aria-describedby="filter-description"
      >
        <div ref={sheetContentRef} tabIndex={-1} className="flex h-full flex-col outline-none">
          <div id="filter-description" className="sr-only">
            レシピの絞り込み条件を設定できます。難易度、所要時間、器具、豆の種類などで絞り込みが可能です。
          </div>
          <SheetHeader>
            <SheetTitle>フィルター条件</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-4 sm:px-6">
            <div>
              <EquipmentFilter
                selectedEquipment={pendingFilters.equipment ?? []}
                onChange={(equipment) => setFilter('equipment', equipment)}
              />
            </div>

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
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(FilterSheet);
