import { Calendar, Coffee } from 'lucide-react';

import type { RecipeDetailInfo } from '../../types/recipe-detail';
import { Card, CardContent } from '@/client/shared/shadcn/card';
import { useDateFormat } from '../../hooks/useDateFormat';

type RecipeHeaderProps = Readonly<{
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
}>;

/**
 * レシピヘッダーコンポーネント
 *
 * レシピのタイトル、概要、公開日などの基本情報を表示する。
 * 詳細画面の最上部に配置される。
 */
export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const { formatDate } = useDateFormat();

  return (
    <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* コーヒーの染みのような装飾 */}
      <div className="bg-muted/20 absolute -top-8 -right-8 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-muted/20 absolute bottom-8 -left-8 h-32 w-32 rounded-full blur-3xl" />

      <CardContent className="relative p-8">
        <div className="space-y-6">
          {/* タイトル部分 */}
          <div className="flex items-start gap-4">
            <div className="border-border bg-primary/10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border">
              <Coffee className="text-primary h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <h1 className="text-card-foreground text-3xl leading-tight font-bold">
                {recipe.title}
              </h1>
              {recipe.summary && (
                <p className="text-muted-foreground text-lg leading-relaxed">{recipe.summary}</p>
              )}
            </div>
          </div>

          {/* メタ情報 */}
          <div className="border-border bg-muted/50 rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* 公開日 */}
              {recipe.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {formatDate(recipe.publishedAt)}
                  </span>
                </div>
              )}

              {/* 公開状態 */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    recipe.isPublished ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <span className="text-muted-foreground text-sm">
                  {recipe.isPublished ? '公開中' : '非公開'}
                </span>
              </div>
            </div>
          </div>

          {/* 備考 */}
          {recipe.remarks && (
            <div className="border-border rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 text-sm font-medium text-amber-800">💡 ポイント・注意事項</div>
              <p className="text-sm leading-relaxed text-amber-700">{recipe.remarks}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
