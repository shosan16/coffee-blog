# DDD Implementation Strategy

## 🎯 プロジェクト概要

### 背景

Coffee Recipe Collectionプロジェクトにおいて、サーバーサイドアーキテクチャをDDD（ドメイン駆動設計）/オニオンアーキテクチャに移行するプロジェクトを実施します。

### 採用アプローチ

**プラグマティックDDD** - 完全なオニオンアーキテクチャは過剰と判断し、プロジェクト規模に適した現実的なDDD実装を選択。

### 期待される効果

- **テスタビリティ向上**: リポジトリのモック化による単体テスト容易化
- **保守性向上**: ビジネスロジックの集約と責任分離
- **型安全性強化**: Zodによる宣言的バリデーション
- **拡張性向上**: 新機能追加の容易さ

---

## 📊 既存コード分析結果

### 発見された主要課題

#### 1. サービス層の責任肥大化

**問題**: `src/server/features/recipe/detail/service.ts`でビジネスルールとインフラ関心事が混在

```typescript
// 🔴 課題: ビューカウント増加ロジックがサービス層に混在
export async function getRecipeDetail(id: number): Promise<GetRecipeDetailResult> {
  // データ取得
  const recipe = await prisma.post.findFirst({ ... });

  // ビジネスルール（本来はエンティティの責任）
  if (!recipe.isPublished) {
    throw new RecipeDetailError('Recipe is not published', 'RECIPE_NOT_PUBLISHED', 403);
  }

  // 副作用処理（本来は別の責任）
  const updatedRecipe = await prisma.post.update({
    where: { id: BigInt(id) },
    data: { viewCount: { increment: 1 } },
  });
}
```

#### 2. インフラ依存による低テスタビリティ

**問題**: Prismaへの直接依存でモック化が困難

```typescript
// 🔴 課題: サービス層がPrismaに直接依存
import { prisma } from '@/server/shared/database/prisma';

export class SearchRecipesService {
  async searchRecipes(params: SearchRecipesParams): Promise<SearchRecipesResult> {
    // Prismaに直接依存（テストでモック化困難）
    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({ ... })
    ]);
  }
}
```

#### 3. ドメインモデル不在

**問題**: DTOのみでドメインエンティティが存在しない

```typescript
// 🔴 課題: 単純なデータ転送のみ、ビジネスルール分散
export type RecipeDetail = {
  id: string;
  title: string;
  // ... プロパティのみ、メソッド（振る舞い）なし
};
```

#### 4. 手動バリデーション課題

**問題**: 型安全性不足とエラーハンドリングの一貫性欠如

```typescript
// 🔴 課題: 手動バリデーション、型安全性不足
if (!title || title.trim().length === 0) {
  throw new Error('Recipe title is required');
}
if (title.length > 200) {
  throw new Error('Recipe title must be 200 characters or less');
}
```

---

## 🏗️ 目標アーキテクチャ構造

```
src/server/
├── domain/                          # ドメイン層
│   └── recipe/
│       ├── entities/
│       │   ├── Recipe.entity.ts     # ビジネスルール集約
│       │   ├── Barista.entity.ts    # バリスタエンティティ
│       │   └── Equipment.entity.ts  # 器具エンティティ
│       ├── value-objects/
│       │   ├── RecipeId.ts          # ID型安全性
│       │   └── BrewingConditions.ts # 抽出条件
│       └── repositories/
│           └── IRecipeRepository.ts # リポジトリインターフェース
│
├── application/                     # アプリケーション層
│   ├── use-cases/
│   │   ├── GetRecipeDetailUseCase.ts    # ビジネス操作集約
│   │   └── SearchRecipesUseCase.ts      # 検索ロジック集約
│   └── dto/
│       ├── RecipeDetailResponse.ts      # 外部境界DTO
│       └── SearchRecipesResponse.ts     # レスポンス形式定義
│
├── infrastructure/                  # インフラ層
│   ├── repositories/
│   │   ├── PrismaRecipeRepository.ts    # Prisma具象実装
│   │   └── MemoryRecipeRepository.ts    # テスト用実装
│   └── database/
│       └── prisma.ts                    # DB接続管理
│
├── features/ (既存)                 # 既存システム（段階的移行）
│   ├── recipe/detail/               # 段階移行予定
│   │   ├── controller.ts
│   │   ├── service.ts               # ユースケースへ移行予定
│   │   └── types.ts
│   └── recipes/search/              # 段階移行予定
│       ├── controller.ts
│       ├── service.ts               # ユースケースへ移行予定
│       └── types.ts
│
└── shared/ (既存)                   # 共有コード
    ├── api-error.ts
    ├── logger.ts
    ├── database/
    │   └── prisma.ts
    └── types/
        ├── api-response.ts
        ├── pagination.ts
        └── primitives.ts
```

