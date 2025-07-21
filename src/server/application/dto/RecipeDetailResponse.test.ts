/**
 * RecipeDetailResponseMapperのテスト
 */
import { describe, it, expect, beforeEach } from 'vitest';

import { Recipe } from '@/server/domain/recipe/entities/recipe';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import type { PrismaRecipeWithRelations } from '@/server/infrastructure/repositories/mappers/RecipeMapper';

import { RecipeDetailResponseMapper } from './RecipeDetailResponse';

const RECIPE_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const RECIPE_UPDATED_AT = new Date('2024-01-02T00:00:00.000Z');
const RECIPE_PUBLISHED_AT = new Date('2024-01-03T00:00:00.000Z');
const BARISTA_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const BARISTA_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const SOCIAL_LINK_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const SOCIAL_LINK_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const STEP_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const STEP_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const EQUIPMENT_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const EQUIPMENT_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const EQUIPMENT_TYPE_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const EQUIPMENT_TYPE_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const TAG_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const TAG_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const POST_TAG_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');

describe('RecipeDetailResponseMapper', () => {
  describe('toDto', () => {
    let recipe: Recipe;
    let prismaData: PrismaRecipeWithRelations;

    beforeEach(() => {
      // Arrange - テスト用のレシピエンティティを作成
      const id = RecipeId.fromString('1');
      const brewingConditions = BrewingConditions.create({
        roastLevel: 'MEDIUM',
        grindSize: 'MEDIUM',
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
        brewingTime: 240,
      });

      recipe = Recipe.reconstruct({
        id,
        title: 'V60 Medium Roast',
        summary: 'Balanced V60 recipe',
        brewingConditions,
        viewCount: 100,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
        baristaId: '1',
        steps: [
          { stepOrder: 1, description: 'Bloom for 30s', timeSeconds: 30 },
          { stepOrder: 2, description: 'Pour to 300ml', timeSeconds: 180 },
        ],
        equipmentIds: ['1', '2'],
        tagIds: ['1', '2'],
      });

      // Arrange - テスト用のPrismaデータを作成
      prismaData = {
        id: BigInt(1),
        authorId: BigInt(1),
        title: 'V60 Medium Roast',
        summary: 'Balanced V60 recipe',
        remarks: null,
        roastLevel: 'MEDIUM' as const,
        grindSize: 'MEDIUM' as const,
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
        brewingTime: 240,
        viewCount: 100,
        isPublished: true,
        publishedAt: RECIPE_PUBLISHED_AT,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
        baristaId: BigInt(1),
        barista: {
          id: BigInt(1),
          name: 'Test Barista',
          affiliation: 'Test Shop',
          createdAt: BARISTA_CREATED_AT,
          updatedAt: BARISTA_UPDATED_AT,
          socialLinks: [
            {
              id: BigInt(1),
              baristaId: BigInt(1),
              platform: 'Instagram',
              url: 'https://instagram.com/test',
              createdAt: SOCIAL_LINK_CREATED_AT,
              updatedAt: SOCIAL_LINK_UPDATED_AT,
            },
          ],
        },
        steps: [
          {
            id: BigInt(1),
            postId: BigInt(1),
            stepOrder: 1,
            description: 'Bloom for 30s',
            timeSeconds: 30,
            createdAt: STEP_CREATED_AT,
            updatedAt: STEP_UPDATED_AT,
          },
          {
            id: BigInt(2),
            postId: BigInt(1),
            stepOrder: 2,
            description: 'Pour to 300ml',
            timeSeconds: 180,
            createdAt: STEP_CREATED_AT,
            updatedAt: STEP_UPDATED_AT,
          },
        ],
        equipment: [
          {
            id: BigInt(1),
            name: 'Hario V60',
            brand: 'Hario',
            description: 'Ceramic dripper',
            affiliateLink: 'https://example.com/v60',
            postId: BigInt(1),
            typeId: BigInt(1),
            createdAt: EQUIPMENT_CREATED_AT,
            updatedAt: EQUIPMENT_UPDATED_AT,
            equipmentType: {
              id: BigInt(1),
              name: 'Dripper',
              description: 'Pour over dripper',
              createdAt: EQUIPMENT_TYPE_CREATED_AT,
              updatedAt: EQUIPMENT_TYPE_UPDATED_AT,
            },
          },
          {
            id: BigInt(2),
            name: 'Coffee Scale',
            brand: 'Timemore',
            description: 'Digital scale',
            affiliateLink: null,
            postId: BigInt(1),
            typeId: BigInt(2),
            createdAt: EQUIPMENT_CREATED_AT,
            updatedAt: EQUIPMENT_UPDATED_AT,
            equipmentType: {
              id: BigInt(2),
              name: 'Scale',
              description: 'Digital weighing scale',
              createdAt: EQUIPMENT_TYPE_CREATED_AT,
              updatedAt: EQUIPMENT_TYPE_UPDATED_AT,
            },
          },
        ],
        tags: [
          {
            postId: BigInt(1),
            tagId: BigInt(1),
            createdAt: POST_TAG_CREATED_AT,
            tag: {
              id: BigInt(1),
              name: 'V60',
              slug: 'v60',
              createdAt: TAG_CREATED_AT,
              updatedAt: TAG_UPDATED_AT,
            },
          },
          {
            postId: BigInt(1),
            tagId: BigInt(2),
            createdAt: POST_TAG_CREATED_AT,
            tag: {
              id: BigInt(2),
              name: 'Medium Roast',
              slug: 'medium-roast',
              createdAt: TAG_CREATED_AT,
              updatedAt: TAG_UPDATED_AT,
            },
          },
        ],
      };
    });

    describe('基本情報の変換', () => {
      it('レシピの基本情報を正しくDTOに変換すること', () => {
        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipe, prismaData);

        // Assert - 基本情報が正しく変換されることを検証
        expect(dto.id).toBe('1');
        expect(dto.title).toBe('V60 Medium Roast');
        expect(dto.summary).toBe('Balanced V60 recipe');
        expect(dto.roastLevel).toBe('MEDIUM');
        expect(dto.grindSize).toBe('MEDIUM');
        expect(dto.beanWeight).toBe(20);
        expect(dto.waterTemp).toBe(92);
        expect(dto.waterAmount).toBe(300);
        expect(dto.brewingTime).toBe(240);
        expect(dto.viewCount).toBe(100);
        expect(dto.isPublished).toBe(true);
      });
    });

    describe('バリスタ情報の変換', () => {
      it('バリスタIDが存在する場合、Unknown Baristaではなく実際の情報を返すこと', () => {
        // Arrange - バリスタIDを持つレシピ
        // (beforeEachで設定済み: baristaId: '1')

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipe, prismaData);

        // Assert - バリスタ情報が存在し、Unknown Baristaではないことを検証
        expect(dto.barista).toBeDefined();
        expect(dto.barista?.id).toBe('1');
        // 実装後は実際のバリスタ名が返されることを検証
        expect(dto.barista?.name).toBe('Test Barista');
        expect(dto.barista?.affiliation).toBe('Test Shop');
        expect(dto.barista?.socialLinks).toHaveLength(1);
        expect(dto.barista?.socialLinks[0]?.platform).toBe('Instagram');
      });

      it('バリスタIDが存在しない場合、undefinedを返すこと', () => {
        // Arrange - バリスタIDを持たないレシピを作成
        const recipeWithoutBarista = Recipe.reconstruct({
          id: RecipeId.fromString('2'),
          title: 'Recipe without barista',
          brewingConditions: BrewingConditions.create({ roastLevel: 'LIGHT' }),
          viewCount: 0,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          // baristaIdは設定しない
        });

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipeWithoutBarista);

        // Assert - バリスタ情報がundefinedであることを検証
        expect(dto.barista).toBeUndefined();
      });
    });

    describe('器具情報の変換', () => {
      it('器具IDが存在する場合、Unknown Equipmentではなく実際の情報を返すこと', () => {
        // Arrange - 器具IDを持つレシピ
        // (beforeEachで設定済み: equipmentIds: ['1', '2'])

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipe, prismaData);

        // Assert - 器具情報が存在し、Unknown Equipmentではないことを検証
        expect(dto.equipment).toHaveLength(2);
        expect(dto.equipment[0].id).toBe('1');
        expect(dto.equipment[1].id).toBe('2');
        // 実装後は実際の器具名が返されることを検証
        expect(dto.equipment[0].name).toBe('Hario V60');
        expect(dto.equipment[0].brand).toBe('Hario');
        expect(dto.equipment[0].description).toBe('Ceramic dripper');
        expect(dto.equipment[0].equipmentType.name).toBe('Dripper');
        expect(dto.equipment[1].name).toBe('Coffee Scale');
        expect(dto.equipment[1].equipmentType.name).toBe('Scale');
      });

      it('器具IDが空の場合、空配列を返すこと', () => {
        // Arrange - 器具IDを持たないレシピを作成
        const recipeWithoutEquipment = Recipe.reconstruct({
          id: RecipeId.fromString('3'),
          title: 'Recipe without equipment',
          brewingConditions: BrewingConditions.create({ roastLevel: 'DARK' }),
          viewCount: 0,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          equipmentIds: [], // 空配列
        });

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipeWithoutEquipment);

        // Assert - 器具情報が空配列であることを検証
        expect(dto.equipment).toEqual([]);
      });
    });

    describe('タグ情報の変換', () => {
      it('タグIDが存在する場合、Unknown Tagではなく実際の情報を返すこと', () => {
        // Arrange - タグIDを持つレシピ
        // (beforeEachで設定済み: tagIds: ['1', '2'])

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipe, prismaData);

        // Assert - タグ情報が存在し、Unknown Tagではないことを検証
        expect(dto.tags).toHaveLength(2);
        expect(dto.tags[0].id).toBe('1');
        expect(dto.tags[1].id).toBe('2');
        // 実装後は実際のタグ名が返されることを検証
        expect(dto.tags[0].name).toBe('V60');
        expect(dto.tags[0].slug).toBe('v60');
        expect(dto.tags[1].name).toBe('Medium Roast');
        expect(dto.tags[1].slug).toBe('medium-roast');
      });

      it('タグIDが空の場合、空配列を返すこと', () => {
        // Arrange - タグIDを持たないレシピを作成
        const recipeWithoutTags = Recipe.reconstruct({
          id: RecipeId.fromString('4'),
          title: 'Recipe without tags',
          brewingConditions: BrewingConditions.create({ roastLevel: 'MEDIUM_DARK' }),
          viewCount: 0,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tagIds: [], // 空配列
        });

        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipeWithoutTags);

        // Assert - タグ情報が空配列であることを検証
        expect(dto.tags).toEqual([]);
      });
    });

    describe('レシピステップの変換', () => {
      it('レシピステップが正しく変換されること', () => {
        // Act - DTOに変換
        const dto = RecipeDetailResponseMapper.toDto(recipe, prismaData);

        // Assert - ステップ情報が正しく変換されることを検証
        expect(dto.steps).toHaveLength(2);
        expect(dto.steps[0]).toEqual({
          id: 'step-1',
          stepOrder: 1,
          description: 'Bloom for 30s',
          timeSeconds: 30,
        });
        expect(dto.steps[1]).toEqual({
          id: 'step-2',
          stepOrder: 2,
          description: 'Pour to 300ml',
          timeSeconds: 180,
        });
      });
    });
  });
});
