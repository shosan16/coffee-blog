# Coffee Blog

コーヒーレシピブログ - 器具、抽出パラメータ、段階的な手順を含む詳細なコーヒー抽出レシピを閲覧できるアプリケーション。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Lucide React
- **データベース**: PostgreSQL with Prisma ORM
- **状態管理**: SWR (データフェッチング), Zustand (クライアント状態)
- **テスト**: Vitest with Testing Library
- **バリデーション**: Zod
- **フォーム**: React Hook Form
- **開発環境**: Docker, Docker Compose

## 🚀 クイックスタート

### 前提条件

- Docker
- Docker Compose
- Node.js (ローカル開発時のみ)

### 初回セットアップ

```bash
# Docker環境のセットアップ
npm run docker:setup

# 開発サーバー起動
npm run docker:dev

# データベースセットアップ
npm run docker:db-setup
```

## 📋 利用可能なコマンド

### Docker開発環境

```bash
# クリーンビルド
npm run docker:setup

# 開発サーバー起動
npm run docker:dev

# Prismaクライアント生成
npm run docker:generate

# データベースマイグレーション実行
npm run docker:migrate

# シードデータ投入
npm run docker:seed

# データベースセットアップ（generate + migrate + seed）
npm run docker:db-setup

# 環境のクリーンアップ
npm run docker:clean
```

## 🧪 テスト

```bash
# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage
```

## 🚨 トラブルシューティング

### よくある問題

1. **esbuildエラー**

   ```
   Error: You installed esbuild for another platform
   ```

   **解決方法**: `npm run docker:clean && npm run docker:setup`

2. **Prisma Clientエラー**

   ```
   Error: @prisma/client did not initialize yet
   ```

   **解決方法**: `npm run docker:generate`

3. **データベーステーブルが存在しない**

   ```
   The table `public.post` does not exist
   ```

   **解決方法**: `npm run docker:migrate`

### 完全リセット

```bash
# 全環境をクリーンアップして再構築
npm run docker:clean
npm run docker:setup
npm run docker:dev
# 別ターミナルで
npm run docker:db-setup
```
