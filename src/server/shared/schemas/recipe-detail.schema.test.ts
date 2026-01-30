/**
 * レシピ詳細用スキーマのテスト
 */

import { describe, it, expect } from 'vitest';

import {
  SocialLinkSchema,
  BaristaSchema,
  RecipeStepSchema,
  EquipmentTypeSchema,
  DetailedEquipmentSchema,
  RecipeTagSchema,
  RecipeDetailSchema,
  RecipeDetailResponseSchema,
  type RecipeDetail,
  type RecipeDetailResponse,
} from './recipe-detail.schema';

describe('SocialLinkSchema', () => {
  it('正常なSNSリンク情報がパースできること', () => {
    // Arrange
    const validSocialLink = {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/barista',
    };

    // Act
    const result = SocialLinkSchema.safeParse(validSocialLink);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('BaristaSchema', () => {
  it('正常なバリスタ情報がパースできること', () => {
    // Arrange
    const validBarista = {
      id: '1',
      name: '佐藤花子',
      affiliation: 'Specialty Coffee Shop',
      socialLinks: [{ id: '1', platform: 'Instagram', url: 'https://instagram.com/hanako' }],
    };

    // Act
    const result = BaristaSchema.safeParse(validBarista);

    // Assert
    expect(result.success).toBe(true);
  });

  it('affiliationがundefinedでもパースできること', () => {
    // Arrange
    const baristaWithoutAffiliation = {
      id: '1',
      name: '佐藤花子',
      socialLinks: [],
    };

    // Act
    const result = BaristaSchema.safeParse(baristaWithoutAffiliation);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('RecipeStepSchema', () => {
  it('正常なレシピステップがパースできること', () => {
    // Arrange
    const validStep = {
      id: 'step-1',
      stepOrder: 1,
      timeSeconds: 30,
      description: '蒸らしを行う',
    };

    // Act
    const result = RecipeStepSchema.safeParse(validStep);

    // Assert
    expect(result.success).toBe(true);
  });

  it('timeSecondsがundefinedでもパースできること', () => {
    // Arrange
    const stepWithoutTime = {
      id: 'step-1',
      stepOrder: 1,
      description: '器具を準備する',
    };

    // Act
    const result = RecipeStepSchema.safeParse(stepWithoutTime);

    // Assert
    expect(result.success).toBe(true);
  });

  it('stepOrderが0以下の場合、パースに失敗すること', () => {
    // Arrange
    const invalidStep = {
      id: 'step-1',
      stepOrder: 0,
      description: '無効なステップ',
    };

    // Act
    const result = RecipeStepSchema.safeParse(invalidStep);

    // Assert
    expect(result.success).toBe(false);
  });

  it('timeSecondsが負の数の場合、パースに失敗すること', () => {
    // Arrange
    const invalidStep = {
      id: 'step-1',
      stepOrder: 1,
      timeSeconds: -10,
      description: '無効なステップ',
    };

    // Act
    const result = RecipeStepSchema.safeParse(invalidStep);

    // Assert
    expect(result.success).toBe(false);
  });
});

describe('EquipmentTypeSchema', () => {
  it('正常な器具タイプ情報がパースできること', () => {
    // Arrange
    const validEquipmentType = {
      id: '1',
      name: 'ドリッパー',
      description: 'コーヒーを抽出するための器具',
    };

    // Act
    const result = EquipmentTypeSchema.safeParse(validEquipmentType);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('DetailedEquipmentSchema', () => {
  it('正常な器具詳細情報がパースできること', () => {
    // Arrange
    const validEquipment = {
      id: '1',
      name: 'V60ドリッパー',
      brand: 'HARIO',
      description: '円錐形で一つ穴のドリッパー',
      affiliateLink: 'https://example.com/v60',
      equipmentType: {
        id: '1',
        name: 'ドリッパー',
      },
    };

    // Act
    const result = DetailedEquipmentSchema.safeParse(validEquipment);

    // Assert
    expect(result.success).toBe(true);
  });

  it('オプションフィールドがなくてもパースできること', () => {
    // Arrange
    const minimalEquipment = {
      id: '1',
      name: 'シンプルドリッパー',
      equipmentType: {
        id: '1',
        name: 'ドリッパー',
      },
    };

    // Act
    const result = DetailedEquipmentSchema.safeParse(minimalEquipment);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('RecipeTagSchema', () => {
  it('正常なタグ情報がパースできること', () => {
    // Arrange
    const validTag = {
      id: '1',
      name: 'V60',
      slug: 'v60',
    };

    // Act
    const result = RecipeTagSchema.safeParse(validTag);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('RecipeDetailSchema', () => {
  describe('有効なレシピ詳細情報のパース', () => {
    it('すべてのフィールドを持つレシピ詳細情報がパースできること', () => {
      // Arrange
      const validRecipeDetail = {
        id: '1',
        title: 'V60 ミディアムロースト',
        summary: 'バランスの取れたV60レシピ',
        remarks: '蒸らし時間に注意',
        roastLevel: 'MEDIUM',
        viewCount: 100,
        isPublished: true,
        publishedAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        barista: {
          id: '1',
          name: '佐藤花子',
          affiliation: 'Test Shop',
          socialLinks: [{ id: '1', platform: 'Instagram', url: 'https://instagram.com/hanako' }],
        },
        steps: [
          { id: 'step-1', stepOrder: 1, timeSeconds: 30, description: '蒸らし' },
          { id: 'step-2', stepOrder: 2, timeSeconds: 120, description: '抽出' },
        ],
        equipment: [
          {
            id: '1',
            name: 'V60ドリッパー',
            brand: 'HARIO',
            equipmentType: { id: '1', name: 'ドリッパー' },
          },
        ],
        tags: [{ id: '1', name: 'V60', slug: 'v60' }],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(validRecipeDetail);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('1');
        expect(result.data.steps).toHaveLength(2);
        expect(result.data.equipment).toHaveLength(1);
        expect(result.data.tags).toHaveLength(1);
      }
    });

    it('オプションフィールドがないレシピ詳細情報がパースできること', () => {
      // Arrange
      const minimalRecipeDetail = {
        id: '1',
        title: 'シンプルレシピ',
        roastLevel: 'LIGHT',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(minimalRecipeDetail);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.summary).toBeUndefined();
        expect(result.data.barista).toBeUndefined();
      }
    });
  });

  describe('無効なレシピ詳細情報の拒否', () => {
    it('titleが欠落している場合、パースに失敗すること', () => {
      // Arrange
      const invalidRecipe = {
        id: '1',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(invalidRecipe);

      // Assert
      expect(result.success).toBe(false);
    });

    it('viewCountが負の数の場合、パースに失敗すること', () => {
      // Arrange
      const invalidRecipe = {
        id: '1',
        title: 'テストレシピ',
        roastLevel: 'MEDIUM',
        viewCount: -1,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(invalidRecipe);

      // Assert
      expect(result.success).toBe(false);
    });

    it('createdAtがISO 8601形式でない場合、パースに失敗すること', () => {
      // Arrange
      const invalidRecipe = {
        id: '1',
        title: 'テストレシピ',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024/01/01', // 不正な形式
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(invalidRecipe);

      // Assert
      expect(result.success).toBe(false);
    });

    it('updatedAtがISO 8601形式でない場合、パースに失敗すること', () => {
      // Arrange
      const invalidRecipe = {
        id: '1',
        title: 'テストレシピ',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: 'invalid-date', // 不正な形式
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(invalidRecipe);

      // Assert
      expect(result.success).toBe(false);
    });

    it('publishedAtがISO 8601形式でない場合、パースに失敗すること', () => {
      // Arrange
      const invalidRecipe = {
        id: '1',
        title: 'テストレシピ',
        roastLevel: 'MEDIUM',
        viewCount: 0,
        isPublished: true,
        publishedAt: '2024/01/01', // 不正な形式
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Act
      const result = RecipeDetailSchema.safeParse(invalidRecipe);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('型推論', () => {
    it('RecipeDetail型が正しく推論されること', () => {
      // Arrange
      const recipe: RecipeDetail = {
        id: '1',
        title: 'テストレシピ',
        roastLevel: 'MEDIUM',
        viewCount: 100,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      };

      // Assert
      expect(typeof recipe.id).toBe('string');
      expect(typeof recipe.title).toBe('string');
      expect(typeof recipe.viewCount).toBe('number');
      expect(typeof recipe.isPublished).toBe('boolean');
      expect(Array.isArray(recipe.steps)).toBe(true);
    });
  });
});

describe('RecipeDetailResponseSchema', () => {
  it('正常なレシピ詳細レスポンスがパースできること', () => {
    // Arrange
    const validResponse = {
      recipe: {
        id: '1',
        title: 'V60 ミディアムロースト',
        roastLevel: 'MEDIUM',
        viewCount: 100,
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        steps: [],
        equipment: [],
        tags: [],
      },
      newViewCount: 101,
    };

    // Act
    const result = RecipeDetailResponseSchema.safeParse(validResponse);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recipe.id).toBe('1');
      expect(result.data.newViewCount).toBe(101);
    }
  });

  describe('型推論', () => {
    it('RecipeDetailResponse型が正しく推論されること', () => {
      // Arrange
      const response: RecipeDetailResponse = {
        recipe: {
          id: '1',
          title: 'テストレシピ',
          roastLevel: 'MEDIUM',
          viewCount: 100,
          isPublished: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          steps: [],
          equipment: [],
          tags: [],
        },
        newViewCount: 101,
      };

      // Assert
      expect(typeof response.recipe).toBe('object');
      expect(typeof response.newViewCount).toBe('number');
    });
  });
});
