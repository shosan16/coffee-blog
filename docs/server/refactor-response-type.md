# API レスポンス型リファクタリング計画書

## 背景

APIレスポンスにフィールドを1つ追加するだけで、**最大8ファイル**の修正が必要になっている。これは開発効率とメンテナンス性を大きく損なう問題である。

### 現状のデータフロー

```
Prisma → Domain Entity → DTO → Service型 → API Response → Client型
         (4段階のマッピング)
```

### 修正が必要なファイル（フィールド1つ追加時）

| #   | ファイル                   | 役割                     |
| --- | -------------------------- | ------------------------ |
| 1   | `schema.prisma`            | DBカラム定義             |
| 2   | `Recipe.entity.ts`         | ドメインエンティティ     |
| 3   | `RecipeMapper.ts`          | Prisma → ドメイン変換    |
| 4   | `SearchRecipesResponse.ts` | DTO型定義 + マッパー     |
| 5   | `features/.../types.ts`    | サーバー側Service型      |
| 6   | `features/.../service.ts`  | マッピング処理           |
| 7   | `client/.../recipe.ts`     | クライアント側型（重複） |
| 8   | テストファイル群           | モックデータ更新         |

### 根本原因

1. **型の重複定義**: サーバー/クライアントで同じ構造の型が別々に定義されている
2. **DTO層とService層の冗長性**: `RecipeSummaryDto` と `Recipe`（Service型）がほぼ同一
3. **型定義とバリデーションの分離**: 同じ構造を2箇所で管理

---

## 改善提案

### 提案1: Zodスキーマによる型一元管理（優先度: 高）

#### 概要

API Response型をZodスキーマで定義し、`z.infer`で型を自動生成する。これにより型定義とバリデーションを一元化する。

#### 現状

```typescript
// types.ts - 型定義
type Recipe = {
  id: string;
  title: string;
  beanWeight: number;
};

// validation.ts - バリデーション（別定義）
const schema = z.object({
  id: z.string(),
  title: z.string(),
  beanWeight: z.number(),
});
```

フィールド追加時、**両方を修正**する必要がある。

#### 改善後

```typescript
// src/server/shared/schemas/recipe.schema.ts
import { z } from 'zod';

export const RecipeSummarySchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    equipment: z.array(z.string()),
    roastLevel: z.string(),
    grindSize: z.string().optional(),
    beanWeight: z.number(),
    waterTemp: z.number(),
    waterAmount: z.number(),
  })
  .strict();

// 型は自動生成（1箇所の変更で済む）
export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;
```

#### 作成するファイル

| ファイルパス                                         | 内容                       |
| ---------------------------------------------------- | -------------------------- |
| `src/server/shared/schemas/recipe-summary.schema.ts` | レシピ一覧用スキーマ       |
| `src/server/shared/schemas/recipe-detail.schema.ts`  | レシピ詳細用スキーマ       |
| `src/server/shared/schemas/pagination.schema.ts`     | ページネーション用スキーマ |
| `src/server/shared/schemas/index.ts`                 | エクスポート集約           |

#### 修正するファイル

| ファイルパス                                          | 変更内容                                       |
| ----------------------------------------------------- | ---------------------------------------------- |
| `src/server/features/recipes/search/types.ts`         | `Recipe`型を削除し、スキーマからimport         |
| `src/server/features/recipe/detail/types.ts`          | `RecipeDetail`型を削除し、スキーマからimport   |
| `src/server/application/dto/SearchRecipesResponse.ts` | `RecipeSummaryDto`を削除し、スキーマからimport |
| `src/server/application/dto/RecipeDetailResponse.ts`  | `RecipeDetailDto`を削除し、スキーマからimport  |

---

### 提案2: DTO層とService層の型統合（優先度: 中）

#### 概要

`RecipeSummaryDto`と`Recipe`（Service層の型）が実質同一のため、統合してマッピング回数を削減する。

#### 現状

```
Domain Entity
    ↓ RecipeDetailResponseMapper.toDto()
RecipeDetailDto (DTO層)
    ↓ マッピング処理
RecipeDetail (Service層の型)
    ↓ NextResponse.json()
API Response
```

3回の変換が発生している。

#### 改善後

