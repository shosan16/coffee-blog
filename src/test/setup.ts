import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// JSDOMで不足しているWeb APIのモック
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
});

// HTMLElementのstyleプロパティにpointerEventsを追加
Object.defineProperty(HTMLElement.prototype, 'style', {
  value: new Proxy(
    {
      // CSSStyleDeclarationの基本メソッドを追加
      setProperty: vi.fn(),
      removeProperty: vi.fn(),
      getPropertyValue: vi.fn((prop) => {
        if (prop === 'pointer-events') return 'auto';
        return '';
      }),
    } as Record<string, unknown>,
    {
      get(target, prop): unknown {
        const key = String(prop);
        if (key === 'pointerEvents') return 'auto';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (key === 'setProperty') return (target as any).setProperty;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (key === 'removeProperty') return (target as any).removeProperty;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (key === 'getPropertyValue') return (target as any).getPropertyValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (target as any)[key] ?? '';
      },
      set(target, prop, value): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[String(prop)] = value;
        return true;
      },
    }
  ),
  writable: true,
  configurable: true,
});

// ResizeObserverのモック（Radix UI等で使用）
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// MutationObserverのモック（DOM変更監視用）
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}));

// IntersectionObserverのモック（要素の可視性監視用）
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// matchMediaのモック（レスポンシブデザイン用）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// getComputedStyleのモック（スタイル計算用）
global.getComputedStyle = vi.fn().mockImplementation((_element) => ({
  getPropertyValue: vi.fn((property) => {
    if (property === 'pointer-events') return 'auto';
    return '';
  }),
  pointerEvents: 'auto', // userEventのpointerEvents チェック対応
}));

// テスト環境でのログを制御
// console.logのモック（テスト環境では無効化）
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(), // Radix UIからの警告を無効化
    // eslint-disable-next-line no-console
    error: console.error, // エラーログは残す
  };
}

// Loggerモジュールをモック化
vi.mock('@/server/shared/logger', () => {
  const mockLogger = {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn(() => mockLogger),
  };

  return {
    logger: mockLogger,
    createChildLogger: vi.fn(() => mockLogger),
    createRequestLogger: vi.fn(() => mockLogger),
    measurePerformance: vi.fn(() => ({
      end: vi.fn(() => 0),
    })),
  };
});

// 堅牢なグローバルモックファクトリー
const createMockSearchParams = (params: Record<string, string> = {}): ReadonlyURLSearchParams => {
  const searchParams = new URLSearchParams(params);
  return {
    get: vi.fn((key: string) => searchParams.get(key)),
    has: vi.fn((key: string) => searchParams.has(key)),
    keys: vi.fn(
      () =>
        ({
          [Symbol.iterator]: (): Iterator<string> => {
            const keys = Array.from(searchParams.keys());
            let index = 0;
            return {
              next: (): IteratorResult<string> => ({
                done: index >= keys.length,
                value: keys[index++],
              }),
            };
          },
        }) as unknown as URLSearchParamsIterator<string>
    ),
    values: vi.fn(
      () =>
        ({
          [Symbol.iterator]: (): Iterator<string> => {
            const values = Array.from(searchParams.values());
            let index = 0;
            return {
              next: (): IteratorResult<string> => ({
                done: index >= values.length,
                value: values[index++],
              }),
            };
          },
        }) as unknown as URLSearchParamsIterator<string>
    ),
    entries: vi.fn(
      () =>
        ({
          [Symbol.iterator]: (): Iterator<[string, string]> => {
            const entries = Array.from(searchParams.entries());
            let index = 0;
            return {
              next: (): IteratorResult<[string, string]> => ({
                done: index >= entries.length,
                value: entries[index++],
              }),
            };
          },
        }) as unknown as URLSearchParamsIterator<[string, string]>
    ),
    forEach: vi.fn((callback: (value: string, key: string) => void) => {
      searchParams.forEach(callback);
    }),
    toString: vi.fn(() => searchParams.toString()),
    size: searchParams.size,
    append: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    sort: vi.fn(),
    getAll: vi.fn((name: string) => searchParams.getAll(name)),
    [Symbol.iterator]: vi.fn(() => searchParams.entries()),
  } as unknown as ReadonlyURLSearchParams;
};

const createMockRouter = (): AppRouterInstance => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
});

// Next.js navigationのグローバルモック
vi.mock('next/navigation', () => {
  const mockSearchParams = createMockSearchParams();
  const mockRouter = createMockRouter();

  return {
    useRouter: vi.fn(() => mockRouter),
    useSearchParams: vi.fn(() => mockSearchParams),
    usePathname: vi.fn(() => '/'),
    notFound: vi.fn(),
    // テスト用のファクトリー関数をエクスポート
    __createMockSearchParams: createMockSearchParams,
    __createMockRouter: createMockRouter,
  };
});

// サーバーサイドテスト用の設定
// 必要に応じて、Node.js環境でのみ必要なモックをここに追加
