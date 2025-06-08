# プロジェクト全体 リンターエラー解消計画

## 目的

プロジェクト全体で発生している ESLint エラーを体系的に解消し、コード品質とメンテナンス性を向上させる。

## エラー分析

### 発生しているエラー種別

1. **Resolve Error: Failed to load native binding** - ESLint設定の問題
2. **import/order** - インポート順序違反 (47件)
3. **import/no-duplicates** - 重複インポート (23件)
4. **@typescript-eslint/no-unused-vars** - 未使用変数 (5件)
5. **@typescript-eslint/explicit-function-return-type** - 関数戻り値型未定義 (12件)
6. **@typescript-eslint/prefer-nullish-coalescing** - null/undefined チェック最適化 (3件)
7. **import/prefer-default-export** - デフォルトエクスポート推奨 (8件)
8. **no-nested-ternary** - ネストした三項演算子 (1件)
9. **react-hooks/exhaustive-deps** - useEffect依存配列不完全 (1件)
10. **@typescript-eslint/no-unnecessary-condition** - 不要な条件分岐 (4件)
11. **no-console** - console文使用 (5件)
12. **@typescript-eslint/no-explicit-any** - any型使用 (4件)

## 実装ステップ

### フェーズ1: 基盤修正（優先度: 高）

**時間見積もり: 2時間**

#### 1.1 ESLint設定修正

**現在の.eslintrc.jsの問題点:**

1. **import/order設定が現実的でない**
   - `'newlines-between': 'always'` が厳しすぎる
   - アルファベット順ソートが他の順序ルールと競合

2. **エクスポートルールの競合**
   - `import/no-default-export`と`import/prefer-default-export`が競合している

3. **TypeScript戻り値型ルールが厳しすぎる**
   - 段階的導入が必要

4. **any型の即座禁止**
   - 段階的に解消すべき

**修正内容:**

```javascript
// 修正版 .eslintrc.js の主要変更点

module.exports = {
  // ... existing config ...

  rules: {
    // インポート順序を現実的に調整
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never', // 常に空行を要求しない
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin']
      }
    ],

    // コンソール使用を開発環境では許可
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // エクスポートルールの統一
    'import/no-default-export': 'off', // デフォルト禁止を一旦解除
    'import/prefer-default-export': 'off', // 推奨も一旦解除
  },

  overrides: [
    // TypeScriptファイル共通設定を緩和
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // any型を段階的に解消するため警告に変更
        '@typescript-eslint/no-explicit-any': 'warn',

        // 不要な条件分岐チェックを警告に緩和
        '@typescript-eslint/no-unnecessary-condition': 'warn',

        // nullish coalescingを警告に緩和
        '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      }
    },

    // .tsファイルの戻り値型を段階的導入
    {
      files: ['**/*.ts'],
      rules: {
        // 一旦警告に変更、段階的にerrorに移行
        '@typescript-eslint/explicit-function-return-type': 'warn',
      }
    },

    // 特定ディレクトリでのルール緩和
    {
      files: [
        'src/client/shared/components/**/*.ts',
        'src/client/shared/components/**/*.tsx'
      ],
      rules: {
        // コンポーネントライブラリでは戻り値型を一旦緩和
        '@typescript-eslint/explicit-function-return-type': 'off',
      }
    },

    // デフォルトエクスポートの明確な使い分け
    {
      files: [
        // Next.jsページファイル
        '**/app/**/page.{tsx,jsx}',
        '**/app/**/layout.{tsx,jsx}',
        '**/app/**/loading.{tsx,jsx}',
        '**/app/**/error.{tsx,jsx}',
        '**/app/**/not-found.{tsx,jsx}',
        '**/pages/**/*.{tsx,jsx}',
        // メインコンポーネントファイル
        '**/components/**/index.{ts,tsx}',
      ],
      rules: {
        'import/prefer-default-export': 'error',
        'import/no-default-export': 'off',
      }
    },

    {
      files: [
        // ユーティリティファイル
        '**/utils/**/*.ts',
        '**/hooks/**/*.ts',
        '**/types/**/*.ts',
        // 非メインコンポーネント
        '**/components/**/*.{ts,tsx}',
        '!**/components/**/index.{ts,tsx}',
      ],
      rules: {
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'off', // 柔軟に対応
      }
    }
  ]
};
```

