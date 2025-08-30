import type { PrismaClient } from '@prisma/client';

import { Equipment } from '../../domain/recipe/entities/equipment/Equipment.entity';
import type { IEquipmentRepository } from '../../domain/recipe/repositories/IEquipmentRepository';

/**
 * Prismaベース器具リポジトリ
 *
 * Prismaを使用した器具データの永続化実装
 * 現在のスキーマに合わせて Equipment テーブルから器具情報を取得
 */
export class PrismaEquipmentRepository implements IEquipmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 器具IDリストから器具エンティティを取得
   */
  async findByIds(ids: readonly string[]): Promise<Equipment[]> {
    if (ids.length === 0) {
      return [];
    }

    // 文字列IDをBigIntに変換
    const bigIntIds = ids.map((id) => BigInt(id));

    const equipmentRecords = await this.prisma.equipment.findMany({
      where: {
        id: {
          in: bigIntIds,
        },
      },
      include: {
        equipmentType: true,
      },
    });

    return equipmentRecords.map((record) =>
      Equipment.reconstruct({
        id: record.id.toString(),
        name: record.name,
        brand: record.brand ?? undefined,
        description: record.description ?? undefined,
        affiliateLink: record.affiliateLink ?? undefined,
        equipmentType: {
          id: record.equipmentType.id.toString(),
          name: record.equipmentType.name,
          description: record.equipmentType.description ?? undefined,
        },
        isAvailable: true, // 現在のスキーマにはisAvailableフィールドがないため固定値
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })
    );
  }

  /**
   * 器具IDから器具エンティティを取得
   */
  async findById(id: string): Promise<Equipment | undefined> {
    const record = await this.prisma.equipment.findUnique({
      where: { id: BigInt(id) },
      include: {
        equipmentType: true,
      },
    });

    if (!record) {
      return undefined;
    }

    return Equipment.reconstruct({
      id: record.id.toString(),
      name: record.name,
      brand: record.brand ?? undefined,
      description: record.description ?? undefined,
      affiliateLink: record.affiliateLink ?? undefined,
      equipmentType: {
        id: record.equipmentType.id.toString(),
        name: record.equipmentType.name,
        description: record.equipmentType.description ?? undefined,
      },
      isAvailable: true,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  /**
   * すべての利用可能な器具を取得
   */
  async findAllAvailable(): Promise<Equipment[]> {
    const equipmentRecords = await this.prisma.equipment.findMany({
      include: {
        equipmentType: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return equipmentRecords.map((record) =>
      Equipment.reconstruct({
        id: record.id.toString(),
        name: record.name,
        brand: record.brand ?? undefined,
        description: record.description ?? undefined,
        affiliateLink: record.affiliateLink ?? undefined,
        equipmentType: {
          id: record.equipmentType.id.toString(),
          name: record.equipmentType.name,
          description: record.equipmentType.description ?? undefined,
        },
        isAvailable: true,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })
    );
  }

  /**
   * 器具タイプ別に器具を取得
   */
  async findByType(equipmentType: string): Promise<Equipment[]> {
    const equipmentRecords = await this.prisma.equipment.findMany({
      where: {
        equipmentType: {
          name: equipmentType,
        },
      },
      include: {
        equipmentType: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return equipmentRecords.map((record) =>
      Equipment.reconstruct({
        id: record.id.toString(),
        name: record.name,
        brand: record.brand ?? undefined,
        description: record.description ?? undefined,
        affiliateLink: record.affiliateLink ?? undefined,
        equipmentType: {
          id: record.equipmentType.id.toString(),
          name: record.equipmentType.name,
          description: record.equipmentType.description ?? undefined,
        },
        isAvailable: true,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })
    );
  }
}
