import { RoastLevel, GrindSize } from '@prisma/client';
import { describe, it, expect } from 'vitest';

import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';

import { RecipeMapper, type PrismaRecipeWithRelations } from './RecipeMapper';

describe('RecipeMapper', () => {
  describe('toDomain()', () => {
    it('PrismaモデルからDomainエンティティへ正しく変換できること', () => {
      // Arrange - Prismaモデルのテストデータを準備
      const prismaPost: PrismaRecipeWithRelations = {
        id: BigInt(1),
        authorId: BigInt(1),
        baristaId: BigInt(1),
        title: 'テストレシピ',
        summary: 'テスト用の概要',
        remarks: 'テスト用の備考',
        roastLevel: RoastLevel.MEDIUM,
        grindSize: GrindSize.MEDIUM,
        beanWeight: 20,
        waterAmount: 300,
        waterTemp: 90,
        brewingTime: 240,
        viewCount: 100,
        isPublished: true,
        publishedAt: new Date('2025-01-01'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2025-01-01'),
        barista: {
          id: BigInt(1),
          name: 'テストバリスタ',
          affiliation: 'テスト店舗',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          socialLinks: [
            {
              id: BigInt(1),
              baristaId: BigInt(1),
              platform: 'Instagram',
              url: 'https://instagram.com/test-barista',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ],
        },
        steps: [
          {
            id: BigInt(1),
            postId: BigInt(1),
            stepOrder: 1,
            description: 'お湯を沸かす',
            timeSeconds: 60,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
          {
            id: BigInt(2),
            postId: BigInt(1),
            stepOrder: 2,
            description: 'コーヒーを挽く',
            timeSeconds: 30,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
        ],
        equipment: [
          {
            id: BigInt(1),
            postId: BigInt(1),
            typeId: BigInt(1),
            name: 'ドリッパー',
            brand: 'HARIO',
            description: 'V60ドリッパー',
            affiliateLink: 'https://example.com',
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
            equipmentType: {
              id: BigInt(1),
              name: 'ドリッパー',
              description: 'コーヒードリッパー',
              createdAt: new Date('2024-12-01'),
              updatedAt: new Date('2024-12-01'),
            },
          },
        ],
        tags: [
          {
            postId: BigInt(1),
            tagId: BigInt(1),
            createdAt: new Date('2024-12-01'),
            tag: {
              id: BigInt(1),
              name: 'ハンドドリップ',
              slug: 'hand-drip',
              createdAt: new Date('2024-12-01'),
              updatedAt: new Date('2024-12-01'),
            },
          },
        ],
      };

      // Act - ドメインエンティティに変換
      const recipe = RecipeMapper.toDomain(prismaPost);

      // Assert - 変換結果を確認
      expect(recipe.id.equals(RecipeId.fromString('1'))).toBe(true);
      expect(recipe.title).toBe('テストレシピ');
      expect(recipe.summary).toBe('テスト用の概要');
      expect(recipe.remarks).toBe('テスト用の備考');
      expect(recipe.viewCount).toBe(100);
      expect(recipe.isPublished).toBe(true);
      expect(recipe.publishedAt).toEqual(new Date('2025-01-01'));
      expect(recipe.baristaId).toBe('1');

      // BrewingConditionsの確認
      const brewingConditions = recipe.brewingConditions;
      expect(brewingConditions.roastLevel).toBe(RoastLevel.MEDIUM);
      expect(brewingConditions.grindSize).toBe(GrindSize.MEDIUM);
      expect(brewingConditions.beanWeight).toBe(20);
      expect(brewingConditions.waterAmount).toBe(300);
      expect(brewingConditions.waterTemp).toBe(90);
      expect(brewingConditions.brewingTime).toBe(240);

      // ステップの確認
      expect(recipe.steps).toHaveLength(2);
      expect(recipe.steps[0].stepOrder).toBe(1);
      expect(recipe.steps[0].description).toBe('お湯を沸かす');
      expect(recipe.steps[0].timeSeconds).toBe(60);
      expect(recipe.steps[1].stepOrder).toBe(2);
      expect(recipe.steps[1].description).toBe('コーヒーを挽く');
      expect(recipe.steps[1].timeSeconds).toBe(30);

      // 器具IDの確認
      expect(recipe.equipmentIds).toEqual(['1']);

      // タグIDの確認
      expect(recipe.tagIds).toEqual(['1']);
    });

    it('関連データがnullの場合も正しく変換できること', () => {
      // Arrange - 関連データがnullのPrismaモデルを準備
      const prismaPost: PrismaRecipeWithRelations = {
        id: BigInt(1),
        authorId: BigInt(1),
        baristaId: null,
        title: 'ミニマルレシピ',
        summary: null,
        remarks: null,
        roastLevel: RoastLevel.MEDIUM,
        grindSize: null,
        beanWeight: null,
        waterAmount: null,
        waterTemp: null,
        brewingTime: null,
        viewCount: 0,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        barista: null,
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act - ドメインエンティティに変換
      const recipe = RecipeMapper.toDomain(prismaPost);

      // Assert - 変換結果を確認
      expect(recipe.id.equals(RecipeId.fromString('1'))).toBe(true);
      expect(recipe.title).toBe('ミニマルレシピ');
      expect(recipe.summary).toBeUndefined();
      expect(recipe.remarks).toBeUndefined();
      expect(recipe.baristaId).toBeUndefined();
      expect(recipe.viewCount).toBe(0);
      expect(recipe.isPublished).toBe(false);
      expect(recipe.publishedAt).toBeUndefined();
      expect(recipe.steps).toHaveLength(0);
      expect(recipe.equipmentIds).toHaveLength(0);
      expect(recipe.tagIds).toHaveLength(0);

      // BrewingConditionsの確認
      const brewingConditions = recipe.brewingConditions;
      expect(brewingConditions.roastLevel).toBe(RoastLevel.MEDIUM);
      expect(brewingConditions.grindSize).toBeUndefined();
      expect(brewingConditions.beanWeight).toBeUndefined();
      expect(brewingConditions.waterAmount).toBeUndefined();
      expect(brewingConditions.waterTemp).toBeUndefined();
      expect(brewingConditions.brewingTime).toBeUndefined();
    });

    it('ステップが順序通りにソートされること', () => {
      // Arrange - 順序が混在したステップを持つPrismaモデルを準備
      const prismaPost: PrismaRecipeWithRelations = {
        id: BigInt(1),
        authorId: BigInt(1),
        baristaId: BigInt(1),
        title: 'ソートテストレシピ',
        summary: null,
        remarks: null,
        roastLevel: RoastLevel.MEDIUM,
        grindSize: null,
        beanWeight: null,
        waterAmount: null,
        waterTemp: null,
        brewingTime: null,
        viewCount: 0,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        barista: null,
        steps: [
          {
            id: BigInt(3),
            postId: BigInt(1),
            stepOrder: 3,
            description: '3番目のステップ',
            timeSeconds: null,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
          {
            id: BigInt(1),
            postId: BigInt(1),
            stepOrder: 1,
            description: '1番目のステップ',
            timeSeconds: null,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
          {
            id: BigInt(2),
            postId: BigInt(1),
            stepOrder: 2,
            description: '2番目のステップ',
            timeSeconds: null,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
        ],
        equipment: [],
        tags: [],
      };

      // Act - ドメインエンティティに変換
      const recipe = RecipeMapper.toDomain(prismaPost);

      // Assert - ステップが正しい順序でソートされることを確認
      expect(recipe.steps).toHaveLength(3);
      expect(recipe.steps[0].stepOrder).toBe(1);
      expect(recipe.steps[0].description).toBe('1番目のステップ');
      expect(recipe.steps[1].stepOrder).toBe(2);
      expect(recipe.steps[1].description).toBe('2番目のステップ');
      expect(recipe.steps[2].stepOrder).toBe(3);
      expect(recipe.steps[2].description).toBe('3番目のステップ');
    });
  });

  describe('toWhereClause()', () => {
    it('検索条件を正しいWhere句に変換できること', () => {
      // Arrange - 検索条件を準備
      const criteria = {
        searchTerm: 'コーヒー',
        roastLevel: [RoastLevel.MEDIUM, RoastLevel.DARK],
        grindSize: [GrindSize.MEDIUM],
        beanWeight: { min: 15, max: 25 },
        waterTemp: { min: 80, max: 95 },
        equipmentNames: ['V60', 'Chemex'],
        tagIds: ['1'],
        baristaId: '1',
        isPublished: true,
      };

      // Act - Where句に変換
      const where = RecipeMapper.toWhereClause(criteria);

      // Assert - 変換結果を確認
      const orConditions = where.OR as unknown[];
      expect(orConditions).toHaveLength(3);
      expect(orConditions[0]).toEqual({
        title: { contains: 'コーヒー', mode: 'insensitive' },
      });
      expect(orConditions[1]).toEqual({
        summary: { contains: 'コーヒー', mode: 'insensitive' },
      });
      expect(orConditions[2]).toEqual({
        remarks: { contains: 'コーヒー', mode: 'insensitive' },
      });

      expect(where.roastLevel).toEqual({ in: [RoastLevel.MEDIUM, RoastLevel.DARK] });
      expect(where.grindSize).toEqual({ in: [GrindSize.MEDIUM] });

      expect(where.beanWeight).toEqual({ gte: 15, lte: 25 });
      expect(where.waterTemp).toEqual({ gte: 80, lte: 95 });

      expect(where.AND).toBeDefined();
      expect((where.AND as unknown[])[0]).toEqual({
        equipment: {
          some: {
            name: { in: ['V60', 'Chemex'] },
          },
        },
      });

      expect(where.tags).toEqual({
        some: {
          tagId: { in: [BigInt(1)] },
        },
      });

      expect(where.baristaId).toEqual(BigInt(1));
      expect(where.isPublished).toBe(true);
    });

    it('空の検索条件でも正しく処理できること', () => {
      // Arrange - 空の検索条件を準備
      const criteria = {};

      // Act - Where句に変換
      const where = RecipeMapper.toWhereClause(criteria);

      // Assert - 空のWhere句が返されることを確認
      expect(where).toEqual({});
    });
  });

  describe('toOrderBy()', () => {
    it('ソート条件を正しいOrderBy句に変換できること', () => {
      // Arrange & Act - ソート条件を変換
      const orderBy1 = RecipeMapper.toOrderBy('title', 'asc');
      const orderBy2 = RecipeMapper.toOrderBy('viewCount', 'desc');
      const orderBy3 = RecipeMapper.toOrderBy(); // デフォルト値

      // Assert - 変換結果を確認
      expect(orderBy1).toEqual({ title: 'asc' });
      expect(orderBy2).toEqual({ viewCount: 'desc' });
      expect(orderBy3).toEqual({ id: 'asc' });
    });
  });
});
