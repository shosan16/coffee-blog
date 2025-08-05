# リアルタイム検索機能実装計画

## 📋 現状分析

### 現在の実装方式

- **手動トリガー方式**: 「絞り込む」ボタンクリックで検索実行
- **Pending機能**: フィルター変更は一時保存され、明示的な適用が必要
- **重複チェック**: lodashの`isEqual`で変更検知を実装済み

### 主要コンポーネント

1. **useRecipeSearch**: 検索キーワード + フィルター統合管理
2. **useRecipeFilter**: フィルター条件のみ管理
3. **RecipeFilter**: UI層（「絞り込む」ボタンあり）

## 🎯 実装要件

### 基本機能

1. ドロップダウン（豆の種類、挽き具合など）選択時に即検索実行
2. 数値入力（豆の量、湯温、湯量）は入力停止後300msで検索実行（デバウンス）
3. 同一条件での重複検索を防止
4. 検索結果件数をリアルタイムに表示

### パフォーマンス要件

- デバウンス時間：300〜500ms
- 重複検索防止：前回リクエストと同一パラメータならAPIを呼ばない

### UX要件

- 検索中は「検索中…」を表示
- API失敗時は「検索に失敗しました。再試行してください。」を表示
- 新しい検索結果が届くまでは直前の結果を維持

## 🚀 実装計画

### Phase 1: 新しいリアルタイム検索フック作成

#### useRealtimeRecipeSearch.ts 新規作成

```typescript
// src/client/features/recipe-list/hooks/useRealtimeRecipeSearch.ts

export type UseRealtimeRecipeSearchReturn = {
  // 現在のフィルター状態
  filters: RecipeFilters;
  // フィルター更新（即時適用）
  updateFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  // 検索キーワード更新（デバウンス適用）
  updateSearchValue: (value: string) => void;
  // 現在の検索キーワード
  searchValue: string;
  // ローディング状態
  isLoading: boolean;
  // エラー状態
  error: string | null;
  // 検索結果数
  resultCount: number | undefined;
  // リセット機能
  resetSearch: () => void;
  clearSearch: () => void;
};
```

**主要機能**:

- ✅ デバウンス機能（useDebounce custom hook）
- ✅ 重複リクエスト防止（前回パラメータとの比較）
- ✅ エラーハンドリング
- ✅ ローディング状態管理

### Phase 2: デバウンス用ユーティリティフック

#### useDebounce.ts 新規作成

```typescript
// src/client/shared/hooks/useDebounce.ts

export function useDebounce<T>(value: T, delay: number): T;
```

### Phase 3: フィルターコンポーネント改修

#### RecipeFilter.tsx 修正点

1. **「絞り込む」ボタン削除**

   - `applyFilters`関数の呼び出し削除
   - ボタンUIの完全削除

2. **即時適用機能**

   - `useRealtimeRecipeSearch`への変更
   - フィルター変更時の即座URL更新

3. **ローディング表示改良**
   - 検索中状態の視覚的フィードバック強化
   - エラー状態の表示追加

#### ConditionFilter.tsx / RangeSlider.tsx 修正点

1. **数値入力のデバウンス対応**
   - `onChange`イベントでの即時反映
   - 300msデバウンス適用

### Phase 4: 検索ボックスコンポーネント改修

#### SearchBox.tsx 修正点

1. **リアルタイム検索対応**

   - `useRealtimeRecipeSearch`への統合
   - デバウンス機能の内蔵

2. **結果数表示の改良**
   - リアルタイム更新
   - ローディング中の状態表示

### Phase 5: メインページの統合

#### page.tsx 修正点

1. **新フックへの移行**
   - `useRecipeSearch` → `useRealtimeRecipeSearch`
   - 初期データ渡しの最適化

## 📁 ファイル構成

### 新規作成ファイル

```
src/client/features/recipe-list/hooks/
├── useRealtimeRecipeSearch.ts  # メインフック
└── useRealtimeRecipeSearch.test.ts

src/client/shared/hooks/
├── useDebounce.ts              # デバウンスフック
└── useDebounce.test.ts
```

### 修正対象ファイル

```
src/client/features/recipe-list/components/
├── filter/RecipeFilter.tsx           # ボタン削除・即時適用
├── filter/ConditionFilter.tsx        # デバウンス対応
├── filter/RangeSlider.tsx           # 数値入力最適化
└── search/SearchBox.tsx             # リアルタイム統合

src/app/page.tsx                      # 新フック統合
```

## 🧪 テスト戦略

### 単体テスト

1. **useRealtimeRecipeSearch.test.ts**

   - デバウンス動作の検証
   - 重複リクエスト防止の確認
   - エラーハンドリングのテスト

2. **useDebounce.test.ts**
   - 遅延実行の正確性
   - キャンセル機能のテスト

### 統合テスト

1. **RecipeFilter.test.tsx**

   - フィルター変更時の即時検索実行
   - ローディング状態の表示確認

2. **SearchBox.test.tsx**
   - 検索キーワード入力時のデバウンス
   - 結果数のリアルタイム更新

## 🔧 技術的考慮事項

### パフォーマンス最適化

1. **メモ化の活用**

   - `useMemo`での重い計算のキャッシュ
   - `useCallback`でのコールバック最適化

2. **リクエスト最適化**
   - AbortControllerでの不要リクエストキャンセル
   - SWRキャッシュの活用

### エラーハンドリング

1. **グレースフルデグラデーション**

   - API失敗時の前回結果保持
   - 明確なエラーメッセージ表示

2. **ユーザビリティ**
   - 検索中の視覚的フィードバック
   - エラー時のリトライ機能

## 📊 期待される効果

### UX向上

- ✅ 検索ボタンクリック不要のスムーズな体験
- ✅ リアルタイム検索結果数表示
- ✅ 即座のフィードバック

### パフォーマンス

- ✅ 重複リクエスト削減（API負荷軽減）
- ✅ デバウンスによる最適化
- ✅ 不要なレンダリング削減

### 保守性

- ✅ 関心の分離（検索ロジックの集約）
- ✅ テスタビリティの向上
- ✅ 既存コードへの影響最小化

## 🎯 実装順序

1. **Phase 1**: `useDebounce` + `useRealtimeRecipeSearch`の実装
2. **Phase 2**: `RecipeFilter`コンポーネントの改修
3. **Phase 3**: `SearchBox`の統合
4. **Phase 4**: 数値入力コンポーネントの対応
5. **Phase 5**: テスト実装・品質チェック

## ⚠️ 注意事項

### 破壊的変更の回避

- 既存のAPI仕様は維持
- URLパラメータ形式の変更なし
- 既存テストの互換性保持

### 段階的移行

- 機能フラグでの切り替え可能性を考慮
- ロールバック戦略の準備
- ユーザーフィードバックの収集体制

---

この計画に基づき、リアルタイム検索機能を段階的に実装し、ユーザー体験の大幅な向上を実現します。
