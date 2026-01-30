import type { RoastLevel } from '@prisma/client';

import type { Recipe } from '../entities/recipe';
import type { RecipeId } from '../value-objects/RecipeId';

/**
 * レシピ検索条件
 */
export type RecipeSearchCriteria = {
  // テキスト検索
  readonly searchTerm?: string;

  // 基本フィルター
  readonly roastLevel?: RoastLevel[];

  // 関連エンティティフィルター
  readonly equipmentIds?: string[];
  readonly equipmentNames?: string[];
  readonly equipmentTypeNames?: string[];
  readonly tagIds?: string[];
  readonly baristaId?: string;

  // 状態フィルター
  readonly isPublished?: boolean;

  // ソート条件
  readonly sortBy?:
    | 'id'
    | 'title'
    | 'viewCount'
    | 'createdAt'
    | 'updatedAt'
    | 'publishedAt'
    | 'roastLevel';
  readonly sortOrder?: 'asc' | 'desc';

  // ページネーション
  readonly page: number;
  readonly limit: number;
};

/**
 * ページネーション情報
 */
export type PaginationInfo = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
};

/**
 * レシピ検索結果
 */
export type RecipeSearchResult = {
  readonly recipes: Recipe[];
  readonly pagination: PaginationInfo;
};

/**
 * レシピリポジトリインターフェース
 *
 * レシピエンティティの永続化とクエリ操作を定義
 * ドメイン層とインフラ層の境界を明確にする
 */
export type IRecipeRepository = {
  /**
   * IDによるレシピ取得
   *
   * @param id - レシピID
   * @returns レシピエンティティ（見つからない場合はnull）
   * @throws Error データアクセスエラーの場合
   */
  findById(id: RecipeId): Promise<Recipe | null>;

  /**
   * 公開レシピをIDで取得
   *
   * @param id - レシピID
   * @returns 公開レシピエンティティ（見つからない場合やnull非公開の場合はnull）
   * @throws Error データアクセスエラーの場合
   */
  findPublishedById(id: RecipeId): Promise<Recipe | null>;

  /**
   * レシピ検索
   *
   * @param criteria - 検索条件
   * @returns 検索結果
   * @throws Error 検索エラーの場合
   */
  search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult>;

  /**
   * 公開レシピ一覧取得
   *
   * @param criteria - 検索条件（isPublishedは自動的にtrueに設定）
   * @returns 検索結果
   * @throws Error 検索エラーの場合
   */
  findPublishedRecipes(
    criteria: Omit<RecipeSearchCriteria, 'isPublished'>
  ): Promise<RecipeSearchResult>;

  /**
   * バリスタによるレシピ検索
   *
   * @param baristaId - バリスタID
   * @param criteria - 検索条件（baristaIdは自動的に設定）
   * @returns 検索結果
   * @throws Error 検索エラーの場合
   */
  findByBarista(
    baristaId: string,
    criteria: Omit<RecipeSearchCriteria, 'baristaId'>
  ): Promise<RecipeSearchResult>;

  /**
   * レシピの存在確認
   *
   * @param id - レシピID
   * @returns 存在するかどうか
   * @throws Error チェックエラーの場合
   */
  exists(id: RecipeId): Promise<boolean>;

  /**
   * 複数レシピのバッチ取得
   *
   * @param ids - レシピID配列
   * @returns レシピエンティティ配列
   * @throws Error 取得エラーの場合
   */
  findByIds(ids: RecipeId[]): Promise<Recipe[]>;

  /**
   * レシピ数の取得
   *
   * @param criteria - カウント条件
   * @returns レシピ数
   * @throws Error カウントエラーの場合
   */
  count(criteria?: Partial<RecipeSearchCriteria>): Promise<number>;
};
