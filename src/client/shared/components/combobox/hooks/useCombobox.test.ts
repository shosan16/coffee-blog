import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useCombobox } from '../hooks/useCombobox';
import type { ComboboxOptionType } from '../types';

describe('useCombobox', () => {
  const mockOptions: ComboboxOptionType[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const defaultProps = {
    options: mockOptions,
    onValueChange: vi.fn(),
    onInputChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('正しい初期状態を返す', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      expect(result.current.isOpen).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.focusedIndex).toBe(-1);
      expect(result.current.selectedOption).toBeUndefined();
      expect(result.current.filteredOptions).toEqual(mockOptions);
      expect(result.current.hasValue).toBe(false);
      expect(result.current.isEmpty).toBe(false);
    });

    it('初期値が設定されている場合、selectedOptionを正しく設定する', () => {
      const { result } = renderHook(() => useCombobox({ ...defaultProps, value: 'option1' }));

      expect(result.current.selectedOption).toEqual(mockOptions[0]);
      expect(result.current.hasValue).toBe(true);
      expect(result.current.isEmpty).toBe(false);
    });
  });

  describe('アクション', () => {
    it('open - ドロップダウンを開く', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('close - ドロップダウンを閉じる', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.open();
      });

      act(() => {
        result.current.actions.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.focusedIndex).toBe(-1);
    });

    it('selectOption - オプションを選択する', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() => useCombobox({ ...defaultProps, onValueChange }));

      act(() => {
        result.current.actions.selectOption(mockOptions[1]);
      });

      expect(onValueChange).toHaveBeenCalledWith('option2');
      expect(result.current.isOpen).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.focusedIndex).toBe(-1);
    });

    it('setSearchValue - 検索値を設定する', () => {
      const onInputChange = vi.fn();
      const { result } = renderHook(() => useCombobox({ ...defaultProps, onInputChange }));

      act(() => {
        result.current.actions.setSearchValue('test');
      });

      expect(result.current.searchValue).toBe('test');
      expect(onInputChange).toHaveBeenCalledWith('test');
    });

    it('setFocusedIndex - フォーカスインデックスを設定する', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.setFocusedIndex(1);
      });

      expect(result.current.focusedIndex).toBe(1);
    });

    it('clear - 選択をクリアする', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCombobox({ ...defaultProps, onValueChange, value: 'option1' })
      );

      act(() => {
        result.current.actions.clear();
      });

      expect(onValueChange).toHaveBeenCalledWith('');
      expect(result.current.searchValue).toBe('');
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe('フィルタリング', () => {
    it('検索値に基づいてオプションをフィルタリングする', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.setSearchValue('Option 1');
      });

      expect(result.current.filteredOptions).toEqual([mockOptions[0]]);
    });

    it('大文字小文字を区別しないフィルタリング', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.setSearchValue('option 2');
      });

      expect(result.current.filteredOptions).toEqual([mockOptions[1]]);
    });

    it('検索値が空の場合、すべてのオプションを表示する', () => {
      const { result } = renderHook(() => useCombobox(defaultProps));

      act(() => {
        result.current.actions.setSearchValue('test');
      });

      act(() => {
        result.current.actions.setSearchValue('');
      });

      expect(result.current.filteredOptions).toEqual(mockOptions);
    });
  });

  describe('エッジケース', () => {
    it('存在しない初期値が指定された場合', () => {
      const { result } = renderHook(() => useCombobox({ ...defaultProps, value: 'nonexistent' }));

      expect(result.current.selectedOption).toBeUndefined();
      expect(result.current.hasValue).toBe(false);
    });

    it('無効化されたオプションを選択しようとした場合', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() => useCombobox({ ...defaultProps, onValueChange }));

      act(() => {
        result.current.actions.selectOption(mockOptions[2]); // disabled option
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
