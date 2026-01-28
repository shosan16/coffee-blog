import { describe, expect, it } from 'vitest';

import { buildFilterDisplayItems, formatRangeDisplay } from './filterDisplay';

describe('filterDisplay', () => {
  describe('formatRangeDisplay', () => {
    it('min と max の両方がある場合、範囲形式で表示する', () => {
      // Arrange
      const label = '粉量';
      const range = { min: 10, max: 20 };
      const unit = 'g';

      // Act
      const result = formatRangeDisplay(label, range, unit);

      // Assert
      expect(result).toBe('粉量: 10-20g');
    });

    it('min のみの場合、min以上の形式で表示する', () => {
      // Arrange
      const label = '湯温';
      const range = { min: 90 };
      const unit = '℃';

      // Act
      const result = formatRangeDisplay(label, range, unit);

      // Assert
      expect(result).toBe('湯温: 90℃〜');
    });

    it('max のみの場合、max以下の形式で表示する', () => {
      // Arrange
      const label = '水量';
      const range = { max: 300 };
      const unit = 'ml';

      // Act
      const result = formatRangeDisplay(label, range, unit);

      // Assert
      expect(result).toBe('水量: 〜300ml');
    });

    it('min と max の両方がない場合、null を返す', () => {
      // Arrange
      const label = '粉量';
      const range = {};
      const unit = 'g';

      // Act
      const result = formatRangeDisplay(label, range, unit);

      // Assert
      expect(result).toBeNull();
    });

    it('undefined の場合、null を返す', () => {
      // Arrange
      const label = '粉量';
      const range = undefined;
      const unit = 'g';

      // Act
      const result = formatRangeDisplay(label, range, unit);

      // Assert
      expect(result).toBeNull();
    });
  });

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

    it('grindSize フィルターを日本語ラベルに変換する', () => {
      // Arrange
      const filters = { grindSize: ['FINE'] };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([
        { key: 'grindSize', label: '細挽き', itemValue: 'FINE', category: 'grindSize' },
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

    it('beanWeight 範囲フィルターを表示する', () => {
      // Arrange
      const filters = { beanWeight: { min: 10, max: 20 } };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([{ key: 'beanWeight', label: '粉量: 10-20g', category: 'range' }]);
    });

    it('waterTemp 範囲フィルターを表示する', () => {
      // Arrange
      const filters = { waterTemp: { min: 90, max: 95 } };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([{ key: 'waterTemp', label: '湯温: 90-95℃', category: 'range' }]);
    });

    it('waterAmount 範囲フィルターを表示する', () => {
      // Arrange
      const filters = { waterAmount: { min: 200 } };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toEqual([{ key: 'waterAmount', label: '水量: 200ml〜', category: 'range' }]);
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
        grindSize: ['MEDIUM'],
        beanWeight: { min: 15, max: 20 },
        search: 'コロンビア',
      };

      // Act
      const result = buildFilterDisplayItems(filters);

      // Assert
      expect(result).toHaveLength(4);
    });
  });
});
