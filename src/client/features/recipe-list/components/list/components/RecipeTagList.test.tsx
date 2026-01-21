import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';

import RecipeTagList from './RecipeTagList';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('RecipeTagList', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('タグが最大表示数以内の場合', () => {
    it('全タグが表示される', () => {
      // Arrange
      const tags = ['フルーティ', '酸味強め', 'シングルオリジン'];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.getByText('フルーティ')).toBeInTheDocument();
      expect(screen.getByText('酸味強め')).toBeInTheDocument();
      expect(screen.getByText('シングルオリジン')).toBeInTheDocument();
    });

    it('「他N件」ボタンが表示されない', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3'];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.queryByText(/他\d+件/)).not.toBeInTheDocument();
    });
  });

  describe('タグが最大表示数を超える場合', () => {
    it('「他N件」ボタンが表示される', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5', 'タグ6', 'タグ7', 'タグ8'];

      // Act
      render(<RecipeTagList tags={tags} maxVisible={6} />);

      // Assert
      expect(screen.getByText('他2件')).toBeInTheDocument();
    });

    it('オーバーフローしたタグは直接表示されない', () => {
      // Arrange
      const tags = ['タグ1', 'タグ2', 'タグ3', 'タグ4', 'タグ5', 'タグ6', 'タグ7'];

      // Act
      render(<RecipeTagList tags={tags} maxVisible={6} />);

      // Assert - 最初の6つのタグが表示され、タグ7は直接表示されない
      expect(screen.getByText('タグ1')).toBeInTheDocument();
      expect(screen.getByText('タグ6')).toBeInTheDocument();
      // タグ7はポップオーバー内にあるため、aria-labelで探しても見つからない
      expect(screen.queryByRole('button', { name: 'タグ7でフィルター' })).not.toBeInTheDocument();
    });
  });

  describe('タグクリック時', () => {
    it('正しいURLにナビゲートする', () => {
      // Arrange
      const tags = ['フルーティ', '酸味強め'];

      // Act
      render(<RecipeTagList tags={tags} />);
      const tagButton = screen.getByText('フルーティ');
      fireEvent.click(tagButton);

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/?tags=%E3%83%95%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3');
    });

    it('タグクリック時に正しいタグ名でフィルターURLにナビゲートする', () => {
      // Arrange
      const tags = ['タグA', 'タグB', 'タグC'];

      // Act
      render(<RecipeTagList tags={tags} />);
      const tagButton = screen.getByText('タグB');
      fireEvent.click(tagButton);

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/?tags=%E3%82%BF%E3%82%B0B');
    });
  });

  describe('タグが空の場合', () => {
    it('何も表示されない', () => {
      // Arrange
      const tags: string[] = [];

      // Act
      const { container } = render(<RecipeTagList tags={tags} />);

      // Assert
      expect(container.firstChild).toBeNull();
    });
  });

  describe('アクセシビリティ', () => {
    it('タグボタンに適切なaria-labelが設定されている', () => {
      // Arrange
      const tags = ['フルーティ'];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.getByRole('button', { name: 'フルーティでフィルター' })).toBeInTheDocument();
    });
  });
});
