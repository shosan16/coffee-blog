'use client';

import * as Popover from '@radix-ui/react-popover';
import { X, ChevronDown } from 'lucide-react';

import { cn } from '@/client/lib/tailwind';
import { Badge } from '@/client/shared/shadcn/badge';

import { useMultiCombobox } from './hooks/useMultiCombobox';
import type { MultiComboboxProps } from './types';

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
  autoFocus = true,
  ...props
}: MultiComboboxProps) {
  const {
    open,
    inputValue,
    inputRef,
    listboxId,
    filteredItems,
    isMaxItemsReached,
    canCreateNewItem,
    inputTabIndex,
    setOpen,
    setInputValue,
    handleSelectItem,
    handleDeleteItem,
    handleAddNewItem,
    handleInputClick,
    handleInputFocus,
    handleTriggerClick,
    handleKeyDown,
  } = useMultiCombobox({
    items,
    selectedItems,
    onSelect,
    onDelete,
    onAdd,
    creatable,
    disabled,
    maxItems,
    autoFocus,
  });

  return (
    <div className={cn('relative', className)} {...props}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            className={cn(
              'border-primary/30 bg-card min-h-9 w-full cursor-text rounded-md border-2 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow]',
              'hover:border-primary/50',
              'focus-within:border-primary focus-within:ring-ring/20 focus-within:ring-2',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              disabled && 'border-border cursor-not-allowed opacity-50',
              keepMinHeight && selectedItems.length === 0 && 'min-h-9'
            )}
            onClick={handleTriggerClick}
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
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  placeholder={selectedItems.length === 0 ? placeholder : ''}
                  disabled={disabled || isMaxItemsReached}
                  tabIndex={inputTabIndex}
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
            id={listboxId}
            role="listbox"
            data-filter-dropdown
            className={cn(
              'bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 z-50 max-h-72 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border p-0 shadow-md',
              dropdownClassName
            )}
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
          >
            <div className="max-h-72 overflow-auto">
              {dropdownHelpMessage && (
                <div className="text-muted-foreground border-b px-3 py-2 text-xs">
                  {dropdownHelpMessage}
                </div>
              )}

              {canCreateNewItem && (
                <button
                  type="button"
                  className="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm"
                  onClick={handleAddNewItem}
                >
                  <span className="font-medium">「{inputValue}」を追加</span>
                </button>
              )}
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected="false"
                  className={cn(
                    'relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-left text-sm',
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

              {filteredItems.length === 0 && !canCreateNewItem && inputValue && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  該当するアイテムが見つかりません
                </div>
              )}

              {isMaxItemsReached && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  最大{maxItems}個まで選択できます
                </div>
              )}

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
