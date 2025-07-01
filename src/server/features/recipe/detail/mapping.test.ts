import { describe, it, expect } from 'vitest';

import type {
  BaristaInfo,
  RecipeStepInfo,
  RecipeTagInfo,
  DetailedEquipmentInfo,
} from '@/client/features/recipe-detail/types/recipe-detail';

// テスト対象のマッピング関数（service.ts内の関数を抽出してテスト）
// service.tsから抽出したマッピング関数のテストファイル

type RecipeEquipmentInfo = DetailedEquipmentInfo;

type PrismaBarista = {
  id: bigint;
  name: string;
  affiliation: string | null;
  socialLinks: Array<{
    id: bigint;
    platform: string;
    url: string;
  }>;
};

type PrismaStep = {
  id: bigint;
  stepOrder: number;
  timeSeconds: number | null;
  description: string;
};

type PrismaEquipment = {
  id: bigint;
  name: string;
  brand: string | null;
  description: string | null;
  affiliateLink: string | null;
  equipmentType: {
    id: bigint;
    name: string;
    description: string | null;
  };
};

type PrismaTag = {
  id: bigint;
  name: string;
  slug: string;
};

// マッピング関数（service.tsから抽出したもの）
function mapBarista(barista: PrismaBarista): BaristaInfo {
  return {
    id: barista.id.toString(),
    name: barista.name,
    affiliation: barista.affiliation ?? undefined,
    socialLinks: barista.socialLinks.map((link) => ({
      id: link.id.toString(),
      platform: link.platform,
      url: link.url,
    })),
  };
}

function mapStep(step: PrismaStep): RecipeStepInfo {
  return {
    id: step.id.toString(),
    stepOrder: step.stepOrder,
    timeSeconds: step.timeSeconds ?? undefined,
    description: step.description,
  };
}

function mapEquipment(equipment: PrismaEquipment): RecipeEquipmentInfo {
  return {
    id: equipment.id.toString(),
    name: equipment.name,
    brand: equipment.brand ?? undefined,
    description: equipment.description ?? undefined,
    affiliateLink: equipment.affiliateLink ?? undefined,
    equipmentType: {
      id: equipment.equipmentType.id.toString(),
      name: equipment.equipmentType.name,
      description: equipment.equipmentType.description ?? undefined,
    },
  };
}

function mapTag(tag: PrismaTag): RecipeTagInfo {
  return {
    id: tag.id.toString(),
    name: tag.name,
    slug: tag.slug,
  };
}

