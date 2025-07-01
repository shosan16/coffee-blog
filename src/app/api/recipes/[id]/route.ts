import { NextRequest, NextResponse } from 'next/server';

import { ApiError, type ErrorResponse } from '@/server/shared/api-error';
import { RequestId } from '@/server/shared/request-id';
import { handleGetRecipeDetail } from '@/server/features/recipe/detail/controller';
import type { RecipeDetail } from '@/server/features/recipe/detail/types';

export const dynamic = 'force-dynamic';

/**
 * レシピ詳細取得API
 * GET /api/recipes/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RecipeDetail | ErrorResponse>> {
  try {
    // パラメータを解決
    const resolvedParams = await params;

    // コントローラーに処理を委譲
    return await handleGetRecipeDetail(request, resolvedParams);
  } catch {
    // コントローラーで予期しないエラーが発生した場合の最終的なエラーハンドリング
    const requestId = RequestId.fromRequest(request);
    const errorResponse = ApiError.internal('サーバー内部でエラーが発生しました', requestId);

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: RequestId.addToHeaders({}, requestId),
    });
  }
}
