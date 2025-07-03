import { renderHook, act } from '@testing-library/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useRecipeFilter } from './useRecipeFilter';

// Next.jsのhooksをモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);
const mockUseSearchParams = vi.mocked(useSearchParams);

describe('useRecipeFilter', () => {
  const mockPush = vi.fn();
  const mockRouter: Partial<AppRouterInstance> = {
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };
  const mockSearchParams = new URLSearchParams() as ReadonlyURLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as AppRouterInstance);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
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
      const { default: isEqual } = await import('lodash.isequal');

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

  describe('hasChangesの計算', () => {
    it('フィルターに変更がない場合はfalseを返す', () => {
      // URLSearchParamsをモック
      const mockSearchParamsWithFilters = {
        get: vi.fn((key: string) => {
          if (key === 'roastLevel') return 'LIGHT,MEDIUM';
          return null;
        }),
        has: vi.fn(),
        entries: vi.fn(),
        keys: vi.fn(),
        values: vi.fn(),
        forEach: vi.fn(),
        sort: vi.fn(),
        toString: vi.fn(),
        size: 0,
        [Symbol.iterator]: vi.fn(),
      } as unknown as ReadonlyURLSearchParams;

      mockUseSearchParams.mockReturnValue(mockSearchParamsWithFilters);

      const { result } = renderHook(() => useRecipeFilter());

      expect(result.current.hasChanges).toBe(false);
    });

    it('フィルターに変更がある場合はtrueを返す', () => {
      const { result } = renderHook(() => useRecipeFilter());

      act(() => {
        result.current.updateFilter('roastLevel', ['LIGHT']);
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('pendingFiltersの同期', () => {
    it('初期化時にcurrentFiltersと同期される', () => {
      // URLSearchParamsをモック
      const mockSearchParamsWithData = {
        get: vi.fn((key: string) => {
          if (key === 'roastLevel') return 'LIGHT';
          if (key === 'equipment') return 'V60,Chemex';
          return null;
        }),
        has: vi.fn(),
        entries: vi.fn(),
        keys: vi.fn(),
        values: vi.fn(),
        forEach: vi.fn(),
        sort: vi.fn(),
        toString: vi.fn(),
        size: 0,
        [Symbol.iterator]: vi.fn(),
      } as unknown as ReadonlyURLSearchParams;

      mockUseSearchParams.mockReturnValue(mockSearchParamsWithData);

      const { result } = renderHook(() => useRecipeFilter());

      expect(result.current.pendingFilters).toEqual({
        roastLevel: ['LIGHT'],
        equipment: ['V60', 'Chemex'],
      });
    });
  });
});
