import type { RoastLevel, GrindSize } from '@prisma/client';

import type {
  SearchRecipesParams,
  SearchRecipesResult,
  PrismaWhereClause,
  PrismaOrderByClause,
  Recipe,
  EquipmentCondition,
} from '@/server/features/recipes/search/types';
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
   * 焙煎レベルフィルターを構築
   */
  private buildRoastLevelFilter(params: SearchRecipesParams): Partial<PrismaWhereClause> {
    if (!params.roastLevel?.length) return {};
    return {
      roastLevel: {
        in: params.roastLevel,
      },
    };
  }

  /**
   * 挽き目フィルターを構築
   */
  private buildGrindSizeFilter(params: SearchRecipesParams): Partial<PrismaWhereClause> {
    if (!params.grindSize?.length) return {};
    return {
      grindSize: {
        in: params.grindSize,
      },
    };
  }

  /**
   * 器具フィルターを構築
   */
  private buildEquipmentFilter(params: SearchRecipesParams): Partial<PrismaWhereClause> {
    const equipmentConditions: EquipmentCondition[] = [];

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

    if (equipmentConditions.length === 0) return {};
    return { AND: equipmentConditions };
  }

  /**
   * 数値範囲フィルターを構築
   */
  private buildRangeFilter(
    range: { min?: number; max?: number } | undefined
  ): { gte?: number; lte?: number } | undefined {
    if (!range || (range.min === undefined && range.max === undefined)) {
      return undefined;
    }

    const filter: { gte?: number; lte?: number } = {};
    if (range.min !== undefined) {
      filter.gte = range.min;
    }
    if (range.max !== undefined) {
      filter.lte = range.max;
    }
    return filter;
  }

  /**
   * 検索キーワードフィルターを構築
   */
  private buildSearchFilter(searchTerm: string | undefined): Partial<PrismaWhereClause> {
    if (!searchTerm) return {};
    return {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };
  }

  /**
   * WHERE句を構築する
   */
  private buildWhereClause(params: SearchRecipesParams): PrismaWhereClause {
    const where: PrismaWhereClause = {
      isPublished: true, // 公開済みの投稿のみを取得
    };

    // 各フィルターを適用
    Object.assign(where, this.buildRoastLevelFilter(params));
    Object.assign(where, this.buildGrindSizeFilter(params));
    Object.assign(where, this.buildEquipmentFilter(params));
    Object.assign(where, this.buildSearchFilter(params.search));

    // 数値範囲フィルター
    const beanWeightFilter = this.buildRangeFilter(params.beanWeight);
    if (beanWeightFilter) {
      where.beanWeight = beanWeightFilter;
    }

    const waterTempFilter = this.buildRangeFilter(params.waterTemp);
    if (waterTempFilter) {
      where.waterTemp = waterTempFilter;
    }

    const waterAmountFilter = this.buildRangeFilter(params.waterAmount);
    if (waterAmountFilter) {
      where.waterAmount = waterAmountFilter;
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
