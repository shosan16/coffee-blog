import { Sliders } from 'lucide-react';

import { useNumberFormat } from '@/client/features/recipe-detail/hooks/useNumberFormat';
import type { RecipeDetailInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/coffee-beans';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type BrewingParameterCardsProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * 抽出パラメータカード
 *
 * レシピの抽出条件を単一カードで表示する。
 * メインパラメータ(豆の量、湯量、湯温)を大きく目立つ形で表示し、
 * 詳細情報(焙煎度、挽き目)を下部に配置する。
 *
 * @param recipe - レシピ詳細情報
 */
export default function BrewingParameterCards({ recipe }: BrewingParameterCardsProps) {
  const { formatWeight, formatTemperature } = useNumberFormat();

  return (
    <Card className="border-border bg-card shadow-sm">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-3">
          <Sliders className="text-primary h-6 w-6" />
          抽出条件
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* メインパラメータ: 3カラムグリッド */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* 豆の量 */}
          {recipe.beanWeight ? (
            <div className="border-border rounded-lg border bg-gray-50 p-3.5 text-center md:p-5">
              <div className="font-serif text-3xl leading-none text-gray-800 md:text-4xl">
                {formatWeight(recipe.beanWeight, false)}
                <span className="ml-0.5 text-sm md:text-base">g</span>
              </div>
              <div className="text-muted-foreground mt-1.5 text-xs">豆の量</div>
            </div>
          ) : (
            <div /> // 空のプレースホルダー
          )}

          {/* 湯量 */}
          {recipe.waterAmount ? (
            <div className="border-border rounded-lg border bg-gray-50 p-3.5 text-center md:p-5">
              <div className="font-serif text-3xl leading-none text-gray-800 md:text-4xl">
                {formatWeight(recipe.waterAmount, false)}
                <span className="ml-0.5 text-sm md:text-base">g</span>
              </div>
              <div className="text-muted-foreground mt-1.5 text-xs">湯量</div>
            </div>
          ) : (
            <div />
          )}

          {/* 湯温 */}
          {recipe.waterTemp ? (
            <div className="border-border rounded-lg border bg-gray-50 p-3.5 text-center md:p-5">
              <div className="font-serif text-3xl leading-none text-gray-800 md:text-4xl">
                {formatTemperature(recipe.waterTemp, false)}
                <span className="ml-0.5 text-sm md:text-base">℃</span>
              </div>
              <div className="text-muted-foreground mt-1.5 text-xs">湯温</div>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* 詳細セクション */}
        <div className="border-border flex flex-wrap gap-4 border-t pt-4 md:gap-6 md:pt-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">焙煎度</span>
            <span className="text-card-foreground font-medium">
              {getRoastLevelLabel(recipe.roastLevel)}
            </span>
          </div>

          {recipe.grindSize && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">挽き目</span>
              <span className="text-card-foreground font-medium">
                {getGrindSizeLabel(recipe.grindSize)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
