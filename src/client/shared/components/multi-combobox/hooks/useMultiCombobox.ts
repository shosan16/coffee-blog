import * as React from 'react';

import type { MultiComboboxProps, UseMultiComboboxReturn } from '../types';

import { useFocusManagement } from './useFocusManagement';
import { useItemManagement } from './useItemManagement';
import { useKeyboardNavigation } from './useKeyboardNavigation';

/**
 * MultiComboboxコンポーネントの状態管理とビジネスロジックを提供するカスタムフック
 *
 */
export function useMultiCombobox({
  items,
  selectedItems,
  onSelect,
  onDelete,
  onAdd,
  creatable = false,
  disabled = false,
  maxItems,
  autoFocus = true,
}: Pick<
  MultiComboboxProps,
  | 'items'
  | 'selectedItems'
  | 'onSelect'
  | 'onDelete'
  | 'onAdd'
  | 'creatable'
  | 'disabled'
  | 'maxItems'
  | 'autoFocus'
>): UseMultiComboboxReturn {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const listboxId = React.useId();

  // フォーカス管理
  const focusManagement = useFocusManagement({ autoFocus, disabled });

  // アイテム管理
  const itemManagement = useItemManagement({
    items,
    selectedItems,
    inputValue,
    creatable,
    disabled,
    maxItems,
    onSelect,
    onDelete,
    onAdd,
    setInputValue,
    inputRef: focusManagement.inputRef,
  });

  // キーボードナビゲーション
  const keyboardNavigation = useKeyboardNavigation({
    disabled,
    open,
    canCreateNewItem: itemManagement.canCreateNewItem,
    filteredItems: itemManagement.filteredItems,
    inputValue,
    selectedItems,
    setOpen,
    handleAddNewItem: itemManagement.handleAddNewItem,
    handleSelectItem: itemManagement.handleSelectItem,
    handleDeleteItem: itemManagement.handleDeleteItem,
  });

  // ドロップダウン開閉に必要なクリックハンドラーを拡張
  const handleInputClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      focusManagement.handleInputClick(e);
      setOpen(true);
    },
    [focusManagement, disabled]
  );

  const handleTriggerClick = React.useCallback(() => {
    if (disabled) return;

    focusManagement.handleTriggerClick();
    setOpen((prev) => !prev);
  }, [focusManagement, disabled]);

  return {
    open,
    inputValue,
    inputRef: focusManagement.inputRef,
    listboxId,
    filteredItems: itemManagement.filteredItems,
    isMaxItemsReached: itemManagement.isMaxItemsReached,
    canCreateNewItem: itemManagement.canCreateNewItem,
    inputTabIndex: focusManagement.inputTabIndex,
    setOpen,
    setInputValue,
    handleSelectItem: itemManagement.handleSelectItem,
    handleDeleteItem: itemManagement.handleDeleteItem,
    handleAddNewItem: itemManagement.handleAddNewItem,
    handleInputClick,
    handleInputFocus: focusManagement.handleInputFocus,
    handleTriggerClick,
    handleKeyDown: keyboardNavigation.handleKeyDown,
  };
}
