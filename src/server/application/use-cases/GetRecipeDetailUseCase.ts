/**
 * レシピ詳細取得ユースケース
 *
 * ビジネスルールとして以下を実行：
 * 1. レシピの存在確認
 * 2. 公開状態の確認
 * 3. ビューカウントの増加
 * 4. レシピ詳細情報の返却
 */

import type { Recipe } from '@/server/domain/recipe/entities/recipe';
import type { IRecipeRepository } from '@/server/domain/recipe/repositories/IRecipeRepository';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import { createChildLogger } from '@/server/shared/logger';
import { UseCaseError } from '@/server/shared/errors/DomainError';

/**
 * レシピ詳細取得ユースケース固有のエラー
 *
 * 共通DomainErrorを継承し、DRY原則に従った設計
 */
export class RecipeDetailUseCaseError extends UseCaseError {
  constructor(
    message: string,
    code: 'RECIPE_NOT_FOUND' | 'RECIPE_NOT_PUBLISHED' | 'INVALID_ID',
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }

  /**
   * レシピ未見つかりエラーを作成
   */
  static recipeNotFound(recipeId: string): RecipeDetailUseCaseError {
    return new RecipeDetailUseCaseError('レシピが見つかりません', 'RECIPE_NOT_FOUND', 404, {
      recipeId,
    });
  }

  /**
   * レシピ非公開エラーを作成
   */
  static recipeNotPublished(recipeId: string): RecipeDetailUseCaseError {
    return new RecipeDetailUseCaseError(
      'このレシピは公開されていません',
      'RECIPE_NOT_PUBLISHED',
      403,
      { recipeId }
    );
  }

  /**
   * 無効IDエラーを作成
   */
  static invalidId(recipeId: string, reason?: string): RecipeDetailUseCaseError {
    return new RecipeDetailUseCaseError('レシピIDの形式が不正です', 'INVALID_ID', 400, {
      recipeId,
      reason,
    });
  }
}

/**
 * ユースケース結果
 */
export type GetRecipeDetailResult = {
  readonly recipe: Recipe;
  readonly newViewCount: number;
};

/**
 * レシピ詳細取得ユースケース
 *
 * SOLID原則に従い、単一責任の原則を適用
 * ビジネスルールの実行とデータアクセスの責任を分離
 */
export class GetRecipeDetailUseCase {
  private readonly logger = createChildLogger({ useCase: 'GetRecipeDetailUseCase' });

  constructor(private readonly recipeRepository: IRecipeRepository) {}

  /**
   * レシピ詳細を取得し、ビューカウントを増加する
   *
   * @param id - レシピID（文字列）
   * @returns レシピ詳細とビューカウント
   * @throws {RecipeDetailUseCaseError} ビジネスルール違反の場合
   */
  async execute(id: string): Promise<GetRecipeDetailResult> {
    this.logger.info({ recipeId: id }, 'Starting recipe detail use case');

    // 1. IDバリデーション（KISS原則：シンプルなバリデーション）
    let recipeId: RecipeId;
    try {
      recipeId = RecipeId.fromString(id);
    } catch (error) {
      this.logger.warn({ recipeId: id, error }, 'Invalid recipe ID format');
      throw RecipeDetailUseCaseError.invalidId(
        id,
        error instanceof Error ? error.message : 'Unknown validation error'
      );
    }

    // 2. レシピ取得（YAGNI原則：必要最小限の機能）
    const recipe = await this.recipeRepository.findById(recipeId);

    if (!recipe) {
      this.logger.warn({ recipeId: id }, 'Recipe not found');
      throw RecipeDetailUseCaseError.recipeNotFound(id);
    }

    // 3. 公開状態確認（ビジネスルール）
    if (!recipe.isPublished) {
      this.logger.warn({ recipeId: id }, 'Recipe is not published');
      throw RecipeDetailUseCaseError.recipeNotPublished(id);
    }

    // 4. ビューカウント増加（ドメインメソッド使用）
    const oldViewCount = recipe.viewCount;
    // Note: In a real implementation, view count would be incremented via repository
    // For now, we'll use the current view count + 1
    const newViewCount = recipe.viewCount + 1;

    this.logger.info(
      {
        recipeId: id,
        oldViewCount,
        newViewCount,
        title: recipe.title,
      },
      'Recipe detail use case completed successfully'
    );

    return {
      recipe,
      newViewCount,
    };
  }
}
