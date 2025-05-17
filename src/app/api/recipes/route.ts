import { PrismaClient, RoastLevel, GrindSize } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { RecipeListResponse } from '@/client/features/recipes/types/api';
import type { Recipe } from '@/server/features/recipes/types/recipe';
import type { ErrorResponse } from '@/server/shared/api-error';

// PrismaClientのグローバルインスタンスを宣言
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// シングルトンパターンでPrismaClientを初期化
const prisma = globalForPrisma.prisma || new PrismaClient();

// 開発環境では、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// バリデーションスキーマ
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  roastLevel: z.array(z.nativeEnum(RoastLevel)).optional(),
  grindSize: z.array(z.nativeEnum(GrindSize)).optional(),
  equipment: z.array(z.string()).optional(),
  beanWeight: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  waterTemp: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(
  request: Request
): Promise<NextResponse<RecipeListResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // パラメータのバリデーション
    const validatedParams = querySchema.parse({
      ...params,
      roastLevel: params.roastLevel?.split(',').map((level) => level as RoastLevel),
      grindSize: params.grindSize?.split(',').map((size) => size as GrindSize),
      equipment: params.equipment?.split(','),
      beanWeight: params.beanWeight ? JSON.parse(params.beanWeight) : undefined,
      waterTemp: params.waterTemp ? JSON.parse(params.waterTemp) : undefined,
    });

    // Prismaクエリの構築
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isPublished: true, // 公開済みの投稿のみを取得
    };

    // 絞り込み条件の追加
    if (validatedParams.roastLevel?.length) {
      where.roastLevel = {
        in: validatedParams.roastLevel,
      };
    }

    if (validatedParams.grindSize?.length) {
      where.grindSize = {
        in: validatedParams.grindSize,
      };
    }

    if (validatedParams.equipment?.length) {
      where.equipment = {
        some: {
          name: {
            in: validatedParams.equipment,
          },
        },
      };
    }

    if (validatedParams.beanWeight) {
      const { min, max } = validatedParams.beanWeight;
      if (min !== undefined) {
        where.beanWeight = {
          ...where.beanWeight,
          gte: min,
        };
      }
      if (max !== undefined) {
        where.beanWeight = {
          ...where.beanWeight,
          lte: max,
        };
      }
    }

    if (validatedParams.waterTemp) {
      const { min, max } = validatedParams.waterTemp;
      if (min !== undefined) {
        where.waterTemp = {
          ...where.waterTemp,
          gte: min,
        };
      }
      if (max !== undefined) {
        where.waterTemp = {
          ...where.waterTemp,
          lte: max,
        };
      }
    }

    if (validatedParams.search) {
      const searchTerm = validatedParams.search;
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // ソート条件の設定
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};
    if (validatedParams.sort) {
      orderBy[validatedParams.sort] = validatedParams.order || 'asc';
    } else {
      orderBy.id = 'asc'; // デフォルトはID昇順
    }

    // ページネーション設定
    const skip = (validatedParams.page - 1) * validatedParams.limit;
    const take = validatedParams.limit;

    // データベースからデータを取得
    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          equipment: {
            include: {
              equipmentType: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
    ]);

    // データベースから取得したデータをAPIレスポンス形式に変換
    const recipes: Recipe[] = posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      summary: post.summary || '',
      equipment: post.equipment.map((eq) => eq.name),
      roastLevel: post.roastLevel,
      grindSize: post.grindSize || null,
      beanWeight: post.beanWeight || 0,
      waterTemp: post.waterTemp || 0,
      waterAmount: post.waterAmount || 0,
    }));

    // レスポンス作成
    return NextResponse.json({
      recipes,
      pagination: {
        currentPage: validatedParams.page,
        totalPages: Math.ceil(totalCount / validatedParams.limit),
        totalItems: totalCount,
        itemsPerPage: validatedParams.limit,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          code: 'INVALID_PARAMETERS',
          message: 'パラメータが不正です',
          details: Object.fromEntries(
            error.errors.map((err) => [err.path.join('.'), [err.message]])
          ),
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '予期せぬエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
