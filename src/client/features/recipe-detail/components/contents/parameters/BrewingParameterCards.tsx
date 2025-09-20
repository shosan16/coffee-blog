import { Bean, Droplet } from 'lucide-react';

import { useNumberFormat } from '@/client/features/recipe-detail/hooks/useNumberFormat';
import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/coffee-beans';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type BrewingParameterCardsProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * 抽出パラメータカード群
 *
 * 豆情報と湯温・湯量を別々の
 * カード形式で表示する。
 */
export default function BrewingParameterCards({ recipe }: BrewingParameterCardsProps) {
  const { formatWeight, formatTemperature } = useNumberFormat();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* 豆情報 */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <Bean className="text-primary h-6 w-6" />
            豆情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">焙煎度</span>
              <span className="text-card-foreground text-sm font-medium">
                {getRoastLevelLabel(recipe.roastLevel)}
              </span>
            </div>
            {recipe.grindSize && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">挽き目</span>
                <span className="text-card-foreground text-sm font-medium">
                  {getGrindSizeLabel(recipe.grindSize)}
                </span>
              </div>
            )}
            {recipe.beanWeight && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">豆の量</span>
                <span className="text-card-foreground text-sm font-medium">
                  {formatWeight(recipe.beanWeight)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 湯温・湯量 */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <Droplet className="text-primary h-6 w-6" />
            湯温・湯量
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recipe.waterTemp && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">湯温</span>
                <span className="text-card-foreground text-sm font-medium">
                  {formatTemperature(recipe.waterTemp)}
                </span>
              </div>
            )}
            {recipe.waterAmount && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">湯量</span>
                <span className="text-card-foreground text-sm font-medium">
                  {formatWeight(recipe.waterAmount)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
