import { RoastLevel, GrindSize } from '@prisma/client';

import type { SearchRecipesParams } from '@/server/features/recipes/search/types';

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
    beanWeight: undefined,
    waterTemp: undefined,
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
  title: string;
  summary: string;
  roastLevel: RoastLevel;
  grindSize: GrindSize;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
  isPublished: boolean;
  equipment: Array<{
    name: string;
    equipmentType: {
      id: bigint;
      name: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: bigint;
      name: string;
    };
  }>;
}> {
  return Array.from({ length: count }, (_, index) => ({
    id: BigInt(index + 1),
    title: `テストレシピ ${index + 1}`,
    summary: `テスト用のレシピ説明 ${index + 1}`,
    roastLevel: RoastLevel.MEDIUM,
    grindSize: GrindSize.MEDIUM,
    beanWeight: 20,
    waterTemp: 90,
    waterAmount: 300,
    isPublished: true,
    equipment: [
      {
        name: 'V60',
        equipmentType: {
          id: BigInt(1),
          name: 'ドリッパー',
        },
      },
    ],
    tags: [
      {
        tag: {
          id: BigInt(1),
          name: 'ハンドドリップ',
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
    equipment: ['V60'],
    beanWeight: { min: 15, max: 25 },
    waterTemp: { min: 85, max: 95 },
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
  title: string;
  summary: string | null;
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number | null;
  waterTemp: number | null;
  waterAmount: number | null;
  isPublished: boolean;
  equipment: Array<unknown>;
  tags: Array<unknown>;
} {
  return {
    id: BigInt(1),
    title: 'テストレシピ',
    summary: null,
    roastLevel: RoastLevel.MEDIUM,
    grindSize: null,
    beanWeight: null,
    waterTemp: null,
    waterAmount: null,
    isPublished: true,
    equipment: [],
    tags: [],
  };
}
