import { describe, expect, it } from 'vitest';

import {
  SORT_OPTIONS,
  DEFAULT_SORT,
  parseSortValue,
  buildSortValue,
} from '@/client/features/recipe-list/constants/sort';

describe('sort constants', () => {
  describe('SORT_OPTIONS', () => {
    it('4つのソートオプションが定義されていること', () => {
      expect(SORT_OPTIONS).toHaveLength(4);
    });

    it('新着順オプションが存在すること', () => {
      const option = SORT_OPTIONS.find((o) => o.value === 'publishedAt:desc');
      expect(option).toBeDefined();
      expect(option?.label).toBe('新着順');
    });

    it('人気順オプションが存在すること', () => {
      const option = SORT_OPTIONS.find((o) => o.value === 'viewCount:desc');
      expect(option).toBeDefined();
      expect(option?.label).toBe('人気順');
    });

    it('焙煎度（浅煎り順）オプションが存在すること', () => {
      const option = SORT_OPTIONS.find((o) => o.value === 'roastLevel:asc');
      expect(option).toBeDefined();
      expect(option?.label).toBe('焙煎度（浅煎り順）');
    });

    it('焙煎度（深煎り順）オプションが存在すること', () => {
      const option = SORT_OPTIONS.find((o) => o.value === 'roastLevel:desc');
      expect(option).toBeDefined();
      expect(option?.label).toBe('焙煎度（深煎り順）');
    });
  });

  describe('DEFAULT_SORT', () => {
    it('デフォルトが新着順であること', () => {
      expect(DEFAULT_SORT).toBe('publishedAt:desc');
    });
  });

  describe('parseSortValue', () => {
    it('publishedAt:desc をパースできること', () => {
      const result = parseSortValue('publishedAt:desc');
      expect(result).toEqual({ sort: 'publishedAt', order: 'desc' });
    });

    it('viewCount:desc をパースできること', () => {
      const result = parseSortValue('viewCount:desc');
      expect(result).toEqual({ sort: 'viewCount', order: 'desc' });
    });

    it('roastLevel:asc をパースできること', () => {
      const result = parseSortValue('roastLevel:asc');
      expect(result).toEqual({ sort: 'roastLevel', order: 'asc' });
    });

    it('roastLevel:desc をパースできること', () => {
      const result = parseSortValue('roastLevel:desc');
      expect(result).toEqual({ sort: 'roastLevel', order: 'desc' });
    });

    describe('異常系', () => {
      it('コロンを含まない文字列の場合、デフォルト値を返すこと', () => {
        const result = parseSortValue('invalid');
        expect(result).toEqual({ sort: 'publishedAt', order: 'desc' });
      });

      it('空文字列の場合、デフォルト値を返すこと', () => {
        const result = parseSortValue('');
        expect(result).toEqual({ sort: 'publishedAt', order: 'desc' });
      });

      it('複数のコロンを含む文字列の場合、デフォルト値を返すこと', () => {
        const result = parseSortValue('foo:bar:baz');
        expect(result).toEqual({ sort: 'publishedAt', order: 'desc' });
      });

      it('order 部分が asc/desc 以外の場合、desc を返すこと', () => {
        const result = parseSortValue('viewCount:invalid');
        expect(result).toEqual({ sort: 'viewCount', order: 'desc' });
      });
    });
  });

  describe('buildSortValue', () => {
    it('sort と order を結合できること', () => {
      const result = buildSortValue('publishedAt', 'desc');
      expect(result).toBe('publishedAt:desc');
    });

    it('roastLevel と asc を結合できること', () => {
      const result = buildSortValue('roastLevel', 'asc');
      expect(result).toBe('roastLevel:asc');
    });
  });

  describe('parseSortValue と buildSortValue の往復', () => {
    it.each(SORT_OPTIONS)('$value が往復変換で保持されること', ({ value }) => {
      const parsed = parseSortValue(value);
      const rebuilt = buildSortValue(parsed.sort, parsed.order);
      expect(rebuilt).toBe(value);
    });
  });
});
