import { useState, useMemo, useEffect, useCallback } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(INITIAL_FOCUSED_INDEX);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;

    const searchTerm = searchValue.toLowerCase().trim();
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm));
  }, [options, searchValue]);

  useEffect(() => {
    onInputChange?.(searchValue);
  }, [searchValue, onInputChange]);

  const handleOpen = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback((): void => {
    setIsOpen(false);
    setSearchValue('');
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, []);

  const handleSelectOption = useCallback(
    (option: ComboboxOptionType): void => {
      if (option.disabled) return;

      onValueChange?.(option.value);
      setIsOpen(false);
      setSearchValue('');
      setFocusedIndex(INITIAL_FOCUSED_INDEX);
    },
    [onValueChange]
  );

  const handleSetSearchValue = useCallback((newValue: string): void => {
    setSearchValue(newValue);
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, []);

  const handleSetFocusedIndex = useCallback((index: number): void => {
    setFocusedIndex(index);
  }, []);

  const handleClear = useCallback((): void => {
    onValueChange?.('');
    setSearchValue('');
    setFocusedIndex(INITIAL_FOCUSED_INDEX);
  }, [onValueChange]);

  const actions = useMemo(
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
