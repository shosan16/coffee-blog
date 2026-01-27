import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

// Next.js のルーティングをモック
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: (): { push: typeof mockPush } => ({
    push: mockPush,
  }),
  useSearchParams: (): URLSearchParams => mockSearchParams,
}));

describe('useRecipeQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('search');
    mockSearchParams.delete('roastLevel');
    mockSearchParams.delete('page');
  });

  describe('初期状態', () => {
    it('空のURLパラメータで初期化される', () => {
      const { result } = renderHook(() => useRecipeQuery());

      expect(result.current.searchValue).toBe('');
      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.filters).toEqual({});
      expect(result.current.pendingFilters).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasChanges).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
    });
  });

  describe('setSearchValue', () => {
    it('pending検索値を更新する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setSearchValue('coffee');
      });

      expect(result.current.pendingSearchValue).toBe('coffee');
      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('setFilter', () => {
    it('pendingフィルターを更新する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setFilter('roastLevel', ['LIGHT', 'MEDIUM']);
      });

      expect(result.current.pendingFilters.roastLevel).toEqual(['LIGHT', 'MEDIUM']);
      expect(result.current.hasChanges).toBe(true);
    });

    it('空の配列でフィルターを削除する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setFilter('roastLevel', ['LIGHT']);
      });

      act(() => {
        result.current.setFilter('roastLevel', []);
      });

      expect(result.current.pendingFilters.roastLevel).toBeUndefined();
    });
  });

  describe('apply', () => {
    it('pendingの値でURLに遷移する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setSearchValue('espresso');
        result.current.setFilter('roastLevel', ['DARK']);
      });

      act(() => {
        result.current.apply();
      });

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('search=espresso'));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('roastLevel=DARK'));
    });
  });

  describe('applyFilters', () => {
    it('フィルターを即座に適用する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.applyFilters({ roastLevel: ['MEDIUM'] });
      });

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('roastLevel=MEDIUM'));
    });
  });

  describe('removeFilter', () => {
    it('フィルターを削除してURLに反映する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.removeFilter('roastLevel');
      });

      expect(mockPush).toHaveBeenCalled();
    });

    it('配列フィルターから特定のアイテムを削除する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      // まずフィルターを適用
      act(() => {
        result.current.applyFilters({ roastLevel: ['LIGHT', 'MEDIUM', 'DARK'] });
      });

      mockPush.mockClear();

      // 特定のアイテムを削除
      act(() => {
        result.current.removeFilter('roastLevel', 'MEDIUM');
      });

      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('全ての状態をリセットしてルートに遷移する', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setSearchValue('test');
        result.current.setFilter('roastLevel', ['LIGHT']);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.pendingFilters).toEqual({});
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('clearSearch', () => {
    it('検索値をクリアする', () => {
      const { result } = renderHook(() => useRecipeQuery());

      act(() => {
        result.current.setSearchValue('test');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('activeFilterCount', () => {
    it('ページネーション・ソート以外のフィルター数をカウントする', () => {
      // URLパラメータを設定（filter.tsで定義されたパラメータ名を使用）
      mockSearchParams.set('roastLevel', 'LIGHT,MEDIUM');
      mockSearchParams.set('search', 'coffee');
      mockSearchParams.set('page', '2');

      const { result } = renderHook(() => useRecipeQuery());

      // page は除外され、roastLevel と search がカウントされる
      expect(result.current.activeFilterCount).toBe(2);
    });
  });

  describe('hasChanges', () => {
    it('pending値が現在の値と異なる場合trueを返す', () => {
      const { result } = renderHook(() => useRecipeQuery());

      expect(result.current.hasChanges).toBe(false);

      act(() => {
        result.current.setSearchValue('new search');
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('戻り値の型', () => {
    it('UseRecipeQueryReturn型の全てのプロパティを返す', () => {
      const { result } = renderHook(() => useRecipeQuery());

      const expectedKeys: (keyof typeof result.current)[] = [
        'searchValue',
        'filters',
        'pendingSearchValue',
        'pendingFilters',
        'setSearchValue',
        'setFilter',
        'removeFilter',
        'applyFilters',
        'apply',
        'reset',
        'clearSearch',
        'isLoading',
        'hasChanges',
        'activeFilterCount',
      ];

      expectedKeys.forEach((key) => {
        expect(result.current).toHaveProperty(key);
      });
    });
  });
});
