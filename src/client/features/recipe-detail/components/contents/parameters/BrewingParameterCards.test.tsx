import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';

import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import BrewingParameterCards from './BrewingParameterCards';

describe('BrewingParameterCards', () => {
  afterEach(() => {
    cleanup();
  });

  // テスト用のモックデータ
  const mockRecipeFull: RecipeDetailInfo = {
    id: '1',
    title: 'Test Recipe',
    roastLevel: 'LIGHT_MEDIUM',
    grindSize: 'MEDIUM',
    beanWeight: 18,
    waterTemp: 92,
    waterAmount: 270,
    viewCount: 100,
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    steps: [],
    equipment: [],
    tags: [],
  };

  const mockRecipePartial: RecipeDetailInfo = {
    id: '2',
    title: 'Test Recipe Partial',
    roastLevel: 'MEDIUM',
    grindSize: undefined,
    beanWeight: undefined,
    waterTemp: undefined,
    waterAmount: undefined,
    viewCount: 100,
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    steps: [],
    equipment: [],
    tags: [],
  };

  const mockRecipeLargeNumbers: RecipeDetailInfo = {
    id: '3',
    title: 'Test Recipe Large',
    roastLevel: 'DARK',
    grindSize: 'COARSE',
    beanWeight: 1000,
    waterTemp: 100,
    waterAmount: 1500,
    viewCount: 100,
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    steps: [],
    equipment: [],
    tags: [],
  };

  describe('基本表示', () => {
    it('単一カードとして表示されること', () => {
      // Arrange - すべてのパラメータを持つレシピを準備
      const recipe = mockRecipeFull;

      // Act - BrewingParameterCardsをレンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 単一のカードが表示される（抽出条件タイトルが存在する）
      const title = screen.getByText('抽出条件');
      expect(title).toBeInTheDocument();
    });

    it('Slidersアイコンと「抽出条件」タイトルが表示されること', () => {
      // Arrange - レシピデータを準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - タイトルが表示されることを確認
      expect(screen.getByText('抽出条件')).toBeInTheDocument();
    });
  });

  describe('メインパラメータセクション', () => {
    it('豆の量、湯量、湯温が3カラムグリッドで表示されること', () => {
      // Arrange - すべてのパラメータを持つレシピを準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 3つのパラメータが表示される
      expect(screen.getByText('豆の量')).toBeInTheDocument();
      expect(screen.getByText('湯量')).toBeInTheDocument();
      expect(screen.getByText('湯温')).toBeInTheDocument();
    });

    it('数値が大きなフォントサイズで表示されること', () => {
      // Arrange - レシピデータを準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 数値を含む要素がfont-serifとtext-3xl/md:text-4xlクラスを持つ
      const beanWeightValue = screen.getByText('18').closest('div');
      expect(beanWeightValue).toHaveClass('font-serif');
      expect(beanWeightValue).toHaveClass('text-3xl');
      expect(beanWeightValue).toHaveClass('md:text-4xl');
    });

    it('単位がインラインで小さく表示されること', () => {
      // Arrange - レシピデータを準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 単位がspanとして小さいフォントで表示される
      const weightValue = screen.getByText('18').parentElement;
      const unitSpan = weightValue?.querySelector('span');
      expect(unitSpan).toHaveTextContent('g');
      expect(unitSpan).toHaveClass('text-sm');
      expect(unitSpan).toHaveClass('md:text-base');
    });

    it('ラベルが下部に小さく表示されること', () => {
      // Arrange - レシピデータを準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - ラベルがtext-xsクラスで表示される
      const beanLabel = screen.getByText('豆の量');
      expect(beanLabel).toHaveClass('text-xs');
      expect(beanLabel).toHaveClass('text-muted-foreground');
    });
  });

  describe('詳細セクション', () => {
    it('焙煎度と挽き目がborder-top上部に水平配置されること', () => {
      // Arrange - roastLevelとgrindSizeを持つレシピ
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 詳細セクションがborder-tクラスを持つ
      const roastLevelLabel = screen.getByText('焙煎度');
      const detailsSection = roastLevelLabel.closest('div')?.parentElement;
      expect(detailsSection).toHaveClass('border-t');
      expect(detailsSection).toHaveClass('border-border');
    });

    it('焙煎度の日本語ラベルが正しく表示されること', () => {
      // Arrange - LIGHT_MEDIUM の roastLevel
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - "中浅煎り"と表示される
      expect(screen.getByText('中浅煎り')).toBeInTheDocument();
    });

    it('挽き目の日本語ラベルが正しく表示されること', () => {
      // Arrange - MEDIUM の grindSize
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - "中挽き"と表示される
      expect(screen.getByText('中挽き')).toBeInTheDocument();
    });
  });

  describe('条件付きレンダリング', () => {
    it('beanWeightがundefinedの場合、空のプレースホルダーで3カラムを維持すること', () => {
      // Arrange - beanWeightがundefinedのレシピ
      const recipe = mockRecipePartial;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 豆の量ラベルが表示されない
      expect(screen.queryByText('豆の量')).not.toBeInTheDocument();
    });

    it('waterTempがundefinedの場合、空のプレースホルダーで3カラムを維持すること', () => {
      // Arrange - waterTempがundefinedのレシピ
      const recipe = mockRecipePartial;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 湯温ラベルが表示されない
      expect(screen.queryByText('湯温')).not.toBeInTheDocument();
    });

    it('waterAmountがundefinedの場合、空のプレースホルダーで3カラムを維持すること', () => {
      // Arrange - waterAmountがundefinedのレシピ
      const recipe = mockRecipePartial;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 湯量ラベルが表示されない
      expect(screen.queryByText('湯量')).not.toBeInTheDocument();
    });

    it('grindSizeがundefinedの場合、詳細セクションに表示されないこと', () => {
      // Arrange - grindSizeがundefinedのレシピ
      const recipe = mockRecipePartial;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - 挽き目の項目が表示されない
      expect(screen.queryByText('挽き目')).not.toBeInTheDocument();
    });

    it('すべてのメインパラメータがundefinedの場合でもエラーにならないこと', () => {
      // Arrange - すべてのオプショナルパラメータがundefinedのレシピ
      const recipe = mockRecipePartial;

      // Act - レンダリング
      const renderResult = () => render(<BrewingParameterCards recipe={recipe} />);

      // Assert - エラーなく表示される
      expect(renderResult).not.toThrow();
      expect(screen.getByText('焙煎度')).toBeInTheDocument();
    });
  });

  describe('数値フォーマット', () => {
    it('useNumberFormatフックを使用して重量をフォーマットすること', () => {
      // Arrange - beanWeight=18のレシピ
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - formatWeight関数が呼ばれ、正しく表示される
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('270')).toBeInTheDocument();
    });

    it('useNumberFormatフックを使用して温度をフォーマットすること', () => {
      // Arrange - waterTemp=92のレシピ
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - formatTemperature関数が呼ばれ、正しく表示される
      expect(screen.getByText('92')).toBeInTheDocument();
    });

    it('カンマ区切りが必要な大きな数値でも正しくフォーマットすること', () => {
      // Arrange - beanWeight=1000のレシピ
      const recipe = mockRecipeLargeNumbers;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - "1,000"として表示される
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('1,500')).toBeInTheDocument();
    });
  });

  describe('レスポンシブデザイン', () => {
    it('モバイルで適切なパディングとフォントサイズが適用されること', () => {
      // Arrange - レシピデータ準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - モバイルクラスを検証
      const beanWeightLabel = screen.getByText('豆の量');
      const beanWeightItem = beanWeightLabel.parentElement;
      expect(beanWeightItem).toHaveClass('p-3.5');
      expect(beanWeightItem).toHaveClass('md:p-5');
    });

    it('デスクトップで適切なパディングとフォントサイズが適用されること', () => {
      // Arrange - レシピデータ準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - デスクトップクラスを検証
      const valueElement = screen.getByText('18').closest('div');
      expect(valueElement).toHaveClass('text-3xl');
      expect(valueElement).toHaveClass('md:text-4xl');
    });
  });

  describe('アクセシビリティ', () => {
    it('意味のある構造でマークアップされていること', () => {
      // Arrange - レシピデータ準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - セマンティックなHTML構造を検証（タイトルが表示される）
      expect(screen.getByText('抽出条件')).toBeInTheDocument();
    });

    it('数値と単位が適切にグループ化されていること', () => {
      // Arrange - レシピデータ準備
      const recipe = mockRecipeFull;

      // Act - レンダリング
      render(<BrewingParameterCards recipe={recipe} />);

      // Assert - spanで単位が数値内に含まれている
      const weightValue = screen.getByText('18').parentElement;
      const unitSpan = weightValue?.querySelector('span');
      expect(unitSpan).toHaveTextContent('g');
    });
  });
});
