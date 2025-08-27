import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { vi, beforeEach, afterEach } from 'vitest';

import PageHeader from './PageHeader';

// Next.jsのuseRouterをモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

Object.defineProperty(window, 'history', {
  value: { length: 2 },
  writable: true,
});

describe('PageHeader', () => {
  const mockBack = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      back: mockBack,
      push: mockPush,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('基本表示', () => {
    it('レシピタイトルと戻るボタン、シェアボタンが正しく表示されること', () => {
      // Arrange - ページヘッダーの基本データを準備
      const title = 'エチオピア シングルオリジン';
      const recipeId = '1';

      // Act - 実行：PageHeaderをレンダリング
      render(<PageHeader title={title} recipeId={recipeId} />);

      // Assert - 検証：必要な要素が表示されることを確認
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByLabelText('前のページに戻る')).toBeInTheDocument();
      expect(screen.getByLabelText('レシピをシェア')).toBeInTheDocument();
    });

    it('長いタイトルが適切に表示されること', () => {
      // Arrange - 長いタイトルでテスト
      const longTitle =
        'とても長いレシピタイトルがここに入ります。非常に詳細な説明文が含まれています。';

      // Act - 実行：長いタイトルでPageHeaderをレンダリング
      render(<PageHeader title={longTitle} recipeId="1" />);

      // Assert - 検証：長いタイトルが表示されることを確認
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('戻るボタンの動作', () => {
    it('履歴がある場合、router.back()が呼ばれること', () => {
      // Arrange - 履歴がある状態を設定
      Object.defineProperty(window, 'history', {
        value: { length: 3 },
        writable: true,
      });

      render(<PageHeader title="テストタイトル" recipeId="1" />);

      // Act - 実行：戻るボタンをクリック
      fireEvent.click(screen.getAllByLabelText('前のページに戻る')[0]);

      // Assert - 検証：router.back()が呼ばれることを確認
      expect(mockBack).toHaveBeenCalledOnce();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('履歴がない場合、ルートページに遷移すること', () => {
      // Arrange - 履歴がない状態を設定
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });

      render(<PageHeader title="テストタイトル" recipeId="1" />);

      // Act - 実行：戻るボタンをクリック
      fireEvent.click(screen.getAllByLabelText('前のページに戻る')[0]);

      // Assert - 検証：ルートページへの遷移が呼ばれることを確認
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なaria-label属性が設定されていること', () => {
      render(<PageHeader title="テストタイトル" recipeId="1" />);

      // Assert - 検証：aria-labelが適切に設定されていることを確認
      expect(screen.getByLabelText('前のページに戻る')).toBeInTheDocument();
      expect(screen.getByLabelText('レシピをシェア')).toBeInTheDocument();
    });

    it('ヘッダー要素として適切にマークアップされていること', () => {
      render(<PageHeader title="テストタイトル" recipeId="1" />);

      // Assert - 検証：header要素が存在することを確認
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});
