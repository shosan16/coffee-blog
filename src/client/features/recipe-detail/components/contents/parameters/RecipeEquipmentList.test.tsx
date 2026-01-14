import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import type { DetailedEquipmentInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import EquipmentItem from './EquipmentItem';
import RecipeEquipmentList from './RecipeEquipmentList';

// EquipmentItemをモック化してテストの独立性を確保
vi.mock('./EquipmentItem', () => ({
  default: vi.fn(({ item }) => <div data-testid={`equipment-${item.id}`}>{item.name}</div>),
}));

describe('RecipeEquipmentList', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
    // モック関数の呼び出し履歴をリセット
    vi.clearAllMocks();
  });

  describe('基本表示', () => {
    it('タイトルと器具一覧を正しく表示できること', () => {
      // Arrange
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'V60ドリッパー 02',
          brand: 'HARIO',
          equipmentType: {
            id: '1',
            name: 'ドリッパー',
          },
        },
        {
          id: '2',
          name: 'コーヒースケール',
          brand: 'Acaia',
          equipmentType: {
            id: '2',
            name: 'スケール',
          },
        },
      ];

      // Act
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert
      expect(screen.getByText('使用器具')).toBeInTheDocument();
      // モック化されたEquipmentItemにより器具名が表示される
      expect(screen.getByText('V60ドリッパー 02')).toBeInTheDocument();
      expect(screen.getByText('コーヒースケール')).toBeInTheDocument();
    });
  });

  describe('空の状態', () => {
    it('器具が空の場合、適切なメッセージを表示すること', () => {
      // Arrange - 準備：空の器具配列を設定
      const equipment: DetailedEquipmentInfo[] = [];

      // Act - 実行：空の器具リストでレンダリング
      const { container } = render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：空状態のメッセージが表示されることを検証
      expect(container).toHaveTextContent('使用器具');
      expect(container).toHaveTextContent('器具情報が登録されていません');
    });
  });

  describe('レイアウト', () => {
    it('レスポンシブ3カラムグリッドで表示されること', () => {
      // Arrange
      const equipment: DetailedEquipmentInfo[] = [
        { id: '1', name: '器具1', equipmentType: { id: '1', name: 'タイプ1' } },
        { id: '2', name: '器具2', equipmentType: { id: '2', name: 'タイプ2' } },
        { id: '3', name: '器具3', equipmentType: { id: '3', name: 'タイプ3' } },
      ];

      // Act
      const { container } = render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - グリッドクラスが正しく適用されていることを検証
      const grid = container.querySelector('[class*="grid"][class*="grid-cols-1"]');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('各器具に対してEquipmentItemコンポーネントが呼び出されること', () => {
      // Arrange
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'テスト器具1',
          equipmentType: { id: '1', name: 'ドリッパー' },
        },
        {
          id: '2',
          name: 'テスト器具2',
          equipmentType: { id: '2', name: 'グラインダー' },
        },
      ];

      // Act
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - EquipmentItemコンポーネントが各器具に対して呼び出されることを検証
      expect(EquipmentItem).toHaveBeenCalledTimes(2);
      expect(EquipmentItem).toHaveBeenCalledWith({ item: equipment[0] }, expect.anything());
      expect(EquipmentItem).toHaveBeenCalledWith({ item: equipment[1] }, expect.anything());
    });
  });
});
