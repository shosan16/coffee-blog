import type { Meta, StoryObj } from '@storybook/react';

import RecipeTagList from './RecipeTagList';
import type { RecipeTagInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/RecipeTagList',
  component: RecipeTagList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'レシピに関連するタグを表示するコンポーネント。カテゴリー分類や検索用のラベルとして機能します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tags: {
      description: 'タグ情報の配列',
    },
  },
} satisfies Meta<typeof RecipeTagList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なタグデータ
const basicTags: RecipeTagInfo[] = [
  {
    id: '1',
    name: 'フルーティー',
    slug: 'fruity',
  },
  {
    id: '2',
    name: 'ライトロースト',
    slug: 'light-roast',
  },
  {
    id: '3',
    name: 'エチオピア',
    slug: 'ethiopia',
  },
];

// 多数のタグ
const manyTags: RecipeTagInfo[] = [
  {
    id: '1',
    name: 'フルーティー',
    slug: 'fruity',
  },
  {
    id: '2',
    name: 'ライトロースト',
    slug: 'light-roast',
  },
  {
    id: '3',
    name: 'エチオピア',
    slug: 'ethiopia',
  },
  {
    id: '4',
    name: 'イルガチェフェ',
    slug: 'yirgacheffe',
  },
  {
    id: '5',
    name: 'ナチュラル製法',
    slug: 'natural-process',
  },
  {
    id: '6',
    name: 'V60',
    slug: 'v60',
  },
  {
    id: '7',
    name: 'ペーパードリップ',
    slug: 'paper-drip',
  },
  {
    id: '8',
    name: '初心者向け',
    slug: 'beginner-friendly',
  },
  {
    id: '9',
    name: 'プロフェッショナル',
    slug: 'professional',
  },
  {
    id: '10',
    name: 'World Brewers Cup',
    slug: 'world-brewers-cup',
  },
];

// 長いタグ名
const longNameTags: RecipeTagInfo[] = [
  {
    id: '1',
    name: 'エチオピア・イルガチェフェ・ゲデオ地区',
    slug: 'ethiopia-yirgacheffe-gedeo',
  },
  {
    id: '2',
    name: 'World Brewers Cup チャンピオンレシピ',
    slug: 'world-brewers-cup-champion-recipe',
  },
  {
    id: '3',
    name: 'スペシャルティコーヒー協会認定',
    slug: 'sca-certified',
  },
];

// 特殊文字を含むタグ
const specialCharacterTags: RecipeTagInfo[] = [
  {
    id: '1',
    name: 'Chemex®',
    slug: 'chemex',
  },
  {
    id: '2',
    name: 'V60 & アフィニティ',
    slug: 'v60-and-affinity',
  },
  {
    id: '3',
    name: '92℃抽出',
    slug: '92c-extraction',
  },
  {
    id: '4',
    name: 'CO₂ガス抜き',
    slug: 'co2-degassing',
  },
];

// 日英混合タグ
const multilingualTags: RecipeTagInfo[] = [
  {
    id: '1',
    name: 'Ethiopian Natural',
    slug: 'ethiopian-natural',
  },
  {
    id: '2',
    name: 'Hand Drip 手動抽出',
    slug: 'hand-drip',
  },
  {
    id: '3',
    name: 'Pour Over ドリップ',
    slug: 'pour-over',
  },
  {
    id: '4',
    name: 'Specialty Coffee',
    slug: 'specialty-coffee',
  },
];

// カテゴリー別タグ
const categorizedTags: RecipeTagInfo[] = [
  // 産地
  {
    id: '1',
    name: 'エチオピア',
    slug: 'ethiopia',
  },
  {
    id: '2',
    name: 'コロンビア',
    slug: 'colombia',
  },
  // 焙煎度
  {
    id: '3',
    name: 'ライトロースト',
    slug: 'light-roast',
  },
  {
    id: '4',
    name: 'ミディアムロースト',
    slug: 'medium-roast',
  },
  // 抽出方法
  {
    id: '5',
    name: 'V60',
    slug: 'v60',
  },
  {
    id: '6',
    name: 'Chemex',
    slug: 'chemex',
  },
  // 難易度
  {
    id: '7',
    name: '初心者向け',
    slug: 'beginner',
  },
  {
    id: '8',
    name: '上級者向け',
    slug: 'advanced',
  },
];

