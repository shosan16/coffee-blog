---
name: api-design
description: Next.js App RouterのAPI設計パターンを提供します。新しいAPIルート作成時に参照してください。
user-invocable: false
---

# API設計規約

## ファイル構造

```
src/app/api/{resource}/
├── route.ts          # GET, POST
├── route.test.ts
└── [id]/
    ├── route.ts      # GET, PUT, DELETE
    └── route.test.ts
```

## Route Handler 構成

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/server/shared/logger';

const CreateUserSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await request.json();

  // バリデーション
  const result = CreateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const user = await createUser(result.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    logger.error({ error, body }, 'Failed to create user');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## レスポンス形式

```typescript
// 成功
return NextResponse.json({ data: result });

// エラー
return NextResponse.json(
  { error: { code: 'NOT_FOUND', message: 'レシピが見つかりません' } },
  { status: 404 }
);
```

## ログ記録

- Pino ロガーで構造化ログ
- リクエスト: メソッド・パス・ユーザーID
- エラー: エラーオブジェクト + コンテキスト情報

```typescript
logger.error({ error, requestId, userId }, 'Failed to process request');
```
