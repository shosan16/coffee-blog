import type { RoastLevel } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { SearchRecipesService } from '@/server/features/recipes/search/service';
import type { SearchRecipesParams } from '@/server/features/recipes/search/types';
import { searchRecipesQuerySchema } from '@/server/features/recipes/search/validation';
import { ApiError, type ErrorResponse } from '@/server/shared/api-error';
import { createRequestLogger, measurePerformance } from '@/server/shared/logger';
import { RequestId } from '@/server/shared/request-id';
import type { RecipeListResponse } from '@/server/shared/schemas';

export class SearchRecipesController {
  private readonly searchRecipesService: SearchRecipesService;

  constructor() {
    this.searchRecipesService = new SearchRecipesService();
  }

  /**
   * URLパラメータを検索パラメータに変換する
   */
  private parseSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
    const parseFiltersFromSearchParams = <T extends Record<string, unknown>>(
      searchParams: URLSearchParams | null,
      config: {
        stringParams?: string[];
        numberParams?: string[];
        booleanParams?: string[];
        arrayParams?: Record<string, (value: string) => unknown>;
        jsonParams?: string[];
        enumParams?: Record<string, string[]>;
      }
    ): Partial<T> => {
      const filters = {} as Partial<T>;

      if (!searchParams) {
        return filters;
      }

      config.stringParams?.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          (filters as Record<string, unknown>)[param] = value;
        }
      });

      config.numberParams?.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          const parsed = parseInt(value, 10);
          if (!isNaN(parsed)) {
            (filters as Record<string, unknown>)[param] = parsed;
          }
        }
      });

      config.booleanParams?.forEach((param) => {
        const value = searchParams.get(param);
        if (value !== null) {
          (filters as Record<string, unknown>)[param] = value === 'true';
        }
      });

      if (config.arrayParams) {
        Object.entries(config.arrayParams).forEach(([param, converter]) => {
          const value = searchParams.get(param);
          if (value) {
            (filters as Record<string, unknown>)[param] = value.split(',').map(converter);
          }
        });
      }

      config.jsonParams?.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          try {
            (filters as Record<string, unknown>)[param] = JSON.parse(value);
          } catch {
            // JSON解析エラーの場合は無視
          }
        }
      });

      if (config.enumParams) {
        Object.entries(config.enumParams).forEach(([param, allowedValues]) => {
          const value = searchParams.get(param);
          if (value && allowedValues.includes(value)) {
            (filters as Record<string, unknown>)[param] = value;
          }
        });
      }

      return filters;
    };

    return parseFiltersFromSearchParams<Record<string, unknown>>(searchParams, {
      numberParams: ['page', 'limit'],
      stringParams: ['search', 'sort'],
      enumParams: {
        order: ['asc', 'desc'],
      },
      arrayParams: {
        roastLevel: (level) => level as RoastLevel,
        equipment: (item) => item,
        equipmentType: (item) => item,
        tags: (item) => item,
      },
    });
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

      const validationResult = searchRecipesQuerySchema.safeParse(parsedParams);
      if (!validationResult.success) {
        logger.warn(
          {
            validationErrors: validationResult.error.errors,
            requestId,
          },
          'Parameter validation failed'
        );
        throw validationResult.error;
      }
      const validatedParams = validationResult.data;
      logger.debug({ validatedParams, requestId }, 'Parameters validated successfully');

      const searchParamsTyped: SearchRecipesParams = {
        page: validatedParams.page,
        limit: validatedParams.limit,
        roastLevel: validatedParams.roastLevel,
        equipment: validatedParams.equipment,
        equipmentType: validatedParams.equipmentType,
        tags: validatedParams.tags,
        search: validatedParams.search,
        sort: validatedParams.sort,
        order: validatedParams.order,
      };
      logger.debug({ searchParamsTyped, requestId }, 'Final search parameters prepared');

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
