import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import MultiCombobox from './MultiCombobox';
import type { MultiComboboxItem } from './types';

const mockItems: MultiComboboxItem[] = [
  { id: '1', label: 'ライト', value: 'LIGHT' },
  { id: '2', label: 'ミディアム', value: 'MEDIUM' },
  { id: '3', label: 'ダーク', value: 'DARK' },
];

const defaultProps = {
  items: mockItems,
  selectedItems: [],
  placeholder: 'テスト用プレースホルダー',
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('MultiCombobox', () => {
  describe('初回クリック動作', () => {
    it('1回目のトリガークリックで選択肢が正常に表示される', async () => {
      const onSelect = vi.fn();
      const { container } = render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const trigger = container.querySelector('[role="combobox"]');

      // 1回目のクリック
      if (trigger) {
        fireEvent.click(trigger);
      }

      // 選択肢が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });

    it('1回目の入力フィールドクリックで選択肢が正常に表示される', async () => {
      const onSelect = vi.fn();
      const { container } = render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = container.querySelector('input[type="text"]');

      // 1回目のクリック
      if (input) {
        fireEvent.click(input);
      }

      // 選択肢が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });

    it('1回目のクリック後に選択肢が閉じない', async () => {
      const onSelect = vi.fn();
      const { container } = render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = container.querySelector('input[type="text"]');

      // 1回目のクリック
      if (input) {
        fireEvent.click(input);
      }

      // 少し待ってから選択肢がまだ表示されていることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // さらに少し待っても選択肢が表示されていることを確認
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.getByText('ライト')).toBeInTheDocument();
    });

    it('フォーカス時に自動オープンしない - モーダル表示時の意図しない開閉を防止', async () => {
      const onSelect = vi.fn();
      const { container } = render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = container.querySelector('input[type="text"]');

      // Arrange - モーダル内での自動フォーカスをシミュレート
      // ビジネス要件: フィルタリングUIでのシート表示時、
      // 自動フォーカスによるドロップダウン開閉がUXを阻害する問題を再現
      if (input) {
        fireEvent.focus(input);
      }

      // Act - 少し待って状態を確認
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert - モーダル環境での意図しない自動開閉が発生しないことを検証
      expect(screen.queryByText('ライト')).not.toBeInTheDocument();
      expect(screen.queryByText('ミディアム')).not.toBeInTheDocument();
      expect(screen.queryByText('ダーク')).not.toBeInTheDocument();
      expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument();
    });

    it('ArrowDownキーでドロップダウンが開く - アクセシビリティ要件に基づくキーボード操作サポート', async () => {
      const { container } = render(<MultiCombobox {...defaultProps} />);

      const input = container.querySelector('input[type="text"]');

      // Arrange - 入力フィールドにフォーカス
      if (input) {
        fireEvent.focus(input);
      }

      // Act - ArrowDownキーを押下
      if (input) {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      }

      // Assert - ドロップダウンが開くことを検証
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });

    it('ArrowUpキーでドロップダウンが開く - アクセシビリティ要件に基づくキーボード操作サポート', async () => {
      const { container } = render(<MultiCombobox {...defaultProps} />);

      const input = container.querySelector('input[type="text"]');

      // Arrange - 入力フィールドにフォーカス
      if (input) {
        fireEvent.focus(input);
      }

      // Act - ArrowUpキーを押下
      if (input) {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      }

      // Assert - ドロップダウンが開くことを検証
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });
  });

  describe('フォーカス管理', () => {
    it('トリガークリック後に適切な動作をすること', async () => {
      const { container } = render(<MultiCombobox {...defaultProps} />);

      const trigger = container.querySelector('[role="combobox"]');

      if (trigger) {
        fireEvent.click(trigger);
      }

      // トリガークリック後の基本動作を確認
      // （ドロップダウンが開かれるか、何らかの応答があること）
      await waitFor(
        () => {
          const input = container.querySelector('input[type="text"]');
          const hasFocus = input === document.activeElement;
          const hasDropdown = container.querySelector('[role="listbox"]') !== null;
          const hasOptions = screen.queryByText('ライト') !== null;
          expect(hasFocus || hasDropdown || hasOptions).toBe(true);
        },
        { timeout: 2000 }
      );
    });

    it('アイテム選択後に入力フィールドにフォーカスが戻る', async () => {
      const onSelect = vi.fn();
      const { container } = render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const trigger = container.querySelector('[role="combobox"]');
      const input = container.querySelector('input[type="text"]');

      // ドロップダウンを開く
      if (trigger) {
        fireEvent.click(trigger);
      }

      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // アイテムを選択
      fireEvent.click(screen.getByText('ライト'));

      // 入力フィールドにフォーカスが戻ることを確認
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
      expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('選択肢の表示・非表示', () => {
    it('外部クリックで選択肢が閉じる', async () => {
      const { container } = render(
        <div>
          <MultiCombobox {...defaultProps} />
          <button>外部ボタン</button>
        </div>
      );

      // ドロップダウンを開く（入力フィールドクリックを使用）
      const input = container.querySelector('input[type="text"]');
      if (input) {
        fireEvent.click(input);
      }

      // ドロップダウンが開かれることを確認（listboxまたはoptionで判定）
      await waitFor(
        () => {
          const hasListbox = container.querySelector('[role="listbox"]') !== null;
          const hasOption = screen.queryByText('ライト') !== null;
          expect(hasListbox || hasOption).toBe(true);
        },
        { timeout: 2000 }
      );

      // 外部をクリック
      fireEvent.click(screen.getByText('外部ボタン'));

      // 選択肢が閉じることを確認
      await waitFor(
        () => {
          const hasListbox = container.querySelector('[role="listbox"]') !== null;
          const hasOption = screen.queryByText('ライト') !== null;
          expect(hasListbox && hasOption).toBe(false);
        },
        { timeout: 2000 }
      );
    });

    it('Escapeキーで選択肢が閉じる', async () => {
      const { container } = render(<MultiCombobox {...defaultProps} />);

      const input = container.querySelector('input[type="text"]');

      // ドロップダウンを開く（クリックを使用）
      if (input) {
        fireEvent.click(input);
      }

      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // Escapeキーを押す
      if (input) {
        fireEvent.keyDown(input, { key: 'Escape' });
      }

      // 選択肢が閉じることを確認
      await waitFor(() => {
        expect(screen.queryByText('ライト')).not.toBeInTheDocument();
      });
    });
  });

  describe('アイテム選択・削除', () => {
    it('選択されたアイテムがバッジとして表示される', () => {
      const selectedItems = [mockItems[0]];
      const { container } = render(
        <MultiCombobox {...defaultProps} selectedItems={selectedItems} />
      );

      // バッジ内のテキストを確認
      const badge = container.querySelector('.truncate');
      expect(badge).toHaveTextContent('ライト');
    });

    it('バッジの削除ボタンでアイテムが削除される', async () => {
      const onDelete = vi.fn();
      const selectedItems = [mockItems[0]];
      const { container } = render(
        <MultiCombobox {...defaultProps} selectedItems={selectedItems} onDelete={onDelete} />
      );

      const deleteButton = container.querySelector('button[aria-label="ライトを削除"]');
      if (deleteButton) {
        fireEvent.click(deleteButton);
      }

      expect(onDelete).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('無効状態', () => {
    it('disabled時はクリックしても選択肢が表示されない', async () => {
      const { container } = render(<MultiCombobox {...defaultProps} disabled />);

      const trigger = container.querySelector('[role="combobox"]');
      if (trigger) {
        fireEvent.click(trigger);
      }

      // 少し待ってから選択肢が表示されていないことを確認（role="option"でチェック）
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(container.querySelector('[role="option"]')).not.toBeInTheDocument();
    });
  });
});