**追加で確認・修正が必要な項目:**

- [ ] `package.json`の依存関係確認（eslint-import-resolver関連）
- [ ] TypeScriptプロジェクト設定との整合性確認
- [ ] IDE/エディタ設定との連携確認

#### 1.2 パッケージ依存関係の確認

**確認すべき依存関係:**

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^13.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-import-resolver-typescript": "^3.6.0"
  }
}
```

**追加推奨パッケージ:**

```json
{
  "devDependencies": {
    "eslint-import-resolver-alias": "^1.1.2",
    "eslint-plugin-unused-imports": "^3.0.0"
  }
}
```

#### 1.3 段階的移行計画

**Phase 1a: 即座に適用（エラー解消優先）**

- import/order の設定緩和
- any型、戻り値型の警告化
- エクスポートルール競合解消

**Phase 1b: 1週間後に適用（品質向上）**

- 未使用インポートの自動削除設定
- より厳密な命名規則の適用

**Phase 1c: 1ヶ月後に適用（厳格化）**

- any型の段階的error化
- 戻り値型必須の段階的適用

### フェーズ2: インポート整理（優先度: 高）

**時間見積もり: 3時間**

#### 2.1 インポート順序統一

**修正対象:** 47ファイル

**正しい順序:**

1. React関連インポート
2. 外部ライブラリ
3. 内部ライブラリ（@/で始まるもの）
4. 相対パス（./で始まるもの）
5. 型インポート（type修飾子付き）

**修正例:**

```typescript
// 修正前
import { cn } from '@/client/lib/tailwind'
import React from 'react'
import type { ComboboxProps } from './types'

// 修正後
import React from 'react'
import { cn } from '@/client/lib/tailwind'
import type { ComboboxProps } from './types'
```

#### 2.2 重複インポート解消

**修正対象:** 23ファイル

**修正方針:**

```typescript
// 修正前
import React from 'react'
import { useState } from 'react'

// 修正後
import React, { useState } from 'react'
```

### フェーズ3: TypeScript型安全性向上（優先度: 中）

**時間見積もり: 2時間**

#### 3.1 関数戻り値型の明示

**対象ファイル:**

- `src/client/shared/components/combobox/hooks/useClickOutside.ts`
- `src/client/shared/components/combobox/hooks/useCombobox.ts`
- `src/client/shared/components/combobox/hooks/useComboboxKeyboard.ts`
- `src/client/shared/components/combobox/utils/accessibility.ts`

**修正例:**

```typescript
// 修正前
const useClickOutside = (callback: () => void) => {
  // 実装
}

// 修正後
const useClickOutside = (callback: () => void): React.RefObject<HTMLElement> => {
  // 実装
}
```

#### 3.2 any型の型安全化

**対象ファイル:**

- `src/client/shared/components/combobox/ComboboxDropdown.tsx`
- `src/client/shared/components/combobox/ComboboxInput.tsx`
- `src/client/shared/components/combobox/ComboboxOption.tsx`

**修正方針:**

```typescript
// 修正前
const handleEvent = (event: any) => { /* ... */ }

// 修正後
const handleEvent = (event: React.KeyboardEvent<HTMLInputElement>) => { /* ... */ }
```

### フェーズ4: エクスポート最適化（優先度: 低）

**時間見積もり: 1時間**

#### 4.1 デフォルトエクスポート対応

**対象ファイル:**

- `src/client/shared/components/combobox/` 配下の各ファイル
- `src/client/shared/components/combobox/utils/` 配下の各ファイル

**修正方針:**

- 単一エクスポートファイルはデフォルトエクスポートに変更
- 複数エクスポートが必要な場合は名前付きエクスポートを維持

### フェーズ5: React最適化（優先度: 中）

**時間見積もり: 1時間**

#### 5.1 useEffect依存配列修正

**対象ファイル:**

- `src/client/features/recipes/hooks/useRecipeFilter.ts`

**修正例:**

```typescript
// 修正前
useEffect(() => {
  // currentFiltersを使用している
}, []) // 依存配列に currentFilters が不足

