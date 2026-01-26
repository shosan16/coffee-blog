import type { RoastLevel } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import type { RecipeFilters } from '@/client/features/recipe-list/types/api';

import {
  buildNavigationUrl,
  countActiveFilters,
  hasValidValue,
  removeItemFromArrayFilter,
  updateFilterValue,
} from './filterHelpers';

describe('filterHelpers', () => {
  describe('hasValidValue', () => {
    it('null を無効と判定する', () => {
      expect(hasValidValue(null)).toBe(false);
    });

    it('undefined を無効と判定する', () => {
      expect(hasValidValue(undefined)).toBe(false);
    });

    it('空の配列を無効と判定する', () => {
      expect(hasValidValue([])).toBe(false);
    });

    it('要素を持つ配列を有効と判定する', () => {
      expect(hasValidValue(['item1', 'item2'])).toBe(true);
    });

    it('min/max が両方 undefined の範囲オブジェクトを無効と判定する', () => {
      expect(hasValidValue({ min: undefined, max: undefined })).toBe(false);
    });

    it('min のみ定義された範囲オブジェクトを有効と判定する', () => {
      expect(hasValidValue({ min: 1, max: undefined })).toBe(true);
    });

    it('max のみ定義された範囲オブジェクトを有効と判定する', () => {
      expect(hasValidValue({ min: undefined, max: 10 })).toBe(true);
    });

    it('min/max 両方定義された範囲オブジェクトを有効と判定する', () => {
      expect(hasValidValue({ min: 1, max: 10 })).toBe(true);
    });

    it('文字列を有効と判定する', () => {
      expect(hasValidValue('test')).toBe(true);
    });

    it('空文字列を有効と判定する', () => {
      expect(hasValidValue('')).toBe(true);
    });

    it('数値を有効と判定する', () => {
      expect(hasValidValue(0)).toBe(true);
      expect(hasValidValue(42)).toBe(true);
    });

    it('真偽値を有効と判定する', () => {
      expect(hasValidValue(true)).toBe(true);
      expect(hasValidValue(false)).toBe(true);
    });
  });

  describe('countActiveFilters', () => {
    it('空のフィルターオブジェクトで 0 を返す', () => {
      const filters: RecipeFilters = {};
      expect(countActiveFilters(filters)).toBe(0);
    });

    it('ページネーション・ソート関連のキーを除外してカウントする', () => {
      const filters: RecipeFilters = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      };
      expect(countActiveFilters(filters)).toBe(0);
    });

    it('有効なフィルターをカウントする', () => {
      const filters: RecipeFilters = {
        search: 'coffee',
        roastLevel: ['LIGHT', 'MEDIUM'],
        tags: ['ethiopia'],
      };
      expect(countActiveFilters(filters)).toBe(3);
    });

    it('無効なフィルター値を除外してカウントする', () => {
      const filters: RecipeFilters = {
        search: 'coffee',
        roastLevel: [],
        tags: ['ethiopia'],
      };
      expect(countActiveFilters(filters)).toBe(2);
    });

    it('ページネーションと有効なフィルターが混在している場合', () => {
      const filters: RecipeFilters = {
        page: 2,
        limit: 20,
        sort: 'title',
        order: 'asc',
        search: 'espresso',
        roastLevel: ['DARK'],
      };
      expect(countActiveFilters(filters)).toBe(2);
    });
  });

  describe('removeItemFromArrayFilter', () => {
    it('配列から指定要素を削除する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT', 'MEDIUM', 'DARK'] };
      const result = removeItemFromArrayFilter(filters, 'roastLevel', 'MEDIUM');
      expect(result.roastLevel).toEqual(['LIGHT', 'DARK']);
    });

    it('配列が空になったらキーを削除する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const result = removeItemFromArrayFilter(filters, 'roastLevel', 'LIGHT');
      expect(result).not.toHaveProperty('roastLevel');
    });

    it('itemToRemove が undefined の場合はキー全体を削除する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT', 'MEDIUM'] };
      const result = removeItemFromArrayFilter(filters, 'roastLevel');
      expect(result).not.toHaveProperty('roastLevel');
    });

    it('pageを1にリセットする', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT', 'MEDIUM'], page: 3 };
      const result = removeItemFromArrayFilter(filters, 'roastLevel', 'MEDIUM');
      expect(result.page).toBe(1);
    });

    it('元のフィルターを変更しない（イミュータブル）', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT', 'MEDIUM'] };
      removeItemFromArrayFilter(filters, 'roastLevel', 'MEDIUM');
      expect(filters.roastLevel).toEqual(['LIGHT', 'MEDIUM']);
    });

    it('存在しない要素を削除しようとしても配列は変わらない', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT', 'MEDIUM'] };
      const result = removeItemFromArrayFilter(filters, 'roastLevel', 'DARK');
      expect(result.roastLevel).toEqual(['LIGHT', 'MEDIUM']);
    });
  });

  describe('updateFilterValue', () => {
    it('有効な値でフィルターを更新する', () => {
      const filters: RecipeFilters = {};
      const result = updateFilterValue(filters, 'roastLevel', ['LIGHT']);
      expect(result.roastLevel).toEqual(['LIGHT']);
    });

    it('無効な値（空配列）でキーを削除する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const result = updateFilterValue(filters, 'roastLevel', []);
      expect(result).not.toHaveProperty('roastLevel');
    });

    it('無効な値（null）でキーを削除する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const result = updateFilterValue(filters, 'roastLevel', null as unknown as RoastLevel[]);
      expect(result).not.toHaveProperty('roastLevel');
    });

    it('page以外の変更時はpageを1にリセットする', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'], page: 3 };
      const result = updateFilterValue(filters, 'roastLevel', ['MEDIUM']);
      expect(result.page).toBe(1);
    });

    it('pageの変更時はpageをリセットしない', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'], page: 1 };
      const result = updateFilterValue(filters, 'page', 5);
      expect(result.page).toBe(5);
    });

    it('元のフィルターを変更しない（イミュータブル）', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      updateFilterValue(filters, 'roastLevel', ['MEDIUM']);
      expect(filters.roastLevel).toEqual(['LIGHT']);
    });

    it('検索値を設定できる', () => {
      const filters: RecipeFilters = {};
      const result = updateFilterValue(filters, 'search', 'coffee');
      expect(result.search).toBe('coffee');
    });
  });

  describe('buildNavigationUrl', () => {
    it('フィルターと検索値からURLを構築する', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const url = buildNavigationUrl(filters, 'ethiopian');
      expect(url).toContain('roastLevel=LIGHT');
      expect(url).toContain('search=ethiopian');
      expect(url).toContain('page=1');
    });

    it('検索値が空の場合はsearchを含めない', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const url = buildNavigationUrl(filters, '');
      expect(url).not.toContain('search=');
    });

    it('検索値が空白のみの場合はsearchを含めない', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'] };
      const url = buildNavigationUrl(filters, '   ');
      expect(url).not.toContain('search=');
    });

    it('フィルターが空の場合でもpageは付与される', () => {
      const filters: RecipeFilters = {};
      const url = buildNavigationUrl(filters, '');
      expect(url).toBe('?page=1');
    });

    it('pageは常に1を設定する（既存のpageは無視される）', () => {
      const filters: RecipeFilters = { roastLevel: ['LIGHT'], page: 5 };
      const url = buildNavigationUrl(filters, '');
      expect(url).toContain('page=1');
      expect(url).not.toContain('page=5');
    });

    it('検索値の前後の空白はトリミングする', () => {
      const filters: RecipeFilters = {};
      const url = buildNavigationUrl(filters, '  coffee  ');
      expect(url).toContain('search=coffee');
    });
  });
});