---

## 🔧 技術的改善戦略

### Zodバリデーション採用

**従来**: 手動バリデーション、型安全性不足

```typescript
// 🔴 Before: 手動バリデーション
if (!title || title.trim().length === 0) {
  throw new Error('Recipe title is required');
}
```

**改善後**: 宣言的バリデーション、型安全性向上

```typescript
// ✅ After: Zodによる宣言的バリデーション
const RecipeCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Recipe title is required')
    .max(200, 'Recipe title must be 200 characters or less'),
});
```

### ビジネスルール集約

**従来**: サービス層に散在

```typescript
// 🔴 Before: サービス層でビジネスルール処理
if (!recipe.isPublished) {
  throw new RecipeDetailError('Recipe is not published', 'RECIPE_NOT_PUBLISHED', 403);
}
```

**改善後**: エンティティに集約

```typescript
// ✅ After: エンティティでビジネスルール管理
recipe.incrementViewCount(); // エンティティが責任を持つ
```

### 依存関係逆転の原則

**従来**: サービス層がインフラに直接依存

```typescript
// 🔴 Before: 直接依存
import { prisma } from '@/server/shared/database/prisma';
const recipe = await prisma.post.findFirst(...);
```

**改善後**: インターフェースによる抽象化

```typescript
// ✅ After: インターフェース依存
constructor(private recipeRepository: IRecipeRepository) {}
const recipe = await this.recipeRepository.findById(id);
```

---

## 📋 段階的移行戦略

### Phase 1: ドメインモデル導入 ✅完了

- ドメインエンティティとValueObjectの実装
- リポジトリインターフェースの定義
- Zodバリデーションスキーマの導入
- YAGNI原則適用によるコード簡素化

### Phase 2: リポジトリパターン導入（3-4日予定）

- Prismaリポジトリ実装の作成
- テスト用メモリリポジトリの実装
- 既存サービス層との並行運用
- 段階的なリポジトリ呼び出し移行

### Phase 3: スキーマ分離パターンの確立

**背景**: エンティティ内でバリデーションスキーマとドメインロジックが混在し、責任が不明確になっている課題を解決。

**実装戦略**:

```
src/server/domain/recipe/entities/
├── [Entity].entity.ts    # ドメインロジック専門
├── [Entity]Schema.ts     # Zodバリデーション専門
└── [Entity].types.ts     # 型定義専門
```

**分離の原則**:

- **単一責任原則**: エンティティはドメインロジックのみに集中
- **再利用性**: スキーマを他の層（API、サービス）で共有可能
- **保守性**: バリデーションルールの一元管理とDRY原則の徹底
- **テスタビリティ**: スキーマとエンティティの独立テスト実現

**解決する具体的課題**:

1. バリデーションロジックの重複（`updateName`/`updateAffiliation`メソッド）
2. インラインスキーマによる再利用性の低下
3. エンティティファイルの責任肥大化

### Phase 4: ユースケース分離 ✅完了（課題あり）

- ユースケース層の実装
- コントローラーのスリム化
- 既存サービス層からの完全移行

**実装課題が発見**:

- TDD違反（プレースホルダーテスト）
- 型安全性の放棄（any型の使用）
- DRY原則違反（エラークラスの重複）
- 総合評価：6/10（要改善）

### Phase 4.5: 品質改善（緊急対応）- 1-2日予定

**背景**: Phase 4のコードレビューで発見された重要品質課題の解決

**重要課題**:

1. **TDD違反の解消**（最重要）
   - プレースホルダーテストの実用テスト化
   - AAA（Arrange-Act-Assert）パターンの適用
   - ビジネスルールの包括的テストカバレッジ

2. **型安全性の修復**（高優先度）
   - DTOマッパーの`any`型使用排除
   - 適切な型定義とエラーハンドリング
   - コンパイル時型チェックの強化

3. **DRY原則違反の解決**（高優先度）
   - エラークラスの統一化
   - 共通ベースクラス（`DomainError`）の導入
   - 重複コードの統合

**成功基準**:

- 全テストが実用的で網羅的
- 型エラーゼロ、any型使用ゼロ
- エラーハンドリングの一貫性確保

### Phase 5: 完全統合とテスト強化 - 2-3日予定

**目標**: 真のClean Architectureの実現

**実装内容**:

1. **コントローラー直接統合**
   - サービス層の中間レイヤー除去
   - ユースケースの直接呼び出し実装
   - 依存性注入の最適化

