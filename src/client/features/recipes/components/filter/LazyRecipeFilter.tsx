'use client';

import dynamic from 'next/dynamic';
import { ComponentProps, Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

// RecipeFilterを動的インポート（バンドルサイズ最適化）
const RecipeFilter = dynamic(() => import('./RecipeFilter'), {
  loading: () => <RecipeFilterSkeleton />,
  ssr: false,
});

// ローディング状態のスケルトンコンポーネント
function RecipeFilterSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">フィルター条件</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 器具フィルタースケルトン */}
        <div className="space-y-4">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, () => crypto.randomUUID()).map((id) => (
              <div key={id} className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* 抽出条件フィルタースケルトン */}
        <div className="space-y-6">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="space-y-4">
            {Array.from({ length: 5 }, () => crypto.randomUUID()).map((id) => (
              <div key={id} className="space-y-3">
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type LazyRecipeFilterProps = ComponentProps<typeof RecipeFilter>;

export default function LazyRecipeFilter(props: LazyRecipeFilterProps) {
  return (
    <Suspense fallback={<RecipeFilterSkeleton />}>
      <RecipeFilter {...props} />
    </Suspense>
  );
}
