import type { Equipment } from '../../domain/recipe/entities/equipment/Equipment.entity';
import type { IEquipmentRepository } from '../../domain/recipe/repositories/IEquipmentRepository';

/**
 * メモリベース器具リポジトリ
 *
 * テスト用および開発用のメモリストレージ実装
 */
export class MemoryEquipmentRepository implements IEquipmentRepository {
  private equipment: Equipment[] = [];

  constructor(initialData: Equipment[] = []) {
    this.equipment = [...initialData];
  }

  /**
   * 器具IDリストから器具エンティティを取得
   */
  async findByIds(ids: readonly string[]): Promise<Equipment[]> {
    return this.equipment.filter((item) => ids.includes(item.id));
  }

  /**
   * 器具IDから器具エンティティを取得
   */
  async findById(id: string): Promise<Equipment | undefined> {
    return this.equipment.find((item) => item.id === id);
  }

  /**
   * すべての利用可能な器具を取得
   */
  async findAllAvailable(): Promise<Equipment[]> {
    return this.equipment.filter((item) => item.isAvailable);
  }

  /**
   * 器具タイプ別に器具を取得
   */
  async findByType(equipmentType: string): Promise<Equipment[]> {
    return this.equipment.filter(
      (item) => item.equipmentType.id === equipmentType && item.isAvailable
    );
  }

  /**
   * 器具を追加（テスト用）
   */
  add(equipment: Equipment): void {
    this.equipment.push(equipment);
  }

  /**
   * すべての器具をクリア（テスト用）
   */
  clear(): void {
    this.equipment = [];
  }

  /**
   * 器具データを設定（テスト用）
   */
  setData(equipment: Equipment[]): void {
    this.equipment = [...equipment];
  }
}
