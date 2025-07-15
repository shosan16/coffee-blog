import { describe, it, expect, beforeEach } from 'vitest';
import { ZodError } from 'zod';

import { Equipment, type EquipmentType } from './Equipment.entity';

describe('Equipment Entity', () => {
  // テスト用の共通データ
  let testEquipmentType: EquipmentType;

  beforeEach(() => {
    // Arrange - 各テストで使用する共通データを準備
    testEquipmentType = {
      id: 'type-1',
      name: 'ドリッパー',
      description: 'コーヒーを抽出するための器具',
    };
  });

  describe('create()', () => {
    describe('正常系', () => {
      it('有効なパラメータで器具を作成できること', () => {
        // Arrange - 器具作成パラメータを準備
        const params = {
          id: 'equipment-1',
          name: 'V60ドリッパー',
          brand: 'Hario',
          description: 'ハリオのV60ドリッパー',
          affiliateLink: 'https://example.com/v60',
          isAvailable: true,
        };

        // Act - 器具を作成
        const equipment = Equipment.create(params, testEquipmentType);

        // Assert - 作成された器具の状態を確認
        expect(equipment.id).toBe('equipment-1');
        expect(equipment.name).toBe('V60ドリッパー');
        expect(equipment.brand).toBe('Hario');
        expect(equipment.description).toBe('ハリオのV60ドリッパー');
        expect(equipment.affiliateLink).toBe('https://example.com/v60');
        expect(equipment.equipmentType).toEqual(testEquipmentType);
        expect(equipment.isAvailable).toBe(true);
        expect(equipment.createdAt).toBeInstanceOf(Date);
        expect(equipment.updatedAt).toBeInstanceOf(Date);
      });

      it('オプションパラメータを省略して器具を作成できること', () => {
        // Arrange - 最小限のパラメータを準備
        const params = {
          id: 'equipment-2',
          name: 'シンプルドリッパー',
        };

        // Act - 器具を作成
        const equipment = Equipment.create(params, testEquipmentType);

        // Assert - 作成された器具の状態を確認
        expect(equipment.id).toBe('equipment-2');
        expect(equipment.name).toBe('シンプルドリッパー');
        expect(equipment.brand).toBeUndefined();
        expect(equipment.description).toBeUndefined();
        expect(equipment.affiliateLink).toBeUndefined();
        expect(equipment.equipmentType).toEqual(testEquipmentType);
        expect(equipment.isAvailable).toBe(true); // デフォルトはtrue
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 前後に空白があるパラメータを準備
        const params = {
          id: 'equipment-3',
          name: '  空白付き器具名  ',
          brand: '  空白付きブランド  ',
          description: '  空白付き説明  ',
        };

        // Act - 器具を作成
        const equipment = Equipment.create(params, testEquipmentType);

        // Assert - 空白が除去されることを確認
        expect(equipment.name).toBe('空白付き器具名');
        expect(equipment.brand).toBe('空白付きブランド');
        expect(equipment.description).toBe('空白付き説明');
      });

      it('isAvailableがfalseで作成できること', () => {
        // Arrange - isAvailableがfalseのパラメータを準備
        const params = {
          id: 'equipment-4',
          name: '利用不可器具',
          isAvailable: false,
        };

        // Act - 器具を作成
        const equipment = Equipment.create(params, testEquipmentType);

        // Assert - 利用不可状態で作成されることを確認
        expect(equipment.isAvailable).toBe(false);
      });
    });

    describe('異常系', () => {
      it('空のIDでエラーが発生すること', () => {
        // Arrange - 無効なIDを持つパラメータを準備
        const params = {
          id: '',
          name: 'テスト器具',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('空の名前でエラーが発生すること', () => {
        // Arrange - 無効な名前を持つパラメータを準備
        const params = {
          id: 'equipment-1',
          name: '',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('空白のみの名前でエラーが発生すること', () => {
        // Arrange - 空白のみの名前を持つパラメータを準備
        const params = {
          id: 'equipment-1',
          name: '   ',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('長すぎる名前でエラーが発生すること', () => {
        // Arrange - 201文字の名前を準備
        const longName = 'a'.repeat(201);
        const params = {
          id: 'equipment-1',
          name: longName,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('長すぎるブランドでエラーが発生すること', () => {
        // Arrange - 101文字のブランドを準備
        const longBrand = 'a'.repeat(101);
        const params = {
          id: 'equipment-1',
          name: 'テスト器具',
          brand: longBrand,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('長すぎる説明でエラーが発生すること', () => {
        // Arrange - 1001文字の説明を準備
        const longDescription = 'a'.repeat(1001);
        const params = {
          id: 'equipment-1',
          name: 'テスト器具',
          description: longDescription,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('無効なアフィリエイトリンクでエラーが発生すること', () => {
        // Arrange - 無効なURLを持つパラメータを準備
        const params = {
          id: 'equipment-1',
          name: 'テスト器具',
          affiliateLink: 'invalid-url',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('長すぎるアフィリエイトリンクでエラーが発生すること', () => {
        // Arrange - 501文字のURLを準備（500文字制限を超える）
        const longUrl = `https://example.com/${'a'.repeat(482)}`; // 合計501文字
        const params = {
          id: 'equipment-1',
          name: 'テスト器具',
          affiliateLink: longUrl,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('無効な器具タイプでエラーが発生すること', () => {
        // Arrange - 無効な器具タイプを準備
        const invalidType: EquipmentType = {
          id: '',
          name: 'テストタイプ',
        };

        const params = {
          id: 'equipment-1',
          name: 'テスト器具',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Equipment.create(params, invalidType)).toThrow(ZodError);
      });
    });
  });

  describe('reconstruct()', () => {
    it('既存データから器具を再構築できること', () => {
      // Arrange - 再構築用のデータを準備
      const data = {
        id: 'equipment-1',
        name: '再構築器具',
        brand: '再構築ブランド',
        description: '再構築用の説明',
        affiliateLink: 'https://example.com/reconstruct',
        equipmentType: testEquipmentType,
        isAvailable: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      };

      // Act - 器具を再構築
      const equipment = Equipment.reconstruct(data);

      // Assert - 再構築された器具の状態を確認
      expect(equipment.id).toBe('equipment-1');
      expect(equipment.name).toBe('再構築器具');
      expect(equipment.brand).toBe('再構築ブランド');
      expect(equipment.description).toBe('再構築用の説明');
      expect(equipment.affiliateLink).toBe('https://example.com/reconstruct');
      expect(equipment.equipmentType).toEqual(testEquipmentType);
      expect(equipment.isAvailable).toBe(false);
      expect(equipment.createdAt).toEqual(new Date('2024-01-01'));
      expect(equipment.updatedAt).toEqual(new Date('2024-12-01'));
    });

    it('オプションフィールドなしで再構築できること', () => {
      // Arrange - オプションフィールドなしのデータを準備
      const data = {
        id: 'equipment-2',
        name: 'シンプル器具',
        equipmentType: testEquipmentType,
        isAvailable: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      };

      // Act - 器具を再構築
      const equipment = Equipment.reconstruct(data);

      // Assert - 再構築された器具の状態を確認
      expect(equipment.id).toBe('equipment-2');
      expect(equipment.name).toBe('シンプル器具');
      expect(equipment.brand).toBeUndefined();
      expect(equipment.description).toBeUndefined();
      expect(equipment.affiliateLink).toBeUndefined();
      expect(equipment.equipmentType).toEqual(testEquipmentType);
      expect(equipment.isAvailable).toBe(true);
    });
  });

  describe('updateName()', () => {
    describe('正常系', () => {
      it('有効な名前で更新できること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: '元の名前',
          },
          testEquipmentType
        );

        // Act - 名前を更新
        equipment.updateName('新しい名前');

        // Assert - 名前が更新され、更新日時も変更されることを確認
        expect(equipment.name).toBe('新しい名前');
        expect(equipment.updatedAt).toBeInstanceOf(Date);
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: '元の名前',
          },
          testEquipmentType
        );

        // Act - 前後に空白がある名前で更新
        equipment.updateName('  空白付き名前  ');

        // Assert - 空白が除去されることを確認
        expect(equipment.name).toBe('空白付き名前');
      });
    });

    describe('異常系', () => {
      it('空の名前でエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: '元の名前',
          },
          testEquipmentType
        );

        // Act & Assert - 空名前でエラーが発生することを確認
        expect(() => equipment.updateName('')).toThrow(ZodError);
      });

      it('長すぎる名前でエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: '元の名前',
          },
          testEquipmentType
        );

        // Act & Assert - 201文字の名前でエラーが発生することを確認
        const longName = 'a'.repeat(201);
        expect(() => equipment.updateName(longName)).toThrow(ZodError);
      });

      it('空白のみの名前でエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: '元の名前',
          },
          testEquipmentType
        );

        // Act & Assert - 空白のみでエラーが発生することを確認
        expect(() => equipment.updateName('   ')).toThrow(ZodError);
      });
    });
  });

  describe('updateBrand()', () => {
    describe('正常系', () => {
      it('有効なブランドで更新できること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            brand: '元のブランド',
          },
          testEquipmentType
        );

        // Act - ブランドを更新
        equipment.updateBrand('新しいブランド');

        // Assert - ブランドが更新され、更新日時も変更されることを確認
        expect(equipment.brand).toBe('新しいブランド');
        expect(equipment.updatedAt).toBeInstanceOf(Date);
      });

      it('ブランドをundefinedで削除できること', () => {
        // Arrange - ブランドがある器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            brand: '削除されるブランド',
          },
          testEquipmentType
        );

        // Act - ブランドをundefinedで更新（削除）
        equipment.updateBrand();

        // Assert - ブランドが削除されることを確認
        expect(equipment.brand).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act - 前後に空白があるブランドで更新
        equipment.updateBrand('  空白付きブランド  ');

        // Assert - 空白が除去されることを確認
        expect(equipment.brand).toBe('空白付きブランド');
      });
    });

    describe('異常系', () => {
      it('長すぎるブランドでエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act & Assert - 101文字のブランドでエラーが発生することを確認
        const longBrand = 'a'.repeat(101);
        expect(() => equipment.updateBrand(longBrand)).toThrow(ZodError);
      });
    });
  });

  describe('updateDescription()', () => {
    describe('正常系', () => {
      it('有効な説明で更新できること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            description: '元の説明',
          },
          testEquipmentType
        );

        // Act - 説明を更新
        equipment.updateDescription('新しい説明');

        // Assert - 説明が更新され、更新日時も変更されることを確認
        expect(equipment.description).toBe('新しい説明');
        expect(equipment.updatedAt).toBeInstanceOf(Date);
      });

      it('説明をundefinedで削除できること', () => {
        // Arrange - 説明がある器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            description: '削除される説明',
          },
          testEquipmentType
        );

        // Act - 説明をundefinedで更新（削除）
        equipment.updateDescription();

        // Assert - 説明が削除されることを確認
        expect(equipment.description).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act - 前後に空白がある説明で更新
        equipment.updateDescription('  空白付き説明  ');

        // Assert - 空白が除去されることを確認
        expect(equipment.description).toBe('空白付き説明');
      });
    });

    describe('異常系', () => {
      it('長すぎる説明でエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act & Assert - 1001文字の説明でエラーが発生することを確認
        const longDescription = 'a'.repeat(1001);
        expect(() => equipment.updateDescription(longDescription)).toThrow(ZodError);
      });
    });
  });

  describe('updateAffiliateLink()', () => {
    describe('正常系', () => {
      it('有効なアフィリエイトリンクで更新できること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            affiliateLink: 'https://example.com/old',
          },
          testEquipmentType
        );

        // Act - アフィリエイトリンクを更新
        equipment.updateAffiliateLink('https://example.com/new');

        // Assert - アフィリエイトリンクが更新され、更新日時も変更されることを確認
        expect(equipment.affiliateLink).toBe('https://example.com/new');
        expect(equipment.updatedAt).toBeInstanceOf(Date);
      });

      it('アフィリエイトリンクをundefinedで削除できること', () => {
        // Arrange - アフィリエイトリンクがある器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
            affiliateLink: 'https://example.com/delete',
          },
          testEquipmentType
        );

        // Act - アフィリエイトリンクをundefinedで更新（削除）
        equipment.updateAffiliateLink();

        // Assert - アフィリエイトリンクが削除されることを確認
        expect(equipment.affiliateLink).toBeUndefined();
      });
    });

    describe('異常系', () => {
      it('無効なURLでエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act & Assert - 無効なURLでエラーが発生することを確認
        expect(() => equipment.updateAffiliateLink('invalid-url')).toThrow(ZodError);
      });

      it('長すぎるURLでエラーが発生すること', () => {
        // Arrange - 器具を準備
        const equipment = Equipment.create(
          {
            id: 'equipment-1',
            name: 'テスト器具',
          },
          testEquipmentType
        );

        // Act & Assert - 501文字のURLでエラーが発生することを確認（500文字制限を超える）
        const longUrl = `https://example.com/${'a'.repeat(482)}`; // 合計501文字
        expect(() => equipment.updateAffiliateLink(longUrl)).toThrow(ZodError);
      });
    });
  });

  describe('equals()', () => {
    it('同じIDの器具は等価であること', () => {
      // Arrange - 同じIDの2つの器具を準備
      const equipment1 = Equipment.create(
        {
          id: 'equipment-1',
          name: '器具1',
        },
        testEquipmentType
      );

      const equipment2 = Equipment.create(
        {
          id: 'equipment-1',
          name: '器具2', // 異なる名前でもIDが同じなら等価
        },
        testEquipmentType
      );

      // Act & Assert - 等価であることを確認
      expect(equipment1.equals(equipment2)).toBe(true);
    });

    it('異なるIDの器具は等価でないこと', () => {
      // Arrange - 異なるIDの2つの器具を準備
      const equipment1 = Equipment.create(
        {
          id: 'equipment-1',
          name: '器具1',
        },
        testEquipmentType
      );

      const equipment2 = Equipment.create(
        {
          id: 'equipment-2',
          name: '器具2',
        },
        testEquipmentType
      );

      // Act & Assert - 等価でないことを確認
      expect(equipment1.equals(equipment2)).toBe(false);
    });
  });

  describe('toPlainObject()', () => {
    it('プレーンオブジェクトに変換できること', () => {
      // Arrange - 器具を準備
      const equipment = Equipment.create(
        {
          id: 'equipment-1',
          name: 'テスト器具',
          brand: 'テストブランド',
          description: 'テスト説明',
          affiliateLink: 'https://example.com/test',
          isAvailable: true,
        },
        testEquipmentType
      );

      // Act - プレーンオブジェクトに変換
      const plainObject = equipment.toPlainObject();

      // Assert - 正しく変換されることを確認
      expect(plainObject).toEqual({
        id: 'equipment-1',
        name: 'テスト器具',
        brand: 'テストブランド',
        description: 'テスト説明',
        affiliateLink: 'https://example.com/test',
        equipmentType: testEquipmentType,
        isAvailable: true,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      });
    });
  });
});
