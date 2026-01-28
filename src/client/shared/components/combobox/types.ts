import type { SelectSize } from '../../styles/select-styles';

export type ComboboxOptionType = {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
};

export type ComboboxSize = SelectSize;
export type ComboboxWidth = 'auto' | 'full';

export type ComboboxProps = {
  readonly options: readonly ComboboxOptionType[];
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly onInputChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly clearable?: boolean;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly error?: boolean;
  readonly className?: string;
  readonly width?: ComboboxWidth;
  readonly size?: ComboboxSize;
  readonly 'data-testid'?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'>;

export type ComboboxState = {
  readonly isOpen: boolean;
  readonly searchValue: string;
  readonly focusedIndex: number;
  readonly selectedOption: ComboboxOptionType | undefined;
  readonly filteredOptions: readonly ComboboxOptionType[];
};

export type ComboboxActions = {
  readonly open: () => void;
  readonly close: () => void;
  readonly selectOption: (option: ComboboxOptionType) => void;
  readonly setSearchValue: (value: string) => void;
  readonly setFocusedIndex: (index: number) => void;
  readonly clear: () => void;
};

export type UseComboboxReturn = ComboboxState & {
  readonly actions: ComboboxActions;
  readonly hasValue: boolean;
  readonly isEmpty: boolean;
};

export type ComboboxIds = {
  readonly combobox: string;
  readonly listbox: string;
  readonly option: (index: number) => string;
};

export type AriaAttributes = {
  readonly input: Record<string, unknown>;
  readonly listbox: Record<string, unknown>;
  readonly option: (index: number, isSelected: boolean) => Record<string, unknown>;
};
