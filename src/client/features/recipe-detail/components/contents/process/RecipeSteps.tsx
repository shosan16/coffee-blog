import { Clock, List } from 'lucide-react';
import { useMemo } from 'react';

import { useTimeFormat } from '@/client/features/recipe-detail/hooks/useTimeFormat';
import type { RecipeStepInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type RecipeStepsProps = {
  /** レシピ手順リスト */
  steps: RecipeStepInfo[];
};

/**
 * レシピ手順表示コンポーネント
 *
 * ユーザーがコーヒー抽出の各工程を時系列で把握できるよう、
 * タイムライン形式で手順を視覚化する。
 * 累積時間表示により「いつ何をすべきか」が直感的に理解できる。
 */
export default function RecipeSteps({ steps }: RecipeStepsProps) {
  const { formatSeconds, formatTimeRangeWithDuration } = useTimeFormat();

  const stepsWithCumulativeTime = useMemo(() => {
    let cumulativeTime = 0;
    return steps.map((step) => {
      const startSeconds = cumulativeTime;
      const endSeconds = cumulativeTime + (step.timeSeconds ?? 0);
      cumulativeTime = endSeconds;
      return { ...step, startSeconds, endSeconds };
    });
  }, [steps]);

  const totalBrewingTime = useMemo(() => {
    if (stepsWithCumulativeTime.length === 0) return 0;
    const lastStep = stepsWithCumulativeTime[stepsWithCumulativeTime.length - 1];
    return lastStep.endSeconds;
  }, [stepsWithCumulativeTime]);

  if (steps.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <List className="text-primary h-6 w-6" />
            抽出手順
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">手順が登録されていません</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <List className="text-primary h-6 w-6" />
            抽出手順
          </CardTitle>
          {totalBrewingTime > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-800" />
              <span className="text-sm font-medium text-gray-800">
                総抽出時間 {formatSeconds(totalBrewingTime)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative">
          <div className="space-y-5">
            {stepsWithCumulativeTime.map((step, index) => {
              const isLastStep = index === stepsWithCumulativeTime.length - 1;
              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* タイムライン線 - 最後のステップ以外に表示 */}
                  {!isLastStep && (
                    <div className="bg-border absolute top-8 -bottom-5 left-4 w-px" />
                  )}
                  <div className="bg-accent text-accent-foreground relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {step.stepOrder}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    {step.timeSeconds !== undefined && step.timeSeconds > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-800" />
                        <span className="text-sm font-medium text-gray-800">
                          {formatTimeRangeWithDuration(step.startSeconds, step.endSeconds)}
                        </span>
                      </div>
                    )}

                    <div className="border-border bg-muted rounded-lg border p-3.5 md:p-4">
                      <p className="text-card-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
