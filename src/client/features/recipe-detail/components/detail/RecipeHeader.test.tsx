import { render } from '@testing-library/react';

import type { RecipeDetailInfo } from '../../types/recipe-detail';

import RecipeHeader from './RecipeHeader';

describe('RecipeHeader', () => {
  describe('基本表示', () => {
    it('レシピタイトルとバリスタ情報を統合して正しく表示できること', () => {
      // Arrange - レシピ詳細情報（バリスタ付き）を作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        summary: '華やかな香りと爽やかな酸味が特徴的なコーヒーです。',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
        steps: [],
        equipment: [],
        barista: {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'カフェ・ドゥ・ラ・ペ',
          socialLinks: [
            {
              id: 'twitter-1',
              platform: 'Twitter',
              url: 'https://twitter.com/tanaka_barista',
            },
          ],
        },
      };

      // Act - 実行：RecipeHeaderをレンダリング
      render(<RecipeHeader recipe={recipe} />);

      // Assert - 検証：バリスタ情報が表示されることを確認
      expect(document.querySelector('[data-testid="barista-section"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="barista-name"]')).toHaveTextContent('田中太郎');
      expect(document.querySelector('[data-testid="barista-affiliation"]')).toHaveTextContent(
        'カフェ・ドゥ・ラ・ペ'
      );
      expect(document.querySelector('[data-testid="sns-section"]')).toBeInTheDocument();
    });

    it('バリスタ情報がない場合、バリスタセクションを表示しないこと', () => {
      // Arrange - レシピ詳細情報（バリスタなし）を作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        summary: '華やかな香りと爽やかな酸味が特徴的なコーヒーです。',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
        steps: [],
        equipment: [],
        barista: undefined,
      };

      // Act - 実行：RecipeHeaderをレンダリング
      const { container } = render(<RecipeHeader recipe={recipe} />);

      // Assert - 検証：バリスタセクションが表示されないことを確認
      expect(container.querySelector('[data-testid="barista-section"]')).not.toBeInTheDocument();
    });

    it('バリスタのSNSリンクが複数ある場合、すべて正しく表示できること', () => {
      // Arrange - レシピ詳細情報（複数SNSリンク付きバリスタ）を作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        summary: '華やかな香りと爽やかな酸味が特徴的なコーヒーです。',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
        steps: [],
        equipment: [],
        barista: {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'カフェ・ドゥ・ラ・ペ',
          socialLinks: [
            {
              id: 'twitter-1',
              platform: 'Twitter',
              url: 'https://twitter.com/tanaka_barista',
            },
            {
              id: 'instagram-1',
              platform: 'Instagram',
              url: 'https://instagram.com/tanaka_barista',
            },
          ],
        },
      };

      // Act - 実行：RecipeHeaderをレンダリング
      const { container } = render(<RecipeHeader recipe={recipe} />);

      // Assert - 検証：すべてのSNSリンクが正しく表示されることを確認
      const snsLinks = container.querySelectorAll('[data-testid="sns-section"] a');
      expect(snsLinks).toHaveLength(2);

      expect(snsLinks[0]).toHaveAttribute('href', 'https://twitter.com/tanaka_barista');
      expect(snsLinks[0]).toHaveAttribute('target', '_blank');
      expect(snsLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
      expect(snsLinks[0]).toHaveTextContent('Twitter');

      expect(snsLinks[1]).toHaveAttribute('href', 'https://instagram.com/tanaka_barista');
      expect(snsLinks[1]).toHaveTextContent('Instagram');
    });
  });
});
