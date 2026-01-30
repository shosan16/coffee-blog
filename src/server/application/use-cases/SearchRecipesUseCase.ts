/**
 * レシピ検索ユースケース
 *
 * ビジネスルールとして以下を実行：
 * 1. 検索パラメータのバリデーション
 * 2. 公開レシピのみの検索
 * 3. フィルタリング・ソート・ページネーション
 * 4. 検索結果の返却
 */

import type { RoastLevel } from '@prisma/client';

import type {
  IRecipeRepository,
  RecipeSearchCriteria,
  RecipeSearchResult,
} from '@/server/domain/recipe/repositories/IRecipeRepository';
import { UseCaseError } from '@/server/shared/errors/DomainError';
import { createChildLogger } from '@/server/shared/logger';

/**
 * レシピ検索ユースケース固有のエラー
 *
 * 共通DomainErrorを継承し、DRY原則に従った設計
 */
export class SearchRecipesUseCaseError extends UseCaseError {
  constructor(
    message: string,
    code: 'INVALID_PARAMS' | 'SEARCH_FAILED',
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }

  /**
   * 無効パラメータエラーを作成
   */
  static invalidParams(
    message: string,
    details?: Record<string, unknown>
  ): SearchRecipesUseCaseError {
    return new SearchRecipesUseCaseError(message, 'INVALID_PARAMS', 400, details);
  }

  /**
   * 検索失敗エラーを作成
   */
  static searchFailed(details?: Record<string, unknown>): SearchRecipesUseCaseError {
    return new SearchRecipesUseCaseError(
      'レシピの検索に失敗しました',
      'SEARCH_FAILED',
      500,
      details
    );
  }
}

/**
 * 検索パラメータ（外部境界からの入力）
 */
export type SearchRecipesInput = {
  readonly page: number;
  readonly limit: number;
  readonly search?: string;
  readonly roastLevel?: RoastLevel[];
  readonly equipment?: string[];
  readonly equipmentType?: string[];
  readonly tags?: string[];
  readonly sort?:
    | 'id'
    | 'title'
    | 'viewCount'
    | 'createdAt'
    | 'updatedAt'
    | 'publishedAt'
    | 'roastLevel';
  readonly order?: 'asc' | 'desc';
};

/**
 * レシピ検索ユースケース
 *
 * SOLID原則に従い、検索ロジックの責任を明確化
 * DRY原則に従い、重複するバリデーションロジックを排除
 */
export class SearchRecipesUseCase {
  private readonly logger = createChildLogger({ useCase: 'SearchRecipesUseCase' });

  constructor(private readonly recipeRepository: IRecipeRepository) {}

  /**
   * レシピを検索する
   *
   * @param input - 検索パラメータ
   * @returns 検索結果
   * @throws {SearchRecipesUseCaseError} バリデーションエラーまたは検索エラーの場合
   */
  async execute(input: SearchRecipesInput): Promise<RecipeSearchResult> {
    this.logger.info({ input }, 'Starting recipe search use case');

    // 1. パラメータバリデーション（KISS原則：シンプルなバリデーション）
    this.validateInput(input);

    // 2. ドメイン検索条件に変換
    const criteria = this.mapToCriteria(input);

    try {
      // 3. 公開レシピのみを検索（ビジネスルール）
      const result = await this.recipeRepository.findPublishedRecipes(criteria);

      this.logger.info(
        {
          recipesFound: result.recipes.length,
          totalItems: result.pagination.totalItems,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
        },
        'Recipe search use case completed successfully'
      );

      return result;
    } catch (error) {
      this.logger.error({ error, input }, 'Recipe search failed');
      // データベースエラーはそのまま上位層に伝播
      throw error;
    }
  }

  /**
   * 入力パラメータのバリデーション
   * YAGNI原則：必要最小限のバリデーション
   */
  private validateInput(input: SearchRecipesInput): void {
    if (input.page < 1) {
      throw SearchRecipesUseCaseError.invalidParams('ページ番号は1以上である必要があります', {
        page: input.page,
      });
    }

    if (input.limit < 1 || input.limit > 100) {
      throw SearchRecipesUseCaseError.invalidParams('取得件数は1から100の間で指定してください', {
        limit: input.limit,
      });
    }
  }

  /**
   * 外部入力をドメイン検索条件に変換
   * 境界層での責務分離
   */
  private mapToCriteria(input: SearchRecipesInput): Omit<RecipeSearchCriteria, 'isPublished'> {
    return {
      page: input.page,
      limit: input.limit,
      searchTerm: input.search,
      roastLevel: input.roastLevel,
      equipmentNames: input.equipment,
      equipmentTypeNames: input.equipmentType,
      tagIds: input.tags,
      sortBy: input.sort,
      sortOrder: input.order,
    };
  }
}
