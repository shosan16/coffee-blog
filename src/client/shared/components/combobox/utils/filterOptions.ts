import type { ComboboxOptionType } from '../types';

export const filterOptions = (
  options: ComboboxOptionType[],
  searchValue: string
): ComboboxOptionType[] => {
  if (!searchValue.trim()) {
    return options;
  }

  const normalizedSearch = searchValue.toLowerCase().trim();

  return options.filter((option) => option.label.toLowerCase().includes(normalizedSearch));
};
