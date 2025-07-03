import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { handleGetRecipeDetail } from './controller';
import { RecipeDetailError } from './types';

// 依存関係をモック
vi.mock('./validation', () => ({
  validateRecipeId: vi.fn(),
}));

vi.mock('./service', () => ({
  getRecipeDetail: vi.fn(),
}));

vi.mock('@/server/shared/request-id', () => ({
  RequestId: {
    fromRequest: vi.fn(),
    addToHeaders: vi.fn(),
  },
}));

vi.mock('@/server/shared/logger', () => ({
  createRequestLogger: vi.fn(),
}));

const { validateRecipeId } = await import('./validation');
const { getRecipeDetail } = await import('./service');
const { RequestId } = await import('@/server/shared/request-id');
const { createRequestLogger } = await import('@/server/shared/logger');

describe('handleGetRecipeDetail', () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(RequestId.fromRequest).mockReturnValue('req_abc123xyz789');
    vi.mocked(RequestId.addToHeaders).mockImplementation((headers) => ({
      'X-Request-ID': 'req_abc123xyz789',
      ...headers,
    }));
    vi.mocked(createRequestLogger).mockReturnValue(mockLogger);
  });

  describe('正常ケース', () => {
    it('有効なレシピIDでレシピ詳細を正常に取得できること', async () => {
      // Arrange - 準備：正常なレシピ詳細取得のモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/1');
      const mockParams = { id: '1' };

      const mockRecipeDetail = {
        id: '1',
        title: 'エチオピア イルガチェフェ V60',
        summary: 'フルーティーで華やかな酸味が特徴',
        remarks: '特に蒸らし時間に注意',
        roastLevel: 'LIGHT_MEDIUM' as const,
        grindSize: 'MEDIUM_FINE' as const,
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
        brewingTime: 180,
        viewCount: 150,
        isPublished: true,
        publishedAt: '2025-06-20T10:30:00.000Z',
        createdAt: '2025-06-20T10:30:00.000Z',
        updatedAt: '2025-06-22T10:30:00.000Z',
        barista: {
          id: '1',
          name: '佐藤花子',
          affiliation: 'Specialty Coffee Shop ARIA',
          socialLinks: [
            {
              id: '1',
              platform: 'Instagram',
              url: 'https://instagram.com/hanako_barista',
            },
          ],
        },
        steps: [
          {
            id: '1',
            stepOrder: 1,
            timeSeconds: 30,
            description: 'お湯を沸かし、92℃まで冷ます',
          },
        ],
        equipment: [
          {
            id: '1',
            name: 'V60ドリッパー',
            brand: 'HARIO',
            description: '円錐形で一つ穴のドリッパー',
            affiliateLink: 'https://example.com/affiliate/hario-v60',
            equipmentType: {
              id: '1',
              name: 'ドリッパー',
              description: 'コーヒーを抽出するための器具',
            },
          },
        ],
        tags: [
          {
            id: '1',
            name: 'エチオピア',
            slug: 'ethiopia',
          },
        ],
      };

      const mockResult = {
        recipe: mockRecipeDetail,
        newViewCount: 151,
      };

      vi.mocked(validateRecipeId).mockReturnValue(1);
      vi.mocked(getRecipeDetail).mockResolvedValue(mockResult);

      // Act - 実行：レシピ詳細取得コントローラを実行
      const response = await handleGetRecipeDetail(mockRequest, mockParams);

      // Assert - 確認：正常なレスポンスが返されることを検証
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual(mockRecipeDetail);

      // ヘッダーが正しく設定されることを確認
      expect(response.headers.get('X-Request-ID')).toBe('req_abc123xyz789');
      expect(response.headers.get('X-View-Count')).toBe('151');

      // 依存関数が正しく呼ばれることを確認
      expect(validateRecipeId).toHaveBeenCalledWith('1');
      expect(getRecipeDetail).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });
  });

  describe('異常ケース', () => {
    it('無効なレシピIDの場合、400エラーを返すこと', async () => {
      // Arrange - 準備：無効なレシピIDのバリデーションエラーモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/invalid');
      const mockParams = { id: 'invalid' };

      const validationError = new RecipeDetailError('Invalid recipe ID', 'INVALID_ID', 400);

      vi.mocked(validateRecipeId).mockImplementation(() => {
        throw validationError;
      });

      // Act - 実行：レシピ詳細取得コントローラを実行
      const response = await handleGetRecipeDetail(mockRequest, mockParams);

      // Assert - 確認：400エラーレスポンスが返されることを検証
      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData).toMatchObject({
        error: 'INVALID_PARAMETER',
        message: 'Invalid recipe ID',
        request_id: 'req_abc123xyz789',
      });

      expect(getRecipeDetail).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: validationError,
          requestId: 'req_abc123xyz789',
        }),
        'Recipe ID validation failed'
      );
    });

    it('レシピが見つからない場合、404エラーを返すこと', async () => {
      // Arrange - 準備：レシピ未発見エラーのモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/999');
      const mockParams = { id: '999' };

      const notFoundError = new RecipeDetailError('Recipe not found', 'RECIPE_NOT_FOUND', 404);

      vi.mocked(validateRecipeId).mockReturnValue(999);
      vi.mocked(getRecipeDetail).mockRejectedValue(notFoundError);

      // Act - 実行：レシピ詳細取得コントローラを実行
      const response = await handleGetRecipeDetail(mockRequest, mockParams);

      // Assert - 確認：404エラーレスポンスが返されることを検証
      expect(response.status).toBe(404);

      const responseData = await response.json();
      expect(responseData).toMatchObject({
        error: 'RESOURCE_NOT_FOUND',
        message: 'Recipe not found',
        request_id: 'req_abc123xyz789',
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: notFoundError,
          requestId: 'req_abc123xyz789',
        }),
        'Error occurred during recipe detail retrieval'
      );
    });

    it('非公開レシピにアクセスした場合、403エラーを返すこと', async () => {
      // Arrange - 準備：非公開レシピアクセスエラーのモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/1');
      const mockParams = { id: '1' };

      const forbiddenError = new RecipeDetailError(
        'Recipe is not published',
        'RECIPE_NOT_PUBLISHED',
        403
      );

      vi.mocked(validateRecipeId).mockReturnValue(1);
      vi.mocked(getRecipeDetail).mockRejectedValue(forbiddenError);

      // Act - 実行：レシピ詳細取得コントローラを実行
      const response = await handleGetRecipeDetail(mockRequest, mockParams);

      // Assert - 確認：403エラーレスポンスが返されることを検証
      expect(response.status).toBe(403);

      const responseData = await response.json();
      expect(responseData).toMatchObject({
        error: 'RECIPE_NOT_PUBLISHED',
        message: 'Recipe is not published',
        request_id: 'req_abc123xyz789',
      });
    });

    it('予期しないエラーの場合、500エラーを返すこと', async () => {
      // Arrange - 準備：予期しないエラーのモックを設定
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/1');
      const mockParams = { id: '1' };

      const unexpectedError = new Error('Database connection failed');

      vi.mocked(validateRecipeId).mockReturnValue(1);
      vi.mocked(getRecipeDetail).mockRejectedValue(unexpectedError);

      // Act - 実行：レシピ詳細取得コントローラを実行
      const response = await handleGetRecipeDetail(mockRequest, mockParams);

      // Assert - 確認：500エラーレスポンスが返されることを検証
      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toMatchObject({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'レシピ詳細の取得に失敗しました',
        request_id: 'req_abc123xyz789',
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: unexpectedError,
          requestId: 'req_abc123xyz789',
        }),
        'Error occurred during recipe detail retrieval'
      );
    });
  });
});
