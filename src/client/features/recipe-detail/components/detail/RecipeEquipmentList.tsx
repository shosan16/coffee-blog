import { Settings, ExternalLink, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

import type { DetailedEquipmentInfo } from '../../types/recipe-detail';

type RecipeEquipmentListProps = {
  /** 器具詳細リスト */
  equipment: DetailedEquipmentInfo[];
};

/**
 * レシピ器具一覧表示コンポーネント
 *
 * 使用器具の詳細情報とアフィリエイトリンクを表示する。
 * 器具タイプごとにグループ化して見やすく表示。
 */
export default function RecipeEquipmentList({ equipment }: RecipeEquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-3">
            <Settings className="text-primary h-6 w-6" />
            使用器具
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">器具情報が登録されていません</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-3">
          <Settings className="text-primary h-6 w-6" />
          使用器具
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {equipment.map((item) => (
          <div
            key={item.id}
            className="border-border bg-muted hover:bg-muted/80 group rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* 器具アイコン */}
              <div className="border-border bg-card flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
                <Package className="text-primary h-5 w-5" />
              </div>

              {/* 器具情報 */}
              <div className="min-w-0 flex-1 space-y-2">
                {/* 器具名とブランド */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-card-foreground text-base font-semibold">{item.name}</div>
                    {item.brand && (
                      <div className="text-muted-foreground text-sm">{item.brand}</div>
                    )}
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                      {item.equipmentType.name}
                    </div>
                  </div>

                  {/* アフィリエイトリンク */}
                  {item.affiliateLink && (
                    <a
                      href={item.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                      title="購入リンク"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-xs">購入</span>
                    </a>
                  )}
                </div>

                {/* 器具説明 */}
                {item.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* 器具タイプ説明 */}
                {item.equipmentType.description && (
                  <p className="text-muted-foreground text-xs italic">
                    {item.equipmentType.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
