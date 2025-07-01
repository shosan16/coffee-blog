import { useEffect, useState } from 'react';

import { fetchEquipmentByType, type EquipmentByType } from '@/client/shared/utils/equipmentApi';

export type UseEquipmentReturn = {
  equipment: EquipmentByType | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * 器具データを取得するカスタムフック
 */
export function useEquipment(): UseEquipmentReturn {
  const [equipment, setEquipment] = useState<EquipmentByType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEquipment = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const equipmentData = await fetchEquipmentByType();

        if (isMounted) {
          setEquipment(equipmentData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : '器具データの取得に失敗しました');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEquipment();

    return (): void => {
      isMounted = false;
    };
  }, []);

  return {
    equipment,
    isLoading,
    error,
  };
}
