'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import { Button } from '@/client/shared/shadcn/button';

/**
 * 検索実行ボタンコンポーネント
 *
 * ユーザーが設定した全ての検索条件（キーワード・フィルター）を
 * 一度に適用してレシピ検索を実行。
 * 検索処理中は操作を無効化し、重複実行によるパフォーマンス問題を防止。
 */
const SearchActionButton = React.memo(() => {
  // レシピクエリフック
  const { apply, isLoading } = useRecipeQuery();

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
