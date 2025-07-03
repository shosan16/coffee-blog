/**
 * レシピ詳細取得サービス
 */

import { prisma } from '@/server/shared/database/prisma';

import {
  RecipeDetailError,
  type RecipeDetail,
  type GetRecipeDetailResult,
  type Barista,
  type RecipeStep,
  type DetailedEquipment,
  type RecipeTag,
} from './types';

/**
 * レシピ詳細情報を取得し、ビューカウントを増加する
 *
 * @param id - レシピID（数値）
 * @returns レシピ詳細情報と更新後のビューカウント
 * @throws {RecipeDetailError} レシピが見つからない、または非公開の場合
 */
export async function getRecipeDetail(id: number): Promise<GetRecipeDetailResult> {
  // レシピ詳細情報を取得（関連データを含む）
  const recipe = await prisma.post.findFirst({
    where: {
      id: BigInt(id),
    },
    include: {
      barista: {
        include: {
          socialLinks: true,
        },
      },
      steps: {
        orderBy: {
          stepOrder: 'asc',
        },
      },
      equipment: {
        include: {
          equipmentType: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // レシピが存在しない場合
  if (!recipe) {
    throw new RecipeDetailError('Recipe not found', 'RECIPE_NOT_FOUND', 404);
  }

  // レシピが非公開の場合
  if (!recipe.isPublished) {
    throw new RecipeDetailError('Recipe is not published', 'RECIPE_NOT_PUBLISHED', 403);
  }

  // ビューカウントを増加（失敗しても処理は継続）
  let newViewCount = recipe.viewCount;
  try {
    const updatedRecipe = await prisma.post.update({
      where: { id: BigInt(id) },
      data: { viewCount: { increment: 1 } },
    });
    newViewCount = updatedRecipe.viewCount;
  } catch {
    // ビューカウント更新の失敗はログに記録するが、処理は継続
    // console.warn('Failed to update view count for recipe:', id, error);
  }

  // レスポンス形式に変換
  const recipeDetail: RecipeDetail = {
    id: recipe.id.toString(),
    title: recipe.title,
    summary: recipe.summary ?? undefined,
    remarks: recipe.remarks ?? undefined,
    roastLevel: recipe.roastLevel,
    grindSize: recipe.grindSize ?? undefined,
    beanWeight: recipe.beanWeight ?? undefined,
    waterTemp: recipe.waterTemp ?? undefined,
    waterAmount: recipe.waterAmount ?? undefined,
    brewingTime: recipe.brewingTime ?? undefined,
    viewCount: recipe.viewCount,
    isPublished: recipe.isPublished,
    publishedAt: recipe.publishedAt?.toISOString() ?? undefined,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    barista: recipe.barista ? mapBarista(recipe.barista) : undefined,
    steps: recipe.steps.map(mapStep),
    equipment: recipe.equipment.map(mapEquipment),
    tags: recipe.tags.map((postTag) => mapTag(postTag.tag)),
  };

  return {
    recipe: recipeDetail,
    newViewCount,
  };
}

/**
 * Prisma Barista を API 型に変換
 */
function mapBarista(barista: {
  id: bigint;
  name: string;
  affiliation: string | null;
  socialLinks: Array<{
    id: bigint;
    platform: string;
    url: string;
  }>;
}): Barista {
  return {
    id: barista.id.toString(),
    name: barista.name,
    affiliation: barista.affiliation ?? undefined,
    socialLinks: barista.socialLinks.map((link) => ({
      id: link.id.toString(),
      platform: link.platform,
      url: link.url,
    })),
  };
}

/**
 * Prisma Step を API 型に変換
 */
function mapStep(step: {
  id: bigint;
  stepOrder: number;
  timeSeconds: number | null;
  description: string;
}): RecipeStep {
  return {
    id: step.id.toString(),
    stepOrder: step.stepOrder,
    timeSeconds: step.timeSeconds ?? undefined,
    description: step.description,
  };
}

/**
 * Prisma Equipment を API 型に変換
 */
function mapEquipment(equipment: {
  id: bigint;
  name: string;
  brand: string | null;
  description: string | null;
  affiliateLink: string | null;
  equipmentType: {
    id: bigint;
    name: string;
    description: string | null;
  };
}): DetailedEquipment {
  return {
    id: equipment.id.toString(),
    name: equipment.name,
    brand: equipment.brand ?? undefined,
    description: equipment.description ?? undefined,
    affiliateLink: equipment.affiliateLink ?? undefined,
    equipmentType: {
      id: equipment.equipmentType.id.toString(),
      name: equipment.equipmentType.name,
      description: equipment.equipmentType.description ?? undefined,
    },
  };
}

/**
 * Prisma Tag を API 型に変換
 */
function mapTag(tag: { id: bigint; name: string; slug: string }): RecipeTag {
  return {
    id: tag.id.toString(),
    name: tag.name,
    slug: tag.slug,
  };
}
