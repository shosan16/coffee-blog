import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import FilterTriggerButton from '@/client/features/recipe-list/components/search/FilterTriggerButton';

describe('FilterTriggerButton', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('基本的な表示', () => {
    it('フィルターボタンが表示されること', () => {
      // Arrange - フィルタートリガーボタンをレンダリング
      render(<FilterTriggerButton activeFilterCount={0} onClick={vi.fn()} isOpen={false} />);

      // Assert - ボタンが表示されることを確認
      expect(screen.getByRole('button', { name: 'フィルター条件を開く' })).toBeInTheDocument();
      expect(screen.getByText('絞り込み')).toBeInTheDocument();
    });

    it('aria-expanded属性が正しく設定されること', () => {
      // Arrange - isOpen=trueでレンダリング
      render(<FilterTriggerButton activeFilterCount={0} onClick={vi.fn()} isOpen={true} />);

      // Assert - aria-expanded がtrueに設定されることを確認
      expect(screen.getByRole('button', { name: 'フィルター条件を開く' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });
  });

  describe('アクティブフィルター数の表示', () => {
    it('アクティブフィルター数が0の場合、バッジが表示されないこと', () => {
      // Arrange - activeFilterCount=0でレンダリング
      render(<FilterTriggerButton activeFilterCount={0} onClick={vi.fn()} isOpen={false} />);

      // Assert - フィルター数のバッジが表示されないことを確認
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('アクティブフィルター数が1以上の場合、バッジが表示されること', () => {
      // Arrange - activeFilterCount=3でレンダリング
      render(<FilterTriggerButton activeFilterCount={3} onClick={vi.fn()} isOpen={false} />);

      // Assert - フィルター数のバッジが表示されることを確認
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('大きなフィルター数も正しく表示されること', () => {
      // Arrange - activeFilterCount=99でレンダリング
      render(<FilterTriggerButton activeFilterCount={99} onClick={vi.fn()} isOpen={false} />);

      // Assert - 大きな数字も正しく表示されることを確認
      expect(screen.getByText('99')).toBeInTheDocument();
    });
  });

  describe('クリック操作', () => {
    it('ボタンクリック時にonClickハンドラーが呼ばれること', async () => {
      // Arrange - onClickモック関数を準備
      const mockOnClick = vi.fn();
      const user = userEvent.setup();

      render(<FilterTriggerButton activeFilterCount={0} onClick={mockOnClick} isOpen={false} />);

      // Act - ボタンをクリック
      await user.click(screen.getByRole('button', { name: 'フィルター条件を開く' }));

      // Assert - onClickが1回呼ばれることを確認
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('複数回クリックされた場合、onClickが複数回呼ばれること', async () => {
      // Arrange - onClickモック関数を準備
      const mockOnClick = vi.fn();
      const user = userEvent.setup();

      render(<FilterTriggerButton activeFilterCount={2} onClick={mockOnClick} isOpen={false} />);

      // Act - ボタンを3回クリック
      const button = screen.getByRole('button', { name: 'フィルター条件を開く' });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Assert - onClickが3回呼ばれることを確認
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なaria-label属性が設定されること', () => {
      // Arrange - フィルタートリガーボタンをレンダリング
      render(<FilterTriggerButton activeFilterCount={5} onClick={vi.fn()} isOpen={false} />);

      // Assert - aria-labelが適切に設定されることを確認
      expect(screen.getByRole('button', { name: 'フィルター条件を開く' })).toHaveAttribute(
        'aria-label',
        'フィルター条件を開く'
      );
    });

    it('キーボード操作でボタンがアクセス可能であること', async () => {
      // Arrange - onClickモック関数を準備
      const mockOnClick = vi.fn();
      const user = userEvent.setup();

      render(<FilterTriggerButton activeFilterCount={1} onClick={mockOnClick} isOpen={false} />);

      // Act - Tabキーでフォーカス後、Enterキーで実行
      await user.tab();
      expect(screen.getByRole('button', { name: 'フィルター条件を開く' })).toHaveFocus();

      await user.keyboard('{Enter}');

      // Assert - onClickが呼ばれることを確認
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