// 修正後
useEffect(() => {
  // currentFiltersを使用している
}, [currentFilters])
```

#### 5.2 nullish coalescing演算子の適用

**対象ファイル:**

- `src/client/shared/components/combobox/ComboboxInput.tsx`
- `src/client/shared/components/combobox/utils/accessibility.ts`

**修正例:**

```typescript
// 修正前
const value = props.value || ''

// 修正後
const value = props.value ?? ''
```

### フェーズ6: コード品質向上（優先度: 低）

**時間見積もり: 30分**

#### 6.1 ネストした三項演算子の解消

**対象ファイル:**

- `src/client/shared/components/combobox/ComboboxDropdown.tsx`

**修正方針:**

```typescript
// 修正前
const content = isOpen ? (hasOptions ? <OptionsList /> : <NoOptions />) : null

// 修正後
const getContent = (): React.ReactNode => {
  if (!isOpen) return null
  return hasOptions ? <OptionsList /> : <NoOptions />
}
const content = getContent()
```

#### 6.2 不要な条件分岐の削除

**対象ファイル:**

- `src/client/features/recipes/components/filter/RecipeFilter.test.tsx`
- `src/client/features/recipes/hooks/useRecipeFilter.ts`
- `src/client/shared/components/combobox/Combobox.tsx`

**修正方針:**

- 型ガードで明らかに真となる条件の削除
- 論理演算子の最適化

#### 6.3 console文の適切な処理

**対象ファイル:**

- `src/server/shared/database/prisma.ts`

**修正方針:**

```typescript
// 修正前
console.log('Database connecting...')

// 修正後
// 開発環境でのみ表示、または適切なロガーライブラリの使用
if (process.env.NODE_ENV === 'development') {
  console.log('Database connecting...')
}
```

## 実行順序とバッチ処理

### バッチ1: 基盤修正

1. ESLint設定修正
2. 未使用変数削除

### バッチ2: インポート整理

1. 重複解消（自動修正可能）
2. 順序修正（ESLint --fix対応）

### バッチ3: 型安全性

1. 関数戻り値型追加
2. any型の具体化

### バッチ4: 最適化

1. エクスポート形式統一
2. React hooks最適化
3. 細かいコード品質向上

## 自動化可能な修正

以下のエラーは ESLint の `--fix` オプションで自動修正可能：

- `import/order`
- `import/no-duplicates`
- `@typescript-eslint/prefer-nullish-coalescing`（一部）

## 手動修正が必要な項目

- `@typescript-eslint/explicit-function-return-type`
- `@typescript-eslint/no-explicit-any`
- `import/prefer-default-export`
- `react-hooks/exhaustive-deps`
- `no-nested-ternary`

## 検証項目

### 各フェーズ完了後の確認事項

- [ ] `npm run lint` でエラーが0件
- [ ] `npm run type-check` でTypeScriptエラーが0件
- [ ] `npm run test` で全テストが通過
- [ ] アプリケーションが正常に起動・動作

## 継続的改善

### 今後の予防策

1. **pre-commit hook** の導入

   ```json
   {
     "husky": {
       "hooks": {
         "pre-commit": "lint-staged"
       }
     },
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "git add"]
     }
   }
   ```

2. **CI/CDでのlint必須化**
   - GitHub Actions等でlintチェック追加
   - merge前の必須チェック項目化

3. **エディタ設定の統一**
   - `.vscode/settings.json` での自動修正設定
   - Prettier連携の最適化

## 成功指標

- [ ] ESLintエラー 0件達成
- [ ] TypeScriptエラー 0件達成
- [ ] 全テスト通過維持
- [ ] アプリケーション動作正常性確認
- [ ] コードレビューでの品質向上確認

## 注意事項

- **破綻的変更の回避**: 既存APIの互換性を維持
- **段階的修正**: 一度に大量修正せず、段階的に実施
- [ ] テスト実行**: 各修正後の動作確認を徹底
- **チーム共有**: 修正方針をチーム内で事前共有
