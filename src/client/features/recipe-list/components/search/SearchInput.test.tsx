import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { useRecipeQuery } from '../../hooks/useRecipeQuery';

import SearchInput from './SearchInput';

// モック設定
vi.mock('../../hooks/useRecipeQuery', () => ({
  useRecipeQuery: vi.fn(),
}));

describe('SearchInput', () => {
  const mockUpdateSearchValue = vi.fn();
  const mockApplyChanges = vi.fn();
  const mockClearSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRecipeQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      pendingSearchValue: '',
      setSearchValue: mockUpdateSearchValue,
      apply: mockApplyChanges,
      clearSearch: mockClearSearch,
    });
  });

  afterEach(() => {
    // 各テスト後にDOMを完全にクリーンアップ
    cleanup();
    vi.restoreAllMocks();
  });

  describe('レンダリング', () => {
    it('検索入力フィールドが正しく表示される', () => {
      // Arrange & Act
      render(<SearchInput placeholder="テスト用プレースホルダー" />);

      // Assert - より具体的なセレクターを使用
      const input = screen.getByLabelText('テスト用プレースホルダー');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'テスト用プレースホルダー');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('検索フィールドが正しく表示される', () => {
      // Arrange & Act
      render(<SearchInput placeholder="テスト用プレースホルダー" />);

      // Assert
      const input = screen.getByLabelText('テスト用プレースホルダー');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('検索値がない場合、クリアボタンが表示されない', () => {
      // Arrange & Act
      render(<SearchInput />);

      // Assert
      expect(screen.queryByLabelText('検索をクリア')).not.toBeInTheDocument();
    });

    it('検索値がある場合、クリアボタンが表示される', () => {
      // Arrange
      (useRecipeQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        pendingSearchValue: 'エスプレッソ',
        setSearchValue: mockUpdateSearchValue,
        apply: mockApplyChanges,
        clearSearch: mockClearSearch,
      });

      // Act
      render(<SearchInput />);

      // Assert
      expect(screen.getByLabelText('検索をクリア')).toBeInTheDocument();
    });
  });

  describe('入力操作', () => {
    it('入力値変更時にsetSearchValueが呼ばれる', () => {
      // Arrange
      render(<SearchInput />);
      const input = screen.getByLabelText('レシピを検索...');

      // Act - fireEventで直接入力値変更をシミュレート
      fireEvent.change(input, { target: { value: 'コーヒー' } });

      // Assert
      expect(mockUpdateSearchValue).toHaveBeenCalledWith('コーヒー');
    });

    it('Enterキー押下時にapplyが呼ばれる', () => {
      // Arrange
      render(<SearchInput />);
      const input = screen.getByLabelText('レシピを検索...');

      // Act
      fireEvent.keyDown(input, { key: 'Enter' });

      // Assert
      expect(mockApplyChanges).toHaveBeenCalledTimes(1);
    });

    it('Escapeキー押下時（検索値あり）にsetSearchValueが空文字で呼ばれる', () => {
      // Arrange
      (useRecipeQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        pendingSearchValue: 'ドリップ',
        setSearchValue: mockUpdateSearchValue,
        apply: mockApplyChanges,
        clearSearch: mockClearSearch,
      });
      render(<SearchInput />);
      const input = screen.getByLabelText('レシピを検索...');

      // Act
      fireEvent.keyDown(input, { key: 'Escape' });

      // Assert
      expect(mockUpdateSearchValue).toHaveBeenCalledWith('');
    });

    it('Escapeキー押下時（検索値なし）にsetSearchValueが呼ばれない', () => {
      // Arrange
      render(<SearchInput />);
      const input = screen.getByLabelText('レシピを検索...');

      // Act
      fireEvent.keyDown(input, { key: 'Escape' });

      // Assert
      expect(mockUpdateSearchValue).not.toHaveBeenCalled();
    });
  });

  describe('クリアボタン', () => {
    it('クリアボタンクリック時にclearSearchが呼ばれる', () => {
      // Arrange
      (useRecipeQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        pendingSearchValue: 'フレンチプレス',
        setSearchValue: mockUpdateSearchValue,
        apply: mockApplyChanges,
        clearSearch: mockClearSearch,
      });
      render(<SearchInput />);
      const clearButton = screen.getByLabelText('検索をクリア');

      // Act - fireEventで直接クリックをシミュレート
      fireEvent.click(clearButton);

      // Assert
      expect(mockClearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-labelが適切に設定される', () => {
      // Arrange & Act
      render(<SearchInput aria-label="カスタムラベル" />);

      // Assert
      expect(screen.getByLabelText('カスタムラベル')).toBeInTheDocument();
    });

    it('aria-labelが未指定時はplaceholderが使用される', () => {
      // Arrange & Act
      render(<SearchInput placeholder="デフォルトプレースホルダー" />);

      // Assert
      expect(screen.getByLabelText('デフォルトプレースホルダー')).toBeInTheDocument();
    });
  });
});
