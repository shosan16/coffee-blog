# レシピ検索テストファイル書き換え実装計画

## 現状分析

### 現在のテストファイルの問題点

#### search-recipes.service.test.ts の課題

1. **Contract Testの過度な使用**
   - 「事前条件」「事後条件」「不変条件」というコメントが多用されているが、これは契約ベーステストの考え方
   - test-ruleでは「振る舞いをテスト」することを推奨しており、実装の詳細に依存しすぎている

2. **テスト名の改善余地**
   - 「事前条件: 〜」「事後条件: 〜」という形式は認知負荷が高い
   - test-ruleでは「説明的で意味のあるテスト名（日本語も可）」を推奨

3. **テスト構造の改善点**
   - AAA（Arrange-Act-Assert）パターンが明確でない
   - モックの設定が複雑で理解しにくい

4. **古典学派アプローチの不徹底**
   - Prismaクライアント全体をモック化しているが、管理下の依存としてテストDBを使用すべき可能性

#### search-recipes.controller.test.ts の課題

1. **類似した課題**
   - service.test.tsと同様の契約ベーステストの問題
   - テスト名とテスト構造の改善余地

2. **統合テストとしての不完全性**
   - 実際のHTTPリクエスト処理をテストしていない
   - Next.jsのRoute Handlerとしての動作確認が不十分

## 改善方針

### 1. テストアプローチの変更

- **契約ベーステスト → 振る舞いベーステスト**
- **古典学派アプローチの徹底**
  - 共有依存（DB）のみモック化
  - 管理下の依存は実物を使用

### 2. テスト名とメッセージの改善

- **認知負荷の最小化**
- **System 1（直感的思考）で理解できるテスト名**
- **日本語での説明的なテスト名**

### 3. テスト構造の統一

- **AAA（Arrange-Act-Assert）パターンの明確化**
- **ヘルパー関数による共通セットアップの抽出**
- **テストデータの動的生成**

## 具体的な書き換え計画

### search-recipes.service.test.ts

#### Before (現在の問題のあるテスト例)

```typescript
it('事前条件: 有効なSearchRecipesParamsが渡されること', async () => {
  // 事前条件: 必須パラメータが存在する
  expect(mockSearchParams.page).toBeGreaterThan(0);
  // ... モックの設定とテスト実行
});
```

#### After (改善後)

```typescript
describe('検索条件に基づくレシピ取得', () => {
  it('ページネーション付きでレシピ一覧を取得できる', async () => {
    // Arrange - テストデータの準備
    const searchParams = createSearchParams({ page: 1, limit: 10 });
    const expectedRecipes = createMockRecipes(10);

    // Act - 検索実行
    const result = await service.searchRecipes(searchParams);

    // Assert - 結果検証
    expect(result.recipes).toHaveLength(10);
    expect(result.pagination.currentPage).toBe(1);
  });
});
```

#### 主な変更点

1. **テスト名の日本語化と意図の明確化**
2. **AAA パターンの明確な分離**
3. **ヘルパー関数による重複排除**
4. **データベーステストの導入検討**

### search-recipes.controller.test.ts

#### 改善方針

1. **Next.js Route Handlerとしての統合テスト**
2. **実際のHTTPリクエストレスポンスのテスト**
3. **エラーハンドリングの改善**

#### 新しいテスト構造

```typescript
describe('レシピ検索API', () => {
  describe('正常系', () => {
    it('基本的な検索リクエストで正しいレスポンスを返す', async () => {
      // Arrange
      const request = createSearchRequest({ page: 1, limit: 10 });

      // Act
      const response = await controller.handleSearchRecipes(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('recipes');
      expect(data).toHaveProperty('pagination');
    });
  });

  describe('異常系', () => {
    it('無効なページ番号でバリデーションエラーを返す', async () => {
      // テスト実装
    });
  });
});
```

## テストユーティリティの新規作成

### 必要なヘルパー関数

1. **createSearchParams** - テスト用検索パラメータ生成
2. **createMockRecipes** - テスト用レシピデータ生成
3. **createSearchRequest** - テスト用リクエストオブジェクト生成
4. **setupTestDatabase** - テストDB初期化（統合テストの場合）

### ファイル構成

```
src/server/features/recipes/search/
├── search-recipes.service.test.ts     # 改善後
├── search-recipes.controller.test.ts  # 改善後
└── test-utils/                        # 新規作成
    ├── mock-data.ts                    # テストデータ生成
    ├── request-helpers.ts              # リクエスト関連ヘルパー
    └── db-helpers.ts                   # DB関連ヘルパー（必要に応じて）
```

## 実装順序

### Phase 1: テストユーティリティの作成

1. `test-utils/mock-data.ts` - モックデータ生成関数
2. `test-utils/request-helpers.ts` - リクエストヘルパー関数

### Phase 2: Service テストの書き換え

1. テスト構造の統一（AAA パターン）
2. テスト名の改善（日本語化）
3. ヘルパー関数の活用
4. 不要な契約テストの削除

### Phase 3: Controller テストの書き換え

1. 統合テストとしての改善
2. エラーハンドリングテストの充実
3. レスポンス形式の検証改善

### Phase 4: 品質確認

1. カバレッジの確認（80%以上維持）
2. テスト実行速度の確認
3. テストの可読性確認

## 品質基準

### テストの4本の柱への対応

1. **退行に対する保護** - 重要なビジネスロジックのカバレッジ維持
2. **リファクタリングへの耐性** - 実装詳細ではなく振る舞いをテスト
3. **迅速なフィードバック** - テスト実行時間の短縮
4. **保守のしやすさ** - 認知負荷の低いテストコード

### 成功基準

- [ ] テスト名が日本語で意図が明確
- [ ] AAA パターンが明確に分離されている
- [ ] 重複コードがヘルパー関数に抽出されている
- [ ] エラーメッセージが分かりやすい
- [ ] テスト実行時間が改善されている
- [ ] カバレッジが維持されている（80%以上）

## リスク管理

### 潜在的リスク

1. **テスト書き換え中のカバレッジ低下**
   - 対策: 段階的な書き換えによる継続的な検証

2. **既存のバグ検出能力の低下**
   - 対策: 改善前後でのテスト結果比較

3. **開発効率の一時的低下**
   - 対策: ヘルパー関数の再利用による長期的な効率化

### マイルストーン

- [ ] Week 1: テストユーティリティ作成完了
- [ ] Week 2: Service テスト書き換え完了
- [ ] Week 3: Controller テスト書き換え完了
- [ ] Week 4: 品質確認・最終調整完了
