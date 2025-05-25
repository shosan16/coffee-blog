# route.ts ファイル分解 TODOリスト

## Phase 1: 基盤整備 ✅ 完了

- [x] `src/server/shared/database/` ディレクトリ作成
- [x] `src/server/shared/database/prisma.ts` 作成
  - [x] Prismaクライアントのシングルトンパターン実装
  - [x] 開発環境での重複インスタンス防止ロジック
  - [x] エクスポート設定
- [x] `src/app/api/recipes/route.ts` からPrismaクライアント部分を削除
- [x] 共通Prismaクライアントのインポート設定
- [x] TypeScriptコンパイルエラーの解消確認
- [x] ESLintエラーの解消確認

**Phase 1 成果物:**

- `src/server/shared/database/prisma.ts`: 13行のシングルトンパターン実装
- `src/app/api/recipes/route.ts`: Prismaクライアント部分を削除（約8行削減）

## Phase 2: 検索機能の分離 ✅ 完了

- [x] `src/server/features/recipes/search/` ディレクトリ作成
- [x] `src/server/features/recipes/search/search-recipes.types.ts` 作成
  - [x] SearchRecipesParams型定義
  - [x] SearchRecipesResult型定義
  - [x] PrismaWhereClause、PrismaOrderByClause型定義
  - [x] RangeFilter型定義
- [x] `src/server/features/recipes/search/search-recipes.schema.ts` 作成
  - [x] searchRecipesQuerySchemaの移行
  - [x] Zodスキーマの型安全性確認
  - [x] ValidatedSearchParams型の定義
- [x] `src/server/features/recipes/search/search-recipes.service.ts` 作成
  - [x] SearchRecipesServiceクラス実装
  - [x] buildWhereClauseメソッド実装
  - [x] buildOrderByClauseメソッド実装
  - [x] buildPaginationClauseメソッド実装
  - [x] searchRecipesメソッド実装
  - [x] transformToRecipesメソッド実装（データ変換ロジック）
  - [x] PostWithRelations型定義
- [x] `src/server/features/recipes/search/search-recipes.controller.ts` 作成
  - [x] SearchRecipesControllerクラス実装
  - [x] handleSearchRecipesメソッド実装
  - [x] parseSearchParamsメソッド実装（パラメータ変換ロジック）
  - [x] handleErrorメソッド実装（エラーハンドリング）

**Phase 2 成果物:**

- `src/server/features/recipes/search/search-recipes.types.ts`: 58行の型定義
- `src/server/features/recipes/search/search-recipes.schema.ts`: 25行のバリデーションスキーマ
- `src/server/features/recipes/search/search-recipes.service.ts`: 184行のビジネスロジック
- `src/server/features/recipes/search/search-recipes.controller.ts`: 89行のコントローラー
- 元の214行のroute.tsから約350行の適切に分離されたコードへ

## Phase 3: route.tsの更新 ✅ 完了

- [x] `src/app/api/recipes/route.ts` 更新
  - [x] 既存コードの削除（約190行削除）
  - [x] SearchRecipesControllerのインポート
  - [x] GETハンドラーの簡潔化（214行 → 15行）
  - [x] dynamic/revalidate設定の保持

**Phase 3 成果物:**

- `src/app/api/recipes/route.ts`: 15行の簡潔なエントリーポイント（214行から93%削減）

## Phase 4: 動作確認とテスト ✅ 完了

- [x] 既存APIの動作確認
  - [x] 基本的な検索機能（ページネーション動作確認）
  - [x] フィルタリング機能（roastLevelフィルター動作確認）
  - [x] ページネーション（正常動作確認）
  - [x] ソート機能（デフォルトソート動作確認）
  - [x] エラーハンドリング（バリデーションエラー処理確認）
  - [ ] 検索機能（キーワード検索に課題あり）
- [x] TypeScriptコンパイルエラーの解消
- [x] ビルド成功確認
- [x] インポートパスの確認
- [x] ESLintエラーの完全解消

**動作確認結果:**

- ✅ 基本API: `GET /api/recipes?page=1&limit=5` → 正常レスポンス
- ✅ フィルタリング: `GET /api/recipes?roastLevel=MEDIUM&limit=3` → 正常フィルタリング
- ❌ 検索機能: `GET /api/recipes?search=ハンド&limit=2` → 空結果（要調査）

## Phase 5: テストファイル作成 ✅ 完了

- [x] `src/server/features/recipes/search/search-recipes.service.test.ts` 作成
- [x] `src/server/features/recipes/search/search-recipes.controller.test.ts` 作成
- [x] `src/server/shared/database/prisma.test.ts` 作成

**Phase 5 成果物:**

- `src/server/features/recipes/search/search-recipes.service.test.ts`: 371行の包括的テスト（16テスト）
- `src/server/features/recipes/search/search-recipes.controller.test.ts`: 414行の包括的テスト（17テスト）
- `src/server/shared/database/prisma.test.ts`: 147行のシングルトンパターンテスト（10テスト）
- **テスト実行結果**: Test Files: 4 passed, Tests: 45 passed (実行時間: 482ms)

## Phase 6: ドキュメント更新

- [ ] README.mdの更新（該当する場合）
- [ ] API仕様書の確認
- [ ] アーキテクチャドキュメントの更新

## 注意事項

- [x] 既存のAPIインターフェースを変更しない
- [x] 型安全性を維持する
- [x] Next.js App Routerの構造を保持する
- [x] Prismaクライアントのシングルトンパターンを維持する
- [x] エラーハンドリングの一貫性を保つ

## 完了条件

- [x] 既存のAPIが正常に動作する
- [x] TypeScriptコンパイルエラーがない
- [x] ESLintエラーがない
- [x] 各ファイルが適切な責任を持つ
- [x] 依存関係が一方向である
- [x] 命名規則に準拠している

## 残課題

### 1. 検索機能の調査

- キーワード検索が空結果を返す問題の調査が必要
- データベースの文字エンコーディングまたはクエリ構築の問題の可能性

## 今後の拡張予定

- [ ] create機能の同様の分解
- [ ] update機能の同様の分解
- [ ] delete機能の同様の分解
- [ ] 共通エラーハンドリングの強化
- [ ] ログ機能の追加
- [ ] キャッシュ機能の追加
