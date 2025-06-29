import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useComboboxKeyboard } from '../hooks/useComboboxKeyboard';
import type { ComboboxOptionType } from '../types';

describe('useComboboxKeyboard', () => {
  const mockOptions: ComboboxOptionType[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const mockActions = {
    open: vi.fn(),
    close: vi.fn(),
    selectOption: vi.fn(),
    setFocusedIndex: vi.fn(),
  };

  const defaultProps = {
    isOpen: false,
    focusedIndex: -1,
    filteredOptions: mockOptions,
    actions: mockActions,
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleKeyDown', () => {
    it('Enterキー - ドロップダウンが閉じている場合は開く', () => {
      const { result } = renderHook(() => useComboboxKeyboard(defaultProps));

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.open).toHaveBeenCalled();
    });

    it('Enterキー - フォーカスされたオプションを選択', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 1,
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.selectOption).toHaveBeenCalledWith(mockOptions[1]);
    });

    it('Escapeキー - ドロップダウンを閉じる', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 1,
        })
      );

      const mockEvent = {
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.close).toHaveBeenCalled();
    });

    it('ArrowDownキー - ドロップダウンが閉じている場合は開く', () => {
      const { result } = renderHook(() => useComboboxKeyboard(defaultProps));

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.open).toHaveBeenCalled();
    });

    it('ArrowDownキー - フォーカスを下に移動', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 0,
        })
      );

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.setFocusedIndex).toHaveBeenCalledWith(1);
    });

    it('ArrowDownキー - 最後の項目から最初に戻る', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 2, // 最後の項目
        })
      );

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.setFocusedIndex).toHaveBeenCalledWith(0);
    });

    it('ArrowUpキー - フォーカスを上に移動', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 1,
        })
      );

      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.setFocusedIndex).toHaveBeenCalledWith(0);
    });

    it('ArrowUpキー - 最初の項目から最後に戻る', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 0, // 最初の項目
        })
      );

      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.setFocusedIndex).toHaveBeenCalledWith(2);
    });

    it('Tabキー - ドロップダウンを閉じる', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
        })
      );

      const mockEvent = {
        key: 'Tab',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockActions.close).toHaveBeenCalled();
      // Tabキーの場合はpreventDefaultしない
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('disabled時はキーイベントを無視', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          disabled: true,
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockActions.open).not.toHaveBeenCalled();
    });

    it('未知のキーは何もしない', () => {
      const { result } = renderHook(() => useComboboxKeyboard(defaultProps));

      const mockEvent = {
        key: 'Space',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockActions.open).not.toHaveBeenCalled();
    });
  });

  describe('エッジケース', () => {
    it('フィルタリングされたオプションが空の場合', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          filteredOptions: [],
          focusedIndex: 0,
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.selectOption).not.toHaveBeenCalled();
    });

    it('フォーカスインデックスが範囲外の場合', () => {
      const { result } = renderHook(() =>
        useComboboxKeyboard({
          ...defaultProps,
          isOpen: true,
          focusedIndex: 10, // 範囲外
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockActions.selectOption).not.toHaveBeenCalled();
    });
  });
});
