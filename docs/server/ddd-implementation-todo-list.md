# DDD Implementation TODO List

## ✅ 即座実行タスク（Immediate）- 完了済み

### 🔥 緊急度: 高

- [x] **単体テストの作成** ✅ 完了 (2025-07-15)

  - [x] Recipe.entity.tsのテスト作成
  - [x] Barista.entity.tsのテスト作成
  - [x] Equipment.entity.tsのテスト作成
  - [x] RecipeIdのテスト作成
  - [x] BrewingConditionsのテスト作成
  - 期間: 1-2日

- [x] **品質チェックの実行と修正** ✅ 完了 (2025-07-15)

  - [x] `npm run format`実行とコミット
  - [x] `npm run lint`エラー解消
  - [x] `npx tsc --noEmit`型エラー解消
  - [x] `npm test`全テスト成功確認（565テスト成功、1スキップ）
  - 期間: 0.5日

- [x] **Phase 1完了レビュー** ✅ 完了 (2025-07-15)

  - [x] ドメインモデルの実装内容確認
  - [x] YAGNI原則適用結果の検証
  - [x] コード品質の最終チェック
  - 期間: 0.5日

- [x] **YAGNI原則適用によるコード簡素化** ✅ 完了 (2025-07-19)

  - [x] 未使用メソッド削除（約20個）
  - [x] 不要コード削除（約400行）
  - [x] 複雑さ指数40%削減
  - [x] 対応するテストファイル更新
  - [x] テスト環境設定修正（jsdom環境、scrollIntoViewモック追加）
  - [x] 全テスト正常化（554テスト成功、1スキップ）
  - 期間: 0.5日

- [x] **テスト品質向上とテスト環境最適化** ✅ 完了 (2025-07-19)
  - [x] フロントエンドテスト環境の修正（vitest.config.ts）
  - [x] JSDOMテスト環境の完全セットアップ
  - [x] @testing-library/jest-dom カスタムマッチャーの設定
  - [x] scrollIntoView等のWeb APIモックの追加
  - [x] 全40テストファイル、555テストの正常動作確認
  - 期間: 1日

---

## 📋 Phase 2: リポジトリパターン導入 ✅ 完了 (2025-07-19)

### 優先度: 高

#### Week 1（1-2日目）

- [x] **Prismaリポジトリの実装** ✅ 完了 (2025-07-19)

  - [x] `PrismaRecipeRepository.ts`作成
    - [x] `findById`メソッド実装
    - [x] `findPublishedById`メソッド実装
    - [x] ~~`save`メソッド実装~~ (YAGNI原則により削除)
    - [x] ~~`incrementViewCount`メソッド実装~~ (YAGNI原則により削除)
    - [x] `search`メソッド実装
    - [x] `findPublishedRecipes`メソッド実装
    - [x] `findByBarista`メソッド実装
    - [x] `exists`メソッド実装
    - [x] `findByIds`メソッド実装
    - [x] `count`メソッド実装
  - [x] Prismaデータからドメインエンティティへのマッピング実装

- [x] **テスト用メモリリポジトリの実装** ✅ 完了 (2025-07-19)
  - [x] `MemoryRecipeRepository.ts`作成
  - [x] 全IRecipeRepositoryメソッドの実装（READ系のみ）
  - [x] テストデータの準備機能

#### Week 1（3-4日目）

- [x] **リポジトリテストの作成** ✅ 完了 (2025-07-19)

  - [x] PrismaRecipeRepositoryの統合テスト
  - [x] MemoryRecipeRepositoryの単体テスト
  - [x] データマッピングの正確性テスト
  - [x] RecipeMapperの単体テスト

- [x] **段階的移行の準備** ✅ 完了 (2025-07-19)
  - [x] 既存サービス層との並行運用設定
  - [x] ~~フィーチャーフラグの設定（必要に応じて）~~ (不要と判断)
  - [x] パフォーマンス監視の準備

---

## 📋 Phase 3: スキーマ分離パターンの確立 ✅ 完了 (2025-07-19)

### 優先度: 高

**背景分析完了**: `docs/wip-prompt.md`で特定されたエンティティ内バリデーション混在問題を解決するための追加フェーズ。

#### Week 3（1-2日目）

- [x] **Baristaエンティティのスキーマ分離** ✅ 完了 (2025-07-19)

  - [x] `BaristaSchema.ts`ファイル作成（統一バリデーションスキーマ）
  - [x] バリデーション関心事の完全分離
  - [x] 重複バリデーションロジック統合（4個のupdateメソッド→1個に統合）
  - [x] コード行数49%削減（295行→151行）

- [x] **Equipment・Recipeエンティティへの適用** ✅ 完了 (2025-07-19)

  - [x] `EquipmentSchema.ts`作成（包括的バリデーション定義）
  - [x] `Recipe.types.ts`作成（YAGNI原則により最小限実装）
  - [x] 各エンティティからのスキーマ分離完了
  - [x] Equipmentエンティティ34%削減（282行→185行）

- [x] **エンティティ別ディレクトリ構造への移行** ✅ 完了 (2025-07-19)
  - [x] barista/, equipment/, recipe/ディレクトリ作成
  - [x] 全エンティティファイルの適切な配置
  - [x] index.tsファイル作成（DRY原則によるエクスポート一元管理）
  - [x] 5ファイルのインポートパス更新
  - [x] 品質チェック完全通過

#### Week 3（2-3日目）

- [x] **テスト更新と品質保証** ✅ 完了 (2025-07-19)
  - [x] 分離されたスキーマの独立テスト追加（BaristaSchema: 22テスト、EquipmentSchema: 29テスト）
  - [x] エンティティテストの簡素化（ドメインロジック集中）
  - [x] 全テスト通過確認（570/571テスト成功）
  - [x] リンティング・型チェック完全通過

**実装成果**:

- ✅ 単一責任原則の徹底（4大原則適用）
- ✅ スキーマ再利用性の向上
- ✅ エンティティファイルの責任明確化
- ✅ テスタビリティの大幅向上
- ✅ 保守性・拡張性の向上

**新しいディレクトリ構造**:

```
src/server/domain/recipe/entities/
├── barista/          # Baristaエンティティ関連
├── equipment/        # Equipmentエンティティ関連
├── recipe/           # Recipeエンティティ関連
└── index.ts          # エクスポート一元管理
```

---

## 🎯 Phase 4: ユースケース分離（2-3日）

### 優先度: 中

#### Week 2（1-2日目）

- [ ] **ユースケース層の実装**

  - [ ] `GetRecipeDetailUseCase.ts`実装
    - [ ] 依存注入の設定
    - [ ] ビジネスロジックの実装
    - [ ] エラーハンドリングの実装
  - [ ] `SearchRecipesUseCase.ts`実装
    - [ ] 検索ロジックの実装
    - [ ] ページネーション処理
    - [ ] フィルタリング機能

- [ ] **DTOとレスポンス形式の実装**
  - [ ] `RecipeDetailResponse.ts`作成
  - [ ] `SearchRecipesResponse.ts`作成
  - [ ] エンティティからDTOへの変換メソッド

#### Week 2（2-3日目）

- [ ] **コントローラーのスリム化**

  - [ ] `recipe/detail/controller.ts`リファクタリング
  - [ ] `recipes/search/controller.ts`リファクタリング
  - [ ] ユースケースの依存注入設定

- [ ] **既存サービス層からの移行**
  - [ ] 既存service.tsファイルの段階的削除
  - [ ] 新しいユースケースへの完全移行
  - [ ] 互換性テストの実行
