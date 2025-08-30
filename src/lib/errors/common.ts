import { createErrorMessage } from './factory';
import type { ErrorMessage } from './types';

/**
 * アプリケーション全体で共通して使用されるエラーメッセージ
 * 3箇所以上で使用される、または将来的に複数箇所で使用予定のエラー
 */
export const CommonErrors = {
  /** ネットワーク接続エラー */
  NETWORK_ERROR: createErrorMessage(
    'ネットワークエラー',
    'インターネット接続を確認してください。',
    {
      severity: 'warning',
      action: 'ネットワーク接続を確認して再度お試しください。',
    }
  ),

  /** 権限不足エラー */
  PERMISSION_DENIED: createErrorMessage(
    'アクセス権限がありません',
    'この操作を実行する権限がありません。',
    {
      severity: 'warning',
      action: 'ログインするか、管理者に連絡してください。',
    }
  ),

  /** データ取得失敗 */
  DATA_FETCH_FAILED: createErrorMessage('データ取得エラー', 'データの取得に失敗しました。', {
    severity: 'error',
    action: '少し時間をおいてから再度お試しください。',
  }),

  /** バリデーションエラー */
  VALIDATION_ERROR: createErrorMessage('入力エラー', '入力された内容に問題があります。', {
    severity: 'warning',
    action: '入力内容を確認して修正してください。',
  }),

  /** システム一時利用不可 */
  SERVICE_UNAVAILABLE: createErrorMessage(
    'サービス一時停止中',
    'システムメンテナンス中です。しばらくお待ちください。',
    {
      severity: 'info',
      action: 'メンテナンス完了までお待ちください。',
    }
  ),

  /** 予期しないエラー */
  UNEXPECTED_ERROR: createErrorMessage('予期しないエラー', '予期しない問題が発生しました。', {
    severity: 'critical',
    action: 'ページを更新するか、サポートに連絡してください。',
  }),
} as const satisfies Record<string, ErrorMessage>;
