import { RoastLevel } from '@prisma/client';
import { NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchRecipesController } from '@/server/features/recipes/search/controller';
import { SearchRecipesService } from '@/server/features/recipes/search/service';
import {
  createSearchRequest,
  createMockSearchResult,
} from '@/server/features/recipes/search/test-helpers';

// SearchRecipesServiceをモック化
vi.mock('@/server/features/recipes/search/service');

// NextResponseをモック化
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
}));

describe('SearchRecipesController', () => {
  let controller: SearchRecipesController;
  let mockService: {
    searchRecipes: ReturnType<typeof vi.fn>;
  };
  let mockNextResponse: {
    json: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Arrange - 準備：モックとコントローラーの初期化
    vi.clearAllMocks();

    mockService = {
      searchRecipes: vi.fn(),
    };

    // SearchRecipesServiceクラスをモック化
    vi.mocked(SearchRecipesService).mockImplementation(() => {
      return mockService as unknown as SearchRecipesService;
    });

    mockNextResponse = {
      json: vi.fn().mockReturnValue({ status: 200 }),
    };
    vi.mocked(NextResponse).json = mockNextResponse.json;

    controller = new SearchRecipesController();
  });

  describe('基本的な検索リクエスト処理', () => {
    it('ページネーション付きでレシピ一覧を正常に取得できる', async () => {
      // Arrange - 準備：検索リクエストとモックレスポンスを設定
      const request = createSearchRequest({ page: 1, limit: 10 });
      const mockResult = createMockSearchResult(10, 1, 50);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：正しいパラメータでサービスが呼び出され、レスポンスが返される
      expect(mockService.searchRecipes).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        })
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          recipes: mockResult.recipes,
          pagination: mockResult.pagination,
        },
        {
          status: 200,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
            'X-Total-Count': '50',
          }),
        }
      );
    });

    it('パラメータなしのリクエストでもデフォルト値で検索できる', async () => {
      // Arrange - 準備：パラメータなしのリクエストとモックレスポンスを設定
      const request = createSearchRequest();
      const mockResult = createMockSearchResult(1);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：サービスが呼び出され、レスポンスが返される
      expect(mockService.searchRecipes).toHaveBeenCalledTimes(1);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          recipes: mockResult.recipes,
          pagination: mockResult.pagination,
        },
        {
          status: 200,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
            'X-Total-Count': '1',
          }),
        }
      );
    });
  });

  describe('検索パラメータの解析', () => {
    it('基本的な検索パラメータを正しく解析できる', async () => {
      // Arrange - 準備：複数の検索パラメータを含むリクエストを作成
      const request = createSearchRequest({
        page: 2,
        limit: 5,
        search: 'コーヒー',
      });
      const mockResult = createMockSearchResult(5, 2, 25);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：パラメータが正しく解析されてサービスに渡される
      expect(mockService.searchRecipes).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 5,
          search: 'コーヒー',
        })
      );
    });

    it('配列形式のパラメータを正しく分割して解析できる', async () => {
      // Arrange - 準備：配列形式のパラメータを含むリクエストを作成
      const request = createSearchRequest({
        roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM],
        equipment: ['V60', 'Chemex'],
      });
      const mockResult = createMockSearchResult(3);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：配列パラメータが正しく分割されてサービスに渡される
      expect(mockService.searchRecipes).toHaveBeenCalledWith(
        expect.objectContaining({
          roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM],
          equipment: ['V60', 'Chemex'],
        })
      );
    });

    it('複数の器具フィルターを正しく解析できる', async () => {
      // Arrange - 準備：複数の器具パラメータを含むリクエストを作成
      const request = createSearchRequest({
        equipment: ['V60', 'Chemex'],
        equipmentType: ['ドリッパー'],
      });
      const mockResult = createMockSearchResult(2);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：器具パラメータが正しく解析されてサービスに渡される
      expect(mockService.searchRecipes).toHaveBeenCalledWith(
        expect.objectContaining({
          equipment: ['V60', 'Chemex'],
          equipmentType: ['ドリッパー'],
        })
      );
    });
  });

  describe('バリデーション処理', () => {
    it('有効なパラメータでバリデーションが成功する', async () => {
      // Arrange - 準備：有効なパラメータを含むリクエストを作成
      const request = createSearchRequest({
        page: 1,
        limit: 10,
        roastLevel: [RoastLevel.MEDIUM],
      });
      const mockResult = createMockSearchResult(5);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      const result = controller.handleSearchRecipes(request);

      // Assert - 確認：エラーが発生せず、サービスが呼び出される
      await expect(result).resolves.not.toThrow();
      expect(mockService.searchRecipes).toHaveBeenCalled();
    });

    it('無効なページ番号でバリデーションエラーが発生する', async () => {
      // Arrange - 準備：無効なページ番号を含むリクエストを作成
      const request = createSearchRequest({ page: -1, limit: 10 });

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：バリデーションエラーレスポンスが返され、サービスは呼び出されない
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'VALIDATION_ERROR',
          message: 'パラメータのバリデーションに失敗しました',
          request_id: expect.any(String),
          timestamp: expect.any(String),
          details: expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                field: 'page',
                message: expect.any(String),
              }),
            ]),
          }),
        }),
        {
          status: 400,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
          }),
        }
      );
      expect(mockService.searchRecipes).not.toHaveBeenCalled();
    });

    it('無効なlimit値でバリデーションエラーが発生する', async () => {
      // Arrange - 準備：無効なlimit値を含むリクエストを作成
      const request = createSearchRequest({ page: 1, limit: 0 });

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：バリデーションエラーレスポンスが返され、サービスは呼び出されない
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'VALIDATION_ERROR',
          message: 'パラメータのバリデーションに失敗しました',
          request_id: expect.any(String),
          timestamp: expect.any(String),
          details: expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                field: 'limit',
                message: expect.any(String),
              }),
            ]),
          }),
        }),
        {
          status: 400,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
          }),
        }
      );
      expect(mockService.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('エラーハンドリング', () => {
    it('サービスエラー発生時に内部サーバーエラーを返す', async () => {
      // Arrange - 準備：サービスエラーを発生させる設定
      const request = createSearchRequest({ page: 1, limit: 10 });
      const serviceError = new Error('Database connection failed');
      mockService.searchRecipes.mockRejectedValue(serviceError);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：内部サーバーエラーレスポンスが返され、エラーがログ出力される
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'サーバー内部でエラーが発生しました',
          request_id: expect.any(String),
          timestamp: expect.any(String),
        }),
        {
          status: 500,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
          }),
        }
      );
    });

    it('エラー発生時でも必ずレスポンスが返される', async () => {
      // Arrange - 準備：予期せぬエラーを発生させる設定
      const request = createSearchRequest({ page: 1, limit: 10 });
      mockService.searchRecipes.mockRejectedValue(new Error('Unexpected error'));

      // Act - 実行：検索リクエストを処理
      const result = await controller.handleSearchRecipes(request);

      // Assert - 確認：レスポンスが必ず返される
      expect(result).toBeDefined();
      expect(mockNextResponse.json).toHaveBeenCalled();
    });
  });

  describe('レスポンス形式の検証', () => {
    it('成功時のレスポンス形式が正しい', async () => {
      // Arrange - 準備：正常なリクエストとモックレスポンスを設定
      const request = createSearchRequest({ page: 1, limit: 10 });
      const mockResult = createMockSearchResult(5, 1, 20);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：レスポンス形式が期待通りである
      const responseData = mockNextResponse.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('recipes');
      expect(responseData).toHaveProperty('pagination');
      expect(Array.isArray(responseData.recipes)).toBe(true);
      expect(typeof responseData.pagination).toBe('object');
      expect(responseData.pagination).toHaveProperty('currentPage');
      expect(responseData.pagination).toHaveProperty('totalPages');
      expect(responseData.pagination).toHaveProperty('totalItems');
      expect(responseData.pagination).toHaveProperty('itemsPerPage');
    });
  });

  describe('複雑な検索シナリオ', () => {
    it('全ての検索パラメータを組み合わせた検索が正常に動作する', async () => {
      // Arrange - 準備：全パラメータを含む複雑なリクエストを作成
      const request = createSearchRequest({
        page: 2,
        limit: 5,
        roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM],
        equipment: ['V60', 'Chemex'],
        search: 'ハンドドリップ',
        sort: 'title',
        order: 'asc',
      });
      const mockResult = createMockSearchResult(5, 2, 15);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act - 実行：検索リクエストを処理
      await controller.handleSearchRecipes(request);

      // Assert - 確認：全パラメータが正しく処理されてサービスに渡される
      expect(mockService.searchRecipes).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 5,
          roastLevel: [RoastLevel.LIGHT, RoastLevel.MEDIUM],
          equipment: ['V60', 'Chemex'],
          search: 'ハンドドリップ',
          sort: 'title',
          order: 'asc',
        })
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          recipes: mockResult.recipes,
          pagination: mockResult.pagination,
        },
        {
          status: 200,
          headers: expect.objectContaining({
            'X-Request-ID': expect.any(String),
            'X-Total-Count': '15',
          }),
        }
      );
    });

    it('異なる検索パターンでも一貫した処理が行われる', async () => {
      // Arrange - 準備：複数の異なる検索パターンを用意
      const testCases = [
        createSearchRequest(),
        createSearchRequest({ page: 1 }),
        createSearchRequest({ page: 1, limit: 20 }),
        createSearchRequest({ search: 'エスプレッソ' }),
        createSearchRequest({ roastLevel: [RoastLevel.DARK] }),
      ];
      const mockResult = createMockSearchResult(3);
      mockService.searchRecipes.mockResolvedValue(mockResult);

      // Act & Assert - 実行と確認：各パターンで一貫した処理が行われる
      for (const request of testCases) {
        vi.clearAllMocks();
        await controller.handleSearchRecipes(request);

        expect(mockService.searchRecipes).toHaveBeenCalledTimes(1);
        expect(mockNextResponse.json).toHaveBeenCalledTimes(1);
      }
    });
  });
});
