import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import FilterActions from './FilterActions';

// プロパティのモック
const defaultProps = {
  onApply: vi.fn(),
  onReset: vi.fn(),
  isLoading: false,
  hasChanges: false,
  activeFilterCount: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('FilterActions', () => {
  describe('基本レンダリング', () => {
    it('リセットボタンと絞り込むボタンが表示される', () => {
      // Arrange - FilterActionsをレンダリング

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} />);

      // Assert - ボタンが表示されることを確認
      expect(screen.getByRole('button', { name: /リセット/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /絞り込む/i })).toBeInTheDocument();
    });

    it('適切なアイコンが表示される', () => {
      // Arrange - FilterActionsをレンダリング

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} />);

      // Assert - アイコンが表示されることを確認（lucide-reactのRotateCcwとFilterアイコン）
      const resetButton = screen.getByRole('button', { name: /リセット/i });
      const applyButton = screen.getByRole('button', { name: /絞り込む/i });
      expect(resetButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
    });
  });

  describe('ボタンの状態管理', () => {
    it('activeFilterCount が 0 の場合、リセットボタンが無効になる', () => {
      // Arrange - activeFilterCountが0の状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} activeFilterCount={0} />);

      // Assert - リセットボタンが無効であることを確認
      expect(screen.getByRole('button', { name: /リセット/i })).toBeDisabled();
    });

    it('activeFilterCount が 0 より大きい場合、リセットボタンが有効になる', () => {
      // Arrange - activeFilterCountが0より大きい状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} activeFilterCount={3} />);

      // Assert - リセットボタンが有効であることを確認
      expect(screen.getByRole('button', { name: /リセット/i })).toBeEnabled();
    });

    it('hasChanges が false の場合、絞り込むボタンが無効になる', () => {
      // Arrange - hasChangesがfalseの状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} hasChanges={false} />);

      // Assert - 絞り込むボタンが無効であることを確認
      expect(screen.getByRole('button', { name: /絞り込む/i })).toBeDisabled();
    });

    it('hasChanges が true の場合、絞り込むボタンが有効になる', () => {
      // Arrange - hasChangesがtrueの状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} hasChanges={true} />);

      // Assert - 絞り込むボタンが有効であることを確認
      expect(screen.getByRole('button', { name: /絞り込む/i })).toBeEnabled();
    });

    it('isLoading が true の場合、両方のボタンが無効になる', () => {
      // Arrange - isLoadingがtrueの状態

      // Act - コンポーネントをレンダリング
      render(
        <FilterActions {...defaultProps} isLoading={true} hasChanges={true} activeFilterCount={3} />
      );

      // Assert - 両方のボタンが無効であることを確認
      expect(screen.getByRole('button', { name: /リセット/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /絞り込む/i })).toBeDisabled();
    });
  });

  describe('クリックイベント処理', () => {
    it('リセットボタンクリック時にonResetが呼び出される', () => {
      // Arrange - FilterActionsをレンダリング
      render(<FilterActions {...defaultProps} activeFilterCount={3} />);

      // Act - リセットボタンをクリック
      fireEvent.click(screen.getByRole('button', { name: /リセット/i }));

      // Assert - onResetが呼び出されることを確認
      expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
    });

    it('絞り込むボタンクリック時にonApplyが呼び出される', () => {
      // Arrange - FilterActionsをレンダリング
      render(<FilterActions {...defaultProps} hasChanges={true} />);

      // Act - 絞り込むボタンをクリック
      fireEvent.click(screen.getByRole('button', { name: /絞り込む/i }));

      // Assert - onApplyが呼び出されることを確認
      expect(defaultProps.onApply).toHaveBeenCalledTimes(1);
    });
  });

  describe('変更状態の表示', () => {
    it('hasChanges が true の場合、変更メッセージが表示される', () => {
      // Arrange - hasChangesがtrueの状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} hasChanges={true} />);

      // Assert - 変更メッセージが表示されることを確認
      expect(
        screen.getByText('変更があります。絞り込むボタンを押して適用してください。')
      ).toBeInTheDocument();
    });

    it('hasChanges が false の場合、変更メッセージが表示されない', () => {
      // Arrange - hasChangesがfalseの状態

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} hasChanges={false} />);

      // Assert - 変更メッセージが表示されないことを確認
      expect(
        screen.queryByText('変更があります。絞り込むボタンを押して適用してください。')
      ).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンに適切なaria-labelが設定される', () => {
      // Arrange - FilterActionsをレンダリング

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...defaultProps} />);

      // Assert - aria-labelが適切に設定されることを確認
      const resetButton = screen.getByRole('button', { name: /リセット/i });
      const applyButton = screen.getByRole('button', { name: /絞り込む/i });

      expect(resetButton).toHaveAttribute('type', 'button');
      expect(applyButton).toHaveAttribute('type', 'button');
    });
  });
});
