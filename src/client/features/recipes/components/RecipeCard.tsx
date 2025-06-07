import { Bean, Droplet, Settings, ChefHat } from 'lucide-react';

import { Recipe } from '@/client/features/recipes/types/recipe';
import { Badge } from '@/client/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/ui/card';

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden border-amber-100 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10" />
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
                <ChefHat className="h-6 w-6" />
              </div>
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="flex-1 space-y-4">
        {/* レシピ情報 */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 p-2">
            <Bean className="h-4 w-4 flex-shrink-0 text-amber-700" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-amber-700">豆・挽き目</div>
              <div className="truncate text-sm text-gray-800">
                {`${recipe.roastLevel}・${recipe.grindSize}・${recipe.beanWeight}g`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-2">
            <Droplet className="h-4 w-4 flex-shrink-0 text-blue-700" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-blue-700">湯温・湯量</div>
              <div className="truncate text-sm text-gray-800">
                {`${recipe.waterTemp}℃・${recipe.waterAmount}g`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 p-2">
            <Settings className="h-4 w-4 flex-shrink-0 text-green-700" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-green-700">器具</div>
              <div className="truncate text-sm text-gray-800">{recipe.equipment.join('・')}</div>
            </div>
          </div>
        </div>

        {/* タグとメタ情報 */}
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-2">
          <Badge
            variant="secondary"
            className="border-amber-200 bg-amber-100 text-xs text-amber-800"
          >
            {recipe.roastLevel}
          </Badge>
          {recipe.grindSize && (
            <Badge variant="outline" className="border-gray-300 text-xs text-gray-700">
              {recipe.grindSize}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
