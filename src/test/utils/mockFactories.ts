import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { vi } from 'vitest';

/**
 * Next.js useSearchParams用のモックを作成
 */
export const createMockSearchParams = (
  params: Record<string, string> = {}
): ReadonlyURLSearchParams => {
  const searchParams = new URLSearchParams(params);
  return {
    get: vi.fn((key: string) => searchParams.get(key)),
    has: vi.fn((key: string) => searchParams.has(key)),
    keys: vi.fn((): { [Symbol.iterator]: () => Iterator<string> } => ({
      [Symbol.iterator]: (): Iterator<string> => {
        const keys = Array.from(searchParams.keys());
        let index = 0;
        return {
          next: () => ({
            done: index >= keys.length,
            value: keys[index++],
          }),
        };
      },
    })),
    values: vi.fn((): { [Symbol.iterator]: () => Iterator<string> } => ({
      [Symbol.iterator]: (): Iterator<string> => {
        const values = Array.from(searchParams.values());
        let index = 0;
        return {
          next: () => ({
            done: index >= values.length,
            value: values[index++],
          }),
        };
      },
    })),
    entries: vi.fn((): { [Symbol.iterator]: () => Iterator<[string, string]> } => ({
      [Symbol.iterator]: (): Iterator<[string, string]> => {
        const entries = Array.from(searchParams.entries());
        let index = 0;
        return {
          next: () => ({
            done: index >= entries.length,
            value: entries[index++],
          }),
        };
      },
    })),
    forEach: vi.fn((callback: (value: string, key: string) => void) => {
      searchParams.forEach(callback);
    }),
    toString: vi.fn(() => searchParams.toString()),
    size: searchParams.size,
    [Symbol.iterator]: vi.fn(() => searchParams.entries()),
  } as unknown as ReadonlyURLSearchParams;
};

/**
 * Next.js useRouter用のモックを作成
 */
export const createMockRouter = (): AppRouterInstance => {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  } as AppRouterInstance;
};

/**
 * 統一されたモッククリーンアップ関数
 */
export const cleanupAllMocks = (): void => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
};

/**
 * Next.js navigationモックのリセット関数
 */
export const resetNavigationMocks = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRouter: ReturnType<typeof vi.mocked<any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSearchParams: ReturnType<typeof vi.mocked<any>>,
  routerOptions: Partial<AppRouterInstance> = {},
  searchParamsOptions: Record<string, string> = {}
): { mockRouter: AppRouterInstance; mockSearchParams: ReadonlyURLSearchParams } => {
  const mockRouter = createMockRouter();
  const mockSearchParams = createMockSearchParams(searchParamsOptions);

  // オプションでルーターをカスタマイズ
  Object.assign(mockRouter, routerOptions);

  useRouter.mockReturnValue(mockRouter);
  useSearchParams.mockReturnValue(mockSearchParams);

  return { mockRouter, mockSearchParams };
};
