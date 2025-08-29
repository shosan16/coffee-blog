import { cache } from 'react';

import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';

import { logger, createLogContext } from './logger';

/**
 * レシピデータ取得の統一インターフェース
 * メタデータ生成とページ描画で重複取得を防ぐ
 */
export const getCachedRecipeData = cache(
  async (recipeId: string): Promise<RecipeDetailInfo | null> => {
    const logContext = createLogContext('getCachedRecipeData', recipeId);

    try {
      logger.info(logContext, 'Fetching recipe data');

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        logger.warn(
          { ...logContext, statusCode: response.status },
          'Recipe API returned non-OK status'
        );
        return null;
      }

      const data = await response.json();
      logger.info(logContext, 'Recipe data fetched successfully');

      return data;
    } catch (error) {
      logger.error(
        { ...logContext, error: error instanceof Error ? error.message : 'Unknown error' },
        'Failed to fetch recipe data'
      );
      return null;
    }
  }
);

/**
 * メタデータ生成専用の軽量レシピデータ取得
 */
export const getCachedRecipeMetadata = cache(async (recipeId: string) => {
  const recipe = await getCachedRecipeData(recipeId);

  if (!recipe) {
    return null;
  }

  // メタデータに必要な最小限のデータのみ返す
  return {
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    publishedAt: recipe.publishedAt,
    updatedAt: recipe.updatedAt,
    barista: recipe.barista ? { name: recipe.barista.name } : null,
    tags: recipe.tags.map((tag) => ({ name: tag.name })),
  };
});
