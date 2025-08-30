import type { RoastLevel, GrindSize } from '@prisma/client';

import { SearchRecipesResponseMapper } from '@/server/application/dto/SearchRecipesResponse';
import {
  SearchRecipesUseCase,
  SearchRecipesUseCaseError,
} from '@/server/application/use-cases/SearchRecipesUseCase';
import type {
  SearchRecipesParams,
  SearchRecipesResult,
} from '@/server/features/recipes/search/types';
import { PrismaEquipmentRepository } from '@/server/infrastructure/repositories/PrismaEquipmentRepository';
import { PrismaRecipeRepository } from '@/server/infrastructure/repositories/PrismaRecipeRepository';
import { prisma } from '@/server/shared/database/prisma';
import { createChildLogger, measurePerformance } from '@/server/shared/logger';

export class SearchRecipesService {
  private readonly logger = createChildLogger({ service: 'SearchRecipesService' });

  /**
   * レシピを検索する
   *
   * ユースケース層への移行により、ビジネスロジックを分離
   * サービス層は入力変換とエラーハンドリングに特化
   */
  async searchRecipes(params: SearchRecipesParams): Promise<SearchRecipesResult> {
    const timer = measurePerformance('searchRecipesService');

    try {
      this.logger.info({ params }, 'Starting recipe search service');

      // 依存性注入：リポジトリとユースケースの設定
      const recipeRepository = new PrismaRecipeRepository(prisma);
      const equipmentRepository = new PrismaEquipmentRepository(prisma);
      const useCase = new SearchRecipesUseCase(recipeRepository);
      const responseMapper = new SearchRecipesResponseMapper(equipmentRepository);

      // パラメータ変換（外部境界からユースケース入力へ）
      const input = {
        page: params.page,
        limit: params.limit,
        search: params.search,
        roastLevel: params.roastLevel,
        grindSize: params.grindSize,
        equipment: params.equipment,
        equipmentType: params.equipmentType,
        beanWeight: params.beanWeight,
        waterTemp: params.waterTemp,
        waterAmount: params.waterAmount,
        sort: params.sort as
          | 'id'
          | 'title'
          | 'viewCount'
          | 'createdAt'
          | 'updatedAt'
          | 'publishedAt'
          | undefined,
        order: params.order,
      };

      // ユースケース実行
      const result = await useCase.execute(input);

      // ドメイン結果をAPIレスポンス形式に変換
      const responseDto = await responseMapper.toDto(result);

      timer.end();
      this.logger.info(
        {
          totalRecipes: responseDto.recipes.length,
          totalItems: responseDto.pagination.totalItems,
          currentPage: responseDto.pagination.currentPage,
          totalPages: responseDto.pagination.totalPages,
        },
        'Recipe search service completed successfully'
      );

      // 既存の型に合わせて返却
      return {
        recipes: responseDto.recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          summary: recipe.summary,
          equipment: recipe.equipment,
          roastLevel: recipe.roastLevel as RoastLevel,
          grindSize: recipe.grindSize as GrindSize | null,
          beanWeight: recipe.beanWeight,
          waterTemp: recipe.waterTemp,
          waterAmount: recipe.waterAmount,
        })),
        pagination: responseDto.pagination,
      };
    } catch (error) {
      timer.end();

      if (error instanceof SearchRecipesUseCaseError) {
        this.logger.error(
          { error: error.message, code: error.code },
          'Recipe search use case error'
        );
        // ユースケースエラーをそのまま再スロー
        throw error;
      }

      this.logger.error({ err: error, params }, 'Unexpected error in recipe search service');
      // データベースエラーや予期しないエラーは、そのまま再スローして適切に伝播
      throw error;
    }
  }
}
