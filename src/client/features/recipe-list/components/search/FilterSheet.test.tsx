import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import FilterSheet from '@/client/features/recipe-list/components/search/FilterSheet';
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

describe('FilterSheet', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('基本的な表示', () => {
    it('シートが閉じている場合、コンテンツが表示されないこと', () => {
      // Arrange - isOpen=falseでレンダリング
      render(
        <FilterSheet isOpen={false} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Assert - シートのコンテンツが表示されないことを確認
      expect(screen.queryByText('フィルター条件')).not.toBeInTheDocument();
    });

    it('シートが開いている場合、コンテンツが表示されること', () => {
      // Arrange - isOpen=trueでレンダリング
      render(
        <FilterSheet isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Assert - シートのコンテンツが表示されることを確認
      expect(screen.getByText('フィルター条件')).toBeInTheDocument();
      expect(screen.getByText('リセット')).toBeInTheDocument();
      expect(screen.getByText('絞り込む')).toBeInTheDocument();
    });

    it('フィルター説明がスクリーンリーダー向けに適切に設定されること', () => {
      // Arrange - シートを開いた状態でレンダリング
      render(
        <FilterSheet isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
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
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ activeFilterCount: 0 })}
        />
      );

      // Assert - リセットボタンが無効化されることを確認
      const resetButtons = screen.getAllByText('リセット');
      const resetButton = resetButtons[0].closest('button');
      expect(resetButton).toBeDisabled();
    });

    it('アクティブフィルターがある場合、リセットボタンが有効になること', () => {
      // Arrange - activeFilterCount=3でレンダリング
      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ activeFilterCount: 3 })}
        />
      );

      // Assert - リセットボタンが有効化されることを確認
      const resetButtons = screen.getAllByText('リセット');
      const resetButton = resetButtons[0].closest('button');
      expect(resetButton).toBeEnabled();
    });

    it('読み込み中の場合、リセットボタンが無効になること', () => {
      // Arrange - isLoading=trueでレンダリング
      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            activeFilterCount: 2,
            isLoading: true,
          })}
        />
      );

      // Assert - リセットボタンが無効化されることを確認
      const resetButtons = screen.getAllByText('リセット');
      const resetButton = resetButtons[0].closest('button');
      expect(resetButton).toBeDisabled();
    });

    it('リセットボタンクリック時にresetハンドラーが呼ばれること', async () => {
      // Arrange - resetモック関数を準備
      const mockReset = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            activeFilterCount: 2,
            reset: mockReset,
          })}
        />
      );

      // Act - リセットボタンをクリック
      const resetButtons = screen.getAllByText('リセット');
      const resetButton = resetButtons[0].closest('button');
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
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: false })}
        />
      );

      // Assert - 適用ボタンが無効化されることを確認
      const applyButtons = screen.getAllByText('絞り込む');
      const applyButton = applyButtons[0].closest('button');
      expect(applyButton).toBeDisabled();
    });

    it('変更がある場合、適用ボタンが有効になること', () => {
      // Arrange - hasChanges=trueでレンダリング
      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({ hasChanges: true })}
        />
      );

      // Assert - 適用ボタンが有効化されることを確認
      const applyButtons = screen.getAllByText('絞り込む');
      const applyButton = applyButtons[0].closest('button');
      expect(applyButton).toBeEnabled();
    });

    it('読み込み中の場合、適用ボタンが無効になること', () => {
      // Arrange - isLoading=trueでレンダリング
      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            hasChanges: true,
            isLoading: true,
          })}
        />
      );

      // Assert - 適用ボタンが無効化されることを確認
      const applyButtons = screen.getAllByText('絞り込む');
      const applyButton = applyButtons[0].closest('button');
      expect(applyButton).toBeDisabled();
    });

    it('適用ボタンクリック時にapplyハンドラーが呼ばれること', async () => {
      // Arrange - applyモック関数を準備
      const mockApply = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={vi.fn()}
          queryResult={createMockQueryResult({
            hasChanges: true,
            apply: mockApply,
          })}
        />
      );

      // Act - 適用ボタンをクリック
      const applyButtons = screen.getAllByText('絞り込む');
      const applyButton = applyButtons[0].closest('button');
      expect(applyButton).toBeTruthy();
      await user.click(applyButton as HTMLButtonElement);

      // Assert - applyが1回呼ばれることを確認
      expect(mockApply).toHaveBeenCalledTimes(1);
    });
  });

  describe('変更状態の表示', () => {
    it('変更がない場合、変更メッセージが表示されないこと', () => {
      // Arrange - hasChanges=falseでレンダリング
      render(
        <FilterSheet
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
        <FilterSheet
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

  describe('シート開閉の制御', () => {
    it('onOpenChangeハンドラーが適切に設定されること', () => {
      // Arrange - onOpenChangeモック関数を準備
      const mockOnOpenChange = vi.fn();

      render(
        <FilterSheet
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          queryResult={createMockQueryResult()}
        />
      );

      // Assert - Sheetコンポーネントが正しくレンダリングされることを確認
      // （Sheetの内部実装の詳細なテストは shadcn/ui に任せる）
      expect(screen.getByText('フィルター条件')).toBeInTheDocument();
    });
  });

  describe('フォーカス管理', () => {
    it('シートが開いた時、フォーカス管理用のラッパーdivにtabIndex=-1が設定されていること', () => {
      // Arrange - シートを開いた状態でレンダリング
      render(
        <FilterSheet isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Act - フォーカス管理用のラッパーdivを取得
      const focusWrapper = document.querySelector('.outline-none[tabindex="-1"]');

      // Assert - tabIndex=-1が設定されていることを確認
      // これにより、プログラム的にフォーカス可能だが、タブ順序には含まれない
      expect(focusWrapper).toBeInTheDocument();
      expect(focusWrapper).toHaveAttribute('tabIndex', '-1');
      expect(focusWrapper).toHaveClass('outline-none');
    });

    it('aria-describedby属性が適切に設定されていること', () => {
      // Arrange - シートを開いた状態でレンダリング
      render(
        <FilterSheet isOpen={true} onOpenChange={vi.fn()} queryResult={createMockQueryResult()} />
      );

      // Act - SheetContentとdescription要素を取得
      const sheetContent = document.querySelector('[data-slot="sheet-content"]');
      const description = document.getElementById('filter-description');

      // Assert - アクセシビリティ属性が適切に設定されていることを確認
      expect(sheetContent).toHaveAttribute('aria-describedby', 'filter-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });
  });
});
