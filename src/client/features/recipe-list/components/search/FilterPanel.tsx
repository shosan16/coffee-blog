'use client';

import { Filter, RotateCcw, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, type JSX } from 'react';

import ConditionFilter from '@/client/features/recipe-list/components/filter/ConditionFilter';
import EquipmentFilter from '@/client/features/recipe-list/components/filter/EquipmentFilter';
import type { UseRecipeQueryReturn } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { Button } from '@/client/shared/shadcn/button';

type FilterPanelProps = {
  /** フィルターパネルの表示状態 */
  readonly isOpen: boolean;
  /** フィルターパネルの開閉制御ハンドラー */
  readonly onOpenChange: (open: boolean) => void;
  /** レシピ検索とフィルター操作の状態管理 */
  readonly queryResult: UseRecipeQueryReturn;
};

/**
 * フィルターパネルコンポーネント
 *
 * レシピフィルター条件の設定・操作を行うパネルUI。
 * 絞り込みボタンの下に展開表示され、器具、焙煎度、豆の重量など
 * 詳細な条件設定と、フィルターの適用・リセット機能を提供する。
 *
 * @param isOpen フィルターパネルの表示状態
 * @param onOpenChange フィルターパネルの開閉制御ハンドラー
 * @param queryResult レシピ検索とフィルター操作の状態管理
 */
function FilterPanel({ isOpen, onOpenChange, queryResult }: FilterPanelProps): JSX.Element | null {
  const { pendingFilters, setFilter, apply, reset, isLoading, hasChanges, activeFilterCount } =
    queryResult;

  const panelRef = useRef<HTMLDivElement>(null);

  // フィルター適用後に検索結果を即座に表示するため、パネルを自動的に閉じる
  const handleApply = useCallback((): void => {
    apply();
    onOpenChange(false);
  }, [apply, onOpenChange]);

  const handleEquipmentChange = useCallback(
    (equipment: string[]) => {
      setFilter('equipment', equipment);
    },
    [setFilter]
  );

  const handleRoastLevelChange = useCallback(
    (roastLevel: string[]) => {
      setFilter('roastLevel', roastLevel);
    },
    [setFilter]
  );

  // パネル外クリックで閉じる（UX向上のため）
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;

      // MultiCombobox のドロップダウンコンテンツかチェック
      // ドロップダウンは body 直下にレンダリングされるため、
      // data-filter-dropdown 属性を使って明示的に判定する
      const isPopoverContent =
        target instanceof Element && target.closest('[data-filter-dropdown]');

      if (panelRef.current && !panelRef.current.contains(target) && !isPopoverContent) {
        onOpenChange(false);
      }
    };

    // mousedown イベントを使用することで、クリック開始時点で判定
    // これにより、パネル内でクリック開始→外でリリースした場合に誤って閉じることを防ぐ
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby="filter-panel-title"
      aria-describedby="filter-description"
      className="bg-card text-card-foreground absolute top-[calc(100%+0.5rem)] right-2 left-2 z-50 mx-auto flex max-h-[80vh] flex-col rounded-lg border shadow-lg md:right-0 md:left-0 md:max-h-[800px] md:max-w-6xl"
    >
      <div id="filter-description" className="sr-only">
        レシピの絞り込み条件を設定できます。難易度、所要時間、器具、豆の種類などで絞り込みが可能です。
      </div>

      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 id="filter-panel-title" className="text-lg font-semibold">
          フィルター条件
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          aria-label="フィルターパネルを閉じる"
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <ConditionFilter
          roastLevels={pendingFilters.roastLevel ?? []}
          onRoastLevelChange={handleRoastLevelChange}
        />

        <EquipmentFilter
          selectedEquipment={pendingFilters.equipment ?? []}
          onChange={handleEquipmentChange}
        />
      </div>

      <div className="space-y-3 border-t px-6 py-4">
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
            onClick={handleApply}
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
  );
}

export default memo(FilterPanel);
