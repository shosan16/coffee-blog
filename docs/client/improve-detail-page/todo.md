# レシピ詳細ページ改善タスク

モック (`mock/recipe-detail-mock.html`) に合わせた実装レベルの修正タスク一覧

---

## 1. Hero セクション

**目的**: タイトル・説明・タグを1つのカードに統合し、ナビゲーションをstickyヘッダーに変更することで情報の視認性とスクロール時のナビゲーション利便性を向上させる

### UI変更

- [ ] `PageHeader.tsx` をstickyヘッダーに変更（`className` に `sticky top-0 z-50 bg-background py-3 md:py-4` を追加）
- [ ] 戻るボタンのスタイルを変更（`text-muted-foreground hover:text-card-foreground` に統一）
- [ ] シェアボタンを円形デザインに変更（`w-9 h-9 bg-card shadow-sm rounded-full flex items-center justify-center` を適用）
- [ ] `PageHeader.tsx` からタイトル表示を削除（`<h1>` 要素と `title` プロパティを削除）
- [ ] `RecipeHeader.tsx` に `title` プロパティを追加（`RecipeHeaderProps` に `title: string` を追加）
- [ ] `RecipeHeader.tsx` にタイトル表示を追加（`font-serif text-2xl md:text-3xl mb-3` スタイルでセリフフォント使用）
- [ ] タグのスタイルを変更（`bg-background border border-border px-3 py-1.5 rounded-full text-sm` に変更）

### コンポーネント分割

- [ ] `RecipeHeader.tsx` から `renderBaristaSection` 関数とバリスタ関連JSXを削除
- [ ] `src/app/recipes/[id]/page.tsx` で `RecipeHeader` に `title={recipe.title}` プロパティを渡す
- [ ] `src/app/recipes/[id]/page.tsx` で `PageHeader` から `title` プロパティを削除（`recipeId` のみ渡す）

### スタイリング変更

- [ ] `PageHeader.tsx` の `<header>` に `mb-6` を削除し、sticky関連スタイルを追加
- [ ] `RecipeHeader.tsx` の `CardContent` 内余白を `p-8` → `p-5 md:p-7` に変更
- [ ] 説明文に `leading-relaxed` を追加（既存の `leading-relaxed` を確認）

---

## 2. バリスタセクション

**目的**: バリスタ情報をアコーディオン形式に変更しデフォルトで折りたたむことでページの情報密度を最適化し、必要に応じて詳細を確認できるようにする

### UI変更

- [ ] `src/client/features/recipe-detail/components/contents/barista/BaristaCard.tsx` を新規作成
- [ ] アコーディオン用の `useState` フック追加（`const [isOpen, setIsOpen] = useState(false)`）
- [ ] トグルボタンを実装（`w-full flex items-center justify-between p-4 md:p-5 cursor-pointer`）
- [ ] アバター表示を実装（`w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center`）
- [ ] アバター内に `Users` アイコンを配置（`h-5 w-5`）
- [ ] バリスタ名と所属を縦積みレイアウトで実装（アバターの右側）
- [ ] トグルアイコン (`ChevronDown`) を実装（`transition-transform duration-300`、open時に `rotate-180`）
- [ ] SNSリンクのスタイルを変更（`bg-background rounded-full px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground`）

### データ構造変更

- [ ] `BaristaCardProps` 型定義を作成（`barista: RecipeDetailInfo['barista']` を受け取る）
- [ ] デフォルト状態を閉じた状態に設定（`useState(false)`）

### コンポーネント分割

- [ ] `RecipeHeader.tsx` から削除したバリスタセクションを `BaristaCard.tsx` に移行
- [ ] `src/app/recipes/[id]/page.tsx` で `BaristaCard` を import
- [ ] `src/app/recipes/[id]/page.tsx` で `BaristaCard` を `RecipeHeader` の直後に配置
- [ ] `recipe.barista` が存在する場合のみ `BaristaCard` をレンダリング（条件分岐）

### スタイリング変更

- [ ] アコーディオンコンテンツに `overflow-hidden transition-[max-height] duration-300 ease-out` を追加
- [ ] `max-height` を state に応じて切り替え（閉じた状態: `max-h-0`、開いた状態: `max-h-32`）
- [ ] SNSリンクコンテナの余白を `px-4 md:px-5 pb-4 md:pb-5` に設定

---

## 3. 抽出条件セクション

**目的**: 分離された2つのカードを1つに統合し主要数値を大きく表示することでレシピの重要パラメータを即座に把握できるようにする

### UI変更

