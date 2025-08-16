'use client';

import { SlidersHorizontal } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/client/shared/shadcn/button';

type FilterTriggerButtonProps = {
  /** アクティブなフィルター数 */
  readonly activeFilterCount: number;
  /** クリックハンドラー */
  readonly onClick: () => void;
  /** フィルターパネルの表示状態（aria-expanded用） */
  readonly isOpen: boolean;
};

/**
 * フィルタートリガーボタンコンポーネント
 *
 * フィルターシートを開くためのトリガーボタン。
 * アクティブなフィルター数を視覚的に表示し、現在の絞り込み状況を把握できる。
 *
 * @param activeFilterCount - アクティブなフィルター数
 * @param onClick - クリックハンドラー
 * @param isOpen - フィルターパネルの表示状態（aria-expanded用）
 */
const FilterTriggerButton = React.memo<FilterTriggerButtonProps>(
  ({ activeFilterCount, onClick, isOpen }) => {
    return (
      <div className="border-input border-l">
        <Button
          variant="outline"
          className="h-auto rounded-none border-0 bg-gray-400 px-5 py-5 text-sm font-medium"
          aria-label="フィルター条件を開く"
          aria-expanded={isOpen}
          onClick={onClick}
        >
          <SlidersHorizontal className="h-4 w-4" />
          絞り込み
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground min-w-[20px] rounded-full px-2 py-1 text-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    );
  }
);

FilterTriggerButton.displayName = 'FilterTriggerButton';

export default FilterTriggerButton;
