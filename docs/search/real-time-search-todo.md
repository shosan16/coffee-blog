# リアルタイム検索機能実装 TODOリスト

## 🚀 Phase 1: 基盤フック実装 (高優先度)

### 1.1 useDebounce フック作成

- [ ] `src/client/shared/hooks/useDebounce.ts` を新規作成
  - [ ] ジェネリック型 `<T>` で値とdelay時間を受け取る
  - [ ] `useEffect` と `setTimeout` でデバウンス実装
  - [ ] cleanup関数でタイマーキャンセル
  - [ ] 300-500ms対応
- [ ] `src/client/shared/hooks/useDebounce.test.ts` を新規作成
  - [ ] 正確な遅延実行のテスト
  - [ ] 値変更時のタイマーリセットテスト
  - [ ] cleanup時のキャンセルテスト
  - [ ] fakeTimers使用

### 1.2 useRealtimeRecipeSearch フック作成

- [ ] `src/client/features/recipe-list/hooks/useRealtimeRecipeSearch.ts` を新規作成
  - [ ] `UseRealtimeRecipeSearchReturn` 型定義
  - [ ] URLパラメータとの同期機能
  - [ ] useDebounceを使った検索キーワードデバウンス
  - [ ] 重複リクエスト防止（lodashのisEqual使用）
  - [ ] ローディング状態管理
  - [ ] エラーハンドリング
  - [ ] resetSearch / clearSearch 機能
- [ ] `src/client/features/recipe-list/hooks/useRealtimeRecipeSearch.test.ts` を新規作成
  - [ ] デバウンス動作の検証
  - [ ] 重複リクエスト防止の確認
  - [ ] エラーハンドリングのテスト
  - [ ] URLパラメータ同期のテスト

## 🔧 Phase 2: フィルターコンポーネント改修 (高優先度)

### 2.1 RecipeFilter.tsx 改修

- [ ] `useRealtimeRecipeSearch` への切り替え
- [ ] 「絞り込む」ボタンの完全削除
  - [ ] `applyFilters` 関数呼び出し削除
  - [ ] ボタンUI削除（147-191行目）
  - [ ] hasChanges表示部分削除（193-202行目）
- [ ] 即時適用機能の実装
  - [ ] フィルター変更時の自動URL更新
- [ ] ローディング表示の改良
  - [ ] リアルタイム検索中の視覚的フィードバック強化
  - [ ] エラー状態表示の追加

### 2.2 ConditionFilter.tsx 改修

- [ ] 数値入力フィールドのデバウンス対応
- [ ] onChange イベントでの即時反映
- [ ] 300msデバウンス適用

### 2.3 RangeSlider.tsx 改修

- [ ] スライダー値変更時の最適化
- [ ] ドラッグ中は更新を控え、リリース時に適用
- [ ] パフォーマンス向上

## 🔍 Phase 3: 検索ボックス改修 (中優先度)

### 3.1 SearchBox.tsx 改修

- [ ] `useRealtimeRecipeSearch` への統合
- [ ] デバウンス機能の内蔵
- [ ] 結果数のリアルタイム更新
- [ ] ローディング中の状態表示
- [ ] エラー時のメッセージ表示

### 3.2 HeroSearchSection.tsx 連携

- [ ] リアルタイム結果数表示の統合
- [ ] SearchBoxとの連携確認

## 📄 Phase 4: メインページ統合 (中優先度)

### 4.1 page.tsx 修正

- [ ] `useRecipeSearch` から `useRealtimeRecipeSearch` への移行
- [ ] 初期データ渡しの最適化
- [ ] サーバーサイドレンダリング対応の確認

## 🧪 Phase 5: テスト実装・品質チェック (高優先度)

### 5.1 既存テスト更新

- [ ] `RecipeFilter.test.tsx` の更新
  - [ ] 「絞り込む」ボタン関連テストの削除
  - [ ] フィルター変更時の即時検索実行テスト
  - [ ] ローディング状態表示の確認テスト
- [ ] `SearchBox.test.tsx` の更新
  - [ ] 検索キーワード入力時のデバウンステスト
  - [ ] 結果数のリアルタイム更新テスト

### 5.2 統合テスト

- [ ] ページ全体でのリアルタイム検索動作確認
- [ ] 複数フィルター同時変更時の動作テスト
- [ ] エラー発生時の動作確認

### 5.3 品質チェック

- [ ] `npm run check-all` の実行・修正
- [ ] ESLint エラーの解消
- [ ] TypeScript型エラーの解消
- [ ] テストカバレッジの確認

## 🔧 Phase 6: パフォーマンス最適化 (低優先度)

### 6.1 メモ化の活用

- [ ] `useMemo` での重い計算のキャッシュ化
- [ ] `useCallback` でのコールバック最適化
- [ ] 不要なレンダリング削減

### 6.2 リクエスト最適化

- [ ] AbortController での不要リクエストキャンセル
- [ ] SWRキャッシュの活用確認
- [ ] API呼び出し回数の最適化

## ⚠️ 技術的注意事項

### 破壊的変更の回避

- [ ] 既存のAPI仕様維持の確認
- [ ] URLパラメータ形式の変更なしを確認
- [ ] 既存テストの互換性保持

### エラーハンドリング

- [ ] API失敗時の前回結果保持機能
- [ ] 明確なエラーメッセージ表示
- [ ] グレースフルデグラデーション実装

### UX考慮事項

- [ ] 検索中の視覚的フィードバック
- [ ] デバウンス時間の調整（300-500ms）
- [ ] レスポンシブ対応の確認

## 📊 完了基準

### 機能要件

- [ ] ドロップダウン選択時の即時検索実行
- [ ] 数値入力のデバウンス検索（300ms）
- [ ] 重複検索の防止
- [ ] リアルタイム結果件数表示

### 品質要件

- [ ] 全テストパス
- [ ] ESLint・TypeScriptエラーなし
- [ ] パフォーマンス劣化なし
- [ ] 既存機能の動作保証

### UX要件

- [ ] 「検索中…」表示の実装
- [ ] エラー時の適切なメッセージ表示
- [ ] スムーズな検索体験の実現

---

## 🎯 実装順序

1. **Phase 1**: 基盤フック（useDebounce, useRealtimeRecipeSearch）
2. **Phase 2**: フィルターコンポーネント改修
3. **Phase 3**: 検索ボックス改修
4. **Phase 4**: メインページ統合
5. **Phase 5**: テスト・品質チェック
6. **Phase 6**: パフォーマンス最適化

各Phase完了後に動作確認を行い、問題があれば次のPhaseに進む前に修正してください。

---

**総タスク数**: 約50項目
**推定工数**: 2-3日
**優先度**: Phase 1-2 (高) → Phase 3-4 (中) → Phase 5 (高) → Phase 6 (低)
