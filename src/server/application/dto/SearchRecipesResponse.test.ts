import { describe, expect, it, vi, beforeEach } from 'vitest';

import { SearchRecipesResponseMapper } from './SearchRecipesResponse';

// Mock Equipment Repository
const mockEquipmentRepository = {
  findByIds: vi.fn(),
  findById: vi.fn(),
  findAllAvailable: vi.fn(),
  findByType: vi.fn(),
};

// Mock Tag Repository
const mockTagRepository = {
  findByIds: vi.fn(),
};

describe('SearchRecipesResponseMapper', () => {
  let mapper: SearchRecipesResponseMapper;

  beforeEach(() => {
    vi.clearAllMocks();
    mapper = new SearchRecipesResponseMapper(mockEquipmentRepository, mockTagRepository);
  });

  describe('器具ID→器具名変換', () => {
    it('器具IDが器具名に正しく変換されること', async () => {
      // Arrange - 器具マスターデータとレシピデータを準備
      const mockEquipment = [
        { id: 'drip-01', name: 'V60', brand: 'Hario', equipmentType: 'DRIPPER' },
        { id: 'filter-02', name: 'ペーパーフィルター', brand: 'Hario', equipmentType: 'FILTER' },
      ];

      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: ['drip-01', 'filter-02'],
            tagIds: [],
            baristaName: 'テスト投稿者',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockEquipmentRepository.findByIds.mockResolvedValue(mockEquipment);
      mockTagRepository.findByIds.mockResolvedValue([]);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - 器具IDが器具名に変換されていることを検証
      expect(result.recipes[0].equipment).toEqual(['Hario V60', 'Hario ペーパーフィルター']);
      expect(mockEquipmentRepository.findByIds).toHaveBeenCalledWith(['drip-01', 'filter-02']);
    });

    it('器具が見つからない場合、IDをそのまま表示すること', async () => {
      // Arrange - 器具が見つからない場合のデータを準備
      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: ['unknown-01'],
            tagIds: [],
            baristaName: 'テスト投稿者',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockEquipmentRepository.findByIds.mockResolvedValue([]);
      mockTagRepository.findByIds.mockResolvedValue([]);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - 器具が見つからない場合、IDをそのまま表示
      expect(result.recipes[0].equipment).toEqual(['unknown-01']);
      expect(mockEquipmentRepository.findByIds).toHaveBeenCalledWith(['unknown-01']);
    });

    it('equipmentIdsが空配列の場合、空配列を返すこと', async () => {
      // Arrange - 器具IDが空の場合のデータを準備
      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: [],
            tagIds: [],
            baristaName: 'テスト投稿者',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockTagRepository.findByIds.mockResolvedValue([]);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - 空配列が返される
      expect(result.recipes[0].equipment).toEqual([]);
      expect(mockEquipmentRepository.findByIds).toHaveBeenCalledWith([]);
    });
  });

  describe('タグID→タグ情報変換', () => {
    it('タグIDがタグ情報に正しくマッピングされること', async () => {
      // Arrange - タグマスターデータとレシピデータを準備
      const mockTags = [
        { id: '1', name: 'エチオピア', slug: 'ethiopia' },
        { id: '2', name: 'フルーティー', slug: 'fruity' },
      ];

      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: [],
            tagIds: ['1', '2'],
            baristaName: 'テスト投稿者',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockEquipmentRepository.findByIds.mockResolvedValue([]);
      mockTagRepository.findByIds.mockResolvedValue(mockTags);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - タグ情報が正しくマッピングされていることを検証
      expect(result.recipes[0].tags).toEqual([
        { id: '1', name: 'エチオピア', slug: 'ethiopia' },
        { id: '2', name: 'フルーティー', slug: 'fruity' },
      ]);
      expect(mockTagRepository.findByIds).toHaveBeenCalledWith(['1', '2']);
    });

    it('tagIdsが空配列の場合、空配列を返すこと', async () => {
      // Arrange - タグIDが空の場合のデータを準備
      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: [],
            tagIds: [],
            baristaName: 'テスト投稿者',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockEquipmentRepository.findByIds.mockResolvedValue([]);
      mockTagRepository.findByIds.mockResolvedValue([]);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - 空配列が返される
      expect(result.recipes[0].tags).toEqual([]);
      expect(mockTagRepository.findByIds).toHaveBeenCalledWith([]);
    });
  });

  describe('baristaName マッピング', () => {
    it('baristaName が正しくマッピングされること', async () => {
      // Arrange - baristaNameを持つレシピデータを準備
      const mockSearchResult = {
        recipes: [
          {
            id: { value: 'recipe-01' },
            title: 'テストレシピ',
            summary: 'テスト要約',
            brewingConditions: {
              roastLevel: 'MEDIUM',
              grindSize: 'MEDIUM',
              beanWeight: 20,
              waterTemp: 95,
              waterAmount: 300,
            },
            equipmentIds: [],
            tagIds: [],
            baristaName: '山田太郎',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      mockEquipmentRepository.findByIds.mockResolvedValue([]);
      mockTagRepository.findByIds.mockResolvedValue([]);

      // Act - DTOに変換
      const result = await mapper.toDto(mockSearchResult);

      // Assert - baristaNameが正しくマッピングされていることを検証
      expect(result.recipes[0].baristaName).toBe('山田太郎');
    });
  });
});
