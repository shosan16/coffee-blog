import { Users, ExternalLink } from 'lucide-react';

import type { BaristaInfo } from '../../types/recipe-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type BaristaCardProps = Readonly<{
  /** バリスタ情報 */
  barista: BaristaInfo;
}>;

/**
 * バリスタ情報表示カード
 *
 * レシピを考案したバリスタの情報と
 * SNSリンクを表示する。
 */
export default function BaristaCard({ barista }: BaristaCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* コーヒーの染みのような装飾 */}
      <div className="bg-muted/20 absolute -top-4 -right-4 h-24 w-24 rounded-full blur-2xl" />

      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="border-border bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
            <Users className="text-primary h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-card-foreground text-lg font-bold">バリスタ</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* バリスタ名 */}
        <div className="space-y-1">
          <div className="text-card-foreground text-xl font-semibold">{barista.name}</div>
          {barista.affiliation && (
            <div className="text-muted-foreground text-sm">{barista.affiliation}</div>
          )}
        </div>

        {/* SNSリンク */}
        {barista.socialLinks.length > 0 && (
          <div className="space-y-3" data-testid="sns-section">
            <div className="text-muted-foreground text-sm font-medium">SNS</div>
            <div className="space-y-2">
              {barista.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-muted hover:bg-muted/80 group flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-card-foreground text-sm font-medium">{link.platform}</div>
                  </div>
                  <ExternalLink className="text-muted-foreground group-hover:text-card-foreground h-4 w-4 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
