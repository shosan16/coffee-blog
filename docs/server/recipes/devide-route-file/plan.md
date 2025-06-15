# route.ts ファイル分解計画

## 概要

現在の `src/app/api/recipes/route.ts` (214行) を backend-project-structure に基づいて適切に分解し、SOLID原則に従った責任分離を実現する。

## 分解対象の責任分析

現在のroute.tsファイルには以下の責任が混在している：

1. **Prismaクライアント管理** (9-15行)

   - シングルトンパターンでの初期化
   - 開発環境での重複インスタンス防止

2. **バリデーションスキーマ定義** (18-36行)

   - Zodスキーマによるクエリパラメータ検証
   - 型強制とデフォルト値設定

3. **リクエスト処理とパラメータ変換** (43-54行)

   - URLパラメータの抽出と変換
   - 配列パラメータの分割処理

4. **Prismaクエリ構築** (56-130行)

   - WHERE句の動的構築
   - フィルタリング条件の追加
   - ソート条件の設定

5. **データベースアクセス** (135-155行)

   - Prismaクエリの実行
   - 関連データの取得

6. **データ変換** (157-167行)

   - データベース形式からAPI形式への変換
   - レスポンス形式の整形

7. **エラーハンドリング** (175-214行)
   - Zodエラーの処理
   - 予期せぬエラーの処理

## 分解後のディレクトリ構造

```
src/
├── server/
│   ├── shared/
│   │   └── database/
│   │       └── prisma.ts                    # Prismaクライアント管理
│   └── features/
│       └── recipes/
│           └── search/
│               ├── search-recipes.types.ts   # 型定義
│               ├── search-recipes.schema.ts  # バリデーションスキーマ
│               ├── search-recipes.service.ts # ビジネスロジック
│               └── search-recipes.controller.ts # コントローラー
└── app/
    └── api/
        └── recipes/
            └── route.ts                     # エントリーポイント（簡潔化）
```

## 各ファイルの責任

### 1. `src/server/shared/database/prisma.ts`

- Prismaクライアントのシングルトン管理
- 開発環境での重複インスタンス防止
- アプリケーション全体で共有される基盤

### 2. `src/server/features/recipes/search/search-recipes.types.ts`

- 検索パラメータの型定義
- 検索結果の型定義
- TypeScript型安全性の確保

### 3. `src/server/features/recipes/search/search-recipes.schema.ts`

- Zodバリデーションスキーマ
- クエリパラメータの検証ルール
- 型強制とデフォルト値設定

### 4. `src/server/features/recipes/search/search-recipes.service.ts`

- 検索ビジネスロジック
- Prismaクエリの構築と実行
- データ変換処理
- 単一責任：レシピ検索のみ

### 5. `src/server/features/recipes/search/search-recipes.controller.ts`

- HTTPリクエスト/レスポンス処理
- パラメータ変換とバリデーション
- エラーハンドリング
- サービス層との連携

### 6. `src/app/api/recipes/route.ts` (更新後)

- Next.js App Routerのエントリーポイント
- コントローラーへの委譲のみ
- 214行 → 8行に簡潔化

## 設計原則の適用

### SOLID原則

- **S (単一責任)**: 各クラス/関数が一つの責任のみを持つ
- **O (オープン・クローズド)**: インターフェースによる拡張性
- **L (リスコフの置換)**: 基底型との置換可能性
- **I (インターフェース分離)**: 必要最小限のインターフェース
- **D (依存性逆転)**: 抽象への依存

### 依存関係の方向性

- 循環依存の回避
- 明確な依存関係の方向性

### 命名規則

- ファイル名: `kebab-case` (フォルダ), `camelCase` (ファイル)
- クラス名: `PascalCase`
- 関数名: `camelCase`
- 型名: `PascalCase`

## 期待される効果

1. **保守性の向上**

   - 責任の明確化により変更影響範囲を限定
   - 単一ファイルの肥大化防止

2. **テスタビリティの向上**

   - 各層の独立したテストが可能
   - モックやスタブの適用が容易

3. **再利用性の向上**

   - サービス層の他機能での再利用
   - 共通コンポーネントの活用

4. **型安全性の維持**

   - TypeScriptの恩恵を最大限活用
   - コンパイル時エラー検出

5. **開発効率の向上**
   - 機能追加時の影響範囲の明確化
   - チーム開発での並行作業の促進
