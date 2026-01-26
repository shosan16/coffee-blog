---
name: testing
description: プロジェクトのテスト規約を提供します。新しいテストを書く時、既存テストを修正する時に参照してください。
user-invocable: false
---

# テスト規約

## 配置

実装ファイルと同じディレクトリに `*.test.tsx` または `*.test.ts` として配置（コロケーション）

## AAA パターン

各ブロックの直前にコメントを記載：

```typescript
describe('calculateTax', () => {
  it('端数を切り捨てること', () => {
    // Arrange - 適格簡易請求書を作成し、品目を追加
    const inv = createSimplifiedInvoice();
    inv.add(new Item('技評茶', 130, 飲料), 2);

    // Act - 合計金額を計算
    const total = inv.total();

    // Assert - 税率ごとの税額を検証
    expect(total.tax).toEqual({ reduced: 19, standard: 40, total: 59 });
  });
});
```

## 契約による設計の3原則

テストで必ず検証：

- **事前条件**: 関数呼び出し前の状態
- **事後条件**: 関数呼び出し後の状態
- **不変条件**: 常に満たされるべき条件

## 時間依存テスト

- `vi.useFakeTimers()` と `vi.advanceTimersByTime()` を使用
- 実時間待機（setTimeout等）は禁止

## テストの命名

`describe` でコンテキストを、`it` で期待される振る舞いを記述：

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    describe('有効なメールアドレスの場合', () => {
      it('ユーザーを作成すること', () => { ... });
    });
    describe('無効なメールアドレスの場合', () => {
      it('ValidationError をスローすること', () => { ... });
    });
  });
});
```
