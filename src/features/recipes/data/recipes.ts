import { Recipe } from '../types/recipe';

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'World Brewers Cup 2016 チャンピオンレシピ',
    description: '2016年チャンピオン粕谷哲さんが考案したレシピ',
    equipment: ['Timemore C3', 'Hario V60', 'アバカフィルター'],
    brewMethod: 'Pour Over',
    roastLevel: '浅煎り',
    grindSize: '粗挽き',
    coffeeAmount: '15g',
    waterTemp: '92度',
    totalWater: '225g',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'シンプルで美味しいコーヒー',
    description: '初心者でも簡単に作れる基本のレシピ',
    equipment: ['Hario V60', 'アバカフィルター'],
    brewMethod: 'Pour Over',
    roastLevel: '中煎り',
    grindSize: '中挽き',
    coffeeAmount: '18g',
    waterTemp: '90度',
    totalWater: '300g',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: '濃厚なフレンチプレス',
    description: 'ボディのあるコーヒーが楽しめる',
    equipment: ['フレンチプレス'],
    brewMethod: 'French Press',
    roastLevel: '深煎り',
    grindSize: '粗挽き',
    coffeeAmount: '30g',
    waterTemp: '95度',
    totalWater: '500g',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];
