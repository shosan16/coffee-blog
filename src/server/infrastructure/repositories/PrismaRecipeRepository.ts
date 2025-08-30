/**
 * PrismaRecipeRepository - Prismaを使用したレシピリポジトリの実装
 *
 * IRecipeRepositoryインターフェースの具象実装
 */

import type { PrismaClient } from '@prisma/client';

import type { Recipe } from '@/server/domain/recipe/entities/recipe';
import type {
  IRecipeRepository,
  RecipeSearchCriteria,
  RecipeSearchResult,
  PaginationInfo,
} from '@/server/domain/recipe/repositories/IRecipeRepository';
import type { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import { logger } from '@/server/shared/logger';

import { RecipeMapper } from './mappers/RecipeMapper';

/**
 * Prismaを使用したレシピリポジトリの実装
 */
export class PrismaRecipeRepository implements IRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * IDによるレシピ取得
   */
  async findById(id: RecipeId): Promise<Recipe | null> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: BigInt(id.value) },
        include: {
          barista: {
            include: {
              socialLinks: true,
            },
          },
          steps: {
            orderBy: { stepOrder: 'asc' },
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

      if (!post) {
        return null;
      }

      return RecipeMapper.toDomain(post);
    } catch (error) {
      logger.error('Failed to find recipe by id', { id: id.value, error });
      // データベースエラーは、そのまま上位層に委譲
      throw error;
    }
  }

  /**
   * 公開レシピをIDで取得
   */
  async findPublishedById(id: RecipeId): Promise<Recipe | null> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: BigInt(id.value),
          isPublished: true,
        },
        include: {
          barista: {
            include: {
              socialLinks: true,
            },
          },
          steps: {
            orderBy: { stepOrder: 'asc' },
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

      if (!post) {
        return null;
      }

      return RecipeMapper.toDomain(post);
    } catch (error) {
      logger.error('Failed to find published recipe by id', { id: id.value, error });
      // データベースエラーは、そのまま上位層に委譲
      throw error;
    }
  }

  /**
   * レシピ検索
   */
  async search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult> {
    try {
      const where = RecipeMapper.toWhereClause(criteria);
      const orderBy = RecipeMapper.toOrderBy(criteria.sortBy, criteria.sortOrder);

      const skip = (criteria.page - 1) * criteria.limit;

      const [posts, totalCount] = await Promise.all([
        this.prisma.post.findMany({
          where,
          include: {
            barista: {
              include: {
                socialLinks: true,
              },
            },
            steps: {
              orderBy: { stepOrder: 'asc' },
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
          orderBy,
          skip,
          take: criteria.limit,
        }),
        this.prisma.post.count({ where }),
      ]);

      const recipes = posts.map((post) => RecipeMapper.toDomain(post));

      const pagination: PaginationInfo = {
        currentPage: criteria.page,
        totalPages: Math.ceil(totalCount / criteria.limit),
        totalItems: totalCount,
        itemsPerPage: criteria.limit,
      };

      return {
        recipes,
        pagination,
      };
    } catch (error) {
      logger.error('Failed to search recipes', { criteria, error });
      // データベースエラーは、そのまま上位層に委譲
      throw error;
    }
  }

  /**
   * 公開レシピ一覧取得
   */
  async findPublishedRecipes(
    criteria: Omit<RecipeSearchCriteria, 'isPublished'>
  ): Promise<RecipeSearchResult> {
    return this.search({
      ...criteria,
      isPublished: true,
    });
  }

  /**
   * バリスタによるレシピ検索
   */
  async findByBarista(
    baristaId: string,
    criteria: Omit<RecipeSearchCriteria, 'baristaId'>
  ): Promise<RecipeSearchResult> {
    return this.search({
      ...criteria,
      baristaId,
    });
  }

  /**
   * レシピの存在確認
   */
  async exists(id: RecipeId): Promise<boolean> {
    try {
      const count = await this.prisma.post.count({
        where: { id: BigInt(id.value) },
      });

      return count > 0;
    } catch (error) {
      logger.error('Failed to check recipe existence', { id: id.value, error });
      throw new Error(`Failed to check recipe existence: ${id.value}`);
    }
  }

  /**
   * 複数レシピのバッチ取得
   */
  async findByIds(ids: RecipeId[]): Promise<Recipe[]> {
    if (ids.length === 0) {
      return [];
    }

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          id: { in: ids.map((id) => BigInt(id.value)) },
        },
        include: {
          barista: {
            include: {
              socialLinks: true,
            },
          },
          steps: {
            orderBy: { stepOrder: 'asc' },
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

      return posts.map((post) => RecipeMapper.toDomain(post));
    } catch (error) {
      logger.error('Failed to find recipes by ids', { ids: ids.map((id) => id.value), error });
      throw new Error('Failed to find recipes by ids');
    }
  }

  /**
   * レシピ数の取得
   */
  async count(criteria: Partial<RecipeSearchCriteria> = {}): Promise<number> {
    try {
      const where = RecipeMapper.toWhereClause(criteria);

      return await this.prisma.post.count({ where });
    } catch (error) {
      logger.error('Failed to count recipes', { criteria, error });
      throw new Error('Failed to count recipes');
    }
  }
}