- [ ] `BrewingParameterCards.tsx` の最外層グリッドを削除（`grid grid-cols-1 gap-4 md:grid-cols-2` を削除）
- [ ] 単一の `Card` コンポーネントに変更
- [ ] カードタイトルを「抽出条件」に変更
- [ ] アイコンを `Sliders` に変更（`lucide-react` から import）
- [ ] 主要パラメータ表示エリアを実装（`grid grid-cols-3 gap-3 md:gap-4 mb-5`）
- [ ] 各パラメータアイテムを実装（`bg-muted border border-border rounded-lg p-3.5 md:p-5 text-center`）
- [ ] 数値のスタイルを変更（`font-serif text-3xl md:text-4xl font-normal text-accent`）
- [ ] 単位を数値内に統合（`<span className="text-sm md:text-base ml-0.5">g</span>`）
- [ ] ラベル表示を変更（`text-xs text-muted-foreground mt-1.5`）
- [ ] 詳細情報エリアを実装（`border-t pt-4 md:pt-5 flex flex-wrap gap-4 md:gap-6`）
- [ ] 詳細項目のスタイルを変更（`flex items-center gap-2 text-sm`）

### 文言変更

- [ ] カードタイトルを「豆情報」「湯温・湯量」→「抽出条件」に統一

### データ構造変更

- [ ] 主要パラメータの表示優先順位を定義（豆の量 → 湯量 → 湯温の順）
- [ ] `undefined` チェックを追加（各パラメータが存在する場合のみ表示）

### コンポーネント分割

- [ ] 2つのカード構造（豆情報カード、湯温・湯量カード）を削除
- [ ] 単一カード内に主要パラメータセクションと詳細情報セクションを配置

### スタイリング変更

- [ ] 主要パラメータアイテムの背景を `bg-muted` に設定
- [ ] 詳細情報セクションに `border-t border-border` を追加
- [ ] ラベルの `text-muted-foreground` カラーを適用

---

## 4. 使用器具セクション

**目的**: 3カラムの詳細表示から2カラムのシンプル表示に変更し器具名とブランドに焦点を当てることで必要な情報を素早く認識できるようにする

### UI変更

- [ ] グリッドを3カラムから2カラムに変更（`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` → `grid-cols-1 md:grid-cols-2`）
- [ ] 器具アイテム全体を `<a>` タグでラップ（現在はアイコンのみリンク）
- [ ] 器具アイテムのレイアウトを横並びに変更（`flex items-center gap-3`）
- [ ] アイコン表示を変更（`w-10 h-10 bg-card rounded-lg flex items-center justify-center text-xl`）
- [ ] 器具タイプバッジを削除（`bg-primary/10 text-primary ...` の要素を削除）
- [ ] 器具説明テキストを削除（`{item.description && ...}` の条件分岐を削除）
- [ ] 外部リンクアイコンを削除（個別の `<a>` タグと `ExternalLink` アイコンを削除）
- [ ] ホバーエフェクトを変更（`hover:-translate-y-0.5 hover:shadow-md transition-transform`）

### データ構造変更

- [ ] アイコンマッピングロジックを追加（器具名やタイプに基づいて絵文字を割り当て）
- [ ] 器具タイプと説明の表示を条件分岐で除外

### スタイリング変更

- [ ] アイテム余白を `p-4` → `p-3` に変更
- [ ] アイコンサイズを `h-8 w-8` → `w-10 h-10` に拡大
- [ ] 器具名のフォントサイズを `text-sm font-semibold` → `text-sm md:text-base font-medium` に変更
- [ ] ブランドのフォントサイズを `text-xs` のまま維持

---

## 5. 抽出手順セクション

**目的**: 時間表示を累積形式から範囲形式に変更し各ステップの開始・終了時刻を明確にすることでタイミングの把握を容易にする

### UI変更

- [ ] ステップ番号デザインを変更（`h-12 w-12` → `h-8 w-8`）
- [ ] ステップマーカーのスタイルを変更（`bg-accent text-accent-foreground text-xs font-bold`）
- [ ] タイムラインの位置を調整（`left-6` → `left-4`）
- [ ] 総抽出時間の表示位置を変更（CardHeader内から section-header と同じ行の右側に配置）

### 文言変更

- [ ] 時間表示形式を変更（「30秒」→「0:00 - 0:20（20秒）」）
- [ ] `useTimeFormat` フックに `formatTimeRange` 関数を追加（開始時刻、終了時刻、経過時間を計算）

### データ構造変更

- [ ] 累積時間計算ロジックを実装（各ステップの `timeSeconds` から開始・終了時刻を算出）
- [ ] ステップごとに `startSeconds`、`endSeconds`、`durationSeconds` を計算
- [ ] 前ステップまでの累積時間を計算してstateに保持

### スタイリング変更

- [ ] ステップマーカーのサイズを `h-12 w-12` → `h-8 w-8` に縮小
- [ ] ステップコンテンツの余白を `p-4` → `p-3.5 md:p-4` に調整
- [ ] 完了ステップのデザインは維持（変更なし）
