import { render, screen, cleanup } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useRecipes } from '@/client/features/recipes/hooks/useRecipes';
import { RecipeListResponse } from '@/client/features/recipes/types/api';

import RecipeList from './RecipeList';

// モック設定
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/client/features/recipes/hooks/useRecipes', () => ({
  useRecipes: vi.fn(),
}));

vi.mock('@/client/features/recipes/components/RecipeCard', () => ({
  default: ({ recipe }: { recipe: { id: string; title: string } }) => (
    <div data-testid={`recipe-card-${recipe.id}`}>
      <h3>{recipe.title}</h3>
    </div>
  ),
}));

vi.mock('@/components/Pagination', () => ({
  default: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

// crypto.randomUUID のモック（テスト環境用）
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => `test-uuid-${Math.random().toString(36).substr(2, 9)}`),
  },
});

describe('RecipeList', () => {
  const mockSearchParams = new URLSearchParams();
  const mockInitialData: RecipeListResponse = {
    recipes: [
      {
        id: '1',
        title: 'Test Recipe 1',
        summary: 'Test description 1',
        equipment: ['V60', 'Scale'],
        roastLevel: 'MEDIUM',
        grindSize: 'MEDIUM',
        beanWeight: 20,
        waterTemp: 90,
        waterAmount: 300,
      },
      {
        id: '2',
        title: 'Test Recipe 2',
        summary: 'Test description 2',
        equipment: ['Chemex', 'Grinder'],
        roastLevel: 'LIGHT',
        grindSize: 'FINE',
        beanWeight: 25,
        waterTemp: 85,
        waterAmount: 400,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 10,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    cleanup();
  });

  it('レシピが正常に表示される', () => {
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: mockInitialData.recipes,
      pagination: mockInitialData.pagination,
      isLoading: false,
    });

    render(<RecipeList initialData={mockInitialData} />);

    expect(screen.getByTestId('recipe-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
  });

  it('ローディング状態でスケルトンが表示される', () => {
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: [],
      pagination: null,
      isLoading: true,
    });

    render(<RecipeList initialData={{ ...mockInitialData, recipes: [] }} />);

    // ローディング状態のスケルトンが表示されることを確認
    const loadingSkeletons = document.querySelectorAll('.animate-pulse');
    expect(loadingSkeletons.length).toBeGreaterThan(0);
  });

  it('レシピが0件の場合に適切なメッセージが表示される', () => {
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: [],
      pagination: null,
      isLoading: false,
    });

    render(<RecipeList initialData={{ ...mockInitialData, recipes: [] }} />);

    expect(screen.getByText('レシピが見つかりませんでした')).toBeInTheDocument();
    expect(screen.getByText('検索条件を変更してお試しください')).toBeInTheDocument();
  });

  it('ページネーションが複数ページある場合に表示される', () => {
    const paginationData = {
      currentPage: 1,
      totalPages: 3,
      totalItems: 30,
      itemsPerPage: 10,
    };

    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: mockInitialData.recipes,
      pagination: paginationData,
      isLoading: false,
    });

    render(<RecipeList initialData={{ ...mockInitialData, pagination: paginationData }} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('ページネーションが1ページのみの場合は表示されない', () => {
    const singlePageData = {
      ...mockInitialData,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 10,
      },
    };

    // 単一ページのデータを返すように設定
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      recipes: singlePageData.recipes,
      pagination: singlePageData.pagination,
      isLoading: false,
    });

    render(<RecipeList initialData={singlePageData} />);

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });
});
