'use client';

import React, { useCallback, useMemo } from 'react';

import { Combobox, type ComboboxOption } from '@/client/shared/components/combobox';
import { useEquipment } from '@/client/shared/hooks/useEquipment';
import Label from '@/client/shared/shadcn/label';
import { formatEquipmentName } from '@/client/shared/utils/equipmentApi';

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

function EquipmentFilter({
  selectedEquipment,
  onChange,
  className = '',
}: EquipmentFilterProps): React.JSX.Element {
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
        <Label className="text-foreground text-sm font-medium">抽出器具</Label>
        <div className="text-muted-foreground text-sm">器具データを読み込み中...</div>
      </div>
    );
  }

  // エラー状態の表示
  if (equipmentError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Label className="text-foreground text-sm font-medium">抽出器具</Label>
        <div className="text-destructive text-sm">
          器具データの読み込みに失敗しました: {equipmentError}
        </div>
      </div>
    );
  }

  // データが利用できない場合
  if (!equipmentData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Label className="text-foreground text-sm font-medium">抽出器具</Label>
        <div className="text-muted-foreground text-sm">器具データが利用できません</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Label className="text-foreground text-sm font-medium">抽出器具</Label>

      {EQUIPMENT_TYPES.map((equipmentType) => {
        const selectedValue = equipmentSelection[equipmentType.id as keyof EquipmentSelection];
        const options = getEquipmentOptions(equipmentType.id as keyof EquipmentSelection);

        return (
          <div key={equipmentType.id} className="space-y-2">
            <Label className="text-muted-foreground text-xs">{equipmentType.label}</Label>

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
    </div>
  );
}

export default React.memo(EquipmentFilter);
