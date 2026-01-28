import type { ReadonlyURLSearchParams } from 'next/navigation';
/**
 * URLのsearchParamsから指定された型に合わせてフィルター条件を解析する汎用関数
 * @param searchParams - ReadonlyURLSearchParamsオブジェクト
 * @param config - パラメータの変換設定
 * @returns 解析されたフィルターオブジェクト
 */
export function parseFiltersFromSearchParams<T extends Record<string, unknown>>(
  searchParams: ReadonlyURLSearchParams | null,
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

  if (!searchParams) {
    return filters;
  }

  config.stringParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      (filters as Record<string, unknown>)[param] = value;
    }
  });

  config.numberParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        (filters as Record<string, unknown>)[param] = parsed;
      }
    }
  });

  config.booleanParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value !== null) {
      (filters as Record<string, unknown>)[param] = value === 'true';
    }
  });

  if (config.arrayParams) {
    Object.entries(config.arrayParams).forEach(([param, converter]) => {
      const value = searchParams.get(param);
      if (value) {
        (filters as Record<string, unknown>)[param] = value.split(',').map(converter);
      }
    });
  }

  config.jsonParams?.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      try {
        (filters as Record<string, unknown>)[param] = JSON.parse(value);
      } catch {
        // JSON解析エラーの場合は無視
      }
    }
  });

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
