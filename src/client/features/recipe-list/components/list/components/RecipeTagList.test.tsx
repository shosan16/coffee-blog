import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';

import RecipeTagList from './RecipeTagList';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

/**
 * テスト用のタグ情報を生成するヘルパー関数
 */
const createTag = (id: string, name: string) => ({ id, name });

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
      const tags = [
        createTag('1', 'フルーティ'),
        createTag('2', '酸味強め'),
        createTag('3', 'シングルオリジン'),
      ];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.getByText('フルーティ')).toBeInTheDocument();
      expect(screen.getByText('酸味強め')).toBeInTheDocument();
      expect(screen.getByText('シングルオリジン')).toBeInTheDocument();
    });

    it('「他N件」ボタンが表示されない', () => {
      // Arrange
      const tags = [createTag('1', 'タグ1'), createTag('2', 'タグ2'), createTag('3', 'タグ3')];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.queryByText(/他\d+件/)).not.toBeInTheDocument();
    });
  });

  describe('タグが最大表示数を超える場合', () => {
    it('「他N件」ボタンが表示される', () => {
      // Arrange
      const tags = [
        createTag('1', 'タグ1'),
        createTag('2', 'タグ2'),
        createTag('3', 'タグ3'),
        createTag('4', 'タグ4'),
        createTag('5', 'タグ5'),
        createTag('6', 'タグ6'),
        createTag('7', 'タグ7'),
        createTag('8', 'タグ8'),
      ];

      // Act
      render(<RecipeTagList tags={tags} maxVisible={6} />);

      // Assert
      expect(screen.getByText('他2件')).toBeInTheDocument();
    });

    it('オーバーフローしたタグは直接表示されない', () => {
      // Arrange
      const tags = [
        createTag('1', 'タグ1'),
        createTag('2', 'タグ2'),
        createTag('3', 'タグ3'),
        createTag('4', 'タグ4'),
        createTag('5', 'タグ5'),
        createTag('6', 'タグ6'),
        createTag('7', 'タグ7'),
      ];

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
    it('タグIDでフィルターURLにナビゲートする', () => {
      // Arrange
      const tags = [createTag('tag-123', 'フルーティ'), createTag('tag-456', '酸味強め')];

      // Act
      render(<RecipeTagList tags={tags} />);
      const tagButton = screen.getByText('フルーティ');
      fireEvent.click(tagButton);

      // Assert - タグIDでナビゲートされる
      expect(mockPush).toHaveBeenCalledWith('/?tags=tag-123');
    });

    it('クリックしたタグのIDが正しくURLに設定される', () => {
      // Arrange
      const tags = [createTag('1', 'タグA'), createTag('2', 'タグB'), createTag('3', 'タグC')];

      // Act
      render(<RecipeTagList tags={tags} />);
      const tagButton = screen.getByText('タグB');
      fireEvent.click(tagButton);

      // Assert - タグBのIDである'2'でナビゲートされる
      expect(mockPush).toHaveBeenCalledWith('/?tags=2');
    });
  });

  describe('タグが空の場合', () => {
    it('何も表示されない', () => {
      // Arrange
      const tags: Array<{ id: string; name: string }> = [];

      // Act
      const { container } = render(<RecipeTagList tags={tags} />);

      // Assert
      expect(container.firstChild).toBeNull();
    });
  });

  describe('アクセシビリティ', () => {
    it('タグボタンに適切なaria-labelが設定されている', () => {
      // Arrange
      const tags = [createTag('1', 'フルーティ')];

      // Act
      render(<RecipeTagList tags={tags} />);

      // Assert
      expect(screen.getByRole('button', { name: 'フルーティでフィルター' })).toBeInTheDocument();
    });
  });
});
