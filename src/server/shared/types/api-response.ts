/**
 * API レスポンス関連の型定義
 * HTTP レスポンスの構造とメタデータを管理
 */

import type { BaseTimestamp } from './primitives';

/**
 * 基本的なレスポンス構造
 */
export type BaseResponse = {
  /** レスポンスタイムスタンプ */
  timestamp: BaseTimestamp;
  /** リクエストID */
  request_id?: string;
};

/**
 * API レスポンスのメタデータ
 */
export type ResponseMetadata = BaseResponse & {
  /** 処理時間（ミリ秒） */
  processing_time_ms?: number;
  /** キャッシュ情報 */
  cache_info?: {
    hit: boolean;
    ttl?: number;
  };
};
