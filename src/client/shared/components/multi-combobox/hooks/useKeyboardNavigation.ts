import { useCallback } from 'react';

import type { MultiComboboxItem } from '../types';
import { getKeyboardEventType } from '../utils/multiComboboxUtils';

export type KeyboardNavigationProps = {
  /** コンポーネント無効化フラグ */
  readonly disabled: boolean;
  /** ドロップダウンの開閉状態 */
  readonly open: boolean;
  /** 新しいアイテムが作成可能かどうか */
  readonly canCreateNewItem: boolean;
  /** 検索フィルタリングされたアイテム */
  readonly filteredItems: MultiComboboxItem[];
  /** 入力値 */
  readonly inputValue: string;
  /** 現在選択されているアイテム */
  readonly selectedItems: MultiComboboxItem[];
  /** ドロップダウンの開閉状態を設定する関数 */
  readonly setOpen: (open: boolean) => void;
  /** 新しいアイテム追加ハンドラー */
  readonly handleAddNewItem: () => void;
  /** アイテム選択ハンドラー */
  readonly handleSelectItem: (item: MultiComboboxItem) => void;
  /** アイテム削除ハンドラー */
  readonly handleDeleteItem: (item: MultiComboboxItem) => void;
};

export type KeyboardNavigationReturn = {
  /** キーボードショートカットハンドラー */
  handleKeyDown: (e: React.KeyboardEvent) => void;
};

/**
 * MultiComboboxのキーボードナビゲーションを担当するカスタムフック
 *
 * アクセシビリティ要件に基づくキーボード操作をサポート：
 * - ArrowDown/ArrowUp: ドロップダウンを開く
 * - Enter: 新しいアイテム追加または最初のアイテム選択
 * - Backspace: 最後の選択アイテム削除（入力が空の場合）
 * - Escape: ドロップダウンを閉じる
 */
export function useKeyboardNavigation({
  disabled,
  open,
  canCreateNewItem,
  filteredItems,
  inputValue,
  selectedItems,
  setOpen,
  handleAddNewItem,
  handleSelectItem,
  handleDeleteItem,
}: KeyboardNavigationProps): KeyboardNavigationReturn {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const eventType = getKeyboardEventType(e.key);

      switch (eventType) {
        case 'enter':
          e.preventDefault();
          if (canCreateNewItem) {
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

      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [
      disabled,
      open,
      canCreateNewItem,
      filteredItems,
      inputValue,
      selectedItems,
      setOpen,
      handleAddNewItem,
      handleSelectItem,
      handleDeleteItem,
    ]
  );

  return {
    handleKeyDown,
  };
}