2. **包括的テスト実装**
   - ユースケース単体テスト（モック使用）
   - リポジトリ統合テスト
   - エンドツーエンドテスト
   - パフォーマンステスト

3. **アーキテクチャ境界の強化**
   - 層間の依存関係検証
   - 循環依存の排除
   - インターフェース分離の改善

### Phase 6: エラーハンドリング統一 - 1-2日予定

**実装内容**:

1. **統一エラーシステム**
   - ドメインエラーの階層化
   - 一貫したエラーレスポンス形式
   - 国際化対応エラーメッセージ

2. **ログ出力の標準化**
   - 構造化ログの統一
   - エラートレーシングの強化
   - 監視・アラート連携

### Phase 7: パフォーマンス最適化 - 1-2日予定

**実装内容**:

1. **クエリ最適化**
   - N+1問題の解決
   - インデックス戦略の見直し
   - キャッシュ戦略の実装

2. **並行処理の最適化**
   - 非同期処理の改善
   - バッチ処理の効率化

---

## 🔍 Phase 4コードレビュー結果：4大原則違反分析

### 発見された重要品質課題

#### 1. TDD違反（最重要問題）

**違反内容**: CLAUDE.mdで「TDDをすべての実装の基本とする」と明記されているにも関わらず、プレースホルダーテストのみ

```typescript
// 🔴 問題のある実装
describe('GetRecipeDetailUseCase', () => {
  it('placeholder test', () => {
    expect(true).toBe(true); // 意味のないテスト
  });
});
```

**解決策**: AAA（Arrange-Act-Assert）パターンでの包括的テスト実装

#### 2. DRY原則重大違反（評価4/10）

**違反内容**:

- エラークラスの重複定義（3つの類似クラス）
- 型定義の分散と重複
- DTO変換ロジックの類似パターン

```typescript
// 🔴 問題のある重複
export class RecipeDetailUseCaseError extends Error {...}
export class SearchRecipesUseCaseError extends Error {...}
export class RecipeDetailError extends Error {...}
```

**解決策**: 共通ベースクラス`DomainError`の導入

#### 3. 型安全性の放棄

**違反内容**: DTOマッパーでの`any`型使用

```typescript
// 🔴 問題のある実装
static toDto(recipe: unknown): RecipeDetailDto {
  const r = recipe as any; // 型安全性を完全に放棄
  return {
    id: r.id?.toString() || '1', // ハードコードされたデフォルト値
  };
}
```

**解決策**: 適切な型定義とガード句による型安全な実装

#### 4. SOLID原則の部分違反

**開放閉鎖原則違反**: エラータイプ追加時の硬直性
**単一責任原則違反**: サービス層の責任不明確

### 総合評価

| 原則    | 評価     | 主な問題                   | 解決優先度 |
| ------- | -------- | -------------------------- | ---------- |
| YAGNI   | 8/10     | リポジトリの不要メソッド   | 中         |
| KISS    | 6/10     | DTOマッパーの過度な簡略化  | 高         |
| SOLID   | 7/10     | 開放閉鎖原則違反           | 中         |
| DRY     | 4/10     | 重複定義の多発             | 最高       |
| **TDD** | **2/10** | **プレースホルダーテスト** | **最高**   |

**総合評価**: 6/10（基盤は良好だが、品質面で重要な課題）

### Phase 4.5での改善目標

- **TDD準拠**: プレースホルダーテストゼロ化
- **型安全性**: `any`型使用完全排除
- **DRY原則**: 重複コード50%削減
- **品質評価**: 6/10 → 9/10への向上

---

## 🎯 品質保証方針

### テスト戦略

1. **単体テスト**: ドメインエンティティのビジネスルール
2. **統合テスト**: リポジトリとデータベース間の整合性

### YAGNI原則の適用

現在の要件に必要のない機能は実装せず、将来必要になった時点で追加する方針を採用。

### コード品質チェック

```bash
npm run format  # Prettier実行
npm run lint    # ESLint実行
npx tsc --noEmit # 型チェック
npm test        # テスト実行
```

---

## 📈 期待される効果と成果

### 技術的利益

- **テスタビリティ**: 90%向上（リポジトリモック化）
- **保守性**: 責任分離によるコード理解容易化
- **型安全性**: Zodによる実行時バリデーション強化
- **拡張性**: 新機能追加時の影響範囲限定

### ビジネス価値

- **バグ減少**: ドメインルール明確化による
- **開発速度**: 責任明確化による
- **品質向上**: 自動テスト容易化による
