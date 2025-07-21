# Clean Architecture 改善タスクリスト

## 📋 全体概要

**現状評価**: 8.5/10
**目標**: Clean Architecture原則の完全準拠と品質向上

---

## 🔴 優先度: 高 (フェーズ1: 1-2週間)

### 1. View Count 更新機能の実装

#### 1.1 リポジトリインターフェース拡張

- [ ] `IRecipeRepository.ts` に `incrementViewCount` メソッド追加
- [ ] JSDocコメント付きで型定義を作成
- [ ] テスト用インターフェース拡張

**ファイル**: `src/server/domain/recipe/repositories/IRecipeRepository.ts`

#### 1.2 Prisma実装追加

- [ ] `PrismaRecipeRepository.ts` に `incrementViewCount` 実装
- [ ] エラーハンドリングとログ追加
- [ ] BigInt型変換の安全な処理
- [ ] 楽観的排他制御の考慮

**ファイル**: `src/server/infrastructure/repositories/PrismaRecipeRepository.ts`

#### 1.3 Memory実装追加（テスト用）

- [ ] `MemoryRecipeRepository.ts` に `incrementViewCount` 実装
- [ ] テスト用の簡易実装
- [ ] データ整合性の確保

**ファイル**: `src/server/infrastructure/repositories/MemoryRecipeRepository.ts`

#### 1.4 ユースケース修正

- [ ] `GetRecipeDetailUseCase.ts` の仮実装削除
- [ ] 実際のリポジトリ呼び出しに変更
- [ ] エラーハンドリング強化
- [ ] ログメッセージの改善

**ファイル**: `src/server/application/use-cases/GetRecipeDetailUseCase.ts`

#### 1.5 テストケース作成

- [ ] ユースケースのユニットテスト作成
- [ ] リポジトリのテスト更新
- [ ] エラーケースのテスト追加
- [ ] 統合テストの作成

### 2. サービス層リファクタリング

#### 2.1 コントローラー層作成

- [ ] `RecipeDetailController.ts` 新規作成
- [ ] 依存性注入の設計
- [ ] DTOマッピングの移動
- [ ] エラーハンドリングの統一

**ファイル**: `src/server/features/recipe/detail/controller.ts`

#### 2.2 サービス層の簡素化

- [ ] 現在の `service.ts` の責任範囲見直し
- [ ] 不要な中間層の削除検討
- [ ] 依存性注入の自動化検討

**ファイル**: `src/server/features/recipe/detail/service.ts`

#### 2.3 APIルート修正

- [ ] Next.js API Routeの修正
- [ ] コントローラー呼び出しに変更
- [ ] エラーレスポンスの統一

**ファイル**: `src/app/api/recipes/[id]/route.ts`

#### 2.4 テスト更新

- [ ] コントローラーのテスト作成
- [ ] APIルートのテスト更新
- [ ] 統合テストの修正

### 3. ドメインイベント実装

#### 3.1 ドメインイベント基盤作成

- [ ] `DomainEvent.ts` 基底クラス作成
- [ ] `DomainEventHandler` インターフェース作成
- [ ] イベントディスパッチャー実装
- [ ] イベントストア機能（オプション）

**ファイル**: `src/server/domain/shared/DomainEvent.ts`

#### 3.2 Recipe関連イベント作成

- [ ] `RecipeViewedEvent.ts` 作成
- [ ] `RecipePublishedEvent.ts` 作成
- [ ] `ViewCountUpdatedEvent.ts` 作成
- [ ] イベントのスキーマ定義

**ディレクトリ**: `src/server/domain/recipe/events/`

#### 3.3 エンティティの修正

- [ ] `Recipe.entity.ts` にイベント管理機能追加
- [ ] `incrementViewCount()` ドメインメソッド追加
- [ ] イベント発行・管理機能の実装
- [ ] 不変性の保証

**ファイル**: `src/server/domain/recipe/entities/recipe/Recipe.entity.ts`

#### 3.4 イベントハンドラー実装

- [ ] ビューカウント更新ハンドラー
- [ ] アナリティクス送信ハンドラー
- [ ] 通知送信ハンドラー（将来用）

**ディレクトリ**: `src/server/infrastructure/event-handlers/`

#### 3.5 ユースケースとの統合

- [ ] イベント発行機能の統合
- [ ] トランザクション内でのイベント処理
- [ ] 副作用の非同期処理

---

## 🟡 優先度: 中 (フェーズ2-3: 4-6週間)

### 4. トランザクション管理強化

#### 4.1 Unit of Work パターン実装

