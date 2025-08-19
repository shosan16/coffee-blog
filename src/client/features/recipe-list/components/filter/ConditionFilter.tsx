'use client';

import type { RoastLevel, GrindSize } from '@prisma/client';
import React, { useMemo, useCallback } from 'react';

import MultiCombobox from '@/client/shared/components/multi-combobox/MultiCombobox';
import type { MultiComboboxItem } from '@/client/shared/components/multi-combobox/types';
import { ROAST_LEVELS, GRIND_SIZES, type OptionItem } from '@/client/shared/constants/filters';
import Label from '@/client/shared/shadcn/label';

import RangeSlider from './RangeSlider';

type ConditionFilterProps = {
  roastLevels: RoastLevel[];
  grindSizes: GrindSize[];
  beanWeight: { min?: number; max?: number };
  waterTemp: { min?: number; max?: number };
  waterAmount: { min?: number; max?: number };
  onRoastLevelChange: (levels: RoastLevel[]) => void;
  onGrindSizeChange: (sizes: GrindSize[]) => void;
  onBeanWeightChange: (range: { min?: number; max?: number }) => void;
  onWaterTempChange: (range: { min?: number; max?: number }) => void;
  onWaterAmountChange: (range: { min?: number; max?: number }) => void;
  className?: string;
};

function ConditionFilter({
  roastLevels,
  grindSizes,
  beanWeight,
  waterTemp,
  waterAmount,
  onRoastLevelChange,
  onGrindSizeChange,
  onBeanWeightChange,
  onWaterTempChange,
  onWaterAmountChange,
  className = '',
}: ConditionFilterProps): React.JSX.Element {
  const convertToMultiComboboxItems = (items: OptionItem[]): MultiComboboxItem[] => {
    return items.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
      disabled: item.disabled,
    }));
  };

  // MultiCombobox用の定数を生成
  const roastLevelItems = useMemo(() => convertToMultiComboboxItems(ROAST_LEVELS), []);
  const grindSizeItems = useMemo(() => convertToMultiComboboxItems(GRIND_SIZES), []);

  // 選択されている焙煎度をMultiComboboxItem形式に変換
  const selectedRoastLevels = useMemo(() => {
    return roastLevels
      .map((level) => roastLevelItems.find((item) => item.value === level))
      .filter((item): item is MultiComboboxItem => item !== undefined);
  }, [roastLevels, roastLevelItems]);

  // 選択されている挽き目をMultiComboboxItem形式に変換
  const selectedGrindSizes = useMemo(() => {
    return grindSizes
      .map((size) => grindSizeItems.find((item) => item.value === size))
      .filter((item): item is MultiComboboxItem => item !== undefined);
  }, [grindSizes, grindSizeItems]);

  // 焙煎度トグルハンドラー（選択/削除を一つの関数で処理）
  const handleRoastLevelToggle = useCallback(
    (item: MultiComboboxItem) => {
      const roastLevel = item.value as RoastLevel;
      const isSelected = roastLevels.includes(roastLevel);
      const newLevels = isSelected
        ? roastLevels.filter((level) => level !== roastLevel)
        : [...roastLevels, roastLevel];
      onRoastLevelChange(newLevels);
    },
    [roastLevels, onRoastLevelChange]
  );

  // 挽き目トグルハンドラー（選択/削除を一つの関数で処理）
  const handleGrindSizeToggle = useCallback(
    (item: MultiComboboxItem) => {
      const grindSize = item.value as GrindSize;
      const isSelected = grindSizes.includes(grindSize);
      const newSizes = isSelected
        ? grindSizes.filter((size) => size !== grindSize)
        : [...grindSizes, grindSize];
      onGrindSizeChange(newSizes);
    },
    [grindSizes, onGrindSizeChange]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-6">
        <Label className="text-foreground block text-sm font-medium">抽出条件</Label>

        {/* 焙煎度 */}
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs">焙煎度</Label>
          <MultiCombobox
            items={roastLevelItems}
            selectedItems={selectedRoastLevels}
            onSelect={handleRoastLevelToggle}
            onDelete={handleRoastLevelToggle}
            placeholder="焙煎度を選択"
            dropdownHelpMessage="焙煎度を選択してください"
            autoFocus={false}
          />
        </div>

        {/* 挽き目 */}
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs">挽き目</Label>
          <MultiCombobox
            items={grindSizeItems}
            selectedItems={selectedGrindSizes}
            onSelect={handleGrindSizeToggle}
            onDelete={handleGrindSizeToggle}
            placeholder="挽き目を選択"
            dropdownHelpMessage="挽き目を選択してください"
            autoFocus={false}
          />
        </div>
      </div>

      {/* 範囲フィルター */}
      <div className="space-y-4">
        <RangeSlider
          label="粉量"
          min={5}
          max={50}
          step={0.5}
          unit="g"
          defaultMin={beanWeight.min}
          defaultMax={beanWeight.max}
          onChange={onBeanWeightChange}
        />

        <RangeSlider
          label="湯温"
          min={70}
          max={100}
          step={1}
          unit="℃"
          defaultMin={waterTemp.min}
          defaultMax={waterTemp.max}
          onChange={onWaterTempChange}
        />

        <RangeSlider
          label="総湯量"
          min={100}
          max={800}
          step={10}
          unit="ml"
          defaultMin={waterAmount.min}
          defaultMax={waterAmount.max}
          onChange={onWaterAmountChange}
        />
      </div>
    </div>
  );
}

export default React.memo(ConditionFilter);
