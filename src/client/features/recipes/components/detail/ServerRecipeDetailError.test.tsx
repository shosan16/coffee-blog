import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import ServerRecipeDetailError from './ServerRecipeDetailError';

describe('ServerRecipeDetailError', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
  });
  describe('基本表示', () => {
    it('エラータイトルとメッセージを正しく表示できること', () => {
      // Arrange - 準備：エラー情報を設定
      const title = 'サーバーエラー';
      const message =
        'レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：エラー情報が正しく表示されることを検証
      expect(screen.getByText('サーバーエラー')).toBeInTheDocument();
      expect(
        screen.getByText(
          'レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。'
        )
      ).toBeInTheDocument();
    });

    it('レシピ一覧への戻るリンクが表示されること', () => {
      // Arrange - 準備：基本的なエラー情報を設定
      const title = 'エラーが発生しました';
      const message = 'エラーメッセージ';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：戻るリンクが表示されることを検証
      const backLink = screen.getByRole('link', { name: /レシピ一覧に戻る/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });
  });

  describe('様々なエラーパターン', () => {
    it('ネットワークエラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：ネットワークエラー情報を設定
      const title = 'ネットワークエラー';
      const message = 'インターネット接続を確認してから再度お試しください。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：ネットワークエラー情報が正しく表示されることを検証
      expect(screen.getByText('ネットワークエラー')).toBeInTheDocument();
      expect(
        screen.getByText('インターネット接続を確認してから再度お試しください。')
      ).toBeInTheDocument();
    });

    it('権限エラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：権限エラー情報を設定
      const title = 'アクセス権限エラー';
      const message = 'このレシピにアクセスする権限がありません。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：権限エラー情報が正しく表示されることを検証
      expect(screen.getByText('アクセス権限エラー')).toBeInTheDocument();
      expect(screen.getByText('このレシピにアクセスする権限がありません。')).toBeInTheDocument();
    });

    it('データベースエラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：データベースエラー情報を設定
      const title = 'データ取得エラー';
      const message =
        'データベースとの接続に問題が発生しています。システム管理者にお問い合わせください。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：データベースエラー情報が正しく表示されることを検証
      expect(screen.getByText('データ取得エラー')).toBeInTheDocument();
      expect(
        screen.getByText(
          'データベースとの接続に問題が発生しています。システム管理者にお問い合わせください。'
        )
      ).toBeInTheDocument();
    });
  });

  describe('長いメッセージ', () => {
    it('長いエラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：長いエラーメッセージを設定
      const title = '詳細エラー情報';
      const message =
        'このエラーは複数の原因により発生している可能性があります。まず、インターネット接続を確認してください。次に、ブラウザのキャッシュをクリアしてから再度アクセスしてみてください。それでも問題が解決しない場合は、しばらく時間を置いてから再度お試しいただくか、システム管理者までお問い合わせください。ご不便をおかけして申し訳ございません。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：長いメッセージが正しく表示されることを検証
      expect(screen.getByText('詳細エラー情報')).toBeInTheDocument();
      expect(screen.getByText(/このエラーは複数の原因により発生している/)).toBeInTheDocument();
      expect(screen.getByText(/ご不便をおかけして申し訳ございません/)).toBeInTheDocument();
    });
  });

  describe('特殊文字・多言語対応', () => {
    it('特殊文字を含むエラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：特殊文字含みエラーメッセージを設定
      const title = 'HTTP 500エラー';
      const message =
        'サーバー内部エラーが発生しました（エラーコード: ERR_500_INTERNAL）。詳細: データベース接続タイムアウト（30秒）';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：特殊文字が正しく表示されることを検証
      expect(screen.getByText('HTTP 500エラー')).toBeInTheDocument();
      expect(
        screen.getByText(
          'サーバー内部エラーが発生しました（エラーコード: ERR_500_INTERNAL）。詳細: データベース接続タイムアウト（30秒）'
        )
      ).toBeInTheDocument();
    });

    it('絵文字を含むエラーメッセージを正しく表示できること', () => {
      // Arrange - 準備：絵文字含みエラーメッセージを設定
      const title = '⚠️ 一時的なエラー';
      const message =
        '🔧 メンテナンス中です。しばらくお待ちください... 📱 モバイルアプリもご利用いただけます。';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：絵文字が正しく表示されることを検証
      expect(screen.getByText('⚠️ 一時的なエラー')).toBeInTheDocument();
      expect(
        screen.getByText(
          '🔧 メンテナンス中です。しばらくお待ちください... 📱 モバイルアプリもご利用いただけます。'
        )
      ).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('エラータイトルが適切な見出しレベルで表示されること', () => {
      // Arrange - 準備：基本的なエラー情報を設定
      const title = 'アクセシビリティテストエラー';
      const message = 'テストメッセージ';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：タイトルが見出しとして表示されることを検証
      expect(
        screen.getByRole('heading', { name: 'アクセシビリティテストエラー' })
      ).toBeInTheDocument();
    });

    it('戻るリンクが適切なリンク属性を持つこと', () => {
      // Arrange - 準備：基本的なエラー情報を設定
      const title = 'リンクテストエラー';
      const message = 'テストメッセージ';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：リンクが適切な属性を持つことを検証
      const backLink = screen.getByRole('link', { name: /レシピ一覧に戻る/i });
      expect(backLink).toHaveAttribute('href', '/');
    });
  });

  describe('レスポンシブ対応', () => {
    it('必要な構造要素がレンダリングされること', () => {
      // Arrange - 準備：基本的なエラー情報を設定
      const title = 'レスポンシブテストエラー';
      const message = 'テストメッセージ';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：必要な要素が存在することを検証
      expect(screen.getByText('レスポンシブテストエラー')).toBeInTheDocument();
      expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('空文字列のタイトルでもエラーなく表示されること', () => {
      // Arrange - 準備：空タイトルのエラー情報を設定
      const title = '';
      const message = 'メッセージのみのエラー';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：メッセージが表示されることを検証
      expect(screen.getByText('メッセージのみのエラー')).toBeInTheDocument();
    });

    it('空文字列のメッセージでもエラーなく表示されること', () => {
      // Arrange - 準備：空メッセージのエラー情報を設定
      const title = 'タイトルのみのエラー';
      const message = '';

      // Act - 実行：エラーコンポーネントをレンダリング
      render(<ServerRecipeDetailError title={title} message={message} />);

      // Assert - 確認：タイトルが表示されることを検証
      expect(screen.getByText('タイトルのみのエラー')).toBeInTheDocument();
    });
  });
});
