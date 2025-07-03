'use client';

import { Coffee } from 'lucide-react';
import * as React from 'react';

import { useRecipeSearch } from '../../hooks/useRecipeSearch';

import SearchBox from './SearchBox';

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
    <div className="bg-primary text-primary-foreground relative overflow-hidden py-20">
      <div className="bg-primary/10 absolute inset-0" />
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* メインタイトル */}
          <Coffee className="text-primary-foreground mb-6 h-16 w-16" />
          <h1 className="mb-4 text-5xl font-bold tracking-tight">Coffee Recipe Collection</h1>
          <p className="text-primary-foreground mb-8 max-w-2xl text-xl">
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
                className="bg-card text-card-foreground h-14 border-0 text-lg shadow-2xl"
                aria-label="コーヒーレシピを検索"
              />
            </div>

            {/* 検索ボタン */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={applySearch}
                className="bg-card text-card-foreground hover:bg-card/90 focus:ring-ring focus:ring-offset-primary rounded-lg px-8 py-3 font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
