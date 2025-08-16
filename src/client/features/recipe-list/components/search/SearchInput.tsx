'use client';

import { XIcon } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

type SearchInputProps = {
  /** 入力例を示すプレースホルダーテキスト */
  readonly placeholder?: string;
  /** スクリーンリーダー向けの説明ラベル */
  readonly 'aria-label'?: string;
};

/**
 * 検索入力フィールドコンポーネント
 *
 * ユーザーが直感的にコーヒーレシピを検索できるテキスト入力インターフェース。
 * レシピ名、器具名、技法名など自由なキーワードでの部分一致検索をサポート。
 * 素早い検索実行とリセットにより、試行錯誤的な検索体験を最適化。
 *
 * @param placeholder - 入力例を示すプレースホルダーテキスト
 * @param aria-label - スクリーンリーダー向けの説明ラベル
 */
function SearchInput({
  placeholder = 'レシピを検索...',
  'aria-label': ariaLabel,
}: SearchInputProps): React.JSX.Element {
  // レシピクエリフック
  const { pendingSearchValue, setSearchValue, apply, clearSearch } = useRecipeQuery();

  // 入力値の変更ハンドラー
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue]
  );

  // クリアボタンのクリックハンドラー
  const handleClearClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      clearSearch();
    },
    [clearSearch]
  );

  // Enterキーの処理
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        apply();
      } else if (e.key === 'Escape' && pendingSearchValue) {
        setSearchValue('');
      }
    },
    [pendingSearchValue, apply, setSearchValue]
  );

  return (
    <div className="flex flex-1 items-center px-3 py-2.5">
      <input
        type="text"
        className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent pl-2 text-sm outline-none"
        placeholder={placeholder}
        value={pendingSearchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel ?? placeholder}
      />

      {/* クリアボタン */}
      {pendingSearchValue && (
        <button
          type="button"
          onClick={handleClearClick}
          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          aria-label="検索をクリア"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default React.memo(SearchInput);
