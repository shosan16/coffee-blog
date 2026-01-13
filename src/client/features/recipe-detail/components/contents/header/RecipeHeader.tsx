import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card, CardContent } from '@/client/shared/shadcn/card';

type RecipeHeaderProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
  /** レシピタイトル */
  title: string;
};

/**
 * レシピヘッダーコンポーネント
 *
 * レシピのタイトル、概要、タグを表示する。
 */
export default function RecipeHeader({ recipe, title }: RecipeHeaderProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-5 md:p-7">
        <div className="space-y-6 px-3">
          {/* レシピタイトル */}
          <h1 className="text-card-foreground mb-3 text-2xl md:text-3xl">{title}</h1>

          {/* レシピ概要 */}
          {recipe.summary && (
            <div className="text-muted-foreground text-lg leading-relaxed">{recipe.summary}</div>
          )}

          {/* タグ表示 */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="border-border bg-background text-muted-foreground inline-flex items-center rounded-full border px-3 py-1.5 text-sm"
                  title={`タグ: ${tag.name}`}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
