# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code（claude.ai/code）へのガイダンスを提供します。

## 大原則

- 日本語で回答してください
- テスト駆動開発で実装してください
  - テストを作成するときは `.cursor/rules/coding/test-rule.mdc` を参考にしてください
- 実装が終わったら `npm run lint` を実行して、リンターが通るまで修正してください

## 開発環境

### 動作確認

**動作確認**: `npm run dev` は実行しないでください。 Docker コンテナはすでに起動しているため、 <http://localhost:3000> にアクセスして動作を確認してください。

### 技術スタック

- **フロントエンド**: Next.js 15（App Router）、React 18、TypeScript
- **UI**: Tailwind CSS、shadcn/ui、Radix UI、Lucide Reactアイコン
- **データベース**: PostgreSQL with Prisma ORM
- **状態管理**: SWR、Zustand
- **テスト**: Vitest, Testing Library
- **バリデーション**: Zod
- **フォーム**: React Hook Form

### プロジェクト構造

コードベースは機能ベースのアーキテクチャに従い、クライアントとサーバーコードを明確に分離しています。
テストはコロケーション方式で配置しています。

```
src/
├── app/                    # Next.js App Routerページ
├── client/                 # クライアントサイドコード
│   ├── features/           # 機能固有のコード（レシピ）
│   │   └── recipes/
│   │       ├── components/ # Reactコンポーネント（shadcn/uiベース）
│   │       │   ├── RecipeCard.tsx
│   │       │   ├── RecipeCard.test.tsx
│   │       │   ├── RecipeList.tsx
│   │       │   └── RecipeList.test.tsx
│   │       ├── hooks/      # カスタムフック（useRecipes）
│   │       │   ├── useRecipes.ts
│   │       │   └── useRecipes.test.ts
│   │       ├── types/      # TypeScript型定義
│   │       └── utils/      # 機能ユーティリティ
│   │           ├── recipeUtils.ts
│   │           └── recipeUtils.test.ts
│   ├── lib/               # クライアントライブラリ
│   └── shared/            # 共有クライアントユーティリティ
│       ├── api/           # APIリクエストユーティリティ
│       ├── shadcn/        # shadcn UIコンポーネント
│       ├── component/     # カスタムUIコンポーネント
│       └── utils/         # 共有ユーティリティ
├── server/                # サーバーサイドコード
│   ├── features/          # 機能固有のサーバーロジック
│   │   └── recipes/
│   │       └── search/    # レシピ検索機能
│   │           ├── searchService.ts
│   │           └── searchService.test.ts
│   └── shared/            # 共有サーバーユーティリティ
└── db/                    # データベーススキーマとマイグレーション
```
