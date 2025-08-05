# Coffee Recipe Collection

プロフェッショナルなコーヒー抽出レシピを提供するWebアプリケーション

## 🎯 プロジェクトビジョン

プロのバリスタの技術と知識を広く共有し、コーヒーファンとバリスタ双方の夢を実現するプラットフォームを目指しています。ユーザーは最高品質のレシピでコーヒー技術を磨き、バリスタは知名度向上と顧客獲得を実現し、運営者は持続可能な収益を得る**三方良しのエコシステム**を構築します。

## 🤝 三方良しの価値提案

### ☕ ユーザーのメリット

- **プロの技術習得**: World Brewers Cup チャンピオンレシピなど、検証済みの高品質レシピ
- **確実な成功体験**: 詳細な手順とコツで、失敗のリスクを最小化
- **コーヒーライフの向上**: 自宅でカフェレベルの一杯を楽しめる

### 👨‍🍳 バリスタのメリット

- **知名度・ブランド向上**: レシピ公開による認知度アップとプロフェッショナルとしての評価向上
- **新規顧客獲得**: オンラインでのファン獲得から実店舗への集客につながる
- **SNSフォロワー増加**: Instagram、Twitter等のソーシャルメディアでの影響力拡大
- **技術の継承**: 自身の技術や知識を次世代に伝える社会貢献

### 💼 運営者のメリット

- **アフィリエイト収入**: 器具・豆の推奨による収益化
- **広告収入**: バリスタ・ロースター・器具メーカーからの広告掲載
- **持続可能な運営**: 品質の高いコンテンツによる継続的なトラフィック獲得

### 解決する問題

**ユーザーが抱える課題**

- **情報の断片化**: コーヒー抽出に必要な情報が複数のサイトに散在している
- **信頼性の不足**: 不明瞭な情報により、ユーザーが実際にレシピを試す際に不安を感じる
- **初心者のハードル**: 抽出条件や手順が不明確で、初心者が取り組みにくい

**バリスタが抱える課題**

- **認知度不足**: 優れた技術を持っていても、それを知ってもらう機会が限られている
- **顧客獲得の困難**: 新規顧客にリーチする効果的な手段が不足している
- **技術継承の場不足**: 自身の知識や技術を広く共有する適切なプラットフォームがない

### ターゲットユーザー

**コーヒー愛好家**

- 日常的にコーヒーを楽しむ一般ユーザー
- 自宅でプロフェッショナルな抽出技術を試したい家庭用バリスタ
- コーヒーの知識を深めたい初心者〜中級者

**プロフェッショナル**

- 知名度向上を目指すコーヒー専門店のバリスタ
- 技術を広く共有したいコーヒー業界関係者
- ブランド力強化を図るロースターや器具メーカー

## ✨ 実装済み機能

### 🏠 レシピ一覧画面

- **検索機能**: タイトル・概要での部分一致検索
- **フィルタリング**: 焙煎度、挽き目、器具、抽出条件での絞り込み
- **ページネーション**: 大量データの効率的な表示
- **レスポンシブUI**: モバイル・デスクトップ最適化

### 📖 レシピ詳細画面

- **SSR対応**: 初回表示の高速化とSEO最適化
- **詳細情報**: 抽出手順、器具情報、バリスタ情報
- **ISR**: 1時間キャッシュによるパフォーマンス最適化
- **アフィリエイト連携**: 器具の購入リンク表示

### 👨‍🍳 バリスタ支援機能

- **プロフィール表示**: バリスタの経歴、受賞歴、専門分野を詳細表示
- **SNS連携**: Instagram、Twitter等への直接リンクでフォロワー獲得をサポート
- **店舗情報表示**: 所属店舗の情報とアクセス方法を掲載し、実店舗への集客を促進
- **レシピ評価システム**: ユーザーからの評価とコメントでバリスタの実績を可視化

## 🛠️ 技術スタック

### フロントエンド

- **フレームワーク**: Next.js 15 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Lucide React
- **スタイリング**: Class Variance Authority, clsx, Tailwind Merge, tw-animate-css
- **状態管理**: React標準フック + URL状態管理
  - 検索・フィルタリング: SWR + useSearchParams/useRouter
  - レシピ詳細: Server Actions + SSR
  - コンポーネント状態: useState/useEffect/useCallback/useMemo
