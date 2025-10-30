import { render } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HeroSearchSection from '@/client/features/recipe-list/components/search/HeroSearchSection';

vi.mock('@/client/features/recipe-list/hooks/useRecipeQuery', () => ({
  useRecipeQuery: vi.fn().mockReturnValue({
    pendingFilters: {},
    setFilter: vi.fn(),
    apply: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    hasChanges: false,
    activeFilterCount: 0,
  }),
}));

vi.mock('./SearchInput', () => ({
  default: vi.fn(() => <input data-testid="search-input" />),
}));

vi.mock('./FilterTriggerButton', () => ({
  default: vi.fn(() => <button data-testid="filter-trigger-button">フィルター</button>),
}));

vi.mock('./FilterPanel', () => ({
  default: vi.fn(() => <div data-testid="filter-panel">フィルターパネル</div>),
}));

vi.mock('@/client/shared/shadcn/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="search-action-button" {...props}>
      {children}
    </button>
  )),
}));

describe('HeroSearchSection', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Next.js モック
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(new URLSearchParams());
  });

  describe('レンダリング', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
      // Arrange
      // （準備不要）

      // Act
      render(<HeroSearchSection />);

      // Assert - タイトルと統合検索バーの構成要素の存在を確認
      expect(document.querySelector('h1')).toHaveTextContent('Coffee Recipe Collection');
      expect(document.querySelector('[data-testid="search-input"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="filter-trigger-button"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="search-action-button"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="filter-panel"]')).toBeInTheDocument();
    });

    it('initialResultCountプロパティが設定されても問題なく動作する', () => {
      // Arrange
      // resultCountは削除されたがpropsの互換性を確認

      // Act
      render(<HeroSearchSection initialResultCount={50} />);

      // Assert
      expect(document.querySelector('h1')).toHaveTextContent('Coffee Recipe Collection');
    });
  });

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用される', () => {
      // Arrange
      // （準備不要）

      // Act
      const { container } = render(<HeroSearchSection initialResultCount={100} />);

      // Assert
      const heroSection = container.firstChild as HTMLElement;
      expect(heroSection).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'relative',
        'overflow-visible',
        'py-20'
      );
    });
  });
});
