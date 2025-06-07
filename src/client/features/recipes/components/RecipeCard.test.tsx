import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Recipe } from '@/client/features/recipes/types/recipe';

import RecipeCard from './RecipeCard';

const mockRecipe: Recipe = {
  id: '1',
  title: 'テストレシピ',
  summary: 'テスト用のレシピ説明文です。',
  equipment: ['V60', 'ペーパーフィルター'],
  roastLevel: 'MEDIUM',
  grindSize: 'MEDIUM_FINE',
  beanWeight: 20,
  waterTemp: 92,
  waterAmount: 300,
};

const mockRecipeWithLongTitle: Recipe = {
  ...mockRecipe,
  title:
    'とても長いタイトルのレシピです。このタイトルは2行を超える可能性があり、レイアウトの統一性をテストするために使用されます。',
};

describe('RecipeCard', () => {
  describe('基本表示', () => {
    it('レシピの基本情報が正しく表示される', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText('テストレシピ')).toBeInTheDocument();
      expect(screen.getByText('テスト用のレシピ説明文です。')).toBeInTheDocument();
    });

    it('レシピ詳細情報が正しく表示される', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText('MEDIUM・MEDIUM_FINE・20g')).toBeInTheDocument();
      expect(screen.getByText('92℃・300g')).toBeInTheDocument();
      expect(screen.getByText('V60・ペーパーフィルター')).toBeInTheDocument();
    });
  });

  describe('グリッドレイアウト', () => {
    it('Cardコンポーネントにgridクラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');

      expect(cardElement).toHaveClass('grid');
      expect(cardElement).toHaveClass('grid-rows-[auto_1fr_auto]');
      expect(cardElement).toHaveClass('h-full');
    });

    it('CardContentにflex-1クラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardContentElement = container.querySelector('[class*="space-y-4"]');

      expect(cardContentElement).toHaveClass('flex-1');
    });
  });

  describe('タイトル表示最適化', () => {
    it('CardTitleにline-clamp-2クラスが適用されている', () => {
      render(<RecipeCard recipe={mockRecipe} />);
      const titleElement = screen.getByText('テストレシピ');

      expect(titleElement).toHaveClass('line-clamp-2');
    });

    it('長いタイトルでも適切に表示される', () => {
      render(<RecipeCard recipe={mockRecipeWithLongTitle} />);

      const titleElement = screen.getByText(mockRecipeWithLongTitle.title);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveClass('line-clamp-2');
    });
  });

  describe('ホバーエフェクト', () => {
    it('groupクラスとgroup-hoverクラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');
      const titleElement = screen.getByText('テストレシピ');

      expect(cardElement).toHaveClass('group');
      expect(titleElement).toHaveClass('group-hover:text-amber-800');
    });
  });

  describe('レスポンシブ対応', () => {
    it('カードが適切なクラスを持っている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');

      expect(cardElement).toHaveClass('w-full');
      expect(cardElement).toHaveClass('h-full');
    });
  });
});
