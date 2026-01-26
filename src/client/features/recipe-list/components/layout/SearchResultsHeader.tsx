'use client';

import { Search } from 'lucide-react';
import { useMemo, memo, useCallback } from 'react';

import SortSelect from '@/client/features/recipe-list/components/sort/SortSelect';
import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

type SearchResultsHeaderProps = {
  /** 検索結果数 */
  readonly resultCount: number;
  /** 追加のCSSクラス名 */
  readonly className?: string;
};

/**
 * 検索結果表示用のヘッダーコンポーネント
 *
 * 検索結果数、現在の検索キーワード、アクティブフィルターの
 * 概要表示とソート機能を提供する。
 *
 * @example
 * ```tsx
 * <SearchResultsHeader resultCount={42} />
 * ```
 */
function SearchResultsHeader({
  resultCount,
  className,
}: SearchResultsHeaderProps): React.JSX.Element {
  const { searchValue, filters, applyFilters } = useRecipeQuery();

  // 検索結果のテキスト
  const resultText = useMemo(() => {
    const baseText = `${resultCount}件のレシピが見つかりました`;

    if (resultCount === 0) {
      return null;
    }

    if (searchValue) {
      return `「${searchValue}」で${baseText}`;
    } else {
      return baseText;
    }
  }, [resultCount, searchValue]);

  // ソート変更ハンドラ
  const handleSortChange = useCallback(
    (sort: string, order: 'asc' | 'desc') => {
      applyFilters({ sort, order });
    },
    [applyFilters]
  );

  return (
    <div
      className={`border-border bg-background/70 sticky top-0 z-10 h-18 border-b backdrop-blur-sm ${className ?? ''}`}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 検索結果情報 */}
          <div className="flex items-center gap-2">
            {resultCount > 0 && (
              <>
                <Search className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                <span className="text-foreground text-sm font-medium">{resultText}</span>
              </>
            )}
          </div>

          {/* ソートセレクト */}
          <div className="flex items-center gap-2">
            <SortSelect
              currentSort={filters.sort}
              currentOrder={filters.order}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SearchResultsHeader);