```
Domain Entity
    ↓ RecipeDetailResponseMapper.toResponse()
RecipeDetail (Zodスキーマから生成)
    ↓ NextResponse.json()
API Response
```

DTO層の型をZodスキーマに置き換え、Service層の型と統合する。

#### 具体的な変更

**Before: SearchRecipesResponse.ts**

```typescript
// 現在の構造
export type RecipeSummaryDto = {
  readonly id: string;
  readonly title: string;
  // ... 全フィールド定義
};

export class SearchRecipesResponseMapper {
  async toDto(result: SearchResultEntity): Promise<SearchRecipesResponseDto> {
    // マッピング処理
  }
}
```

**After: SearchRecipesResponse.ts**

```typescript
import { RecipeSummary, RecipeSummarySchema } from '@/server/shared/schemas';

// 型定義は削除（スキーマからimport）

export class SearchRecipesResponseMapper {
  // 戻り値の型をスキーマから生成した型に変更
  async toResponse(result: SearchResultEntity): Promise<RecipeSummary[]> {
    const recipes = result.recipes.map((recipe) => ({
      id: recipe.id.value,
      title: recipe.title,
      // ... マッピング
    }));

    // オプション: ランタイム検証
    return recipes.map((r) => RecipeSummarySchema.parse(r));
  }
}
```

#### 修正するファイル

| ファイルパス                                          | 変更内容                                 |
| ----------------------------------------------------- | ---------------------------------------- |
| `src/server/application/dto/SearchRecipesResponse.ts` | `RecipeSummaryDto`削除、スキーマ型を使用 |
| `src/server/application/dto/RecipeDetailResponse.ts`  | `RecipeDetailDto`削除、スキーマ型を使用  |
| `src/server/features/recipes/search/service.ts`       | Service層の型変換を削除                  |
| `src/server/features/recipe/detail/service.ts`        | Service層の型変換を削除                  |
| `src/server/features/recipes/search/types.ts`         | `Recipe`型削除、スキーマからimport       |
| `src/server/features/recipe/detail/types.ts`          | `RecipeDetail`型削除、スキーマからimport |

---

## 実装手順

### Phase 1: Zodスキーマ基盤の作成

#### Step 1.1: スキーマディレクトリ作成

```bash
mkdir -p src/server/shared/schemas
```

#### Step 1.2: 共通スキーマ作成

```typescript
// src/server/shared/schemas/pagination.schema.ts
import { z } from 'zod';

export const PaginationSchema = z
  .object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .strict();

export type Pagination = z.infer<typeof PaginationSchema>;
```

#### Step 1.3: レシピ一覧用スキーマ作成

```typescript
// src/server/shared/schemas/recipe-summary.schema.ts
import { z } from 'zod';

export const RecipeSummarySchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    equipment: z.array(z.string()),
    roastLevel: z.string(),
    grindSize: z.string().optional(),
    beanWeight: z.number(),
    waterTemp: z.number(),
    waterAmount: z.number(),
  })
  .strict();

export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;

export const RecipeListResponseSchema = z
  .object({
    recipes: z.array(RecipeSummarySchema),
    pagination: PaginationSchema,
  })
  .strict();

export type RecipeListResponse = z.infer<typeof RecipeListResponseSchema>;
```

#### Step 1.4: レシピ詳細用スキーマ作成

```typescript
// src/server/shared/schemas/recipe-detail.schema.ts
import { z } from 'zod';

export const BaristaSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    profileImage: z.string().optional(),
  })
  .strict();

export const RecipeStepSchema = z
  .object({
    order: z.number().int().positive(),
    description: z.string(),
    duration: z.number().int().nonnegative().optional(),
  })
  .strict();

export const DetailedEquipmentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  })
  .strict();

export const RecipeTagSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .strict();

export const RecipeDetailSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string().optional(),
    remarks: z.string().optional(),
    roastLevel: z.string(),
    grindSize: z.string().optional(),
    beanWeight: z.number().optional(),
    waterTemp: z.number().optional(),
    waterAmount: z.number().optional(),
    viewCount: z.number().int().nonnegative(),
    isPublished: z.boolean(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    barista: BaristaSchema.optional(),
    steps: z.array(RecipeStepSchema),
    equipment: z.array(DetailedEquipmentSchema),
    tags: z.array(RecipeTagSchema),
  })
  .strict();

export type RecipeDetail = z.infer<typeof RecipeDetailSchema>;
```

