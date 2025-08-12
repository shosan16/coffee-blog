'use client';

import { XIcon } from 'lucide-react';
import * as React from 'react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

type SearchInputProps = {
  /** プレースホルダーテキスト */
  readonly placeholder?: string;
  /** aria-label */
  readonly 'aria-label'?: string;
};

/**
 * 検索入力フィールドコンポーネント
 *
 * キーワード検索の入力とクリア機能を提供する。
 * Enterキーでの検索実行とEscapeキーでのクリアに対応。
 */
const SearchInput = React.memo<SearchInputProps>(
  ({ placeholder = 'レシピを検索...', 'aria-label': ariaLabel }) => {
    // レシピクエリフック
    const { pendingSearchValue, setSearchValue, apply } = useRecipeQuery();

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
        setSearchValue('');
      },
      [setSearchValue]
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
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
