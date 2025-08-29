import { Lightbulb } from 'lucide-react';
import { memo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card'; // cspell:ignore shadcn

export type PreparationPointsCardProps = {
  /** 準備ポイント・注意事項のテキスト */
  remarks?: string;
};

/**
 * 準備ポイントカードコンポーネント
 *
 * レシピの備考から準備ポイント・注意事項をカード形式で表示する。
 * 豆情報セクションと抽出手順セクションの間に配置される。
 */
export default memo(function PreparationPointsCard({ remarks }: PreparationPointsCardProps) {
  // 備考がない場合は何も表示しない
  if (!remarks) {
    return null;
  }

  // 改行で区切ってリスト化
  const points = remarks
    .split('\n')
    .map((point) => point.trim())
    .filter((point) => point.length > 0);

  return (
    <Card
      className="border-amber-200 bg-amber-50 shadow-sm"
      role="region"
      aria-labelledby="preparation-points-title"
    >
      <CardHeader className="pb-3">
        <CardTitle id="preparation-points-title" className="flex items-center gap-2 text-amber-800">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
          ポイント
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm leading-relaxed text-amber-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});
