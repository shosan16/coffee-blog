import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import MultiCombobox, { type MultiComboboxItem } from './MultiCombobox';

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

describe('MultiCombobox', () => {
  describe('初回クリック動作', () => {
    it('1回目のトリガークリックで選択肢が正常に表示される', async () => {
      const onSelect = vi.fn();
      render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const trigger = screen.getByRole('combobox');

      // 1回目のクリック
      fireEvent.click(trigger);

      // 選択肢が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });

    it('1回目の入力フィールドクリックで選択肢が正常に表示される', async () => {
      const onSelect = vi.fn();
      render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');

      // 1回目のクリック
      fireEvent.click(input);

      // 選択肢が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });

    it('1回目のクリック後に選択肢が閉じない', async () => {
      const onSelect = vi.fn();
      render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');

      // 1回目のクリック
      fireEvent.click(input);

      // 少し待ってから選択肢がまだ表示されていることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // さらに少し待っても選択肢が表示されていることを確認
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.getByText('ライト')).toBeInTheDocument();
    });

    it('初回フォーカス時の選択肢表示が適切に動作する', async () => {
      const onSelect = vi.fn();
      render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');

      // 入力フィールドにフォーカス（タブキーなどのキーボード操作をシミュレート）
      fireEvent.focus(input);

      // 選択肢が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
        expect(screen.getByText('ミディアム')).toBeInTheDocument();
        expect(screen.getByText('ダーク')).toBeInTheDocument();
      });
    });
  });

  describe('フォーカス管理', () => {
    it('トリガークリック後に入力フィールドにフォーカスが移る', async () => {
      render(<MultiCombobox {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      const input = screen.getByRole('textbox');

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    it('アイテム選択後に入力フィールドにフォーカスが戻る', async () => {
      const onSelect = vi.fn();
      render(<MultiCombobox {...defaultProps} onSelect={onSelect} />);

      const trigger = screen.getByRole('combobox');
      const input = screen.getByRole('textbox');

      // ドロップダウンを開く
      fireEvent.click(trigger);

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
      render(
        <div>
          <MultiCombobox {...defaultProps} />
          <button>外部ボタン</button>
        </div>
      );

      const trigger = screen.getByRole('combobox');

      // ドロップダウンを開く
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // 外部をクリック
      fireEvent.click(screen.getByText('外部ボタン'));

      // 選択肢が閉じることを確認
      await waitFor(() => {
        expect(screen.queryByText('ライト')).not.toBeInTheDocument();
      });
    });

    it('Escapeキーで選択肢が閉じる', async () => {
      render(<MultiCombobox {...defaultProps} />);

      const input = screen.getByRole('textbox');

      // ドロップダウンを開く
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('ライト')).toBeInTheDocument();
      });

      // Escapeキーを押す
      fireEvent.keyDown(input, { key: 'Escape' });

      // 選択肢が閉じることを確認
      await waitFor(() => {
        expect(screen.queryByText('ライト')).not.toBeInTheDocument();
      });
    });
  });

  describe('アイテム選択・削除', () => {
    it('選択されたアイテムがバッジとして表示される', () => {
      const selectedItems = [mockItems[0]];
      render(<MultiCombobox {...defaultProps} selectedItems={selectedItems} />);

      expect(screen.getByText('ライト')).toBeInTheDocument();
    });

    it('バッジの削除ボタンでアイテムが削除される', async () => {
      const onDelete = vi.fn();
      const selectedItems = [mockItems[0]];
      render(<MultiCombobox {...defaultProps} selectedItems={selectedItems} onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText('ライトを削除');
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('無効状態', () => {
    it('disabled時はクリックしても選択肢が表示されない', () => {
      render(<MultiCombobox {...defaultProps} disabled />);

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      expect(screen.queryByText('ライト')).not.toBeInTheDocument();
    });
  });
});
