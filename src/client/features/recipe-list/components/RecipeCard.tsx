import { Bean, Droplet, Settings } from 'lucide-react';
import Link from 'next/link';

import type { Recipe } from '@/client/features/recipe-list/types/recipe';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block h-full">
      <Card className="group border-border bg-card flex h-full w-full cursor-pointer flex-col overflow-hidden border-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* コーヒーの染みのような装飾 */}
        <div className="bg-muted/20 absolute -top-6 -right-6 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-muted/20 absolute bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />

        {/* ヘッダー部分 */}
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-card-foreground line-clamp-2 text-lg font-bold transition-colors">
                {recipe.title}
              </CardTitle>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{recipe.summary}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col">
          {/* レシピ情報 - 固定レイアウト */}
          <div className="flex-1 space-y-3">
            {/* 豆・挽き目  */}
            <div className="border-border bg-muted rounded-lg border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="border-border bg-card flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
                  <Bean className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">焙煎度</span>
                      <span className="text-card-foreground text-sm font-medium">
                        {getRoastLevelLabel(recipe.roastLevel)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">挽き目</span>
                      <span className="text-card-foreground text-sm font-medium">
                        {getGrindSizeLabel(recipe.grindSize)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">豆の量</span>
                      <span className="text-card-foreground text-sm font-medium">
                        {recipe.beanWeight}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 湯温・湯量  */}
            <div className="border-border bg-muted rounded-lg border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="border-border bg-card flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
                  <Droplet className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">湯温</span>
                      <span className="text-card-foreground text-sm font-medium">
                        {recipe.waterTemp}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">湯量</span>
                      <span className="text-card-foreground text-sm font-medium">
                        {recipe.waterAmount}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 器具  */}
            <div className="border-border bg-muted rounded-lg border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="border-border bg-card flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
                  <Settings className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="space-y-2">
                    {recipe.equipment.length > 0 ? (
                      <>
                        <div className="text-muted-foreground text-xs">器具</div>
                        <div className="space-y-1">
                          {recipe.equipment.slice(0, 3).map((item) => (
                            <div key={item} className="text-card-foreground text-sm font-medium">
                              {item}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-muted-foreground text-xs">器具</div>
                        <div className="text-card-foreground text-sm font-medium">なし</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* ホバー時のオーバーレイ効果 */}
        <div className="bg-primary/5 pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}
