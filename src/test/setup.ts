import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { vi } from 'vitest';

// Testing Libraryの設定でDOM出力を制限
configure({
  // テスト失敗時のDOM出力を制限
  getElementError: (message, _container) => {
    const error = new Error(message ?? 'エラーが発生しました');
    error.name = 'TestingLibraryElementError';
    return error;
  },
  // DOM のデバッグ出力を簡潔にする
  asyncUtilTimeout: 1000,
  // DOM出力の長さを制限
  defaultHidden: true,
});

// DOM出力の制限をグローバルに設定
process.env.DEBUG_PRINT_LIMIT = '300';

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

// テスト環境のグローバル設定
global.ResizeObserver = class ResizeObserver {
  observe(): void {
    // モック実装
  }
  unobserve(): void {
    // モック実装
  }
  disconnect(): void {
    // モック実装
  }
};

// window.matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// scrollIntoViewのモック
Element.prototype.scrollIntoView = vi.fn();
