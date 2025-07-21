# サーバーサイドの不要な実装調査報告書

## 概要

本報告書では、現在のサーバーサイド実装において、一覧機能・詳細機能以外の、本来まだ実装する必要のない機能（作成・更新・削除）の実装状況を調査した結果をまとめています。

## 調査結果概要

**結論**: 一覧機能・詳細機能と関係のない他の機能（作成・更新・削除）の実装コードが多数存在しています。

## 詳細調査結果

### 1. ドメイン層（Domain Layer）

#### 1.1 IRecipeRepository インターフェース

**場所**: `src/server/domain/recipe/repositories/IRecipeRepository.ts`

**問題**: 一覧・詳細機能以外のメソッドが定義されています

**不要な実装**:

- `save(recipe: Recipe, options?: RecipeSaveOptions): Promise<Recipe>` (112行目)
- `delete(id: RecipeId): Promise<boolean>` (122行目)
- `incrementViewCount(id: RecipeId): Promise<number>` (164行目)

**必要な実装**:

- `findById(id: RecipeId): Promise<Recipe | null>` (94行目)
- `findPublishedById(id: RecipeId): Promise<Recipe | null>` (103行目)
- `search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult>` (131行目)
- `findPublishedRecipes(criteria): Promise<RecipeSearchResult>` (140行目)
- `findByBarista(baristaId: string, criteria): Promise<RecipeSearchResult>` (152行目)

#### 1.2 Recipe エンティティ

**場所**: `src/server/domain/recipe/entities/Recipe.entity.ts`

**問題**: 作成・更新・削除に関連する多数のメソッドが実装されています

**不要な実装**:

- `create(params)` - 新規レシピ作成 (59行目)
- `publish()` - レシピ公開 (192行目)
- `unpublish()` - レシピ非公開 (212行目)
- `updateTitle(newTitle: string)` - タイトル更新 (228行目)
- `updateSummary(newSummary?: string)` - 概要更新 (246行目)
- `updateRemarks(newRemarks?: string)` - 備考更新 (264行目)
- `setSteps(steps: RecipeStep[])` - ステップ設定 (282行目)
- `setEquipmentIds(equipmentIds: string[])` - 器具ID設定 (304行目)
- `setTagIds(tagIds: string[])` - タグID設定 (314行目)

**必要な実装**:

- `reconstruct(data)` - 既存データからの再構築 (96行目)
- 各種getterメソッド (131行目以降)
- `equals(other: Recipe)` - 等価性判定 (325行目)

### 2. インフラ層（Infrastructure Layer）

#### 2.1 MemoryRecipeRepository

**場所**: `src/server/infrastructure/repositories/MemoryRecipeRepository.ts`

**問題**: 作成・更新・削除機能が完全に実装されています

**不要な実装**:

- `save(recipe: Recipe, options?: RecipeSaveOptions): Promise<Recipe>` (64行目)
- `delete(id: RecipeId): Promise<boolean>` (90行目)
- `incrementViewCount(id: RecipeId): Promise<number>` (294行目)

**必要な実装**:

- `findById(id: RecipeId): Promise<Recipe | null>` (49行目)
- `findPublishedById(id: RecipeId): Promise<Recipe | null>` (56行目)
- `search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult>` (97行目)
- `findPublishedRecipes(criteria): Promise<RecipeSearchResult>` (269行目)
- `findByBarista(baristaId: string, criteria): Promise<RecipeSearchResult>` (281行目)

#### 2.2 PrismaRecipeRepository

**場所**: `src/server/infrastructure/repositories/PrismaRecipeRepository.ts`

**問題**: 作成・更新・削除機能が完全に実装されています（トランザクション使用）

**不要な実装**:

- `save(recipe: Recipe, options?: RecipeSaveOptions): Promise<Recipe>` (109行目)
- `delete(id: RecipeId): Promise<boolean>` (286行目)
- `incrementViewCount(id: RecipeId): Promise<number>` (398行目)
- `updateExistingRecipe()` - 既存レシピ更新 (133行目)
- `createNewRecipe()` - 新規レシピ作成 (164行目)
- `updateRecipeSteps()` - ステップ更新 (201行目)
- `updateRecipeEquipment()` - 器具更新 (221行目)
- `updateRecipeTags()` - タグ更新 (243行目)

**必要な実装**:

- `findById(id: RecipeId): Promise<Recipe | null>` (34行目)
- `findPublishedById(id: RecipeId): Promise<Recipe | null>` (70行目)
- `search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult>` (318行目)
- `findPublishedRecipes(criteria): Promise<RecipeSearchResult>` (373行目)
- `findByBarista(baristaId: string, criteria): Promise<RecipeSearchResult>` (385行目)

#### 2.3 RecipeMapper

**場所**: `src/server/infrastructure/repositories/mappers/RecipeMapper.ts`

**問題**: 作成・更新用のマッピングメソッドが実装されています

**不要な実装**:

- `toCreateData(recipe: Recipe)` - 作成データ変換 (95行目)
- `toUpdateData(recipe: Recipe)` - 更新データ変換 (165行目)

**必要な実装**:

- `toDomain(prismaPost: PrismaRecipeWithRelations): Recipe` - ドメインエンティティ変換 (42行目)
- `toWhereClause(criteria)` - 検索条件変換 (207行目)
- `toOrderBy(sortBy, sortOrder)` - ソート条件変換 (351行目)

### 3. アプリケーション層（Application Layer）

#### 3.1 現在の実装状況

**場所**: `src/server/features/`

**現在の実装**:

- `recipe/detail/` - レシピ詳細機能（READ系のみ）
- `recipes/search/` - レシピ検索機能（READ系のみ）

**問題**: 作成・更新・削除のコントローラー・サービスは未実装のため、この層では問題なし

## 問題の影響

1. **開発効率の低下**: 不要な実装によりコードベースが肥大化
2. **保守性の悪化**: 必要以上の機能により複雑性が増加
3. **テストの複雑化**: 不要な機能のテストが必要
4. **設計の一貫性の欠如**: 段階的な実装戦略から逸脱

## 推奨対応

### 即座に対応すべき項目

1. **IRecipeRepository の簡素化**

   - `save`、`delete`、`incrementViewCount` メソッドの削除

2. **Recipe エンティティの簡素化**

   - 作成・更新系メソッドの削除
   - `create` メソッドの削除

3. **リポジトリ実装の簡素化**

   - `MemoryRecipeRepository` の CUD操作メソッド削除
   - `PrismaRecipeRepository` の CUD操作メソッド削除

4. **RecipeMapper の簡素化**
   - `toCreateData`、`toUpdateData` メソッドの削除

### 段階的に対応すべき項目

1. **関連する型定義の整理**

   - `RecipeSaveOptions` 型の削除
   - 作成・更新関連の型定義の整理

2. **テストファイルの整理**
   - 不要な機能のテストコードの削除

## 結論

現在のサーバーサイド実装には、一覧機能・詳細機能以外の多数の不要な実装が存在します。これらの実装は現在の開発フェーズでは必要なく、むしろ開発効率と保守性を阻害する要因となっています。

段階的な実装戦略に従い、現在必要な機能（READ系）のみに絞り込むことで、より効率的で保守性の高いコードベースを構築できます。
