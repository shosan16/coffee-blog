import { Bean, Droplet, Settings } from 'lucide-react';

import { Recipe } from '@/client/features/recipes/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/filters';

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
      {/* コーヒーの染みのような装飾 */}
      <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
      <div className="absolute bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-orange-300/25 to-amber-300/15 blur-3xl" />

      {/* ヘッダー部分 */}
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-amber-800">
              {recipe.title}
            </CardTitle>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{recipe.summary}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* レシピ情報 - 固定レイアウト */}
        <div className="flex-1 space-y-3">
          {/* 豆・挽き目  */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Bean className="h-4 w-4 text-amber-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">焙煎度</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getRoastLevelLabel(recipe.roastLevel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">挽き目</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getGrindSizeLabel(recipe.grindSize)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">豆の量</span>
                    <span className="text-sm font-medium text-gray-900">{recipe.beanWeight}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 湯温・湯量  */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Droplet className="h-4 w-4 text-blue-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">湯温</span>
                    <span className="text-sm font-medium text-gray-900">{recipe.waterTemp}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">湯量</span>
                    <span className="text-sm font-medium text-gray-900">{recipe.waterAmount}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 器具  */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Settings className="h-4 w-4 text-gray-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="space-y-2">
                  {recipe.equipment.length > 0 ? (
                    <>
                      <div className="text-xs text-gray-600">器具</div>
                      <div className="space-y-1">
                        {recipe.equipment.slice(0, 3).map((item) => (
                          <div key={item} className="text-sm font-medium text-gray-900">
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-600">器具</div>
                      <div className="text-sm font-medium text-gray-500">なし</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* ホバー時のオーバーレイ効果 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-900/5 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Card>
  );
}
