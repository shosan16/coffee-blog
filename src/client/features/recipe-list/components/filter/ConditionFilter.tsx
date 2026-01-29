'use client';

import { useMemo, useCallback, memo } from 'react';

import MultiCombobox from '@/client/shared/components/multi-combobox/MultiCombobox';
import type { MultiComboboxItem } from '@/client/shared/components/multi-combobox/types';
import { ROAST_LEVELS } from '@/client/shared/constants/coffee-beans';
import Label from '@/client/shared/shadcn/label';

type ConditionFilterProps = {
  /** 焙煎レベル（文字列配列） */
  roastLevels: string[];
  onRoastLevelChange: (levels: string[]) => void;
  className?: string;
};

function ConditionFilter({
  roastLevels,
  onRoastLevelChange,
  className = '',
}: ConditionFilterProps): React.JSX.Element {
  // MultiCombobox用の定数（変換不要）
  const roastLevelItems = useMemo(() => ROAST_LEVELS, []);

  // 選択されている焙煎度をMultiComboboxItem形式に変換
  const selectedRoastLevels = useMemo(() => {
    return roastLevels
      .map((level) => roastLevelItems.find((item) => item.value === level))
      .filter((item): item is MultiComboboxItem => item !== undefined);
  }, [roastLevels, roastLevelItems]);

  // 焙煎度トグルハンドラー（選択/削除を一つの関数で処理）
  const handleRoastLevelToggle = useCallback(
    (item: MultiComboboxItem) => {
      const roastLevel = item.value ?? item.id;
      const isSelected = roastLevels.includes(roastLevel);
      const newLevels = isSelected
        ? roastLevels.filter((level) => level !== roastLevel)
        : [...roastLevels, roastLevel];
      onRoastLevelChange(newLevels);
    },
    [roastLevels, onRoastLevelChange]
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-foreground text-sm font-medium">焙煎度</Label>
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
  );
}

export default memo(ConditionFilter);
