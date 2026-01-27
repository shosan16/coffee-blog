'use client';

import { memo } from 'react';

import {
  SORT_OPTIONS,
  DEFAULT_SORT,
  parseSortValue,
  buildSortValue,
} from '@/client/features/recipe-list/constants/sort';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/shared/shadcn/select';

type SortSelectProps = {
  /** 現在のソートフィールド */
  readonly currentSort?: string;
  /** 現在のソート順 */
  readonly currentOrder?: 'asc' | 'desc';
  /** ソート変更時のコールバック */
  readonly onSortChange: (sort: string, order: 'asc' | 'desc') => void;
  /** 無効化状態 */
  readonly disabled?: boolean;
};

/**
 * レシピ一覧のソート選択コンポーネント
 *
 * ドロップダウンでソート条件を選択し、選択時に親コンポーネントに通知する。
 * 新着順、人気順、焙煎度（浅煎り/深煎り順）の4つのオプションを提供。
 *
 * @example
 * ```tsx
 * <SortSelect
 *   currentSort="publishedAt"
 *   currentOrder="desc"
 *   onSortChange={(sort, order) => console.log(sort, order)}
 * />
 * ```
 */
function SortSelect({
  currentSort,
  currentOrder,
  onSortChange,
  disabled = false,
}: SortSelectProps): React.JSX.Element {
  const currentValue =
    currentSort && currentOrder ? buildSortValue(currentSort, currentOrder) : DEFAULT_SORT;

  const handleValueChange = (value: string): void => {
    const { sort, order } = parseSortValue(value);
    onSortChange(sort, order);
  };

  return (
    <Select value={currentValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]" aria-label="ソート順を選択">
        <SelectValue placeholder="並び替え" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default memo(SortSelect);
