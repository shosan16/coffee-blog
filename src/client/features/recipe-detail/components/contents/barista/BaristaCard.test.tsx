import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import type { BaristaInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import BaristaCard from './BaristaCard';

describe('BaristaCard', () => {
  afterEach(() => {
    cleanup();
  });
  describe('基本表示', () => {
    it('バリスタ名とアバターアイコンが正しく表示されること', () => {
      // Arrange - バリスタ情報を準備
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        affiliation: 'カフェ・ドゥ・ラ・ペ',
        socialLinks: [],
      };

      // Act - BaristaCardをレンダリング
      render(<BaristaCard barista={barista} />);

      // Assert - 名前と所属が表示されることを確認
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      expect(screen.getByText('カフェ・ドゥ・ラ・ペ')).toBeInTheDocument();
    });

    it('所属がない場合、所属情報を表示しないこと', () => {
      // Arrange - 所属なしのバリスタ
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [],
      };

      // Act
      render(<BaristaCard barista={barista} />);

      // Assert - 名前のみ表示され、所属情報が表示されないことを確認
      expect(screen.getByText('田中太郎')).toBeInTheDocument();
      // affiliationは表示されないため、カフェという文字列は存在しない
      expect(screen.queryByText(/カフェ/)).not.toBeInTheDocument();
    });
  });

  describe('アコーディオン動作', () => {
    it('初期状態ではコンテンツが閉じていること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [{ id: 'twitter-1', platform: 'Twitter', url: 'https://twitter.com/test' }],
      };

      // Act
      render(<BaristaCard barista={barista} />);

      // Assert - 初期状態でmax-h-0が適用されていることを確認
      const content = screen.getByRole('region');
      expect(content).toHaveClass('max-h-0');
    });

    it('トグルボタンクリックでコンテンツが開閉すること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [{ id: 'twitter-1', platform: 'Twitter', url: 'https://twitter.com/test' }],
      };
      render(<BaristaCard barista={barista} />);

      // Act - トグルボタンをクリック
      const toggleButton = screen.getByRole('button', { name: /バリスタ情報/ });
      fireEvent.click(toggleButton);

      // Assert - コンテンツが開くことを確認
      const content = screen.getByRole('region');
      expect(content).toHaveClass('max-h-32');
      expect(content).not.toHaveClass('max-h-0');

      // Act - 再度クリック
      fireEvent.click(toggleButton);

      // Assert - コンテンツが閉じることを確認
      expect(content).toHaveClass('max-h-0');
      expect(content).not.toHaveClass('max-h-32');
    });

    it('開閉時にシェブロンアイコンが回転すること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [{ id: 'twitter-1', platform: 'Twitter', url: 'https://twitter.com/test' }],
      };
      render(<BaristaCard barista={barista} />);

      // Act - トグルボタンを取得し、シェブロンアイコンの初期状態を確認
      const toggleButton = screen.getByRole('button', { name: /バリスタ情報/ });
      const chevron = screen.getByTestId('chevron-icon');

      expect(chevron).not.toHaveClass('rotate-180');

      // Act - トグルボタンをクリック
      fireEvent.click(toggleButton);

      // Assert - 開いた状態でrotate-180が適用される
      expect(chevron).toHaveClass('rotate-180');

      // Act - 再度クリック
      fireEvent.click(toggleButton);

      // Assert - 閉じた状態でrotate-180が解除される
      expect(chevron).not.toHaveClass('rotate-180');
    });
  });

  describe('SNSリンク表示', () => {
    it('SNSリンクが複数ある場合、すべて正しく表示できること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [
          { id: 'twitter-1', platform: 'Twitter', url: 'https://twitter.com/test' },
          { id: 'instagram-1', platform: 'Instagram', url: 'https://instagram.com/test' },
        ],
      };
      render(<BaristaCard barista={barista} />);

      // Act - アコーディオンを開く
      fireEvent.click(screen.getByRole('button'));

      // Assert - 両方のSNSリンクが表示される
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://twitter.com/test');
      expect(links[0]).toHaveAttribute('target', '_blank');
      expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
      expect(links[0]).toHaveTextContent('Twitter');
      expect(links[1]).toHaveAttribute('href', 'https://instagram.com/test');
      expect(links[1]).toHaveTextContent('Instagram');
    });

    // eslint-disable-next-line sonarjs/assertions-in-tests
    it('SNSリンクがない場合、リンクセクションを表示しないこと', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [],
      };
      render(<BaristaCard barista={barista} />);

      // Act - アコーディオンを開く
      fireEvent.click(screen.getByRole('button'));

      // Assert - リンクが表示されない
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIA属性が設定されていること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [{ id: 'twitter-1', platform: 'Twitter', url: 'https://twitter.com/test' }],
      };
      render(<BaristaCard barista={barista} />);

      // Assert - ARIA属性の検証
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', 'barista-details');

      // Act - 開く
      fireEvent.click(button);

      // Assert - aria-expandedがtrueに変わる
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('アコーディオンコンテンツに適切なrole属性が設定されていること', () => {
      // Arrange
      const barista: BaristaInfo = {
        id: 'barista-1',
        name: '田中太郎',
        socialLinks: [],
      };
      render(<BaristaCard barista={barista} />);

      // Assert - region roleが設定されていることを確認
      const content = screen.getByRole('region');
      expect(content).toHaveAttribute('id', 'barista-details');
      expect(content).toHaveAttribute('aria-labelledby', 'barista-toggle-button');
    });
  });
});
