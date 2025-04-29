import { Recipe } from '../types/recipe';

export const recipes: Recipe[] = [
  {
    id: 1n,
    title: 'World Brewers Cup 2016 チャンピオンレシピ',
    summary: '2016年チャンピオン粕谷哲さんが考案したレシピ',
    equipment: ['Timemore C3', 'Hario V60', 'アバカフィルター'],
    roastLevel: '浅煎り',
    grindSize: '粗挽き',
    beanWeight: 15,
    waterTemp: 92,
    waterAmount: 225,
  },
  {
    id: 2n,
    title: 'シンプルで美味しいコーヒー',
    summary: '初心者でも簡単に作れる基本のレシピ',
    equipment: ['Hario V60', 'アバカフィルター'],
    roastLevel: '中煎り',
    grindSize: '中挽き',
    beanWeight: 18,
    waterTemp: 90,
    waterAmount: 300,
  },
  {
    id: 3n,
    title: '濃厚なフレンチプレス',
    summary: 'ボディのあるコーヒーが楽しめる',
    equipment: ['フレンチプレス'],
    roastLevel: '深煎り',
    grindSize: '粗挽き',
    beanWeight: 30,
    waterTemp: 95,
    waterAmount: 450,
  },
];
