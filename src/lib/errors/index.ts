/**
 * エラーメッセージの統合エクスポート
 * アプリケーション全体でのエラー管理の統一インターフェース
 */

// 型定義
export type { ErrorMessage, ErrorContext, ErrorMessageFactory } from './types';

// ファクトリー関数
export { createErrorMessage, createDynamicErrorMessage, createHttpErrorMessage } from './factory';

// 共通エラーメッセージ
export { CommonErrors } from './common';

// レシピ関連エラーメッセージ
export { RecipeErrors, RecipeDetailPageErrors, createRecipeHttpError } from './recipe';

/**
 * 使用頻度による分類ガイド
 *
 * 【CommonErrors】- 3箇所以上で使用される汎用エラー
 * - NETWORK_ERROR
 * - PERMISSION_DENIED
 * - DATA_FETCH_FAILED
 * - VALIDATION_ERROR
 * - SERVICE_UNAVAILABLE
 * - UNEXPECTED_ERROR
 *
 * 【RecipeErrors】- レシピ機能で共通して使用されるエラー
 * - RECIPE_NOT_FOUND (詳細・一覧・検索で使用)
 * - RECIPE_ACCESS_DENIED (詳細・APIで使用)
 * - RECIPE_FETCH_FAILED (詳細・一覧で使用)
 * - INVALID_RECIPE_ID (詳細・API・URLパラメータで使用)
 *
 * 【RecipeDetailPageErrors】- 詳細ページでのみ使用される特殊エラー
 * - METADATA_FALLBACK (メタデータ生成専用)
 * - DISPLAY_ERROR (エラーバウンダリ専用)
 * - SERVER_ERROR (SSRエラー専用)
 *
 * 【コンポーネント内定義推奨】- 単一コンポーネントでのみ使用
 * - フォーム固有のバリデーションメッセージ
 * - 特定UIコンポーネントの状態メッセージ
 * - 一回限りの操作結果メッセージ
 */
