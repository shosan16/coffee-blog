'use client';

import { RoastLevel, GrindSize } from '@prisma/client';
import React, { useMemo, useCallback } from 'react';

import Label from '@/client/shared/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/shared/shadcn/select';

import RangeSlider from './RangeSlider';

const ROAST_LEVELS = [
  { value: 'LIGHT', label: 'ライト' },
  { value: 'LIGHT_MEDIUM', label: 'ライトミディアム' },
  { value: 'MEDIUM', label: 'ミディアム' },
  { value: 'MEDIUM_DARK', label: 'ミディアムダーク' },
  { value: 'DARK', label: 'ダーク' },
  { value: 'FRENCH', label: 'フレンチ' },
] as const;

const GRIND_SIZES = [
  { value: 'EXTRA_FINE', label: 'エクストラファイン' },
  { value: 'FINE', label: 'ファイン' },
  { value: 'MEDIUM_FINE', label: 'ミディアムファイン' },
  { value: 'MEDIUM', label: 'ミディアム' },
  { value: 'MEDIUM_COARSE', label: 'ミディアムコース' },
  { value: 'COARSE', label: 'コース' },
  { value: 'EXTRA_COARSE', label: 'エクストラコース' },
] as const;

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

const ConditionFilter = React.memo(function ConditionFilter({
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
}: ConditionFilterProps) {
  const roastLevelTags = useMemo(() => {
    return roastLevels.map((level) => {
      const levelLabel = ROAST_LEVELS.find((l) => l.value === level)?.label;
      return (
        <span key={level} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
          {levelLabel}
        </span>
      );
    });
  }, [roastLevels]);

  const grindSizeTags = useMemo(() => {
    return grindSizes.map((size) => {
      const sizeLabel = GRIND_SIZES.find((s) => s.value === size)?.label;
      return (
        <span key={size} className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          {sizeLabel}
        </span>
      );
    });
  }, [grindSizes]);

  const handleRoastLevelSelect = useCallback(
    (value: string) => {
      const roastLevel = value as RoastLevel;
      if (roastLevels.includes(roastLevel)) {
        onRoastLevelChange(roastLevels.filter((level) => level !== roastLevel));
      } else {
        onRoastLevelChange([...roastLevels, roastLevel]);
      }
    },
    [roastLevels, onRoastLevelChange]
  );

  const handleGrindSizeSelect = useCallback(
    (value: string) => {
      const grindSize = value as GrindSize;
      if (grindSizes.includes(grindSize)) {
        onGrindSizeChange(grindSizes.filter((size) => size !== grindSize));
      } else {
        onGrindSizeChange([...grindSizes, grindSize]);
      }
    },
    [grindSizes, onGrindSizeChange]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <Label className="mb-3 block text-sm font-medium text-gray-700">抽出条件</Label>

        {/* 焙煎度 */}
        <div className="space-y-3">
          <Label className="text-xs text-gray-500">焙煎度</Label>
          <Select onValueChange={handleRoastLevelSelect}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  roastLevels.length > 0 ? `${roastLevels.length}個選択中` : '焙煎度を選択'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {ROAST_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex w-full items-center justify-between">
                    <span>{level.label}</span>
                    {roastLevels.includes(level.value as RoastLevel) && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {roastLevels.length > 0 && <div className="flex flex-wrap gap-1">{roastLevelTags}</div>}
        </div>

        {/* 挽き目 */}
        <div className="space-y-3">
          <Label className="text-xs text-gray-500">挽き目</Label>
          <Select onValueChange={handleGrindSizeSelect}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  grindSizes.length > 0 ? `${grindSizes.length}個選択中` : '挽き目を選択'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {GRIND_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  <div className="flex w-full items-center justify-between">
                    <span>{size.label}</span>
                    {grindSizes.includes(size.value as GrindSize) && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {grindSizes.length > 0 && <div className="flex flex-wrap gap-1">{grindSizeTags}</div>}
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
});

export default ConditionFilter;
