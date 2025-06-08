import * as React from 'react';

import type { ComboboxOptionType, UseComboboxReturn } from '../types';

type UseComboboxProps = {
  readonly options: readonly ComboboxOptionType[];
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly onInputChange?: (value: string) => void;
};

const INITIAL_FOCUSED_INDEX = -1;

export const useCombobox = ({
  options,
  value,
  onValueChange,
  onInputChange,
}: UseComboboxProps): UseComboboxReturn => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(INITIAL_FOCUSED_INDEX);

  // 選択されたオプションを取得
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // フィルタリングされたオプション
  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) return options;

    const searchTerm = searchValue.toLowerCase().trim();
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm));
  }, [options, searchValue]);

  // 検索値の変更を親に通知
  React.useEffect(() => {
    onInputChange?.(searchValue);
  }, [searchValue, onInputChange]);

  // アクション関数群
  const handleOpen = React.useCallback((): void => {
    setIsOpen(true);
  }, []);

  const handleClose = React.useCallback((): void => {
    setIsOpen(false);
    setSearchValue('');
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, []);

  const handleSelectOption = React.useCallback(
    (option: ComboboxOptionType): void => {
      if (option.disabled) return;

      onValueChange?.(option.value);
      setIsOpen(false);
      setSearchValue('');
      setFocusedIndex(INITIAL_FOCUSED_INDEX);
    },
    [onValueChange]
  );

  const handleSetSearchValue = React.useCallback((newValue: string): void => {
    setSearchValue(newValue);
    // 検索時にフォーカスをリセット
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, []);

  const handleSetFocusedIndex = React.useCallback((index: number): void => {
    setFocusedIndex(index);
  }, []);

  const handleClear = React.useCallback((): void => {
    onValueChange?.('');
    setSearchValue('');
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, [onValueChange]);

  // アクションオブジェクト
  const actions = React.useMemo(
    () => ({
      open: handleOpen,
      close: handleClose,
      selectOption: handleSelectOption,
      setSearchValue: handleSetSearchValue,
      setFocusedIndex: handleSetFocusedIndex,
      clear: handleClear,
    }),
    [
      handleOpen,
      handleClose,
      handleSelectOption,
      handleSetSearchValue,
      handleSetFocusedIndex,
      handleClear,
    ]
  );

  // 派生状態
  const hasValue = Boolean(selectedOption);
  const isEmpty = filteredOptions.length === 0;

  return {
    isOpen,
    searchValue,
    focusedIndex,
    selectedOption,
    filteredOptions,
    actions,
    hasValue,
    isEmpty,
  };
};
