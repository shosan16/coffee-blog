/**
 * PrismaTagRepository - Prismaを使用したタグリポジトリの実装
 *
 * ITagRepositoryインターフェースの具象実装
 */

import type { PrismaClient } from '@prisma/client';

import type { ITagRepository, TagEntity } from '@/server/domain/recipe/repositories/ITagRepository';
import { logger } from '@/server/shared/logger';

/**
 * Prismaを使用したタグリポジトリの実装
 */
export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 安全にBigIntに変換
   *
   * 数値以外の文字列の場合はnullを返す
   * RecipeMapper.safeBigIntConvertと同等のロジック
   */
  private safeBigIntConvert(value: string): bigint | null {
    try {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return null;
      }
      return BigInt(numValue);
    } catch {
      return null;
    }
  }

  /**
   * IDリストによるタグ取得
   *
   * @param ids - タグIDリスト
   * @returns タグエンティティ配列
   *
   * ビジネスルール:
   * - 空配列を渡した場合、DBアクセスせず空配列を返す
   * - 存在しないIDは無視され、存在するタグのみ返される
   * - 数値以外のIDはスキップされる
   */
  async findByIds(ids: string[]): Promise<TagEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    // 有効なBigInt値のみフィルタリング
    const validBigIntIds = ids
      .map((id) => this.safeBigIntConvert(id))
      .filter((id): id is bigint => id !== null);

    if (validBigIntIds.length === 0) {
      return [];
    }

    try {
      const tags = await this.prisma.tag.findMany({
        where: {
          id: { in: validBigIntIds },
        },
      });

      return tags.map((tag) => ({
        id: tag.id.toString(),
        name: tag.name,
        slug: tag.slug,
      }));
    } catch (error) {
      logger.error('Failed to find tags by ids', { ids, error });
      throw error;
    }
  }
}
