import { RoastLevel, GrindSize } from '@prisma/client';
import { ReadonlyURLSearchParams } from 'next/navigation';

import { RecipeFilters } from '@/features/recipes/types/api';

export function parseFiltersFromSearchParams(searchParams: ReadonlyURLSearchParams): RecipeFilters {
  const filters: RecipeFilters = {};

  // ページネーション
  const page = searchParams.get('page');
  if (page) filters.page = parseInt(page, 10);

  const limit = searchParams.get('limit');
  if (limit) filters.limit = parseInt(limit, 10);

  // 検索
  const search = searchParams.get('search');
  if (search) filters.search = search;

  // ソート
  const sort = searchParams.get('sort');
  if (sort) filters.sort = sort;

  const order = searchParams.get('order');
  if (order && (order === 'asc' || order === 'desc')) filters.order = order;

  // 配列パラメータ
  const roastLevel = searchParams.get('roastLevel');
  if (roastLevel) filters.roastLevel = roastLevel.split(',').map((level) => level as RoastLevel);

  const grindSize = searchParams.get('grindSize');
  if (grindSize) filters.grindSize = grindSize.split(',').map((size) => size as GrindSize);

  const equipment = searchParams.get('equipment');
  if (equipment) filters.equipment = equipment.split(',');

  // オブジェクトパラメータ
  const beanWeight = searchParams.get('beanWeight');
  if (beanWeight) {
    try {
      filters.beanWeight = JSON.parse(beanWeight);
    } catch (e) {
      console.error('beanWeight解析エラー:', e);
    }
  }

  const waterTemp = searchParams.get('waterTemp');
  if (waterTemp) {
    try {
      filters.waterTemp = JSON.parse(waterTemp);
    } catch (e) {
      console.error('waterTemp解析エラー:', e);
    }
  }

  return filters;
}
