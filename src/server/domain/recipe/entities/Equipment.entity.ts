import { z } from 'zod';

/**
 * 器具タイプのZodスキーマ
 */
const EquipmentTypeSchema = z.object({
  id: z.string().min(1, 'Equipment type ID is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Equipment type name is required')
    .max(100, 'Equipment type name must be 100 characters or less'),
  description: z
    .string()
    .trim()
    .max(500, 'Equipment type description must be 500 characters or less')
    .optional(),
});

/**
 * 器具作成パラメータのZodスキーマ
 */
const EquipmentCreateSchema = z.object({
  id: z.string().min(1, 'Equipment ID is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Equipment name is required')
    .max(200, 'Equipment name must be 200 characters or less'),
  brand: z.string().trim().max(100, 'Brand name must be 100 characters or less').optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Equipment description must be 1000 characters or less')
    .optional(),
  affiliateLink: z
    .string()
    .url('Affiliate link must be a valid URL')
    .max(500, 'Affiliate link must be 500 characters or less')
    .optional(),
  isAvailable: z.boolean().default(true),
});

/**
 * 器具エンティティ
 *
 * 器具の情報と可用性管理を行う
 */
export class Equipment {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private readonly _equipmentType: EquipmentType,
    private readonly _isAvailable: boolean = true,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
    private _brand?: string,
    private _description?: string,
    private _affiliateLink?: string
  ) {}

  /**
   * 新しい器具を作成
   *
   * @param params - 器具作成パラメータ
   * @param equipmentType - 器具タイプ
   * @returns Equipment インスタンス
   * @throws ZodError 無効な入力の場合
   */
  static create(
    params: {
      id: string;
      name: string;
      brand?: string;
      description?: string;
      affiliateLink?: string;
      isAvailable?: boolean;
    },
    equipmentType: EquipmentType
  ): Equipment {
    const validatedParams = EquipmentCreateSchema.parse(params);
    const validatedType = EquipmentTypeSchema.parse(equipmentType);

    return new Equipment(
      validatedParams.id,
      validatedParams.name,
      validatedType,
      validatedParams.isAvailable,
      new Date(),
      new Date(),
      validatedParams.brand,
      validatedParams.description,
      validatedParams.affiliateLink
    );
  }

  /**
   * 既存データから器具を再構築
   *
   * @param data - 器具データ
   * @returns Equipment インスタンス
   */
  static reconstruct(data: {
    id: string;
    name: string;
    brand?: string;
    description?: string;
    affiliateLink?: string;
    equipmentType: EquipmentType;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Equipment {
    return new Equipment(
      data.id,
      data.name,
      data.equipmentType,
      data.isAvailable,
      data.createdAt,
      data.updatedAt,
      data.brand,
      data.description,
      data.affiliateLink
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get brand(): string | undefined {
    return this._brand;
  }

  get description(): string | undefined {
    return this._description;
  }

  get affiliateLink(): string | undefined {
    return this._affiliateLink;
  }

  get equipmentType(): EquipmentType {
    return this._equipmentType;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * 器具名を更新
   *
   * @param newName - 新しい名前
   * @throws ZodError 無効な名前の場合
   */
  updateName(newName: string): void {
    const nameSchema = z
      .string()
      .trim()
      .min(1, 'Equipment name is required')
      .max(200, 'Equipment name must be 200 characters or less');

    const validatedName = nameSchema.parse(newName);
    this._name = validatedName;
    this._updatedAt = new Date();
  }

  /**
   * ブランドを更新
   *
   * @param newBrand - 新しいブランド
   * @throws ZodError 無効なブランドの場合
   */
  updateBrand(newBrand?: string): void {
    const brandSchema = z
      .string()
      .trim()
      .max(100, 'Brand name must be 100 characters or less')
      .optional();

    const validatedBrand = brandSchema.parse(newBrand);
    this._brand = validatedBrand;
    this._updatedAt = new Date();
  }

  /**
   * 説明を更新
   *
   * @param newDescription - 新しい説明
   * @throws ZodError 無効な説明の場合
   */
  updateDescription(newDescription?: string): void {
    const descriptionSchema = z
      .string()
      .trim()
      .max(1000, 'Equipment description must be 1000 characters or less')
      .optional();

    const validatedDescription = descriptionSchema.parse(newDescription);
    this._description = validatedDescription;
    this._updatedAt = new Date();
  }

  /**
   * アフィリエイトリンクを更新
   *
   * @param newAffiliateLink - 新しいアフィリエイトリンク
   * @throws ZodError 無効なURLの場合
   */
  updateAffiliateLink(newAffiliateLink?: string): void {
    const linkSchema = z
      .string()
      .url('Affiliate link must be a valid URL')
      .max(500, 'Affiliate link must be 500 characters or less')
      .optional();

    const validatedLink = linkSchema.parse(newAffiliateLink);
    this._affiliateLink = validatedLink;
    this._updatedAt = new Date();
  }

  /**
   * エンティティの等価性を判定
   *
   * @param other - 比較対象のEquipment
   * @returns 等価かどうか
   */
  equals(other: Equipment): boolean {
    return this._id === other._id;
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    name: string;
    brand?: string;
    description?: string;
    affiliateLink?: string;
    equipmentType: EquipmentType;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      brand: this._brand,
      description: this._description,
      affiliateLink: this._affiliateLink,
      equipmentType: this._equipmentType,
      isAvailable: this._isAvailable,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

/**
 * 器具タイプ
 */
export type EquipmentType = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
};
