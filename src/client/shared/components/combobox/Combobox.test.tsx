import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import Combobox from './Combobox';
import type { ComboboxOptionType } from './types';

describe('Combobox', () => {
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

  afterEach(() => {
    cleanup();
  });

  describe('レンダリング', () => {
    it('基本的なコンポーネントをレンダリングする', () => {
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('プレースホルダーを表示する', () => {
      render(<Combobox {...defaultProps} placeholder="選択してください" />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('placeholder', '選択してください');
    });

    it('初期値が設定されている場合、選択された値を表示する', () => {
      render(<Combobox {...defaultProps} value="option1" />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Option 1');
    });

    it('無効状態で表示する', () => {
      render(<Combobox {...defaultProps} disabled />);

      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    it('エラー状態のスタイルを適用する', () => {
      render(<Combobox {...defaultProps} error />);

      const container = screen.getByRole('combobox').parentElement;
      expect(container).toHaveClass('border-destructive');
    });
  });

  describe('ドロップダウン開閉', () => {
    it('入力フィールドをクリックしてドロップダウンを開く', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('Escapeキーでドロップダウンを閉じる', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Escape}');

      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('外部をクリックしてドロップダウンを閉じる', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Combobox {...defaultProps} />
          <button>外部ボタン</button>
        </div>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');

      const outsideButton = screen.getByText('外部ボタン');
      await user.click(outsideButton);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('オプション選択', () => {
    it('オプションをクリックして選択する', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Combobox {...defaultProps} onValueChange={onValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const option = screen.getByRole('option', { name: 'Option 2' });
      await user.click(option);

      expect(onValueChange).toHaveBeenCalledWith('option2');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('無効化されたオプションはクリックできない', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Combobox {...defaultProps} onValueChange={onValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const disabledOption = screen.getByRole('option', { name: 'Option 3' });
      await user.click(disabledOption);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('キーボードナビゲーション', () => {
    it('ArrowDownキーでドロップダウンを開く', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('ArrowDownキーでフォーカスを下に移動', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption).toHaveClass('bg-accent');
    });

    it('ArrowUpキーでフォーカスを上に移動', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption).toHaveClass('bg-accent');
    });

    it('Enterキーで選択する', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Combobox {...defaultProps} onValueChange={onValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onValueChange).toHaveBeenCalledWith('option1');
    });
  });

  describe('検索機能', () => {
    it('検索値でオプションをフィルタリングする', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'Option 1');

      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
    });

    it('検索結果がない場合、空のメッセージを表示', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} emptyMessage="見つかりません" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'nonexistent');

      expect(screen.getByText('見つかりません')).toBeInTheDocument();
    });

    it('検索値の変更を親に通知する', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();
      render(<Combobox {...defaultProps} onInputChange={onInputChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'test');

      expect(onInputChange).toHaveBeenCalledWith('test');
    });
  });

  describe('クリア機能', () => {
    it('クリアボタンをクリックして選択をクリア', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox {...defaultProps} value="option1" onValueChange={onValueChange} clearable />
      );

      const clearButton = screen.getByLabelText('クリア');
      await user.click(clearButton);

      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('clearableがfalseの場合、クリアボタンを表示しない', () => {
      render(<Combobox {...defaultProps} value="option1" clearable={false} />);

      expect(screen.queryByLabelText('クリア')).not.toBeInTheDocument();
    });

    it('selectedOptionが存在しない場合、クリアボタンを表示しない', () => {
      render(<Combobox {...defaultProps} clearable />);

      expect(screen.queryByLabelText('クリア')).not.toBeInTheDocument();
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中のメッセージを表示', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} loading />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIA属性を設定', () => {
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });

    it('ドロップダウンが開いている時、適切な属性を設定', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('選択されたオプションにaria-selectedを設定', async () => {
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} value="option1" />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });
});
