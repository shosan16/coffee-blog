import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi, beforeEach, afterEach } from 'vitest';

import PageHeader from '@/client/features/recipe-detail/components/PageHeader';

// Next.jsのuseRouterをモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// sonner toastをモック
vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

Object.defineProperty(window, 'history', {
  value: { length: 2 },
  writable: true,
});

describe('PageHeader', () => {
  const mockBack = vi.fn();
  const mockPush = vi.fn();
  const mockToast = vi.mocked(toast);

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

  describe('シェアボタンの動作', () => {
    let mockWriteText: ReturnType<typeof vi.fn>;
    let mockClipboard: { writeText: typeof mockWriteText };

    beforeEach(() => {
      // Arrange - クリップボードAPIのモックを設定
      mockWriteText = vi.fn().mockResolvedValue(undefined);
      mockClipboard = { writeText: mockWriteText };

      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
      });

      // window.locationのモック設定
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost:3000',
          href: 'http://localhost:3000/current-page',
        },
        writable: true,
      });
    });

    it('シェアボタンクリック時にクリップボードAPIが呼ばれ、成功トーストが表示されること', async () => {
      // Arrange - ページヘッダーをレンダリング
      render(<PageHeader title="テストレシピ" recipeId="123" />);

      // Act - 実行：シェアボタンをクリック
      fireEvent.click(screen.getByLabelText('レシピをシェア'));

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert - 検証：クリップボードAPIが正しいURLで呼ばれることを確認
      expect(mockWriteText).toHaveBeenCalledWith('http://localhost:3000/recipes/123');
      expect(mockWriteText).toHaveBeenCalledOnce();

      // Assert - 検証：成功トーストが表示されることを確認
      expect(mockToast).toHaveBeenCalledWith('URLをコピーしました', {
        description: 'レシピのリンクをクリップボードにコピーしました',
      });
    });

    it('recipeIdがない場合、現在のURLをコピーし、成功トーストが表示されること', async () => {
      render(<PageHeader title="テストレシピ" />);

      // Act - 実行：シェアボタンをクリック
      fireEvent.click(screen.getByLabelText('レシピをシェア'));

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert - 検証：現在のURLがコピーされることを確認
      expect(mockWriteText).toHaveBeenCalledWith('http://localhost:3000/current-page');

      // Assert - 検証：成功トーストが表示されることを確認
      expect(mockToast).toHaveBeenCalledWith('URLをコピーしました', {
        description: 'レシピのリンクをクリップボードにコピーしました',
      });
    });

    it('クリップボードAPIが利用できない場合、警告トーストが表示されること', () => {
      // Arrange - クリップボードAPIが利用できない状態を設定
      Object.defineProperty(navigator, 'clipboard', {
        value: null,
        writable: true,
      });

      render(<PageHeader title="テストレシピ" recipeId="123" />);

      // Act - 実行：シェアボタンをクリック
      fireEvent.click(screen.getByLabelText('レシピをシェア'));

      // Assert - 検証：警告トーストが表示されることを確認
      expect(mockToast).toHaveBeenCalledWith('クリップボードが利用できません', {
        description: 'お使いのブラウザではクリップボード機能をサポートしていません。',
      });
    });

    it('クリップボードAPIでエラーが発生した場合、エラートーストが表示されること', async () => {
      // Arrange - クリップボードAPIがエラーを発生させる状態を設定
      mockWriteText.mockRejectedValue(new Error('Clipboard access denied'));

      render(<PageHeader title="テストレシピ" recipeId="123" />);

      // Act - 実行：シェアボタンをクリック
      fireEvent.click(screen.getByLabelText('レシピをシェア'));

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert - 検証：クリップボードAPIが呼ばれることを確認
      expect(mockWriteText).toHaveBeenCalledWith('http://localhost:3000/recipes/123');

      // Assert - 検証：エラートーストが表示されることを確認
      expect(mockToast).toHaveBeenCalledWith('コピーに失敗しました', {
        description: 'URLのコピーに失敗しました。もう一度お試しください。',
      });
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
