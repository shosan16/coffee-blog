import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SearchBox from './SearchBox';

describe('SearchBox', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('基本レンダリング', () => {
    it('デフォルトプレースホルダーでレンダリングされる', () => {
      render(<SearchBox {...defaultProps} />);

      expect(screen.getByPlaceholderText('レシピを検索...')).toBeInTheDocument();
    });

    it('カスタムプレースホルダーでレンダリングされる', () => {
      render(<SearchBox {...defaultProps} placeholder="カスタム検索" />);

      expect(screen.getByPlaceholderText('カスタム検索')).toBeInTheDocument();
    });

    it('検索アイコンが表示される', () => {
      render(<SearchBox {...defaultProps} />);

      // SVGアイコンが表示されているかを確認
      const searchIcon = document.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('入力値の制御', () => {
    it('valueプロパティの値が表示される', () => {
      render(<SearchBox {...defaultProps} value="コーヒー" />);

      const input = screen.getByDisplayValue('コーヒー');
      expect(input).toBeInTheDocument();
    });

    it('入力時にonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<SearchBox {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'エスプレッソ' } });

      expect(onChange).toHaveBeenCalledWith('エスプレッソ');
    });
  });

  describe('クリア機能', () => {
    it('値があるときクリアボタンが表示される', () => {
      render(<SearchBox {...defaultProps} value="テスト" clearable />);

      const clearButton = screen.getByLabelText('検索をクリア');
      expect(clearButton).toBeInTheDocument();
    });

    it('値がないときクリアボタンが表示されない', () => {
      render(<SearchBox {...defaultProps} value="" clearable />);

      const clearButton = screen.queryByLabelText('検索をクリア');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('clearable=falseのときクリアボタンが表示されない', () => {
      render(<SearchBox {...defaultProps} value="テスト" clearable={false} />);

      const clearButton = screen.queryByLabelText('検索をクリア');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('クリアボタンクリック時にonChangeが空文字で呼ばれる', () => {
      const onChange = vi.fn();
      render(<SearchBox {...defaultProps} value="テスト" onChange={onChange} clearable />);

      const clearButton = screen.getByLabelText('検索をクリア');
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('Escapeキー押下時にクリアされる', () => {
      const onChange = vi.fn();
      render(<SearchBox {...defaultProps} value="テスト" onChange={onChange} clearable />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('clearable=falseのときEscapeキーでクリアされない', () => {
      const onChange = vi.fn();
      render(<SearchBox {...defaultProps} value="テスト" onChange={onChange} clearable={false} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('無効状態', () => {
    it('disabled=trueのとき入力フィールドが無効になる', () => {
      render(<SearchBox {...defaultProps} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('無効状態のときクリアボタンが表示されない', () => {
      render(<SearchBox {...defaultProps} value="テスト" disabled clearable />);

      const clearButton = screen.queryByLabelText('検索をクリア');
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-labelが設定される', () => {
      render(<SearchBox {...defaultProps} aria-label="レシピ検索" />);

      const input = screen.getByLabelText('レシピ検索');
      expect(input).toBeInTheDocument();
    });

    it('aria-labelが未設定のときプレースホルダーがaria-labelになる', () => {
      render(<SearchBox {...defaultProps} placeholder="カスタム検索" />);

      const input = screen.getByLabelText('カスタム検索');
      expect(input).toBeInTheDocument();
    });
  });

  describe('CSS クラス', () => {
    it('カスタムクラス名が適用される', () => {
      render(<SearchBox {...defaultProps} className="custom-class" />);

      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    it('エラー状態のスタイルが適用される', () => {
      render(<SearchBox {...defaultProps} error />);

      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveClass('border-destructive');
    });
  });
});
