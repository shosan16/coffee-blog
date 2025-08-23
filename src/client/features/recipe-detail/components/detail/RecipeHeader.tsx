import { Coffee } from 'lucide-react';

import { Card, CardContent } from '@/client/shared/shadcn/card';

import type { RecipeDetailInfo } from '../../types/recipe-detail';

type RecipeHeaderProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * レシピヘッダーコンポーネント
 *
 * レシピのタイトル、概要、公開日などの基本情報を表示する。
 * 詳細画面の最上部に配置される。
 */
export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <Card className="border-border bg-card shadow-sm transition-all duration-300">
      {/* コーヒーの染みのような装飾 */}
      <div className="bg-muted/20 absolute -top-8 -right-8 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-muted/20 absolute bottom-8 -left-8 h-32 w-32 rounded-full blur-3xl" />

      <CardContent className="relative p-8">
        <div className="space-y-6 px-3">
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

          {/* 備考 */}
          {recipe.remarks && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 text-sm font-medium text-amber-800">💡 ポイント・注意事項</div>
              <p className="text-sm leading-relaxed text-amber-700">{recipe.remarks}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
