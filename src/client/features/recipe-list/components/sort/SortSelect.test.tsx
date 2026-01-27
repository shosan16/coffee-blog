import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import SortSelect from '@/client/features/recipe-list/components/sort/SortSelect';

// Radix UI Select の jsdom 互換性問題を回避
beforeEach(() => {
  // hasPointerCapture のモック
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe('SortSelect', () => {
  describe('初期表示', () => {
    it('ソート選択トリガーが表示されること', () => {
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toBeInTheDocument();
    });

    it('currentSort/currentOrder が未指定の場合、デフォルトで新着順が表示されること', () => {
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toHaveTextContent('新着順');
    });

    it('currentSort/currentOrder が指定された場合、該当のラベルが表示されること', () => {
      const onSortChange = vi.fn();
      render(
        <SortSelect currentSort="viewCount" currentOrder="desc" onSortChange={onSortChange} />
      );

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toHaveTextContent('人気順');
    });

    it('焙煎度（浅煎り順）が表示されること', () => {
      const onSortChange = vi.fn();
      render(
        <SortSelect currentSort="roastLevel" currentOrder="asc" onSortChange={onSortChange} />
      );

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toHaveTextContent(
        '焙煎度（浅煎り順）'
      );
    });

    it('焙煎度（深煎り順）が表示されること', () => {
      const onSortChange = vi.fn();
      render(
        <SortSelect currentSort="roastLevel" currentOrder="desc" onSortChange={onSortChange} />
      );

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toHaveTextContent(
        '焙煎度（深煎り順）'
      );
    });
  });

  describe('ドロップダウン操作', () => {
    it('クリックでドロップダウンが開くこと', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      await user.click(screen.getByRole('combobox', { name: 'ソート順を選択' }));

      expect(screen.getByRole('option', { name: '新着順' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '人気順' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '焙煎度（浅煎り順）' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '焙煎度（深煎り順）' })).toBeInTheDocument();
    });

    it('オプション選択時に onSortChange が正しい引数で呼ばれること', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      await user.click(screen.getByRole('combobox', { name: 'ソート順を選択' }));
      await user.click(screen.getByRole('option', { name: '人気順' }));

      expect(onSortChange).toHaveBeenCalledWith('viewCount', 'desc');
    });

    it('焙煎度（浅煎り順）選択時に正しい引数で呼ばれること', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      await user.click(screen.getByRole('combobox', { name: 'ソート順を選択' }));
      await user.click(screen.getByRole('option', { name: '焙煎度（浅煎り順）' }));

      expect(onSortChange).toHaveBeenCalledWith('roastLevel', 'asc');
    });

    it('焙煎度（深煎り順）選択時に正しい引数で呼ばれること', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} />);

      await user.click(screen.getByRole('combobox', { name: 'ソート順を選択' }));
      await user.click(screen.getByRole('option', { name: '焙煎度（深煎り順）' }));

      expect(onSortChange).toHaveBeenCalledWith('roastLevel', 'desc');
    });
  });

  describe('disabled 状態', () => {
    it('disabled=true の場合、セレクトが無効化されること', () => {
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} disabled />);

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).toBeDisabled();
    });

    it('disabled=false の場合、セレクトが有効であること', () => {
      const onSortChange = vi.fn();
      render(<SortSelect onSortChange={onSortChange} disabled={false} />);

      expect(screen.getByRole('combobox', { name: 'ソート順を選択' })).not.toBeDisabled();
    });
  });
});
