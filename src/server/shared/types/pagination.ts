/**
 * ページネーション・検索・ソート関連の型定義
 * 一覧表示やデータ取得時の制御パラメータを管理
 */

/**
 * ページネーション情報の基本型
 */
export type BasePagination = {
  /** 現在のページ番号 */
  page: number;
  /** 1ページあたりのアイテム数 */
  limit: number;
  /** 総アイテム数 */
  total: number;
  /** 総ページ数 */
  totalPages: number;
};

/**
 * ソート情報の基本型
 */
export type BaseSort = {
  /** ソートするフィールド */
  field: string;
  /** ソート順序 */
  order: 'asc' | 'desc';
};

/**
 * 検索クエリの基本型
 */
export type BaseSearchQuery = {
  /** 検索キーワード */
  query?: string;
  /** ページネーション */
  pagination?: Partial<BasePagination>;
  /** ソート設定 */
  sort?: BaseSort;
};
