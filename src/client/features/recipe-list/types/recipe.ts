import type { RoastLevel, GrindSize } from '@prisma/client';

export type Recipe = {
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
};
