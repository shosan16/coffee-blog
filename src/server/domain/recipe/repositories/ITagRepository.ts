/**
 * タグリポジトリインターフェース
 *
 * タグ情報の取得を定義
 */

/**
 * タグエンティティ
 */
export type TagEntity = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
};

/**
 * タグリポジトリインターフェース
 */
export type ITagRepository = {
  /**
   * IDリストによるタグ取得
   *
   * @param ids - タグIDリスト
   * @returns タグエンティティ配列
   */
  findByIds(ids: string[]): Promise<TagEntity[]>;
};
