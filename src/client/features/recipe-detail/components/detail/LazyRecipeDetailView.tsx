'use client';

import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { RecipeDetailSkeleton } from '@/client/shared/components/skeleton';

import type { RecipeDetailInfo } from '../../types/recipe-detail';

import RecipeDetailErrorBoundary from './RecipeDetailErrorBoundary';

// 動的インポートでRecipeDetailViewを遅延読み込み
const RecipeDetailView = lazy(() => import('./RecipeDetailView'));

type LazyRecipeDetailViewProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * レシピ詳細ビューの遅延読み込みコンポーネント
 *
 * 大きなコンポーネントの動的インポートにより、
 * 初期バンドルサイズを削減し、パフォーマンスを向上させる。
 */
function LoadingFallback() {
  return (
    <>
      <RecipeDetailSkeleton />
      {/* ローディングインジケーター */}
      <div className="fixed right-8 bottom-8">
        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">読み込み中...</span>
        </div>
      </div>
    </>
  );
}

/**
 * 遅延読み込み対応レシピ詳細ビュー
 */
export default function LazyRecipeDetailView({ recipe }: LazyRecipeDetailViewProps) {
  return (
    <RecipeDetailErrorBoundary
      fallbackTitle="表示エラー"
      fallbackMessage="レシピ詳細の読み込み中にエラーが発生しました。"
    >
      <Suspense fallback={<LoadingFallback />}>
        <RecipeDetailView recipe={recipe} />
      </Suspense>
    </RecipeDetailErrorBoundary>
  );
}
