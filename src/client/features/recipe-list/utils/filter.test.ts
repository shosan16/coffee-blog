import { RoastLevel } from '@prisma/client';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { describe, it, expect } from 'vitest';

import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';

// URLSearchParams モックヘルパー
const createSearchParams = (params: Record<string, string>): ReadonlyURLSearchParams => {
  const urlSearchParams = new URLSearchParams(params);
  return urlSearchParams as ReadonlyURLSearchParams;
};

describe('parseFiltersFromSearchParams', () => {
  describe('正常系: パラメータが正しく解析される場合', () => {
    it('全パラメータが設定されている場合、すべて正しく解析される', () => {
      // Arrange - 準備：全種類のパラメータを含むSearchParamsを作成
      const searchParams = createSearchParams({
        page: '2',
        limit: '20',
        search: 'coffee recipe',
        sort: 'createdAt',
        order: 'desc',
        roastLevel: 'LIGHT,MEDIUM',
        equipment: 'HARIO V60,CHEMEX',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：全パラメータが期待通り解析されることを検証
      expect(result).toEqual({
        page: 2,
        limit: 20,
        search: 'coffee recipe',
        sort: 'createdAt',
        order: 'desc',
        roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM],
        equipment: ['HARIO V60', 'CHEMEX'],
      });
    });

    it('数値パラメータが正しく解析される', () => {
      // Arrange - 準備：数値パラメータのみを含むSearchParamsを作成
      const searchParams = createSearchParams({
        page: '1',
        limit: '10',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：数値が正しく解析されることを検証
      expect(result).toEqual({
        page: 1,
        limit: 10,
      });
    });

    it('文字列パラメータが正しく解析される', () => {
      // Arrange - 準備：文字列パラメータのみを含むSearchParamsを作成
      const searchParams = createSearchParams({
        search: 'filter coffee',
        sort: 'updatedAt',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：文字列が正しく解析されることを検証
      expect(result).toEqual({
        search: 'filter coffee',
        sort: 'updatedAt',
      });
    });

    it('列挙型パラメータが正しく解析される', () => {
      // Arrange - 準備：有効な列挙型パラメータを含むSearchParamsを作成
      const searchParams = createSearchParams({
        order: 'asc',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：列挙型が正しく解析されることを検証
      expect(result).toEqual({
        order: 'asc',
      });
    });

    it('配列パラメータが正しく解析される', () => {
      // Arrange - 準備：配列パラメータを含むSearchParamsを作成
      const searchParams = createSearchParams({
        roastLevel: 'LIGHT,MEDIUM,DARK',
        equipment: 'HARIO V60,CHEMEX,Kalita Wave',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：配列が正しく解析されることを検証
      expect(result).toEqual({
        roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM, RoastLevel.DARK],
        equipment: ['HARIO V60', 'CHEMEX', 'Kalita Wave'],
      });
    });

    it('すべてのRoastLevel列挙値が正しく解析される', () => {
      // Arrange - 準備：すべてのRoastLevel値を含むSearchParamsを作成
      const searchParams = createSearchParams({
        roastLevel: 'LIGHT,LIGHT_MEDIUM,MEDIUM,MEDIUM_DARK,DARK,FRENCH',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：すべてのRoastLevel値が正しく解析されることを検証
      expect(result).toEqual({
        roastLevel: [
          RoastLevel.LIGHT,
          RoastLevel.LIGHT_MEDIUM,
          RoastLevel.MEDIUM,
          RoastLevel.MEDIUM_DARK,
          RoastLevel.DARK,
          RoastLevel.FRENCH,
        ],
      });
    });
  });

  describe('異常系: 不正な値の処理', () => {
    it('不正な数値パラメータは無視される', () => {
      // Arrange - 準備：不正な数値を含むSearchParamsを作成
      const searchParams = createSearchParams({
        page: 'invalid',
        limit: 'abc',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：不正な数値は無視されることを検証
      expect(result).toEqual({});
    });

    it('不正な列挙型パラメータは無視される', () => {
      // Arrange - 準備：不正な列挙型値を含むSearchParamsを作成
      const searchParams = createSearchParams({
        order: 'invalid_order',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：不正な列挙型は無視されることを検証
      expect(result).toEqual({});
    });

    it('空文字列のパラメータは無視される', () => {
      // Arrange - 準備：空文字列を含むSearchParamsを作成
      const searchParams = createSearchParams({
        search: '',
        sort: '',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：空文字列は無視されることを検証
      expect(result).toEqual({});
    });

    it('パラメータが存在しない場合は空オブジェクトを返す', () => {
      // Arrange - 準備：空のSearchParamsを作成
      const searchParams = createSearchParams({});

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：空オブジェクトが返されることを検証
      expect(result).toEqual({});
    });

    it('不正なRoastLevel値を含む配列もそのまま解析される（型アサーションのため）', () => {
      // Arrange - 準備：有効・無効なRoastLevel値が混在するSearchParamsを作成
      const searchParams = createSearchParams({
        roastLevel: 'LIGHT,INVALID_ROAST,MEDIUM,UNKNOWN',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：すべての値が配列として解析されることを検証（型アサーションのため）
      expect(result).toEqual({
        roastLevel: ['LIGHT', 'INVALID_ROAST', 'MEDIUM', 'UNKNOWN'],
      });
    });
  });

  describe('境界値テスト', () => {
    it('数値の最小値・最大値が正しく処理される', () => {
      // Arrange - 準備：数値の境界値を含むSearchParamsを作成
      const searchParams = createSearchParams({
        page: '0',
        limit: '999999',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：境界値が正しく処理されることを検証
      expect(result).toEqual({
        page: 0,
        limit: 999999,
      });
    });

    it('負の数値が正しく処理される', () => {
      // Arrange - 準備：負の数値を含むSearchParamsを作成
      const searchParams = createSearchParams({
        page: '-1',
        limit: '-10',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：負の数値が正しく処理されることを検証
      expect(result).toEqual({
        page: -1,
        limit: -10,
      });
    });

    it('単一要素の配列が正しく処理される', () => {
      // Arrange - 準備：単一要素の配列パラメータを含むSearchParamsを作成
      const searchParams = createSearchParams({
        roastLevel: 'LIGHT',
        equipment: 'HARIO V60',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：単一要素配列が正しく処理されることを検証
      expect(result).toEqual({
        roastLevel: [RoastLevel.LIGHT],
        equipment: ['HARIO V60'],
      });
    });

    it('空の配列パラメータは無視される', () => {
      // Arrange - 準備：空の配列を表すSearchParamsを作成
      const searchParams = createSearchParams({
        roastLevel: '',
        equipment: '',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：空配列は無視されることを検証
      expect(result).toEqual({});
    });

    it('特殊文字を含む文字列パラメータが正しく処理される', () => {
      // Arrange - 準備：特殊文字を含む文字列パラメータを含むSearchParamsを作成
      const searchParams = createSearchParams({
        search: 'コーヒー レシピ & フィルター',
        sort: 'created_at',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：特殊文字を含む文字列が正しく処理されることを検証
      expect(result).toEqual({
        search: 'コーヒー レシピ & フィルター',
        sort: 'created_at',
      });
    });

    it('カンマを含む機器名が正しく配列として解析される', () => {
      // Arrange - 準備：カンマを含む機器名を含むSearchParamsを作成
      const searchParams = createSearchParams({
        equipment: 'HARIO V60,CHEMEX 6-cup,Kalita Wave 185',
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：カンマを含む機器名が正しく配列として解析されることを検証
      expect(result).toEqual({
        equipment: ['HARIO V60', 'CHEMEX 6-cup', 'Kalita Wave 185'],
      });
    });
  });

  describe('混合パターンテスト', () => {
    it('有効・無効なパラメータが混在する場合、有効なもののみ解析される', () => {
      // Arrange - 準備：有効・無効なパラメータが混在するSearchParamsを作成
      const searchParams = createSearchParams({
        page: '2', // 有効
        limit: 'invalid', // 無効
        search: 'coffee', // 有効
        sort: '', // 無効（空文字列）
        order: 'asc', // 有効
        roastLevel: 'LIGHT,INVALID,MEDIUM', // 型アサーションのためすべて含まれる
      });

      // Act - 実行：フィルター条件を解析
      const result = parseFiltersFromSearchParams(searchParams);

      // Assert - 確認：有効なパラメータのみが解析されることを検証
      expect(result).toEqual({
        page: 2,
        search: 'coffee',
        order: 'asc',
        roastLevel: ['LIGHT', 'INVALID', 'MEDIUM'],
      });
    });
  });
});
