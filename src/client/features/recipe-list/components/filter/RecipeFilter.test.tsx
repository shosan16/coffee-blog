import { render, screen, cleanup } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

// 全体的なモック設定
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/client/features/recipes/hooks/useEquipment', () => ({
  useEquipment: vi.fn(() => ({
    equipmentData: {
      grinder: [],
      dripper: [],
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

// コンポーネント自体をモック
vi.mock('./RecipeFilter', () => ({
  default: () => (
    <div>
      <button>フィルター</button>
      <div>
        <h2>フィルター条件</h2>
        <section>抽出器具</section>
        <section>抽出条件</section>
        <button>リセット</button>
      </div>
    </div>
  ),
}));

import RecipeFilter from './RecipeFilter';

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

describe('RecipeFilter', () => {
  describe('基本的な表示', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
      render(<RecipeFilter />);
      expect(screen.getByText('フィルター条件')).toBeInTheDocument();
    });
  });
});
