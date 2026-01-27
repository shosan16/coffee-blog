/**
 * 共有スキーマのエクスポート集約
 *
 * APIレスポンスの型定義をZodスキーマで一元管理
 */

// ページネーション
export { PaginationSchema, type Pagination } from './pagination.schema';

// レシピ一覧
export {
  RecipeTagSummarySchema,
  RecipeSummarySchema,
  RecipeListResponseSchema,
  type RecipeTagSummary,
  type RecipeSummary,
  type RecipeListResponse,
} from './recipe-summary.schema';

// レシピ詳細
export {
  SocialLinkSchema,
  BaristaSchema,
  RecipeStepSchema,
  EquipmentTypeSchema,
  DetailedEquipmentSchema,
  RecipeTagSchema,
  RecipeDetailSchema,
  RecipeDetailResponseSchema,
  type SocialLink,
  type Barista,
  type RecipeStep,
  type EquipmentType,
  type DetailedEquipment,
  type RecipeTag,
  type RecipeDetail,
  type RecipeDetailResponse,
} from './recipe-detail.schema';
