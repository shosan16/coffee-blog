import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

import { GET } from './route';

// Controller をモック
vi.mock('@/server/features/recipe/detail/controller', () => ({
  handleGetRecipeDetail: vi.fn(),
}));

const { handleGetRecipeDetail } = await import('@/server/features/recipe/detail/controller');

describe('GET /api/recipes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常ケース', () => {
    it('レシピ詳細取得リクエストをコントローラーに委譲すること', async () => {
      // Arrange - 準備：モックレスポンスを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/1');
      const mockParams = { id: '1' };

      const mockResponse = NextResponse.json(
        {
          id: '1',
          title: 'エチオピア イルガチェフェ V60',
          roastLevel: 'LIGHT_MEDIUM' as const,
          viewCount: 151,
          isPublished: true,
          createdAt: '2025-06-20T10:30:00.000Z',
          updatedAt: '2025-06-22T10:30:00.000Z',
          barista: undefined,
          steps: [],
          equipment: [],
          tags: [],
        },
        {
          status: 200,
          headers: {
            'X-Request-ID': 'req_abc123xyz789',
            'X-View-Count': '151',
          },
        }
      );

      vi.mocked(handleGetRecipeDetail).mockResolvedValue(mockResponse);

      // Act - 実行：API Routeを呼び出し
      const response = await GET(mockRequest, { params: Promise.resolve(mockParams) });

      // Assert - 確認：コントローラーが正しく呼ばれ、レスポンスが返されることを検証
      expect(handleGetRecipeDetail).toHaveBeenCalledWith(mockRequest, mockParams);
      expect(response).toBe(mockResponse);
      expect(response.status).toBe(200);
    });
  });

  describe('異常ケース', () => {
    it('コントローラーがエラーレスポンスを返した場合、そのまま返すこと', async () => {
      // Arrange - 準備：エラーレスポンスのモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/invalid');
      const mockParams = { id: 'invalid' };

      const mockErrorResponse = NextResponse.json(
        {
          error: 'INVALID_PARAMETER',
          message: 'Invalid recipe ID',
          request_id: 'req_abc123xyz789',
          timestamp: '2025-06-22T10:30:00Z',
        },
        {
          status: 400,
          headers: {
            'X-Request-ID': 'req_abc123xyz789',
          },
        }
      );

      vi.mocked(handleGetRecipeDetail).mockResolvedValue(mockErrorResponse);

      // Act - 実行：API Routeを呼び出し
      const response = await GET(mockRequest, { params: Promise.resolve(mockParams) });

      // Assert - 確認：エラーレスポンスがそのまま返されることを検証
      expect(handleGetRecipeDetail).toHaveBeenCalledWith(mockRequest, mockParams);
      expect(response).toBe(mockErrorResponse);
      expect(response.status).toBe(400);
    });

    it('コントローラーが例外を投げた場合、500エラーが返されること', async () => {
      // Arrange - 準備：コントローラーで例外が発生するモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/1');
      const mockParams = { id: '1' };

      const unexpectedError = new Error('Unexpected controller error');
      vi.mocked(handleGetRecipeDetail).mockRejectedValue(unexpectedError);

      // Act - 実行：API Routeを呼び出し
      const response = await GET(mockRequest, { params: Promise.resolve(mockParams) });

      // Assert - 確認：500エラーレスポンスが返されることを検証
      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toMatchObject({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'サーバー内部でエラーが発生しました',
      });
      expect(responseData.request_id).toBeTruthy(); // リクエストIDが存在することを確認
      expect(responseData.timestamp).toBeTruthy(); // タイムスタンプが存在することを確認
    });
  });
});
