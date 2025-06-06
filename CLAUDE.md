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

### 技術スタック

- **フロントエンド**: Next.js 15（App Router）、React 18、TypeScript
- **UI**: Tailwind CSS、Radix UI、Lucide Reactアイコン
- **データベース**: PostgreSQL with Prisma ORM
- **状態管理**: データフェッチング用SWR、クライアント状態用Zustand
- **テスト**: Vitest with Testing Library、jsdom環境
- **バリデーション**: スキーマバリデーション用Zod
- **フォーム**: React Hook Form

### プロジェクト構造

コードベースは機能ベースのアーキテクチャに従い、クライアントとサーバーコードを明確に分離しています：

```
src/
├── app/                    # Next.js App Routerページ
├── client/                 # クライアントサイドコード
│   ├── features/           # 機能固有のコード（レシピ）
│   │   └── recipes/
│   │       ├── components/ # Reactコンポーネント
│   │       ├── hooks/      # カスタムフック（useRecipes）
│   │       ├── types/      # TypeScript型定義
│   │       └── utils/      # 機能ユーティリティ
│   ├── lib/               # クライアントライブラリ
│   └── shared/            # 共有クライアントユーティリティ
│       ├── api/           # APIリクエストユーティリティ
│       ├── ui/            # 共有UIコンポーネント
│       └── utils/         # 共有ユーティリティ
├── server/                # サーバーサイドコード
│   ├── features/          # 機能固有のサーバーロジック
│   │   └── recipes/
│   │       └── search/    # レシピ検索機能
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
4. **テスト**: 各機能にVitestを使用した専用テストファイル
5. **API構造**: `src/app/api/`のNext.js APIルート
6. **コンポーネントパターン**: `src/client/shared/ui/`の共有UIコンポーネント

### 開発メモ

- アプリケーションは日本語設定を使用（レイアウトで`lang="ja"`）
- データベーススキーマはテーブル/カラム名にsnake_caseを使用するが、TypeScriptではcamelCase
- クライアントサイドのデータフェッチングには`useRecipes`フックでSWRを使用
- テストはテストデータ生成にfaker.jsを使用
- プリコミットフック用にHuskyとlint-stagedを設定

### インポートルール

- 常に`@/`プレフィックス付きの絶対パスを使用
- 可能な場合は機能のパブリックAPIからインポート
- 依存関係の方向に従う：`app/` → `features/` → `shared/`
- コンポーネントには`export default function`、その他すべてには`export const`を使用
