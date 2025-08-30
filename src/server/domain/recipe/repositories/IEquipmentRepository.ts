import type { Equipment } from '../entities/equipment/Equipment.entity';

/**
 * 器具リポジトリインターフェース
 *
 * 器具データの永続化と取得を抽象化
 */
export type IEquipmentRepository = {
  /**
   * 器具IDリストから器具エンティティを取得
   *
   * @param ids - 器具IDリスト
   * @returns 器具エンティティリスト
   */
  findByIds(ids: readonly string[]): Promise<Equipment[]>;

  /**
   * 器具IDから器具エンティティを取得
   *
   * @param id - 器具ID
   * @returns 器具エンティティ（見つからない場合はundefined）
   */
  findById(id: string): Promise<Equipment | undefined>;

  /**
   * すべての利用可能な器具を取得
   *
   * @returns 利用可能な器具エンティティリスト
   */
  findAllAvailable(): Promise<Equipment[]>;

  /**
   * 器具タイプ別に器具を取得
   *
   * @param equipmentType - 器具タイプ
   * @returns 指定タイプの器具エンティティリスト
   */
  findByType(equipmentType: string): Promise<Equipment[]>;
};
