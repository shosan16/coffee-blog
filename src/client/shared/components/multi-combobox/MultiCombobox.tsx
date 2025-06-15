'use client';

import * as React from 'react';
import { X, ChevronDown } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/client/lib/tailwind';
import { Badge } from '@/client/shared/shadcn/badge';

/**
 * MultiComboboxコンポーネントで使用される選択可能なアイテムの型定義
 */
export type MultiComboboxItem = {
  /** アイテムの一意識別子 */
  id: string;
  /** アイテムの表示ラベル */
  label: string;
  /** アイテムの値（オプション、未指定の場合はidを使用） */
  value?: string;
  /** アイテムが無効化されているかどうか */
  disabled?: boolean;
};

/**
 * MultiComboboxコンポーネントのプロパティ型定義
 */
export type MultiComboboxProps = {
  /** 選択可能なアイテムのリスト（必須） */
  items: MultiComboboxItem[];
  /** 現在選択されているアイテムのリスト（必須） */
  selectedItems: MultiComboboxItem[];
  /** アイテムが選択された時のコールバック関数 */
  onSelect?: (item: MultiComboboxItem) => void;
  /** 選択されたアイテムが削除された時のコールバック関数 */
  onDelete?: (item: MultiComboboxItem) => void;
  /** 新しいアイテムが追加された時のコールバック関数（creatable=trueの場合に必要） */
  onAdd?: (inputValue: string) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 検索ボックス上部に表示されるヘルプメッセージ */
  dropdownHelpMessage?: string;
  /** 新しいアイテムの作成を許可するかどうか */
  creatable?: boolean;
  /** コンポーネントが無効化されているかどうか */
  disabled?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** 入力フィールドのカスタムクラス名 */
  inputClassName?: string;
  /** ドロップダウンのカスタムクラス名 */
  dropdownClassName?: string;
  /** 選択済みアイテムが空の場合の最小の高さを維持するかどうか */
  keepMinHeight?: boolean;
  /** 最大選択可能数（オプション） */
  maxItems?: number;
};

/**
 * 複数選択可能なコンボボックスコンポーネント
 *
 * SmartHR Design SystemのMultiComboboxに基づいて実装されています。
 * テキスト入力による検索機能、動的なアイテム追加機能などを提供します。
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', label: 'React', value: 'react' },
 *   { id: '2', label: 'Vue', value: 'vue' },
 *   { id: '3', label: 'Angular', value: 'angular' }
 * ];
 *
 * const [selectedItems, setSelectedItems] = useState<MultiComboboxItem[]>([]);
 *
 * <MultiCombobox
 *   items={items}
 *   selectedItems={selectedItems}
 *   onSelect={(item) => setSelectedItems([...selectedItems, item])}
 *   onDelete={(item) => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
 *   placeholder="フレームワークを選択してください"
 *   creatable
 *   onAdd={(inputValue) => {
 *     const newItem = { id: Date.now().toString(), label: inputValue, value: inputValue };
 *     setSelectedItems([...selectedItems, newItem]);
 *   }}
 * />
 * ```
 */
