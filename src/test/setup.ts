import { vi } from 'vitest';
import '@testing-library/jest-dom';

// JSDOMで不足しているWeb APIのモック
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
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
global.getComputedStyle = vi.fn().mockImplementation(() => ({
  getPropertyValue: vi.fn(() => ''),
}));

// テスト環境でのログを制御
// console.logのモック（テスト環境では無効化）
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
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

// サーバーサイドテスト用の設定
// 必要に応じて、Node.js環境でのみ必要なモックをここに追加
