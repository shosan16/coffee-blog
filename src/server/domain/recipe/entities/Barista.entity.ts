import { z } from 'zod';

/**
 * ソーシャルリンクのZodスキーマ
 */
const SocialLinkSchema = z.object({
  id: z.string().min(1, 'Social link ID is required'),
  platform: z
    .string()
    .min(1, 'Platform is required')
    .max(50, 'Platform name must be 50 characters or less'),
  url: z.string().url('Must be a valid URL').max(500, 'URL must be 500 characters or less'),
});

/**
 * バリスタ作成パラメータのZodスキーマ
 */
const BaristaCreateSchema = z.object({
  id: z.string().min(1, 'Barista ID is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Barista name is required')
    .max(100, 'Barista name must be 100 characters or less'),
  affiliation: z.string().trim().max(200, 'Affiliation must be 200 characters or less').optional(),
});

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
    private _socialLinks: SocialLink[] = [],
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
  static create(params: { id: string; name: string; affiliation?: string }): Barista {
    const validatedParams = BaristaCreateSchema.parse(params);

    return new Barista(
      validatedParams.id,
      validatedParams.name,
      validatedParams.affiliation,
      [],
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
    socialLinks?: SocialLink[];
    createdAt: Date;
    updatedAt: Date;
  }): Barista {
    return new Barista(
      data.id,
      data.name,
      data.affiliation,
      data.socialLinks ?? [],
      data.createdAt,
      data.updatedAt
    );
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

  get socialLinks(): readonly SocialLink[] {
    return [...this._socialLinks];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * バリスタ名を更新
   *
   * @param newName - 新しい名前
   * @throws ZodError 無効な名前の場合
   */
  updateName(newName: string): void {
    const nameSchema = z
      .string()
      .trim()
      .min(1, 'Barista name is required')
      .max(100, 'Barista name must be 100 characters or less');

    const validatedName = nameSchema.parse(newName);
    this._name = validatedName;
    this._updatedAt = new Date();
  }

  /**
   * 所属を更新
   *
   * @param newAffiliation - 新しい所属
   * @throws ZodError 無効な所属の場合
   */
  updateAffiliation(newAffiliation?: string): void {
    const affiliationSchema = z
      .string()
      .trim()
      .max(200, 'Affiliation must be 200 characters or less')
      .optional();

    const validatedAffiliation = affiliationSchema.parse(newAffiliation);
    this._affiliation = validatedAffiliation;
    this._updatedAt = new Date();
  }

  /**
   * ソーシャルリンクを追加
   *
   * @param socialLink - 追加するソーシャルリンク
   * @throws ZodError 無効なソーシャルリンクの場合
   * @throws Error 既に存在するプラットフォームの場合
   */
  addSocialLink(socialLink: SocialLink): void {
    const validatedLink = SocialLinkSchema.parse(socialLink);

    // 同じプラットフォームのリンクが既に存在するかチェック
    const existingLink = this._socialLinks.find(
      (link) => link.platform.toLowerCase() === validatedLink.platform.toLowerCase()
    );

    if (existingLink) {
      throw new Error(`Social link for platform '${validatedLink.platform}' already exists`);
    }

    this._socialLinks.push(validatedLink);
    this._updatedAt = new Date();
  }

  /**
   * ソーシャルリンクを更新
   *
   * @param linkId - 更新するリンクのID
   * @param updates - 更新内容
   * @throws ZodError 無効な更新内容の場合
   * @throws Error リンクが見つからない場合
   */
  updateSocialLink(
    linkId: string,
    updates: {
      platform?: string;
      url?: string;
    }
  ): void {
    const linkIndex = this._socialLinks.findIndex((link) => link.id === linkId);
    if (linkIndex === -1) {
      throw new Error(`Social link with ID '${linkId}' not found`);
    }

    const currentLink = this._socialLinks[linkIndex];
    const updatedLink = {
      id: currentLink.id,
      platform: updates.platform ?? currentLink.platform,
      url: updates.url ?? currentLink.url,
    };

    // 更新されたリンクをバリデーション
    const validatedLink = SocialLinkSchema.parse(updatedLink);

    // プラットフォームが変更された場合、重複チェック
    if (updates.platform && updates.platform !== currentLink.platform) {
      const duplicateLink = this._socialLinks.find(
        (link, index) =>
          index !== linkIndex && link.platform.toLowerCase() === updates.platform?.toLowerCase()
      );

      if (duplicateLink) {
        throw new Error(`Social link for platform '${updates.platform}' already exists`);
      }
    }

    this._socialLinks[linkIndex] = validatedLink;
    this._updatedAt = new Date();
  }

  /**
   * ソーシャルリンクを削除
   *
   * @param linkId - 削除するリンクのID
   * @throws Error リンクが見つからない場合
   */
  removeSocialLink(linkId: string): void {
    const linkIndex = this._socialLinks.findIndex((link) => link.id === linkId);
    if (linkIndex === -1) {
      throw new Error(`Social link with ID '${linkId}' not found`);
    }

    this._socialLinks.splice(linkIndex, 1);
    this._updatedAt = new Date();
  }

  /**
   * すべてのソーシャルリンクを設定
   *
   * @param socialLinks - 設定するソーシャルリンク配列
   * @throws ZodError 無効なソーシャルリンクの場合
   * @throws Error プラットフォーム重複の場合
   */
  setSocialLinks(socialLinks: SocialLink[]): void {
    const validatedLinks = z.array(SocialLinkSchema).parse(socialLinks);

    // プラットフォーム重複チェック
    const platforms = validatedLinks.map((link) => link.platform.toLowerCase());
    const uniquePlatforms = new Set(platforms);

    if (platforms.length !== uniquePlatforms.size) {
      throw new Error('Duplicate platforms are not allowed in social links');
    }

    this._socialLinks = validatedLinks;
    this._updatedAt = new Date();
  }

  /**
   * バリスタが活動中かどうかを判定
   * ソーシャルリンクや所属情報があれば活動中とみなす
   *
   * @returns 活動中かどうか
   */
  isActive(): boolean {
    return this._socialLinks.length > 0 || !!this._affiliation;
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
    socialLinks: SocialLink[];
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      affiliation: this._affiliation,
      socialLinks: [...this._socialLinks],
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

/**
 * ソーシャルリンク
 */
export type SocialLink = {
  readonly id: string;
  readonly platform: string;
  readonly url: string;
};
