import { useCallback, useMemo } from 'react';

import type { MultiComboboxItem, MultiComboboxProps } from '../types';
import {
  canCreateNewItem,
  createSelectedItemIds,
  filterItems,
  isItemSelectable,
  isMaxItemsReached,
} from '../utils/multiComboboxUtils';

export type ItemManagementProps = {
  /** 選択可能なアイテムリスト */
  readonly items: MultiComboboxItem[];
  /** 現在選択されているアイテム */
  readonly selectedItems: MultiComboboxItem[];
  /** 入力値 */
  readonly inputValue: string;
  /** 動的アイテム作成の許可フラグ */
  readonly creatable: boolean;
  /** コンポーネント無効化フラグ */
  readonly disabled: boolean;
  /** 最大選択可能数制限 */
  readonly maxItems?: number;
  /** アイテム選択時のコールバック */
  readonly onSelect?: MultiComboboxProps['onSelect'];
  /** アイテム削除時のコールバック */
  readonly onDelete?: MultiComboboxProps['onDelete'];
  /** 新規アイテム追加時のコールバック */
  readonly onAdd?: MultiComboboxProps['onAdd'];
  /** 入力値を設定する関数 */
  readonly setInputValue: (value: string) => void;
  /** 入力フィールドへの参照 */
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
};

export type ItemManagementReturn = {
  /** 検索フィルタリングされたアイテム */
  filteredItems: MultiComboboxItem[];
  /** 最大選択数に達しているかどうか */
  isMaxItemsReached: boolean;
  /** 新しいアイテムが作成可能かどうか */
  canCreateNewItem: boolean;
  /** アイテム選択ハンドラー */
  handleSelectItem: (item: MultiComboboxItem) => void;
  /** アイテム削除ハンドラー */
  handleDeleteItem: (item: MultiComboboxItem) => void;
  /** 新しいアイテム追加ハンドラー */
  handleAddNewItem: () => void;
};

/**
 * MultiComboboxのアイテム管理を担当するカスタムフック
 *
 * 選択、削除、追加の各操作を統合管理し、
 * 契約による設計の3原則（事前条件・事後条件・不変条件）を保証。
 */
export function useItemManagement({
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
  inputRef,
}: ItemManagementProps): ItemManagementReturn {
  const selectedItemIds = useMemo(() => createSelectedItemIds(selectedItems), [selectedItems]);

  const filteredItems = useMemo(() => {
    return filterItems(items, selectedItemIds, inputValue);
  }, [items, selectedItemIds, inputValue]);

  const isMaxItemsReachedValue = useMemo(() => {
    return isMaxItemsReached(selectedItems, maxItems);
  }, [selectedItems, maxItems]);

  const canCreateNewItemValue = useMemo(() => {
    return canCreateNewItem(creatable, inputValue, items, selectedItems, isMaxItemsReachedValue);
  }, [creatable, inputValue, items, selectedItems, isMaxItemsReachedValue]);

  const handleSelectItem = useCallback(
    (item: MultiComboboxItem) => {
      if (!isItemSelectable(item, disabled, isMaxItemsReachedValue)) {
        return;
      }

      onSelect?.(item);
      setInputValue('');
      inputRef.current?.focus();
    },
    [disabled, isMaxItemsReachedValue, onSelect, setInputValue, inputRef]
  );

  const handleDeleteItem = useCallback(
    (item: MultiComboboxItem) => {
      if (disabled) return;

      onDelete?.(item);
      inputRef.current?.focus();
    },
    [disabled, onDelete, inputRef]
  );

  const handleAddNewItem = useCallback(() => {
    if (!canCreateNewItemValue || !inputValue.trim()) return;

    onAdd?.(inputValue.trim());
    setInputValue('');
    inputRef.current?.focus();
  }, [canCreateNewItemValue, inputValue, onAdd, setInputValue, inputRef]);

  return {
    filteredItems,
    isMaxItemsReached: isMaxItemsReachedValue,
    canCreateNewItem: canCreateNewItemValue,
    handleSelectItem,
    handleDeleteItem,
    handleAddNewItem,
  };
}
