'use client';

import * as React from 'react';

import { cn } from '@/client/lib/tailwind';

import ComboboxDropdown from './ComboboxDropdown';
import ComboboxInput from './ComboboxInput';
import { useClickOutside } from './hooks/useClickOutside';
import { useCombobox } from './hooks/useCombobox';
import { useComboboxKeyboard } from './hooks/useComboboxKeyboard';
import type { ComboboxProps, ComboboxOptionType } from './types';
import { generateComboboxIds, getAriaAttributes } from './utils/accessibility';

const DEFAULT_PLACEHOLDER = '選択してください';
const DEFAULT_SEARCH_PLACEHOLDER = '検索...';
const DEFAULT_EMPTY_MESSAGE = '該当する項目が見つかりません';

/**
 * フォーカスされたアイテムをスクロール表示する
 */
function useScrollIntoView(
  focusedIndex: number,
  listRef: React.RefObject<HTMLUListElement | null>
): void {
  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      focusedElement.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [focusedIndex, listRef]);
}

/**
 * Comboboxコンポーネントのイベントハンドラー
 */
const useComboboxHandlers = (
  comboboxState: ReturnType<typeof useCombobox>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  disabled: boolean
) => {
  const handleInputClick = React.useCallback(() => {
    if (!disabled) {
      comboboxState.actions.open();
    }
  }, [disabled, comboboxState.actions]);

  const handleClear = React.useCallback(() => {
    comboboxState.actions.clear();
    inputRef.current?.focus();
  }, [comboboxState.actions, inputRef]);

  const handleOptionClick = React.useCallback(
    (option: ComboboxOptionType) => {
      comboboxState.actions.selectOption(option);
      inputRef.current?.focus();
    },
    [comboboxState.actions, inputRef]
  );

  return {
    handleInputClick,
    handleClear,
    handleOptionClick,
  };
};

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      onInputChange,
      placeholder = DEFAULT_PLACEHOLDER,
      searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
      emptyMessage = DEFAULT_EMPTY_MESSAGE,
      clearable = false,
      disabled = false,
      loading = false,
      error = false,
      className,
      width = 'full',
      size: _size = 'md',
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const comboboxRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    // Refを統合
    React.useImperativeHandle(ref, () => comboboxRef.current as HTMLDivElement, []);

    // メインロジック
    const comboboxState = useCombobox({
      options,
      value,
      onValueChange,
      onInputChange,
    });

    // キーボードナビゲーション
    const { handleKeyDown } = useComboboxKeyboard({
      isOpen: comboboxState.isOpen,
      focusedIndex: comboboxState.focusedIndex,
      filteredOptions: comboboxState.filteredOptions as ComboboxOptionType[],
      actions: comboboxState.actions,
      disabled,
    });

    // 外部クリック検知
    useClickOutside(comboboxRef, comboboxState.actions.close);

    // イベントハンドラー
    const { handleInputClick, handleClear, handleOptionClick } = useComboboxHandlers(
      comboboxState,
      inputRef,
      disabled
    );

    // フォーカスされたアイテムをスクロール表示
    useScrollIntoView(comboboxState.focusedIndex, listRef);

    // アクセシビリティ属性
    const ids = React.useMemo(() => generateComboboxIds(testId), [testId]);
    const ariaAttributes = React.useMemo(
      () => getAriaAttributes(comboboxState, ids),
      [comboboxState, ids]
    );

    // スタイルクラス
    const containerClassName = React.useMemo(
      () => cn('relative', width === 'full' ? 'w-full' : 'w-auto', className),
      [width, className]
    );

    return (
      <div ref={comboboxRef} className={containerClassName} data-testid={testId} {...props}>
        <ComboboxInput
          value={comboboxState.searchValue}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          isOpen={comboboxState.isOpen}
          selectedOption={comboboxState.selectedOption}
          clearable={clearable}
          disabled={disabled}
          error={error}
          ariaAttributes={ariaAttributes.input}
          onInputChange={comboboxState.actions.setSearchValue}
          onKeyDown={handleKeyDown}
          onInputClick={handleInputClick}
          onClear={handleClear}
          inputRef={inputRef}
        />

        <ComboboxDropdown
          isOpen={comboboxState.isOpen}
          loading={loading}
          filteredOptions={comboboxState.filteredOptions as ComboboxOptionType[]}
          selectedValue={value}
          focusedIndex={comboboxState.focusedIndex}
          emptyMessage={emptyMessage}
          ariaAttributes={ariaAttributes.listbox}
          onOptionClick={handleOptionClick}
          onOptionMouseEnter={comboboxState.actions.setFocusedIndex}
          listRef={listRef}
          getOptionAriaAttributes={(index: number, isSelected: boolean) =>
            ariaAttributes.option(index, isSelected)
          }
        />
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;
