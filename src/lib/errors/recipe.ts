import { createErrorMessage, createHttpErrorMessage } from './factory';
import type { ErrorMessage } from './types';

/**
 * レシピ機能に関連するエラーメッセージ
 * レシピ一覧、詳細、検索などで共通して使用される
 */
export const RecipeErrors = {
  /** レシピが見つからない（404） */
  RECIPE_NOT_FOUND: createErrorMessage(
    'レシピが見つかりません',
    '指定されたレシピは存在しません。',
    {
      severity: 'info',
      action: 'レシピ一覧ページから他のレシピをお探しください。',
    }
  ),

  /** レシピへのアクセス権限がない（403相当） */
  RECIPE_ACCESS_DENIED: createErrorMessage(
    'レシピが見つかりません',
    '指定されたレシピは存在しないか、アクセスできません。',
    {
      severity: 'info',
      action: 'URLを確認するか、レシピ一覧ページから探してください。',
    }
  ),

  /** レシピID形式エラー */
  INVALID_RECIPE_ID: createErrorMessage('無効なレシピID', 'レシピIDの形式が正しくありません。', {
    severity: 'warning',
    action: 'URLを確認してください。',
  }),

  /** レシピデータ取得失敗 */
  RECIPE_FETCH_FAILED: createErrorMessage(
    'レシピ取得エラー',
    'レシピ情報の取得中にエラーが発生しました。',
    {
      severity: 'error',
      action: 'しばらく待ってから再度お試しください。',
    }
  ),

  /** レシピメタデータ検証失敗 */
  RECIPE_METADATA_INVALID: createErrorMessage(
    'データ形式エラー',
    'レシピデータの形式に問題があります。',
    {
      severity: 'error',
      action: 'ページを再読み込みしてください。',
    }
  ),

  /** レシピ検索失敗 */
  RECIPE_SEARCH_FAILED: createErrorMessage('検索エラー', 'レシピの検索中にエラーが発生しました。', {
    severity: 'error',
    action: '検索条件を変更して再度お試しください。',
  }),

  /** レシピ一覧取得失敗 */
  RECIPE_LIST_FAILED: createErrorMessage('一覧取得エラー', 'レシピ一覧の取得に失敗しました。', {
    severity: 'error',
    action: 'ページを更新してください。',
  }),
} as const satisfies Record<string, ErrorMessage>;

/**
 * レシピ詳細ページ固有のエラーメッセージ
 * この機能でのみ使用される特殊なエラー
 */
export const RecipeDetailPageErrors = {
  /** メタデータ生成失敗時のフォールバック */
  METADATA_FALLBACK: createErrorMessage(
    'レシピ詳細 - Coffee Recipe Collection',
    'コーヒーレシピの詳細情報をご覧いただけます。',
    {
      severity: 'info',
    }
  ),

  /** ページ表示時のエラーバウンダリー */
  DISPLAY_ERROR: createErrorMessage(
    '表示エラー',
    'レシピ詳細の読み込み中にエラーが発生しました。',
    {
      severity: 'error',
      action: 'ページを更新してください。',
    }
  ),

  /** サーバーサイドエラー */
  SERVER_ERROR: createErrorMessage(
    'サーバーエラー',
    'レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。',
    {
      severity: 'critical',
      action: '時間をおいて再度アクセスしてください。',
    }
  ),
} as const satisfies Record<string, ErrorMessage>;

/**
 * HTTPステータスコードに基づくレシピエラーメッセージ生成
 */
export function createRecipeHttpError(statusCode: number): ErrorMessage {
  return createHttpErrorMessage(statusCode, 'レシピ');
}
