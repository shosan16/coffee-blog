'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { RecipeFilterSkeleton } from '@/client/shared/components/skeleton';

// RecipeFilterSheetを動的インポート（バンドルサイズ最適化）
const RecipeFilterSheet = dynamic(() => import('./RecipeFilterSheet'), {
  loading: () => <RecipeFilterSkeleton />,
  ssr: false,
});

/**
 * 遅延読み込み対応のレシピフィルターコンポーネント
 *
 * @description Sheet形式のフィルターを動的インポートでバンドルサイズを最適化
 * モバイル・デスクトップ両方で統一されたUI体験を提供
 */
export default function LazyRecipeFilter() {
  return (
    <Suspense fallback={<RecipeFilterSkeleton />}>
      <RecipeFilterSheet />
    </Suspense>
  );
}
