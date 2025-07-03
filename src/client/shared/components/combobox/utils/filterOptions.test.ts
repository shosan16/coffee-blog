import { describe, expect, it } from 'vitest';

import type { ComboboxOptionType } from '../types';
import { filterOptions } from '../utils/filterOptions';

describe('filterOptions', () => {
  const mockOptions: ComboboxOptionType[] = [
    { value: 'option1', label: 'Apple' },
    { value: 'option2', label: 'Banana' },
    { value: 'option3', label: 'Cherry' },
    { value: 'option4', label: 'Date' },
    { value: 'option5', label: 'Elderberry' },
  ];

  it('検索値が空の場合、すべてのオプションを返す', () => {
    const result = filterOptions(mockOptions, '');
    expect(result).toEqual(mockOptions);
  });

  it('検索値が空白のみの場合、すべてのオプションを返す', () => {
    const result = filterOptions(mockOptions, '   ');
    expect(result).toEqual(mockOptions);
  });

  it('部分一致でフィルタリングする', () => {
    const result = filterOptions(mockOptions, 'a');
    expect(result).toEqual([
      { value: 'option1', label: 'Apple' },
      { value: 'option2', label: 'Banana' },
      { value: 'option4', label: 'Date' },
    ]);
  });

  it('大文字小文字を区別しない', () => {
    const result = filterOptions(mockOptions, 'APPLE');
    expect(result).toEqual([{ value: 'option1', label: 'Apple' }]);
  });

  it('前後の空白を除去してフィルタリングする', () => {
    const result = filterOptions(mockOptions, '  Cherry  ');
    expect(result).toEqual([{ value: 'option3', label: 'Cherry' }]);
  });

  it('完全一致の場合', () => {
    const result = filterOptions(mockOptions, 'Banana');
    expect(result).toEqual([{ value: 'option2', label: 'Banana' }]);
  });

  it('該当なしの場合、空配列を返す', () => {
    const result = filterOptions(mockOptions, 'xyz');
    expect(result).toEqual([]);
  });

  it('複数の単語を含む場合', () => {
    const optionsWithSpaces: ComboboxOptionType[] = [
      { value: 'option1', label: 'Red Apple' },
      { value: 'option2', label: 'Green Apple' },
      { value: 'option3', label: 'Red Cherry' },
    ];

    const result = filterOptions(optionsWithSpaces, 'Red');
    expect(result).toEqual([
      { value: 'option1', label: 'Red Apple' },
      { value: 'option3', label: 'Red Cherry' },
    ]);
  });

  it('日本語文字列の場合', () => {
    const japaneseOptions: ComboboxOptionType[] = [
      { value: 'option1', label: 'りんご' },
      { value: 'option2', label: 'バナナ' },
      { value: 'option3', label: 'さくらんぼ' },
    ];

    const result = filterOptions(japaneseOptions, 'りん');
    expect(result).toEqual([{ value: 'option1', label: 'りんご' }]);
  });

  it('特殊文字を含む場合', () => {
    const specialOptions: ComboboxOptionType[] = [
      { value: 'option1', label: 'test@example.com' },
      { value: 'option2', label: 'test-123' },
      { value: 'option3', label: 'test_456' },
    ];

    const result = filterOptions(specialOptions, '@');
    expect(result).toEqual([{ value: 'option1', label: 'test@example.com' }]);
  });

  it('空のオプション配列の場合', () => {
    const result = filterOptions([], 'test');
    expect(result).toEqual([]);
  });

  it('disabled オプションも含めてフィルタリングする', () => {
    const optionsWithDisabled: ComboboxOptionType[] = [
      { value: 'option1', label: 'Apple', disabled: false },
      { value: 'option2', label: 'Apricot', disabled: true },
      { value: 'option3', label: 'Banana' },
    ];

    const result = filterOptions(optionsWithDisabled, 'Ap');
    expect(result).toEqual([
      { value: 'option1', label: 'Apple', disabled: false },
      { value: 'option2', label: 'Apricot', disabled: true },
    ]);
  });
});
