import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import SearchResultsHeader from '@/client/features/recipe-list/components/layout/SearchResultsHeader';
import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

// useRecipeQuery をモック
const mockSetFilter = vi.fn();
const mockApply = vi.fn();
const mockApplyFilters = vi.fn();
const mockSetSearchValue = vi.fn();

const createMockUseRecipeQuery = (overrides = {}) => ({
  searchValue: '',
  filters: {},
  setFilter: mockSetFilter,
  setSearchValue: mockSetSearchValue,
  applyFilters: mockApplyFilters,
  apply: mockApply,
  pendingSearchValue: '',
  pendingFilters: {},
  removeFilter: vi.fn(),
  reset: vi.fn(),
  clearSearch: vi.fn(),
  isLoading: false,
  hasChanges: false,
  activeFilterCount: 0,
  ...overrides,
});

vi.mock('@/client/features/recipe-list/hooks/useRecipeQuery', () => ({
  useRecipeQuery: vi.fn(() => createMockUseRecipeQuery()),
}));

// Radix UI Select の jsdom 互換性問題を回避
beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe('SearchResultsHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRecipeQuery).mockReturnValue(createMockUseRecipeQuery());
  });

  describe('検索結果表示', () => {
    it('結果数が0件の場合、検索結果テキストが表示されないこと', () => {
      render(<SearchResultsHeader resultCount={0} />);

      expect(screen.queryByText(/件のレシピが見つかりました/)).not.toBeInTheDocument();
    });

    it('結果数が表示されること', () => {
      render(<SearchResultsHeader resultCount={42} />);

      expect(screen.getByText('42件のレシピが見つかりました')).toBeInTheDocument();
    });

    it('検索キーワードがある場合、キーワードが含まれること', () => {
      vi.mocked(useRecipeQuery).mockReturnValue(
        createMockUseRecipeQuery({
          searchValue: 'エチオピア',
        })
      );

      render(<SearchResultsHeader resultCount={10} />);

      expect(screen.getByText('「エチオピア」で10件のレシピが見つかりました')).toBeInTheDocument();
    });
  });

  describe('ソートセレクト', () => {
    it('ソートセレクトが表示されること', () => {
      render(<SearchResultsHeader resultCount={10} />);

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toBeInTheDocument();
    });

    it('現在のソート状態が表示されること', () => {
      vi.mocked(useRecipeQuery).mockReturnValue(
        createMockUseRecipeQuery({
          filters: { sort: 'viewCount', order: 'desc' as const },
        })
      );

      render(<SearchResultsHeader resultCount={10} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('人気順');
    });

    it('ソート変更時に applyFilters が呼ばれること', async () => {
      const user = userEvent.setup();
      vi.mocked(useRecipeQuery).mockReturnValue(createMockUseRecipeQuery());

      render(<SearchResultsHeader resultCount={10} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: '人気順' }));

      expect(mockApplyFilters).toHaveBeenCalledWith({ sort: 'viewCount', order: 'desc' });
    });

    it('焙煎度ソート選択時に正しい値が設定されること', async () => {
      const user = userEvent.setup();
      vi.mocked(useRecipeQuery).mockReturnValue(createMockUseRecipeQuery());

      render(<SearchResultsHeader resultCount={10} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: '焙煎度（浅煎り順）' }));

      expect(mockApplyFilters).toHaveBeenCalledWith({ sort: 'roastLevel', order: 'asc' });
    });
  });

  describe('className', () => {
    it('追加のクラス名が適用されること', () => {
      const { container } = render(
        <SearchResultsHeader resultCount={10} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
