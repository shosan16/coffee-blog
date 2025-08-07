import { renderHook, act, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useFilterHandlers } from './FilterHandlers';

// useRecipeFilterのモック
const mockUpdateFilter = vi.fn();

vi.mock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
  useRecipeFilter: vi.fn(() => ({
    updateFilter: mockUpdateFilter,
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('useFilterHandlers', () => {
  describe('汎用フィルター更新ハンドラー', () => {
    it('equipmentChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - equipment変更ハンドラーを実行
      act(() => {
        result.current.equipmentChangeHandler(['grinder', 'dripper']);
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('equipment', ['grinder', 'dripper']);
    });

    it('roastLevelChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - roastLevel変更ハンドラーを実行
      act(() => {
        result.current.roastLevelChangeHandler(['LIGHT', 'MEDIUM']);
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('roastLevel', ['LIGHT', 'MEDIUM']);
    });

    it('grindSizeChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - grindSize変更ハンドラーを実行
      act(() => {
        result.current.grindSizeChangeHandler(['FINE', 'MEDIUM']);
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('grindSize', ['FINE', 'MEDIUM']);
    });

    it('beanWeightChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - beanWeight変更ハンドラーを実行
      act(() => {
        result.current.beanWeightChangeHandler({ min: 15, max: 25 });
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('beanWeight', { min: 15, max: 25 });
    });

    it('waterTempChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - waterTemp変更ハンドラーを実行
      act(() => {
        result.current.waterTempChangeHandler({ min: 85, max: 95 });
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('waterTemp', { min: 85, max: 95 });
    });

    it('waterAmountChangeHandler が正しく動作する', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result } = renderHook(() => useFilterHandlers());

      // Act - waterAmount変更ハンドラーを実行
      act(() => {
        result.current.waterAmountChangeHandler({ min: 200, max: 300 });
      });

      // Assert - updateFilterが正しい引数で呼び出される
      expect(mockUpdateFilter).toHaveBeenCalledWith('waterAmount', { min: 200, max: 300 });
    });
  });

  describe('エラーハンドリング', () => {
    it('updateFilterがエラーをスローした場合、ハンドラーがエラーを適切に処理する', () => {
      // Arrange - updateFilterがエラーをスローするようにモック
      mockUpdateFilter.mockImplementationOnce(() => {
        throw new Error('Update filter failed');
      });
      const { result } = renderHook(() => useFilterHandlers());

      // Act & Assert - エラーがスローされることを確認
      expect(() => {
        act(() => {
          result.current.equipmentChangeHandler(['grinder']);
        });
      }).toThrow('Update filter failed');
    });
  });

  describe('パフォーマンス', () => {
    it('ハンドラーがメモ化され、不要な再レンダリングを防ぐ', () => {
      // Arrange - useFilterHandlersをレンダリング
      const { result, rerender } = renderHook(() => useFilterHandlers());
      const initialHandlers = result.current;

      // Act - 再レンダリングを実行
      rerender();

      // Assert - ハンドラーが同じ参照を保持することを確認
      expect(result.current.equipmentChangeHandler).toBe(initialHandlers.equipmentChangeHandler);
      expect(result.current.roastLevelChangeHandler).toBe(initialHandlers.roastLevelChangeHandler);
      expect(result.current.grindSizeChangeHandler).toBe(initialHandlers.grindSizeChangeHandler);
      expect(result.current.beanWeightChangeHandler).toBe(initialHandlers.beanWeightChangeHandler);
      expect(result.current.waterTempChangeHandler).toBe(initialHandlers.waterTempChangeHandler);
      expect(result.current.waterAmountChangeHandler).toBe(
        initialHandlers.waterAmountChangeHandler
      );
    });
  });
});
