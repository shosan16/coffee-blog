import { render } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRecipeSearch } from '../../hooks/useRecipeSearch';

import HeroSearchSection from './HeroSearchSection';

vi.mock('../../hooks/useRecipeSearch', () => ({
  useRecipeSearch: vi.fn(),
}));

vi.mock('./IntegratedSearchBar', () => ({
  default: vi.fn(() => <div data-testid="integrated-search-bar">IntegratedSearchBar</div>),
}));

describe('HeroSearchSection', () => {
  const mockPush = vi.fn();
  const mockSetResultCount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Next.js モック
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(new URLSearchParams());

    // useRecipeSearch モック
    (useRecipeSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      resultCount: undefined,
      setResultCount: mockSetResultCount,
    });
  });

  describe('レンダリング', () => {
    it('初期結果数が設定されていない場合、setResultCountが呼ばれない', () => {
      // Arrange & Act
      render(<HeroSearchSection />);

      // Assert
      expect(mockSetResultCount).not.toHaveBeenCalled();
    });

    it('初期結果数が設定されている場合、setResultCountが呼ばれる', () => {
      // Arrange & Act
      render(<HeroSearchSection initialResultCount={50} />);

      // Assert
      expect(mockSetResultCount).toHaveBeenCalledWith(50);
    });

    it('既に結果数が設定されている場合、setResultCountが呼ばれない', () => {
      // Arrange
      (useRecipeSearch as ReturnType<typeof vi.fn>).mockReturnValue({
        resultCount: 100,
        setResultCount: mockSetResultCount,
      });

      // Act
      render(<HeroSearchSection initialResultCount={50} />);

      // Assert
      expect(mockSetResultCount).not.toHaveBeenCalled();
    });
  });

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用される', () => {
      // Arrange & Act
      const { container } = render(<HeroSearchSection initialResultCount={100} />);

      // Assert
      const heroSection = container.firstChild as HTMLElement;
      expect(heroSection).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'relative',
        'overflow-hidden',
        'py-20'
      );
    });
  });
});
