import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

import ActiveFilters from './ActiveFilters';

vi.mock('@/client/features/recipe-list/hooks/useRecipeQuery', () => ({
  useRecipeQuery: vi.fn(),
}));

const mockUseRecipeQuery = vi.mocked(useRecipeQuery);

describe('ActiveFilters', () => {
  const defaultMockReturn = {
    filters: {},
    searchValue: '',
    pendingSearchValue: '',
    pendingFilters: {},
    setSearchValue: vi.fn(),
    setFilter: vi.fn(),
    removeFilter: vi.fn(),
    applyFilters: vi.fn(),
    apply: vi.fn(),
    reset: vi.fn(),
    clearSearch: vi.fn(),
    isLoading: false,
    hasChanges: false,
    activeFilterCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRecipeQuery.mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    cleanup();
  });

  it('フィルターがない場合は何も表示しない', () => {
    // Arrange
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: {},
    });

    // Act
    const { container } = render(<ActiveFilters />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it('roastLevel フィルターがある場合、タグを表示する', () => {
    // Arrange
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: { roastLevel: ['LIGHT'] },
    });

    // Act
    render(<ActiveFilters />);

    // Assert
    expect(screen.getByText('浅煎り')).toBeInTheDocument();
  });

  it('複数のフィルターがある場合、全てのタグと「すべてクリア」を表示する', () => {
    // Arrange
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: {
        roastLevel: ['LIGHT', 'MEDIUM'],
      },
    });

    // Act
    render(<ActiveFilters />);

    // Assert
    expect(screen.getByText('浅煎り')).toBeInTheDocument();
    expect(screen.getByText('中煎り')).toBeInTheDocument();
    expect(screen.getByText('すべてクリア')).toBeInTheDocument();
  });

  it('タグの×ボタンをクリックすると removeFilter が呼ばれる', () => {
    // Arrange
    const removeFilter = vi.fn();
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: { roastLevel: ['LIGHT'] },
      removeFilter,
    });

    // Act
    render(<ActiveFilters />);
    const removeButton = screen.getByRole('button', { name: /浅煎りを削除/i });
    fireEvent.click(removeButton);

    // Assert
    expect(removeFilter).toHaveBeenCalledWith('roastLevel', 'LIGHT');
  });

  it('search タグの×ボタンをクリックすると clearSearch が呼ばれる', () => {
    // Arrange
    const clearSearch = vi.fn();
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: { search: 'エチオピア' },
      clearSearch,
    });

    // Act
    render(<ActiveFilters />);
    const removeButton = screen.getByRole('button', { name: /検索: "エチオピア"を削除/i });
    fireEvent.click(removeButton);

    // Assert
    expect(clearSearch).toHaveBeenCalled();
  });

  it('「すべてクリア」をクリックすると reset が呼ばれる', () => {
    // Arrange
    const reset = vi.fn();
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: { roastLevel: ['LIGHT'] },
      reset,
    });

    // Act
    render(<ActiveFilters />);
    const clearAllButton = screen.getByRole('button', { name: /すべてクリア/i });
    fireEvent.click(clearAllButton);

    // Assert
    expect(reset).toHaveBeenCalled();
  });

  it('isLoading が true の場合、ボタンが無効化される', () => {
    // Arrange
    mockUseRecipeQuery.mockReturnValue({
      ...defaultMockReturn,
      filters: { roastLevel: ['LIGHT'] },
      isLoading: true,
    });

    // Act
    render(<ActiveFilters />);

    // Assert
    const removeButton = screen.getByRole('button', { name: /浅煎りを削除/i });
    const clearAllButton = screen.getByRole('button', { name: /すべてクリア/i });
    expect(removeButton).toBeDisabled();
    expect(clearAllButton).toBeDisabled();
  });
});
