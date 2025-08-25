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

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="border-border bg-muted hover:bg-muted/80 group rounded-lg border p-4 transition-colors"
            >
              <div className="flex flex-col gap-3">
                {/* 器具ヘッダー */}
                <div className="flex items-start gap-3">
                  <div className="border-border bg-card flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
                    <Package className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-card-foreground text-sm font-semibold">{item.name}</div>
                    {item.brand && (
                      <div className="text-muted-foreground text-xs">{item.brand}</div>
                    )}
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
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* 器具タイプ */}
                <div className="bg-primary/10 text-primary inline-flex w-fit items-center rounded-md px-2 py-1 text-xs font-medium">
                  {item.equipmentType.name}
                </div>

                {/* 器具説明 */}
                {item.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
