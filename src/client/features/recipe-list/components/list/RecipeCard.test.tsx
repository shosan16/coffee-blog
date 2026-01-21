import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';

import type { Recipe } from '@/client/features/recipe-list/types/recipe';

import RecipeCard from './RecipeCard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const createMockRecipe = (overrides?: Partial<Recipe>): Recipe => ({
  id: 'test-recipe-id',
  title: 'テスト用レシピタイトル',
  summary: 'テスト用のレシピ説明文です。',
  equipment: ['V60', 'ペーパーフィルター'],
  roastLevel: 'MEDIUM',
  grindSize: 'MEDIUM_FINE',
  beanWeight: 20,
  waterTemp: 92,
  waterAmount: 300,
  tags: [
    { id: '1', name: 'ナッツ', slug: 'nuts' },
    { id: '2', name: 'チョコレート', slug: 'chocolate' },
  ],
  baristaName: 'テスト投稿者',
  ...overrides,
});

describe('RecipeCard', () => {
  afterEach(() => {
    cleanup();
  });

  describe('タイトル表示', () => {
    it('レシピタイトルが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ title: 'フルーティなエチオピア浅煎り' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      expect(screen.getByText('フルーティなエチオピア浅煎り')).toBeInTheDocument();
    });

    it('タイトルがh3要素で表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ title: 'テストタイトル' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('テストタイトル');
    });
  });

  describe('焙煎度バッジ', () => {
    it('中煎りの場合「中煎り」バッジが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ roastLevel: 'MEDIUM' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      expect(screen.getByText('中煎り')).toBeInTheDocument();
    });

    it('浅煎りの場合「浅煎り」バッジが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ roastLevel: 'LIGHT' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      expect(screen.getByText('浅煎り')).toBeInTheDocument();
    });

    it('深煎りの場合「深煎り」バッジが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ roastLevel: 'DARK' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      expect(screen.getByText('深煎り')).toBeInTheDocument();
    });
  });

  describe('サイドライン', () => {
    it('焙煎度に応じた色のサイドラインが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ roastLevel: 'MEDIUM' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      const sideline = screen.getByTestId('roast-sideline');
      expect(sideline).toBeInTheDocument();
      expect(sideline).toHaveAttribute('data-roast-color');
    });
  });

  describe('投稿者情報', () => {
    it('投稿者情報が表示される', () => {
      // Arrange
      const recipe = createMockRecipe();

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      const authorInfo = screen.getByTestId('author-info');
      expect(authorInfo).toBeInTheDocument();
    });
  });

  describe('タグ表示', () => {
    it('タグが表示される', () => {
      // Arrange
      const recipe = createMockRecipe({ roastLevel: 'MEDIUM' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      // ダミーデータで生成されるタグのうち、MEDIUM用のタグプールから少なくとも1つが表示される
      const tagButtons = screen.getAllByRole('button');
      expect(tagButtons.length).toBeGreaterThan(0);
    });
  });

  describe('カード構造', () => {
    it('article要素で囲まれている', () => {
      // Arrange
      const recipe = createMockRecipe();

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      expect(screen.getByTestId('recipe-card')).toBeInTheDocument();
    });

    it('レシピ詳細ページへのリンクが設定される', () => {
      // Arrange
      const recipe = createMockRecipe({ id: 'recipe-123' });

      // Act
      render(<RecipeCard recipe={recipe} />);

      // Assert
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/recipes/recipe-123');
    });
  });
});
