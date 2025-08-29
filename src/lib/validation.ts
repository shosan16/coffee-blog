/**
 * 共通バリデーション関数
 * プロジェクト全体で一貫したバリデーションロジックを提供
 */

/**
 * レシピIDのバリデーション
 * @param id 検証対象のID文字列
 * @returns バリデーション結果
 */
export function validateRecipeId(id: string): boolean {
  return !!(id && /^[1-9][0-9]*$/.test(id));
}

/**
 * レシピIDのバリデーション（型ガード付き）
 * @param id 検証対象のID文字列
 * @returns バリデーション結果と型ガード
 */
export function isValidRecipeId(id: string): id is string {
  return validateRecipeId(id);
}
