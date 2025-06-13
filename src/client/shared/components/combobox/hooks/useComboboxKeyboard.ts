import * as React from 'react';

import type { ComboboxOptionType } from '../types';

type UseComboboxKeyboardProps = {
  isOpen: boolean;
  focusedIndex: number;
  filteredOptions: ComboboxOptionType[];
  actions: {
    open: () => void;
    close: () => void;
    selectOption: (option: ComboboxOptionType) => void;
    setFocusedIndex: (index: number) => void;
  };
  disabled?: boolean;
};

export const useComboboxKeyboard = ({
  isOpen,
  focusedIndex,
  filteredOptions,
  actions,
  disabled = false,
}: UseComboboxKeyboardProps): { handleKeyDown: (e: React.KeyboardEvent) => void } => {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            actions.selectOption(filteredOptions[focusedIndex]);
          } else if (!isOpen) {
            actions.open();
          }
          break;
        case 'Escape':
          e.preventDefault();
          actions.close();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            actions.open();
          } else {
            const nextIndex = focusedIndex < filteredOptions.length - 1 ? focusedIndex + 1 : 0;
            actions.setFocusedIndex(nextIndex);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredOptions.length - 1;
            actions.setFocusedIndex(prevIndex);
          }
          break;
        case 'Tab':
          actions.close();
          break;
      }
    },
    [isOpen, focusedIndex, filteredOptions, actions, disabled]
  );

  return {
    handleKeyDown,
  };
};
