'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { useCallback, useMemo, memo } from 'react';

import { cn } from '@/client/lib/tailwind';

type SearchBoxProps = {
  /** 検索値 */
  readonly value: string;
  /** プレースホルダーテキスト */
  readonly placeholder?: string;
  /** 入力値の変更ハンドラー */
  readonly onChange: (value: string) => void;
  /** クリアボタンの表示 */
  readonly clearable?: boolean;
  /** 無効状態 */
  readonly disabled?: boolean;
  /** エラー状態 */
  readonly error?: boolean;
  /** 追加のCSSクラス名 */
  readonly className?: string;
  /** aria-label */
  readonly 'aria-label'?: string;
};

/**
 * レシピ検索用のSearchBoxコンポーネント
 *
 * @example
 * ```tsx
 * <SearchBox
 *   value={searchValue}
 *   onChange={setSearchValue}
 *   placeholder="レシピを検索..."
 *   clearable
 * />
 * ```
 */
function SearchBox({
  value,
  placeholder = 'レシピを検索...',
  onChange,
  clearable = true,
  disabled = false,
  error = false,
  className,
  'aria-label': ariaLabel,
}: SearchBoxProps): React.JSX.Element {
  // 入力値の変更ハンドラー
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // クリアボタンのクリックハンドラー
  const handleClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
    },
    [onChange]
  );

  // Enterキーの処理
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && clearable) {
        onChange('');
      }
    },
    [onChange, clearable]
  );

  // コンテナのスタイルクラス
  const containerClassName = useMemo(
    () =>
      cn(
        'relative flex items-center border rounded-md bg-background transition-colors',
        'border-input shadow-xs',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        error && 'border-destructive ring-destructive/20',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-text',
        className ?? ''
      ),
    [error, disabled, className]
  );

  // 入力フィールドのスタイルクラス
  const inputClassName = useMemo(
    () =>
      cn(
        'flex-1 bg-transparent px-3 py-2.5 text-sm outline-none text-foreground',
        'placeholder:text-muted-foreground',
        disabled && 'cursor-not-allowed'
      ),
    [disabled]
  );

  return (
    <div className={containerClassName}>
      {/* 検索アイコン */}
      <div className="flex items-center pl-3">
        <SearchIcon className="text-muted-foreground size-4" />
      </div>

      {/* 入力フィールド */}
      <input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
      />

      {/* クリアボタン */}
      {clearable && value && !disabled && (
        <div className="flex items-center pr-3">
          <button
            type="button"
            onClick={handleClearClick}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            aria-label="検索をクリア"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(SearchBox);
