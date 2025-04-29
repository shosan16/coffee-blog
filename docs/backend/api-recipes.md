# コーヒーレシピ管理システム API仕様書

## 概要

このドキュメントでは、コーヒーレシピ管理システムのAPIの技術仕様について詳細に説明します。

## API エンドポイント

### 1. レシピ一覧の取得

```typescript
GET /api/recipes
```

#### クエリパラメータ

| パラメータ | 型 | 説明 | 例 |
|------------|-------|-------------|------|
| page | number | ページ番号（1から開始） | `1` |
| limit | number | 1ページあたりの件数 | `20` |
| roastLevel | string[] | 焙煎度（複数選択可） | `["light", "medium", "dark"]` |
| grindSize | string[] | 挽き目（複数選択可） | `["extra-fine", "fine", "medium", "coarse"]` |
| equipment | string[] | 使用機器（複数選択可） | `["v60", "aeropress", "french-press"]` |
| beanWeight | object | コーヒー豆の量の範囲 | `{ min: 15, max: 30 }` |
| waterTemp | object | お湯の温度の範囲 | `{ min: 85, max: 95 }` |
| search | string | フリーワード検索 | `"フルーティー"` |
| sort | string | ソートフィールド | `"title"` |
| order | string | ソート順 | `"asc"` or `"desc"` |

#### レスポンス形式

```typescript
type RecipeListResponse = {
  recipes: {
    id: string;
    title: string;
    summary: string;
    equipment: string[];
    roastLevel: string;
    grindSize: string;
    beanWeight: number;
    waterTemp: number;
    waterAmount: number;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

## キャッシュ戦略

### SWRの設定

```typescript
const config: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1分間は重複リクエストを防ぐ
  focusThrottleInterval: 5000, // フォーカス時の再検証を5秒間隔に制限
};
```

### Next.jsのキャッシュ設定

```typescript
export const dynamic = 'force-dynamic'; // 動的レスポンス
export const revalidate = 60; // 60秒でキャッシュを再検証
```

## 状態管理

### URLパラメータの管理

```typescript
type FilterState = {
  page: number;
  limit: number;
  roastLevel: string[];
  grindSize: string[];
  equipment: string[];
  beanWeight: {
    min?: number;
    max?: number;
  };
  waterTemp: {
    min?: number;
    max?: number;
  };
  search?: string;
  sort: string;
  order: 'asc' | 'desc';
}
```

### SWRのキーの構造

```typescript
const getSwrKey = (filters: FilterState) => {
  return ['/api/recipes', filters];
};
```

## エラーハンドリング

### エラーレスポンス形式

```typescript
type ErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

### HTTPステータスコード

- 200: 成功
- 400: リクエストパラメータが不正
- 404: リソースが見つからない
- 500: サーバーエラー

## パフォーマンス最適化

### クエリの最適化

- JOINの使用を最小限に抑える
- 必要なフィールドのみを取得
- クエリ結果のキャッシュを活用

## セキュリティ対策

- クエリパラメータのバリデーション
- レートリミットの実装
- SQLインジェクション対策
- XSS対策

## 監視とロギング

- APIレスポンスタイムの監視
- エラーレートの監視
- アクセスログの記録
- パフォーマンスメトリクスの収集
