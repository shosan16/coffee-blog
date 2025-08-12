'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { Button } from '@/client/shared/shadcn/button';

/**
 * 検索実行ボタンコンポーネント
 *
 * 検索条件とフィルター条件を統合して検索を実行する。
 * ローディング状態を表示して、ユーザーに処理中であることを伝える。
 */
const SearchActionButton = React.memo(() => {
  // レシピクエリフック
  const { apply, isLoading } = useRecipeQuery();

  // 統合検索の実行（検索条件とフィルターを同時に適用）
  const handleIntegratedSearch = React.useCallback(() => {
    apply();
  }, [apply]);

  return (
    <div className="border-input border-l">
      <Button
        onClick={handleIntegratedSearch}
        variant="default"
        className="h-auto rounded-none px-5 py-5 text-sm font-medium"
        disabled={isLoading}
      >
        <Search className="h-4 w-4" />
        検索
      </Button>
    </div>
  );
});

SearchActionButton.displayName = 'SearchActionButton';

export default SearchActionButton;
