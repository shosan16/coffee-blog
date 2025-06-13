'use client';

import { cn } from '@/client/lib/tailwind';

import type { ComboboxOptionType } from '@/client/shared/components/combobox/types';

type ComboboxOptionProps = {
  option: ComboboxOptionType;
  isSelected: boolean;
  isFocused: boolean;
  ariaAttributes: Record<string, unknown>;
  onClick: (option: ComboboxOptionType) => void;
  onMouseEnter: () => void;
};

export default function ComboboxOption({
  option,
  isSelected,
  isFocused,
  ariaAttributes,
  onClick,
  onMouseEnter,
}: ComboboxOptionProps) {
  return (
    <li
      {...ariaAttributes}
      className={cn(
        'cursor-pointer px-3 py-2 text-sm select-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        isSelected && 'bg-accent text-accent-foreground',
        isFocused && 'bg-accent text-accent-foreground',
        option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
      )}
      onClick={() => onClick(option)}
      onMouseEnter={onMouseEnter}
    >
      {option.label}
    </li>
  );
}
