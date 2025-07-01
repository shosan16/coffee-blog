'use client';

import dynamic from 'next/dynamic';
import { ComponentProps, Suspense } from 'react';

import { RecipeFilterSkeleton } from '@/client/shared/components/skeleton';

// RecipeFilterを動的インポート（バンドルサイズ最適化）
const RecipeFilter = dynamic(() => import('./RecipeFilter'), {
  loading: () => <RecipeFilterSkeleton />,
  ssr: false,
});

type LazyRecipeFilterProps = ComponentProps<typeof RecipeFilter>;

export default function LazyRecipeFilter(props: LazyRecipeFilterProps) {
  return (
    <Suspense fallback={<RecipeFilterSkeleton />}>
      <RecipeFilter {...props} />
    </Suspense>
  );
}
