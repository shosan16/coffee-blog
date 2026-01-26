---
name: documentation
description: JSDocとコードコメントの規約を提供します。公開関数の作成時、コメント追加時に参照してください。
user-invocable: false
---

# ドキュメンテーション規約

## JSDoc

公開関数には必須。ビジネスルールに特化し、型情報は TypeScript に任せる：

```typescript
/**
 * レシピIDを検証し、正の整数に変換する
 *
 * @param id - URL パラメータから取得した文字列ID
 * @returns 検証済みの正の整数ID
 * @throws 無効なID形式、0以下、MAX_SAFE_INTEGER超過の場合
 * @see インボイス制度対応仕様書 Section 3.2
 */
export function validateRecipeId(id: string): number { ... }
```

## コード内コメント（限定的）

以下のみ許可：

- 非自明なアルゴリズムの説明
- 技術的トレードオフの記録
- 法令・仕様書への参照

## WHY ルール

処理内容（HOW）ではなく理由・背景（WHY）を記載。
設計原則（SOLID、DRY等）を明示するコメントは禁止。

```typescript
// ❌ 悪い例 - HOW を説明
// 税額を計算する
const tax = amount * rate;

// ❌ 悪い例 - 設計原則を明示
// DRY原則に従い共通化
const tax = calculateTax(amount);

// ✅ 良い例 - WHY を説明
// インボイス制度では税率ごとの合計に対して税額計算（国税庁Q&A問42）
const tax = Math.floor(subtotal * rate);
```

## リファクタリング優先

コメントで説明が必要な複雑さは、まず関数分割や命名改善で解決を試みる。
コメントは最後の手段。
