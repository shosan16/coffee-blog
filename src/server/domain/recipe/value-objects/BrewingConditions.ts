import type { RoastLevel, GrindSize } from '@prisma/client';
import { z } from 'zod';

/**
 * 抽出条件のZodスキーマ
 */
const BrewingConditionsSchema = z
  .object({
    roastLevel: z.nativeEnum({
      LIGHT: 'LIGHT',
      LIGHT_MEDIUM: 'LIGHT_MEDIUM',
      MEDIUM: 'MEDIUM',
      MEDIUM_DARK: 'MEDIUM_DARK',
      DARK: 'DARK',
      FRENCH: 'FRENCH',
    } as const),
    grindSize: z
      .nativeEnum({
        EXTRA_COARSE: 'EXTRA_COARSE',
        COARSE: 'COARSE',
        MEDIUM_COARSE: 'MEDIUM_COARSE',
        MEDIUM: 'MEDIUM',
        MEDIUM_FINE: 'MEDIUM_FINE',
        FINE: 'FINE',
        EXTRA_FINE: 'EXTRA_FINE',
      } as const)
      .optional(),
    beanWeight: z
      .number()
      .positive('Bean weight must be positive')
      .max(200, 'Bean weight must be 200 grams or less')
      .optional(),
    waterTemp: z
      .number()
      .min(50, 'Water temperature must be at least 50°C')
      .max(100, 'Water temperature must be at most 100°C')
      .optional(),
    waterAmount: z
      .number()
      .positive('Water amount must be positive')
      .max(5000, 'Water amount must be 5000ml or less')
      .optional(),
  })
  .refine(
    (data) => {
      // ビジネスルール: 豆と湯の比率チェック
      if (data.beanWeight && data.waterAmount) {
        const ratio = data.waterAmount / data.beanWeight;
        return ratio >= 10 && ratio <= 20;
      }
      return true;
    },
    {
      message: 'Water to bean ratio must be between 10:1 and 20:1',
      path: ['waterAmount'], // エラーパスを指定
    }
  );

/**
 * 抽出条件値オブジェクト
 *
 * コーヒー抽出に関する条件をまとめて管理し、
 * ビジネスルールとバリデーションを提供する
 */
export class BrewingConditions {
  private constructor(
    private readonly _roastLevel: RoastLevel,
    private readonly _grindSize?: GrindSize,
    private readonly _beanWeight?: number,
    private readonly _waterTemp?: number,
    private readonly _waterAmount?: number
  ) {}

  /**
   * 抽出条件を作成
   *
   * @param params - 抽出条件パラメータ
   * @returns BrewingConditions インスタンス
   * @throws ZodError 無効な条件の場合
   */
  static create(params: {
    roastLevel: RoastLevel;
    grindSize?: GrindSize;
    beanWeight?: number;
    waterTemp?: number;
    waterAmount?: number;
  }): BrewingConditions {
    const validatedParams = BrewingConditionsSchema.parse(params);

    // 警告レベルのビジネスルールチェック（エラーにはしない）
    if (validatedParams.beanWeight && validatedParams.waterAmount) {
      const ratio = validatedParams.waterAmount / validatedParams.beanWeight;
      if (ratio < 12 || ratio > 18) {
        // Note: Water to bean ratio is outside optimal range (12:1 to 18:1)
      }
    }

    return new BrewingConditions(
      validatedParams.roastLevel,
      validatedParams.grindSize,
      validatedParams.beanWeight,
      validatedParams.waterTemp,
      validatedParams.waterAmount
    );
  }

  // Getters
  get roastLevel(): RoastLevel {
    return this._roastLevel;
  }

  get grindSize(): GrindSize | undefined {
    return this._grindSize;
  }

  get beanWeight(): number | undefined {
    return this._beanWeight;
  }

  get waterTemp(): number | undefined {
    return this._waterTemp;
  }

  get waterAmount(): number | undefined {
    return this._waterAmount;
  }

  /**
   * 値の等価性を判定
   *
   * @param other - 比較対象のBrewingConditions
   * @returns 等価かどうか
   */
  equals(other: BrewingConditions): boolean {
    return (
      this._roastLevel === other._roastLevel &&
      this._grindSize === other._grindSize &&
      this._beanWeight === other._beanWeight &&
      this._waterTemp === other._waterTemp &&
      this._waterAmount === other._waterAmount
    );
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject(): {
    roastLevel: RoastLevel;
    grindSize?: GrindSize;
    beanWeight?: number;
    waterTemp?: number;
    waterAmount?: number;
  } {
    return {
      roastLevel: this._roastLevel,
      grindSize: this._grindSize,
      beanWeight: this._beanWeight,
      waterTemp: this._waterTemp,
      waterAmount: this._waterAmount,
    };
  }
}
