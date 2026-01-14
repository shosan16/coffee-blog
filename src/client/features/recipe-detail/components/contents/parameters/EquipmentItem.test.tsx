import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import type { DetailedEquipmentInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import EquipmentItem from './EquipmentItem';

describe('EquipmentItem', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
  });

  describe('基本表示', () => {
    it('カテゴリーと器具名が正しく表示されること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'V60ドリッパー 02',
        description: '円錐形ドリッパーの代表格',
        equipmentType: {
          id: '1',
          name: 'ドリッパー',
          description: 'コーヒーを抽出するための器具',
        },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      expect(screen.getByText('ドリッパー')).toBeInTheDocument();
      expect(screen.getByText('V60ドリッパー 02')).toBeInTheDocument();
    });
  });

  describe('レイアウト', () => {
    it('縦配置（flex-col）であること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'テスト器具',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      const { container } = render(<EquipmentItem item={item} />);

      // Assert
      const itemContainer = container.querySelector('[class*="flex"][class*="flex-col"]');
      expect(itemContainer).toBeInTheDocument();
    });

    it('要素の順序が正しいこと（カテゴリー→器具名）', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'V60ドリッパー',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      const { container } = render(<EquipmentItem item={item} />);

      // Assert - DOMツリーの順序を確認
      const textContent = container.textContent || '';
      const categoryIndex = textContent.indexOf('ドリッパー');
      const nameIndex = textContent.indexOf('V60ドリッパー');

      expect(categoryIndex).toBeLessThan(nameIndex);
    });
  });

  describe('アフィリエイトリンク', () => {
    it('アフィリエイトリンクがある場合、aタグで表示されること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'V60ドリッパー',
        affiliateLink: 'https://amazon.co.jp/hario-v60-dripper',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      const link = screen.getByRole('link', { name: /V60ドリッパー/i });
      expect(link).toHaveAttribute('href', 'https://amazon.co.jp/hario-v60-dripper');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('アフィリエイトリンクがない場合、divとして表示されること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'ハンドドリップセット',
        equipmentType: { id: '1', name: 'セット' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByText('ハンドドリップセット')).toBeInTheDocument();
    });

    it('不正なURLのアフィリエイトリンクでも正しく表示されること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: '器具',
        affiliateLink: 'invalid-url',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'invalid-url');
    });
  });

  describe('アクセシビリティ', () => {
    it('アフィリエイトリンクに適切なaria-labelが設定されていること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'V60ドリッパー',
        affiliateLink: 'https://example.com',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'V60ドリッパーの購入リンク');
    });

    it('リンクなしアイテムに適切なrole属性が設定されていること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'テスト器具',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      const { container } = render(<EquipmentItem item={item} />);

      // Assert
      const article = container.querySelector('[role="article"]');
      expect(article).toHaveAttribute('aria-label', 'テスト器具の情報');
    });

    it('キーボード操作でリンクにフォーカスできること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: '器具',
        affiliateLink: 'https://example.com',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);
      const link = screen.getByRole('link');

      // Assert
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe('ホバーエフェクト', () => {
    it('ホバー時のトランジション効果が適用されていること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: '器具',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      const { container } = render(<EquipmentItem item={item} />);

      // Assert
      const itemElement = container.querySelector('[class*="transition-all"]');
      expect(itemElement).toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('器具名が非常に長い場合、適切に表示されること', () => {
      // Arrange
      const longName =
        'これは非常に長い器具名でテキストオーバーフローをテストするためのものです。'.repeat(3);
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: longName,
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('特殊文字を含む器具名を正しく表示できること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'Chemex® 6-Cup <クラシック>',
        equipmentType: { id: '1', name: 'ポアオーバー/ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      expect(screen.getByText('Chemex® 6-Cup <クラシック>')).toBeInTheDocument();
    });

    it('絵文字が含まれる器具名を正しく表示できること', () => {
      // Arrange
      const item: DetailedEquipmentInfo = {
        id: '1',
        name: 'コーヒー☕ドリッパー',
        equipmentType: { id: '1', name: 'ドリッパー' },
      };

      // Act
      render(<EquipmentItem item={item} />);

      // Assert
      expect(screen.getByText('コーヒー☕ドリッパー')).toBeInTheDocument();
    });
  });
});
