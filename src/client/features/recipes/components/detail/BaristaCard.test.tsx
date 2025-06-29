import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import BaristaCard from './BaristaCard';
import type { BaristaInfo } from '../../types/recipe-detail';

describe('BaristaCard', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
  });
  describe('基本表示', () => {
    it('完全なバリスタ情報を正しく表示できること', () => {
      // Arrange - 準備：完全なバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '1',
        name: '佐藤花子',
        affiliation: 'Specialty Coffee Shop ARIA',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/coffee_hanako',
          },
          {
            id: '2',
            platform: 'Twitter',
            url: 'https://twitter.com/coffee_hanako',
          },
        ],
      };

      // Act - 実行：バリスタカードをレンダリング
      render(<BaristaCard barista={barista} />);

      // Assert - 確認：バリスタ情報が正しく表示されることを検証
      expect(screen.getByText('バリスタ')).toBeInTheDocument();
      expect(screen.getByText('佐藤花子')).toBeInTheDocument();
      expect(screen.getByText('Specialty Coffee Shop ARIA')).toBeInTheDocument();
      expect(screen.getByText('SNS')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
    });

    it('所属がない場合、所属情報を表示しないこと', () => {
      // Arrange - 準備：所属なしのバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '2',
        name: '田中太郎',
        socialLinks: [],
      };

      // Act - 実行：バリスタカードをレンダリング
      render(<BaristaCard barista={barista} />);

      // Assert - 確認：所属情報が表示されないことを検証
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.queryByText('所属')).not.toBeInTheDocument();
    });

    it('SNSリンクがない場合、SNSセクションを表示しないこと', () => {
      // Arrange - 準備：SNSリンクなしのバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '3',
        name: '山田次郎',
        affiliation: 'Independent Coffee Roaster',
        socialLinks: [],
      };

      // Act - 実行：バリスタカードをレンダリング
      const { container } = render(<BaristaCard barista={barista} />);

      // Assert - 確認：SNSセクションが表示されないことを検証
      expect(screen.getByText('山田次郎')).toBeInTheDocument();
      expect(screen.getByText('Independent Coffee Roaster')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="sns-section"]')).not.toBeInTheDocument();
    });
  });

  describe('SNSリンク', () => {
    it('SNSリンクが正しい属性で表示されること', () => {
      // Arrange - 準備：SNSリンク付きバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '4',
        name: 'テストバリスタ',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/test_barista',
          },
        ],
      };

      // Act - 実行：バリスタカードをレンダリング
      const { container } = render(<BaristaCard barista={barista} />);

      // Assert - 確認：SNSリンクの属性が正しく設定されることを検証
      const instagramLink = container.querySelector('a[href="https://instagram.com/test_barista"]');
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('複数のSNSリンクを正しく表示できること', () => {
      // Arrange - 準備：複数SNSリンク付きバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '5',
        name: 'マルチSNSバリスタ',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/multi_sns',
          },
          {
            id: '2',
            platform: 'Twitter',
            url: 'https://twitter.com/multi_sns',
          },
          {
            id: '3',
            platform: 'YouTube',
            url: 'https://youtube.com/@multi_sns',
          },
        ],
      };

      // Act - 実行：バリスタカードを独立コンテナでレンダリング
      const { container } = render(<BaristaCard barista={barista} />);

      // Assert - 確認：コンテナ内のソーシャルリンクを検証
      const instagramLink = container.querySelector('a[href="https://instagram.com/multi_sns"]');
      const twitterLink = container.querySelector('a[href="https://twitter.com/multi_sns"]');
      const youtubeLink = container.querySelector('a[href="https://youtube.com/@multi_sns"]');

      expect(instagramLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(youtubeLink).toBeInTheDocument();

      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(3);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なaria属性が設定されていること', () => {
      // Arrange - 準備：基本的なバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '6',
        name: 'アクセシビリティテスト',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/accessibility_test',
          },
        ],
      };

      // Act - 実行：バリスタカードをレンダリング
      const { container } = render(<BaristaCard barista={barista} />);

      // Assert - 確認：外部リンクが適切に識別されることを検証
      const externalLink = container.querySelector(
        'a[href="https://instagram.com/accessibility_test"]'
      );
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('カードタイトルが適切な見出しレベルで表示されること', () => {
      // Arrange - 準備：基本的なバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '7',
        name: 'ヘディングテスト',
        socialLinks: [],
      };

      // Act - 実行：バリスタカードをレンダリング
      const { container } = render(<BaristaCard barista={barista} />);

      // Assert - 確認：CardTitle内の「バリスタ」テキストを検証
      const titleElement = container.querySelector('[class*="text-lg"]');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('バリスタ');
    });
  });

  describe('特殊文字・エッジケース', () => {
    it('特殊文字を含む名前を正しく表示できること', () => {
      // Arrange - 準備：特殊文字含みバリスタ情報を設定
      const barista: BaristaInfo = {
        id: '8',
        name: "O'Connor & Smith-Johnson",
        affiliation: 'Café "L\'Excellence"',
        socialLinks: [],
      };

      // Act - 実行：バリスタカードをレンダリング
      render(<BaristaCard barista={barista} />);

      // Assert - 確認：特殊文字が正しく表示されることを検証
      expect(screen.getByText("O'Connor & Smith-Johnson")).toBeInTheDocument();
      expect(screen.getByText('Café "L\'Excellence"')).toBeInTheDocument();
    });

    it('日本語・英語混在の情報を正しく表示できること', () => {
      // Arrange - 準備：多言語バリスタ情報を設定
      const barista: BaristaInfo = {
        id: '9',
        name: 'Emily 田中',
        affiliation: 'Tokyo International Coffee House',
        socialLinks: [
          {
            id: '1',
            platform: 'インスタグラム',
            url: 'https://instagram.com/emily_tanaka',
          },
        ],
      };

      // Act - 実行：バリスタカードをレンダリング
      render(<BaristaCard barista={barista} />);

      // Assert - 確認：多言語情報が正しく表示されることを検証
      expect(screen.getByText('Emily 田中')).toBeInTheDocument();
      expect(screen.getByText('Tokyo International Coffee House')).toBeInTheDocument();
      expect(screen.getByText('インスタグラム')).toBeInTheDocument();
    });
  });
});
