/**
 * クライアント用レシピ詳細型定義
 * Prisma enumへの依存を排除し、API境界の型として柔軟性を確保
 */

export type BaristaInfo = {
  id: string;
  name: string;
  affiliation?: string;
  socialLinks: SocialLinkInfo[];
};

export type SocialLinkInfo = {
  id: string;
  platform: string;
  url: string;
};

export type RecipeStepInfo = {
  id: string;
  stepOrder: number;
  timeSeconds?: number;
  description: string;
};

export type DetailedEquipmentInfo = {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  affiliateLink?: string;
  equipmentType: EquipmentTypeInfo;
};

export type EquipmentTypeInfo = {
  id: string;
  name: string;
  description?: string;
};

export type RecipeTagInfo = {
  id: string;
  name: string;
  slug: string;
};

/**
 * レシピ詳細情報（フロントエンド用）
 */
export type RecipeDetailInfo = {
  id: string;
  title: string;
  summary?: string;
  remarks?: string;
  /** 焙煎レベル（文字列表現） */
  roastLevel: string;
  /** 挽き目（オプション、文字列表現） */
  grindSize?: string;
  beanWeight?: number;
  waterTemp?: number;
  waterAmount?: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  barista?: BaristaInfo;
  steps: RecipeStepInfo[];
  equipment: DetailedEquipmentInfo[];
  tags: RecipeTagInfo[];
};

/**
 * API エラーレスポンス（クライアント用）
 */
export type RecipeDetailErrorResponse = {
  error: string;
  message: string;
  request_id: string;
  timestamp: string;
  details?: {
    fields?: Array<{
      field: string;
      message: string;
    }>;
    [key: string]: unknown;
  };
};
