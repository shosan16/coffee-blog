import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

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

afterEach(() => {
  cleanup();
});

describe('FilterActions', () => {
  describe('基本レンダリング', () => {
    it('リセットボタンと絞り込むボタンが表示される', () => {
      // Arrange - FilterActionsをレンダリング
      const props = { ...defaultProps, hasChanges: true };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - ボタンが表示されることを確認（動的aria-labelに対応）
      expect(screen.getByLabelText(/フィルターをリセット/)).toBeInTheDocument();
      expect(screen.getByLabelText(/フィルター変更を適用/)).toBeInTheDocument();
    });

    it('適切なアイコンが表示される', () => {
      // Arrange - FilterActionsをレンダリング
      const props = { ...defaultProps, hasChanges: true, activeFilterCount: 1 };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - アイコンが表示されることを確認（lucide-reactのRotateCcwとFilterアイコン）
      const resetButton = screen.getByLabelText(/フィルターをリセット/);
      const applyButton = screen.getByLabelText(/フィルター変更を適用/);
      expect(resetButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
    });
  });

  describe('ボタンの状態管理', () => {
    it('activeFilterCount が 0 の場合、リセットボタンが無効になる', () => {
      // Arrange - activeFilterCountが0の状態
      const props = { ...defaultProps, activeFilterCount: 0 };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - リセットボタンが無効であることを確認
      expect(screen.getByLabelText(/フィルターをリセット/)).toBeDisabled();
    });

    it('activeFilterCount が 0 より大きい場合、リセットボタンが有効になる', () => {
      // Arrange - activeFilterCountが0より大きい状態
      const props = { ...defaultProps, activeFilterCount: 3 };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - リセットボタンが有効であることを確認
      expect(screen.getByLabelText(/フィルターをリセット/)).toBeEnabled();
    });

    it('hasChanges が false の場合、絞り込むボタンが無効になる', () => {
      // Arrange - hasChangesがfalseの状態
      const props = { ...defaultProps, hasChanges: false };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - 絞り込むボタンが無効であることを確認
      expect(screen.getByLabelText(/フィルター変更なし/)).toBeDisabled();
    });

    it('hasChanges が true の場合、絞り込むボタンが有効になる', () => {
      // Arrange - hasChangesがtrueの状態
      const props = { ...defaultProps, hasChanges: true };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - 絞り込むボタンが有効であることを確認
      expect(screen.getByLabelText(/フィルター変更を適用/)).toBeEnabled();
    });

    it('isLoading が true の場合、両方のボタンが無効になる', () => {
      // Arrange - isLoadingがtrueの状態
      const props = {
        ...defaultProps,
        isLoading: true,
        hasChanges: true,
        activeFilterCount: 3,
      };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - 両方のボタンが無効であることを確認
      expect(screen.getByLabelText(/フィルターをリセット/)).toBeDisabled();
      expect(screen.getByLabelText(/フィルター変更を適用/)).toBeDisabled();
    });
  });

  describe('クリックイベント処理', () => {
    it('リセットボタンクリック時にonResetが呼び出される', () => {
      // Arrange - FilterActionsをレンダリング
      const props = { ...defaultProps, activeFilterCount: 3 };
      render(<FilterActions {...props} />);

      // Act - リセットボタンをクリック
      fireEvent.click(screen.getByLabelText(/フィルターをリセット/));

      // Assert - onResetが呼び出されることを確認
      expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
    });

    it('絞り込むボタンクリック時にonApplyが呼び出される', () => {
      // Arrange - FilterActionsをレンダリング
      const props = { ...defaultProps, hasChanges: true };
      render(<FilterActions {...props} />);

      // Act - 絞り込むボタンをクリック
      fireEvent.click(screen.getByLabelText(/フィルター変更を適用/));

      // Assert - onApplyが呼び出されることを確認
      expect(defaultProps.onApply).toHaveBeenCalledTimes(1);
    });
  });

  describe('変更状態の表示', () => {
    it('hasChanges が true の場合、変更メッセージが表示される', () => {
      // Arrange - hasChangesがtrueの状態
      const props = { ...defaultProps, hasChanges: true };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - 変更メッセージが表示されることを確認
      expect(
        screen.getByText('変更があります。絞り込むボタンを押して適用してください。')
      ).toBeInTheDocument();
    });

    it('hasChanges が false の場合、変更メッセージが表示されない', () => {
      // Arrange - hasChangesがfalseの状態
      const props = { ...defaultProps, hasChanges: false };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - 変更メッセージが表示されないことを確認
      expect(
        screen.queryByText('変更があります。絞り込むボタンを押して適用してください。')
      ).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンに適切なaria-labelが設定される', () => {
      // Arrange - FilterActionsをレンダリング
      const props = { ...defaultProps, activeFilterCount: 2, hasChanges: true };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - aria-labelが適切に設定されることを確認
      const resetButton = screen.getByLabelText('フィルターをリセット（現在 2 件設定中）');
      const applyButton = screen.getByLabelText('フィルター変更を適用');

      expect(resetButton).toHaveAttribute('type', 'button');
      expect(applyButton).toHaveAttribute('type', 'button');
    });

    it('hasChanges が false の場合のaria-label設定', () => {
      // Arrange - hasChangesがfalseの状態
      const props = { ...defaultProps, hasChanges: false, activeFilterCount: 1 };

      // Act - コンポーネントをレンダリング
      render(<FilterActions {...props} />);

      // Assert - aria-labelが適切に設定されることを確認
      const resetButton = screen.getByLabelText('フィルターをリセット（現在 1 件設定中）');
      const applyButton = screen.getByLabelText('フィルター変更なし');

      expect(resetButton).toHaveAttribute('type', 'button');
      expect(applyButton).toHaveAttribute('type', 'button');
    });
  });
});
