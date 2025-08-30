import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import RecipeDetailErrorBoundary from '@/client/features/recipe-detail/components/error/RecipeDetailErrorBoundary';
import ServerRecipeDetailError from '@/client/features/recipe-detail/components/error/ServerRecipeDetailError';
import PageHeader from '@/client/features/recipe-detail/components/layout/PageHeader';
import RecipeHeader from '@/client/features/recipe-detail/components/recipe/header/RecipeHeader';
import PreparationPointsCard from '@/client/features/recipe-detail/components/recipe/info/PreparationPointsCard';
import RecipeEquipmentList from '@/client/features/recipe-detail/components/recipe/parameters/RecipeEquipmentList';
import RecipeInfoCards from '@/client/features/recipe-detail/components/recipe/parameters/RecipeInfoCards';
import RecipeSteps from '@/client/features/recipe-detail/components/recipe/process/RecipeSteps';
import { RecipeErrors, RecipeDetailPageErrors } from '@/lib/errors';
import { logger, createLogContext } from '@/lib/logger';
import { getCachedRecipeMetadata } from '@/lib/recipe-cache';
import { validateRecipeId } from '@/lib/validation';

import { getRecipeDetailAction } from './actions';

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * メタデータ生成用のレシピ情報スキーマ
 * Next.js App RouterのgenerateMetadata要求に準拠し、
 * CMS APIの部分的なレスポンスから必要な情報のみを抽出・検証する
 *
 * @rationale CMSからのデータが不完全でも適切なSEOメタデータを生成し、
 * 検索エンジンのクロール品質を維持するため
 */
const RecipeMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  updatedAt: z.string(),
  barista: z
    .object({
      name: z.string(),
    })
    .nullable()
    .optional(),
  tags: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

/**
 * レシピ詳細ページのメタデータを動的に生成する
 *
 * CMSの更新頻度とSEO要件のバランスを取り、検索エンジンへの適切な
 * 情報提供を行う。不正なIDや取得エラー時も適切なfallbackメタデータで応答。
 *
 * @param params URLパラメータ（レシピID）
 * @returns SEO最適化されたメタデータ（OG、Twitter Cardを含む）
 * @rationale 検索結果の品質維持とソーシャルメディア共有時の適切な表示のため
 */

export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  const logContext = createLogContext('generateMetadata', recipeId);

  // SEOクローラーの404エラー蓄積を防ぐため、
  // 不正なIDは早期にfallbackメタデータで応答
  if (!validateRecipeId(recipeId)) {
    logger.warn(logContext, 'Invalid recipe ID in metadata generation');
    return RecipeErrors.RECIPE_NOT_FOUND;
  }

  try {
    const recipeData = await getCachedRecipeMetadata(recipeId);

    if (!recipeData) {
      logger.warn(logContext, 'Recipe not found for metadata generation');
      return RecipeErrors.RECIPE_ACCESS_DENIED;
    }

    // CMSからの不完全なデータでもメタデータ生成を継続するため、
    // 必須フィールドのみを検証し、欠損データは適切なfallbackを提供
    const parseResult = RecipeMetadataSchema.safeParse(recipeData);
    // メタデータ生成失敗時でもSEOクローラーに適切な情報を提供するため、
    // フォールバックメタデータで応答し検索結果の品質を維持
    if (!parseResult.success) {
      logger.error(
        { ...logContext, validationError: parseResult.error },
        'Recipe metadata validation failed'
      );
      return RecipeDetailPageErrors.METADATA_FALLBACK;
    }

    const recipe = parseResult.data;
    logger.info(logContext, 'Recipe metadata generated successfully');

    return {
      title: `${recipe.title} - Coffee Recipe Collection`,
      description: recipe.summary ?? `${recipe.title}の詳細なレシピをご紹介します。`,
      openGraph: {
        title: recipe.title,
        description: recipe.summary ?? `${recipe.title}の詳細なレシピ`,
        type: 'article',
        publishedTime: recipe.publishedAt ?? undefined,
        modifiedTime: recipe.updatedAt,
        authors: recipe.barista?.name ? [recipe.barista.name] : undefined,
        tags: recipe.tags.map((tag) => tag.name),
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
    // 予期しないエラー時もユーザーへの影響を最小化するため、
    // サイト全体のブランド体験を維持したフォールバックメタデータで応答
  } catch (error) {
    logger.error(
      { ...logContext, error: error instanceof Error ? error.message : 'Unknown error' },
      'Failed to generate metadata'
    );
    return RecipeDetailPageErrors.METADATA_FALLBACK;
  }
}

/**
 * レシピ詳細ページを表示する
 *
 * Server-side Renderingによりページ初期表示を最適化し、SEO効果を最大化する。
 * エラー時は適切なフォールバック画面を提供し、ユーザー体験を維持する。
 *
 * @param params URLパラメータ（レシピID）
 * @returns レシピの詳細情報とレイアウト、または該当しない場合は404/エラー画面
 * @rationale SSRによる初期表示高速化とSEO最適化、及びエラー時の適切な体験提供のため
 */
export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;
  const logContext = createLogContext('RecipeDetailPage', recipeId);

  // URLパラメータの早期検証により、CMSアクセス前に不正リクエストを除外し
  // サーバーリソースとレスポンス時間を節約
  if (!validateRecipeId(recipeId)) {
    logger.warn(logContext, 'Invalid recipe ID in page rendering');
    notFound();
  }

  try {
    const recipe = await getRecipeDetailAction(recipeId);
    logger.info(logContext, 'Recipe detail page rendered successfully');

    return (
      <RecipeDetailErrorBoundary
        fallbackTitle={RecipeDetailPageErrors.DISPLAY_ERROR.title}
        fallbackMessage={RecipeDetailPageErrors.DISPLAY_ERROR.description}
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
    // サーバーエラー時もユーザーに適切なフィードバックを提供し、
    // サイト利用を継続できるよう適切なエラーページで案内
  } catch (error) {
    logger.error(
      { ...logContext, error: error instanceof Error ? error.message : 'Unknown error' },
      'Failed to render recipe detail page'
    );
    return (
      <ServerRecipeDetailError
        title={RecipeDetailPageErrors.SERVER_ERROR.title}
        message={RecipeDetailPageErrors.SERVER_ERROR.description}
      />
    );
  }
}

// 新規レシピの即座反映とSEO最適化のため動的パラメータを許可
// CMSでの新しいレシピ公開時に即座にページが生成される
export const dynamicParams = true;

// CMSでのコンテンツ更新頻度（1-2時間）に基づき1時間でキャッシュ更新
// SEOパフォーマンスとコンテンツ鮮度のバランスを最適化
export const revalidate = 3600;
