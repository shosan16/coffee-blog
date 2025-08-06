'use client';

import { Filter } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { useRecipeFilter } from '@/client/features/recipe-list/hooks/useRecipeFilter';
import { Button } from '@/client/shared/shadcn/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/client/shared/shadcn/sheet';

import FilterActions from './FilterActions';
import FilterContent from './FilterContent';
import { useFilterHandlers } from './FilterHandlers';

/**
 * レシピ検索フィルターのメインUI
 *
 * @description レシピ一覧画面でユーザーが検索条件を絞り込むためのフィルター機能を提供する。
 * 右側からスライドイン表示されるSheetモーダル内に、フィルター条件入力フォームと
 * 操作ボタンを配置している。
 *
 * フィルター操作の流れ：
 * 1. ユーザーがフィルターボタンをクリック
 * 2. Sheetが開き、現在のフィルター条件が表示される
 * 3. ユーザーが条件を変更（即座に内部状態に反映）
 * 4. 「絞り込む」ボタンで検索結果に適用、またはリセットで全クリア
 *
 * フィルターボタンには現在設定中のフィルター数がバッジで表示され、
 * ユーザーが現在の絞り込み状況を把握できる。
 *
 * @example
 * ```tsx
 * // レシピ一覧ページで使用
 * <RecipeFilterSheet />
 * ```
 */
export default function RecipeFilterSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, pendingFilters, applyFilters, resetFilters, isLoading, hasChanges } =
    useRecipeFilter();

  // フィルター更新ハンドラー群を取得
  const handlers = useFilterHandlers();

  // 設定中のフィルター数をカウント（page/limitは除外）
  const activeFilterCount = useMemo(() => {
    const excludeKeys = ['page', 'limit'];
    return Object.entries(filters).filter(
      ([key, value]) => !excludeKeys.includes(key) && Boolean(value)
    ).length;
  }, [filters]);

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

        {/* フィルター条件の入力フォーム */}
        <FilterContent
          selectedEquipment={pendingFilters.equipment ?? []}
          selectedRoastLevels={pendingFilters.roastLevel ?? []}
          selectedGrindSizes={pendingFilters.grindSize ?? []}
          beanWeightRange={pendingFilters.beanWeight ?? {}}
          waterTempRange={pendingFilters.waterTemp ?? {}}
          waterAmountRange={pendingFilters.waterAmount ?? {}}
          handlers={handlers}
        />

        {/* フィルター操作ボタン */}
        <FilterActions
          onApply={applyFilters}
          onReset={resetFilters}
          isLoading={isLoading}
          hasChanges={hasChanges}
          activeFilterCount={activeFilterCount}
        />
      </SheetContent>
    </Sheet>
  );
}
