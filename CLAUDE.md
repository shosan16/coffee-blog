# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code（claude.ai/code）へのガイダンスを提供します。

## プロジェクトルール・ガイドライン

このプロジェクトでは、コード品質と一貫性を保つために詳細なルールとガイドラインを`.cursor/rules`ディレクトリに整理しています。
Claude Codeは、作業開始時にこれらのルールを参照し、適用することが期待されています。

### ルールディレクトリ構造

```
.cursor/rules/
├── globals.mdc                           # 全体に適用されるグローバルルール
├── coding/                               # コーディング関連ルール
│   ├── clean-code.mdc                   # クリーンコードの原則
│   ├── naming-conventions.mdc           # 命名規則
│   ├── frontend-design-patterns.mdc     # フロントエンドデザインパターン
│   ├── nextjs.mdc                      # Next.js固有のベストプラクティス
│   ├── typescript.mdc                  # TypeScript開発ガイドライン
│   └── test-rule.mdc                   # テスト戦略とルール
├── planning-docs/                       # プロジェクト企画・仕様書
│   ├── product-context.mdc             # プロダクト概要と価値提案
│   └── project-brief.mdc               # プロジェクト概要書
└── structure/                          # アーキテクチャ・構造ルール
    ├── backend-project-structure.mdc    # バックエンド構造ガイド
    ├── frontend-project-structure.mdc   # フロントエンド構造ガイド
    ├── component-patterns.mdc          # コンポーネント設計パターン
    └── er-diagram.mdc                  # データベース設計とER図
```

### Claude用の自動ルール参照

Claude Codeは、以下のルールを必要に応じて自動的に参照・適用してください：

#### 常時適用ルール

- `globals.mdc` - すべての作業で適用される基本原則
- `coding/clean-code.mdc` - コード品質の基本ルール
- `coding/naming-conventions.mdc` - 命名規則の統一

#### 技術スタック別ルール

- `coding/nextjs.mdc` - Next.js関連の作業時
- `coding/typescript.mdc` - TypeScript開発時
- `coding/frontend-design-patterns.mdc` - フロントエンド実装時
- `coding/test-rule.mdc` - テスト作成・修正時

#### アーキテクチャ・設計関連

- `structure/frontend-project-structure.mdc` - フロントエンド構造の変更時
- `structure/backend-project-structure.mdc` - バックエンド構造の変更時
- `structure/component-patterns.mdc` - コンポーネント設計時
- `structure/er-diagram.mdc` - データベース関連の作業時

#### プロジェクト理解

- `planning-docs/product-context.mdc` - プロダクトの方向性を理解する際
- `planning-docs/project-brief.mdc` - プロジェクト全体を把握する際

### ルール適用の原則

1. **作業開始前の確認**: 新しい機能開発や重要な変更前に、関連するルールファイルを確認
2. **自動参照**: Claude Codeは関連するルールを自動的に読み込み、適用することが期待される
3. **ルール優先度**: globals.mdc → 技術固有ルール → 機能固有ルールの順で適用
4. **一貫性の維持**: 既存コードとの整合性を保ちながら、ルールに準拠したコードを生成
5. **ルール違反の報告**: ルールに従えない場合は、その理由を明確に説明する

## アーキテクチャ概要

これは**Next.js 15 コーヒーレシピブログ**で、TypeScript、Prisma、PostgreSQLを使用しています。このアプリケーションでは、器具、抽出パラメータ、段階的な手順を含む詳細なコーヒー抽出レシピを閲覧できます。

## 開発環境

### 動作確認

**動作確認**: `npm run dev` は実行しないでください。 Docker コンテナはすでに起動しているため、 <http://localhost:3000> にアクセスして動作を確認してください。

### 技術スタック

- **フロントエンド**: Next.js 15（App Router）、React 18、TypeScript
- **UI**: Tailwind CSS、**shadcn/ui**、Radix UI、Lucide Reactアイコン
- **データベース**: PostgreSQL with Prisma ORM
- **状態管理**: データフェッチング用SWR、クライアント状態用Zustand
- **テスト**: **Vitest with Testing Library**、jsdom環境
- **バリデーション**: スキーマバリデーション用Zod
- **フォーム**: React Hook Form

### 開発手法

#### テスト駆動開発（TDD）

- **テストファースト**: 新機能の実装前に、期待される動作を定義するテストを先に作成
- **レッドグリーンリファクタ**: 失敗するテスト → 最小限の実装で成功 → リファクタリングのサイクル
- **包括的テスト**: ユニットテスト、統合テスト、エンドツーエンドテストを組み合わせて品質を保証

#### UI コンポーネント設計

- **shadcn/ui優先**: 新しいUIコンポーネントが必要な場合は、まずshadcn/uiライブラリから適切なコンポーネントを選択
- **カスタマイズ**: shadcn/uiコンポーネントをベースに、プロジェクト固有の要件に合わせてカスタマイズ
- **一貫性**: デザインシステムの一貫性を保つため、独自コンポーネントの作成は最小限に留める

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
│       ├── ui/            # 共有UIコンポーネント（shadcn/uiベース）
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

### データモデル

このアプリケーションは以下を含むコーヒーレシピブログをモデル化しています：

- **Posts**（レシピ）抽出パラメータ（挽き目、焙煎レベル、湯温など）付き
- レシピを作成する**Authors**
- レシピで紹介される可能性のある**Baristas**
- 抽出器具用の**Equipment**と**EquipmentType**
- 詳細な抽出手順用の**Steps**
- カテゴリ分類用の**Tags**

### 主要パターン

1. **機能ベース構成**: ファイルタイプではなく機能（レシピ）でコードを整理
2. **絶対インポート**: 相対パスの問題を避けるため、すべてのインポートで`@/`プレフィックスを使用
3. **型安全性**: Zodバリデーションによる包括的なTypeScriptカバレッジ
4. **テスト駆動開発**: 各機能にVitestを使用したテストファイル、テストファーストアプローチ
5. **shadcn/uiコンポーネント**: 一貫したデザインシステムのためのshadcn/uiコンポーネント活用
6. **API構造**: `src/app/api/`のNext.js APIルート
7. **コンポーネントパターン**: `src/client/shared/ui/`の共有UIコンポーネント

### インポートルール

- 常に`@/`プレフィックス付きの絶対パスを使用
- 可能な場合は機能のパブリックAPIからインポート
- 依存関係の方向に従う：`app/` → `features/` → `shared/`
- コンポーネントには`export default function`、その他すべてには`export const`を使用
- shadcn/uiコンポーネントは`@/components/ui/`から、カスタムコンポーネントは適切な機能ディレクトリからインポート

### 開発ワークフロー

1. **要件定義**: 実装する機能の要件を明確にする
2. **テスト設計**: 期待される動作を定義するテストを作成
3. **UI設計**: shadcn/uiコンポーネントを活用したUIを設計
4. **実装**: テストが通るよう最小限の実装から開始
5. **リファクタリング**: コード品質を向上させながら、テストが継続的に通ることを確認
6. **統合**: 機能を既存のシステムに統合し、回帰テストを実行
