import { Bean, Droplet, Settings, Coffee, Timer, ThermometerSun } from 'lucide-react';
import React from 'react';

import { Recipe } from '@/client/features/recipes/types/recipe';
import { Badge } from '@/client/shared/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type RecipeCardProps = {
  recipe: Recipe;
};

const RecipeCard = React.memo(function RecipeCard({ recipe }: RecipeCardProps) {
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
          <div className="ml-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
              <Coffee className="h-6 w-6" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 pt-4">
        {/* レシピ情報 - 固定レイアウト */}
        <div className="flex-1 space-y-3">
          {/* 豆・挽き目 */}
          <div className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/60 shadow-sm">
                <Bean className="h-5 w-5 text-amber-800" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-xs font-bold tracking-wider text-amber-800/80 uppercase">
                  豆・挽き目
                </div>
                <div className="truncate font-medium text-amber-950">
                  {`${recipe.roastLevel} • ${recipe.grindSize} • ${recipe.beanWeight}g`}
                </div>
              </div>
            </div>
          </div>

          {/* 湯温・湯量 */}
          <div className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/60 shadow-sm">
                <ThermometerSun className="h-5 w-5 text-orange-800" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-xs font-bold tracking-wider text-orange-800/80 uppercase">
                  湯温・湯量
                </div>
                <div className="font-medium text-amber-950">
                  {`${recipe.waterTemp}℃ • ${recipe.waterAmount}g`}
                </div>
              </div>
            </div>
          </div>

          {/* 器具 - 3行分の高さを確保 */}
          <div className="group/item relative h-[120px] overflow-hidden rounded-xl bg-gradient-to-r from-yellow-100 to-amber-100 p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-full gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/60 shadow-sm">
                <Settings className="h-5 w-5 text-yellow-800" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="mb-1.5 text-xs font-bold tracking-wider text-yellow-800/80 uppercase">
                  器具
                </div>
                {/* 器具を縦に並べて表示 - 上下中央配置 */}
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex flex-col gap-1">
                    {recipe.equipment.length > 0 ? (
                      recipe.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="inline-block w-fit rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-amber-900 shadow-sm"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-amber-700/60">なし</span>
                    )}
                  </div>
                  {/* 3個の器具がある場合の下部パディング */}
                  {recipe.equipment.length === 3 && <div className="h-1" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* ホバー時のオーバーレイ効果 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  );
});

export default RecipeCard;
