import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import PreparationPointsCard, { type PreparationPointsCardProps } from './PreparationPointsCard';

describe('PreparationPointsCard', () => {
  const mockRemarks =
    'ドリッパーとサーバーを予熱しておく\n豆を計量し、必要な分量の水を沸騰させる\nフィルターをセットし、軽く湯通しする';

  describe('備考が存在する場合', () => {
    it('準備ポイントカードが表示されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      render(<PreparationPointsCard {...props} />);

      // Assert
      expect(screen.getByText('ポイント')).toBeInTheDocument();
    });

    it('改行区切りの備考がリスト形式で表示されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const preparationPointsList = container.querySelector('.space-y-2');
      const pointElements = preparationPointsList?.querySelectorAll('li');
      expect(pointElements).toHaveLength(3);

      expect(container.textContent).toContain('ドリッパーとサーバーを予熱しておく');
      expect(container.textContent).toContain('豆を計量し、必要な分量の水を沸騰させる');
      expect(container.textContent).toContain('フィルターをセットし、軽く湯通しする');
    });

    it('単一行の備考も正しく表示されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: '単一行の注意事項',
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const preparationPointsList = container.querySelector('.space-y-2');
      const pointElements = preparationPointsList?.querySelectorAll('li');
      expect(pointElements).toHaveLength(1);
      expect(container.textContent).toContain('単一行の注意事項');
    });

    it('空行を除いてリスト化されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: 'ポイント1\n\n\nポイント2\n  \nポイント3',
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const preparationPointsList = container.querySelector('.space-y-2');
      const pointElements = preparationPointsList?.querySelectorAll('li');
      expect(pointElements).toHaveLength(3);
    });
  });

  describe('備考が存在しない場合', () => {
    it('備考が空文字列の場合は何も表示されないこと', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: '',
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('備考がundefinedの場合は何も表示されないこと', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: undefined,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      expect(container.firstChild).toBeNull();
    });
  });

  describe('デザインとアクセシビリティ', () => {
    it('準備ポイントがセマンティックなリスト構造で表示されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
    });

    it('regionロールとaria-labelledbyでセクションが適切にラベル付けされること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const region = container.querySelector(
        '[role="region"][aria-labelledby="preparation-points-title"]'
      );
      expect(region).toBeInTheDocument();

      const title = container.querySelector('#preparation-points-title');
      expect(title).toHaveTextContent('ポイント');
    });

    it('Lightbulbアイコンが表示されること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      // LucideのLightbulbアイコンがSVGとして描画されることを確認
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveClass('lucide');
    });

    it('amberテーマのスタイルが適用されていること', () => {
      // Arrange
      const props: PreparationPointsCardProps = {
        remarks: mockRemarks,
      };

      // Act
      const { container } = render(<PreparationPointsCard {...props} />);

      // Assert
      const card = container.querySelector('.border-amber-200.bg-amber-50');
      expect(card).toBeInTheDocument();
    });
  });
});
