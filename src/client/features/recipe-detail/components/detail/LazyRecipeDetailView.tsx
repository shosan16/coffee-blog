'use client';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import type { RecipeDetailInfo } from '../../types/recipe-detail';
import { Card, CardContent } from '@/client/shared/shadcn/card';
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
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ヘッダー部分のスケルトン */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="space-y-4 p-8">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </CardContent>
          </Card>

          {/* レイアウト: デスクトップ2カラム、モバイル1カラム */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* メインコンテンツのスケルトン */}
            <div className="min-w-0 flex-1 space-y-8">
              {/* 基本情報カードのスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[
                      'recipe-title',
                      'roast-level',
                      'grind-size',
                      'bean-weight',
                      'water-temp',
                      'brew-time',
                    ].map((infoType) => (
                      <div key={infoType} className="space-y-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                        <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 手順のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-6 p-6">
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="space-y-4">
                    {['step-1', 'step-2', 'step-3', 'step-4'].map((stepId) => (
                      <div key={stepId} className="flex gap-4">
                        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                          <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 器具のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="space-y-4">
                    {['equipment-1', 'equipment-2', 'equipment-3'].map((equipmentId) => (
                      <div key={equipmentId} className="flex gap-4">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* サイドバーのスケルトン */}
            <aside className="w-full flex-shrink-0 space-y-6 lg:w-80">
              {/* バリスタ情報のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="space-y-2">
                      {['social-1', 'social-2'].map((socialId) => (
                        <div
                          key={socialId}
                          className="h-10 w-full animate-pulse rounded bg-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* タグのスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    {['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5', 'tag-6'].map((tagId) => (
                      <div
                        key={tagId}
                        className="h-6 w-20 animate-pulse rounded-full bg-gray-200"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      {/* ローディングインジケーター */}
      <div className="fixed right-8 bottom-8">
        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">読み込み中...</span>
        </div>
      </div>
    </div>
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
