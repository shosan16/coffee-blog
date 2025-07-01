import { Bean, Droplet, Clock, Eye } from 'lucide-react';

import type { RecipeDetailInfo } from '../../types/recipe-detail';
import { Card, CardContent } from '@/client/shared/shadcn/card';
import { getRoastLevelLabel, getGrindSizeLabel } from '@/client/shared/constants/filters';
import { useTimeFormat } from '../../hooks/useTimeFormat';
import { useNumberFormat } from '../../hooks/useNumberFormat';

type RecipeInfoCardsProps = Readonly<{
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
}>;

/**
 * レシピ基本情報カード群
 *
 * 豆情報、湯温・湯量、抽出時間、ビュー数を
 * カード形式で表示する。
 */
export default function RecipeInfoCards({ recipe }: RecipeInfoCardsProps) {
  const { splitMinutesAndSeconds } = useTimeFormat();
  const { formatWeight, formatTemperature, formatViewCount } = useNumberFormat();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* 豆情報 */}
      <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="border-border bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
              <Bean className="text-primary h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="text-card-foreground text-lg font-semibold">豆情報</div>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 湯温・湯量 */}
      <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="border-border bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
              <Droplet className="text-primary h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="text-card-foreground text-lg font-semibold">湯温・湯量</div>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 抽出時間 */}
      {recipe.brewingTime && (
        <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="border-border bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="text-card-foreground text-lg font-semibold">抽出時間</div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">総時間</span>
                  <span className="text-card-foreground text-sm font-medium">
                    {(() => {
                      const { minutes, seconds } = splitMinutesAndSeconds(recipe.brewingTime);
                      return `${minutes}分${seconds}秒`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ビュー数 */}
      <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="border-border bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
              <Eye className="text-primary h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="text-card-foreground text-lg font-semibold">ビュー数</div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">閲覧回数</span>
                <span className="text-card-foreground text-sm font-medium">
                  {formatViewCount(recipe.viewCount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
