'use client';

import { X, Filter } from 'lucide-react';
import * as React from 'react';

import { useEquipment } from '@/client/shared/hooks/useEquipment';
import { formatEquipmentName } from '@/client/shared/utils/equipmentApi';

import { useRecipeSearch } from '../../hooks/useRecipeSearch';
import type { RecipeFilters } from '../../types/api';

type ActiveFiltersProps = {
  /** 追加のCSSクラス名 */
  readonly className?: string;
};

/**
 * アクティブフィルターをバッジ形式で表示するコンポーネント
 *
 * 現在適用中のフィルター条件を可視化し、個別削除や
 * 一括クリア機能を提供する。
 *
 * @example
 * ```tsx
 * <ActiveFilters />
 * ```
 */
const ActiveFilters = React.memo<ActiveFiltersProps>(({ className }) => {
  const { filters, searchValue, removeFilter, clearSearch, resetSearch } = useRecipeSearch();

  // 器具データを取得（器具名の分類とフォーマットに使用）
  const { equipment: equipmentData } = useEquipment();

  // フィルター表示名のマッピング
  const filterLabels: Record<string, string> = React.useMemo(
    () => ({
      roastLevel: '焙煎度',
      grindSize: '挽き目',
      brewingMethod: '抽出方法',
      coffeeMill: 'コーヒーミル',
      dripper: 'ドリッパー',
      paperFilter: 'ペーパーフィルター',
      beanWeight: 'コーヒー粉量',
      waterTemp: '湯温',
      waterAmount: '総湯量',
      difficulty: '難易度',
      // 後方互換性のため
      coffeeAmount: 'コーヒー粉量',
      waterTemperature: '湯温',
      totalWaterAmount: '総湯量',
    }),
    []
  );

  // 範囲フィルターの表示テキスト生成
  const formatRangeValue = React.useCallback((value: { min?: number; max?: number }) => {
    if (value.min !== undefined && value.max !== undefined) {
      return `${value.min} - ${value.max}`;
    } else if (value.min !== undefined) {
      return `${value.min}以上`;
    } else if (value.max !== undefined) {
      return `${value.max}以下`;
    }
    return '';
  }, []);

  // 器具を分類する関数
  const categorizeEquipment = React.useCallback(
    (equipmentName: string) => {
      if (!equipmentData) return 'equipment';

      const grinderItem = equipmentData.grinder.find((item) => item.name === equipmentName);
      const dripperItem = equipmentData.dripper.find((item) => item.name === equipmentName);
      const filterItem = equipmentData.filter.find((item) => item.name === equipmentName);

      if (grinderItem) return 'grinder';
      if (dripperItem) return 'dripper';
      if (filterItem) return 'filter';
      return 'equipment';
    },
    [equipmentData]
  );

  // 器具のフォーマット表示名を取得
  const getEquipmentDisplayName = React.useCallback(
    (equipmentName: string) => {
      if (!equipmentData) return equipmentName;

      const grinderItem = equipmentData.grinder.find((item) => item.name === equipmentName);
      const dripperItem = equipmentData.dripper.find((item) => item.name === equipmentName);
      const filterItem = equipmentData.filter.find((item) => item.name === equipmentName);

      if (grinderItem) return formatEquipmentName(grinderItem);
      if (dripperItem) return formatEquipmentName(dripperItem);
      if (filterItem) return formatEquipmentName(filterItem);
      return equipmentName;
    },
    [equipmentData]
  );

  // 器具フィルターのバッジ生成
  const createEquipmentBadges = React.useCallback(
    (equipmentNames: string[]) => {
      return equipmentNames.map((equipmentName) => {
        const category = categorizeEquipment(equipmentName);
        const categoryLabels = {
          grinder: 'コーヒーミル',
          dripper: 'ドリッパー',
          filter: 'ペーパーフィルター',
        };
        const categoryLabel = categoryLabels[category] ?? 'equipment';
        const displayName = getEquipmentDisplayName(equipmentName);

        return {
          key: `equipment_${equipmentName}`,
          label: categoryLabel,
          value: displayName,
          onRemove: () => removeFilter('equipment', equipmentName),
        };
      });
    },
    [categorizeEquipment, getEquipmentDisplayName, removeFilter]
  );

  // アクティブフィルターのバッジデータ生成
  const activeFilterBadges = React.useMemo(() => {
    const badges: Array<{
      key: string;
      label: string;
      value: string;
      onRemove: () => void;
    }> = [];

    // 検索キーワード
    if (searchValue) {
      badges.push({
        key: 'search',
        label: '検索',
        value: searchValue,
        onRemove: clearSearch,
      });
    }

    // 各フィルター
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'page' || key === 'search' || !value) return;

      // 器具フィルターの場合は個別に処理
      if (key === 'equipment' && Array.isArray(value)) {
        badges.push(...createEquipmentBadges(value));
      } else {
        // 器具以外のフィルター
        const label = filterLabels[key] || key;
        let displayValue = '';

        if (Array.isArray(value)) {
          displayValue = value.join(', ');
        } else if (typeof value === 'object' && 'min' in value && 'max' in value) {
          displayValue = formatRangeValue(value as { min?: number; max?: number });
        } else {
          displayValue = String(value);
        }

        if (displayValue) {
          badges.push({
            key,
            label,
            value: displayValue,
            onRemove: () => removeFilter(key as keyof RecipeFilters),
          });
        }
      }
    });

    return badges;
  }, [
    filters,
    searchValue,
    filterLabels,
    formatRangeValue,
    clearSearch,
    createEquipmentBadges,
    removeFilter,
  ]);

  // アクティブフィルター数
  const activeCount = activeFilterBadges.length;

  if (activeCount === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-foreground text-sm font-medium">
            適用中のフィルター ({activeCount}件)
          </span>
        </div>
        <button
          type="button"
          onClick={resetSearch}
          className="text-muted-foreground hover:text-foreground text-sm underline transition-colors"
        >
          すべてクリア
        </button>
      </div>

      {/* フィルターバッジ */}
      <div className="flex flex-wrap gap-2">
        {activeFilterBadges.map(({ key, label, value, onRemove }) => (
          <div
            key={key}
            className="bg-secondary border-border inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
          >
            <span className="text-secondary-foreground font-medium">{label}:</span>
            <span className="text-muted-foreground">{value}</span>
            <button
              type="button"
              onClick={onRemove}
              className="text-muted-foreground hover:text-foreground ml-1 transition-colors"
              aria-label={`${label}フィルターを削除`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

ActiveFilters.displayName = 'ActiveFilters';

export default ActiveFilters;
