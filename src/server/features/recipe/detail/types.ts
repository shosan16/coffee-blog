import { RoastLevel, GrindSize } from '@prisma/client';

/**
 * バリスタ情報
 */
export type Barista = {
  id: string;
  name: string;
  affiliation?: string;
  socialLinks: SocialLink[];
};

/**
 * SNSリンク情報
 */
export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

/**
 * レシピの手順
 */
export type RecipeStep = {
  id: string;
  stepOrder: number;
  timeSeconds?: number;
  description: string;
};

/**
 * 詳細な器具情報
 */
export type DetailedEquipment = {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  affiliateLink?: string;
  equipmentType: EquipmentType;
};

/**
 * 器具タイプ情報
 */
export type EquipmentType = {
  id: string;
  name: string;
  description?: string;
};

/**
 * レシピタグ情報
 */
export type RecipeTag = {
  id: string;
  name: string;
  slug: string;
};

/**
 * レシピ詳細情報（OpenAPI仕様準拠）
 */
export type RecipeDetail = {
  id: string;
  title: string;
  summary?: string;
  remarks?: string;
  roastLevel: RoastLevel;
  grindSize?: GrindSize;
  beanWeight?: number;
  waterTemp?: number;
  waterAmount?: number;
  brewingTime?: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  barista?: Barista;
  steps: RecipeStep[];
  equipment: DetailedEquipment[];
  tags: RecipeTag[];
};

/**
 * レシピ詳細取得パラメータ
 */
export type GetRecipeDetailParams = {
  id: string;
};

/**
 * レシピ詳細取得結果
 */
export type GetRecipeDetailResult = {
  recipe: RecipeDetail;
  newViewCount: number;
};

/**
 * レシピ詳細サービスエラー
 */
export class RecipeDetailError extends Error {
  constructor(
    message: string,
    public readonly code: 'RECIPE_NOT_FOUND' | 'RECIPE_NOT_PUBLISHED' | 'INVALID_ID',
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'RecipeDetailError';
  }
}
