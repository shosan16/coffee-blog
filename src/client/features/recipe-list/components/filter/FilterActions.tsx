import { Filter, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from '@/client/shared/shadcn/button';

/**
 * フィルター操作コンポーネントのProps
 */
export type FilterActionsProps = {
  /** フィルター適用ハンドラー */
  onApply: () => void;
  /** フィルターリセットハンドラー */
  onReset: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** 変更があるかどうか */
  hasChanges: boolean;
  /** アクティブフィルター数 */
  activeFilterCount: number;
};

/**
 * フィルター条件の適用・リセットを行う操作ボタン群
 *
 * @description ユーザーがフィルター条件を調整した後に、実際に検索に反映させるための
 * アクションボタンを提供する。リセットボタンは現在設定済みのフィルターを全てクリアし、
 * 絞り込むボタンは変更したフィルター条件を検索結果に適用する。
 *
 * ボタンの有効/無効状態：
 * - リセット：フィルターが1つでも設定されている場合に有効
 * - 絞り込む：フィルター条件に変更がある場合に有効
 * - 両方ともローディング中は無効（二重実行防止）
 *
 * @param props.onApply フィルター適用時のコールバック
 * @param props.onReset フィルターリセット時のコールバック
 * @param props.isLoading フィルター処理中かどうか
 * @param props.hasChanges 未適用の変更があるかどうか
 * @param props.activeFilterCount 現在設定されているフィルター数
 */
export default function FilterActions({
  onApply,
  onReset,
  isLoading,
  hasChanges,
  activeFilterCount,
}: FilterActionsProps) {
  return (
    <div className="space-y-3 border-t px-4 pt-4 sm:px-6">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isLoading || activeFilterCount === 0}
          className="flex-1"
          type="button"
          aria-label={`フィルターをリセット（現在 ${activeFilterCount} 件設定中）`}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          リセット
        </Button>

        <Button
          onClick={onApply}
          disabled={isLoading || !hasChanges}
          className="flex-1"
          type="button"
          aria-label={hasChanges ? 'フィルター変更を適用' : 'フィルター変更なし'}
        >
          <Filter className="mr-2 h-4 w-4" />
          絞り込む
        </Button>
      </div>

      {/* 変更状態の表示 */}
      {hasChanges && (
        <div className="text-muted-foreground text-center text-sm" role="status" aria-live="polite">
          変更があります。絞り込むボタンを押して適用してください。
        </div>
      )}
    </div>
  );
}
