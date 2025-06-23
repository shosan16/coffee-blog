import * as React from 'react';
import type { MultiComboboxItem, MultiComboboxProps, UseMultiComboboxReturn } from '../types';
import {
  createSelectedItemIds,
  filterItems,
  isMaxItemsReached,
  canCreateNewItem,
  isItemSelectable,
  getKeyboardEventType,
} from '../utils/multiComboboxUtils';

/**
 * MultiComboboxコンポーネントの状態管理とビジネスロジックを提供するカスタムフック
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
>): UseMultiComboboxReturn {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxId = React.useId();

  // 選択済みアイテムのIDセットを作成（パフォーマンス最適化）
  const selectedItemIds = React.useMemo(
    () => createSelectedItemIds(selectedItems),
    [selectedItems]
  );

  // 検索フィルタリングされたアイテム
  const filteredItems = React.useMemo(() => {
    return filterItems(items, selectedItemIds, inputValue);
  }, [items, selectedItemIds, inputValue]);

  // 最大選択数に達しているかチェック
  const isMaxItemsReachedValue = React.useMemo(() => {
    return isMaxItemsReached(selectedItems, maxItems);
  }, [selectedItems, maxItems]);

  // 新しいアイテムが作成可能かチェック
  const canCreateNewItemValue = React.useMemo(() => {
    return canCreateNewItem(creatable, inputValue, items, selectedItems, isMaxItemsReachedValue);
  }, [creatable, inputValue, items, selectedItems, isMaxItemsReachedValue]);

  /**
   * アイテム選択ハンドラー
   * 選択されたアイテムをコールバックで通知し、入力値をクリアします
   */
  const handleSelectItem = React.useCallback(
    (item: MultiComboboxItem) => {
      if (!isItemSelectable(item, disabled, isMaxItemsReachedValue)) {
        return;
      }

      onSelect?.(item);
      setInputValue('');
      inputRef.current?.focus();
    },
    [disabled, isMaxItemsReachedValue, onSelect]
  );

  /**
   * アイテム削除ハンドラー
   * 選択されたアイテムを削除し、入力フィールドにフォーカスを戻します
   */
  const handleDeleteItem = React.useCallback(
    (item: MultiComboboxItem) => {
      if (disabled) return;

      onDelete?.(item);
      inputRef.current?.focus();
    },
    [disabled, onDelete]
  );

  /**
   * 新しいアイテム追加ハンドラー
   * 入力値から新しいアイテムを作成し、選択状態に追加します
   */
  const handleAddNewItem = React.useCallback(() => {
    if (!canCreateNewItemValue || !inputValue.trim()) return;

    onAdd?.(inputValue.trim());
    setInputValue('');
    inputRef.current?.focus();
  }, [canCreateNewItemValue, inputValue, onAdd]);

  /**
   * 入力フィールド専用クリックハンドラー
   * イベント伝播を停止し、直接ドロップダウンを開く
   */
  const handleInputClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 親要素のクリックイベントを停止
      if (!disabled) {
        setOpen(true);
      }
    },
    [disabled]
  );

  /**
   * フォーカスハンドラー（簡素化）
   * キーボードフォーカス時のみドロップダウンを開く
   */
  const handleInputFocus = React.useCallback(() => {
    if (disabled) return;
    // クリック以外（キーボードフォーカスなど）の場合のみ処理
    if (!open) {
      setOpen(true);
    }
  }, [disabled, open]);

  /**
   * トリガークリックハンドラー（調整済み）
   * ChevronDownや外側クリック時の動作
   */
  const handleTriggerClick = React.useCallback(() => {
    if (disabled) return;

    inputRef.current?.focus();
    setOpen((prev) => !prev);
  }, [disabled]);

  /**
   * キーボードショートカットハンドラー
   * Enter: 新しいアイテム追加またはフィルタされた最初のアイテム選択
   * Backspace: 最後の選択アイテム削除（入力が空の場合）
   * Escape: ドロップダウンを閉じる
   */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const eventType = getKeyboardEventType(e.key);

      switch (eventType) {
        case 'enter':
          e.preventDefault();
          if (canCreateNewItemValue) {
            handleAddNewItem();
          } else if (filteredItems.length > 0 && !filteredItems[0].disabled) {
            handleSelectItem(filteredItems[0]);
          }
          break;
        case 'backspace':
          if (inputValue === '' && selectedItems.length > 0) {
            e.preventDefault();
            handleDeleteItem(selectedItems[selectedItems.length - 1]);
          }
          break;
        case 'escape':
          setOpen(false);
          break;
      }
    },
    [
      disabled,
      canCreateNewItemValue,
      filteredItems,
      inputValue,
      selectedItems,
      handleAddNewItem,
      handleSelectItem,
      handleDeleteItem,
    ]
  );

  return {
    open,
    inputValue,
    inputRef,
    listboxId,
    filteredItems,
    isMaxItemsReached: isMaxItemsReachedValue,
    canCreateNewItem: canCreateNewItemValue,
    setOpen,
    setInputValue,
    handleSelectItem,
    handleDeleteItem,
    handleAddNewItem,
    handleInputClick,
    handleInputFocus,
    handleTriggerClick,
    handleKeyDown,
  };
}
