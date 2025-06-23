/**
 * レシピID パラメータバリデーション
 */

import { RecipeDetailError } from './types';

/**
 * レシピIDの妥当性を検証し、数値に変換する
 *
 * OpenAPI仕様に基づき、正の整数のみを許可:
 * - パターン: '^[1-9][0-9]*$'
 * - 先頭0は不許可
 * - 0や負の数は不許可
 * - 文字列は不許可
 *
 * @param id - 検証するレシピID文字列
 * @returns 変換された数値のレシピID
 * @throws {RecipeDetailError} 無効なIDの場合
 */
export function validateRecipeId(id: string): number {
  // 空文字列チェック
  if (!id || id.trim() === '') {
    throw new RecipeDetailError('Invalid recipe ID', 'INVALID_ID', 400);
  }

  // 正の整数パターンチェック（先頭0を除く）
  const pattern = /^[1-9][0-9]*$/;
  if (!pattern.test(id)) {
    throw new RecipeDetailError('Invalid recipe ID', 'INVALID_ID', 400);
  }

  // 数値変換
  const numericId = parseInt(id, 10);

  // 安全な整数範囲チェック
  if (!Number.isSafeInteger(numericId)) {
    throw new RecipeDetailError('Invalid recipe ID', 'INVALID_ID', 400);
  }

  return numericId;
}
