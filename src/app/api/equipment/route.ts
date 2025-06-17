import { NextResponse } from 'next/server';

import { prisma } from '@/server/shared/database/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5分キャッシュ

type EquipmentItem = {
  id: string;
  name: string;
  brand?: string;
  type: string;
};

type EquipmentByType = {
  grinder: EquipmentItem[];
  dripper: EquipmentItem[];
  filter: EquipmentItem[];
};

type EquipmentResponse = {
  equipment: EquipmentByType;
};

export async function GET(): Promise<NextResponse<EquipmentResponse | { error: string }>> {
  try {
    // 器具タイプとその器具を取得
    const equipmentTypes = await prisma.equipmentType.findMany({
      where: {
        id: {
          in: [1n, 2n, 3n], // 1:ドリッパー, 2:コーヒーミル, 3:ペーパーフィルター
        },
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            brand: true,
          },
          distinct: ['name', 'brand'], // 同じ器具の重複を避ける
        },
      },
    });

    // レスポンス形式に変換
    const equipment: EquipmentByType = {
      grinder: [],
      dripper: [],
      filter: [],
    };

    equipmentTypes.forEach((type) => {
      const equipmentItems = type.equipment.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        brand: item.brand ?? undefined,
        type: type.name,
      }));

      switch (type.id) {
        case 1n: // ドリッパー
          equipment.dripper = equipmentItems;
          break;
        case 2n: // コーヒーミル
          equipment.grinder = equipmentItems;
          break;
        case 3n: // ペーパーフィルター
          equipment.filter = equipmentItems;
          break;
      }
    });

    return NextResponse.json({ equipment });
  } catch {
    return NextResponse.json({ error: '器具データの取得に失敗しました' }, { status: 500 });
  }
}
