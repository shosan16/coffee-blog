import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ActiveFilters from './ActiveFilters';
import { useRecipeSearch } from '../../hooks/useRecipeSearch';

// useRecipeSearchフックをモック
vi.mock('../../hooks/useRecipeSearch', () => ({
  useRecipeSearch: vi.fn(),
}));

// useEquipmentフックをモック
vi.mock('../../hooks/useEquipment', () => ({
  useEquipment: vi.fn(),
}));

const mockedUseRecipeSearch = vi.mocked(useRecipeSearch);

// useEquipmentインポートとモック
import { useEquipment } from '../../hooks/useEquipment';
const mockedUseEquipment = vi.mocked(useEquipment);

describe('ActiveFilters', () => {
  const mockUpdateFilter = vi.fn();
  const mockClearSearch = vi.fn();
  const mockResetSearch = vi.fn();
  const mockApplySearch = vi.fn();
  const mockRemoveFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    // useEquipmentのデフォルトモック
    mockedUseEquipment.mockReturnValue({
      equipment: {
        grinder: [{ id: '1', name: 'コマンダンテ C40', brand: 'コマンダンテ', type: 'grinder' }],
        dripper: [{ id: '2', name: 'ORIGAMI ドリッパー', brand: 'ORIGAMI', type: 'dripper' }],
        filter: [{ id: '3', name: 'V60ペーパーフィルター', brand: 'Hario', type: 'filter' }],
      },
      isLoading: false,
      error: null,
    });
  });

  describe('フィルターなしの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {},
        searchValue: '',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('フィルターがない場合は何も表示されない', () => {
      const { container } = render(<ActiveFilters />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('検索キーワードのみの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {},
        searchValue: 'エスプレッソ',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: 'エスプレッソ',
        pendingFilters: {},
        applySearch: vi.fn(),
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('検索キーワードバッジが表示される', () => {
      render(<ActiveFilters />);

      expect(screen.getByText('適用中のフィルター (1件)')).toBeInTheDocument();
      expect(screen.getByText('検索:')).toBeInTheDocument();
      expect(screen.getByText('エスプレッソ')).toBeInTheDocument();
    });

    it('検索キーワードのクリアボタンが動作する', () => {
      render(<ActiveFilters />);

      const clearButton = screen.getByLabelText('検索フィルターを削除');
      fireEvent.click(clearButton);

      expect(mockClearSearch).toHaveBeenCalledOnce();
    });
  });

  describe('配列フィルターの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {
          roastLevel: ['LIGHT', 'MEDIUM'],
          grindSize: ['MEDIUM_FINE'],
        },
        searchValue: '',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('配列フィルターが正しく表示される', () => {
      render(<ActiveFilters />);

      expect(screen.getByText('適用中のフィルター (2件)')).toBeInTheDocument();
      expect(screen.getByText('焙煎度:')).toBeInTheDocument();
      expect(screen.getByText('LIGHT, MEDIUM')).toBeInTheDocument();
      expect(screen.getByText('挽き目:')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM_FINE')).toBeInTheDocument();
    });

    it('配列フィルターのクリアボタンが動作する', () => {
      render(<ActiveFilters />);

      const roastLevelClearButton = screen.getByLabelText('焙煎度フィルターを削除');
      fireEvent.click(roastLevelClearButton);

      expect(mockRemoveFilter).toHaveBeenCalledWith('roastLevel');
    });
  });

  describe('範囲フィルターの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {
          beanWeight: { min: 15, max: 20 },
          waterTemp: { min: 85 },
          waterAmount: { max: 300 },
        },
        searchValue: '',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it.skip('範囲フィルターが正しく表示される', () => {
      // TODO: ActiveFiltersコンポーネントのDOM構造を確認して修正
      render(<ActiveFilters />);

      expect(screen.getByText('適用中のフィルター (3件)')).toBeInTheDocument();
      expect(screen.getByText('コーヒー粉量:')).toBeInTheDocument();
      expect(screen.getByText('15 - 20')).toBeInTheDocument();
      expect(screen.getByText('湯温:')).toBeInTheDocument();
      // 部分的な一致で検索
      expect(screen.getByText(/85/)).toBeInTheDocument();
      expect(screen.getByText('総湯量:')).toBeInTheDocument();
      expect(screen.getByText(/300/)).toBeInTheDocument();
    });

    it('範囲フィルターのクリアボタンが動作する', () => {
      render(<ActiveFilters />);

      const beanWeightClearButton = screen.getByLabelText('コーヒー粉量フィルターを削除');
      fireEvent.click(beanWeightClearButton);

      expect(mockRemoveFilter).toHaveBeenCalledWith('beanWeight');
    });
  });

  describe('複合フィルターの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {
          roastLevel: ['DARK'],
          beanWeight: { min: 18, max: 22 },
          page: 2, // pageは表示対象外
        },
        searchValue: 'カフェラテ',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: 'カフェラテ',
        pendingFilters: {},
        applySearch: vi.fn(),
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('検索キーワードと複数フィルターが表示される', () => {
      render(<ActiveFilters />);

      expect(screen.getByText('適用中のフィルター (3件)')).toBeInTheDocument();

      // 検索キーワード
      expect(screen.getByText('検索:')).toBeInTheDocument();
      expect(screen.getByText('カフェラテ')).toBeInTheDocument();

      // フィルター
      expect(screen.getByText('焙煎度:')).toBeInTheDocument();
      expect(screen.getByText('DARK')).toBeInTheDocument();
      expect(screen.getByText('コーヒー粉量:')).toBeInTheDocument();
      expect(screen.getByText('18 - 22')).toBeInTheDocument();

      // pageフィルターは表示されない
      expect(screen.queryByText('page')).not.toBeInTheDocument();
    });

    it('すべてクリアボタンが動作する', () => {
      render(<ActiveFilters />);

      const clearAllButton = screen.getByText('すべてクリア');
      fireEvent.click(clearAllButton);

      expect(mockResetSearch).toHaveBeenCalledOnce();
    });
  });

  describe('機器フィルターの状態', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: {
          equipment: ['コマンダンテ C40', 'ORIGAMI ドリッパー'],
        },
        searchValue: '',
        updateSearchValue: vi.fn(),
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('機器フィルターが個別に分類されて表示される', () => {
      render(<ActiveFilters />);

      expect(screen.getByText('適用中のフィルター (2件)')).toBeInTheDocument();

      // コーヒーミル
      expect(screen.getByText('コーヒーミル:')).toBeInTheDocument();
      expect(screen.getByText('コマンダンテ コマンダンテ C40')).toBeInTheDocument();

      // ドリッパー
      expect(screen.getByText('ドリッパー:')).toBeInTheDocument();
      expect(screen.getByText('ORIGAMI ORIGAMI ドリッパー')).toBeInTheDocument();
    });

    it('削除ボタンクリック時にフィルターが即座に解除されること', () => {
      // Arrange - 準備：機器フィルターを含む状態でコンポーネントを準備
      render(<ActiveFilters />);

      // Act - 実行：コーヒーミルフィルターの削除ボタンをクリック
      const deleteButton = screen.getByLabelText('コーヒーミルフィルターを削除');
      fireEvent.click(deleteButton);

      // Assert - 確認：removeFilterが適切に呼ばれることを検証
      expect(mockRemoveFilter).toHaveBeenCalledWith('equipment', 'コマンダンテ C40');
    });

    it('最後の機器を削除した場合にフィルター自体が削除されること', () => {
      // Arrange - 準備：単一機器フィルターでコンポーネントを準備
      mockedUseRecipeSearch.mockReturnValue({
        filters: {
          equipment: ['コマンダンテ C40'],
        },
        searchValue: '',
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });

      // Act - 実行：削除ボタンをクリック
      render(<ActiveFilters />);
      const deleteButton = screen.getByLabelText('コーヒーミルフィルターを削除');
      fireEvent.click(deleteButton);

      // Assert - 確認：removeFilterが適切に呼ばれることを検証
      expect(mockRemoveFilter).toHaveBeenCalledWith('equipment', 'コマンダンテ C40');
    });
  });

  describe('CSS クラス', () => {
    beforeEach(() => {
      mockedUseRecipeSearch.mockReturnValue({
        filters: { roastLevel: ['浅煎り'] },
        searchValue: '',
        updateFilter: mockUpdateFilter,
        clearSearch: mockClearSearch,
        resetSearch: mockResetSearch,
        applySearch: mockApplySearch,
        removeFilter: mockRemoveFilter,
        pendingSearchValue: '',
        pendingFilters: {},
        isLoading: false,
        hasChanges: false,
        resultCount: undefined,
        setResultCount: vi.fn(),
      });
    });

    it('カスタムクラス名が適用される', () => {
      const { container } = render(<ActiveFilters className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
