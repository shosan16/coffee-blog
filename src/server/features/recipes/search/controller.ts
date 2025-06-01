import { RoastLevel, GrindSize } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { RecipeListResponse } from '@/client/features/recipes/types/api';
import { SearchRecipesService } from '@/server/features/recipes/search/service';
import type { SearchRecipesParams } from '@/server/features/recipes/search/types';
import { searchRecipesQuerySchema } from '@/server/features/recipes/search/validation';
import type { ErrorResponse } from '@/server/shared/api-error';

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
      beanWeight: params.beanWeight ? JSON.parse(params.beanWeight) : undefined,
      waterTemp: params.waterTemp ? JSON.parse(params.waterTemp) : undefined,
    };
  }

  /**
   * 検索リクエストを処理する
   */
  async handleSearchRecipes(
    request: Request
  ): Promise<NextResponse<RecipeListResponse | ErrorResponse>> {
    try {
      const { searchParams } = new URL(request.url);
      const parsedParams = this.parseSearchParams(searchParams);

      // パラメータのバリデーション
      const validatedParams = searchRecipesQuerySchema.parse(parsedParams);

      // 検索パラメータの型変換
      const searchParamsTyped: SearchRecipesParams = {
        page: validatedParams.page,
        limit: validatedParams.limit,
        roastLevel: validatedParams.roastLevel,
        grindSize: validatedParams.grindSize,
        equipment: validatedParams.equipment,
        beanWeight: validatedParams.beanWeight,
        waterTemp: validatedParams.waterTemp,
        search: validatedParams.search,
        sort: validatedParams.sort,
        order: validatedParams.order,
      };

      // 検索実行
      const result = await this.searchRecipesService.searchRecipes(searchParamsTyped);

      // レスポンス作成
      return NextResponse.json({
        recipes: result.recipes,
        pagination: result.pagination,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): NextResponse<ErrorResponse> {
    if (error instanceof z.ZodError) {
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

    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '予期せぬエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
