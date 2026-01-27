// スキーマから型をre-export
export type {
  Barista,
  SocialLink,
  RecipeStep,
  DetailedEquipment,
  EquipmentType,
  RecipeTag,
  RecipeDetail,
} from '@/server/shared/schemas';

import type { RecipeDetail } from '@/server/shared/schemas';

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