#### Step 1.5: エクスポート集約

```typescript
// src/server/shared/schemas/index.ts
export * from './pagination.schema';
export * from './recipe-summary.schema';
export * from './recipe-detail.schema';
```

### Phase 2: DTO層の移行

#### Step 2.1: SearchRecipesResponse.tsの修正

- `RecipeSummaryDto`を削除
- `RecipeSummary`をスキーマからimport
- `SearchRecipesResponseMapper.toDto()`を`toResponse()`にリネーム

#### Step 2.2: RecipeDetailResponse.tsの修正

- `RecipeDetailDto`を削除
- `RecipeDetail`をスキーマからimport
- `RecipeDetailResponseMapper.toDto()`を`toResponse()`にリネーム

### Phase 3: Service層の型統合

#### Step 3.1: features/recipes/search/types.tsの修正

```typescript
// Before
export type Recipe = { ... };

// After
export { RecipeSummary as Recipe } from '@/server/shared/schemas';
// または、型名を統一して RecipeSummary を使用
```

#### Step 3.2: features/recipe/detail/types.tsの修正

```typescript
// Before
export type RecipeDetail = { ... };

// After
export { RecipeDetail } from '@/server/shared/schemas';
```

#### Step 3.3: Service層のマッピング処理削除

`service.ts`内でDTO→Service型への変換処理が不要になるため削除。

### Phase 4: テストの更新

- モックデータをスキーマに準拠するよう更新
- テストでスキーマによるバリデーションを追加

---

## 改善効果

### 修正ファイル数の削減

| 観点                           | Before    | After     |
| ------------------------------ | --------- | --------- |
| フィールド追加時の修正ファイル | 8ファイル | 5ファイル |
| 型定義箇所                     | 5箇所     | 2箇所     |
| マッピング回数                 | 3回       | 1回       |

### その他の効果

| 効果                       | 説明                                                  |
| -------------------------- | ----------------------------------------------------- |
| 型とバリデーションの一貫性 | Zodスキーマから型を生成するため、乖離が発生しない     |
| ランタイム検証             | APIレスポンスをスキーマで検証可能（開発時のバグ検出） |
| OpenAPI自動生成            | `zod-to-openapi`で仕様書を自動生成可能                |
| リファクタリング安全性     | 型変更時にコンパイルエラーで検出                      |

---

## クライアント側の型について

### 方針: 独立性を維持

クライアント側は**独自の型を維持**し、API Response型とは明確に分離する。

### 理由

1. **UIに最適化した型が必要**: 表示に必要なフィールドのみを持つ型
2. **変更の波及防止**: サーバー側の変更がクライアントに直接影響しない
3. **SSR/CSR境界の明確化**: Next.jsのサーバー/クライアント境界を意識した設計

### 実装

```typescript
// src/client/features/recipe-list/types/recipe.ts
import type { RecipeSummary as ApiRecipeSummary } from '@/server/shared/schemas';

// クライアント独自の型（UI表示に最適化）
export type RecipeCardData = {
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  // UI表示に必要なフィールドのみ
};

// API Response → Client型への変換関数
export const toRecipeCardData = (apiRecipe: ApiRecipeSummary): RecipeCardData => ({
  id: apiRecipe.id,
  title: apiRecipe.title,
  summary: apiRecipe.summary,
  equipment: apiRecipe.equipment,
});
```

---

## 注意事項

### Clean Architecture原則の遵守

- Zodスキーマは`server/shared/schemas`に配置（Presentation層の一部として扱う）
- Domain層はZodスキーマに依存しない
- スキーマはAPI境界の定義であり、ドメインロジックを含まない

### 段階的な移行

- 一度に全てを変更せず、Phase単位で実装・テスト
- 既存の機能が壊れないことを確認しながら進める

### テストファースト

- 各Phaseの実装前にテストを更新
- スキーマのバリデーションテストを追加

---

## 関連ドキュメント

- [Clean Architecture 改善計画書](./clean-architecture-improvement-plan.md)
- [DDD実装戦略](./ddd-implementation-strategy.md)
- [API設計書](./recipes/api-recipes.md)
