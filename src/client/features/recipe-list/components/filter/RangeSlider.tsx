'use client';

import React, { useCallback } from 'react';

import Input from '@/client/shared/shadcn/input';
import Label from '@/client/shared/shadcn/label';
import Slider from '@/client/shared/shadcn/slider';

type RangeSliderProps = {
  label: string;
  min?: number;
  max?: number;
  defaultMin?: number;
  defaultMax?: number;
  step?: number;
  unit?: string;
  onChange: (range: { min?: number; max?: number }) => void;
  className?: string;
};

const RangeSlider = React.memo(function RangeSlider({
  label,
  min = 0,
  max = 100,
  defaultMin,
  defaultMax,
  step = 1,
  unit = '',
  onChange,
  className = '',
}: RangeSliderProps) {
  const [minValue, setMinValue] = React.useState<number | undefined>(defaultMin);
  const [maxValue, setMaxValue] = React.useState<number | undefined>(defaultMax);

  const currentMin = minValue ?? min;
  const currentMax = maxValue ?? max;

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [newMin, newMax] = values;
      const actualMin = newMin === min ? undefined : newMin;
      const actualMax = newMax === max ? undefined : newMax;

      setMinValue(actualMin);
      setMaxValue(actualMax);
      onChange({ min: actualMin, max: actualMax });
    },
    [onChange, min, max]
  );

  const handleMinChange = useCallback(
    (value: string) => {
      const numValue = value === '' ? undefined : Number(value);
      setMinValue(numValue);
      onChange({ min: numValue, max: maxValue });
    },
    [onChange, maxValue]
  );

  const handleMaxChange = useCallback(
    (value: string) => {
      const numValue = value === '' ? undefined : Number(value);
      setMaxValue(numValue);
      onChange({ min: minValue, max: numValue });
    },
    [onChange, minValue]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-foreground text-sm font-medium">{label}</Label>

      <div className="space-y-4">
        <Slider
          value={[currentMin, currentMax]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-muted-foreground text-xs">最小値</Label>
            <Input
              type="number"
              placeholder={`${min}${unit}`}
              value={minValue ?? ''}
              onChange={(e) => handleMinChange(e.target.value)}
              min={min}
              max={max}
              step={step}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">最大値</Label>
            <Input
              type="number"
              placeholder={`${max}${unit}`}
              value={maxValue ?? ''}
              onChange={(e) => handleMaxChange(e.target.value)}
              min={min}
              max={max}
              step={step}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default RangeSlider;
