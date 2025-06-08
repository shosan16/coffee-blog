import type { ComboboxState, ComboboxIds, AriaAttributes } from '../types';

const DEFAULT_BASE_ID = 'combobox';
const SCREEN_READER_CLEANUP_DELAY = 1000;

export const generateComboboxIds = (baseId?: string): ComboboxIds => {
  const id = baseId ?? DEFAULT_BASE_ID;
  return {
    combobox: `${id}-input`,
    listbox: `${id}-listbox`,
    option: (index: number): string => `${id}-option-${index}`,
  };
};

export const getAriaAttributes = (state: ComboboxState, ids: ComboboxIds): AriaAttributes => {
  const { isOpen, focusedIndex } = state;

  return {
    input: {
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-controls': isOpen ? ids.listbox : undefined,
      'aria-activedescendant': isOpen && focusedIndex >= 0 ? ids.option(focusedIndex) : undefined,
      role: 'combobox' as const,
      autoComplete: 'off' as const,
    },
    listbox: {
      role: 'listbox' as const,
      id: ids.listbox,
    },
    option: (index: number, isSelected: boolean): Record<string, unknown> => ({
      role: 'option' as const,
      id: ids.option(index),
      'aria-selected': isSelected,
    }),
  };
};

export const announceToScreenReader = (message: string): void => {
  if (!message.trim()) {
    return;
  }

  try {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only absolute -left-[10000px] w-[1px] h-[1px] overflow-hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // 短時間後に削除
    setTimeout(() => {
      try {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      } catch {
        // エラーは無視
      }
    }, SCREEN_READER_CLEANUP_DELAY);
  } catch {
    // エラーは無視
  }
};

export const getOptionAnnouncement = (
  option: { label: string; disabled?: boolean },
  index: number,
  total: number
): string => {
  const position = `${index + 1} / ${total}`;
  const status = option.disabled ? '無効' : '';
  return `${option.label} ${status} ${position}`.trim();
};
