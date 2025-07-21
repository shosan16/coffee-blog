import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

import {
  BaristaNameSchema,
  BaristaAffiliationSchema,
  BaristaCreateSchema,
  BaristaUpdateSchema,
  type BaristaCreateParams,
  type BaristaUpdateParams,
} from './BaristaSchema';

/**
 * Baristaスキーマのテスト
 */
describe('BaristaSchema', () => {
  describe('BaristaNameSchema', () => {
    describe('正常系', () => {
      it('有効な名前がバリデーションを通過すること', () => {
        // Arrange & Act & Assert - 有効な名前のテスト
        expect(() => BaristaNameSchema.parse('田中太郎')).not.toThrow();
        expect(() => BaristaNameSchema.parse('a')).not.toThrow();
        expect(() => BaristaNameSchema.parse('a'.repeat(100))).not.toThrow();
      });

      it('前後の空白が除去されること', () => {
        // Arrange & Act - 前後に空白がある名前をパース
        const result = BaristaNameSchema.parse('  田中太郎  ');

        // Assert - 空白が除去されていることを確認
        expect(result).toBe('田中太郎');
      });
    });

    describe('異常系', () => {
      it('空文字でZodErrorが発生すること', () => {
        // Act & Assert - 空文字でエラーが発生することを確認
        expect(() => BaristaNameSchema.parse('')).toThrow(ZodError);
      });

      it('空白のみでZodErrorが発生すること', () => {
        // Act & Assert - 空白のみでエラーが発生することを確認
        expect(() => BaristaNameSchema.parse('   ')).toThrow(ZodError);
      });

      it('100文字超過でZodErrorが発生すること', () => {
        // Act & Assert - 長すぎる名前でエラーが発生することを確認
        expect(() => BaristaNameSchema.parse('a'.repeat(101))).toThrow(ZodError);
      });
    });
  });

  describe('BaristaAffiliationSchema', () => {
    describe('正常系', () => {
      it('有効な所属がバリデーションを通過すること', () => {
        // Arrange & Act & Assert - 有効な所属のテスト
        expect(() => BaristaAffiliationSchema.parse('テストカフェ')).not.toThrow();
        expect(() => BaristaAffiliationSchema.parse('a'.repeat(200))).not.toThrow();
        expect(() => BaristaAffiliationSchema.parse(undefined)).not.toThrow();
      });

      it('空文字が空文字のまま返されること', () => {
        // Arrange & Act - 空文字をパース
        const result = BaristaAffiliationSchema.parse('');

        // Assert - 空文字のまま返されることを確認
        expect(result).toBe('');
      });

      it('前後の空白が除去されること', () => {
        // Arrange & Act - 前後に空白がある所属をパース
        const result = BaristaAffiliationSchema.parse('  テストカフェ  ');

        // Assert - 空白が除去されていることを確認
        expect(result).toBe('テストカフェ');
      });
    });

    describe('異常系', () => {
      it('200文字超過でZodErrorが発生すること', () => {
        // Act & Assert - 長すぎる所属でエラーが発生することを確認
        expect(() => BaristaAffiliationSchema.parse('a'.repeat(201))).toThrow(ZodError);
      });
    });
  });

  describe('BaristaCreateSchema', () => {
    describe('正常系', () => {
      it('有効なパラメータがバリデーションを通過すること', () => {
        // Arrange - 有効なパラメータを準備
        const params: BaristaCreateParams = {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'テストカフェ',
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaCreateSchema.parse(params)).not.toThrow();
      });

      it('所属なしでバリデーションを通過すること', () => {
        // Arrange - 所属なしのパラメータを準備
        const params = {
          id: 'barista-1',
          name: '田中太郎',
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaCreateSchema.parse(params)).not.toThrow();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 前後に空白があるパラメータを準備
        const params = {
          id: 'barista-1',
          name: '  田中太郎  ',
          affiliation: '  テストカフェ  ',
        };

        // Act - パラメータをパース
        const result = BaristaCreateSchema.parse(params);

        // Assert - 空白が除去されていることを確認
        expect(result.name).toBe('田中太郎');
        expect(result.affiliation).toBe('テストカフェ');
      });
    });

    describe('異常系', () => {
      it('IDが空文字でZodErrorが発生すること', () => {
        // Arrange - 無効なIDのパラメータを準備
        const params = {
          id: '',
          name: '田中太郎',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => BaristaCreateSchema.parse(params)).toThrow(ZodError);
      });

      it('名前が無効でZodErrorが発生すること', () => {
        // Arrange - 無効な名前のパラメータを準備
        const params = {
          id: 'barista-1',
          name: '',
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => BaristaCreateSchema.parse(params)).toThrow(ZodError);
      });

      it('所属が無効でZodErrorが発生すること', () => {
        // Arrange - 無効な所属のパラメータを準備
        const params = {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'a'.repeat(201),
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => BaristaCreateSchema.parse(params)).toThrow(ZodError);
      });
    });
  });

  describe('BaristaUpdateSchema', () => {
    describe('正常系', () => {
      it('名前のみの更新パラメータがバリデーションを通過すること', () => {
        // Arrange - 名前のみの更新パラメータを準備
        const params: BaristaUpdateParams = {
          name: '更新された名前',
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaUpdateSchema.parse(params)).not.toThrow();
      });

      it('所属のみの更新パラメータがバリデーションを通過すること', () => {
        // Arrange - 所属のみの更新パラメータを準備
        const params: BaristaUpdateParams = {
          affiliation: '更新された所属',
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaUpdateSchema.parse(params)).not.toThrow();
      });

      it('両方の更新パラメータがバリデーションを通過すること', () => {
        // Arrange - 両方の更新パラメータを準備
        const params: BaristaUpdateParams = {
          name: '更新された名前',
          affiliation: '更新された所属',
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaUpdateSchema.parse(params)).not.toThrow();
      });

      it('空のオブジェクトでバリデーションを通過すること', () => {
        // Arrange - 空のオブジェクトを準備
        const params = {};

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaUpdateSchema.parse(params)).not.toThrow();
      });

      it('所属をnullに設定できること', () => {
        // Arrange - 所属をnullにするパラメータを準備
        const params: BaristaUpdateParams = {
          affiliation: null,
        };

        // Act & Assert - バリデーションが通過することを確認
        expect(() => BaristaUpdateSchema.parse(params)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('無効な名前でZodErrorが発生すること', () => {
        // Arrange - 無効な名前の更新パラメータを準備
        const params: BaristaUpdateParams = {
          name: '', // 空文字は無効
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => BaristaUpdateSchema.parse(params)).toThrow(ZodError);
      });

      it('無効な所属でZodErrorが発生すること', () => {
        // Arrange - 無効な所属の更新パラメータを準備
        const params: BaristaUpdateParams = {
          affiliation: 'a'.repeat(201), // 200文字超過
        };

        // Act & Assert - ZodErrorが発生することを確認
        expect(() => BaristaUpdateSchema.parse(params)).toThrow(ZodError);
      });
    });
  });
});
