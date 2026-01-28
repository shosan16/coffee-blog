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

  // テストヘルパー関数：Comboboxの入力要素を取得
  const getComboboxInput = (testId: string = 'test-combobox'): HTMLElement => {
    const container = screen.getByTestId(testId);
    const input = container.querySelector('[role="combobox"]') as HTMLElement;
    expect(input).toBeInTheDocument(); // 存在チェックも含める
    return input;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('レンダリング', () => {
    it('基本的なコンポーネントをレンダリングする', () => {
      // Arrange - デフォルトプロップスでComboboxをレンダリング
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - Combobox入力要素を取得
      const input = getComboboxInput();

      // Assert - 初期状態が正しいことを検証
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('プレースホルダーを表示する', () => {
      // Arrange - プレースホルダー付きでComboboxをレンダリング
      render(
        <Combobox {...defaultProps} placeholder="選択してください" data-testid="test-combobox" />
      );

      // Act - Combobox入力要素を取得
      const input = getComboboxInput();

      // Assert - プレースホルダーが正しく設定されていることを検証
      expect(input).toHaveAttribute('placeholder', '選択してください');
    });

    it('初期値が設定されている場合、選択された値を表示する', () => {
      // Arrange - 初期値付きでComboboxをレンダリング
      render(<Combobox {...defaultProps} value="option1" data-testid="test-combobox" />);

      // Act - Combobox入力要素を取得
      const input = getComboboxInput() as HTMLInputElement;

      // Assert - 選択された値が正しく表示されていることを検証
      expect(input).toHaveValue('Option 1');
    });

    it('無効状態で表示する', () => {
      // Arrange - 無効状態でComboboxをレンダリング
      render(<Combobox {...defaultProps} disabled data-testid="test-combobox" />);

      // Act - Combobox入力要素を取得
      const input = getComboboxInput();

      // Assert - 無効状態が正しく設定されていることを検証
      expect(input).toBeDisabled();
    });

    it('エラー状態のスタイルを適用する', () => {
      // Arrange - エラー状態でComboboxをレンダリング
      render(<Combobox {...defaultProps} error data-testid="test-combobox" />);

      // Act - Combobox入力要素を取得
      const input = getComboboxInput();

      // Assert - エラー状態のスタイルが適用されていることを検証
      expect(input.parentElement).toHaveClass('border-destructive');
    });
  });

  describe('サイズバリアント', () => {
    it('size="sm" でレンダリングする', () => {
      // Arrange - smサイズでComboboxをレンダリング
      render(<Combobox {...defaultProps} size="sm" data-testid="test-combobox" />);

      // Act - Combobox入力要素の親（スタイル適用先）を取得
      const input = getComboboxInput();
      const container = input.parentElement;

      // Assert - smサイズのスタイルが適用されていることを検証
      expect(container).toHaveClass('h-8');
      expect(container).toHaveClass('px-2.5');
      expect(container).toHaveClass('text-xs');
    });

    it('size="md" がデフォルトでレンダリングされる', () => {
      // Arrange - sizeを指定せずにComboboxをレンダリング
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - Combobox入力要素の親（スタイル適用先）を取得
      const input = getComboboxInput();
      const container = input.parentElement;

      // Assert - mdサイズ（デフォルト）のスタイルが適用されていることを検証
      expect(container).toHaveClass('h-9');
      expect(container).toHaveClass('px-3');
      expect(container).toHaveClass('text-sm');
    });

    it('size="lg" でレンダリングする', () => {
      // Arrange - lgサイズでComboboxをレンダリング
      render(<Combobox {...defaultProps} size="lg" data-testid="test-combobox" />);

      // Act - Combobox入力要素の親（スタイル適用先）を取得
      const input = getComboboxInput();
      const container = input.parentElement;

      // Assert - lgサイズのスタイルが適用されていることを検証
      expect(container).toHaveClass('h-10');
      expect(container).toHaveClass('px-3.5');
      expect(container).toHaveClass('text-base');
    });
  });

  describe('ドロップダウン開閉', () => {
    it('入力フィールドをクリックしてドロップダウンを開く', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリック
      const input = getComboboxInput();
      await user.click(input);

      // Assert - ドロップダウンが開いていることを検証
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('Escapeキーでドロップダウンを閉じる', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開き、Escapeキーを押下
      const input = getComboboxInput();
      await user.click(input);
      await user.keyboard('{Escape}');

      // Assert - ドロップダウンが閉じていることを検証
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('外部をクリックしてドロップダウンを閉じる', async () => {
      // Arrange - ユーザーイベントと外部ボタン付きのComboboxをセットアップ
      const user = userEvent.setup();
      render(
        <div>
          <Combobox {...defaultProps} data-testid="test-combobox" />
          <button>外部ボタン</button>
        </div>
      );

      // Act - 入力フィールドをクリックして開き、外部ボタンをクリック
      const input = getComboboxInput();
      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');

      const outsideButton = screen.getByText('外部ボタン');
      await user.click(outsideButton);

      // Assert - ドロップダウンが閉じていることを検証
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('オプション選択', () => {
    it('オプションをクリックして選択する', async () => {
      // Arrange - ユーザーイベントとコールバック付きComboboxをセットアップ
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox {...defaultProps} onValueChange={onValueChange} data-testid="test-combobox" />
      );

      // Act - 入力フィールドをクリックして開き、オプションを選択
      const input = getComboboxInput();
      await user.click(input);

      const option = screen.getByRole('option', { name: 'Option 2' });
      await user.click(option);

      // Assert - コールバックが正しく呼ばれ、ドロップダウンが閉じることを検証
      expect(onValueChange).toHaveBeenCalledWith('option2');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('無効化されたオプションはクリックできない', async () => {
      // Arrange - ユーザーイベントとコールバック付きComboboxをセットアップ
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox {...defaultProps} onValueChange={onValueChange} data-testid="test-combobox" />
      );

      // Act - 入力フィールドをクリックして開き、無効化されたオプションをクリック
      const input = getComboboxInput();
      await user.click(input);

      const disabledOption = screen.getByRole('option', { name: 'Option 3' });
      await user.click(disabledOption);

      // Assert - コールバックが呼ばれないことを検証
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('キーボードナビゲーション', () => {
    it('ArrowDownキーでドロップダウンを開く', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドにフォーカスして、ArrowDownキーを押下
      const input = getComboboxInput();
      input.focus();
      await user.keyboard('{ArrowDown}');

      // Assert - ドロップダウンが開いていることを検証
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('ArrowDownキーでフォーカスを下に移動', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開き、ArrowDownキーを押下
      const input = getComboboxInput();
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      // Assert - 最初のオプションがフォーカスされていることを検証
      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption).toHaveClass('bg-accent');
    });

    it('ArrowUpキーでフォーカスを上に移動', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開き、下→下→上とキーを押下
      const input = getComboboxInput();
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      // Assert - 最初のオプションがフォーカスされていることを検証
      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption).toHaveClass('bg-accent');
    });

    it('Enterキーで選択する', async () => {
      // Arrange - ユーザーイベントとコールバック付きComboboxをセットアップ
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox {...defaultProps} onValueChange={onValueChange} data-testid="test-combobox" />
      );

      // Act - 入力フィールドをクリックして開き、ArrowDown→Enterキーを押下
      const input = getComboboxInput();
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      // Assert - コールバックが正しく呼ばれることを検証
      expect(onValueChange).toHaveBeenCalledWith('option1');
    });
  });

  describe('検索機能', () => {
    it('検索値でオプションをフィルタリングする', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開き、検索文字列を入力
      const input = getComboboxInput();
      await user.click(input);
      await user.type(input, 'Option 1');

      // Assert - フィルタリングされた結果が表示されることを検証
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
    });

    it('検索結果がない場合、空のメッセージを表示', async () => {
      // Arrange - ユーザーイベントと空のメッセージ付きComboboxをセットアップ
      const user = userEvent.setup();
      render(
        <Combobox {...defaultProps} emptyMessage="見つかりません" data-testid="test-combobox" />
      );

      // Act - 入力フィールドをクリックして開き、存在しない文字列を入力
      const input = getComboboxInput();
      await user.click(input);
      await user.type(input, 'nonexistent');

      // Assert - 空のメッセージが表示されることを検証
      expect(screen.getByText('見つかりません')).toBeInTheDocument();
    });

    it('検索値の変更を親に通知する', async () => {
      // Arrange - ユーザーイベントとコールバック付きComboboxをセットアップ
      const user = userEvent.setup();
      const onInputChange = vi.fn();
      render(
        <Combobox {...defaultProps} onInputChange={onInputChange} data-testid="test-combobox" />
      );

      // Act - 入力フィールドをクリックして開き、文字列を入力
      const input = getComboboxInput();
      await user.click(input);
      await user.type(input, 'test');

      // Assert - コールバックが正しく呼ばれることを検証
      expect(onInputChange).toHaveBeenCalledWith('test');
    });
  });

  describe('クリア機能', () => {
    it('クリアボタンをクリックして選択をクリア', async () => {
      // Arrange - ユーザーイベントとクリア機能付きComboboxをセットアップ
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox
          {...defaultProps}
          value="option1"
          onValueChange={onValueChange}
          clearable
          data-testid="test-combobox"
        />
      );

      // Act - クリアボタンをクリック
      const clearButton = screen.getByLabelText('クリア');
      await user.click(clearButton);

      // Assert - コールバックが正しく呼ばれることを検証
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('clearableがfalseの場合、クリアボタンを表示しない', () => {
      // Arrange - クリア機能無効のComboboxをレンダリング
      render(
        <Combobox {...defaultProps} value="option1" clearable={false} data-testid="test-combobox" />
      );

      // Act - クリアボタンの存在確認
      const clearButton = screen.queryByLabelText('クリア');

      // Assert - クリアボタンが表示されないことを検証
      expect(clearButton).not.toBeInTheDocument();
    });

    it('selectedOptionが存在しない場合、クリアボタンを表示しない', () => {
      // Arrange - 選択値なしのクリア機能付きComboboxをレンダリング
      render(<Combobox {...defaultProps} clearable data-testid="test-combobox" />);

      // Act - クリアボタンの存在確認
      const clearButton = screen.queryByLabelText('クリア');

      // Assert - クリアボタンが表示されないことを検証
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中のメッセージを表示', async () => {
      // Arrange - ユーザーイベントとローディング状態のComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} loading data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開く
      const input = getComboboxInput();
      await user.click(input);

      // Assert - ローディングメッセージが表示されることを検証
      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIA属性を設定', () => {
      // Arrange - Comboboxをレンダリング
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - Combobox入力要素を取得
      const input = getComboboxInput();

      // Assert - 適切なARIA属性が設定されていることを検証
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });

    it('ドロップダウンが開いている時、適切な属性を設定', async () => {
      // Arrange - ユーザーイベントとComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開く
      const input = getComboboxInput();
      await user.click(input);

      // Assert - 開いている状態の適切な属性が設定されていることを検証
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('選択されたオプションにaria-selectedを設定', async () => {
      // Arrange - ユーザーイベントと選択値付きComboboxをセットアップ
      const user = userEvent.setup();
      render(<Combobox {...defaultProps} value="option1" data-testid="test-combobox" />);

      // Act - 入力フィールドをクリックして開く
      const input = getComboboxInput();
      await user.click(input);

      // Assert - 選択されたオプションに適切な属性が設定されていることを検証
      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });
});
