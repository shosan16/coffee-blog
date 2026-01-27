---
name: react-components
description: Next.js 15のReactコンポーネント設計パターンを提供します。新しいコンポーネント作成時、既存コンポーネント修正時に参照してください。
user-invocable: false
---

# React/Next.js コンポーネント設計

## Server Components 優先

デフォルトは Server Component。以下の場合のみ `'use client'`：

- イベントハンドラ（onClick, onChange等）
- useState, useEffect 等のフック使用
- ブラウザAPIアクセス

```tsx
// Server Component（デフォルト）
export default async function Page() {
  const data = await fetchData();
  return <List items={data} />;
}
```

```tsx
// Client Component
'use client';
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

## ディレクトリ構造

```
src/client/features/{feature}/
├── components/
│   └── {ComponentName}/
│       ├── {ComponentName}.tsx
│       ├── {ComponentName}.test.tsx
│       └── index.ts
├── hooks/
├── utils/
└── types/
```

## コンポーネント構成

```tsx
type ButtonProps = {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button className={cn(baseStyles, variantStyles[variant])} onClick={onClick}>
      {children}
    </button>
  );
}
```

## 最適化

- 不要な再レンダリング防止: `React.memo`, `useMemo`, `useCallback`
- 画像: `next/image` 使用
- フォント: `next/font` 使用

## アクセシビリティ

- セマンティックHTML
- ARIA属性
- キーボードナビゲーション

## 状態管理パターン

- ローカル状態: useState
- サーバー状態: SWR / TanStack Query
- グローバル状態: Zustand
