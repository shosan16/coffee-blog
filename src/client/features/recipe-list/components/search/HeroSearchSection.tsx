'use client';

import { Coffee } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '../../hooks/useRecipeQuery';

import IntegratedSearchBar from './IntegratedSearchBar';

type HeroSearchSectionProps = {
  /** 初期の検索結果数 */
  readonly initialResultCount?: number;
};

/**
 * ヒーローセクション用の検索コンポーネント
 *
 * メインビジュアルと統合検索機能を提供し、
 * 食べログ風の統合検索体験を実現する。
 *
 * @example
 * ```tsx
 * <HeroSearchSection initialResultCount={42} />
 * ```
 */
const HeroSearchSection = React.memo<HeroSearchSectionProps>(({ initialResultCount }) => {
  const { resultCount, setResultCount } = useRecipeQuery();

  // 初期結果数の設定
  React.useEffect(() => {
    if (typeof initialResultCount === 'number' && resultCount === undefined) {
      setResultCount(initialResultCount);
    }
  }, [initialResultCount, resultCount, setResultCount]);

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

          {/* 統合検索バー */}
          <div className="w-full max-w-3xl">
            <IntegratedSearchBar
              placeholder="レシピを検索... （例：エスプレッソ、ドリップ）"
              className="h-14 text-lg shadow-2xl"
              aria-label="コーヒーレシピを検索"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSearchSection.displayName = 'HeroSearchSection';

export default HeroSearchSection;
