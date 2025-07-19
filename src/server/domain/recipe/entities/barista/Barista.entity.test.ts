import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

import { Barista } from './Barista.entity';
import type { BaristaCreateParams, BaristaUpdateParams } from './BaristaSchema';

/**
 * Baristaエンティティのテスト
 */
describe('Barista Entity', () => {
  // テストヘルパー関数
  const createValidParams = (): BaristaCreateParams => ({
    id: 'barista-1',
    name: '田中太郎',
    affiliation: 'テストカフェ',
  });

  const createValidUpdateParams = (): BaristaUpdateParams => ({
    name: '更新された名前',
    affiliation: '更新された所属',
  });

  describe('create()', () => {
    describe('正常系', () => {
      it('有効なパラメータでバリスタを作成できること', () => {
        // Arrange - バリスタ作成パラメータを準備
        const params = createValidParams();

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 作成されたバリスタの状態を確認
        expect(barista.id).toBe('barista-1');
        expect(barista.name).toBe('田中太郎');
        expect(barista.affiliation).toBe('テストカフェ');
        expect(barista.createdAt).toBeInstanceOf(Date);
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('所属なしでバリスタを作成できること', () => {
        // Arrange - 所属なしのパラメータを準備
        const params: BaristaCreateParams = {
          id: 'barista-2',
          name: '佐藤花子',
        };

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 作成されたバリスタの状態を確認
        expect(barista.id).toBe('barista-2');
        expect(barista.name).toBe('佐藤花子');
        expect(barista.affiliation).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 前後に空白があるパラメータを準備
        const params: BaristaCreateParams = {
          id: 'barista-3',
          name: '  空白付き名前  ',
          affiliation: '  空白付き所属  ',
        };

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 空白が除去されていることを確認
        expect(barista.name).toBe('空白付き名前');
        expect(barista.affiliation).toBe('空白付き所属');
      });
    });

    describe('異常系', () => {
      it('IDが空文字の場合、ZodErrorが発生すること', () => {
        // Arrange - 無効なIDのパラメータを準備
        const params = {
          id: '',
          name: '田中太郎',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('名前が空文字の場合、ZodErrorが発生すること', () => {
        // Arrange - 無効な名前のパラメータを準備
        const params = {
          id: 'barista-1',
          name: '',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('名前が100文字を超える場合、ZodErrorが発生すること', () => {
        // Arrange - 長すぎる名前のパラメータを準備
        const params = {
          id: 'barista-1',
          name: 'a'.repeat(101),
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('所属が200文字を超える場合、ZodErrorが発生すること', () => {
        // Arrange - 長すぎる所属のパラメータを準備
        const params = {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'a'.repeat(201),
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });
    });
  });

  describe('reconstruct()', () => {
    it('既存データから正しくバリスタを再構築できること', () => {
      // Arrange - 再構築用データを準備
      const data = {
        id: 'barista-1',
        name: '田中太郎',
        affiliation: 'テストカフェ',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      // Act - バリスタを再構築
      const barista = Barista.reconstruct(data);

      // Assert - 再構築されたバリスタの状態を確認
      expect(barista.id).toBe('barista-1');
      expect(barista.name).toBe('田中太郎');
      expect(barista.affiliation).toBe('テストカフェ');
      expect(barista.createdAt).toEqual(new Date('2023-01-01'));
      expect(barista.updatedAt).toEqual(new Date('2023-01-02'));
    });
  });

  describe('update()', () => {
    let barista: Barista;

    beforeEach(() => {
      barista = Barista.create(createValidParams());
    });

    describe('正常系', () => {
      it('名前のみ更新できること', () => {
        // Arrange - 名前のみの更新パラメータを準備
        const updateParams: BaristaUpdateParams = {
          name: '更新された名前',
        };

        // Act - バリスタ情報を更新
        barista.update(updateParams);

        // Assert - 名前のみ更新されていることを確認
        expect(barista.name).toBe('更新された名前');
        expect(barista.affiliation).toBe('テストカフェ'); // 元の値を維持
      });

      it('所属のみ更新できること', () => {
        // Arrange - 所属のみの更新パラメータを準備
        const updateParams: BaristaUpdateParams = {
          affiliation: '更新された所属',
        };

        // Act - バリスタ情報を更新
        barista.update(updateParams);

        // Assert - 所属のみ更新されていることを確認
        expect(barista.name).toBe('田中太郎'); // 元の値を維持
        expect(barista.affiliation).toBe('更新された所属');
      });

      it('名前と所属を同時に更新できること', () => {
        // Arrange - 複数項目の更新パラメータを準備
        const updateParams = createValidUpdateParams();

        // Act - バリスタ情報を更新
        barista.update(updateParams);

        // Assert - 両方の項目が更新されていることを確認
        expect(barista.name).toBe('更新された名前');
        expect(barista.affiliation).toBe('更新された所属');
      });

      it('所属をundefinedに設定できること', () => {
        // Arrange - 所属をnullにする更新パラメータを準備（nullはundefinedに変換される）
        const updateParams: BaristaUpdateParams = {
          affiliation: null,
        };

        // Act - バリスタ情報を更新
        barista.update(updateParams);

        // Assert - 所属がundefinedになっていることを確認
        expect(barista.affiliation).toBeUndefined();
      });

      it('updatedAtが更新されること', async () => {
        // Arrange - 元のupdatedAtを記録
        const originalUpdatedAt = barista.updatedAt;
        const updateParams = createValidUpdateParams();

        // Act - 少し時間を置いてから更新
        await new Promise((resolve) => setTimeout(resolve, 2));
        barista.update(updateParams);

        // Assert - updatedAtが更新されていることを確認
        expect(barista.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('異常系', () => {
      it('無効な名前でZodErrorが発生すること', () => {
        // Arrange - 無効な名前の更新パラメータを準備
        const updateParams: BaristaUpdateParams = {
          name: '', // 空文字は無効
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => barista.update(updateParams)).toThrow(ZodError);
      });

      it('長すぎる所属でZodErrorが発生すること', () => {
        // Arrange - 長すぎる所属の更新パラメータを準備
        const updateParams: BaristaUpdateParams = {
          affiliation: 'a'.repeat(201), // 200文字超過
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => barista.update(updateParams)).toThrow(ZodError);
      });
    });
  });

  describe('isActive()', () => {
    it('所属がある場合、activeと判定されること', () => {
      // Arrange - 所属ありのバリスタを作成
      const barista = Barista.create(createValidParams());

      // Act & Assert - activeと判定されることを確認
      expect(barista.isActive()).toBe(true);
    });

    it('所属がない場合、非activeと判定されること', () => {
      // Arrange - 所属なしのバリスタを作成
      const params: BaristaCreateParams = {
        id: 'barista-1',
        name: '田中太郎',
      };
      const barista = Barista.create(params);

      // Act & Assert - 非activeと判定されることを確認
      expect(barista.isActive()).toBe(false);
    });
  });

  describe('equals()', () => {
    it('同じIDのバリスタは等価と判定されること', () => {
      // Arrange - 同じIDの異なるバリスタインスタンスを作成
      const barista1 = Barista.create(createValidParams());
      const barista2 = Barista.create(createValidParams());

      // Act & Assert - 等価と判定されることを確認
      expect(barista1.equals(barista2)).toBe(true);
    });

    it('異なるIDのバリスタは非等価と判定されること', () => {
      // Arrange - 異なるIDのバリスタを作成
      const barista1 = Barista.create(createValidParams());
      const params2: BaristaCreateParams = {
        id: 'barista-2',
        name: '佐藤花子',
      };
      const barista2 = Barista.create(params2);

      // Act & Assert - 非等価と判定されることを確認
      expect(barista1.equals(barista2)).toBe(false);
    });
  });

  describe('toPlainObject()', () => {
    it('正しいプレーンオブジェクトに変換されること', () => {
      // Arrange - バリスタを作成
      const barista = Barista.create(createValidParams());

      // Act - プレーンオブジェクトに変換
      const plainObject = barista.toPlainObject();

      // Assert - 正しい構造と値を持つことを確認
      expect(plainObject).toEqual({
        id: 'barista-1',
        name: '田中太郎',
        affiliation: 'テストカフェ',
        createdAt: barista.createdAt,
        updatedAt: barista.updatedAt,
      });
    });

    it('所属なしの場合、affiliation: undefinedとなること', () => {
      // Arrange - 所属なしのバリスタを作成
      const params: BaristaCreateParams = {
        id: 'barista-1',
        name: '田中太郎',
      };
      const barista = Barista.create(params);

      // Act - プレーンオブジェクトに変換
      const plainObject = barista.toPlainObject();

      // Assert - affiliationがundefinedであることを確認
      expect(plainObject.affiliation).toBeUndefined();
    });
  });
});
