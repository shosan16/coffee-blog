'use client';

import * as React from 'react';
import { ChevronDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/client/lib/tailwind';

import type { ComboboxOptionType } from './types';

type ComboboxInputProps = {
  readonly value: string;
  readonly placeholder: string;
  readonly searchPlaceholder: string;
  readonly isOpen: boolean;
  readonly selectedOption: ComboboxOptionType | undefined;
  readonly clearable: boolean;
  readonly disabled: boolean;
  readonly error: boolean;
  readonly ariaAttributes: Record<string, unknown>;
  readonly onInputChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
  readonly onInputClick: () => void;
  readonly onClear: () => void;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
};

const ComboboxInput = React.memo<ComboboxInputProps>(
  ({
    value,
    placeholder,
    searchPlaceholder,
    isOpen,
    selectedOption,
    clearable,
    disabled,
    error,
    ariaAttributes,
    onInputChange,
    onKeyDown,
    onInputClick,
    onClear,
    inputRef,
  }) => {
    // 入力値の変更ハンドラー
    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(e.target.value);
      },
      [onInputChange]
    );

    // クリアボタンのクリックハンドラー
    const handleClearClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClear();
      },
      [onClear]
    );

    // 表示する値を計算
    const displayValue = React.useMemo(() => {
      return isOpen ? value : (selectedOption?.label ?? '');
    }, [isOpen, value, selectedOption?.label]);

    // 表示するプレースホルダーを計算
    const displayPlaceholder = React.useMemo(() => {
      return isOpen ? searchPlaceholder : (selectedOption?.label ?? placeholder);
    }, [isOpen, searchPlaceholder, selectedOption?.label, placeholder]);

    // コンテナのスタイルクラス
    const containerClassName = React.useMemo(
      () =>
        cn(
          'relative flex items-center border rounded-md bg-transparent transition-colors',
          'border-input shadow-xs',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          error && 'border-destructive ring-destructive/20',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-text'
        ),
      [error, disabled]
    );

    // 入力フィールドのスタイルクラス
    const inputClassName = React.useMemo(
      () =>
        cn(
          'flex-1 bg-transparent px-3 py-2 text-sm outline-none',
          'placeholder:text-muted-foreground',
          disabled && 'cursor-not-allowed'
        ),
      [disabled]
    );

    // シェブロンアイコンのスタイルクラス
    const chevronClassName = React.useMemo(
      () => cn('size-4 text-muted-foreground transition-transform', isOpen && 'rotate-180'),
      [isOpen]
    );

    return (
      <div className={containerClassName} onClick={onInputClick}>
        <input
          ref={inputRef}
          type="text"
          className={inputClassName}
          placeholder={displayPlaceholder}
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          {...ariaAttributes}
        />

        <div className="flex items-center gap-1 pr-3">
          {clearable && selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClearClick}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="クリア"
            >
              <XIcon className="size-4" />
            </button>
          )}
          <ChevronDownIcon className={chevronClassName} />
        </div>
      </div>
    );
  }
);

ComboboxInput.displayName = 'ComboboxInput';

export default ComboboxInput;
