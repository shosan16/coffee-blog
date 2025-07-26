import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ZodError } from 'zod';

import { Equipment } from './Equipment.entity';
import type {
  EquipmentCreateParams,
  EquipmentUpdateParams,
  EquipmentType,
} from './EquipmentSchema';

/**
 * Equipmentエンティティのテスト
 */
describe('Equipment Entity', () => {
  // テストヘルパー関数
  const createValidEquipmentType = (): EquipmentType => ({
    id: 'type-1',
    name: 'ドリッパー',
    description: 'コーヒーを抽出するための器具',
  });

  const createValidParams = (): EquipmentCreateParams => ({
    id: 'equipment-1',
    name: 'V60ドリッパー',
    brand: 'Hario',
    description: 'ハリオのV60ドリッパー',
    affiliateLink: 'https://example.com/v60',
    isAvailable: true,
  });

  const createValidUpdateParams = (): EquipmentUpdateParams => ({
    name: '更新された器具名',
    brand: '更新されたブランド',
    description: '更新された説明',
    affiliateLink: 'https://updated.example.com',
  });

  let testEquipmentType: EquipmentType;

  beforeEach(() => {
    testEquipmentType = createValidEquipmentType();
  });

  describe('create()', () => {
    describe('正常系', () => {
      it('有効なパラメータで器具を作成できること', () => {
        // Arrange - 器具作成パラメータを準備
        const params = createValidParams();

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
        const params: EquipmentCreateParams = {
          id: 'equipment-2',
          name: 'シンプルドリッパー',
          isAvailable: true,
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
        expect(equipment.isAvailable).toBe(true);
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 前後に空白があるパラメータを準備
        const params: EquipmentCreateParams = {
          id: 'equipment-3',
          name: '  空白付き器具名  ',
          brand: '  空白付きブランド  ',
          description: '  空白付き説明  ',
          isAvailable: true,
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
        const params: EquipmentCreateParams = {
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
      it('IDが空文字の場合、ZodErrorが発生すること', () => {
        // Arrange - 無効なIDのパラメータを準備
        const params = {
          id: '',
          name: 'V60ドリッパー',
          isAvailable: true,
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('名前が空文字の場合、ZodErrorが発生すること', () => {
        // Arrange - 無効な名前のパラメータを準備
        const params = {
          id: 'equipment-1',
          name: '',
          isAvailable: true,
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('名前が200文字を超える場合、ZodErrorが発生すること', () => {
        // Arrange - 長すぎる名前のパラメータを準備
        const params = {
          id: 'equipment-1',
          name: 'a'.repeat(201),
          isAvailable: true,
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('無効なURLの場合、ZodErrorが発生すること', () => {
        // Arrange - 無効なURLのパラメータを準備
        const params = {
          id: 'equipment-1',
          name: 'V60ドリッパー',
          affiliateLink: 'invalid-url',
          isAvailable: true,
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Equipment.create(params, testEquipmentType)).toThrow(ZodError);
      });

      it('無効な器具タイプの場合、ZodErrorが発生すること', () => {
        // Arrange - 無効な器具タイプを準備
        const params = createValidParams();
        const invalidEquipmentType = {
          id: '',
          name: 'ドリッパー',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Equipment.create(params, invalidEquipmentType)).toThrow(ZodError);
      });
    });
  });

  describe('reconstruct()', () => {
    it('既存データから正しく器具を再構築できること', () => {
      // Arrange - 再構築用データを準備
      const data = {
        id: 'equipment-1',
        name: 'V60ドリッパー',
        brand: 'Hario',
        description: 'ハリオのV60ドリッパー',
        affiliateLink: 'https://example.com/v60',
        equipmentType: testEquipmentType,
        isAvailable: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      // Act - 器具を再構築
      const equipment = Equipment.reconstruct(data);

      // Assert - 再構築された器具の状態を確認
      expect(equipment.id).toBe('equipment-1');
      expect(equipment.name).toBe('V60ドリッパー');
      expect(equipment.brand).toBe('Hario');
      expect(equipment.description).toBe('ハリオのV60ドリッパー');
      expect(equipment.affiliateLink).toBe('https://example.com/v60');
      expect(equipment.equipmentType).toEqual(testEquipmentType);
      expect(equipment.isAvailable).toBe(true);
      expect(equipment.createdAt).toEqual(new Date('2023-01-01'));
      expect(equipment.updatedAt).toEqual(new Date('2023-01-02'));
    });
  });

  describe('update()', () => {
    let equipment: Equipment;

    beforeEach(() => {
      equipment = Equipment.create(createValidParams(), testEquipmentType);
    });

    describe('正常系', () => {
      it('名前のみ更新できること', () => {
        // Arrange - 名前のみの更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          name: '更新された器具名',
        };

        // Act - 器具情報を更新
        equipment.update(updateParams);

        // Assert - 名前のみ更新されていることを確認
        expect(equipment.name).toBe('更新された器具名');
        expect(equipment.brand).toBe('Hario'); // 元の値を維持
      });

      it('ブランドのみ更新できること', () => {
        // Arrange - ブランドのみの更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          brand: '更新されたブランド',
        };

        // Act - 器具情報を更新
        equipment.update(updateParams);

        // Assert - ブランドのみ更新されていることを確認
        expect(equipment.name).toBe('V60ドリッパー'); // 元の値を維持
        expect(equipment.brand).toBe('更新されたブランド');
      });

      it('全項目を同時に更新できること', () => {
        // Arrange - 複数項目の更新パラメータを準備
        const updateParams = createValidUpdateParams();

        // Act - 器具情報を更新
        equipment.update(updateParams);

        // Assert - 全項目が更新されていることを確認
        expect(equipment.name).toBe('更新された器具名');
        expect(equipment.brand).toBe('更新されたブランド');
        expect(equipment.description).toBe('更新された説明');
        expect(equipment.affiliateLink).toBe('https://updated.example.com');
      });

      it('nullでプロパティをクリアできること', () => {
        // Arrange - nullによるクリアパラメータを準備
        const updateParams: EquipmentUpdateParams = {
          brand: null,
          description: null,
          affiliateLink: null,
        };

        // Act - 器具情報を更新
        equipment.update(updateParams);

        // Assert - プロパティがクリアされていることを確認
        expect(equipment.brand).toBeUndefined();
        expect(equipment.description).toBeUndefined();
        expect(equipment.affiliateLink).toBeUndefined();
      });

      it('updatedAtが更新されること', () => {
        // Arrange - フェイクタイマーを使用して時間を制御
        vi.useFakeTimers();
        const fixedTime = new Date('2024-01-15T10:00:00Z');
        vi.setSystemTime(fixedTime);

        // フェイクタイマー環境で新しい器具インスタンスを作成
        const testEquipment = Equipment.create(createValidParams(), testEquipmentType);
        const originalUpdatedAt = testEquipment.updatedAt;
        const updateParams = createValidUpdateParams();

        // Act - 時間を進めてから更新
        vi.advanceTimersByTime(1000); // 1秒進める
        testEquipment.update(updateParams);

        // Assert - updatedAtが更新されていることを確認
        expect(testEquipment.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());

        // Cleanup - リアルタイマーに戻す
        vi.useRealTimers();
      });
    });

    describe('異常系', () => {
      it('無効な名前でZodErrorが発生すること', () => {
        // Arrange - 無効な名前の更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          name: '',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => equipment.update(updateParams)).toThrow(ZodError);
      });

      it('長すぎるブランドでZodErrorが発生すること', () => {
        // Arrange - 長すぎるブランドの更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          brand: 'a'.repeat(101),
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => equipment.update(updateParams)).toThrow(ZodError);
      });

      it('長すぎる説明でZodErrorが発生すること', () => {
        // Arrange - 長すぎる説明の更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          description: 'a'.repeat(1001),
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => equipment.update(updateParams)).toThrow(ZodError);
      });

      it('無効なURLでZodErrorが発生すること', () => {
        // Arrange - 無効なURLの更新パラメータを準備
        const updateParams: EquipmentUpdateParams = {
          affiliateLink: 'invalid-url',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => equipment.update(updateParams)).toThrow(ZodError);
      });
    });
  });

  describe('equals()', () => {
    it('同じIDの器具は等価と判定されること', () => {
      // Arrange - 同じIDの異なる器具インスタンスを作成
      const equipment1 = Equipment.create(createValidParams(), testEquipmentType);
      const equipment2 = Equipment.create(createValidParams(), testEquipmentType);

      // Act & Assert - 等価と判定されることを確認
      expect(equipment1.equals(equipment2)).toBe(true);
    });

    it('異なるIDの器具は非等価と判定されること', () => {
      // Arrange - 異なるIDの器具を作成
      const equipment1 = Equipment.create(createValidParams(), testEquipmentType);
      const params2: EquipmentCreateParams = {
        id: 'equipment-2',
        name: 'ケメックス',
        isAvailable: true,
      };
      const equipment2 = Equipment.create(params2, testEquipmentType);

      // Act & Assert - 非等価と判定されることを確認
      expect(equipment1.equals(equipment2)).toBe(false);
    });
  });

  describe('toPlainObject()', () => {
    it('正しいプレーンオブジェクトに変換されること', () => {
      // Arrange - 器具を作成
      const equipment = Equipment.create(createValidParams(), testEquipmentType);

      // Act - プレーンオブジェクトに変換
      const plainObject = equipment.toPlainObject();

      // Assert - 正しい構造と値を持つことを確認
      expect(plainObject).toEqual({
        id: 'equipment-1',
        name: 'V60ドリッパー',
        brand: 'Hario',
        description: 'ハリオのV60ドリッパー',
        affiliateLink: 'https://example.com/v60',
        equipmentType: testEquipmentType,
        isAvailable: true,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      });
    });

    it('オプション項目なしの場合、undefinedとなること', () => {
      // Arrange - オプション項目なしの器具を作成
      const params: EquipmentCreateParams = {
        id: 'equipment-1',
        name: 'シンプルドリッパー',
        isAvailable: true,
      };
      const equipment = Equipment.create(params, testEquipmentType);

      // Act - プレーンオブジェクトに変換
      const plainObject = equipment.toPlainObject();

      // Assert - オプション項目がundefinedであることを確認
      expect(plainObject.brand).toBeUndefined();
      expect(plainObject.description).toBeUndefined();
      expect(plainObject.affiliateLink).toBeUndefined();
    });
  });
});
