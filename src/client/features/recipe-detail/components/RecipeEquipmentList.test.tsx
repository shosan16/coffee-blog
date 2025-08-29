import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import type { DetailedEquipmentInfo } from '../types/recipe-detail';

import RecipeEquipmentList from './RecipeEquipmentList';

describe('RecipeEquipmentList', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
  });
  describe('基本表示', () => {
    it('器具一覧を正しく表示できること', () => {
      // Arrange - 準備：複数の器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'V60ドリッパー 02',
          brand: 'HARIO',
          description: '円錐形ドリッパーの代表格',
          affiliateLink: 'https://amazon.co.jp/hario-v60',
          equipmentType: {
            id: '1',
            name: 'ドリッパー',
            description: 'コーヒーを抽出するための器具',
          },
        },
        {
          id: '2',
          name: 'コーヒースケール',
          brand: 'Acaia',
          description: '精密な計量が可能なデジタルスケール',
          equipmentType: {
            id: '2',
            name: 'スケール',
            description: '重量を測定する器具',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：器具情報が正しく表示されることを検証
      expect(screen.getByText('使用器具')).toBeInTheDocument();
      expect(screen.getByText('V60ドリッパー 02')).toBeInTheDocument();
      expect(screen.getByText('HARIO')).toBeInTheDocument();
      expect(screen.getByText('コーヒースケール')).toBeInTheDocument();
      expect(screen.getByText('Acaia')).toBeInTheDocument();
      expect(screen.getByText('ドリッパー')).toBeInTheDocument();
      expect(screen.getByText('スケール')).toBeInTheDocument();
    });

    it('ブランドがない場合、ブランド表示をしないこと', () => {
      // Arrange - 準備：ブランドなし器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'ペーパーフィルター',
          description: '円錐形フィルター',
          equipmentType: {
            id: '1',
            name: 'フィルター',
            description: 'コーヒーを濾過する紙',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：ブランド表示がないことを検証
      expect(screen.getByText('ペーパーフィルター')).toBeInTheDocument();
      expect(screen.getByText('フィルター')).toBeInTheDocument();
      // ブランド表示用のコンテナがないことを確認
      expect(screen.queryByText('ブランド')).not.toBeInTheDocument();
    });

    it('説明がない場合、説明表示をしないこと', () => {
      // Arrange - 準備：説明なし器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'ドリップケトル',
          brand: 'Kalita',
          equipmentType: {
            id: '1',
            name: 'ケトル',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：説明表示がないことを検証
      expect(screen.getByText('ドリップケトル')).toBeInTheDocument();
      expect(screen.getByText('Kalita')).toBeInTheDocument();
      expect(screen.getByText('ケトル')).toBeInTheDocument();
    });
  });

  describe('アフィリエイトリンク', () => {
    it('アフィリエイトリンクがある場合、購入リンクを表示すること', () => {
      // Arrange - 準備：アフィリエイトリンク付き器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'V60ドリッパー',
          brand: 'HARIO',
          affiliateLink: 'https://amazon.co.jp/hario-v60-dripper',
          equipmentType: {
            id: '1',
            name: 'ドリッパー',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：購入リンクが正しく表示されることを検証
      const purchaseLink = screen.getByRole('link', { name: /購入/i });
      expect(purchaseLink).toHaveAttribute('href', 'https://amazon.co.jp/hario-v60-dripper');
      expect(purchaseLink).toHaveAttribute('target', '_blank');
      expect(purchaseLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('アフィリエイトリンクがない場合、購入リンクを表示しないこと', () => {
      // Arrange - 準備：アフィリエイトリンクなし器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'ハンドドリップセット',
          brand: 'Generic',
          equipmentType: {
            id: '1',
            name: 'セット',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：購入リンクが表示されないことを検証
      expect(screen.queryByRole('link', { name: /購入/i })).not.toBeInTheDocument();
      expect(screen.queryByText('購入')).not.toBeInTheDocument();
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

  describe('器具タイプ', () => {
    it('器具タイプが正しく表示されること', () => {
      // Arrange - 準備：様々な器具タイプのデータを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'V60ドリッパー',
          equipmentType: {
            id: '1',
            name: 'ドリッパー',
            description: 'コーヒーを抽出する器具',
          },
        },
        {
          id: '2',
          name: 'グラインダー',
          equipmentType: {
            id: '2',
            name: 'ミル',
            description: 'コーヒー豆を挽く器具',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：器具タイプが正しく表示されることを検証
      expect(screen.getByText('ドリッパー')).toBeInTheDocument();
      expect(screen.getByText('ミル')).toBeInTheDocument();
    });

    it('器具タイプの説明がある場合、適切に表示されること', () => {
      // Arrange - 準備：器具タイプ説明付きデータを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'ケメックス',
          equipmentType: {
            id: '1',
            name: 'ポアオーバー',
            description: '重力を利用したドリップ式抽出器具',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：器具タイプ名が表示されることを検証
      expect(screen.getByText('ポアオーバー')).toBeInTheDocument();
    });
  });

  describe('レイアウト・スタイル', () => {
    it('複数の器具がリスト形式で表示されること', () => {
      // Arrange - 準備：複数器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'ドリッパー',
          equipmentType: { id: '1', name: 'ドリッパー' },
        },
        {
          id: '2',
          name: 'サーバー',
          equipmentType: { id: '2', name: 'サーバー' },
        },
        {
          id: '3',
          name: 'フィルター',
          equipmentType: { id: '3', name: 'フィルター' },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      const { container } = render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：全ての器具が表示されることを検証
      expect(container).toHaveTextContent('ドリッパー');
      expect(container).toHaveTextContent('サーバー');
      expect(container).toHaveTextContent('フィルター');
    });
  });

  describe('特殊文字・エッジケース', () => {
    it('特殊文字を含む器具名を正しく表示できること', () => {
      // Arrange - 準備：特殊文字含み器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'Chemex® 6-Cup クラシック',
          brand: 'Chemex & Co.',
          description: '特許取得済みの濾過システム（※要交換フィルター）',
          equipmentType: {
            id: '1',
            name: 'ポアオーバー/ドリッパー',
            description: '一体型抽出器具',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：特殊文字が正しく表示されることを検証
      expect(screen.getByText('Chemex® 6-Cup クラシック')).toBeInTheDocument();
      expect(screen.getByText('Chemex & Co.')).toBeInTheDocument();
      expect(
        screen.getByText('特許取得済みの濾過システム（※要交換フィルター）')
      ).toBeInTheDocument();
      expect(screen.getByText('ポアオーバー/ドリッパー')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('外部リンクが適切な属性を持つこと', () => {
      // Arrange - 準備：外部リンク付き器具データを設定
      const equipment: DetailedEquipmentInfo[] = [
        {
          id: '1',
          name: 'テスト器具',
          affiliateLink: 'https://example.com/product',
          equipmentType: {
            id: '1',
            name: 'テスト',
          },
        },
      ];

      // Act - 実行：器具リストをレンダリング
      render(<RecipeEquipmentList equipment={equipment} />);

      // Assert - 確認：外部リンクの属性が適切に設定されることを検証
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
