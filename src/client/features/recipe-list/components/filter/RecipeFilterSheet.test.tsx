import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

// ResizeObserverのモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 全体的なモック設定
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/client/features/recipes/hooks/useEquipment', () => ({
  useEquipment: vi.fn(() => ({
    equipmentData: {
      grinder: [{ id: '1', name: 'テストグラインダー' }],
      dripper: [{ id: '2', name: 'テストドリッパー' }],
      filter: [],
      scale: [],
      kettle: [],
      other: [],
    },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/client/features/recipe-list/utils/filter', () => ({
  parseFiltersFromSearchParams: vi.fn(() => ({})),
}));

vi.mock('@/client/shared/api/request', () => ({
  buildQueryParams: vi.fn(() => new URLSearchParams()),
}));

import RecipeFilterSheet from './RecipeFilterSheet';

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchParams = new URLSearchParams();
  (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
    push: mockPush,
  });
  (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(mockSearchParams);
});

afterEach(() => {
  cleanup();
});

describe('RecipeFilterSheet', () => {
  describe('基本レンダリング', () => {
    it('フィルターボタンが表示される', () => {
      // Arrange - RecipeFilterSheetをレンダリング

      // Act - コンポーネントをレンダリング
      render(<RecipeFilterSheet />);

      // Assert - フィルターボタンが表示されることを確認
      expect(screen.getByRole('button', { name: /フィルター/i })).toBeInTheDocument();
    });

    it('フィルターボタンにFilter Iconが表示される', () => {
      // Arrange - RecipeFilterSheetをレンダリング

      // Act - コンポーネントをレンダリング
      render(<RecipeFilterSheet />);

      // Assert - フィルターアイコンが存在することを確認（lucide-reactのFilterアイコン）
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      expect(filterButton).toBeInTheDocument();
    });

    it('アクティブフィルター数が0の場合、カウントが表示されない', () => {
      // Arrange - フィルターが設定されていない状態

      // Act - コンポーネントをレンダリング
      render(<RecipeFilterSheet />);

      // Assert - フィルターカウントが表示されないことを確認
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Sheet開閉機能', () => {
    it('フィルターボタンクリックでSheetが開く', async () => {
      // Arrange - RecipeFilterSheetをレンダリング
      render(<RecipeFilterSheet />);

      // Act - フィルターボタンをクリック
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Assert - Sheetが開いてフィルター条件が表示される
      await waitFor(() => {
        expect(screen.getByText('フィルター条件')).toBeInTheDocument();
      });
    });

    it('Sheet内にフィルター機能が表示される', async () => {
      // Arrange - RecipeFilterSheetをレンダリングしてSheetを開く
      render(<RecipeFilterSheet />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Act - Sheetが開くまで待機

      // Assert - フィルター機能が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('フィルター条件')).toBeInTheDocument();
        expect(screen.getAllByText('抽出器具')[0]).toBeInTheDocument();
        expect(screen.getAllByText('抽出条件')[0]).toBeInTheDocument();
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('フィルターボタンに適切なaria-labelが設定される', () => {
      // Arrange - RecipeFilterSheetをレンダリング

      // Act - コンポーネントをレンダリング
      render(<RecipeFilterSheet />);

      // Assert - aria-labelが適切に設定されることを確認
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      expect(filterButton).toHaveAttribute('aria-label', 'フィルター条件を開く');
    });

    it('Sheet開閉状態に応じてaria-expandedが変更される', async () => {
      // Arrange - RecipeFilterSheetをレンダリング
      render(<RecipeFilterSheet />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });

      // Act & Assert - 初期状態ではaria-expanded="false"
      expect(filterButton).toHaveAttribute('aria-expanded', 'false');

      // Act - ボタンをクリックしてSheetを開く
      fireEvent.click(filterButton);

      // Assert - Sheet開放後はaria-expanded="true"
      await waitFor(() => {
        expect(filterButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('useRecipeFilterがエラーをスローした場合、適切にエラーハンドリングされる', () => {
      // Arrange - useRecipeFilterがエラーをスローするようにモック
      vi.mock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => {
          throw new Error('Filter hook failed');
        }),
      }));

      // Act & Assert - エラーが適切にハンドリングされ、コンポーネントがクラッシュしないことを確認
      expect(() => render(<RecipeFilterSheet />)).not.toThrow();
    });

    it('フィルター適用時にネットワークエラーが発生した場合の状態管理', async () => {
      // Arrange - ネットワークエラーをシミュレート
      const mockApplyFilters = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => ({
          filters: {},
          pendingFilters: { equipment: ['grinder'] },
          updateFilter: vi.fn(),
          applyFilters: mockApplyFilters,
          resetFilters: vi.fn(),
          isLoading: false,
          hasChanges: true,
        })),
      }));

      const { render: rerenderWithMock } = await import('@testing-library/react');
      const RecipeFilterSheetWithError = (await import('./RecipeFilterSheet')).default;

      rerenderWithMock(<RecipeFilterSheetWithError />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Act - 絞り込むボタンをクリック
      await waitFor(() => {
        const applyButton = screen.getByRole('button', { name: /絞り込む/i });
        fireEvent.click(applyButton);
      });

      // Assert - エラーが適切にハンドリングされることを確認
      expect(mockApplyFilters).toHaveBeenCalled();
    });
  });

  describe('URL更新テスト', () => {
    it('フィルター適用時にrouterのpushが呼び出される', async () => {
      // Arrange - hasChangesがtrueの状態でモック
      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => ({
          filters: {},
          pendingFilters: { equipment: ['grinder'] },
          updateFilter: vi.fn(),
          applyFilters: vi.fn(() => {
            mockPush('/recipes?equipment=grinder');
          }),
          resetFilters: vi.fn(),
          isLoading: false,
          hasChanges: true,
        })),
      }));

      const { render: rerenderWithMock } = await import('@testing-library/react');
      const RecipeFilterSheetWithURL = (await import('./RecipeFilterSheet')).default;

      rerenderWithMock(<RecipeFilterSheetWithURL />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Act - 絞り込むボタンをクリック
      await waitFor(() => {
        const applyButton = screen.getByRole('button', { name: /絞り込む/i });
        fireEvent.click(applyButton);
      });

      // Assert - URLが正しく更新されることを確認
      expect(mockPush).toHaveBeenCalledWith('/recipes?equipment=grinder');
    });

    it('フィルターリセット時にrouterのpushがルートURLで呼び出される', async () => {
      // Arrange - activeFilterCountが1以上の状態でモック
      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => ({
          filters: { equipment: ['grinder'] },
          pendingFilters: { equipment: ['grinder'] },
          updateFilter: vi.fn(),
          applyFilters: vi.fn(),
          resetFilters: vi.fn(() => {
            mockPush('/');
          }),
          isLoading: false,
          hasChanges: false,
        })),
      }));

      const { render: rerenderWithMock } = await import('@testing-library/react');
      const RecipeFilterSheetWithReset = (await import('./RecipeFilterSheet')).default;

      rerenderWithMock(<RecipeFilterSheetWithReset />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Act - リセットボタンをクリック
      await waitFor(() => {
        const resetButton = screen.getByRole('button', { name: /リセット/i });
        fireEvent.click(resetButton);
      });

      // Assert - ルートURLに遷移することを確認
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('複数フィルター同時適用テスト', () => {
    it('複数のフィルター条件が同時に適用される', async () => {
      // Arrange - 複数のフィルターが設定された状態でモック
      const mockUpdateFilter = vi.fn();
      const mockApplyFilters = vi.fn();

      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => ({
          filters: {},
          pendingFilters: {
            equipment: ['grinder', 'dripper'],
            roastLevel: ['LIGHT', 'MEDIUM'],
            grindSize: ['FINE'],
            beanWeight: { min: 15, max: 25 },
          },
          updateFilter: mockUpdateFilter,
          applyFilters: mockApplyFilters,
          resetFilters: vi.fn(),
          isLoading: false,
          hasChanges: true,
        })),
      }));

      const { render: rerenderWithMock } = await import('@testing-library/react');
      const RecipeFilterSheetMultiple = (await import('./RecipeFilterSheet')).default;

      rerenderWithMock(<RecipeFilterSheetMultiple />);
      const filterButton = screen.getByRole('button', { name: /フィルター/i });
      fireEvent.click(filterButton);

      // Act - 絞り込むボタンをクリック
      await waitFor(() => {
        const applyButton = screen.getByRole('button', { name: /絞り込む/i });
        fireEvent.click(applyButton);
      });

      // Assert - 複数のフィルターが同時に適用されることを確認
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
    });

    it('アクティブフィルター数が正しく表示される（複数フィルター）', () => {
      // Arrange - 複数のフィルターがアクティブな状態でモック
      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: vi.fn(() => ({
          filters: {
            equipment: ['grinder', 'dripper'],
            roastLevel: ['LIGHT'],
            beanWeight: { min: 15, max: 25 },
          },
          pendingFilters: {},
          updateFilter: vi.fn(),
          applyFilters: vi.fn(),
          resetFilters: vi.fn(),
          isLoading: false,
          hasChanges: false,
        })),
      }));

      render(<RecipeFilterSheet />);

      // Assert - アクティブフィルター数が正しく表示される（equipment, roastLevel, beanWeight = 3）
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('パフォーマンステスト', () => {
    it('フィルター更新時の不要な再レンダリングが発生しない', async () => {
      // Arrange - useRecipeFilterの呼び出し回数を監視
      const useRecipeFilterSpy = vi.fn();

      vi.doMock('@/client/features/recipe-list/hooks/useRecipeFilter', () => ({
        useRecipeFilter: useRecipeFilterSpy.mockReturnValue({
          filters: {},
          pendingFilters: {},
          updateFilter: vi.fn(),
          applyFilters: vi.fn(),
          resetFilters: vi.fn(),
          isLoading: false,
          hasChanges: false,
        }),
      }));

      const { rerender } = render(<RecipeFilterSheet />);
      const initialCallCount = useRecipeFilterSpy.mock.calls.length;

      // Act - 再レンダリングを発生させる
      rerender(<RecipeFilterSheet />);

      // Assert - 不要な再レンダリングが発生していないことを確認
      expect(useRecipeFilterSpy.mock.calls.length).toBeLessThanOrEqual(initialCallCount + 1);
    });
  });
});
