import { NextResponse } from 'next/server';

import { ApiError, type ErrorResponse } from '@/server/shared/api-error';
import { prisma } from '@/server/shared/database/prisma';
import { createRequestLogger } from '@/server/shared/logger';
import { RequestId } from '@/server/shared/request-id';

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

export async function GET(
  request: Request
): Promise<NextResponse<EquipmentResponse | ErrorResponse>> {
  const requestId = RequestId.fromRequest(request);
  const logger = createRequestLogger(request.method, request.url);

  try {
    logger.info({ requestId }, 'Starting equipment data request processing');
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

    logger.info(
      {
        equipmentCount: {
          grinder: equipment.grinder.length,
          dripper: equipment.dripper.length,
          filter: equipment.filter.length,
        },
        requestId,
      },
      'Equipment data retrieval completed successfully'
    );

    return NextResponse.json(
      { equipment },
      {
        status: 200,
        headers: RequestId.addToHeaders({}, requestId),
      }
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        requestId,
      },
      'Error occurred during equipment data retrieval'
    );

    const errorResponse = ApiError.internal('器具データの取得に失敗しました', requestId);

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: RequestId.addToHeaders({}, requestId),
    });
  }
}