- [ ] `UnitOfWork.ts` インターフェース作成
- [ ] `PrismaUnitOfWork.ts` 実装作成
- [ ] トランザクション境界の明確化
- [ ] リポジトリのトランザクション対応

**ファイル**: `src/server/shared/database/UnitOfWork.ts`

#### 4.2 ユースケースのトランザクション対応

- [ ] 自動トランザクション開始・終了
- [ ] ロールバック処理の実装
- [ ] ネストしたトランザクションの対応

#### 4.3 テストでのトランザクション管理

- [ ] テストケースでのトランザクション分離
- [ ] モックトランザクションの実装

### 5. 集約設計見直し

#### 5.1 Recipe集約の境界明確化

- [ ] `RecipeAggregate.ts` 作成
- [ ] 集約ルートの責任範囲定義
- [ ] 整合性ルールの実装
- [ ] 集約内エンティティの管理

**ファイル**: `src/server/domain/recipe/aggregates/RecipeAggregate.ts`

#### 5.2 関連エンティティとの整合性

- [ ] Equipment参照の適切な管理
- [ ] Tag参照の適切な管理
- [ ] Barista参照の適切な管理

#### 5.3 集約ファクトリーの実装

- [ ] 集約作成時の整合性チェック
- [ ] 複雑な集約作成ロジックの分離

---

## 🟠 優先度: 低 (フェーズ4: 1週間)

### 6. 包括的テストケース作成

#### 6.1 ユニットテスト強化

- [ ] エンティティのテスト充実
- [ ] Value Objectsのテスト充実
- [ ] ユースケースのテスト充実
- [ ] リポジトリのテスト充実

#### 6.2 統合テスト作成

- [ ] API層からドメイン層までの統合テスト
- [ ] ドメインイベントの統合テスト
- [ ] トランザクションの統合テスト

#### 6.3 パフォーマンステスト

- [ ] ビューカウント更新のパフォーマンステスト
- [ ] 大量データでの検索パフォーマンステスト

### 7. ドキュメント更新

#### 7.1 アーキテクチャドキュメント更新

- [ ] 改善後のアーキテクチャ図作成
- [ ] レイヤー間の依存関係図更新
- [ ] ドメインモデル図の作成

#### 7.2 開発者向けドキュメント

- [ ] 新しいパターンの使用方法
- [ ] ドメインイベントの活用ガイド
- [ ] トランザクション管理のベストプラクティス

#### 7.3 APIドキュメント更新

- [ ] OpenAPI仕様の更新
- [ ] エラーレスポンスの標準化
- [ ] レスポンス形式の統一

---

## 🔄 継続的改善項目

### セキュリティ強化

- [ ] 入力値検証の強化
- [ ] SQLインジェクション対策の確認
- [ ] ログ情報のサニタイズ

### パフォーマンス最適化

- [ ] N+1問題の解決
- [ ] インデックスの最適化
- [ ] キャッシュ戦略の検討

### 監視・ログ強化

- [ ] 構造化ログの充実
- [ ] メトリクス収集の実装
- [ ] アラート機能の追加

---

## 📊 進捗管理

### 完了基準

- [ ] すべてのテストがパスする
- [ ] リンティングエラーがゼロ
- [ ] 型エラーがゼロ
- [ ] コードカバレッジ90%以上
- [ ] ドキュメントが最新状態

### レビューポイント

- [ ] Clean Architecture原則への準拠
- [ ] SOLID原則の適用
- [ ] DRY原則の遵守
- [ ] YAGNI原則の適用
- [ ] セキュリティベストプラクティス

### 品質チェックコマンド

```bash
npm run format && npm run lint && npx tsc --noEmit && npm test --coverage
```

---

## 🔗 関連ドキュメント

- [Clean Architecture改善計画書](./clean-architecture-improvement-plan.md)
- [DDD実装戦略](./ddd-implementation-strategy.md)
- [API設計書](./recipes/api-recipes.md)
- [OpenAPI仕様](./recipes/open-api/openapi.yaml)

---

## 📝 備考

### 依存関係

- フェーズ1の完了がフェーズ2の前提
- ドメインイベント実装はトランザクション管理と密接に関連
- 集約設計はドメインイベントの設計に影響

### リスク管理

- 大規模なリファクタリングによる一時的な不安定化
- 既存機能への影響範囲の把握
- パフォーマンスへの影響の監視

### 成功指標

- コードの保守性向上（Cyclomatic Complexity削減）
- テストカバレッジの向上
- バグ発生率の減少
- 新機能開発速度の向上
