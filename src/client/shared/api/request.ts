/**
 * フィルターオブジェクトからURLSearchParamsを構築する関数
 */
export function buildQueryParams<T extends Record<string, unknown>>(
  filters: Partial<T>
): URLSearchParams {
  const params = new URLSearchParams();

  // オブジェクトのエントリを反復処理
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      // 配列は文字列としてシリアル化
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
    } else if (typeof value === 'object') {
      // オブジェクトはJSONとしてシリアル化
      params.set(key, JSON.stringify(value));
    } else {
      // プリミティブ値はそのまま文字列化
      params.set(key, String(value));
    }
  });

  return params;
}

/**
 * API通信の基本設定
 */
export type ApiRequestOptions = RequestInit & {
  params?: Record<string, unknown>;
};

/**
 * 汎用的なAPIリクエスト関数
 */
export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  try {
    const { params, ...requestOptions } = options;

    // ベースURLの設定
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin // ブラウザ環境
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    let urlObj: URL;
    try {
      // endpointが既に完全なURLの場合
      urlObj = new URL(endpoint);
    } catch {
      // endpointが相対パスの場合
      urlObj = new URL(endpoint, baseUrl);
    }

    // クエリパラメータの追加
    if (params) {
      const queryParams = buildQueryParams(params);
      queryParams.forEach((value, key) => {
        urlObj.searchParams.append(key, value);
      });
    }

    const response = await fetch(urlObj.toString(), {
      ...requestOptions,
      headers: {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      },
    });

    if (!response.ok) {
      // エラーレスポンスをJSON解析して投げる
      const errorData = await response.json().catch(() => ({
        message: 'APIからのレスポンスが正常ではありません',
      }));
      throw new Error(errorData.message || 'APIリクエストエラー');
    }

    return await response.json();
  } catch (error) {
    console.error('APIリクエストエラー:', error);
    throw error;
  }
}
