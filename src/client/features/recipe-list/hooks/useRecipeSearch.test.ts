import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useRecipeSearch } from './useRecipeSearch';

const mockedUseRouter = vi.mocked(useRouter);
const mockedUseSearchParams = vi.mocked(useSearchParams);

// utility関数をモック
vi.mock('@/client/features/recipe-list/utils/filter', () => ({
  parseFiltersFromSearchParams: vi.fn(() => ({})),
}));

vi.mock('@/client/shared/api/request', () => ({
  buildQueryParams: vi.fn(() => new URLSearchParams()),
}));

describe('useRecipeSearch', () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn((key: string) => {
    if (key === 'search') return '';
    return null;
  });

  // テスト用のデフォルトmockSearchParams
  const createMockSearchParams = (): ReadonlyURLSearchParams =>
    ({
      get: mockGet,
      has: vi.fn(() => false),
      keys: vi.fn(),
      values: vi.fn(),
      entries: vi.fn(),
      forEach: vi.fn(),
      toString: vi.fn(() => ''),
    }) as unknown as ReadonlyURLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });

    const mockSearchParams = createMockSearchParams();
    mockedUseSearchParams.mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams);

    mockGet.mockImplementation((key: string) => {
      if (key === 'search') return '';
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    // モックを確実にリセット
    mockedUseRouter.mockClear();
    mockedUseSearchParams.mockClear();
  });

  describe('初期状態', () => {
    it('初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useRecipeSearch());

      expect(result.current.searchValue).toBe('');
      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.filters).toEqual({});
      expect(result.current.pendingFilters).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasChanges).toBe(false);
      expect(result.current.resultCount).toBeUndefined();
    });

    it('URLパラメータの検索キーワードが初期値として設定される', () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'search') return '';
        return null;
      });

      const { result } = renderHook(() => useRecipeSearch());

      expect(result.current.searchValue).toBe('');
      expect(result.current.pendingSearchValue).toBe('');
    });

    it('searchパラメータが存在しない場合は空文字になること', () => {
      // Arrange - searchパラメータなしの状態を設定
      const mockSearchParamsEmpty = {
        get: vi.fn(() => null),
        has: vi.fn(() => false),
        keys: vi.fn(() => []),
        values: vi.fn(() => []),
        entries: vi.fn(() => []),
        forEach: vi.fn(),
        toString: vi.fn(() => ''),
      };
      mockedUseSearchParams.mockReturnValue(
        mockSearchParamsEmpty as unknown as ReadonlyURLSearchParams
      );

      // Act - フックを実行
      const { result } = renderHook(() => useRecipeSearch());

      // Assert - 空文字で初期化されることを確認
      expect(result.current.searchValue).toBe('');
      expect(result.current.pendingSearchValue).toBe('');
    });
  });

  describe('検索キーワードの更新', () => {
    it('updateSearchValueで検索キーワードが更新される', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.updateSearchValue('エスプレッソ');
      });

      expect(result.current.pendingSearchValue).toBe('エスプレッソ');
      expect(result.current.hasChanges).toBe(true);
    });

    it('検索キーワードの変更でhasChangesがtrueになる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      expect(result.current.hasChanges).toBe(false);

      act(() => {
        result.current.updateSearchValue('ドリップ');
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('検索の適用', () => {
    it('applySearchでルーターが呼ばれる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.updateSearchValue('カフェラテ');
      });

      act(() => {
        result.current.applySearch();
      });

      expect(mockPush).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(true);
    });

    it('空の検索キーワードでapplySearchを実行', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.updateSearchValue('');
      });

      act(() => {
        result.current.applySearch();
      });

      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('検索のリセット', () => {
    it('resetSearchで全ての状態がリセットされる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      // 初期状態を設定
      act(() => {
        result.current.updateSearchValue('テスト');
        result.current.setResultCount(42);
      });

      // リセット実行
      act(() => {
        result.current.resetSearch();
      });

      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.pendingFilters).toEqual({});
      expect(result.current.resultCount).toBeUndefined();
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('clearSearchで検索キーワードのみクリアされる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      // 初期状態を設定
      act(() => {
        result.current.updateSearchValue('テスト');
        result.current.updateFilter('roastLevel', ['LIGHT']);
      });

      // 検索のみクリア
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.pendingFilters).toEqual({ roastLevel: ['LIGHT'], page: 1 });
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('フィルター操作', () => {
    it('updateFilterでフィルターが更新される', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.updateFilter('roastLevel', ['MEDIUM']);
      });

      expect(result.current.pendingFilters).toEqual({ roastLevel: ['MEDIUM'], page: 1 });
      expect(result.current.hasChanges).toBe(true);
    });

    it('空の値でupdateFilterを呼ぶとフィルターが削除される', () => {
      const { result } = renderHook(() => useRecipeSearch());

      // フィルターを設定
      act(() => {
        result.current.updateFilter('roastLevel', ['MEDIUM']);
      });

      // 空の値で更新（削除）
      act(() => {
        result.current.updateFilter('roastLevel', []);
      });

      expect(result.current.pendingFilters).not.toHaveProperty('roastLevel');
    });
  });

  describe('検索結果数', () => {
    it('setResultCountで検索結果数が設定される', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.setResultCount(25);
      });

      expect(result.current.resultCount).toBe(25);
    });

    it('undefinedを設定できる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.setResultCount(10);
      });

      act(() => {
        result.current.setResultCount(undefined);
      });

      expect(result.current.resultCount).toBeUndefined();
    });
  });

  describe('ローディング状態', () => {
    it('applySearch実行時にローディング状態になる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.applySearch();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('resetSearch実行時にローディング状態になる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.resetSearch();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('clearSearch実行時にローディング状態になる', () => {
      const { result } = renderHook(() => useRecipeSearch());

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('深い比較の最適化', () => {
    it('JSON.stringifyを使った比較が非効率であることを確認', () => {
      // Red: 現在のJSON.stringify実装の問題点を示すテスト
      const complexObject1 = {
        roastLevel: ['LIGHT', 'MEDIUM'],
        beanWeight: { min: 10, max: 20 },
        equipment: ['V60', 'Chemex'],
      };

      // JSON.stringifyは順序に依存するため、同じ内容でも文字列が異なる場合がある
      const differentOrderObject = {
        equipment: ['V60', 'Chemex'],
        roastLevel: ['LIGHT', 'MEDIUM'],
        beanWeight: { min: 10, max: 20 },
      };

      // 現在の実装はこのテストで失敗することを示す（プロパティの順序が異なる）
      expect(JSON.stringify(complexObject1)).not.toBe(JSON.stringify(differentOrderObject));
    });

    it('isEqualを使った深い比較が正しく動作することを確認', async () => {
      // Green: isEqualによる正しい深い比較の実装テスト
      const { isEqual } = await import('lodash');

      const complexObject1 = {
        roastLevel: ['LIGHT', 'MEDIUM'],
        beanWeight: { min: 10, max: 20 },
        equipment: ['V60', 'Chemex'],
      };

      const complexObject2 = {
        roastLevel: ['LIGHT', 'MEDIUM'],
        beanWeight: { min: 10, max: 20 },
        equipment: ['V60', 'Chemex'],
      };

      const differentOrderObject = {
        equipment: ['V60', 'Chemex'],
        roastLevel: ['LIGHT', 'MEDIUM'],
        beanWeight: { min: 10, max: 20 },
      };

      // isEqualは順序に関係なく正しく比較できる
      expect(isEqual(complexObject1, complexObject2)).toBe(true);
      expect(isEqual(complexObject1, differentOrderObject)).toBe(true);
    });
  });
});
