'use client';

import * as React from 'react';

import { cn } from '@/client/lib/tailwind';

import ComboboxOption from './ComboboxOption';
import type { ComboboxOptionType } from './types';

type ComboboxDropdownProps = {
  readonly isOpen: boolean;
  readonly loading: boolean;
  readonly filteredOptions: readonly ComboboxOptionType[];
  readonly selectedValue?: string;
  readonly focusedIndex: number;
  readonly emptyMessage: string;
  readonly ariaAttributes: Record<string, unknown>;
  readonly onOptionClick: (option: ComboboxOptionType) => void;
  readonly onOptionMouseEnter: (index: number) => void;
  readonly listRef: React.RefObject<HTMLUListElement | null>;
  readonly getOptionAriaAttributes: (index: number, isSelected: boolean) => Record<string, unknown>;
};

const ComboboxDropdown = React.memo<ComboboxDropdownProps>(
  ({
    isOpen,
    loading,
    filteredOptions,
    selectedValue,
    focusedIndex,
    emptyMessage,
    ariaAttributes,
    onOptionClick,
    onOptionMouseEnter,
    listRef,
    getOptionAriaAttributes,
  }) => {
    // オプションのマウスエンターハンドラー
    const createOptionMouseEnterHandler = React.useCallback(
      (index: number) => {
        return () => onOptionMouseEnter(index);
      },
      [onOptionMouseEnter]
    );

    // ドロップダウンのスタイルクラス
    const dropdownClassName = React.useMemo(
      () =>
        cn(
          'absolute top-full left-0 z-50 mt-1 w-full',
          'bg-popover border rounded-md shadow-md',
          'max-h-60 overflow-y-auto'
        ),
      []
    );

    // 早期リターン
    if (!isOpen) {
      return null;
    }

    return (
      <div className={dropdownClassName}>
        {loading && <div className="text-muted-foreground px-3 py-2 text-sm">読み込み中...</div>}

        {!loading && filteredOptions.length > 0 && (
          <ul ref={listRef} {...ariaAttributes} className="py-1">
            {filteredOptions.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isFocused = focusedIndex === index;

              return (
                <ComboboxOption
                  key={option.value}
                  option={option}
                  isSelected={isSelected}
                  isFocused={isFocused}
                  ariaAttributes={getOptionAriaAttributes(index, isSelected)}
                  onClick={onOptionClick}
                  onMouseEnter={createOptionMouseEnterHandler(index)}
                />
              );
            })}
          </ul>
        )}

        {!loading && filteredOptions.length === 0 && (
          <div className="text-muted-foreground px-3 py-2 text-sm">{emptyMessage}</div>
        )}
      </div>
    );
  }
);

ComboboxDropdown.displayName = 'ComboboxDropdown';

export default ComboboxDropdown;
