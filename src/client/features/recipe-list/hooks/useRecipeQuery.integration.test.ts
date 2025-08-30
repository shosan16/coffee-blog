import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';

// モック設定
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/client/shared/api/request', () => ({
  buildQueryParams: vi.fn((params) => new URLSearchParams(params)),
}));

vi.mock('../utils/filter', () => ({
  parseFiltersFromSearchParams: vi.fn(() => ({})),
}));

describe('useRecipeQuery Integration Tests - Search Synchronization', () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();

    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('シナリオ1: "example"入力→検索ボタン→"example"でフィルターされる', () => {
    it('検索値の入力と検索実行により、URLに検索パラメータが正しく追加される', async () => {
      // Arrange - 初期状態（URLに検索パラメータなし）
      mockGet.mockReturnValue('');

      const { result } = renderHook(() => useRecipeQuery());

      // Act 1 - ユーザーが"example"を入力
      act(() => {
        result.current.setSearchValue('example');
      });

      // Assert 1 - pending状態に反映される
      expect(result.current.pendingSearchValue).toBe('example');
      expect(result.current.hasChanges).toBe(true);

      // Act 2 - ユーザーが検索ボタンをクリック（apply実行）
      act(() => {
        result.current.apply();
      });

      // Assert 2 - URLプッシュが"example"検索パラメータ付きで呼ばれる
      expect(mockPush).toHaveBeenCalledWith('?search=example&page=1');
    });
  });

  describe('シナリオ2: "example"検索後→クリア→検索→全アイテム表示', () => {
    it('検索後のクリア操作で、pendingSearchValueがクリアされ、検索実行時に全アイテムが表示される', async () => {
      // Arrange - 初期状態で"example"が既にURL検索パラメータに存在
      mockGet.mockReturnValue('example');

      const { result } = renderHook(() => useRecipeQuery());

      // 初期状態の検証（URLから同期された状態）
      expect(result.current.searchValue).toBe('example');
      expect(result.current.pendingSearchValue).toBe('example');

      // Act 1 - クリアボタンをクリック（setSearchValue('')実行）
      act(() => {
        result.current.setSearchValue('');
      });

      // Assert 1 - pending値がクリアされるが、URL値は変更されない
      expect(result.current.pendingSearchValue).toBe('');
      expect(result.current.searchValue).toBe('example'); // URL値は変更されない
      expect(result.current.hasChanges).toBe(true); // 変更があることを検出

      // Act 2 - 空の状態で検索ボタンをクリック（apply実行）
      act(() => {
        result.current.apply();
      });

      // Assert 2 - URLプッシュが検索パラメータなし（全アイテム表示）で呼ばれる
      expect(mockPush).toHaveBeenCalledWith('?page=1');
    });
  });

  describe('URL同期の修正確認', () => {
    it('ユーザー入力がURL同期により上書きされないことを確認', async () => {
      // Arrange - 初期URL検索パラメータなし
      mockGet.mockReturnValue('');

      const { result, rerender } = renderHook(() => useRecipeQuery());

      // Act 1 - ユーザーが"test"を入力
      act(() => {
        result.current.setSearchValue('test');
      });

      // Assert 1 - 正常に入力される
      expect(result.current.pendingSearchValue).toBe('test');

      // Act 2 - 何らかの理由でフックが再レンダリング（useEffectトリガー）
      rerender();

      // Assert 2 - 修正により、ユーザー入力が保護される
      expect(result.current.pendingSearchValue).toBe('test'); // 修正後: ユーザー入力が保持される
    });
  });
});
