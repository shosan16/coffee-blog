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

      // getAllByTextを使用して重複要素を許可
      const beanLabels = screen.getAllByText('豆・挽き目');
      expect(beanLabels.length).toBeGreaterThan(0);
      const detailTexts = screen.getAllByText(/MEDIUM.*MEDIUM_FINE.*20g/);
      expect(detailTexts.length).toBeGreaterThan(0);
      const tempTexts = screen.getAllByText('92℃・300g');
      expect(tempTexts.length).toBeGreaterThan(0);
      const equipmentTexts = screen.getAllByText('V60・ペーパーフィルター');
      expect(equipmentTexts.length).toBeGreaterThan(0);
    });
  });

  describe('グリッドレイアウト', () => {
    it('Cardコンポーネントにgridクラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');

      expect(cardElement?.className).toContain('grid');
      expect(cardElement?.className).toContain('h-full');
    });

    it('CardContentにflex-1クラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardContentElement = container.querySelector('[class*="space-y-4"]');

      expect(cardContentElement?.className).toContain('flex-1');
    });
  });

  describe('タイトル表示最適化', () => {
    it('CardTitleにline-clamp-2クラスが適用されている', () => {
      render(<RecipeCard recipe={mockRecipe} />);
      const titleElements = screen.getAllByText('テストレシピ');
      const titleElement = titleElements[0]; // 最初の要素を使用

      expect(titleElement.className).toContain('line-clamp-2');
    });

    it('長いタイトルでも適切に表示される', () => {
      render(<RecipeCard recipe={mockRecipeWithLongTitle} />);

      const titleElement = screen.getByText(mockRecipeWithLongTitle.title);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.className).toContain('line-clamp-2');
    });
  });

  describe('ホバーエフェクト', () => {
    it('groupクラスとgroup-hoverクラスが適用されている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');
      const titleElements = screen.getAllByText('テストレシピ');
      const titleElement = titleElements[0]; // 最初の要素を使用

      expect(cardElement?.className).toContain('group');
      expect(titleElement.className).toContain('group-hover:text-amber-800');
    });
  });

  describe('レスポンシブ対応', () => {
    it('カードが適切なクラスを持っている', () => {
      const { container } = render(<RecipeCard recipe={mockRecipe} />);
      const cardElement = container.querySelector('[class*="group"]');

      expect(cardElement?.className).toContain('w-full');
      expect(cardElement?.className).toContain('h-full');
    });
  });
});
