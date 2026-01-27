# API レスポンス型リファクタリング TODO

## 概要

APIレスポンスにフィールドを追加する際の修正箇所を削減するため、Zodスキーマによる型一元管理とDTO/Service層の型統合を行う。

**参照**: [refactor-response-type.md](./refactor-response-type.md)

---

## Phase 1: Zodスキーマ基盤の作成

### Step 1.1: スキーマディレクトリ作成

- [ ] `src/server/shared/schemas/` ディレクトリを作成

### Step 1.2: 共通スキーマ作成

- [ ] `src/server/shared/schemas/pagination.schema.ts` を作成
  - `PaginationSchema` の定義
  - `Pagination` 型のエクスポート (`z.infer`)
- [ ] テストファイル `pagination.schema.test.ts` を作成

### Step 1.3: レシピ一覧用スキーマ作成

- [ ] `src/server/shared/schemas/recipe-summary.schema.ts` を作成
  - `RecipeSummarySchema` の定義
  - `RecipeSummary` 型のエクスポート
  - `RecipeListResponseSchema` の定義（recipes + pagination）
  - `RecipeListResponse` 型のエクスポート
- [ ] テストファイル `recipe-summary.schema.test.ts` を作成

### Step 1.4: レシピ詳細用スキーマ作成

- [ ] `src/server/shared/schemas/recipe-detail.schema.ts` を作成
  - `BaristaSchema` の定義
  - `RecipeStepSchema` の定義
  - `DetailedEquipmentSchema` の定義
  - `RecipeTagSchema` の定義
  - `RecipeDetailSchema` の定義
  - 各型のエクスポート (`z.infer`)
- [ ] テストファイル `recipe-detail.schema.test.ts` を作成

### Step 1.5: エクスポート集約

- [ ] `src/server/shared/schemas/index.ts` を作成
  - 全スキーマと型のre-export

---

## Phase 2: DTO層の移行

### Step 2.1: SearchRecipesResponse.ts の修正

- [ ] `RecipeSummaryDto` 型定義を削除
- [ ] `PaginationDto` 型定義を削除
- [ ] `@/server/shared/schemas` から `RecipeSummary`, `Pagination` をimport
- [ ] `SearchRecipesResponseMapper.toDto()` → `toResponse()` にリネーム
- [ ] テストファイル `SearchRecipesResponse.test.ts` を更新

### Step 2.2: RecipeDetailResponse.ts の修正

- [ ] `BaristaDto`, `RecipeStepDto`, `DetailedEquipmentDto`, `RecipeTagDto`, `RecipeDetailDto` 型定義を削除
- [ ] `@/server/shared/schemas` から対応する型をimport
- [ ] `RecipeDetailResponseMapper.toDto()` → `toResponse()` にリネーム
- [ ] テストファイル `RecipeDetailResponse.test.ts` を更新

---

## Phase 3: Service層の型統合

### Step 3.1: features/recipes/search/types.ts の修正

- [ ] `Recipe` 型定義を削除
- [ ] `@/server/shared/schemas` から `RecipeSummary` をimport
- [ ] `Recipe` → `RecipeSummary` への型エイリアス or 直接使用に変更

### Step 3.2: features/recipe/detail/types.ts の修正

- [ ] `Barista`, `SocialLink`, `RecipeStep`, `DetailedEquipment`, `EquipmentType`, `RecipeTag`, `RecipeDetail` 型定義を削除
- [ ] `@/server/shared/schemas` から対応する型をimport

### Step 3.3: Service層のマッピング処理削除

- [ ] `features/recipes/search/service.ts` (79-92行目)
  - DTO → Service型への変換処理を削除
  - `responseMapper.toResponse()` の戻り値を直接使用
- [ ] `features/recipe/detail/service.ts` (75-78行目)
  - 型キャスト `as RecipeDetail` を削除

---

## Phase 4: テストの更新

### Step 4.1: モックデータの更新

- [ ] `features/recipes/search/test-helpers.ts` のモックデータをスキーマに準拠するよう更新
- [ ] 各テストファイルのモックデータを確認・修正

### Step 4.2: スキーマバリデーションテストの追加

- [ ] レスポンスがスキーマに準拠していることを検証するテストを追加

---

## Phase 5: 最終確認

- [ ] `npm run check-all` が通ることを確認
- [ ] 手動でAPI動作確認
- [ ] 不要なimport/型定義が残っていないか確認

---

## 影響を受けるファイル一覧

| ファイル                                              | 変更内容           |
| ----------------------------------------------------- | ------------------ |
| `src/server/shared/schemas/pagination.schema.ts`      | 新規作成           |
| `src/server/shared/schemas/recipe-summary.schema.ts`  | 新規作成           |
| `src/server/shared/schemas/recipe-detail.schema.ts`   | 新規作成           |
| `src/server/shared/schemas/index.ts`                  | 新規作成           |
| `src/server/application/dto/SearchRecipesResponse.ts` | 型削除、import変更 |
| `src/server/application/dto/RecipeDetailResponse.ts`  | 型削除、import変更 |
| `src/server/features/recipes/search/types.ts`         | 型削除、import変更 |
| `src/server/features/recipe/detail/types.ts`          | 型削除、import変更 |
| `src/server/features/recipes/search/service.ts`       | マッピング処理削除 |
| `src/server/features/recipe/detail/service.ts`        | 型キャスト削除     |
| 関連テストファイル群                                  | モックデータ更新   |

---

## 注意事項

1. **段階的な移行**: 一度に全てを変更せず、Phase単位で実装・テスト
2. **テストファースト**: 各Phase実装前にテストを更新
3. **Clean Architecture遵守**: Domain層はZodスキーマに依存しない
4. **クライアント型は独立維持**: サーバー側の変更がクライアントに直接影響しないよう分離
