/**
 * レシピ詳細取得サービス
 *
 * ユースケース層への移行により、ビジネスロジックを分離
 * サービス層はコントローラーとユースケース間の橋渡し役に特化
 */

import { RecipeDetailResponseMapper } from '@/server/application/dto/RecipeDetailResponse';
import {
  GetRecipeDetailUseCase,
  RecipeDetailUseCaseError,
} from '@/server/application/use-cases/GetRecipeDetailUseCase';
import { PrismaRecipeRepository } from '@/server/infrastructure/repositories/PrismaRecipeRepository';
import { prisma } from '@/server/shared/database/prisma';

import { RecipeDetailError, type RecipeDetail, type GetRecipeDetailResult } from './types';

/**
 * レシピ詳細情報を取得し、ビューカウントを増加する
 *
 * @param id - レシピID（数値）
 * @returns レシピ詳細情報と更新後のビューカウント
 * @throws {RecipeDetailError} レシピが見つからない、または非公開の場合
 */
export async function getRecipeDetail(id: number): Promise<GetRecipeDetailResult> {
  // 依存性注入：リポジトリとユースケースの設定
  const recipeRepository = new PrismaRecipeRepository(prisma);
  const useCase = new GetRecipeDetailUseCase(recipeRepository);

  try {
    // ユースケース実行
    const result = await useCase.execute(id.toString());

    // ドメインエンティティをAPIレスポンス形式に変換
    const recipeDetail: RecipeDetail = RecipeDetailResponseMapper.toDto(
      result.recipe
    ) as RecipeDetail;

    return {
      recipe: recipeDetail,
      newViewCount: result.newViewCount,
    };
  } catch (error) {
    // ユースケースエラーをサービス層エラーに変換
    if (error instanceof RecipeDetailUseCaseError) {
      throw new RecipeDetailError(error.message, error.code, error.statusCode);
    }

    // 予期しないエラーの場合
    throw new RecipeDetailError('Internal server error', 'RECIPE_NOT_FOUND', 500);
  }
}
