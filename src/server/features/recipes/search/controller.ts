import type { RoastLevel, GrindSize } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import type { RecipeListResponse } from '@/client/features/recipe-list/types/api';
import { SearchRecipesService } from '@/server/features/recipes/search/service';
import type { SearchRecipesParams } from '@/server/features/recipes/search/types';
import { searchRecipesQuerySchema } from '@/server/features/recipes/search/validation';
import { ApiError, type ErrorResponse } from '@/server/shared/api-error';
import { createRequestLogger, measurePerformance } from '@/server/shared/logger';
import { RequestId } from '@/server/shared/request-id';

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
    const requestId = RequestId.fromRequest(request);
    const logger = createRequestLogger(request.method, request.url);
    const timer = measurePerformance('searchRecipes');

    logger.info({ requestId }, 'Starting recipe search request processing');

    try {
      const rawParams = Object.fromEntries(searchParams.entries());
      logger.debug({ rawParams, requestId }, 'Raw URL search parameters parsed');

      const parsedParams = this.parseSearchParams(searchParams);
      logger.debug({ parsedParams, requestId }, 'Parameters parsed and transformed');

      // パラメータのバリデーション
      const validatedParams = searchRecipesQuerySchema.parse(parsedParams);
      logger.debug({ validatedParams, requestId }, 'Parameters validated successfully');

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
      logger.debug({ searchParamsTyped, requestId }, 'Final search parameters prepared');

      // 検索実行
      logger.info({ requestId }, 'Executing recipe search');
      const result = await this.searchRecipesService.searchRecipes(searchParamsTyped);

      logger.info(
        {
          recipesFound: result.recipes.length,
          totalItems: result.pagination.totalItems,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          requestId,
        },
        'Recipe search completed successfully'
      );

      timer.end();

      // レスポンス作成（リクエストIDヘッダーを追加）
      return NextResponse.json(
        {
          recipes: result.recipes,
          pagination: result.pagination,
        },
        {
          status: 200,
          headers: RequestId.addToHeaders(
            {
              'X-Total-Count': result.pagination.totalItems.toString(),
            },
            requestId
          ),
        }
      );
    } catch (error) {
      logger.error(
        {
          err: error,
          searchParams: Object.fromEntries(searchParams.entries()),
          requestId,
        },
        'Error occurred during recipe search'
      );
      timer.end();
      return this.handleError(error, requestId);
    }
  }

  /**
   * エラーハンドリング（OpenAPI仕様準拠）
   */
  private handleError(error: unknown, requestId: string): NextResponse<ErrorResponse> {
    const logger = createRequestLogger('UNKNOWN', '/api/recipes');

    if (error instanceof z.ZodError) {
      logger.warn(
        {
          validationErrors: error.errors,
          requestId,
        },
        'Request validation failed'
      );

      // Zodエラーをフィールドエラー形式に変換
      const fieldErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      const errorResponse = ApiError.validation(
        'パラメータのバリデーションに失敗しました',
        requestId,
        fieldErrors
      );

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: RequestId.addToHeaders({}, requestId),
      });
    }

    // JSON解析エラーのハンドリング
    if (error instanceof SyntaxError) {
      logger.warn(
        {
          err: error,
          requestId,
        },
        'JSON parsing error in request parameters'
      );

      const errorResponse = ApiError.invalidParameter(
        'パラメータの形式が不正です。JSON形式で入力してください。',
        requestId
      );

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: RequestId.addToHeaders({}, requestId),
      });
    }

    // その他のエラー
    logger.error(
      {
        err: error,
        requestId,
      },
      'Unexpected error occurred in recipe search'
    );

    const errorResponse = ApiError.internal('サーバー内部でエラーが発生しました', requestId);

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: RequestId.addToHeaders({}, requestId),
    });
  }
}
