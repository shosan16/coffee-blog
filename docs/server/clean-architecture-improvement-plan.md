# Clean Architecture 改善計画書

## 📊 現状評価: **8.5/10**

### ✅ 優秀な実装点

#### 1. **レイヤー分離の徹底**

```
src/server/
├── domain/          # ビジネスロジック（内層）
├── application/     # ユースケース（中層）
├── infrastructure/ # 外部システム連携（外層）
├── features/       # 垂直スライス
└── shared/         # 横断的関心事
```

- **Dependency Inversion Principle** を適切に実装
- 各層の責任が明確に分離されている
- 依存関係の方向が Clean Architecture の原則に準拠

#### 2. **Rich Domain Model の実装**

**Recipe Entity (`src/server/domain/recipe/entities/recipe/Recipe.entity.ts`)**

```typescript
export class Recipe {
  // プライベートコンストラクタによる不正な生成の防止
  private constructor(/* ... */) {}

  // ファクトリーメソッドによる安全なインスタンス生成
  static reconstruct(data: {
    /* ... */
  }): Recipe;

  // ビジネスルールを内包するドメインメソッド
  equals(other: Recipe): boolean;
}
```

**Value Objects の適切な活用**

- `RecipeId`: エンティティの識別子
- `BrewingConditions`: 抽出条件の複合値オブジェクト

#### 3. **Repository Pattern の正しい実装**

**インターフェース定義 (`IRecipeRepository.ts`)**

```typescript
export type IRecipeRepository = {
  findById(id: RecipeId): Promise<Recipe | null>;
  findPublishedById(id: RecipeId): Promise<Recipe | null>;
  search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult>;
  // ...
};
```

**具象実装の分離**

- `PrismaRecipeRepository`: プロダクション用実装
- `MemoryRecipeRepository`: テスト用実装

#### 4. **エラーハンドリング戦略**

**階層的エラークラス設計**

```typescript
DomainError (基底クラス)
├── UseCaseError (アプリケーション層)
├── RepositoryError (インフラ層)
└── ValidationError (バリデーション)
```

**構造化エラー情報**

- ログ出力用のメタデータ
- API レスポンス用の変換機能
- 適切な HTTP ステータスコードの設定

#### 5. **型安全性の徹底**

- **Zod Schema** によるランタイムバリデーション
- **readonly 修飾子** による不変性の保証
- **Type-safe** なデータマッピング

---

## ⚠️ 改善すべき課題

### 1. **View Count ビジネスロジックの不整合** 🔴

**現在の問題:**

```typescript
// GetRecipeDetailUseCase.ts:129
// Note: In a real implementation, view count would be incremented via repository
// For now, we'll use the current view count + 1
const newViewCount = recipe.viewCount + 1;
```

**問題点:**

- View Count の増加処理が実装されていない（コメントアウトされた仮実装）
- ビジネスルールとして重要な機能が未完成
- データ整合性の問題（実際のDBは更新されない）

### 2. **サービス層の責任範囲曖昧** 🟡

**現在の問題:**

```typescript
// src/server/features/recipe/detail/service.ts
export async function getRecipeDetail(id: number): Promise<GetRecipeDetailResult> {
  const recipeRepository = new PrismaRecipeRepository(prisma);
  const useCase = new GetRecipeDetailUseCase(recipeRepository);

  const result = await useCase.execute(id.toString());

  // DTOマッピングをサービス層で実行（本来はコントローラー層の責任）
  const recipeDetail: RecipeDetail = RecipeDetailResponseMapper.toDto(result.recipe);
}
```

**問題点:**

- ユースケースとサービス層の責任が重複
- DTOマッピングをサービス層で実行（本来はコントローラー層の責任）
- 依存性注入が手動で行われている

### 3. **ドメインイベントの欠如** 🟡

**欠如している機能:**

- レシピ閲覧イベント（`RecipeViewedEvent`）
- レシピ公開イベント（`RecipePublishedEvent`）
- ビューカウント更新イベント（`ViewCountUpdatedEvent`）

**影響:**

- 副作用の処理（アナリティクス、通知等）が困難
- 横断的関心事の実装が不適切になる可能性
- ビジネスイベントの追跡・監査が困難

### 4. **トランザクション境界の不明確** 🟡

**現在の問題:**

- ユースケース単位でのトランザクション管理が未実装
- データ整合性の保証が曖昧
- 複数のリポジトリ操作における原子性の保証なし

### 5. **集約境界の曖昧さ** 🟠

**不明確な点:**

- Recipe 集約の境界が明確でない
- 関連エンティティ（Equipment, Tag）との整合性ルール未定義
- 集約ルート以外からの変更を防ぐ仕組みの不備

---

## 🛠️ 具体的改善提案

### 優先度: 高 🔴

#### 1. **View Count 更新機能の実装**

**Step 1: リポジトリインターフェース拡張**

```typescript
// IRecipeRepository.ts に追加
export type IRecipeRepository = {
  // 既存メソッド...

  /**
   * ビューカウントを増加する
   * @param id - レシピID
   * @returns 更新後のビューカウント
   */
  incrementViewCount(id: RecipeId): Promise<number>;
};
```

**Step 2: Prisma実装**

```typescript
// PrismaRecipeRepository.ts に追加
async incrementViewCount(id: RecipeId): Promise<number> {
  try {
    const updatedPost = await this.prisma.post.update({
      where: { id: BigInt(id.value) },
      data: {
        viewCount: { increment: 1 },
        updatedAt: new Date(),
      },
      select: { viewCount: true },
    });

    return updatedPost.viewCount;
  } catch (error) {
    logger.error('Failed to increment view count', { id: id.value, error });
    throw error;
  }
}
```

**Step 3: ユースケース修正**

