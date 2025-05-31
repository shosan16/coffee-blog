import { NextResponse } from 'next/server';

import { RecipeListResponse } from '@/client/features/recipes/types/api';
import { SearchRecipesController } from '@/server/features/recipes/search/controller';
import type { ErrorResponse } from '@/server/shared/api-error';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const searchRecipesController = new SearchRecipesController();

export async function GET(
  request: Request
): Promise<NextResponse<RecipeListResponse | ErrorResponse>> {
  return searchRecipesController.handleSearchRecipes(request);
}
