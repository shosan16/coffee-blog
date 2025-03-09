export type Recipe = {
  id: string;
  title: string;
  description: string;
  equipment: string[];
  brewMethod: string;
  roastLevel: string;
  grindSize: string;
  coffeeAmount: string;
  waterTemp: string;
  totalWater: string;
  createdAt: Date;
  updatedAt: Date;
};
