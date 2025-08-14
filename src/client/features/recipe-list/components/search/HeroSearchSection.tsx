'use client';

import { Coffee } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/client/lib/tailwind';

import FilterTriggerButton from './FilterTriggerButton';
import SearchActionButton from './SearchActionButton';
import SearchInput from './SearchInput';

type HeroSearchSectionProps = {
  /** 初期の検索結果数 */
  readonly initialResultCount?: number;
};

/**
 * ヒーローセクション用の検索コンポーネント
 *
 * サイト訪問者の最初のタッチポイントとなるメインビジュアルと検索機能を統合。
 * ユーザーが求めるコーヒーレシピに素早くリーチできるよう、
 * キーワード検索と詳細フィルターを一体化した直感的なインターフェースを提供。
 *
 * @param initialResultCount - 初期表示される検索結果数（表示用、機能には影響しない）
 *
 * @example
 * ```tsx
 * <HeroSearchSection initialResultCount={42} />
 * ```
 */
const HeroSearchSection = React.memo<HeroSearchSectionProps>(
  ({ initialResultCount: _initialResultCount }) => {
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const searchBarClassName = React.useMemo(
      () =>
        cn(
          'flex items-center bg-background border border-input rounded-md shadow-sm overflow-hidden',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'transition-colors',
          'h-14 text-lg shadow-2xl'
        ),
      []
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

            {/* 統合検索バー */}
            <div className="w-full max-w-3xl">
              <div className={searchBarClassName}>
                {/* 検索入力フィールド */}
                <SearchInput
                  placeholder="キーワード  [例: バリスタ・レシピ・コーヒー豆]"
                  aria-label="コーヒーレシピを検索"
                />

                {/* フィルターボタン */}
                <FilterTriggerButton isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} />

                {/* 検索ボタン */}
                <SearchActionButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HeroSearchSection.displayName = 'HeroSearchSection';

export default HeroSearchSection;
