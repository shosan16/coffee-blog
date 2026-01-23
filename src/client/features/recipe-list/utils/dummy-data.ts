import type { RoastLevel } from '@prisma/client';

/**
 * 焙煎度別のタグプール
 * 浅煎りはフルーティ・酸味系、深煎りはビター・コク系の傾向
 */
const TAG_POOLS: Record<string, string[]> = {
  // 浅煎り系（LIGHT, LIGHT_MEDIUM）: フルーティ・酸味・華やか
  LIGHT: [
    'フローラル',
    'ベリー系',
    '明るい酸味',
    '華やか',
    'シトラス',
    '紅茶のような',
    '爽やか',
    'クリーン',
    'フルーティ',
    '軽やか',
  ],
  LIGHT_MEDIUM: [
    'フルーティ',
    '酸味強め',
    'シングルオリジン',
    'ジャスミン',
    'ピーチ',
    '繊細',
    'エレガント',
    '紅茶のような',
    '華やか',
    'クリーン',
  ],
  // 中煎り系（MEDIUM）: バランス・ナッツ・キャラメル
  MEDIUM: [
    'ナッツ',
    'キャラメル',
    'マイルド',
    'バランス',
    '毎日向け',
    '飲みやすい',
    'チョコレート',
    'まろやか',
    '甘み',
    'コク',
  ],
  // 中深煎り系（MEDIUM_DARK）: チョコ・甘み・コク
  MEDIUM_DARK: [
    'チョコレート',
    'ほのかな甘み',
    'コク',
    'ハチミツ',
    'まろやか',
    '甘み',
    'ナッツ',
    'ダークチョコ',
    'ロースト感',
    '深み',
  ],
  // 深煎り系（DARK）: スパイシー・ビター・重厚
  DARK: [
    'スパイシー',
    'アーシー',
    'ボディ強め',
    '重厚',
    '深い苦味',
    '複雑な香り',
    'ダークチョコ',
    'ロースト感',
    'ビター',
    '濃厚',
  ],
  // 極深煎り系（FRENCH）: スモーキー・濃厚・エスプレッソ
  FRENCH: [
    'スモーキー',
    'ビター',
    '濃厚',
    'エスプレッソ向け',
    'ミルクに合う',
    'パンチ',
    'ラテ向け',
    '深いコク',
    '力強い',
    'インパクト',
  ],
};

/**
 * 投稿者名のプール
 */
const AUTHOR_NAMES = [
  'COFFEE LAB',
  '鈴木エスプレッソ',
  'Morning Brew',
  'Cafe Noir',
  '珈琲職人',
  'Espresso Master',
  'Specialty Coffee Tokyo',
  'Light Roast Fan',
  '珈琲屋たろう',
  'Coffee Daily',
  'Latte Art Studio',
  'Honey Process Lab',
  'Blue Bottle愛好家',
  'コーヒーマニア',
  'バリスタ見習い',
];

/**
 * 文字列をシンプルなハッシュ値に変換する
 * 決定論的な結果を得るための内部ヘルパー
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * レシピIDと焙煎度から決定論的にタグを生成する
 * @param recipeId - レシピの一意識別子
 * @param roastLevel - 焙煎度
 * @returns 生成されたタグの配列（3〜6個）
 */
export function generateDummyTags(recipeId: string, roastLevel: RoastLevel): string[] {
  const hash = simpleHash(recipeId);
  const tagPool = TAG_POOLS[roastLevel] ?? TAG_POOLS.MEDIUM;

  const tagCount = 3 + (hash % 4);

  // シャッフルされた順序でタグを選択
  const selectedTags: string[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < tagCount; i++) {
    let index = (hash + i * 7) % tagPool.length;

    // 重複を避けるために次の未使用インデックスを探す
    let attempts = 0;
    while (usedIndices.has(index) && attempts < tagPool.length) {
      index = (index + 1) % tagPool.length;
      attempts++;
    }

    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selectedTags.push(tagPool[index]);
    }
  }

  return selectedTags;
}

/**
 * レシピIDから決定論的に投稿者名を生成する
 * @param recipeId - レシピの一意識別子
 * @returns 生成された投稿者名
 */
export function generateDummyAuthor(recipeId: string): string {
  const hash = simpleHash(recipeId);
  const index = hash % AUTHOR_NAMES.length;
  return AUTHOR_NAMES[index];
}
