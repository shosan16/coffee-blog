import { ReadonlyURLSearchParams } from 'next/navigation';
/**
 * URLのsearchParamsから指定された型に合わせてフィルター条件を解析する汎用関数
 * @param searchParams - ReadonlyURLSearchParamsオブジェクト
 * @param config - パラメータの変換設定
 * @returns 解析されたフィルターオブジェクト
 */
export function parseFiltersFromSearchParams<T extends Record<string, unknown>>(
  searchParams: ReadonlyURLSearchParams,
  config: {
    stringParams?: string[];
    numberParams?: string[];
    booleanParams?: string[];
    arrayParams?: Record<string, (value: string) => unknown>;
    jsonParams?: string[];
    enumParams?: Record<string, string[]>;
  }
): Partial<T> {
  const filters = {} as Partial<T>;

  // 文字列パラメータの処理
  config.stringParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      (filters as Record<string, unknown>)[param] = value;
    }
  });

  // 数値パラメータの処理
  config.numberParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        (filters as Record<string, unknown>)[param] = parsed;
      }
    }
  });

  // 真偽値パラメータの処理
  config.booleanParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value !== null) {
      (filters as Record<string, unknown>)[param] = value === 'true';
    }
  });

  // 配列パラメータの処理
  if (config.arrayParams) {
    Object.entries(config.arrayParams).forEach(([param, converter]) => {
      const value = searchParams.get(param);
      if (value) {
        (filters as Record<string, unknown>)[param] = value.split(',').map(converter);
      }
    });
  }

  // JSON形式のパラメータの処理
  config.jsonParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      try {
        (filters as Record<string, unknown>)[param] = JSON.parse(value);
      } catch (e) {
        console.error(`${param}の解析エラー:`, e);
      }
    }
  });

  // 列挙型パラメータの処理
  if (config.enumParams) {
    Object.entries(config.enumParams).forEach(([param, allowedValues]) => {
      const value = searchParams.get(param);
      if (value && allowedValues.includes(value)) {
        (filters as Record<string, unknown>)[param] = value;
      }
    });
  }

  return filters;
}
