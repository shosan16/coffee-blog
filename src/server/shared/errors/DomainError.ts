/**
 * ドメインエラーベースクラス
 *
 * DRY原則に従い、共通のエラーハンドリング機能を提供
 * 全てのユースケースエラーはこのクラスを継承する
 */
export abstract class DomainError extends Error {
  /**
   * ドメインエラーを作成
   *
   * @param message - エラーメッセージ
   * @param code - エラーコード
   * @param statusCode - HTTPステータスコード
   * @param details - エラー詳細情報（オプション）
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;

    // スタックトレースの最適化（V8エンジン対応）
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * エラー情報を構造化オブジェクトで取得
   *
   * @returns 構造化エラー情報
   */
  toStructuredError(): StructuredError {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ログ出力用の構造化エラー情報を取得
   *
   * @returns ログ出力用エラー情報
   */
  toLogContext(): LogErrorContext {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
    };
  }

  /**
   * エラーかどうかを判定する型ガード
   *
   * @param error - 判定対象
   * @returns DomainErrorかどうか
   */
  static isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
  }

  /**
   * 特定のエラーコードかどうかを判定
   *
   * @param error - 判定対象
   * @param code - エラーコード
   * @returns 指定されたエラーコードかどうか
   */
  static hasCode(error: unknown, code: string): boolean {
    return this.isDomainError(error) && error.code === code;
  }
}

/**
 * 構造化エラー情報の型定義
 */
export type StructuredError = {
  readonly name: string;
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;
};

/**
 * ログ出力用エラー情報の型定義
 */
export type LogErrorContext = {
  readonly error: string;
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly stack?: string;
};

/**
 * ユースケースエラーベースクラス
 *
 * アプリケーション層のエラーを表現
 */
export abstract class UseCaseError extends DomainError {
  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}

/**
 * リポジトリエラーベースクラス
 *
 * インフラ層のエラーを表現
 */
export abstract class RepositoryError extends DomainError {
  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}

/**
 * バリデーションエラーベースクラス
 *
 * ドメインオブジェクトのバリデーションエラーを表現
 */
export abstract class ValidationError extends DomainError {
  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}
