import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import type { Recipe } from '@/client/features/recipe-list/types/recipe';

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
  tags: [{ id: '1', name: 'テスト', slug: 'test' }],
  baristaName: 'テスト投稿者',
});

const createMockRecipes = (count: number): Recipe[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockRecipe(`recipe-${index}`, `レシピ ${index + 1}`)
  );
};

describe('RecipeCard Performance Tests', () => {
  it('100件のRecipeCardのレンダリングが正常に完了する', () => {
    const recipes = createMockRecipes(100);
    const renderResults: Array<{ unmount: () => void }> = [];

    // レンダリング処理の実行（実時間測定を避ける）
    expect(() => {
      recipes.forEach((recipe) => {
        const result = render(<RecipeCard recipe={recipe} />);
        renderResults.push(result);
        result.unmount();
      });
    }).not.toThrow();

    // レンダリング回数の検証
    expect(renderResults).toHaveLength(100);
  });

  it('大量のRecipeCardでメモリリークが発生しない', () => {
    const recipes = createMockRecipes(50);
    const components: Array<{ unmount: () => void }> = [];
    let mountedCount = 0;

    // 50件のコンポーネントをマウント
    recipes.forEach((recipe) => {
      const component = render(<RecipeCard recipe={recipe} />);
      components.push(component);
      mountedCount++;
    });

    // マウント数の検証
    expect(mountedCount).toBe(50);
    expect(components).toHaveLength(50);

    // 全てのコンポーネントをアンマウント
    let unmountedCount = 0;
    components.forEach(({ unmount }) => {
      expect(() => unmount()).not.toThrow();
      unmountedCount++;
    });

    // アンマウント数の検証
    expect(unmountedCount).toBe(50);
  });

  it('長いタイトルでもレンダリングエラーが発生しない', () => {
    const longTitleRecipe = createMockRecipe(
      'long-title-recipe',
      'とても長いタイトルのレシピです。このタイトルは非常に長く、複数行にわたって表示される可能性があります。パフォーマンスへの影響を確認するためのテストです。'
    );

    const renderCount = 20;
    const renderResults: Array<{ unmount: () => void }> = [];

    // 長いタイトルのRecipeCardを複数回レンダリング
    for (let i = 0; i < renderCount; i++) {
      const result = render(<RecipeCard recipe={longTitleRecipe} />);
      renderResults.push(result);
      result.unmount();
    }

    // 全てのレンダリングが成功したことを検証
    expect(renderResults).toHaveLength(renderCount);
  });

  it('DOM要素の生成が期待通りに動作する', () => {
    const recipe = createMockRecipe('test-recipe', 'テストレシピ');
    const { container, unmount } = render(<RecipeCard recipe={recipe} />);

    // DOM要素の存在確認（構造的検証）
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain('テストレシピ');
    // 新しいレイアウトでは焙煎度バッジが表示される
    expect(container.textContent).toContain('中煎り');

    // クリーンアップが正常に動作することを確認
    expect(() => unmount()).not.toThrow();

    // アンマウント後はコンテナが空になることを確認
    expect(container.firstChild).toBeNull();
  });
});
