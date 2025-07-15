import { z } from 'zod';

/**
 * レシピIDのZodスキーマ
 */
const RecipeIdSchema = z.string().refine(
  (value) => {
    const numericValue = parseInt(value, 10);
    return !isNaN(numericValue) && numericValue > 0;
  },
  {
    message: 'Recipe ID must be a positive integer string',
  }
);

/**
 * レシピID値オブジェクト
 *
 * IDの型安全性とバリデーションを提供する
 */
export class RecipeId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * 文字列からRecipeIdを作成
   *
   * @param value - レシピID文字列
   * @returns RecipeId インスタンス
   * @throws ZodError 無効なIDの場合
   */
  static fromString(value: string): RecipeId {
    const validatedValue = RecipeIdSchema.parse(value);
    return new RecipeId(validatedValue);
  }

  /**
   * ID値を文字列として取得
   */
  get value(): string {
    return this._value;
  }

  /**
   * 値の等価性を判定
   *
   * @param other - 比較対象のRecipeId
   * @returns 等価かどうか
   */
  equals(other: RecipeId): boolean {
    return this._value === other._value;
  }

  /**
   * 文字列表現を取得
   */
  toString(): string {
    return this._value;
  }
}
