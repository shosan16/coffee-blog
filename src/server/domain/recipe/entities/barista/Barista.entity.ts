import {
  BaristaCreateSchema,
  BaristaUpdateSchema,
  type BaristaCreateParams,
  type BaristaUpdateParams,
} from './BaristaSchema';

/**
 * バリスタエンティティ
 *
 * バリスタの情報とプロフィール管理を行う
 */
export class Barista {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _affiliation?: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  /**
   * 新しいバリスタを作成
   *
   * @param params - バリスタ作成パラメータ
   * @returns Barista インスタンス
   * @throws ZodError 無効な入力の場合
   */
  static create(params: BaristaCreateParams): Barista {
    const validatedParams = BaristaCreateSchema.parse(params);

    return new Barista(
      validatedParams.id,
      validatedParams.name,
      validatedParams.affiliation,
      new Date(),
      new Date()
    );
  }

  /**
   * 既存データからバリスタを再構築
   *
   * @param data - バリスタデータ
   * @returns Barista インスタンス
   */
  static reconstruct(data: {
    id: string;
    name: string;
    affiliation?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Barista {
    return new Barista(data.id, data.name, data.affiliation, data.createdAt, data.updatedAt);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get affiliation(): string | undefined {
    return this._affiliation;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * バリスタ情報を更新
   *
   * @param params - 更新パラメータ
   * @throws ZodError 無効な入力の場合
   */
  update(params: BaristaUpdateParams): void {
    const validatedParams = BaristaUpdateSchema.parse(params);

    if (validatedParams.name !== undefined) {
      this._name = validatedParams.name;
    }

    if (validatedParams.affiliation !== undefined) {
      this._affiliation = validatedParams.affiliation ?? undefined;
    }

    this._updatedAt = new Date();
  }

  /**
   * バリスタが活動中かどうかを判定
   *
   * @returns 活動中かどうか
   */
  isActive(): boolean {
    return !!this._affiliation;
  }

  /**
   * エンティティの等価性を判定
   *
   * @param other - 比較対象のBarista
   * @returns 等価かどうか
   */
  equals(other: Barista): boolean {
    return this._id === other._id;
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    name: string;
    affiliation?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      affiliation: this._affiliation,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
