/**
 * レシピ詳細取得コントローラ
 */

import { NextRequest, NextResponse } from 'next/server';

import { ApiError, type ErrorResponse } from '@/server/shared/api-error';
import { createRequestLogger } from '@/server/shared/logger';
import { RequestId } from '@/server/shared/request-id';

import { validateRecipeId } from './validation';
import { getRecipeDetail } from './service';
import { RecipeDetailError, type RecipeDetail } from './types';

/**
 * レシピ詳細取得リクエストのハンドラ
 *
 * @param request - Next.jsリクエストオブジェクト
 * @param params - パスパラメータ { id: string }
 * @returns レシピ詳細情報またはエラーレスポンス
 */
export async function handleGetRecipeDetail(
  request: NextRequest,
  params: { id: string }
): Promise<NextResponse<RecipeDetail | ErrorResponse>> {
  const requestId = RequestId.fromRequest(request);
  const logger = createRequestLogger(request.method, request.url);

  try {
    logger.info({ requestId, recipeId: params.id }, 'Starting recipe detail request processing');

    // レシピIDバリデーション
    const numericId = validateRecipeId(params.id);

    // レシピ詳細取得
    const result = await getRecipeDetail(numericId);

    logger.info(
      {
        requestId,
        recipeId: params.id,
        viewCount: result.newViewCount,
        hasBarista: !!result.recipe.barista,
        stepsCount: result.recipe.steps.length,
        equipmentCount: result.recipe.equipment.length,
        tagsCount: result.recipe.tags.length,
      },
      'Recipe detail retrieval completed successfully'
    );

    // レスポンスヘッダーを設定
    const headers = RequestId.addToHeaders({}, requestId);
    headers['X-View-Count'] = result.newViewCount.toString();

    return NextResponse.json(result.recipe, {
      status: 200,
      headers,
    });
  } catch (error) {
    // RecipeDetailError の場合は適切なステータスコードでレスポンス
    if (error instanceof RecipeDetailError) {
      logger.error(
        {
          err: error,
          requestId,
          recipeId: params.id,
          errorCode: error.code,
        },
        error.code === 'INVALID_ID'
          ? 'Recipe ID validation failed'
          : 'Error occurred during recipe detail retrieval'
      );

      let errorResponse: ErrorResponse;

      switch (error.code) {
        case 'INVALID_ID':
          errorResponse = ApiError.invalidParameter(error.message, requestId);
          break;
        case 'RECIPE_NOT_FOUND':
          errorResponse = ApiError.notFound(error.message, requestId);
          break;
        case 'RECIPE_NOT_PUBLISHED':
          // 403エラー用のカスタムレスポンス
          errorResponse = {
            error: 'RECIPE_NOT_PUBLISHED',
            message: error.message,
            request_id: requestId,
            timestamp: new Date().toISOString(),
          };
          break;
        default:
          errorResponse = ApiError.internal(error.message, requestId);
      }

      return NextResponse.json(errorResponse, {
        status: error.statusCode,
        headers: RequestId.addToHeaders({}, requestId),
      });
    }

    // 予期しないエラーの場合は500エラー
    logger.error(
      {
        err: error,
        requestId,
        recipeId: params.id,
      },
      'Error occurred during recipe detail retrieval'
    );

    const errorResponse = ApiError.internal('レシピ詳細の取得に失敗しました', requestId);

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: RequestId.addToHeaders({}, requestId),
    });
  }
}
