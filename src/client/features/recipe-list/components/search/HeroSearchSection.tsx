'use client';

import { Coffee, Search } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';

import FilterSheet from '@/client/features/recipe-list/components/search/FilterSheet';
import FilterTriggerButton from '@/client/features/recipe-list/components/search/FilterTriggerButton';
import SearchInput from '@/client/features/recipe-list/components/search/SearchInput';
import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { cn } from '@/client/lib/tailwind';
import { Button } from '@/client/shared/shadcn/button';

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
function HeroSearchSection({
  initialResultCount: _initialResultCount,
}: HeroSearchSectionProps): React.JSX.Element {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const queryResult = useRecipeQuery();
  const { apply, isLoading, activeFilterCount } = queryResult;

  const searchBarClassName = useMemo(
    () =>
      cn(
        'flex items-center bg-background border border-input rounded-md shadow-sm overflow-hidden',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'transition-colors',
        'h-14 text-lg shadow-2xl'
      ),
    []
  );

  const handleSearchClick = useCallback(() => {
    apply();
  }, [apply]);

  const handleFilterClick = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

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
              <FilterTriggerButton
                activeFilterCount={activeFilterCount}
                onClick={handleFilterClick}
                isOpen={isFilterOpen}
              />

              {/* 検索ボタン */}
              <div className="border-input border-l">
                <Button
                  onClick={handleSearchClick}
                  variant="default"
                  className="h-auto rounded-none px-5 py-5 text-sm font-medium"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                  検索
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フィルターシート */}
      <FilterSheet isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} queryResult={queryResult} />
    </div>
  );
}

export default memo(HeroSearchSection);
