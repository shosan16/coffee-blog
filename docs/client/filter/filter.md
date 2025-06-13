# コーヒーレシピフィルタリング機能実装計画

## 概要

コーヒーレシピの検索・絞り込みを行うフィルタリング機能を実装する。ユーザーは抽出器具と抽出条件の2つのカテゴリーから条件を指定してレシピを絞り込むことができる。

## 現状分析

### 既存実装の確認

#### サーバー側（実装済み）

- `/src/server/features/recipes/search/` にて検索・フィルタリング機能が実装済み
- 以下のフィルタリングが可能：
  - 焙煎度（roastLevel）- enum型、複数選択可
  - 挽き目（grindSize）- enum型、複数選択可
  - 器具名（equipment）- 文字列配列
  - 粉量（beanWeight）- 範囲フィルター
  - 湯温（waterTemp）- 範囲フィルター

#### クライアント側（未実装）

- フィルタリングUIコンポーネントは未実装
- RecipeListコンポーネントは存在するが、フィルタリング機能なし

#### データベース

- `post`テーブルにフィルタリング対象のカラムが存在
- 必要なインデックスは作成済み（roastLevel, grindSize, beanWeight, waterTemp）

## フィルタリング項目

### 1. 抽出器具

- **コーヒーミル**（器具タイプ）
- **ドリッパー**（器具タイプ）
- **ペーパーフィルター**（器具タイプ）

### 2. 抽出条件

- **焙煎度**（既存実装あり）
  - LIGHT / LIGHT_MEDIUM / MEDIUM / MEDIUM_DARK / DARK / FRENCH
- **挽き目**（既存実装あり）
  - EXTRA_FINE / FINE / MEDIUM_FINE / MEDIUM / MEDIUM_COARSE / COARSE / EXTRA_COARSE
- **粉量**（既存実装あり）
  - 範囲指定（g単位）
- **湯温**（既存実装あり）
  - 範囲指定（℃単位）
- **総湯量**（要追加実装）
  - 範囲指定（ml単位）

## 実装計画

### フェーズ1: バックエンド拡張（1日）

#### 1.1 データベース・型定義の更新

- [x] `waterAmount`フィルターはすでにDBに存在することを確認
- [ ] 器具タイプ（EquipmentType）でのフィルタリング機能追加

#### 1.2 サーバー側の実装更新

```typescript
// src/server/features/recipes/search/types.ts
export type SearchRecipesParams = {
  // ... 既存のパラメータ
  waterAmount?: RangeFilter; // 追加
  equipmentType?: string[]; // 追加（コーヒーミル、ドリッパー、ペーパーフィルター）
};
```

#### 1.3 検索サービスの更新

- `service.ts`に`waterAmount`と`equipmentType`のフィルタリングロジックを追加
- Prismaクエリの更新

#### 1.4 バリデーションの更新

- `validation.ts`に新しいフィルターパラメータの検証を追加

### フェーズ2: フロントエンドUI実装（3日）

#### 2.1 型定義の作成

```typescript
// src/client/features/recipes/types/filter.ts
export type RecipeFilter = {
  // 抽出器具
  equipmentTypes: string[];

  // 抽出条件
  roastLevels: RoastLevel[];
  grindSizes: GrindSize[];
  beanWeight: { min?: number; max?: number };
  waterTemp: { min?: number; max?: number };
  waterAmount: { min?: number; max?: number };
};
```

#### 2.2 フィルタリングコンポーネントの作成

##### ディレクトリ構造

```
src/client/features/recipes/components/filter/
├── RecipeFilter.tsx          // メインコンポーネント
├── RecipeFilter.test.tsx     // テスト
├── EquipmentFilter.tsx       // 器具フィルター
├── ConditionFilter.tsx       // 抽出条件フィルター
├── RangeSlider.tsx          // 範囲選択コンポーネント
└── index.ts                 // エクスポート
```

##### コンポーネント設計

1. **RecipeFilter**: フィルター全体を管理するコンテナコンポーネント
2. **EquipmentFilter**: 器具タイプの選択UI（チェックボックス）
3. **ConditionFilter**: 抽出条件の選択UI
   - セレクトボックス：焙煎度、挽き目
   - レンジスライダー：粉量、湯温、総湯量

#### 2.3 カスタムフックの作成

```typescript
// src/client/features/recipes/hooks/useRecipeFilter.ts
export const useRecipeFilter = () => {
  // URLクエリパラメータとフィルター状態の同期
  // フィルター変更時のデバウンス処理
  // フィルターのリセット機能
};
```

#### 2.4 既存コンポーネントの更新

- `RecipeList.tsx`にフィルタリング機能を統合
- フィルター状態に基づいたAPIリクエストの実装

### フェーズ3: UI/UXの最適化（2日）

#### 3.1 レスポンシブデザイン

- モバイル: フィルターをドロワーまたはモーダルで表示
- デスクトップ: サイドバーまたは上部に配置

#### 3.2 ユーザビリティ向上

- フィルター適用中の表示
- 選択中のフィルター数の表示
- フィルターのクリアボタン
- フィルター結果のリアルタイム更新（デバウンス付き）

#### 3.3 パフォーマンス最適化

- フィルター変更時のデバウンス（300ms）
- URLクエリパラメータでの状態管理（ブックマーク可能）
- 不要な再レンダリングの防止（React.memo, useMemo）

### フェーズ4: テストとドキュメント（1日）

#### 4.1 テスト実装

- [ ] バックエンドのユニットテスト更新
- [ ] フロントエンドのコンポーネントテスト
- [ ] E2Eテスト（フィルタリング機能の動作確認）

#### 4.2 ドキュメント作成

- [ ] APIドキュメントの更新
- [ ] コンポーネントのStorybook作成
- [ ] 使用方法のREADME作成

## 技術仕様

### API仕様

```
GET /api/recipes?
  roastLevel[]=MEDIUM&roastLevel[]=DARK&
  grindSize[]=FINE&
  equipmentType[]=dripper&equipmentType[]=grinder&
  beanWeight[min]=15&beanWeight[max]=20&
  waterTemp[min]=90&waterTemp[max]=95&
  waterAmount[min]=200&waterAmount[max]=300&
  page=1&limit=20
```

### 状態管理

- URLクエリパラメータで管理（Next.js useSearchParams）
- ブックマーク可能・共有可能な設計

### スタイリング

- Tailwind CSSを使用
- shadcn/uiコンポーネントの活用

## 実装順序

1. **バックエンドの拡張**（最優先）
   - waterAmountフィルターの追加
   - equipmentTypeフィルターの追加
   - テストの更新

2. **基本的なフィルターUI**
   - 型定義とフック
   - 基本的なフィルターコンポーネント
   - RecipeListとの統合

3. **UI/UXの改善**
   - レスポンシブ対応
   - アニメーション追加
   - アクセシビリティ対応

4. **テストとドキュメント**
   - 包括的なテストカバレッジ
   - 詳細なドキュメント作成

## 考慮事項

### パフォーマンス

- 大量のレシピに対応できるよう、適切なインデックスとページネーション
- フィルター変更時のデバウンス処理で不要なAPIリクエストを削減

### アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応
- 適切なARIAラベル

### 拡張性

- 新しいフィルター項目の追加が容易な設計
- フィルターロジックの共通化

## スケジュール

- **Week 1**: バックエンド拡張 + 基本UI実装
- **Week 2**: UI/UX最適化 + テスト実装

合計工数: 7日間
