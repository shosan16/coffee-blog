import { Settings } from 'lucide-react';

import type { DetailedEquipmentInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

import EquipmentItem from './EquipmentItem';

type RecipeEquipmentListProps = {
  /** 器具詳細リスト */
  equipment: DetailedEquipmentInfo[];
};

/**
 * レシピ器具一覧表示コンポーネント
 *
 * 使用器具の詳細情報とアフィリエイトリンクを表示する。
 * レスポンシブ3カラムグリッドレイアウトで表示。
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <EquipmentItem key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
