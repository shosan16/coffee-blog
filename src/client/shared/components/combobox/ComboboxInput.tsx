'use client';

import { ChevronDownIcon, XIcon } from 'lucide-react';
import { useCallback, useMemo, memo } from 'react';

import { cn } from '@/client/lib/tailwind';

import { SELECT_SIZES, type SelectSize } from '../../styles/select-styles';

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
  readonly size?: SelectSize;
  readonly ariaAttributes: Record<string, unknown>;
  readonly onInputChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
  readonly onInputClick: () => void;
  readonly onClear: () => void;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
};

function ComboboxInput({
  value,
  placeholder,
  searchPlaceholder,
  isOpen,
  selectedOption,
  clearable,
  disabled,
  error,
  size = 'md',
  ariaAttributes,
  onInputChange,
  onKeyDown,
  onInputClick,
  onClear,
  inputRef,
}: ComboboxInputProps): React.JSX.Element {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onInputChange(e.target.value);
    },
    [onInputChange]
  );

  const handleClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear();
    },
    [onClear]
  );

  const displayValue = useMemo(() => {
    return isOpen ? value : (selectedOption?.label ?? '');
  }, [isOpen, value, selectedOption?.label]);

  const displayPlaceholder = useMemo(() => {
    return isOpen ? searchPlaceholder : (selectedOption?.label ?? placeholder);
  }, [isOpen, searchPlaceholder, selectedOption?.label, placeholder]);

  const containerClassName = useMemo(
    () =>
      cn(
        'relative flex items-center rounded-md bg-card transition-colors',
        SELECT_SIZES[size],
        // 統一ボーダー
        'border-2 border-primary/30',
        // ホバー
        'hover:border-primary/50',
        // フォーカス
        'focus-within:border-primary focus-within:ring-ring/20 focus-within:ring-2',
        // エラー
        error && 'border-destructive ring-destructive/20',
        // 無効
        disabled && 'opacity-50 cursor-not-allowed border-border',
        !disabled && 'cursor-text'
      ),
    [error, disabled, size]
  );

  const inputClassName = useMemo(
    () =>
      cn(
        'flex-1 bg-transparent outline-none',
        'placeholder:text-muted-foreground',
        disabled && 'cursor-not-allowed'
      ),
    [disabled]
  );

  const chevronClassName = 'size-4 text-muted-foreground';

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

      <div className="flex items-center gap-1">
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

export default memo(ComboboxInput);
