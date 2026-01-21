import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useTagOverflow } from './useTagOverflow';

describe('useTagOverflow', () => {
  describe('タグ数が最大表示数以下の場合', () => {
    it('すべてのタグが visibleTags に含まれる', () => {
      // Arrange
      const tags = ['フルーティ', '酸味強め', 'シングルオリジン'];

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, 6));

      // Assert
      expect(result.current.visibleTags).toEqual(tags);
      expect(result.current.hiddenTags).toEqual([]);
      expect(result.current.hasOverflow).toBe(false);
    });

    it('タグが空の場合、hasOverflow は false', () => {
      // Arrange
      const tags: string[] = [];

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, 6));

      // Assert
      expect(result.current.visibleTags).toEqual([]);
      expect(result.current.hiddenTags).toEqual([]);
      expect(result.current.hasOverflow).toBe(false);
    });
  });

  describe('タグ数が最大表示数を超える場合', () => {
    it('最大表示数のタグが visibleTags に含まれる', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5', 'タグ6', 'タグ7', 'タグ8'];
      const maxVisible = 6;

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, maxVisible));

      // Assert
      expect(result.current.visibleTags).toHaveLength(maxVisible);
      expect(result.current.visibleTags).toEqual([
        'タグ1',
        'タグ2',
        'タグ3',
        'タグ4',
        'タグ5',
        'タグ6',
      ]);
    });

    it('超過分のタグが hiddenTags に含まれる', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5', 'タグ6', 'タグ7', 'タグ8'];
      const maxVisible = 6;

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, maxVisible));

      // Assert
      expect(result.current.hiddenTags).toEqual(['タグ7', 'タグ8']);
    });

    it('hasOverflow が true になる', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5', 'タグ6', 'タグ7'];
      const maxVisible = 6;

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, maxVisible));

      // Assert
      expect(result.current.hasOverflow).toBe(true);
    });
  });

  describe('最大表示数のカスタマイズ', () => {
    it('maxVisible を 4 に設定した場合、4 個まで表示される', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5'];
      const maxVisible = 4;

      // Act
      const { result } = renderHook(() => useTagOverflow(tags, maxVisible));

      // Assert
      expect(result.current.visibleTags).toHaveLength(4);
      expect(result.current.hiddenTags).toHaveLength(1);
      expect(result.current.hasOverflow).toBe(true);
    });
  });
});
