import { Tag } from 'lucide-react';

import type { RecipeTagInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type RecipeTagListProps = {
  /** タグリスト */
  tags: RecipeTagInfo[];
};

/**
 * レシピタグ一覧表示コンポーネント
 *
 * レシピに関連するタグを表示する。
 * 将来的にはクリックで関連レシピ検索に飛べる。
 */
export default function RecipeTagList({ tags }: RecipeTagListProps) {
  if (tags.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <Tag className="text-primary h-6 w-6" />
            タグ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">タグが登録されていません</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-3">
          <Tag className="text-primary h-6 w-6" />
          タグ
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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
      </CardContent>
    </Card>
  );
}
