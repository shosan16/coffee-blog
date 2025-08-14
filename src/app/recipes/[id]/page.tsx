import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lazy, Suspense } from 'react';

import RecipeDetailErrorBoundary from '@/client/features/recipe-detail/components/detail/RecipeDetailErrorBoundary';
import ServerRecipeDetailError from '@/client/features/recipe-detail/components/detail/ServerRecipeDetailError';
import { RecipeDetailSkeleton } from '@/client/shared/components/skeleton';

import { getRecipeDetailAction } from './actions';

// 動的インポートでRecipeDetailViewを遅延読み込み
const RecipeDetailView = lazy(
  () => import('@/client/features/recipe-detail/components/detail/RecipeDetailView')
);

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * レシピ詳細ページ
 *
 * 指定されたIDのレシピ詳細を表示する。
 * メタデータも動的に設定してSEO対応を行う。
 */

/**
 * ページのメタデータを動的に生成
 */
export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  // レシピIDのバリデーション
  if (!recipeId || !/^[1-9][0-9]*$/.test(recipeId)) {
    return {
      title: 'レシピが見つかりません - Coffee Recipe Collection',
      description: '指定されたレシピは存在しません。',
    };
  }

  try {
    // サーバーサイドでレシピ情報を取得してメタデータに使用
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
      // ISRのためのキャッシュ設定
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      return {
        title: 'レシピが見つかりません - Coffee Recipe Collection',
        description: '指定されたレシピは存在しないか、アクセスできません。',
      };
    }

    const recipe = await response.json();

    return {
      title: `${recipe.title} - Coffee Recipe Collection`,
      description: recipe.summary ?? `${recipe.title}の詳細なレシピをご紹介します。`,
      openGraph: {
        title: recipe.title,
        description: recipe.summary ?? `${recipe.title}の詳細なレシピ`,
        type: 'article',
        publishedTime: recipe.publishedAt,
        modifiedTime: recipe.updatedAt,
        authors: recipe.barista?.name ? [recipe.barista.name] : undefined,
        tags: recipe.tags?.map((tag: { name: string }) => tag.name),
      },
      twitter: {
        card: 'summary_large_image',
        title: recipe.title,
        description: recipe.summary ?? `${recipe.title}の詳細なレシピ`,
      },
      alternates: {
        canonical: `/recipes/${recipeId}`,
      },
    };
  } catch {
    return {
      title: 'レシピ詳細 - Coffee Recipe Collection',
      description: 'コーヒーレシピの詳細情報をご覧いただけます。',
    };
  }
}

/**
 * レシピ詳細の動的インポート中にユーザー体験を向上させるローディング表示
 *
 * スケルトンUI + インジケーターの組み合わせで読み込み待機時の不安感を軽減し、
 * 長時間の読み込みでもユーザーが待機し続けられる視覚的フィードバックを提供
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
 * レシピ詳細ページコンポーネント
 */
export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  // レシピIDのバリデーション
  if (!recipeId || !/^[1-9][0-9]*$/.test(recipeId)) {
    notFound();
  }

  try {
    // Server Actionでレシピ詳細を取得
    const recipe = await getRecipeDetailAction(recipeId);

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
  } catch {
    // Server ActionでnotFound()が呼ばれなかった場合のエラーハンドリング
    return (
      <ServerRecipeDetailError
        title="サーバーエラー"
        message="レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。"
      />
    );
  }
}

/**
 * 動的ルートの静的生成設定
 *
 * 開発時は無効にして、本番環境では有効にする
 */
export const dynamicParams = true;

/**
 * ページの動的レンダリング設定
 *
 * レシピ詳細は頻繁に更新されないので、
 * ISRを使用してパフォーマンスを向上させる
 */
export const revalidate = 3600; // 1時間
