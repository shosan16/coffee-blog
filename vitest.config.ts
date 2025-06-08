import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    // タイムアウト設定を追加
    testTimeout: 30000, // 30秒
    hookTimeout: 10000, // 10秒
    // 並行実行の制限
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // シングルフォークで実行
      },
    },
    // パフォーマンス最適化
    isolate: false, // テスト間の分離を無効化してパフォーマンス向上
    reporters: ['default'],
    logHeapUsage: false, // ヒープ使用量ログを無効化
    // 環境変数を設定
    env: {
      NODE_ENV: 'test',
    },
    // ログ出力の制御
    silent: false, // テスト結果は表示
    outputFile: undefined, // ファイル出力を無効化
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
