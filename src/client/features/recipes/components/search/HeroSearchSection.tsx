'use client';

import * as React from 'react';
import { Coffee } from 'lucide-react';

import SearchBox from './SearchBox';
import { useRecipeSearch } from '../../hooks/useRecipeSearch';

type HeroSearchSectionProps = {
  /** 初期の検索結果数 */
  readonly initialResultCount?: number;
};

/**
 * ヒーローセクション用の検索コンポーネント
 *
 * メインビジュアルと検索機能を統合し、
 * インタラクティブな検索体験を提供する。
 *
 * @example
 * ```tsx
 * <HeroSearchSection initialResultCount={42} />
 * ```
 */
const HeroSearchSection = React.memo<HeroSearchSectionProps>(({ initialResultCount }) => {
  const { pendingSearchValue, updateSearchValue, applySearch, resultCount, setResultCount } =
    useRecipeSearch();

  // 初期結果数の設定
  React.useEffect(() => {
    if (typeof initialResultCount === 'number' && resultCount === undefined) {
      setResultCount(initialResultCount);
    }
  }, [initialResultCount, resultCount, setResultCount]);

  // 検索キーワードの変更ハンドラー
  const handleSearchChange = React.useCallback(
    (value: string) => {
      updateSearchValue(value);
    },
    [updateSearchValue]
  );

  // Enterキーで検索実行
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        applySearch();
      }
    },
    [applySearch]
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 py-20 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* メインタイトル */}
          <Coffee className="mb-6 h-16 w-16 text-amber-200" />
          <h1 className="mb-4 text-5xl font-bold tracking-tight">Coffee Recipe Collection</h1>
          <p className="mb-8 max-w-2xl text-xl text-amber-100">
            プロのバリスタが考案した最高のコーヒーレシピで
            <br />
            おうちカフェを極上の体験に
          </p>

          {/* 検索ボックス */}
          <div className="w-full max-w-2xl space-y-4">
            <div onKeyDown={handleKeyDown}>
              <SearchBox
                value={pendingSearchValue}
                onChange={handleSearchChange}
                placeholder="レシピを検索... （例：エスプレッソ、ドリップ）"
                className="h-14 border-0 bg-white/95 text-lg text-gray-900 shadow-2xl backdrop-blur-sm"
                aria-label="コーヒーレシピを検索"
              />
            </div>

            {/* 検索ボタン */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={applySearch}
                className="rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-900 focus:outline-none"
              >
                レシピを検索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSearchSection.displayName = 'HeroSearchSection';

export default HeroSearchSection;
