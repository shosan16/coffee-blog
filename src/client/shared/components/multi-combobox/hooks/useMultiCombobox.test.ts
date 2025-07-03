import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { MultiComboboxItem } from '../types';

import { useMultiCombobox } from './useMultiCombobox';

const mockItems: MultiComboboxItem[] = [
  { id: '1', label: 'ライト', value: 'LIGHT' },
  { id: '2', label: 'ミディアム', value: 'MEDIUM' },
  { id: '3', label: 'ダーク', value: 'DARK' },
  { id: '4', label: 'エスプレッソ', value: 'ESPRESSO', disabled: true },
];

const defaultProps = {
  items: mockItems,
  selectedItems: [] as MultiComboboxItem[],
};

describe('useMultiCombobox', () => {
  describe('初期状態', () => {
    it('適切な初期値を返すこと', () => {
      // Arrange - 準備：デフォルトプロパティでフックを初期化

      // Act - 実行：フックをレンダリング
      const { result } = renderHook(() => useMultiCombobox(defaultProps));

      // Assert - 確認：初期状態が正しく設定されることを検証
      expect(result.current.open).toBe(false);
      expect(result.current.inputValue).toBe('');
      expect(result.current.filteredItems).toEqual(mockItems);
      expect(result.current.isMaxItemsReached).toBe(false);
      expect(result.current.canCreateNewItem).toBe(false);
    });

    it('creatable=trueの場合、入力値があれば新しいアイテム作成が可能になること', () => {
      // Arrange - 準備：creatable設定を有効にしてフック初期化
      const props = { ...defaultProps, creatable: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：入力値を設定
      act(() => {
        result.current.setInputValue('新しいアイテム');
      });

      // Assert - 確認：新しいアイテム作成が可能になることを検証
      expect(result.current.canCreateNewItem).toBe(true);
    });
  });

  describe('アイテムフィルタリング', () => {
    it('入力値に基づいてアイテムがフィルタリングされること', () => {
      // Arrange - 準備：デフォルトプロパティでフック初期化
      const { result } = renderHook(() => useMultiCombobox(defaultProps));

      // Act - 実行：「ライト」で検索
      act(() => {
        result.current.setInputValue('ライト');
      });

      // Assert - 確認：「ライト」のみがフィルタリング結果に含まれることを検証
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].label).toBe('ライト');
    });

    it('選択済みアイテムがフィルタリング結果から除外されること', () => {
      // Arrange - 準備：1つのアイテムを選択済み状態でフック初期化
      const props = { ...defaultProps, selectedItems: [mockItems[0]] };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：フィルタリング結果を確認

      // Assert - 確認：選択済みアイテムがフィルタリング結果に含まれないことを検証
      expect(result.current.filteredItems).toHaveLength(3);
      expect(result.current.filteredItems.find((item) => item.id === '1')).toBeUndefined();
    });
  });

  describe('最大選択数制限', () => {
    it('最大選択数に達した場合、isMaxItemsReachedがtrueになること', () => {
      // Arrange - 準備：最大2個で2個選択済み状態でフック初期化
      const props = {
        ...defaultProps,
        selectedItems: [mockItems[0], mockItems[1]],
        maxItems: 2,
      };

      // Act - 実行：フックをレンダリング
      const { result } = renderHook(() => useMultiCombobox(props));

      // Assert - 確認：最大選択数に達していることを検証
      expect(result.current.isMaxItemsReached).toBe(true);
    });

    it('最大選択数に達していない場合、isMaxItemsReachedがfalseになること', () => {
      // Arrange - 準備：最大3個で2個選択済み状態でフック初期化
      const props = {
        ...defaultProps,
        selectedItems: [mockItems[0], mockItems[1]],
        maxItems: 3,
      };

      // Act - 実行：フックをレンダリング
      const { result } = renderHook(() => useMultiCombobox(props));

      // Assert - 確認：最大選択数に達していないことを検証
      expect(result.current.isMaxItemsReached).toBe(false);
    });
  });

  describe('アイテム選択', () => {
    it('handleSelectItemが呼ばれた時、onSelectコールバックが実行されること', () => {
      // Arrange - 準備：onSelectコールバックをモック化してフック初期化
      const onSelect = vi.fn();
      const props = { ...defaultProps, onSelect };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：アイテムを選択
      act(() => {
        result.current.handleSelectItem(mockItems[0]);
      });

      // Assert - 確認：コールバックが正しいアイテムで呼ばれることを検証
      expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
    });

    it('無効化されたアイテムを選択しようとした場合、onSelectが呼ばれないこと', () => {
      // Arrange - 準備：onSelectコールバックをモック化してフック初期化
      const onSelect = vi.fn();
      const props = { ...defaultProps, onSelect };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：無効化されたアイテムを選択
      act(() => {
        result.current.handleSelectItem(mockItems[3]); // disabled: true
      });

      // Assert - 確認：コールバックが呼ばれないことを検証
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('選択後に入力値がクリアされること', () => {
      // Arrange - 準備：入力値を設定してからフック初期化
      const onSelect = vi.fn();
      const props = { ...defaultProps, onSelect };
      const { result } = renderHook(() => useMultiCombobox(props));

      act(() => {
        result.current.setInputValue('テスト');
      });

      // Act - 実行：アイテムを選択
      act(() => {
        result.current.handleSelectItem(mockItems[0]);
      });

      // Assert - 確認：入力値がクリアされることを検証
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('アイテム削除', () => {
    it('handleDeleteItemが呼ばれた時、onDeleteコールバックが実行されること', () => {
      // Arrange - 準備：onDeleteコールバックをモック化してフック初期化
      const onDelete = vi.fn();
      const props = { ...defaultProps, onDelete };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：アイテムを削除
      act(() => {
        result.current.handleDeleteItem(mockItems[0]);
      });

      // Assert - 確認：コールバックが正しいアイテムで呼ばれることを検証
      expect(onDelete).toHaveBeenCalledWith(mockItems[0]);
    });

    it('disabled=trueの場合、handleDeleteItemが呼ばれてもonDeleteが実行されないこと', () => {
      // Arrange - 準備：disabled設定でフック初期化
      const onDelete = vi.fn();
      const props = { ...defaultProps, onDelete, disabled: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：アイテムを削除しようとする
      act(() => {
        result.current.handleDeleteItem(mockItems[0]);
      });

      // Assert - 確認：コールバックが呼ばれないことを検証
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe('新しいアイテム追加', () => {
    it('handleAddNewItemが呼ばれた時、onAddコールバックが実行されること', () => {
      // Arrange - 準備：creatable設定とonAddコールバックでフック初期化
      const onAdd = vi.fn();
      const props = { ...defaultProps, onAdd, creatable: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      act(() => {
        result.current.setInputValue('新しいアイテム');
      });

      // Act - 実行：新しいアイテムを追加
      act(() => {
        result.current.handleAddNewItem();
      });

      // Assert - 確認：コールバックが正しい値で呼ばれることを検証
      expect(onAdd).toHaveBeenCalledWith('新しいアイテム');
    });

    it('追加後に入力値がクリアされること', () => {
      // Arrange - 準備：creatable設定でフック初期化
      const onAdd = vi.fn();
      const props = { ...defaultProps, onAdd, creatable: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      act(() => {
        result.current.setInputValue('新しいアイテム');
      });

      // Act - 実行：新しいアイテムを追加
      act(() => {
        result.current.handleAddNewItem();
      });

      // Assert - 確認：入力値がクリアされることを検証
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('ドロップダウン開閉', () => {
    it('handleTriggerClickでドロップダウンの開閉が切り替わること', () => {
      // Arrange - 準備：デフォルトプロパティでフック初期化
      const { result } = renderHook(() => useMultiCombobox(defaultProps));

      // 初期状態では閉じている
      expect(result.current.open).toBe(false);

      // Act - 実行：トリガーをクリック（開く）
      act(() => {
        result.current.handleTriggerClick();
      });

      // Assert - 確認：ドロップダウンが開くことを検証
      expect(result.current.open).toBe(true);

      // Act - 実行：再度トリガーをクリック（閉じる）
      act(() => {
        result.current.handleTriggerClick();
      });

      // Assert - 確認：ドロップダウンが閉じることを検証
      expect(result.current.open).toBe(false);
    });

    it('disabled=trueの場合、handleTriggerClickが動作しないこと', () => {
      // Arrange - 準備：disabled設定でフック初期化
      const props = { ...defaultProps, disabled: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      // Act - 実行：トリガーをクリック
      act(() => {
        result.current.handleTriggerClick();
      });

      // Assert - 確認：ドロップダウンが開かないことを検証
      expect(result.current.open).toBe(false);
    });
  });

  describe('キーボードイベント', () => {
    it('Enterキーで新しいアイテムが追加されること', () => {
      // Arrange - 準備：creatable設定でフック初期化
      const onAdd = vi.fn();
      const props = { ...defaultProps, onAdd, creatable: true };
      const { result } = renderHook(() => useMultiCombobox(props));

      act(() => {
        result.current.setInputValue('新しいアイテム');
      });

      // Act - 実行：Enterキーを押下
      act(() => {
        const mockEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;
        result.current.handleKeyDown(mockEvent);
      });

      // Assert - 確認：新しいアイテムが追加されることを検証
      expect(onAdd).toHaveBeenCalledWith('新しいアイテム');
    });

    it('Enterキーでフィルタされた最初のアイテムが選択されること', () => {
      // Arrange - 準備：onSelectコールバックでフック初期化
      const onSelect = vi.fn();
      const props = { ...defaultProps, onSelect };
      const { result } = renderHook(() => useMultiCombobox(props));

      act(() => {
        result.current.setInputValue('ライト');
      });

      // Act - 実行：Enterキーを押下
      act(() => {
        const mockEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;
        result.current.handleKeyDown(mockEvent);
      });

      // Assert - 確認：最初のフィルタされたアイテムが選択されることを検証
      expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
    });

    it('Backspaceキーで最後の選択アイテムが削除されること', () => {
      // Arrange - 準備：選択済みアイテムがある状態でフック初期化
      const onDelete = vi.fn();
      const props = {
        ...defaultProps,
        selectedItems: [mockItems[0], mockItems[1]],
        onDelete,
      };
      const { result } = renderHook(() => useMultiCombobox(props));

      // 入力値が空の状態
      expect(result.current.inputValue).toBe('');

      // Act - 実行：Backspaceキーを押下
      act(() => {
        const mockEvent = {
          key: 'Backspace',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;
        result.current.handleKeyDown(mockEvent);
      });

      // Assert - 確認：最後の選択アイテムが削除されることを検証
      expect(onDelete).toHaveBeenCalledWith(mockItems[1]);
    });

    it('Escapeキーでドロップダウンが閉じること', () => {
      // Arrange - 準備：ドロップダウンを開いた状態でフック初期化
      const { result } = renderHook(() => useMultiCombobox(defaultProps));

      act(() => {
        result.current.setOpen(true);
      });

      // Act - 実行：Escapeキーを押下
      act(() => {
        const mockEvent = {
          key: 'Escape',
        } as unknown as React.KeyboardEvent;
        result.current.handleKeyDown(mockEvent);
      });

      // Assert - 確認：ドロップダウンが閉じることを検証
      expect(result.current.open).toBe(false);
    });
  });
});
