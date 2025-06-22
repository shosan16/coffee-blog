/**
 * リクエストID生成・管理ユーティリティ
 */
export class RequestId {
  /**
   * 新しいリクエストIDを生成
   * @returns req_で始まる一意のID
   */
  static generate(): string {
    // crypto.randomUUIDを使用してランダムIDを生成
    const uuid = crypto.randomUUID().replace(/-/g, '');
    return `req_${uuid.slice(0, 12)}`;
  }

  /**
   * リクエストからリクエストIDを取得または生成
   * @param request - Next.js Request オブジェクト
   * @returns リクエストID
   */
  static fromRequest(request: Request): string {
    // ヘッダーから既存のリクエストIDを取得
    const existingId = request.headers.get('x-request-id');
    if (existingId) {
      return existingId;
    }

    // 新しいリクエストIDを生成
    return this.generate();
  }

  /**
   * レスポンスヘッダーにリクエストIDを追加
   * @param headers - HeadersInit オブジェクト
   * @param requestId - リクエストID
   * @returns 更新されたヘッダー
   */
  static addToHeaders(headers: HeadersInit = {}, requestId: string): HeadersInit {
    return {
      ...headers,
      'X-Request-ID': requestId,
    };
  }
}
