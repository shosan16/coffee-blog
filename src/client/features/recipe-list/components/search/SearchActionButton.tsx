'use client';

import * as React from 'react';

import { useRecipeFilter } from '@/client/features/recipe-list/hooks/useRecipeFilter';
import { useRecipeSearch } from '@/client/features/recipe-list/hooks/useRecipeSearch';
import { Button } from '@/client/shared/shadcn/button';

/**
 * 検索実行ボタンコンポーネント
 *
 * 検索条件とフィルター条件を統合して検索を実行する。
 * ローディング状態を表示して、ユーザーに処理中であることを伝える。
 */
const SearchActionButton = React.memo(() => {
  // 検索とフィルターのフック
  const { applySearch } = useRecipeSearch();
  const { isLoading } = useRecipeFilter();

  // 統合検索の実行（検索条件とフィルターを同時に適用）
  const handleIntegratedSearch = React.useCallback(() => {
    applySearch();
  }, [applySearch]);

  return (
    <div className="border-input border-l">
      <Button
        onClick={handleIntegratedSearch}
        variant="default"
        className="h-auto rounded-none px-10 py-5 text-sm font-medium"
        disabled={isLoading}
      >
        検索
      </Button>
    </div>
  );
});

SearchActionButton.displayName = 'SearchActionButton';

export default SearchActionButton;
