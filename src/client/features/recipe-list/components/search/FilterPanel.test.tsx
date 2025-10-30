import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import FilterPanel from '@/client/features/recipe-list/components/search/FilterPanel';
import type { UseRecipeQueryReturn } from '@/client/features/recipe-list/hooks/useRecipeQuery';

// モックデータの作成
const createMockQueryResult = (
  overrides: Partial<UseRecipeQueryReturn> = {}
): UseRecipeQueryReturn => ({
  searchValue: '',
  filters: {},
  pendingSearchValue: '',
  pendingFilters: {
    equipment: [],
    roastLevel: [],
    grindSize: [],
    beanWeight: {},
    waterTemp: {},
    waterAmount: {},
  },
  setSearchValue: vi.fn(),
  setFilter: vi.fn(),
  removeFilter: vi.fn(),
  apply: vi.fn(),
  reset: vi.fn(),
  clearSearch: vi.fn(),
  isLoading: false,
  hasChanges: false,
  activeFilterCount: 0,
  ...overrides,
});

describe('FilterPanel', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('基本的な表示', () => {
    it('パネルが閉じている場合、コンテンツが表示されないこと', () => {
      // Arrange - isOpen=falseでレンダリング
      render(
        <FilterPanel isOpen={false} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Assert - パネルのコンテンツが表示されないことを確認
      expect(screen.queryByText('フィルター条件')).not.toBeInTheDocument();
    });

    it('パネルが開いている場合、コンテンツが表示されること', () => {
      // Arrange - isOpen=trueでレンダリング
      render(
        <FilterPanel isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Assert - パネルのコンテンツが表示されることを確認
      expect(screen.getByText('フィルター条件')).toBeInTheDocument();
      expect(screen.getByText('リセット')).toBeInTheDocument();
      expect(screen.getByText('絞り込む')).toBeInTheDocument();
    });

    it('フィルター説明がスクリーンリーダー向けに適切に設定されること', () => {
      // Arrange - パネルを開いた状態でレンダリング
      render(
        <FilterPanel isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Assert - アクセシビリティ向けの説明テキストが存在することを確認
      const descriptions = screen.getAllByText(/レシピの絞り込み条件を設定できます/);
      expect(descriptions.length).toBeGreaterThan(0);
      expect(descriptions[0]).toHaveClass('sr-only');
    });
  });

  describe('リセットボタンの動作', () => {
    it('アクティブフィルターが0の場合、リセットボタンが無効になること', () => {
      // Arrange - activeFilterCount=0でレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ activeFilterCount: 0 })}
        />
      );

      // Assert - リセットボタンが無効化されることを確認
      const resetButton = screen.getByText('リセット').closest('button');
      expect(resetButton).toBeDisabled();
    });

    it('アクティブフィルターがある場合、リセットボタンが有効になること', () => {
      // Arrange - activeFilterCount=3でレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ activeFilterCount: 3 })}
        />
      );

      // Assert - リセットボタンが有効化されることを確認
      const resetButton = screen.getByText('リセット').closest('button');
      expect(resetButton).toBeEnabled();
    });

    it('読み込み中の場合、リセットボタンが無効になること', () => {
      // Arrange - isLoading=trueでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            activeFilterCount: 2,
            isLoading: true,
          })}
        />
      );

      // Assert - リセットボタンが無効化されることを確認
      const resetButton = screen.getByText('リセット').closest('button');
      expect(resetButton).toBeDisabled();
    });

    it('リセットボタンクリック時にresetハンドラーが呼ばれること', async () => {
      // Arrange - resetモック関数を準備
      const mockReset = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            activeFilterCount: 2,
            reset: mockReset,
          })}
        />
      );

      // Act - リセットボタンをクリック
      const resetButton = screen.getByText('リセット').closest('button');
      expect(resetButton).toBeTruthy();
      await user.click(resetButton as HTMLButtonElement);

      // Assert - resetが1回呼ばれることを確認
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('適用ボタンの動作', () => {
    it('変更がない場合、適用ボタンが無効になること', () => {
      // Arrange - hasChanges=falseでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: false })}
        />
      );

      // Assert - 適用ボタンが無効化されることを確認
      const applyButton = screen.getByText('絞り込む').closest('button');
      expect(applyButton).toBeDisabled();
    });

    it('変更がある場合、適用ボタンが有効になること', () => {
      // Arrange - hasChanges=trueでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: true })}
        />
      );

      // Assert - 適用ボタンが有効化されることを確認
      const applyButton = screen.getByText('絞り込む').closest('button');
      expect(applyButton).toBeEnabled();
    });

    it('読み込み中の場合、適用ボタンが無効になること', () => {
      // Arrange - isLoading=trueでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            hasChanges: true,
            isLoading: true,
          })}
        />
      );

      // Assert - 適用ボタンが無効化されることを確認
      const applyButton = screen.getByText('絞り込む').closest('button');
      expect(applyButton).toBeDisabled();
    });

    it('適用ボタンクリック時にapplyハンドラーが呼ばれ、パネルが閉じること', async () => {
      // Arrange - applyモック関数とonOpenChangeモック関数を準備
      const mockApply = vi.fn();
      const mockOnOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          queryResult={createMockQueryResult({
            hasChanges: true,
            apply: mockApply,
          })}
        />
      );

      // Act - 適用ボタンをクリック
      const applyButton = screen.getByText('絞り込む').closest('button');
      expect(applyButton).toBeTruthy();
      await user.click(applyButton as HTMLButtonElement);

      // Assert - applyとonOpenChange(false)が呼ばれることを確認
      expect(mockApply).toHaveBeenCalledTimes(1);
      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('変更状態の表示', () => {
    it('変更がない場合、変更メッセージが表示されないこと', () => {
      // Arrange - hasChanges=falseでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: false })}
        />
      );

      // Assert - 変更メッセージが表示されないことを確認
      expect(screen.queryByText(/変更があります/)).not.toBeInTheDocument();
    });

    it('変更がある場合、変更メッセージが表示されること', () => {
      // Arrange - hasChanges=trueでレンダリング
      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: true })}
        />
      );

      // Assert - 変更メッセージが表示されることを確認
      const message = screen.getByText(/変更があります。絞り込むボタンを押して適用してください。/);
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute('role', 'status');
      expect(message).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('外側クリックでの閉じる動作', () => {
    it('パネル外をクリックした場合、onOpenChange(false)が呼ばれること', async () => {
      // Arrange - onOpenChangeモック関数を準備
      const mockOnOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside">Outside</div>
          <FilterPanel
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            queryResult={createMockQueryResult()}
          />
        </div>
      );

      // Act - パネル外の要素をクリック
      const outsideElement = screen.getByTestId('outside');
      await user.click(outsideElement);

      // Assert - onOpenChange(false)が呼ばれることを確認
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('パネル内をクリックした場合、onOpenChangeが呼ばれないこと', async () => {
      // Arrange - onOpenChangeモック関数を準備
      const mockOnOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterPanel
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          queryResult={createMockQueryResult()}
        />
      );

      // Act - パネル内のタイトルをクリック
      const title = screen.getByText('フィルター条件');
      await user.click(title);

      // Assert - onOpenChangeが呼ばれないことを確認
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('パネルの配置とスタイル', () => {
    it('パネルが絶対配置されていること', () => {
      // Arrange - パネルを開いた状態でレンダリング
      render(
        <FilterPanel isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Act - パネルコンテナを取得
      const panel = screen.getByText('フィルター条件').closest('[role="dialog"]');

      // Assert - 絶対配置のスタイルが設定されていることを確認
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass('absolute');
    });
  });
});
