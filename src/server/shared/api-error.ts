/**
 * 統一エラーレスポンス型（OpenAPI仕様準拠）
 */
export type ErrorResponse = {
  /** エラータイプ（機械読み取り用） */
  error: string;
  /** エラーメッセージ（人間読み取り用） */
  message: string;
  /** リクエスト追跡ID */
  request_id: string;
  /** エラー発生時刻（ISO 8601形式） */
  timestamp: string;
  /** エラーの詳細情報（オプション） */
  details?: {
    fields?: Array<{
      field: string;
      message: string;
    }>;
    [key: string]: unknown;
  };
};

/**
 * エラータイプの定数定義
 */
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

/**
 * エラーレスポンス作成ユーティリティ
 */
export class ApiError {
  /**
   * バリデーションエラーを作成
   */
  static validation(
    message: string,
    requestId: string,
    fieldErrors?: Array<{ field: string; message: string }>
  ): ErrorResponse {
    return {
      error: ERROR_TYPES.VALIDATION_ERROR,
      message,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      details: fieldErrors ? { fields: fieldErrors } : undefined,
    };
  }

  /**
   * パラメータエラーを作成
   */
  static invalidParameter(message: string, requestId: string): ErrorResponse {
    return {
      error: ERROR_TYPES.INVALID_PARAMETER,
      message,
      request_id: requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 必須フィールド不足エラーを作成
   */
  static missingField(
    message: string,
    requestId: string,
    fieldErrors: Array<{ field: string; message: string }>
  ): ErrorResponse {
    return {
      error: ERROR_TYPES.MISSING_REQUIRED_FIELD,
      message,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      details: { fields: fieldErrors },
    };
  }

  /**
   * リソース未発見エラーを作成
   */
  static notFound(message: string, requestId: string): ErrorResponse {
    return {
      error: ERROR_TYPES.RESOURCE_NOT_FOUND,
      message,
      request_id: requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * サーバー内部エラーを作成
   */
  static internal(message: string, requestId: string): ErrorResponse {
    return {
      error: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message,
      request_id: requestId,
      timestamp: new Date().toISOString(),
    };
  }
}
