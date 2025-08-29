import { Tag, Users, ExternalLink } from 'lucide-react';

import { Card, CardContent } from '@/client/shared/shadcn/card';

import type { RecipeDetailInfo } from '../types/recipe-detail';

type RecipeHeaderProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * レシピヘッダーコンポーネント
 *
 * レシピの概要、タグ、バリスタ情報を表示する。
 * ページヘッダーでタイトルが表示されるため、こちらではタイトルを除く詳細情報を担当。
 */
export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const renderBaristaSection = () => {
    if (!recipe.barista) return null;

    return (
      <div className="space-y-4" data-testid="barista-section">
        {/* バリスタセクションヘッダー */}
        <div className="flex items-center gap-3">
          <div className="border-border bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
            <Users className="text-primary h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-card-foreground text-lg font-bold">バリスタ</h3>
          </div>
        </div>

        {/* バリスタ基本情報 */}
        <div className="space-y-1 pl-13">
          <div className="text-card-foreground text-xl font-semibold" data-testid="barista-name">
            {recipe.barista.name}
          </div>
          {recipe.barista.affiliation && (
            <div className="text-muted-foreground text-sm" data-testid="barista-affiliation">
              {recipe.barista.affiliation}
            </div>
          )}
        </div>

        {/* SNSリンク */}
        {recipe.barista.socialLinks.length > 0 && (
          <div className="space-y-3 pl-13" data-testid="sns-section">
            <div className="text-muted-foreground text-sm font-medium">SNS</div>
            <div className="flex flex-wrap gap-2">
              {recipe.barista.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-muted hover:bg-muted/80 group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
                >
                  <div className="text-card-foreground text-sm font-medium">{link.platform}</div>
                  <ExternalLink className="text-muted-foreground group-hover:text-card-foreground h-4 w-4 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-8">
        <div className="space-y-6 px-3">
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
                  className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  title={`タグ: ${tag.name}`}
                >
                  <Tag className="mr-2 h-3 w-3" />
                  {tag.name}
                </div>
              ))}
            </div>
          )}

          {/* バリスタ情報 */}
          {renderBaristaSection()}
        </div>
      </CardContent>
    </Card>
  );
}