export default function MultiCombobox({
  items,
  selectedItems,
  onSelect,
  onDelete,
  onAdd,
  placeholder = '選択してください',
  dropdownHelpMessage,
  creatable = false,
  disabled = false,
  className,
  inputClassName,
  dropdownClassName,
  keepMinHeight = true,
  maxItems,
  ...props
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 選択済みアイテムのIDセットを作成（パフォーマンス最適化）
  const selectedItemIds = React.useMemo(
    () => new Set(selectedItems.map((item) => item.id)),
    [selectedItems]
  );

  // 検索フィルタリングされたアイテム
  const filteredItems = React.useMemo(() => {
    return items.filter(
      (item) =>
        !selectedItemIds.has(item.id) && item.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [items, selectedItemIds, inputValue]);

  // 最大選択数に達しているかチェック
  const isMaxItemsReached = maxItems ? selectedItems.length >= maxItems : false;

  // 新しいアイテムが作成可能かチェック
  const canCreateNewItem = React.useMemo(() => {
    if (!creatable || !inputValue.trim() || isMaxItemsReached) return false;

    // 既存アイテムに同じラベルがないかチェック
    const existsInItems = items.some(
      (item) => item.label.toLowerCase() === inputValue.toLowerCase()
    );
    const existsInSelected = selectedItems.some(
      (item) => item.label.toLowerCase() === inputValue.toLowerCase()
    );

    return !existsInItems && !existsInSelected;
  }, [creatable, inputValue, items, selectedItems, isMaxItemsReached]);

  /**
   * アイテム選択ハンドラー
   * 選択されたアイテムをコールバックで通知し、入力値をクリアします
   */
  const handleSelectItem = React.useCallback(
    (item: MultiComboboxItem) => {
      if (disabled || item.disabled || isMaxItemsReached) return;

      onSelect?.(item);
      setInputValue('');
      inputRef.current?.focus();
    },
    [disabled, isMaxItemsReached, onSelect]
  );

  /**
   * アイテム削除ハンドラー
   * 選択されたアイテムを削除し、入力フィールドにフォーカスを戻します
   */
  const handleDeleteItem = React.useCallback(
    (item: MultiComboboxItem) => {
      if (disabled) return;

      onDelete?.(item);
      inputRef.current?.focus();
    },
    [disabled, onDelete]
  );

  /**
   * 新しいアイテム追加ハンドラー
   * 入力値から新しいアイテムを作成し、選択状態に追加します
   */
  const handleAddNewItem = React.useCallback(() => {
    if (!canCreateNewItem || !inputValue.trim()) return;

    onAdd?.(inputValue.trim());
    setInputValue('');
    inputRef.current?.focus();
  }, [canCreateNewItem, inputValue, onAdd]);

  /**
   * キーボードショートカットハンドラー
   * Enter: 新しいアイテム追加またはフィルタされた最初のアイテム選択
   * Backspace: 最後の選択アイテム削除（入力が空の場合）
   * Escape: ドロップダウンを閉じる
   */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (canCreateNewItem) {
            handleAddNewItem();
          } else if (filteredItems.length > 0 && !filteredItems[0].disabled) {
            handleSelectItem(filteredItems[0]);
          }
          break;
        case 'Backspace':
          if (inputValue === '' && selectedItems.length > 0) {
            e.preventDefault();
            handleDeleteItem(selectedItems[selectedItems.length - 1]);
          }
          break;
        case 'Escape':
          setOpen(false);
          break;
      }
    },
    [
      disabled,
      canCreateNewItem,
      filteredItems,
      inputValue,
      selectedItems,
      handleAddNewItem,
      handleSelectItem,
      handleDeleteItem,
    ]
  );

  return (
    <div className={cn('relative', className)} {...props}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div
            className={cn(
              'border-input min-h-9 w-full cursor-text rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow]',
              'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              disabled && 'cursor-not-allowed opacity-50',
              keepMinHeight && selectedItems.length === 0 && 'min-h-9',
              className
            )}
            onClick={() => {
              if (!disabled) {
                inputRef.current?.focus();
                setOpen(true);
              }
            }}
          >
            <div className="flex flex-wrap gap-1">
              {selectedItems.map((item) => (
                <Badge key={item.id} variant="secondary" className="h-6 text-xs font-normal">
                  <span className="max-w-32 truncate">{item.label}</span>
                  <button
                    type="button"
                    className="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item);
                    }}
                    disabled={disabled}
                    aria-label={`${item.label}を削除`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <div className="flex min-w-12 flex-1 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setOpen(true)}
                  placeholder={selectedItems.length === 0 ? placeholder : ''}
                  disabled={disabled || isMaxItemsReached}
                  className={cn(
                    'placeholder:text-muted-foreground min-w-12 flex-1 border-0 bg-transparent outline-none',
                    inputClassName
                  )}
                />
              </div>
            </div>
            <ChevronDown className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 z-50 max-h-72 w-[--radix-popover-trigger-width] overflow-hidden rounded-md border p-0 shadow-md',
              dropdownClassName
            )}
            align="start"
            sideOffset={4}
          >
            <div className="max-h-72 overflow-auto">
              {dropdownHelpMessage && (
                <div className="text-muted-foreground border-b px-3 py-2 text-xs">
                  {dropdownHelpMessage}
                </div>
              )}

              {/* 新しいアイテム作成オプション */}
              {canCreateNewItem && (
                <button
                  type="button"
                  className="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm"
                  onClick={handleAddNewItem}
                >
                  <span className="font-medium">「{inputValue}」を追加</span>
                </button>
              )}

              {/* フィルタされたアイテムリスト */}
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    item.disabled &&
                      'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-current'
                  )}
                  onClick={() => handleSelectItem(item)}
                  disabled={item.disabled}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}

              {/* 結果が見つからない場合のメッセージ */}
              {filteredItems.length === 0 && !canCreateNewItem && inputValue && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  該当するアイテムが見つかりません
                </div>
              )}

              {/* 最大選択数に達した場合のメッセージ */}
              {isMaxItemsReached && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  最大{maxItems}個まで選択できます
                </div>
              )}

              {/* アイテムが何もない場合のメッセージ */}
              {items.length === 0 && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  選択可能なアイテムがありません
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
