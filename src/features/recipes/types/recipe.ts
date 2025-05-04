export type Recipe = {
  id: bigint;
  title: string;
  summary: string;
  equipment: string[];
  roastLevel: string;
  grindSize: string;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
};
