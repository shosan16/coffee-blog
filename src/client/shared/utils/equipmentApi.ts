import { apiRequest } from '@/client/shared/api/request';

export type EquipmentItem = {
  id: string;
  name: string;
  brand?: string;
  type: string;
};

export type EquipmentByType = {
  grinder: EquipmentItem[];
  dripper: EquipmentItem[];
  filter: EquipmentItem[];
};

export type EquipmentResponse = {
  equipment: EquipmentByType;
};

/**
 * 器具データをタイプ別に取得する
 */
export async function fetchEquipmentByType(): Promise<EquipmentByType> {
  const response = await apiRequest<EquipmentResponse>('/api/equipment');
  return response.equipment;
}

/**
 * 器具名を表示用にフォーマットする
 */
export function formatEquipmentName(equipment: EquipmentItem): string {
  if (equipment.brand) {
    return `${equipment.brand} ${equipment.name}`;
  }
  return equipment.name;
}