- **フォーム**: React Hook Form + Zod
- **ユーティリティ**: lodash, date-fns

### バックエンド

- **データベース**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes + Server Actions
- **ログ**: Pino (構造化ログ)
- **API仕様**: OpenAPI 3.0.3

### 開発・テスト

- **テスト**: Vitest + Testing Library
- **品質管理**: ESLint, Prettier, Husky
- **開発環境**: Docker, Docker Compose
- **ストーリーブック**: Storybook (UIコンポーネント)

## 🏗️ アーキテクチャ

### 機能ベース設計

```
src/
├── app/                    # Next.js App Router (UI層)
├── client/                 # クライアントサイドコード
│   └── features/          # 機能別コンポーネント・ロジック
└── server/                # サーバーサイドコード
    └── features/          # 機能別ビジネスロジック
```

### レンダリング戦略

- **レシピ一覧**: Client-Side Rendering (リアルタイム検索・フィルタリング)
- **レシピ詳細**: Server-Side Rendering (SEO最適化・初回表示高速化)
- **キャッシュ**: ISR (Incremental Static Regeneration) による最適化

### アーキテクチャ設計原則

#### ドメイン駆動設計（DDD）

本プロジェクトでは3層アーキテクチャを採用し、ドメイン層を中心とした設計を実装しています：

- **ドメイン層**: ビジネスロジックの中核
  - **エンティティ**: Recipe、Barista、Equipment等のビジネスオブジェクト
  - **値オブジェクト**: BrewingConditions、RecipeId等の不変オブジェクト
  - **リポジトリインターフェース**: データアクセスの抽象化
- **アプリケーション層**: ユースケースの実装
  - **単一操作ドメイン**: 個別リソースに対する操作（`recipe/detail/`）
  - **複数操作ドメイン**: 複数リソースに対する操作（`recipes/search/`）
- **インフラ層**: 外部システムとの接続
  - **リポジトリ実装**: PrismaやMemoryベースのデータアクセス
  - **データマッパー**: ドメインオブジェクトとDBレコードの変換

#### 直接import方式

- **シンプルな依存関係**: index.tsを使わず、必要なファイルを直接import
- **Tree Shaking最適化**: 未使用コードの自動除去を促進
- **明示的な依存関係**: どのファイルが何に依存するかが明確

#### コロケーション戦略

- **機能ごとの集約**: 関連するファイルを同じディレクトリに配置
- **テストとの共存**: 実装ファイルとテストファイルを隣接配置
- **型定義の局所化**: 機能固有の型は同じディレクトリ内で管理

### テスト戦略

- **コロケーション**: テストファイルをコンポーネント・ロジックの隣に配置
- **AAA パターン**: Arrange-Act-Assert による明確なテスト構造
- **TDD**: Test-Driven Development による品質保証

## 🚀 クイックスタート

### 前提条件

- Node.js 18+
- npm
- PostgreSQL (Docker推奨)

### 初回セットアップ

```bash
# 依存関係インストール
npm install

# データベースセットアップ
npm run db:setup

# 開発サーバー起動
npm run dev
```

## 📋 利用可能なコマンド

### 開発環境

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

### データベース管理

```bash
# Prismaクライアント生成
npm run db:generate

# マイグレーション実行
npm run db:migrate         # Docker内で実行
npm run db:migrate:local   # ローカル環境で実行
npm run db:migrate:docker  # Dockerコンテナ経由で実行

# シードデータ投入
npm run db:seed            # Docker内で実行
npm run db:seed:local      # ローカル環境で実行
npm run db:seed:docker     # Dockerコンテナ経由で実行

# データベースセットアップ（generate + migrate + seed）
npm run db:setup

# Prisma Studio起動
npm run db:studio
```

### コード品質

```bash
# コードフォーマット
npm run format

# リント実行
npm run lint

# 型チェック
npx tsc --noEmit

# 包括的品質チェック
npm run format && npm run lint && npx tsc --noEmit && npm test
```

## 🧪 テスト

```bash
# テスト実行
npm test

# テストUI起動
npm run test:ui

# テスト実行（レポート出力）
npm run test:run

# カバレッジ付きテスト
npm run test:coverage

# 高速テスト実行
npm run test:quick
```

