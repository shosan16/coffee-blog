import { describe, expect, it } from 'vitest';

import { buildFilterDisplayItems } from './filterDisplay';

describe('filterDisplay', () => {
  describe('buildFilterDisplayItems', () => {
    it('空のフィルターの場合、空配列を返す', () => {
      // Arrange
      const filters = {};

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([]);
    });

    it('roastLevel フィルターを日本語ラベルに変換する', () => {
      // Arrange
      const filters = { roastLevel: ['LIGHT', 'MEDIUM'] };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'roastLevel', label: '浅煎り', itemValue: 'LIGHT', category: 'roastLevel' },
        { key: 'roastLevel', label: '中煎り', itemValue: 'MEDIUM', category: 'roastLevel' },
      ]);
    });

    it('equipment フィルターはそのまま表示する', () => {
      // Arrange
      const filters = { equipment: ['V60', 'Chemex'] };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'equipment', label: 'V60', itemValue: 'V60', category: 'equipment' },
        { key: 'equipment', label: 'Chemex', itemValue: 'Chemex', category: 'equipment' },
      ]);
    });

    it('tags フィルターはそのまま表示する', () => {
      // Arrange
      const filters = { tags: ['初心者向け'] };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'tags', label: '初心者向け', itemValue: '初心者向け', category: 'tags' },
      ]);
    });

    it('search フィルターを isSearch: true で表示する', () => {
      // Arrange
      const filters = { search: 'エチオピア' };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'search', label: '検索: "エチオピア"', isSearch: true, category: 'search' },
      ]);
    });

    it('page, limit, sort, order, equipmentType は除外する', () => {
      // Arrange
      const filters = {
        page: 2,
        limit: 10,
        sort: 'createdAt',
        order: 'desc' as const,
        equipmentType: ['dripper'],
        roastLevel: ['LIGHT'],
      };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'roastLevel', label: '浅煎り', itemValue: 'LIGHT', category: 'roastLevel' },
      ]);
    });

    it('複数のフィルターを組み合わせて表示する', () => {
      // Arrange
      const filters = {
        roastLevel: ['LIGHT'],
        equipment: ['V60'],
        search: 'コロンビア',
      };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toHaveLength(3);
    });
  });
});
