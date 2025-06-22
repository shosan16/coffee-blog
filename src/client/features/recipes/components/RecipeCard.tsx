import { Bean, Droplet, Settings } from 'lucide-react';

import { Recipe } from '@/client/features/recipes/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/filters';

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden border-2 border-black bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl">
      {/* コーヒーの染みのような装飾 */}
      <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-black/10 blur-3xl" />
      <div className="absolute bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

      {/* ヘッダー部分 */}
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg font-bold text-black transition-colors group-hover:text-black">
              {recipe.title}
            </CardTitle>
            <p className="mt-2 line-clamp-2 text-sm text-black">{recipe.summary}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* レシピ情報 - 固定レイアウト */}
        <div className="flex-1 space-y-3">
          {/* 豆・挽き目  */}
          <div className="rounded-lg border border-black bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black bg-white">
                <Bean className="h-4 w-4 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">焙煎度</span>
                    <span className="text-sm font-medium text-black">
                      {getRoastLevelLabel(recipe.roastLevel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">挽き目</span>
                    <span className="text-sm font-medium text-black">
                      {getGrindSizeLabel(recipe.grindSize)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">豆の量</span>
                    <span className="text-sm font-medium text-black">{recipe.beanWeight}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 湯温・湯量  */}
          <div className="rounded-lg border border-black bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black bg-white">
                <Droplet className="h-4 w-4 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">湯温</span>
                    <span className="text-sm font-medium text-black">{recipe.waterTemp}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">湯量</span>
                    <span className="text-sm font-medium text-black">{recipe.waterAmount}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 器具  */}
          <div className="rounded-lg border border-black bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black bg-white">
                <Settings className="h-4 w-4 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-2">
                  {recipe.equipment.length > 0 ? (
                    <>
                      <div className="text-xs text-black">器具</div>
                      <div className="space-y-1">
                        {recipe.equipment.slice(0, 3).map((item) => (
                          <div key={item} className="text-sm font-medium text-black">
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-black">器具</div>
                      <div className="text-sm font-medium text-black">なし</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* ホバー時のオーバーレイ効果 */}
      <div className="pointer-events-none absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Card>
  );
}
