'use client';

import { X } from 'lucide-react';

import { useRecipeQuery } from '@/client/features/recipe-list/hooks/useRecipeQuery';
import {
  buildFilterDisplayItems,
  type FilterDisplayItem,
} from '@/client/features/recipe-list/utils/filterDisplay';

import { getFilterTagStyle } from './filterTagStyles';

/**
 * 適用中のフィルターをタグ形式で表示するコンポーネント
 *
 * 検索バーの下に配置し、個別削除（×ボタン）と一括クリア（「すべてクリア」ボタン）を提供する
 * 統一されたスタイルで一貫性のあるUIを提供
 */
export default function ActiveFilters() {
  const { filters, removeFilter, clearSearch, reset, isLoading } = useRecipeQuery();

  const displayItems = buildFilterDisplayItems(filters);

  if (displayItems.length === 0) {
    return null;
  }

  const handleRemove = (item: FilterDisplayItem) => {
    if (item.isSearch) {
      clearSearch();
    } else {
      removeFilter(item.key, item.itemValue);
    }
  };

  return (
    <div className="container mx-auto px-4 py-3" role="region" aria-label="適用中のフィルター">
      <div className="flex items-start justify-between gap-4">
        {/* タグエリア */}
        <div className="flex flex-1 flex-wrap gap-3">
          {displayItems.map((item, index) => (
            <FilterTag
              key={`${item.key}-${item.itemValue ?? index}`}
              item={item}
              onRemove={() => handleRemove(item)}
              disabled={isLoading}
            />
          ))}
        </div>
        {/* すべてクリアボタン（右端固定） */}
        <button
          type="button"
          onClick={reset}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground ml-4 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-50"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}

type FilterTagProps = {
  item: FilterDisplayItem;
  onRemove: () => void;
  disabled?: boolean;
};

/**
 * 個別のフィルタータグコンポーネント
 * 統一されたスタイルを適用
 */
function FilterTag({ item, onRemove, disabled }: FilterTagProps) {
  const tagStyle = getFilterTagStyle(item.category);

  return (
    <span className={tagStyle}>
      {item.label}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`${item.label}を削除`}
        className="rounded-full p-0.5 opacity-60 transition-all duration-150 hover:bg-black/10 hover:opacity-100 disabled:opacity-50"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
