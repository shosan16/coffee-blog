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
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import type { PrismaRecipeWithRelations } from '@/server/infrastructure/repositories/mappers/RecipeMapper';
import { PrismaRecipeRepository } from '@/server/infrastructure/repositories/PrismaRecipeRepository';
import { prisma } from '@/server/shared/database/prisma';

import { RecipeDetailError, type RecipeDetail, type GetRecipeDetailResult } from './types';

/**
 * 関連データ取得処理を再利用可能な関数として抽出
 *
 * @param recipeId - レシピID
 * @returns Prisma関連データ
 */
async function getPrismaRecipeWithRelations(
  recipeId: RecipeId
): Promise<PrismaRecipeWithRelations | null> {
  return prisma.post.findUnique({
    where: { id: BigInt(recipeId.value) },
    include: {
      author: { select: { name: true } },
      barista: {
        include: {
          socialLinks: true,
        },
      },
      steps: {
        orderBy: { stepOrder: 'asc' },
      },
      equipment: {
        include: {
          equipmentType: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

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
    // ユースケース実行とPrismaデータ取得を並行実行（パフォーマンス最適化）
    const recipeId = RecipeId.fromString(id.toString());
    const [result, prismaData] = await Promise.all([
      useCase.execute(id.toString()),
      getPrismaRecipeWithRelations(recipeId),
    ]);

    // ドメインエンティティとPrismaデータをAPIレスポンス形式に変換
    const recipeDetail: RecipeDetail = RecipeDetailResponseMapper.toDto(
      result.recipe,
      prismaData ?? undefined
    ) as RecipeDetail;

    return {
      recipe: recipeDetail,
      newViewCount: result.newViewCount,
    };
  } catch (error) {
    // ユースケースエラーをサービス層エラーに変換
    if (error instanceof RecipeDetailUseCaseError) {
      throw new RecipeDetailError(
        error.message,
        error.code as 'RECIPE_NOT_FOUND' | 'RECIPE_NOT_PUBLISHED' | 'INVALID_ID',
        error.statusCode
      );
    }

    // データベースエラーや予期しないエラーは、そのまま再スローして適切に伝播
    throw error;
  }
}
