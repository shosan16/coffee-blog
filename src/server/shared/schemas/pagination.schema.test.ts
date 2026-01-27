/**
 * ページネーションスキーマのテスト
 */

import { describe, it, expect } from 'vitest';

import { PaginationSchema, type Pagination } from './pagination.schema';

describe('PaginationSchema', () => {
  describe('有効なページネーション情報のパース', () => {
    it('正常なページネーション情報がパースできること', () => {
      // Arrange - 有効なページネーション情報を準備
      const validPagination = {
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(validPagination);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPagination);
      }
    });

    it('totalPagesとtotalItemsが0でもパースできること', () => {
      // Arrange - 結果が0件の場合のページネーション情報
      const emptyResultPagination = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(emptyResultPagination);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
    });
  });

  describe('無効なページネーション情報の拒否', () => {
    it('currentPageが0の場合、パースに失敗すること', () => {
      // Arrange - currentPageが0のページネーション情報
      const invalidPagination = {
        currentPage: 0,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(invalidPagination);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('currentPageが負の数の場合、パースに失敗すること', () => {
      // Arrange - currentPageが負の数のページネーション情報
      const invalidPagination = {
        currentPage: -1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(invalidPagination);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('itemsPerPageが0の場合、パースに失敗すること', () => {
      // Arrange - itemsPerPageが0のページネーション情報
      const invalidPagination = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(invalidPagination);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('小数値の場合、パースに失敗すること', () => {
      // Arrange - 小数値を含むページネーション情報
      const invalidPagination = {
        currentPage: 1.5,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(invalidPagination);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('未知のプロパティが含まれる場合、パースに失敗すること', () => {
      // Arrange - 未知のプロパティを含むページネーション情報
      const paginationWithUnknownProps = {
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
        unknownProp: 'should fail',
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(paginationWithUnknownProps);

      // Assert - パース失敗を検証（strict()による）
      expect(result.success).toBe(false);
    });

    it('必須フィールドが欠落している場合、パースに失敗すること', () => {
      // Arrange - currentPageが欠落したページネーション情報
      const incompletePagination = {
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Act - スキーマでパース
      const result = PaginationSchema.safeParse(incompletePagination);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });
  });

  describe('型推論', () => {
    it('Pagination型が正しく推論されること', () => {
      // Arrange - Pagination型の値を作成
      const pagination: Pagination = {
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      };

      // Assert - 各フィールドがnumber型であることを確認（コンパイル時チェック）
      expect(typeof pagination.currentPage).toBe('number');
      expect(typeof pagination.totalPages).toBe('number');
      expect(typeof pagination.totalItems).toBe('number');
      expect(typeof pagination.itemsPerPage).toBe('number');
    });
  });
});
