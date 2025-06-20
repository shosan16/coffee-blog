'use client';

import React, { useCallback, useMemo } from 'react';

import { useEquipment } from '@/client/features/recipes/hooks/useEquipment';
import { formatEquipmentName } from '@/client/features/recipes/utils/equipmentApi';
import Label from '@/client/shared/shadcn/label';

import { Combobox, type ComboboxOption } from '@/client/shared/components/combobox';

// 表示対象の3種類のみ
const EQUIPMENT_TYPES = [
  { id: 'grinder', label: 'コーヒーミル' },
  { id: 'dripper', label: 'ドリッパー' },
  { id: 'filter', label: 'ペーパーフィルター' },
] as const;

type EquipmentSelection = {
  grinder?: string;
  dripper?: string;
  filter?: string;
};

type EquipmentFilterProps = {
  selectedEquipment: string[];
  onChange: (equipment: string[]) => void;
  className?: string;
};

const EquipmentFilter = React.memo(function EquipmentFilter({
  selectedEquipment,
  onChange,
  className = '',
}: EquipmentFilterProps) {
  // 器具データを取得
  const {
    equipment: equipmentData,
    isLoading: equipmentLoading,
    error: equipmentError,
  } = useEquipment();

  // 現在の選択状態を器具タイプ別に分離
  const equipmentSelection = useMemo((): EquipmentSelection => {
    const selection: EquipmentSelection = {};

    if (!equipmentData) return selection;

    selectedEquipment.forEach((equipmentName) => {
      // 各器具タイプのオプションをチェックして、どのタイプに属するかを判定
      const grinderItem = equipmentData.grinder.find((item) => item.name === equipmentName);
      const dripperItem = equipmentData.dripper.find((item) => item.name === equipmentName);
      const filterItem = equipmentData.filter.find((item) => item.name === equipmentName);

      if (grinderItem) {
        selection.grinder = equipmentName;
      } else if (dripperItem) {
        selection.dripper = equipmentName;
      } else if (filterItem) {
        selection.filter = equipmentName;
      }
    });

    return selection;
  }, [selectedEquipment, equipmentData]);

  // 器具タイプ別のオプションを取得
  const getEquipmentOptions = useCallback(
    (equipmentType: keyof EquipmentSelection): ComboboxOption[] => {
      if (!equipmentData) return [];

      return equipmentData[equipmentType].map((item) => ({
        value: item.name,
        label: formatEquipmentName(item),
      }));
    },
    [equipmentData]
  );

  const handleEquipmentSelect = useCallback(
    (equipmentType: keyof EquipmentSelection, value: string) => {
      const newSelection = { ...equipmentSelection };

      if (value === '') {
        // 選択解除
        delete newSelection[equipmentType];
      } else {
        newSelection[equipmentType] = value;
      }

      // オブジェクトから配列に変換（空の値は除外）
      const newEquipmentArray = Object.values(newSelection).filter(Boolean) as string[];
      onChange(newEquipmentArray);
    },
    [equipmentSelection, onChange]
  );

  // ローディング状態の表示
  if (equipmentLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">抽出器具</Label>
        <div className="text-sm text-gray-500">器具データを読み込み中...</div>
      </div>
    );
  }

  // エラー状態の表示
  if (equipmentError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">抽出器具</Label>
        <div className="text-sm text-red-500">
          器具データの読み込みに失敗しました: {equipmentError}
        </div>
      </div>
    );
  }

  // データが利用できない場合
  if (!equipmentData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">抽出器具</Label>
        <div className="text-sm text-gray-500">器具データが利用できません</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">抽出器具</Label>

      {EQUIPMENT_TYPES.map((equipmentType) => {
        const selectedValue = equipmentSelection[equipmentType.id as keyof EquipmentSelection];
        const options = getEquipmentOptions(equipmentType.id as keyof EquipmentSelection);

        return (
          <div key={equipmentType.id} className="space-y-2">
            <Label className="text-xs text-gray-500">{equipmentType.label}</Label>

            <Combobox
              options={options}
              value={selectedValue ?? ''}
              onValueChange={(value) =>
                handleEquipmentSelect(equipmentType.id as keyof EquipmentSelection, value)
              }
              placeholder={`${equipmentType.label}を選択`}
              searchPlaceholder={`${equipmentType.label}を検索...`}
              emptyMessage="該当する器具が見つかりません"
              clearable={true}
              loading={equipmentLoading}
              className="w-full"
            />
          </div>
        );
      })}

      {selectedEquipment.length > 0 && (
        <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
          {selectedEquipment.length}個の器具が選択されています
        </div>
      )}
    </div>
  );
});

export default EquipmentFilter;
