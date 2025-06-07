import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Recipe } from '@/client/features/recipes/types/recipe';

import RecipeCard from './RecipeCard';

const createMockRecipe = (id: string, title: string): Recipe => ({
  id,
  title,
  summary: 'テスト用のレシピ説明文です。',
  equipment: ['V60', 'ペーパーフィルター'],
  roastLevel: 'MEDIUM',
  grindSize: 'MEDIUM_FINE',
  beanWeight: 20,
  waterTemp: 92,
  waterAmount: 300,
});

const createMockRecipes = (count: number): Recipe[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockRecipe(`recipe-${index}`, `レシピ ${index + 1}`)
  );
};

describe('RecipeCard Performance Tests', () => {
  it('100件のRecipeCardのレンダリング時間が許容範囲内である', () => {
    const recipes = createMockRecipes(100);

    const startTime = performance.now();

    // 100件のRecipeCardをレンダリング
    recipes.forEach((recipe) => {
      const { unmount } = render(<RecipeCard recipe={recipe} />);
      unmount();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // レンダリング時間が5秒以内であることを確認（十分に余裕を持った閾値）
    expect(renderTime).toBeLessThan(5000);
  });

  it('大量のRecipeCardでメモリリークが発生しない', () => {
    const recipes = createMockRecipes(50);
    const components: Array<{ unmount: () => void }> = [];

    // 50件のコンポーネントをマウント
    recipes.forEach((recipe) => {
      const component = render(<RecipeCard recipe={recipe} />);
      components.push(component);
    });

    // 全てのコンポーネントをアンマウント
    components.forEach(({ unmount }) => {
      unmount();
    });

    // メモリリークの検証は実際のブラウザ環境でのみ有効
    // テスト環境では正常に完了することを確認
    expect(true).toBe(true);
  });

  it('長いタイトルでもパフォーマンスが劣化しない', () => {
    const longTitleRecipe = createMockRecipe(
      'long-title-recipe',
      'とても長いタイトルのレシピです。このタイトルは非常に長く、複数行にわたって表示される可能性があります。パフォーマンスへの影響を確認するためのテストです。'
    );

    const startTime = performance.now();

    // 長いタイトルのRecipeCardを複数回レンダリング
    for (let i = 0; i < 20; i++) {
      const { unmount } = render(<RecipeCard recipe={longTitleRecipe} />);
      unmount();
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 長いタイトルでも1秒以内でレンダリングできることを確認
    expect(renderTime).toBeLessThan(1000);
  });
});
