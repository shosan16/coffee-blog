'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

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
  const { searchValue } = useRecipeSearch();

  // 検索結果のテキスト
  const resultText = React.useMemo(() => {
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

  return (
    <div
      className={`sticky top-0 z-10 h-18 border-b bg-white/70 backdrop-blur-sm ${className ?? ''}`}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 検索結果情報 */}
          <div className="flex items-center gap-2">
            {resultCount > 0 && (
              <>
                <Search className="h-5 w-5 flex-shrink-0 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{resultText}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SearchResultsHeader.displayName = 'SearchResultsHeader';

export default SearchResultsHeader;
