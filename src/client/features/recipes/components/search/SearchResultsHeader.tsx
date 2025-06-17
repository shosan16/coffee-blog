'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { useRecipeSearch } from '../../hooks/useRecipeSearch';

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
 * 概要表示を行う。
 *
 * @example
 * ```tsx
 * <SearchResultsHeader resultCount={42} />
 * ```
 */
const SearchResultsHeader = React.memo<SearchResultsHeaderProps>(({ resultCount, className }) => {
  const { searchValue, clearSearch } = useRecipeSearch();

  // 検索結果のテキスト
  const resultText = React.useMemo(() => {
    const baseText = `${resultCount}件のレシピが見つかりました`;

    if (searchValue) {
      return `「${searchValue}」で${baseText}`;
    } else {
      return baseText;
    }
  }, [resultCount, searchValue]);

  return (
    <div
      className={`sticky top-0 z-10 border-b bg-white/70 py-4 backdrop-blur-sm ${className ?? ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 検索結果情報 */}
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 flex-shrink-0 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{resultText}</span>
          </div>

          {/* アクション */}
          <div className="flex items-center gap-3">
            {/* 現在の検索キーワード */}
            {searchValue && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm">
                  <Search className="h-3 w-3 text-blue-600" />
                  <span className="font-medium text-blue-800">{searchValue}</span>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-blue-600 transition-colors hover:text-blue-800"
                    aria-label="検索キーワードをクリア"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SearchResultsHeader.displayName = 'SearchResultsHeader';

export default SearchResultsHeader;
