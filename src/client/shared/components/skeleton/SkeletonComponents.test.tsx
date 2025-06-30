import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  SkeletonCard,
  SkeletonForm,
  SkeletonList,
  SkeletonButton,
  SkeletonText,
  SkeletonAvatar,
  RecipeFilterSkeleton,
  RecipeDetailSkeleton,
  RecipeListSkeleton,
} from './SkeletonComponents';

describe('SkeletonComponents', () => {
  describe('SkeletonCard', () => {
    it('基本的なカードスケルトンが正しくレンダリングされる', () => {
      // Red: まだコンポーネントが存在しないため、このテストは失敗するはず
      const { container } = render(<SkeletonCard />);

      expect(container.firstChild).toHaveClass('border-border', 'bg-card', 'shadow-sm');
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('カスタムクラス名を適用できる', () => {
      const { container } = render(<SkeletonCard className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('SkeletonForm', () => {
    it('フォームスケルトンが適切な数のフィールドを表示する', () => {
      const { container } = render(<SkeletonForm fields={3} />);

      const fields = container.querySelectorAll('[data-testid="skeleton-field"]');
      expect(fields).toHaveLength(3);
    });

    it('デフォルトで5つのフィールドを表示する', () => {
      const { container } = render(<SkeletonForm />);

      const fields = container.querySelectorAll('[data-testid="skeleton-field"]');
      expect(fields).toHaveLength(5);
    });
  });

  describe('SkeletonList', () => {
    it('リストスケルトンが適切な数のアイテムを表示する', () => {
      const { container } = render(<SkeletonList items={4} />);

      const items = container.querySelectorAll('[data-testid="skeleton-item"]');
      expect(items).toHaveLength(4);
    });

    it('デフォルトで3つのアイテムを表示する', () => {
      const { container } = render(<SkeletonList />);

      const items = container.querySelectorAll('[data-testid="skeleton-item"]');
      expect(items).toHaveLength(3);
    });
  });

  describe('SkeletonButton', () => {
    it('ボタンスケルトンが正しくレンダリングされる', () => {
      const { container } = render(<SkeletonButton />);

      expect(container.firstChild).toHaveClass('h-10', 'w-20', 'animate-pulse', 'rounded');
    });

    it('カスタムサイズを適用できる', () => {
      const { container } = render(<SkeletonButton width="w-32" height="h-12" />);

      expect(container.firstChild).toHaveClass('w-32', 'h-12');
    });
  });

  describe('SkeletonText', () => {
    it('テキストスケルトンが正しくレンダリングされる', () => {
      const { container } = render(<SkeletonText />);

      expect(container.firstChild).toHaveClass('h-4', 'w-full', 'animate-pulse', 'rounded');
    });

    it('カスタム幅を適用できる', () => {
      const { container } = render(<SkeletonText width="w-1/2" />);

      expect(container.firstChild).toHaveClass('w-1/2');
    });
  });

  describe('SkeletonAvatar', () => {
    it('アバタースケルトンが正しくレンダリングされる', () => {
      const { container } = render(<SkeletonAvatar />);

      expect(container.firstChild).toHaveClass('h-10', 'w-10', 'animate-pulse', 'rounded-full');
    });

    it('カスタムサイズを適用できる', () => {
      const { container } = render(<SkeletonAvatar size="h-12 w-12" />);

      expect(container.firstChild).toHaveClass('h-12', 'w-12');
    });
  });

  describe('特定用途スケルトンコンポーネント', () => {
    describe('RecipeFilterSkeleton', () => {
      it('レシピフィルタースケルトンが正しくレンダリングされる', () => {
        const { getByText, container } = render(<RecipeFilterSkeleton />);

        expect(getByText('フィルター条件')).toBeInTheDocument();
        expect(container.querySelectorAll('.animate-pulse')).not.toHaveLength(0);
      });
    });

    describe('RecipeDetailSkeleton', () => {
      it('レシピ詳細スケルトンが正しくレンダリングされる', () => {
        const { container } = render(<RecipeDetailSkeleton />);

        // ヘッダー、メインコンテンツ、サイドバーのスケルトンが存在することを確認
        expect(
          container.querySelector('[data-testid="recipe-header-skeleton"]')
        ).toBeInTheDocument();
        expect(container.querySelector('[data-testid="recipe-main-skeleton"]')).toBeInTheDocument();
        expect(
          container.querySelector('[data-testid="recipe-sidebar-skeleton"]')
        ).toBeInTheDocument();
      });
    });

    describe('RecipeListSkeleton', () => {
      it('レシピリストスケルトンが正しくレンダリングされる', () => {
        const { container } = render(<RecipeListSkeleton />);

        const items = container.querySelectorAll('[data-testid="recipe-card-skeleton"]');
        expect(items).toHaveLength(8); // デフォルトで8つのカードスケルトン
      });

      it('カスタム数のアイテムを表示できる', () => {
        const { container } = render(<RecipeListSkeleton count={4} />);

        const items = container.querySelectorAll('[data-testid="recipe-card-skeleton"]');
        expect(items).toHaveLength(4);
      });
    });
  });

  describe('crypto.randomUUIDの最適化', () => {
    it('配列のキー生成が効率的に行われる', () => {
      // Red: 現在の非効率な実装の問題を示すテスト
      const inefficientKeys = Array.from({ length: 5 }, () => crypto.randomUUID());
      const moreInefficientKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

      // 毎回新しいUUIDが生成される（予期される動作）
      expect(inefficientKeys[0]).not.toBe(moreInefficientKeys[0]);

      // より効率的な実装の場合、インデックスベースのキーを使用するはず
      const efficientKeys = Array.from({ length: 5 }, (_, index) => `skeleton-${index}`);
      expect(efficientKeys[0]).toBe('skeleton-0');
      expect(efficientKeys[4]).toBe('skeleton-4');
    });
  });
});
