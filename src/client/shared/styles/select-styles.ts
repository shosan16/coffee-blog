import { cn } from '@/client/lib/tailwind';

/**
 * セレクト系コンポーネントのサイズバリアント
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * サイズごとのスタイル定義
 * 高さ、水平パディング、フォントサイズを統一
 */
export const SELECT_SIZES: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-3.5 text-base',
};

/**
 * サイズごとの最小高さ定義
 * MultiComboboxなど、可変高さのコンポーネント用
 */
export const SELECT_MIN_HEIGHTS: Record<SelectSize, string> = {
  sm: 'min-h-8',
  md: 'min-h-9',
  lg: 'min-h-10',
};

/**
 * 高さを含まないサイズ定義
 * MultiComboboxなど可変高さのコンポーネント用
 */
export const SELECT_SIZES_WITHOUT_HEIGHT: Record<SelectSize, string> = {
  sm: 'px-2.5 text-xs',
  md: 'px-3 text-sm',
  lg: 'px-3.5 text-base',
};

/**
 * セレクトトリガー（ボタン部分）の共通スタイルを生成
 *
 * @param size - サイズバリアント（デフォルト: 'md'）
 * @param className - 追加のクラス名
 * @returns マージされたTailwindクラス文字列
 */
export function selectTriggerStyles(size: SelectSize = 'md', className?: string): string {
  return cn(
    // ベーススタイル
    'flex w-full items-center justify-between gap-2 rounded-md',
    'bg-transparent',

    // サイズ
    SELECT_SIZES[size],

    // 統一ボーダー
    'border-2 border-primary/30',

    // ホバー
    'hover:border-primary/50',

    // フォーカス
    'focus-visible:border-primary',
    'focus-visible:ring-2 focus-visible:ring-ring/20',
    'focus-visible:outline-none',

    // エラー
    'aria-invalid:border-destructive',
    'aria-invalid:ring-destructive/20',
    'dark:aria-invalid:ring-destructive/40',

    // 無効状態
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:border-border',

    // プレースホルダー
    'data-[placeholder]:text-muted-foreground',

    // 追加クラス
    className
  );
}
