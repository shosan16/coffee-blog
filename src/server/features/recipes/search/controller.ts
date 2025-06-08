import { RoastLevel, GrindSize } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { RecipeListResponse } from '@/client/features/recipes/types/api';
import { SearchRecipesService } from '@/server/features/recipes/search/service';
import type { SearchRecipesParams } from '@/server/features/recipes/search/types';
import { searchRecipesQuerySchema } from '@/server/features/recipes/search/validation';
import type { ErrorResponse } from '@/server/shared/api-error';
import { createRequestLogger, measurePerformance } from '@/server/shared/logger';

export class SearchRecipesController {
  private readonly searchRecipesService: SearchRecipesService;

  constructor() {
    this.searchRecipesService = new SearchRecipesService();
  }

  /**
   * URLパラメータを検索パラメータに変換する
   */
  private parseSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
    const params = Object.fromEntries(searchParams.entries());

    return {
      ...params,
      roastLevel: params.roastLevel
        ? params.roastLevel.split(',').map((level) => level as RoastLevel)
        : undefined,
      grindSize: params.grindSize
        ? params.grindSize.split(',').map((size) => size as GrindSize)
        : undefined,
      equipment: params.equipment ? params.equipment.split(',') : undefined,
      equipmentType: params.equipmentType ? params.equipmentType.split(',') : undefined,
      beanWeight: params.beanWeight ? JSON.parse(params.beanWeight) : undefined,
      waterTemp: params.waterTemp ? JSON.parse(params.waterTemp) : undefined,
      waterAmount: params.waterAmount ? JSON.parse(params.waterAmount) : undefined,
    };
  }

  /**
   * 検索リクエストを処理する
   */
  async handleSearchRecipes(
    request: Request
  ): Promise<NextResponse<RecipeListResponse | ErrorResponse>> {
    const { searchParams } = new URL(request.url);
    const logger = createRequestLogger(request.method, request.url);
    const timer = measurePerformance('searchRecipes');

    try {
      logger.info('Starting recipe search request processing');

      const rawParams = Object.fromEntries(searchParams.entries());
      logger.debug({ rawParams }, 'Raw URL search parameters parsed');

      const parsedParams = this.parseSearchParams(searchParams);
      logger.debug({ parsedParams }, 'Parameters parsed and transformed');

      // パラメータのバリデーション
      const validatedParams = searchRecipesQuerySchema.parse(parsedParams);
      logger.debug({ validatedParams }, 'Parameters validated successfully');

      // 検索パラメータの型変換
      const searchParamsTyped: SearchRecipesParams = {
        page: validatedParams.page,
        limit: validatedParams.limit,
        roastLevel: validatedParams.roastLevel,
        grindSize: validatedParams.grindSize,
        equipment: validatedParams.equipment,
        equipmentType: validatedParams.equipmentType,
        beanWeight: validatedParams.beanWeight,
        waterTemp: validatedParams.waterTemp,
        waterAmount: validatedParams.waterAmount,
        search: validatedParams.search,
        sort: validatedParams.sort,
        order: validatedParams.order,
      };
      logger.debug({ searchParamsTyped }, 'Final search parameters prepared');

      // 検索実行
      logger.info('Executing recipe search');
      const result = await this.searchRecipesService.searchRecipes(searchParamsTyped);

      logger.info(
        {
          recipesFound: result.recipes.length,
          totalItems: result.pagination.totalItems,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
        },
        'Recipe search completed successfully'
      );

      timer.end();

      // レスポンス作成
      return NextResponse.json({
        recipes: result.recipes,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error(
        {
          err: error,
          searchParams: Object.fromEntries(searchParams.entries()),
        },
        'Error occurred during recipe search'
      );
      timer.end();
      return this.handleError(error);
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): NextResponse<ErrorResponse> {
    const logger = createRequestLogger('UNKNOWN', '/api/recipes');

    if (error instanceof z.ZodError) {
      logger.warn(
        {
          validationErrors: error.errors,
        },
        'Request validation failed'
      );

      return NextResponse.json(
        {
          code: 'INVALID_PARAMETERS',
          message: 'パラメータが不正です',
          details: Object.fromEntries(
            error.errors.map((err) => [err.path.join('.'), [err.message]])
          ),
        },
        { status: 400 }
      );
    }

    logger.error(
      {
        err: error,
      },
      'Unexpected error occurred in recipe search'
    );

    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '予期せぬエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
