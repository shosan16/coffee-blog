---
name: validation
description: Zodを使用した入力バリデーションパターンを提供します。API入力、フォーム入力のバリデーション実装時に参照してください。
user-invocable: false
---

# Zod バリデーション規約

## 基本パターン

```typescript
import { z } from 'zod';

export const RecipeIdSchema = z
  .string()
  .min(1, 'IDは必須です')
  .regex(/^[1-9][0-9]*$/, '正の整数を指定してください')
  .transform((val) => parseInt(val, 10))
  .refine((val) => val <= Number.MAX_SAFE_INTEGER, 'IDが大きすぎます');

export type RecipeId = z.infer<typeof RecipeIdSchema>;
```

## 必須ルール

- 型定義には `z.infer<typeof XxxSchema>` を使用
- バリデーションには `safeParse()` を使用（例外ではなく結果オブジェクト）
- `strict()` で unknown プロパティを拒否
- `default()`, `optional()` で nullable/optional を明示
- `refine()`, `transform()`, `message()` でわかりやすいエラーメッセージ

## オブジェクトスキーマ

```typescript
const CreateUserSchema = z
  .object({
    name: z.string().min(1, '名前は必須です'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    age: z.number().int().positive().optional(),
  })
  .strict();

type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

## バリデーション実行

```typescript
const result = CreateUserSchema.safeParse(input);

if (!result.success) {
  // result.error.flatten() でフラットなエラーオブジェクト取得
  return { error: result.error.flatten() };
}

// result.data で検証済みデータを使用
const validatedUser = result.data;
```

## API ルートでの使用

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // result.data で型安全にアクセス
}
```
