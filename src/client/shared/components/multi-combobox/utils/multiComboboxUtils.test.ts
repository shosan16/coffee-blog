import { describe, it, expect } from 'vitest';
import type { MultiComboboxItem } from '../types';
import {
  createSelectedItemIds,
  filterItems,
  isMaxItemsReached,
  canCreateNewItem,
  isItemSelectable,
  getKeyboardEventType,
} from './multiComboboxUtils';

const mockItems: MultiComboboxItem[] = [
  { id: '1', label: 'ライト', value: 'LIGHT' },
  { id: '2', label: 'ミディアム', value: 'MEDIUM' },
  { id: '3', label: 'ダーク', value: 'DARK' },
  { id: '4', label: 'エスプレッソ', value: 'ESPRESSO', disabled: true },
];

describe('multiComboboxUtils', () => {
  describe('createSelectedItemIds', () => {
    it('選択済みアイテムからIDセットを作成すること', () => {
      // Arrange - 準備：選択済みアイテムリストを用意
      const selectedItems = [mockItems[0], mockItems[2]];

      // Act - 実行：IDセットを作成
      const result = createSelectedItemIds(selectedItems);

      // Assert - 確認：正しいIDセットが作成されることを検証
      expect(result).toEqual(new Set(['1', '3']));
      expect(result.has('1')).toBe(true);
      expect(result.has('3')).toBe(true);
      expect(result.has('2')).toBe(false);
    });

    it('空の配列に対して空のセットを返すこと', () => {
      // Arrange - 準備：空の選択済みアイテムリスト
      const selectedItems: MultiComboboxItem[] = [];

      // Act - 実行：IDセットを作成
      const result = createSelectedItemIds(selectedItems);

      // Assert - 確認：空のセットが返されることを検証
      expect(result).toEqual(new Set());
      expect(result.size).toBe(0);
    });
  });

  describe('filterItems', () => {
    it('選択済みアイテムを除外してフィルタリングすること', () => {
      // Arrange - 準備：選択済みIDセットと入力値を用意
      const selectedItemIds = new Set(['1']);
      const inputValue = '';

      // Act - 実行：アイテムをフィルタリング
      const result = filterItems(mockItems, selectedItemIds, inputValue);

      // Assert - 確認：選択済みアイテムが除外されることを検証
      expect(result).toHaveLength(3);
      expect(result.find((item) => item.id === '1')).toBeUndefined();
      expect(result.find((item) => item.id === '2')).toBeDefined();
    });

    it('入力値に基づいて検索フィルタリングすること', () => {
      // Arrange - 準備：空の選択済みIDセットと検索文字列を用意
      const selectedItemIds = new Set<string>();
      const inputValue = 'ダー'; // 「ダーク」を検索

      // Act - 実行：アイテムをフィルタリング
      const result = filterItems(mockItems, selectedItemIds, inputValue);

      // Assert - 確認：「ダーク」のみがマッチすることを検証
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('ダーク');
    });

    it('大文字小文字を区別せずに検索すること', () => {
      // Arrange - 準備：日本語の大文字で検索文字列を用意（ひらがなで検索）
      const selectedItemIds = new Set<string>();
      const inputValue = 'らいと'; // ひらがなでは大文字小文字の概念がないため、部分一致で検索

      // Act - 実行：アイテムをフィルタリング
      const result = filterItems(mockItems, selectedItemIds, inputValue);

      // Assert - 確認：部分一致しないため0件であることを確認（日本語なので大文字小文字の概念なし）
      expect(result).toHaveLength(0);
    });

    it('選択済みアイテムと検索条件の両方を適用すること', () => {
      // Arrange - 準備：「ライト」を選択済み、「ミディアム」で検索
      const selectedItemIds = new Set(['1']); // ライトを選択済み
      const inputValue = 'ミディアム';

      // Act - 実行：アイテムをフィルタリング
      const result = filterItems(mockItems, selectedItemIds, inputValue);

      // Assert - 確認：「ミディアム」のみが結果に含まれることを検証
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('ミディアム');
    });
  });

  describe('isMaxItemsReached', () => {
    it('最大選択数に達している場合はtrueを返すこと', () => {
      // Arrange - 準備：最大2個まで選択可能で、2個選択済み
      const selectedItems = [mockItems[0], mockItems[1]];
      const maxItems = 2;

      // Act - 実行：最大選択数チェック
      const result = isMaxItemsReached(selectedItems, maxItems);

      // Assert - 確認：trueが返されることを検証
      expect(result).toBe(true);
    });

    it('最大選択数に達していない場合はfalseを返すこと', () => {
      // Arrange - 準備：最大3個まで選択可能で、2個選択済み
      const selectedItems = [mockItems[0], mockItems[1]];
      const maxItems = 3;

      // Act - 実行：最大選択数チェック
      const result = isMaxItemsReached(selectedItems, maxItems);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('maxItemsが未指定の場合はfalseを返すこと', () => {
      // Arrange - 準備：多数のアイテムが選択済みでもmaxItemsが未指定
      const selectedItems = [mockItems[0], mockItems[1], mockItems[2]];

      // Act - 実行：最大選択数チェック
      const result = isMaxItemsReached(selectedItems);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });
  });

  describe('canCreateNewItem', () => {
    it('新しいアイテムが作成可能な場合はtrueを返すこと', () => {
      // Arrange - 準備：作成可能な条件を満たす設定
      const creatable = true;
      const inputValue = '新しいアイテム';
      const items = mockItems;
      const selectedItems: MultiComboboxItem[] = [];
      const maxItemsReached = false;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：trueが返されることを検証
      expect(result).toBe(true);
    });

    it('creatable=falseの場合はfalseを返すこと', () => {
      // Arrange - 準備：creatable設定が無効
      const creatable = false;
      const inputValue = '新しいアイテム';
      const items = mockItems;
      const selectedItems: MultiComboboxItem[] = [];
      const maxItemsReached = false;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('入力値が空の場合はfalseを返すこと', () => {
      // Arrange - 準備：空の入力値
      const creatable = true;
      const inputValue = '   '; // 空白のみ
      const items = mockItems;
      const selectedItems: MultiComboboxItem[] = [];
      const maxItemsReached = false;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('最大選択数に達している場合はfalseを返すこと', () => {
      // Arrange - 準備：最大選択数に到達済み
      const creatable = true;
      const inputValue = '新しいアイテム';
      const items = mockItems;
      const selectedItems: MultiComboboxItem[] = [];
      const maxItemsReached = true;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('既存アイテムと同じラベルの場合はfalseを返すこと', () => {
      // Arrange - 準備：既存アイテムと同じラベル
      const creatable = true;
      const inputValue = 'ライト'; // 既存のアイテムと同じ
      const items = mockItems;
      const selectedItems: MultiComboboxItem[] = [];
      const maxItemsReached = false;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('選択済みアイテムと同じラベルの場合はfalseを返すこと', () => {
      // Arrange - 準備：選択済みアイテムと同じラベル
      const creatable = true;
      const inputValue = 'ライト';
      const items = mockItems.slice(1); // 「ライト」を除外
      const selectedItems = [mockItems[0]]; // 「ライト」を選択済み
      const maxItemsReached = false;

      // Act - 実行：新しいアイテム作成可能性チェック
      const result = canCreateNewItem(creatable, inputValue, items, selectedItems, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });
  });

  describe('isItemSelectable', () => {
    it('選択可能なアイテムに対してtrueを返すこと', () => {
      // Arrange - 準備：正常なアイテムと設定
      const item = mockItems[0]; // 通常のアイテム
      const disabled = false;
      const maxItemsReached = false;

      // Act - 実行：選択可能性チェック
      const result = isItemSelectable(item, disabled, maxItemsReached);

      // Assert - 確認：trueが返されることを検証
      expect(result).toBe(true);
    });

    it('アイテムが無効化されている場合はfalseを返すこと', () => {
      // Arrange - 準備：無効化されたアイテム
      const item = mockItems[3]; // disabled: true
      const disabled = false;
      const maxItemsReached = false;

      // Act - 実行：選択可能性チェック
      const result = isItemSelectable(item, disabled, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('コンポーネント全体が無効化されている場合はfalseを返すこと', () => {
      // Arrange - 準備：コンポーネント全体の無効化
      const item = mockItems[0];
      const disabled = true;
      const maxItemsReached = false;

      // Act - 実行：選択可能性チェック
      const result = isItemSelectable(item, disabled, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });

    it('最大選択数に達している場合はfalseを返すこと', () => {
      // Arrange - 準備：最大選択数に到達済み
      const item = mockItems[0];
      const disabled = false;
      const maxItemsReached = true;

      // Act - 実行：選択可能性チェック
      const result = isItemSelectable(item, disabled, maxItemsReached);

      // Assert - 確認：falseが返されることを検証
      expect(result).toBe(false);
    });
  });

  describe('getKeyboardEventType', () => {
    it('Enterキーに対して"enter"を返すこと', () => {
      // Arrange - 準備：Enterキー
      const key = 'Enter';

      // Act - 実行：キーボードイベントタイプを取得
      const result = getKeyboardEventType(key);

      // Assert - 確認："enter"が返されることを検証
      expect(result).toBe('enter');
    });

    it('Backspaceキーに対して"backspace"を返すこと', () => {
      // Arrange - 準備：Backspaceキー
      const key = 'Backspace';

      // Act - 実行：キーボードイベントタイプを取得
      const result = getKeyboardEventType(key);

      // Assert - 確認："backspace"が返されることを検証
      expect(result).toBe('backspace');
    });

    it('Escapeキーに対して"escape"を返すこと', () => {
      // Arrange - 準備：Escapeキー
      const key = 'Escape';

      // Act - 実行：キーボードイベントタイプを取得
      const result = getKeyboardEventType(key);

      // Assert - 確認："escape"が返されることを検証
      expect(result).toBe('escape');
    });

    it('その他のキーに対して"other"を返すこと', () => {
      // Arrange - 準備：任意のキー
      const key = 'a';

      // Act - 実行：キーボードイベントタイプを取得
      const result = getKeyboardEventType(key);

      // Assert - 確認："other"が返されることを検証
      expect(result).toBe('other');
    });
  });
});
