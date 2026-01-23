import { describe, it, expect, beforeEach } from 'vitest';

import type { ITagRepository, TagEntity } from './ITagRepository';

/**
 * ITagRepository 契約テスト
 *
 * リポジトリインターフェースの契約を検証するためのテストスイート
 * すべての実装は以下の契約を満たす必要がある
 */

/**
 * テスト用のインメモリ実装
 *
 * ITagRepository の契約を検証するために使用
 */
class InMemoryTagRepository implements ITagRepository {
  private readonly tags: Map<string, TagEntity> = new Map();

  /**
   * テスト用にタグを追加
   */
  add(tag: TagEntity): void {
    this.tags.set(tag.id, tag);
  }

  /**
   * リポジトリをクリア
   */
  clear(): void {
    this.tags.clear();
  }

  async findByIds(ids: string[]): Promise<TagEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    return ids.map((id) => this.tags.get(id)).filter((tag): tag is TagEntity => tag !== undefined);
  }
}

describe('ITagRepository契約テスト', () => {
  let repository: InMemoryTagRepository;

  // テスト用のタグデータ
  const testTags: TagEntity[] = [
    { id: '1', name: 'エチオピア', slug: 'ethiopia' },
    { id: '2', name: 'フルーティー', slug: 'fruity' },
    { id: '3', name: '浅煎り', slug: 'light-roast' },
  ];

  beforeEach(() => {
    // Arrange - 各テストでリポジトリを初期化
    repository = new InMemoryTagRepository();
  });

  describe('findByIds', () => {
    it('空配列に対して空配列を返すこと', async () => {
      // Arrange - タグを追加
      testTags.forEach((tag) => repository.add(tag));

      // Act - 空配列で検索
      const result = await repository.findByIds([]);

      // Assert - 空配列が返されることを確認
      expect(result).toEqual([]);
    });

    it('存在しないIDに対して空配列を返すこと', async () => {
      // Arrange - タグを追加
      testTags.forEach((tag) => repository.add(tag));

      // Act - 存在しないIDで検索
      const result = await repository.findByIds(['999', '888']);

      // Assert - 空配列が返されることを確認
      expect(result).toEqual([]);
    });

    it('有効なIDリストからタグ情報を取得できること', async () => {
      // Arrange - タグを追加
      testTags.forEach((tag) => repository.add(tag));

      // Act - 有効なIDで検索
      const result = await repository.findByIds(['1', '2']);

      // Assert - 正しいタグ情報が取得されることを確認
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          { id: '1', name: 'エチオピア', slug: 'ethiopia' },
          { id: '2', name: 'フルーティー', slug: 'fruity' },
        ])
      );
    });

    it('存在するIDと存在しないIDが混在する場合、存在するタグのみ返すこと', async () => {
      // Arrange - タグを追加
      testTags.forEach((tag) => repository.add(tag));

      // Act - 存在するIDと存在しないIDで検索
      const result = await repository.findByIds(['1', '999', '3']);

      // Assert - 存在するタグのみ取得されることを確認
      expect(result).toHaveLength(2);
      expect(result.map((tag) => tag.id)).toEqual(['1', '3']);
    });
  });
});
