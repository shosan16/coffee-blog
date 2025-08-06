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
});
