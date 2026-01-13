import { render, screen, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import RecipeHeader from './RecipeHeader';

describe('RecipeHeader', () => {
  afterEach(() => {
    cleanup();
  });
  describe('基本表示', () => {
    it('タイトル、レシピ概要、タグを正しく表示できること', () => {
      // Arrange - レシピ詳細情報を作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        summary: '華やかな香りと爽やかな酸味が特徴的なコーヒーです。',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [{ id: 'tag-1', name: 'エチオピア', slug: 'ethiopia' }],
        steps: [],
        equipment: [],
      };

      // Act - 実行：RecipeHeaderをレンダリング
      render(<RecipeHeader recipe={recipe} title={recipe.title} />);

      // Assert - 検証：タイトル、概要、タグが表示されることを確認
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'エチオピア シングルオリジン'
      );
      expect(
        screen.getByText('華やかな香りと爽やかな酸味が特徴的なコーヒーです。')
      ).toBeInTheDocument();
      expect(screen.getByText('エチオピア')).toBeInTheDocument();
    });

    it('タグが複数ある場合、すべて正しく表示できること', () => {
      // Arrange - 複数タグ付きレシピを作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        summary: '華やかな香りと爽やかな酸味が特徴的なコーヒーです。',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [
          { id: 'tag-1', name: 'エチオピア', slug: 'ethiopia' },
          { id: 'tag-2', name: 'シングルオリジン', slug: 'single-origin' },
        ],
        steps: [],
        equipment: [],
      };

      // Act
      render(<RecipeHeader recipe={recipe} title={recipe.title} />);

      // Assert
      expect(screen.getByText('エチオピア')).toBeInTheDocument();
      expect(screen.getByText('シングルオリジン')).toBeInTheDocument();
    });

    it('概要がない場合、概要セクションを表示しないこと', () => {
      // Arrange - 概要なしのレシピを作成
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
        steps: [],
        equipment: [],
      };

      // Act
      const { container } = render(<RecipeHeader recipe={recipe} title={recipe.title} />);

      // Assert - pタグが存在しないことを確認（概要が非表示）
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(0);
    });
  });

  describe('タグのスタイリング', () => {
    it('新しいタグスタイル（丸型、ボーダー）が適用されること', () => {
      // Arrange
      const recipe: RecipeDetailInfo = {
        id: '1',
        title: 'エチオピア シングルオリジン',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [{ id: 'tag-1', name: 'エチオピア', slug: 'ethiopia' }],
        steps: [],
        equipment: [],
      };

      // Act
      render(<RecipeHeader recipe={recipe} title="テスト" />);
      const tag = screen.getByText('エチオピア');

      // Assert
      expect(tag).toHaveClass('rounded-full', 'border', 'border-border');
    });
  });
});
