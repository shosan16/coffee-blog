import {
  EquipmentCreateSchema,
  EquipmentUpdateSchema,
  EquipmentTypeSchema,
  type EquipmentCreateParams,
  type EquipmentUpdateParams,
  type EquipmentType,
} from './EquipmentSchema';

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
  static create(params: EquipmentCreateParams, equipmentType: EquipmentType): Equipment {
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
   * 器具情報を更新
   *
   * @param params - 更新パラメータ
   * @throws ZodError 無効な入力の場合
   */
  update(params: EquipmentUpdateParams): void {
    const validatedParams = EquipmentUpdateSchema.parse(params);

    if (validatedParams.name !== undefined) {
      this._name = validatedParams.name;
    }

    if (validatedParams.brand !== undefined) {
      this._brand = validatedParams.brand ?? undefined;
    }

    if (validatedParams.description !== undefined) {
      this._description = validatedParams.description ?? undefined;
    }

    if (validatedParams.affiliateLink !== undefined) {
      this._affiliateLink = validatedParams.affiliateLink ?? undefined;
    }

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
