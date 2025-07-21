import { RoastLevel, GrindSize } from '@prisma/client';

import type { SearchRecipesParams } from '@/server/features/recipes/search/types';

// 共通定数
const TEST_DATE = '2024-01-01T00:00:00Z';

/**
 * テスト用のRequestオブジェクトを生成する
 */
export function createSearchRequest(
  params: Record<string, string | number | string[]> = {}
): Request {
  const baseUrl = 'http://localhost:3000/api/recipes';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      searchParams.set(key, value.join(','));
    } else {
      searchParams.set(key, String(value));
    }
  });

  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;
  return new Request(url);
}

/**
 * JSON形式のパラメータを含むRequestオブジェクトを生成する
 */
export function createSearchRequestWithJsonParams(params: Record<string, unknown> = {}): Request {
  const baseUrl = 'http://localhost:3000/api/recipes';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      searchParams.set(key, value.join(','));
    } else if (typeof value === 'object' && value !== null) {
      searchParams.set(key, JSON.stringify(value));
    } else if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;
  return new Request(url);
}

/**
 * テスト用の検索パラメータを生成する
 */
export function createSearchParams(
  overrides: Partial<SearchRecipesParams> = {}
): SearchRecipesParams {
  return {
    page: 1,
    limit: 10,
    roastLevel: undefined,
    grindSize: undefined,
    equipment: undefined,
    equipmentType: undefined,
    beanWeight: undefined,
    waterTemp: undefined,
    waterAmount: undefined,
    search: undefined,
    sort: undefined,
    order: undefined,
    ...overrides,
  };
}

/**
 * テスト用のレシピデータを生成する（コントローラーテスト用）
 */
export function createMockRecipes(count: number = 1): Array<{
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  roastLevel: RoastLevel;
  grindSize: GrindSize;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
}> {
  return Array.from({ length: count }, (_, index) => ({
    id: `recipe-${index + 1}`,
    title: `テストレシピ ${index + 1}`,
    summary: `テスト用のレシピ説明 ${index + 1}`,
    equipment: ['V60'],
    roastLevel: RoastLevel.MEDIUM,
    grindSize: GrindSize.MEDIUM,
    beanWeight: 20,
    waterTemp: 90,
    waterAmount: 300,
  }));
}

/**
 * テスト用のPrismaレシピデータを生成する（サービステスト用）
 */
export function createMockPrismaRecipes(count: number = 1): Array<{
  id: bigint;
  authorId: bigint;
  baristaId: bigint | null;
  title: string;
  summary: string | null;
  remarks: string | null;
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number | null;
  waterTemp: number | null;
  waterAmount: number | null;
  brewingTime: number | null;
  viewCount: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  barista: {
    id: bigint;
    name: string;
    affiliation: string | null;
  } | null;
  steps: Array<{
    id: bigint;
    stepOrder: number;
    timeSeconds: number | null;
    description: string;
  }>;
  equipment: Array<{
    id: bigint;
    name: string;
    brand: string | null;
    description: string | null;
    affiliateLink: string | null;
    typeId: bigint;
    equipmentType: {
      id: bigint;
      name: string;
      description: string | null;
    };
  }>;
  tags: Array<{
    tag: {
      id: bigint;
      name: string;
      slug: string;
    };
  }>;
}> {
  return Array.from({ length: count }, (_, index) => ({
    id: BigInt(index + 1),
    authorId: BigInt(1),
    baristaId: BigInt(1),
    title: `テストレシピ ${index + 1}`,
    summary: `テスト用のレシピ説明 ${index + 1}`,
    remarks: null,
    roastLevel: RoastLevel.MEDIUM,
    grindSize: GrindSize.MEDIUM,
    beanWeight: 20,
    waterTemp: 90,
    waterAmount: 300,
    brewingTime: 180,
    viewCount: 100,
    isPublished: true,
    publishedAt: new Date(TEST_DATE),
    createdAt: new Date(TEST_DATE),
    updatedAt: new Date(TEST_DATE),
    barista: {
      id: BigInt(1),
      name: 'テストバリスタ',
      affiliation: 'テストカフェ',
    },
    steps: [
      {
        id: BigInt(1),
        stepOrder: 1,
        timeSeconds: 30,
        description: 'お湯を沸かす',
      },
    ],
    equipment: [
      {
        id: BigInt(1),
        name: 'V60',
        brand: 'HARIO',
        description: 'V60ドリッパー',
        affiliateLink: 'https://example.com',
        typeId: BigInt(1),
        equipmentType: {
          id: BigInt(1),
          name: 'ドリッパー',
          description: null,
        },
      },
    ],
    tags: [
      {
        tag: {
          id: BigInt(1),
          name: 'ハンドドリップ',
          slug: 'hand-drip',
        },
      },
    ],
  }));
}

/**
 * テスト用の検索結果を生成する
 */
export function createMockSearchResult(
  recipeCount: number = 1,
  currentPage: number = 1,
  totalItems: number = 1
): {
  recipes: Array<{
    id: string;
    title: string;
    summary: string;
    equipment: string[];
    roastLevel: RoastLevel;
    grindSize: GrindSize;
    beanWeight: number;
    waterTemp: number;
    waterAmount: number;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
} {
  return {
    recipes: createMockRecipes(recipeCount),
    pagination: {
      currentPage,
      totalPages: Math.ceil(totalItems / 10),
      totalItems,
      itemsPerPage: 10,
    },
  };
}

/**
 * テスト用の完全な検索パラメータを生成する
 */
export function createFullSearchParams(): SearchRecipesParams {
  return {
    page: 1,
    limit: 10,
    roastLevel: [RoastLevel.MEDIUM],
    grindSize: [GrindSize.MEDIUM],
    equipment: ['1'], // 数値IDを文字列で表現
    equipmentType: ['1'], // 数値IDを文字列で表現
    beanWeight: { min: 15, max: 25 },
    waterTemp: { min: 85, max: 95 },
    waterAmount: { min: 200, max: 300 },
    search: 'ハンド',
    sort: 'title',
    order: 'asc',
  };
}

/**
 * null値を含むテスト用レシピデータを生成する
 */
export function createMockRecipeWithNulls(): {
  id: bigint;
  authorId: bigint;
  baristaId: bigint | null;
  title: string;
  summary: string | null;
  remarks: string | null;
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number | null;
  waterTemp: number | null;
  waterAmount: number | null;
  brewingTime: number | null;
  viewCount: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  barista: null;
  steps: Array<unknown>;
  equipment: Array<unknown>;
  tags: Array<unknown>;
} {
  return {
    id: BigInt(1),
    authorId: BigInt(1),
    baristaId: null,
    title: 'テストレシピ',
    summary: null,
    remarks: null,
    roastLevel: RoastLevel.MEDIUM,
    grindSize: null,
    beanWeight: null,
    waterTemp: null,
    waterAmount: null,
    brewingTime: null,
    viewCount: 0,
    isPublished: true,
    publishedAt: new Date(TEST_DATE),
    createdAt: new Date(TEST_DATE),
    updatedAt: new Date(TEST_DATE),
    barista: null,
    steps: [],
    equipment: [],
    tags: [],
  };
}