```typescript
// GetRecipeDetailUseCase.ts 修正
async execute(id: string): Promise<GetRecipeDetailResult> {
  // 既存の検証ロジック...

  // ビューカウント増加（実際の更新）
  const newViewCount = await this.recipeRepository.incrementViewCount(recipeId);

  this.logger.info({
    recipeId: id,
    oldViewCount: recipe.viewCount,
    newViewCount,
  }, 'View count incremented successfully');

  return { recipe, newViewCount };
}
```

#### 2. **サービス層リファクタリング**

**Step 1: コントローラー層でのDTOマッピング**

```typescript
// src/server/features/recipe/detail/controller.ts (新規作成)
export class RecipeDetailController {
  constructor(private readonly useCase: GetRecipeDetailUseCase) {}

  async getRecipeDetail(id: number): Promise<GetRecipeDetailResult> {
    // ユースケース実行
    const result = await this.useCase.execute(id.toString());

    // DTOマッピング（コントローラー層の責任）
    const recipeDetail: RecipeDetail = RecipeDetailResponseMapper.toDto(result.recipe);

    return {
      recipe: recipeDetail,
      newViewCount: result.newViewCount,
    };
  }
}
```

**Step 2: サービス層の簡素化**

```typescript
// service.ts を削除し、controller.ts に統合
// または、サービス層をDIコンテナ管理に変更
```

#### 3. **ドメインイベント実装**

**Step 1: ドメインイベント基盤**

```typescript
// src/server/domain/shared/DomainEvent.ts (新規作成)
export abstract class DomainEvent {
  readonly occurredAt: Date = new Date();
  readonly eventId: string = crypto.randomUUID();

  abstract readonly eventType: string;
  abstract readonly aggregateId: string;
}

export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}
```

**Step 2: Recipe関連イベント**

```typescript
// src/server/domain/recipe/events/RecipeViewedEvent.ts (新規作成)
export class RecipeViewedEvent extends DomainEvent {
  readonly eventType = 'recipe.viewed';

  constructor(
    readonly aggregateId: string,
    readonly viewCount: number,
    readonly userId?: string
  ) {
    super();
  }
}
```

**Step 3: エンティティからのイベント発行**

```typescript
// Recipe.entity.ts 修正
export class Recipe {
  private _domainEvents: DomainEvent[] = [];

  incrementViewCount(): void {
    this._viewCount++;
    this.addDomainEvent(new RecipeViewedEvent(this.id.value, this._viewCount));
  }

  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
```

### 優先度: 中 🟡

#### 4. **トランザクション管理強化**

**Unit of Work パターンの導入**

```typescript
// src/server/shared/database/UnitOfWork.ts (新規作成)
export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  getRecipeRepository(): IRecipeRepository;
  // 他のリポジトリも追加
}

export class PrismaUnitOfWork implements UnitOfWork {
  private transaction?: Prisma.TransactionClient;

  constructor(private readonly prisma: PrismaClient) {}

  async begin(): Promise<void> {
    this.transaction = await this.prisma.$begin();
  }

  async commit(): Promise<void> {
    if (this.transaction) {
      await this.transaction.$commit();
    }
  }

  // 実装...
}
```

#### 5. **集約設計見直し**

**Recipe集約の境界明確化**

```typescript
// src/server/domain/recipe/aggregates/Recipe.aggregate.ts (新規作成)
export class RecipeAggregate {
  constructor(
    private readonly recipe: Recipe,
    private readonly steps: RecipeStep[],
    private readonly equipmentRefs: EquipmentReference[],
    private readonly tagRefs: TagReference[]
  ) {}

  // 集約全体の整合性を保つビジネスルール
  validateBusinessRules(): void {
    if (this.recipe.isPublished && this.steps.length === 0) {
      throw new ValidationError('公開レシピには最低1つの手順が必要です');
    }
  }

  // 集約内の変更を制御するメソッド
  updateRecipe(data: RecipeUpdateData): void {
    // ビジネスルールの検証
    this.validateBusinessRules();

    // ドメインイベントの発行
    this.recipe.addDomainEvent(new RecipeUpdatedEvent(this.recipe.id.value));
  }
}
```

---

## 📈 期待される効果

### 1. **保守性の向上**

- ビジネスロジックの責任が明確になり、変更の影響範囲が限定される
- ドメインイベントにより、横断的関心事の実装が容易になる

### 2. **拡張性の向上**

- 新機能追加時のコード変更箇所が最小限になる
- ドメインイベントにより、新しい副作用の追加が容易になる

### 3. **テスタビリティの向上**

- ユニットテストの実装が容易になる
- モックオブジェクトの作成が簡単になる

### 4. **データ整合性の保証**

- トランザクション境界が明確になり、データの整合性が保たれる
- 集約による不変条件の保証

### 5. **Clean Architecture 原則への完全準拠**

- 依存関係の方向が適切になる
- 各層の責任が明確になる
- ビジネスルールがドメイン層に集約される

---

## 🗓️ 実装スケジュール

### フェーズ1（1-2週間）

1. View Count 更新機能実装
2. サービス層リファクタリング

### フェーズ2（2-3週間）

1. ドメインイベント基盤実装
2. Recipe関連イベント実装

### フェーズ3（2-3週間）

1. トランザクション管理強化
2. 集約設計見直し

### フェーズ4（1週間）

1. 包括的テストケース作成
2. ドキュメント更新

---

## 🔗 関連ドキュメント

- [DDD実装戦略](./ddd-implementation-strategy.md)
- [DDDタスクリスト](./ddd-implementation-todo-list.md)
- [API設計書](./recipes/api-recipes.md)
- [OpenAPI仕様](./recipes/open-api/openapi.yaml)
