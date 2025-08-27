import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageHeader from '@/client/features/recipe-detail/components/detail/PageHeader';
import PreparationPointsCard from '@/client/features/recipe-detail/components/detail/PreparationPointsCard';
import RecipeDetailErrorBoundary from '@/client/features/recipe-detail/components/detail/RecipeDetailErrorBoundary';
import RecipeEquipmentList from '@/client/features/recipe-detail/components/detail/RecipeEquipmentList';
import RecipeHeader from '@/client/features/recipe-detail/components/detail/RecipeHeader';
import RecipeInfoCards from '@/client/features/recipe-detail/components/detail/RecipeInfoCards';
import RecipeSteps from '@/client/features/recipe-detail/components/detail/RecipeSteps';
import ServerRecipeDetailError from '@/client/features/recipe-detail/components/detail/ServerRecipeDetailError';

import { getRecipeDetailAction } from './actions';

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * レシピ詳細ページのメタデータを動的に生成する
 * @param params URLパラメータ（レシピID）
 * @returns SEO最適化されたメタデータ（OG、Twitter Cardを含む）
 */
export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  if (!recipeId || !/^[1-9][0-9]*$/.test(recipeId)) {
    return {
      title: 'レシピが見つかりません - Coffee Recipe Collection',
      description: '指定されたレシピは存在しません。',
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
      next: { revalidate: 3600 },
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
 * レシピ詳細ページを表示する
 * @param params URLパラメータ（レシピID）
 * @returns レシピの詳細情報とレイアウト、または該当しない場合は404/エラー画面
 */
export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  if (!recipeId || !/^[1-9][0-9]*$/.test(recipeId)) {
    notFound();
  }

  try {
    const recipe = await getRecipeDetailAction(recipeId);

    return (
      <RecipeDetailErrorBoundary
        fallbackTitle="表示エラー"
        fallbackMessage="レシピ詳細の読み込み中にエラーが発生しました。"
      >
        <div className="bg-background min-h-screen">
          <main className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <PageHeader title={recipe.title} recipeId={recipe.id} />
              <RecipeHeader recipe={recipe} />
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="min-w-0 flex-1 space-y-8">
                  <RecipeInfoCards recipe={recipe} />
                  <PreparationPointsCard remarks={recipe.remarks} />
                  <RecipeSteps steps={recipe.steps} brewingTime={recipe.brewingTime} />
                  <RecipeEquipmentList equipment={recipe.equipment} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </RecipeDetailErrorBoundary>
    );
  } catch {
    return (
      <ServerRecipeDetailError
        title="サーバーエラー"
        message="レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。"
      />
    );
  }
}

export const dynamicParams = true;
export const revalidate = 3600;
