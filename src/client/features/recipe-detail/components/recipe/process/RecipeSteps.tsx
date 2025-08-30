import { Clock, CheckCircle } from 'lucide-react';

import { useTimeFormat } from '@/client/features/recipe-detail/hooks/useTimeFormat';
import type { RecipeStepInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type RecipeStepsProps = {
  /** レシピ手順リスト */
  steps: RecipeStepInfo[];
  /** 総抽出時間（秒） */
  brewingTime?: number;
};

/**
 * レシピ手順表示コンポーネント
 *
 * タイムライン形式でレシピの手順を表示する。
 * 累積時間も表示して、タイミングを分かりやすくする。
 */
export default function RecipeSteps({ steps, brewingTime }: RecipeStepsProps) {
  const { formatSeconds, splitMinutesAndSeconds } = useTimeFormat();
  if (steps.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <CheckCircle className="text-primary h-6 w-6" />
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
        <CardTitle className="text-card-foreground flex items-center gap-3">
          <CheckCircle className="text-primary h-6 w-6" />
          抽出手順
        </CardTitle>
        {brewingTime && (
          <div className="flex items-center gap-2 pt-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              総抽出時間:{' '}
              {(() => {
                const { minutes, seconds } = splitMinutesAndSeconds(brewingTime);
                return `${minutes}分${seconds}秒`;
              })()}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative">
          {/* タイムライン線 */}
          <div className="border-border bg-border absolute top-0 bottom-0 left-6 w-px" />

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex gap-4">
                {/* ステップ番号 */}
                <div className="border-border bg-primary text-primary-foreground relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-semibold">
                  <span className="text-xs">Step {step.stepOrder}</span>
                </div>

                {/* ステップ内容 */}
                <div className="min-w-0 flex-1 space-y-2">
                  {/* 時間表示 */}
                  {step.timeSeconds !== undefined && step.timeSeconds > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm font-medium">
                        {formatSeconds(step.timeSeconds)}
                        {index === 0}
                        {index > 0}
                      </span>
                    </div>
                  )}

                  {/* 手順説明 */}
                  <div className="border-border bg-muted rounded-lg border p-4">
                    <p className="text-card-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 完了ステップ */}
        <div className="relative flex gap-4">
          <div className="border-border relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border bg-green-500 text-white">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                完成！美味しいコーヒーをお楽しみください ☕
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
