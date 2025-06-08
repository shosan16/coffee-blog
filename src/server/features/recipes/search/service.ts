import { RoastLevel, GrindSize } from '@prisma/client';

import type {
  SearchRecipesParams,
  SearchRecipesResult,
  PrismaWhereClause,
  PrismaOrderByClause,
} from '@/server/features/recipes/search/types';
import type { Recipe } from '@/server/features/recipes/types/recipe';
import { prisma } from '@/server/shared/database/prisma';
import { createChildLogger, measurePerformance } from '@/server/shared/logger';

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
  private readonly logger = createChildLogger({ service: 'SearchRecipesService' });

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

    // 器具フィルター（器具名と器具タイプの組み合わせ）
    const equipmentConditions = [];

    if (params.equipment?.length) {
      equipmentConditions.push({
        equipment: {
          some: {
            name: {
              in: params.equipment,
            },
          },
        },
      });
    }

    if (params.equipmentType?.length) {
      equipmentConditions.push({
        equipment: {
          some: {
            equipmentType: {
              name: {
                in: params.equipmentType,
              },
            },
          },
        },
      });
    }

    if (equipmentConditions.length > 0) {
      where.AND = equipmentConditions;
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

    // 水量フィルター
    if (params.waterAmount) {
      const { min, max } = params.waterAmount;
      if (min !== undefined || max !== undefined) {
        where.waterAmount = {};
        if (min !== undefined) {
          where.waterAmount.gte = min;
        }
        if (max !== undefined) {
          where.waterAmount.lte = max;
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
      orderBy[params.sort] = params.order ?? 'asc';
    } else {
      orderBy.id = 'asc'; // デフォルトはID昇順
    }

    return orderBy;
  }

  /**
   * ページネーション設定を構築する
   */
  private buildPaginationClause(params: SearchRecipesParams): { skip: number; take: number } {
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
      summary: post.summary ?? '',
      equipment: post.equipment.map((eq) => eq.name),
      roastLevel: post.roastLevel,
      grindSize: post.grindSize,
      beanWeight: post.beanWeight ?? 0,
      waterTemp: post.waterTemp ?? 0,
      waterAmount: post.waterAmount ?? 0,
    }));
  }

  /**
   * レシピを検索する
   */
  async searchRecipes(params: SearchRecipesParams): Promise<SearchRecipesResult> {
    const timer = measurePerformance('searchRecipesService');

    try {
      this.logger.info({ params }, 'Starting recipe search');

      const whereTimer = measurePerformance('buildWhereClause');
      const where = this.buildWhereClause(params);
      whereTimer.end();
      this.logger.debug({ where }, 'WHERE clause built');

      const orderByTimer = measurePerformance('buildOrderByClause');
      const orderBy = this.buildOrderByClause(params);
      orderByTimer.end();
      this.logger.debug({ orderBy }, 'ORDER BY clause built');

      const { skip, take } = this.buildPaginationClause(params);
      this.logger.debug({ skip, take }, 'Pagination parameters calculated');

      this.logger.debug('Testing database connection');
      await prisma.$connect();
      this.logger.debug('Database connection established');

      // データベースからデータを取得
      this.logger.info('Executing database queries');
      const dbTimer = measurePerformance('databaseQueries');

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

      dbTimer.end();
      this.logger.info({ totalCount, postsRetrieved: posts.length }, 'Database queries completed');

      // データ変換
      this.logger.debug('Transforming data to recipe format');
      const transformTimer = measurePerformance('dataTransformation');
      const recipes = this.transformToRecipes(posts as unknown as PostWithRelations[]);
      transformTimer.end();

      this.logger.debug({ recipesTransformed: recipes.length }, 'Data transformation completed');

      const result = {
        recipes,
        pagination: {
          currentPage: params.page,
          totalPages: Math.ceil(totalCount / params.limit),
          totalItems: totalCount,
          itemsPerPage: params.limit,
        },
      };

      timer.end();
      this.logger.info(
        {
          totalRecipes: result.recipes.length,
          totalItems: result.pagination.totalItems,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
        },
        'Recipe search completed successfully'
      );

      return result;
    } catch (error) {
      timer.end();
      this.logger.error(
        {
          err: error,
          params,
        },
        'Error occurred during recipe search'
      );
      throw error;
    }
  }
}
