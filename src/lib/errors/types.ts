/**
 * エラーメッセージの型定義
 * i18n対応とアクセシビリティを考慮した設計
 */
export type ErrorMessage = {
  /** エラーのタイトル（見出し） */
  title: string;
  /** エラーの詳細説明 */
  description: string;
  /** ユーザーが取るべきアクション（オプション） */
  action?: string;
  /** エラーの重要度レベル */
  severity?: 'info' | 'warning' | 'error' | 'critical';
};

/**
 * エラーコンテキスト - ログ出力時に使用
 */
export type ErrorContext = {
  /** 操作名 */
  operation: string;
  /** ユーザーID（存在する場合） */
  userId?: string;
  /** リクエストID */
  requestId?: string;
  /** 追加のコンテキスト情報 */
  metadata?: Record<string, unknown>;
};

/**
 * エラーメッセージファクトリー関数の型
 */
export type ErrorMessageFactory = (context?: Partial<ErrorContext>) => ErrorMessage;
