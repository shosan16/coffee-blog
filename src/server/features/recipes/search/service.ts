import { RoastLevel, GrindSize } from '@prisma/client';

import type {
  SearchRecipesParams,
  SearchRecipesResult,
  PrismaWhereClause,
  PrismaOrderByClause,
} from '@/server/features/recipes/search/types';
import type { Recipe } from '@/server/features/recipes/types/recipe';
import { prisma } from '@/server/shared/database/prisma';

// Prismaから取得するPost型の定義
type PostWithRelations = {
  id: bigint;
  title: string;
  summary: string | null;
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number | null;
  waterTemp: number | null;
  waterAmount: number | null;
  equipment: Array<{
    name: string;
    equipmentType: {
      id: bigint;
      name: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: bigint;
      name: string;
    };
  }>;
};

export class SearchRecipesService {
  /**
   * WHERE句を構築する
   */
  private buildWhereClause(params: SearchRecipesParams): PrismaWhereClause {
    const where: PrismaWhereClause = {
      isPublished: true, // 公開済みの投稿のみを取得
    };

    // 焙煎レベルフィルター
    if (params.roastLevel?.length) {
      where.roastLevel = {
        in: params.roastLevel,
      };
    }

    // 挽き目フィルター
    if (params.grindSize?.length) {
      where.grindSize = {
        in: params.grindSize,
      };
    }

    // 器具フィルター
    if (params.equipment?.length) {
      where.equipment = {
        some: {
          name: {
            in: params.equipment,
          },
        },
      };
    }

    // 豆の重量フィルター
    if (params.beanWeight) {
      const { min, max } = params.beanWeight;
      if (min !== undefined || max !== undefined) {
        where.beanWeight = {};
        if (min !== undefined) {
          where.beanWeight.gte = min;
        }
        if (max !== undefined) {
          where.beanWeight.lte = max;
        }
      }
    }

    // 水温フィルター
    if (params.waterTemp) {
      const { min, max } = params.waterTemp;
      if (min !== undefined || max !== undefined) {
        where.waterTemp = {};
        if (min !== undefined) {
          where.waterTemp.gte = min;
        }
        if (max !== undefined) {
          where.waterTemp.lte = max;
        }
      }
    }

    // 検索キーワードフィルター
    if (params.search) {
      const searchTerm = params.search;
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * ORDER BY句を構築する
   */
  private buildOrderByClause(params: SearchRecipesParams): PrismaOrderByClause {
    const orderBy: PrismaOrderByClause = {};

    if (params.sort) {
      orderBy[params.sort] = params.order || 'asc';
    } else {
      orderBy.id = 'asc'; // デフォルトはID昇順
    }

    return orderBy;
  }

  /**
   * ページネーション設定を構築する
   */
  private buildPaginationClause(params: SearchRecipesParams) {
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    return { skip, take };
  }

  /**
   * データベースから取得したデータをAPIレスポンス形式に変換する
   */
  private transformToRecipes(posts: PostWithRelations[]): Recipe[] {
    return posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      summary: post.summary || '',
      equipment: post.equipment.map((eq) => eq.name),
      roastLevel: post.roastLevel,
      grindSize: post.grindSize,
      beanWeight: post.beanWeight || 0,
      waterTemp: post.waterTemp || 0,
      waterAmount: post.waterAmount || 0,
    }));
  }

  /**
   * レシピを検索する
   */
  async searchRecipes(params: SearchRecipesParams): Promise<SearchRecipesResult> {
    const where = this.buildWhereClause(params);
    const orderBy = this.buildOrderByClause(params);
    const { skip, take } = this.buildPaginationClause(params);

    // データベースからデータを取得
    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
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
      }),
    ]);

    // データ変換
    const recipes = this.transformToRecipes(posts as unknown as PostWithRelations[]);

    return {
      recipes,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(totalCount / params.limit),
        totalItems: totalCount,
        itemsPerPage: params.limit,
      },
    };
  }
}