export const Default: Story = {
  args: {
    tags: basicTags,
  },
};

export const Empty: Story = {
  name: '空のタグ',
  args: {
    tags: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'タグが設定されていない場合の表示例。',
      },
    },
  },
};

export const SingleTag: Story = {
  name: '単一タグ',
  args: {
    tags: [basicTags[0]],
  },
  parameters: {
    docs: {
      description: {
        story: '単一のタグのみの表示例。',
      },
    },
  },
};

export const ManyTags: Story = {
  name: '多数のタグ',
  args: {
    tags: manyTags,
  },
  parameters: {
    docs: {
      description: {
        story: '多数のタグの表示例。タグが折り返されてレイアウトされる様子を確認。',
      },
    },
  },
};

export const LongTagNames: Story = {
  name: '長いタグ名',
  args: {
    tags: longNameTags,
  },
  parameters: {
    docs: {
      description: {
        story: '長いタグ名の表示例。テキストの折り返しとレイアウトの確認。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字含む',
  args: {
    tags: specialCharacterTags,
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号を含むタグの表示例。商標記号、度数記号、化学式などを含む。',
      },
    },
  },
};

export const MultilingualTags: Story = {
  name: '多言語タグ',
  args: {
    tags: multilingualTags,
  },
  parameters: {
    docs: {
      description: {
        story: '日本語と英語が混在するタグの表示例。国際的なレシピを想定。',
      },
    },
  },
};

export const CategorizedTags: Story = {
  name: 'カテゴリー別タグ',
  args: {
    tags: categorizedTags,
  },
  parameters: {
    docs: {
      description: {
        story: '産地、焙煎度、抽出方法、難易度など様々なカテゴリーのタグを含む表示例。',
      },
    },
  },
};

export const FlavorTags: Story = {
  name: 'フレーバータグ',
  args: {
    tags: [
      {
        id: '1',
        name: 'フルーティー',
        slug: 'fruity',
      },
      {
        id: '2',
        name: 'チョコレート',
        slug: 'chocolate',
      },
      {
        id: '3',
        name: 'ナッツ',
        slug: 'nutty',
      },
      {
        id: '4',
        name: 'フローラル',
        slug: 'floral',
      },
      {
        id: '5',
        name: 'シトラス',
        slug: 'citrus',
      },
      {
        id: '6',
        name: 'ベリー',
        slug: 'berry',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'フレーバーノートを表すタグの表示例。味わいの特徴を示すラベル。',
      },
    },
  },
};

export const MethodTags: Story = {
  name: '抽出方法タグ',
  args: {
    tags: [
      {
        id: '1',
        name: 'V60',
        slug: 'v60',
      },
      {
        id: '2',
        name: 'Chemex',
        slug: 'chemex',
      },
      {
        id: '3',
        name: 'フレンチプレス',
        slug: 'french-press',
      },
      {
        id: '4',
        name: 'エアロプレス',
        slug: 'aeropress',
      },
      {
        id: '5',
        name: 'エスプレッソ',
        slug: 'espresso',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '抽出方法を表すタグの表示例。使用する器具や技法を示すラベル。',
      },
    },
  },
};

export const DifficultyTags: Story = {
  name: '難易度タグ',
  args: {
    tags: [
      {
        id: '1',
        name: '初心者向け',
        slug: 'beginner',
      },
      {
        id: '2',
        name: '中級者向け',
        slug: 'intermediate',
      },
      {
        id: '3',
        name: '上級者向け',
        slug: 'advanced',
      },
      {
        id: '4',
        name: 'プロフェッショナル',
        slug: 'professional',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '難易度を表すタグの表示例。レシピの習得レベルを示すラベル。',
      },
    },
  },
};
