import { describe, it, expect } from 'vitest';

import { validateRecipeId } from './validation';

describe('validateRecipeId', () => {
  describe('正常ケース', () => {
    it('有効な正の整数文字列の場合、数値に変換して返すこと', () => {
      // Arrange - 準備：有効なレシピIDを設定
      const validIds = ['1', '123', '999999', '1000'];

      validIds.forEach((id) => {
        // Act - 実行：レシピIDバリデーションを実行
        const result = validateRecipeId(id);

        // Assert - 確認：正の整数に変換されることを検証
        expect(result).toBe(parseInt(id, 10));
        expect(result).toBeGreaterThan(0);
      });
    });
  });

  describe('異常ケース', () => {
    it('0の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（0）を設定
      const invalidId = '0';

      // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
      expect(() => validateRecipeId(invalidId)).toThrow('Invalid recipe ID');
    });

    it('負の整数の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（負の整数）を設定
      const invalidIds = ['-1', '-100', '-999'];

      invalidIds.forEach((id) => {
        // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
        expect(() => validateRecipeId(id)).toThrow('Invalid recipe ID');
      });
    });

    it('整数以外の文字列の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（非整数）を設定
      const invalidIds = ['abc', '1.5', '1a', 'a1', '1.0', 'null', 'undefined'];

      invalidIds.forEach((id) => {
        // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
        expect(() => validateRecipeId(id)).toThrow('Invalid recipe ID');
      });
    });

    it('空文字列の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（空文字列）を設定
      const invalidId = '';

      // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
      expect(() => validateRecipeId(invalidId)).toThrow('Invalid recipe ID');
    });

    it('先頭に0がある数字の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（先頭0付き）を設定
      const invalidIds = ['01', '001', '0123'];

      invalidIds.forEach((id) => {
        // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
        expect(() => validateRecipeId(id)).toThrow('Invalid recipe ID');
      });
    });

    it('非常に大きな数値の場合、エラーを投げること', () => {
      // Arrange - 準備：無効なレシピID（Number.MAX_SAFE_INTEGER超過）を設定
      const invalidId = '9007199254740992'; // Number.MAX_SAFE_INTEGER + 1

      // Act & Assert - 実行・確認：バリデーションエラーが投げられることを検証
      expect(() => validateRecipeId(invalidId)).toThrow('Invalid recipe ID');
    });
  });
});