describe('レシピ詳細データマッピング関数', () => {
  describe('mapBarista', () => {
    it('完全なバリスタ情報を正しくマッピングできること', () => {
      // Arrange - 準備：完全なPrismaバリスタデータを設定
      const prismaBarista: PrismaBarista = {
        id: 1n,
        name: '佐藤花子',
        affiliation: 'Specialty Coffee Shop ARIA',
        socialLinks: [
          {
            id: 1n,
            platform: 'Instagram',
            url: 'https://instagram.com/coffee_hanako',
          },
          {
            id: 2n,
            platform: 'Twitter',
            url: 'https://twitter.com/coffee_hanako',
          },
        ],
      };

      // Act - 実行：バリスタデータをマッピング
      const result = mapBarista(prismaBarista);

      // Assert - 確認：正しくマッピングされることを検証
      expect(result).toEqual({
        id: '1',
        name: '佐藤花子',
        affiliation: 'Specialty Coffee Shop ARIA',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/coffee_hanako',
          },
          {
            id: '2',
            platform: 'Twitter',
            url: 'https://twitter.com/coffee_hanako',
          },
        ],
      });
    });

    it('affiliationがnullの場合、undefinedにマッピングできること', () => {
      // Arrange - 準備：affiliation無しのバリスタデータを設定
      const prismaBarista: PrismaBarista = {
        id: 2n,
        name: '田中太郎',
        affiliation: null,
        socialLinks: [],
      };

      // Act - 実行：バリスタデータをマッピング
      const result = mapBarista(prismaBarista);

      // Assert - 確認：affiliationがundefinedになることを検証
      expect(result.affiliation).toBeUndefined();
      expect(result.name).toBe('田中太郎');
      expect(result.socialLinks).toEqual([]);
    });

    it('BigIntのIDが文字列に正しく変換されること', () => {
      // Arrange - 準備：大きなIDのバリスタデータを設定
      const prismaBarista: PrismaBarista = {
        id: 9007199254740991n, // Number.MAX_SAFE_INTEGER
        name: 'Test Barista',
        affiliation: null,
        socialLinks: [
          {
            id: 9007199254740992n,
            platform: 'Test',
            url: 'https://test.com',
          },
        ],
      };

      // Act - 実行：バリスタデータをマッピング
      const result = mapBarista(prismaBarista);

      // Assert - 確認：BigIntが正しく文字列変換されることを検証
      expect(result.id).toBe('9007199254740991');
      expect(result.socialLinks[0].id).toBe('9007199254740992');
    });
  });

  describe('mapStep', () => {
    it('完全な手順情報を正しくマッピングできること', () => {
      // Arrange - 準備：完全な手順データを設定
      const prismaStep: PrismaStep = {
        id: 1n,
        stepOrder: 1,
        timeSeconds: 30,
        description: 'フィルターをドリッパーにセットし、コーヒー粉を投入',
      };

      // Act - 実行：手順データをマッピング
      const result = mapStep(prismaStep);

      // Assert - 確認：正しくマッピングされることを検証
      expect(result).toEqual({
        id: '1',
        stepOrder: 1,
        timeSeconds: 30,
        description: 'フィルターをドリッパーにセットし、コーヒー粉を投入',
      });
    });

    it('timeSecondsがnullの場合、undefinedにマッピングできること', () => {
      // Arrange - 準備：時間指定無しの手順データを設定
      const prismaStep: PrismaStep = {
        id: 2n,
        stepOrder: 2,
        timeSeconds: null,
        description: 'コーヒー豆の香りを確認',
      };

      // Act - 実行：手順データをマッピング
      const result = mapStep(prismaStep);

      // Assert - 確認：timeSecondsがundefinedになることを検証
      expect(result.timeSeconds).toBeUndefined();
      expect(result.stepOrder).toBe(2);
      expect(result.description).toBe('コーヒー豆の香りを確認');
    });
  });

  describe('mapEquipment', () => {
    it('完全な器具情報を正しくマッピングできること', () => {
      // Arrange - 準備：完全な器具データを設定
      const prismaEquipment: PrismaEquipment = {
        id: 1n,
        name: 'V60ドリッパー 02',
        brand: 'HARIO',
        description: '円錐形ドリッパーの代表格',
        affiliateLink: 'https://amazon.co.jp/hario-v60',
        equipmentType: {
          id: 1n,
          name: 'ドリッパー',
          description: 'コーヒーを抽出するための器具',
        },
      };

      // Act - 実行：器具データをマッピング
      const result = mapEquipment(prismaEquipment);

      // Assert - 確認：正しくマッピングされることを検証
      expect(result).toEqual({
        id: '1',
        name: 'V60ドリッパー 02',
        brand: 'HARIO',
        description: '円錐形ドリッパーの代表格',
        affiliateLink: 'https://amazon.co.jp/hario-v60',
        equipmentType: {
          id: '1',
          name: 'ドリッパー',
          description: 'コーヒーを抽出するための器具',
        },
      });
    });

    it('オプショナルフィールドがnullの場合、undefinedにマッピングできること', () => {
      // Arrange - 準備：最小限の器具データを設定
      const prismaEquipment: PrismaEquipment = {
        id: 2n,
        name: 'ペーパーフィルター',
        brand: null,
        description: null,
        affiliateLink: null,
        equipmentType: {
          id: 2n,
          name: 'フィルター',
          description: null,
        },
      };

      // Act - 実行：器具データをマッピング
      const result = mapEquipment(prismaEquipment);

      // Assert - 確認：nullフィールドがundefinedになることを検証
      expect(result.brand).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.affiliateLink).toBeUndefined();
      expect(result.equipmentType.description).toBeUndefined();
      expect(result.name).toBe('ペーパーフィルター');
      expect(result.equipmentType.name).toBe('フィルター');
    });
  });

  describe('mapTag', () => {
    it('タグ情報を正しくマッピングできること', () => {
      // Arrange - 準備：タグデータを設定
      const prismaTag: PrismaTag = {
        id: 1n,
        name: 'フルーティー',
        slug: 'fruity',
      };

      // Act - 実行：タグデータをマッピング
      const result = mapTag(prismaTag);

      // Assert - 確認：正しくマッピングされることを検証
      expect(result).toEqual({
        id: '1',
        name: 'フルーティー',
        slug: 'fruity',
      });
    });

    it('日本語・英語混在のタグを正しく処理できること', () => {
      // Arrange - 準備：多言語タグデータを設定
      const prismaTag: PrismaTag = {
        id: 999n,
        name: 'Ethiopian イルガチェフェ',
        slug: 'ethiopian-yirgacheffe',
      };

      // Act - 実行：タグデータをマッピング
      const result = mapTag(prismaTag);

      // Assert - 確認：文字エンコーディングが正しく処理されることを検証
      expect(result.name).toBe('Ethiopian イルガチェフェ');
      expect(result.slug).toBe('ethiopian-yirgacheffe');
      expect(result.id).toBe('999');
    });
  });
});
