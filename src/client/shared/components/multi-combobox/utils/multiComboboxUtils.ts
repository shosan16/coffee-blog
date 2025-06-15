import type { MultiComboboxItem } from '../types';

/**
 * 選択済みアイテムのIDセットを作成する（パフォーマンス最適化用）
 */
export function createSelectedItemIds(selectedItems: MultiComboboxItem[]): Set<string> {
  return new Set(selectedItems.map((item) => item.id));
}

/**
 * 入力値に基づいてアイテムをフィルタリングする
 * - 選択済みアイテムを除外
 * - 入力値による検索フィルタリング（大文字小文字を区別しない）
 */
export function filterItems(
  items: MultiComboboxItem[],
  selectedItemIds: Set<string>,
  inputValue: string
): MultiComboboxItem[] {
  return items.filter(
    (item) =>
      !selectedItemIds.has(item.id) && item.label.toLowerCase().includes(inputValue.toLowerCase())
  );
}

/**
 * 最大選択数に達しているかチェックする
 */
export function isMaxItemsReached(selectedItems: MultiComboboxItem[], maxItems?: number): boolean {
  return maxItems ? selectedItems.length >= maxItems : false;
}

/**
 * 新しいアイテムが作成可能かチェックする
 * - creatable設定が有効
 * - 入力値が空でない
 * - 最大選択数に未達
 * - 既存アイテムや選択済みアイテムと重複しない
 */
export function canCreateNewItem(
  creatable: boolean,
  inputValue: string,
  items: MultiComboboxItem[],
  selectedItems: MultiComboboxItem[],
  maxItemsReached: boolean
): boolean {
  if (!creatable || !inputValue.trim() || maxItemsReached) {
    return false;
  }

  const trimmedInput = inputValue.toLowerCase();

  // 既存アイテムに同じラベルがないかチェック
  const existsInItems = items.some((item) => item.label.toLowerCase() === trimmedInput);

  // 選択済みアイテムに同じラベルがないかチェック
  const existsInSelected = selectedItems.some((item) => item.label.toLowerCase() === trimmedInput);

  return !existsInItems && !existsInSelected;
}

/**
 * アイテムが選択可能かチェックする
 * - 無効化されていない
 * - コンポーネント全体が無効化されていない
 * - 最大選択数に未達
 */
export function isItemSelectable(
  item: MultiComboboxItem,
  disabled: boolean,
  maxItemsReached: boolean
): boolean {
  return !disabled && !item.disabled && !maxItemsReached;
}

/**
 * キーボードイベントの種類を判定する
 */
export type KeyboardEventType = 'enter' | 'backspace' | 'escape' | 'other';

export function getKeyboardEventType(key: string): KeyboardEventType {
  switch (key) {
    case 'Enter':
      return 'enter';
    case 'Backspace':
      return 'backspace';
    case 'Escape':
      return 'escape';
    default:
      return 'other';
  }
}
