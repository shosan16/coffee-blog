'use client';

import * as React from 'react';

import { cn } from '@/client/lib/tailwind';

import FilterTriggerButton from './FilterTriggerButton';
import SearchActionButton from './SearchActionButton';
import SearchInput from './SearchInput';

type IntegratedSearchBarProps = {
  /** 追加のCSSクラス名 */
  readonly className?: string;
  /** プレースホルダーテキスト */
  readonly placeholder?: string;
  /** aria-label */
  readonly 'aria-label'?: string;
};

/**
 * 統合検索バーコンポーネント
 *
 * キーワード検索、フィルターボタン、検索ボタンを組み合わせた
 * 統一されたデザインの検索インターフェースを提供する。
 *
 * KISS原則に従い、3つの小さなコンポーネントで構成：
 * - SearchInput: 検索入力フィールド
 * - FilterTriggerButton: フィルター条件設定ボタン
 * - SearchActionButton: 検索実行ボタン
 *
 * @example
 * ```tsx
 * <IntegratedSearchBar
 *   placeholder="レシピを検索..."
 *   className="max-w-2xl"
 * />
 * ```
 */
const IntegratedSearchBar = React.memo<IntegratedSearchBarProps>(
  ({ className, placeholder = 'レシピを検索...', 'aria-label': ariaLabel }) => {
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    // コンテナのスタイルクラス
    const containerClassName = React.useMemo(
      () =>
        cn(
          'flex items-center bg-background border border-input rounded-md shadow-sm overflow-hidden',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'transition-colors',
          className ?? ''
        ),
      [className]
    );

    return (
      <div className={containerClassName}>
        {/* 検索入力フィールド */}
        <SearchInput placeholder={placeholder} aria-label={ariaLabel} />

        {/* フィルターボタン */}
        <FilterTriggerButton isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} />

        {/* 検索ボタン */}
        <SearchActionButton />
      </div>
    );
  }
);

IntegratedSearchBar.displayName = 'IntegratedSearchBar';

export default IntegratedSearchBar;
