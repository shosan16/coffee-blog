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
import { PrismaTagRepository } from '@/server/infrastructure/repositories/PrismaTagRepository';
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

      const recipeRepository = new PrismaRecipeRepository(prisma);
      const equipmentRepository = new PrismaEquipmentRepository(prisma);
      const tagRepository = new PrismaTagRepository(prisma);
      const useCase = new SearchRecipesUseCase(recipeRepository);
      const responseMapper = new SearchRecipesResponseMapper(equipmentRepository, tagRepository);

      const input = {
        page: params.page,
        limit: params.limit,
        search: params.search,
        roastLevel: params.roastLevel,
        equipment: params.equipment,
        equipmentType: params.equipmentType,
        tags: params.tags,
        sort: params.sort as
          | 'id'
          | 'title'
          | 'viewCount'
          | 'createdAt'
          | 'updatedAt'
          | 'publishedAt'
          | 'roastLevel'
          | undefined,
        order: params.order,
      };

      const result = await useCase.execute(input);

      const responseDto = await responseMapper.toResponse(result);

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

      return responseDto;
    } catch (error) {
      timer.end();

      if (error instanceof SearchRecipesUseCaseError) {
        this.logger.error(
          { error: error.message, code: error.code },
          'Recipe search use case error'
        );
        throw error;
      }

      this.logger.error({ err: error, params }, 'Unexpected error in recipe search service');
      // データベースエラーや予期しないエラーは、そのまま再スローして適切に伝播
      throw error;
    }
  }
}