## 📊 開発ツール

```bash
# Storybook起動
npm run storybook

# Storybookビルド
npm run build-storybook
```

## 🚨 トラブルシューティング

### よくある問題

1. **Prisma Clientエラー**

   ```
   Error: @prisma/client did not initialize yet
   ```

   **解決方法**: `npm run db:generate`

2. **データベース接続エラー**

   ```
   Error: Can't reach database server
   ```

   **解決方法**: PostgreSQLサーバーが起動していることを確認し、環境変数を確認

3. **マイグレーションエラー**

   ```
   The table `public.Recipe` does not exist
   ```

   **解決方法**: `npm run db:migrate`

### 完全リセット

```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# データベースの再セットアップ
npm run db:setup
```

### 古いキャッシュが残っている場合

```
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 📚 API仕様書

開発サーバー起動後、以下のURLでAPI仕様書を確認できます：

- **OpenAPI仕様書**: `/api/docs`
- **レシピAPI**: `/api/recipes` (検索・一覧)
- **レシピ詳細API**: `/api/recipes/{id}` (詳細取得)

## 📁 プロジェクト構造詳細

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── equipment/
│   │   │   └── route.ts        # 器具API
│   │   └── recipes/
│   │       ├── [id]/
│   │       │   └── route.ts    # レシピ詳細API
│   │       └── route.ts        # レシピ検索API
│   ├── recipes/[id]/
│   │   ├── actions.ts          # Server Actions
│   │   ├── not-found.tsx       # 404ページ
│   │   └── page.tsx            # レシピ詳細ページ
│   ├── globals.css             # グローバルスタイル
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # ホームページ
│
├── client/                 # クライアントサイドコード
│   ├── features/
│   │   ├── recipe-list/        # レシピ一覧機能
│   │   │   ├── components/
│   │   │   │   ├── filter/     # フィルター関連
│   │   │   │   └── search/     # 検索関連
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── recipe-detail/      # レシピ詳細機能
│   │       ├── components/
│   │       │   └── detail/
│   │       ├── hooks/
│   │       └── types/
│   ├── lib/
│   │   └── tailwind.ts         # Tailwind設定
│   └── shared/                 # 共有クライアントコード
│       ├── api/
│       ├── components/
│       │   ├── combobox/       # コンボボックス
│       │   ├── multi-combobox/ # マルチ選択コンボボックス
│       │   ├── skeleton/       # スケルトンローダー
│       │   └── Pagination.tsx  # ページネーション
│       ├── constants/
│       ├── hooks/
│       ├── shadcn/             # shadcn/ui コンポーネント
│       └── utils/
│
├── server/                 # サーバーサイドコード
│   ├── domain/                 # ドメイン層（DDD）
│   │   └── recipe/
│   │       ├── entities/       # エンティティ
│   │       │   ├── barista/
│   │       │   ├── equipment/
│   │       │   └── recipe/
│   │       ├── repositories/   # リポジトリインターフェース
│   │       └── value-objects/  # 値オブジェクト
│   ├── features/               # アプリケーション層
│   │   ├── recipe/
│   │   │   └── detail/         # レシピ詳細取得
│   │   └── recipes/
│   │       └── search/         # レシピ検索
│   ├── infrastructure/         # インフラ層
│   │   └── repositories/
│   │       └── mappers/        # データマッパー
│   └── shared/                 # 共有サーバーコード
│       ├── types/
│       ├── api-error.ts
│       ├── database/
│       │   └── prisma.ts
│       ├── logger.ts
│       └── request-id.ts
│
├── db/                     # データベース
│   ├── migrations/             # マイグレーション
│   ├── schema.prisma           # Prismaスキーマ
│   └── seed.ts                 # シードデータ
│
└── test/                   # テスト設定
    └── setup.ts                # テスト環境設定
```

## 🔧 設定ファイル

- `src/db/schema.prisma` - データベーススキーマ
- `docs/server/recipes/open-api/openapi.yaml` - API仕様書
- `package.json` - 依存関係・スクリプト設定
- `vitest.config.ts` - テスト設定
- `tailwind.config.js` - Tailwind CSS設定
- `next.config.mjs` - Next.js設定
