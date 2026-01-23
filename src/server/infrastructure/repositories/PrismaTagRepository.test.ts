import type { PrismaClient, Tag } from '@prisma/client';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { PrismaTagRepository } from './PrismaTagRepository';

describe('PrismaTagRepository', () => {
  let repository: PrismaTagRepository;
  let mockPrisma: {
    tag: {
      findMany: ReturnType<typeof vi.fn>;
    };
  };

  // テスト用のタグデータ
  const createMockTag = (id: bigint, name: string, slug: string): Tag => ({
    id,
    name,
    slug,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });

  beforeEach(() => {
    // Arrange - モックPrismaクライアントを作成
    mockPrisma = {
      tag: {
        findMany: vi.fn(),
      },
    };
    repository = new PrismaTagRepository(mockPrisma as unknown as PrismaClient);
  });

  describe('findByIds', () => {
    it('有効なIDリストからタグ情報を取得できること', async () => {
      // Arrange - モックの戻り値を設定
      const mockTags = [
        createMockTag(1n, 'エチオピア', 'ethiopia'),
        createMockTag(2n, 'フルーティー', 'fruity'),
      ];
      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      // Act - タグを取得
      const result = await repository.findByIds(['1', '2']);

      // Assert - 正しいタグ情報が取得されることを確認
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'エチオピア', slug: 'ethiopia' },
        { id: '2', name: 'フルーティー', slug: 'fruity' },
      ]);
      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1n, 2n] },
        },
      });
    });

    it('空配列を渡した場合、空配列を返すこと', async () => {
      // Arrange - 何もモックしない

      // Act - 空配列で検索
      const result = await repository.findByIds([]);

      // Assert - 空配列が返され、DBアクセスが行われないことを確認
      expect(result).toEqual([]);
      expect(mockPrisma.tag.findMany).not.toHaveBeenCalled();
    });

    it('存在しないIDが含まれる場合、存在するタグのみ返すこと', async () => {
      // Arrange - 一部のタグのみ返すモックを設定
      const mockTags = [createMockTag(1n, 'エチオピア', 'ethiopia')];
      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      // Act - 存在するIDと存在しないIDで検索
      const result = await repository.findByIds(['1', '999']);

      // Assert - 存在するタグのみ取得されることを確認
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'エチオピア', slug: 'ethiopia' });
    });

    it('DBエラー時に例外をスローすること', async () => {
      // Arrange - DBエラーを模擬
      const dbError = new Error('Database connection failed');
      mockPrisma.tag.findMany.mockRejectedValue(dbError);

      // Act & Assert - 例外がスローされることを確認
      await expect(repository.findByIds(['1', '2'])).rejects.toThrow('Database connection failed');
    });

    it('数値以外のIDが含まれる場合、有効なIDのみでDBアクセスすること', async () => {
      // Arrange - 有効なIDに対応するタグを返すモックを設定
      const mockTags = [createMockTag(1n, 'エチオピア', 'ethiopia')];
      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      // Act - 数値以外のIDを含むリストで検索
      const result = await repository.findByIds(['1', 'invalid', 'abc', '2']);

      // Assert - 有効なIDのみでDBアクセスされることを確認
      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1n, 2n] },
        },
      });
      expect(result).toHaveLength(1);
    });

    it('すべてのIDが数値以外の場合、DBアクセスせず空配列を返すこと', async () => {
      // Arrange - 何もモックしない

      // Act - 数値以外のIDのみで検索
      const result = await repository.findByIds(['invalid', 'abc', 'test']);

      // Assert - 空配列が返され、DBアクセスが行われないことを確認
      expect(result).toEqual([]);
      expect(mockPrisma.tag.findMany).not.toHaveBeenCalled();
    });

    it('負の数値のIDは無視されること', async () => {
      // Arrange - 有効なIDに対応するタグを返すモックを設定
      const mockTags = [createMockTag(1n, 'エチオピア', 'ethiopia')];
      mockPrisma.tag.findMany.mockResolvedValue(mockTags);

      // Act - 負の数値を含むリストで検索
      const result = await repository.findByIds(['1', '-1', '-999']);

      // Assert - 正の数値のみでDBアクセスされることを確認
      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1n] },
        },
      });
      expect(result).toHaveLength(1);
    });
  });
});
