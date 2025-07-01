import { notFound } from 'next/navigation';

import { getRecipeDetail } from '@/server/features/recipe/detail/service';
import { validateRecipeId } from '@/server/features/recipe/detail/validation';
import { RecipeDetailError } from '@/server/features/recipe/detail/types';
import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';

/**
 * レシピ詳細取得のServer Action
 *
 * サーバーサイドでレシピ詳細を取得し、
 * 適切なエラーハンドリングを行う。
 */
export async function getRecipeDetailAction(recipeId: string): Promise<RecipeDetailInfo> {
  try {
    // レシピIDのバリデーション
    const numericId = validateRecipeId(recipeId);

    // レシピ詳細取得
    const result = await getRecipeDetail(numericId);

    return result.recipe;
  } catch (error) {
    if (error instanceof RecipeDetailError) {
      switch (error.code) {
        case 'INVALID_ID':
        case 'RECIPE_NOT_FOUND':
          // 404エラーはNext.jsのnotFound()を使用
          notFound();
          break;
        case 'RECIPE_NOT_PUBLISHED':
          // 403エラーもnotFound()で処理（セキュリティ上、非公開レシピの存在を隠す）
          notFound();
          break;
        default:
          // その他のエラーは再スロー
          throw error;
      }
    }

    // 予期しないエラーの場合も再スロー
    throw error;
  }
}
