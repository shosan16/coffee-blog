/**
 * フィルターオブジェクトからURLSearchParamsを構築する関数
 */
export function buildQueryParams<T extends Record<string, unknown>>(
  filters: Partial<T>
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
    } else if (typeof value === 'object') {
      params.set(key, JSON.stringify(value));
    } else {
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

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin // ブラウザ環境
        : (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000');

    let urlObj: URL;
    try {
      urlObj = new URL(endpoint);
    } catch {
      urlObj = new URL(endpoint, baseUrl);
    }

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
      const errorData = await response.json().catch(() => ({
        message: 'APIからのレスポンスが正常ではありません',
      }));
      throw new Error(errorData.message ?? 'APIリクエストエラー');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
