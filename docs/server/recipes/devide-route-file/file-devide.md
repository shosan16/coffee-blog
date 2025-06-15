# route.ts ファイル分解計画 - 現在の状況

## Phase 1: 基盤整備 ✅ 完了 (2025-01-15)

### 完了した作業

- Prismaクライアントのシングルトンパターンを `src/server/shared/database/prisma.ts` に分離
- `src/app/api/recipes/route.ts` からPrismaクライアント関連コード（9-15行）を削除
- 共通Prismaクライアントのインポート設定
- TypeScriptコンパイルとESLintエラーの解消確認

### 成果

- route.tsファイルが214行から約8行削減
- Prismaクライアントの一元管理により、今後の機能追加時の一貫性確保
- SOLID原則の単一責任原則に基づく責任分離の実現

## Phase 1.5: テスト環境整備 ✅ 完了 (2025-01-15)

### Vitest環境構築

JestからVitestへの移行を完了しました。以下の手順で環境を構築：

#### 1. Jest関連パッケージの削除

```bash
npm uninstall jest jest-environment-jsdom ts-jest
```

#### 2. Vitest関連パッケージのインストール

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```

#### 3. 設定ファイルの作成

**vitest.config.ts**

```typescript
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**src/test/setup.ts**

```typescript
import '@testing-library/jest-dom';

// グローバルなテスト設定をここに追加
// 例: モックの設定、テスト環境の初期化など
```

#### 4. package.jsonスクリプトの追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### 5. TypeScript設定の更新

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["vitest.config.ts"]
}
```

### 利用可能なテストコマンド

- `npm run test` - ウォッチモードでテスト実行
- `npm run test:ui` - Vitest UIでテスト実行
- `npm run test:run` - 一回だけテスト実行
- `npm run test:coverage` - カバレッジ付きでテスト実行

### 成果

- モダンで高速なテスト環境の構築
- React Testing Libraryとの統合
- TypeScriptとの完全な互換性
- 直感的なUIでのテスト実行環境

## 次のステップ: Phase 2 - 検索機能の分離

### 対象コード（現在のroute.ts内）

1. **バリデーションスキーマ** (10-28行): Zodスキーマによるクエリパラメータ検証
2. **リクエスト処理** (35-46行): URLパラメータの抽出と変換
3. **Prismaクエリ構築** (48-122行): WHERE句とORDER BY句の動的構築
4. **データベースアクセス** (127-147行): Prismaクエリの実行
5. **データ変換** (149-159行): DB形式からAPI形式への変換
6. **エラーハンドリング** (167-206行): Zodエラーと予期せぬエラーの処理

### 分離後の構造

```
src/server/features/recipes/search/
├── search-recipes.types.ts      # 型定義
├── search-recipes.schema.ts     # バリデーションスキーマ
├── search-recipes.service.ts    # ビジネスロジック
└── search-recipes.controller.ts # コントローラー
```

### 設計原則の適用

- **単一責任原則**: 各ファイルが一つの責任のみを持つ
- **依存性逆転原則**: 抽象への依存を実現
- **命名規則**: kebab-case（ディレクトリ）、camelCase（ファイル）、PascalCase（型・クラス）
- **型安全性**: TypeScriptの恩恵を最大限活用

### 期待される効果

- 保守性の向上（責任の明確化）
- テスタビリティの向上（各層の独立テスト）
- 再利用性の向上（サービス層の他機能での活用）
- 開発効率の向上（並行作業の促進）
