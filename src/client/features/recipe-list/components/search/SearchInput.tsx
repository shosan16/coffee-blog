'use client';

import { Search, XIcon } from 'lucide-react';
import * as React from 'react';

import { useRecipeSearch } from '@/client/features/recipe-list/hooks/useRecipeSearch';

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
    // 検索フック
    const { pendingSearchValue, updateSearchValue, applySearch } = useRecipeSearch();

    // 入力値の変更ハンドラー
    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchValue(e.target.value);
      },
      [updateSearchValue]
    );

    // クリアボタンのクリックハンドラー
    const handleClearClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        updateSearchValue('');
      },
      [updateSearchValue]
    );

    // Enterキーの処理
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          applySearch();
        } else if (e.key === 'Escape' && pendingSearchValue) {
          updateSearchValue('');
        }
      },
      [applySearch, updateSearchValue, pendingSearchValue]
    );

    return (
      <div className="flex flex-1 items-center px-3 py-2.5">
        <Search className="text-muted-foreground mr-3 h-4 w-4" />
        <input
          type="text"
          className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
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
