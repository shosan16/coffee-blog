import type { Meta, StoryObj } from '@storybook/react';

import RecipeEquipmentList from './RecipeEquipmentList';
import type { DetailedEquipmentInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/RecipeEquipmentList',
  component: RecipeEquipmentList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'レシピで使用する器具の一覧を表示するコンポーネント。アフィリエイトリンクにも対応しています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    equipment: {
      description: '使用器具の配列',
    },
  },
} satisfies Meta<typeof RecipeEquipmentList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的な器具データ
const basicEquipment: DetailedEquipmentInfo[] = [
  {
    id: '1',
    name: 'V60ドリッパー 02',
    brand: 'HARIO',
    description:
      '円錐形ドリッパーの代表格。リブが螺旋状になっており、お湯の流れをコントロールしやすい。',
    affiliateLink: 'https://amazon.co.jp/hario-v60-dripper',
    equipmentType: {
      id: '1',
      name: 'ドリッパー',
      description: 'コーヒーを抽出するための器具',
    },
  },
  {
    id: '2',
    name: 'コーヒースケール',
    brand: 'Acaia',
    description: '0.1g単位での精密な計量が可能。タイマー機能付きで抽出時間も管理できる。',
    affiliateLink: 'https://amazon.co.jp/acaia-scale',
    equipmentType: {
      id: '2',
      name: 'スケール',
      description: '重量を測定する器具',
    },
  },
];

// アフィリエイトリンクなし器具
const noAffiliateEquipment: DetailedEquipmentInfo[] = [
  {
    id: '3',
    name: 'ペーパーフィルター',
    brand: 'HARIO',
    description: '漂白タイプのペーパーフィルター。紙の匂いが少なく、クリーンな味わいを実現。',
    equipmentType: {
      id: '3',
      name: 'フィルター',
      description: 'コーヒーを濾過する紙',
    },
  },
  {
    id: '4',
    name: 'コーヒーミル',
    equipmentType: {
      id: '4',
      name: 'ミル',
      description: 'コーヒー豆を挽く器具',
    },
  },
];

// 詳細情報の器具
const detailedEquipment: DetailedEquipmentInfo[] = [
  {
    id: '5',
    name: 'Chemex 6-Cup クラシック',
    brand: 'Chemex Corporation',
    description:
      '1941年にドイツの化学者ペーター・シュルンボームによって開発された一体型コーヒーメーカー。専用の厚手フィルターを使用し、澄み切った味わいのコーヒーを抽出できる。',
    affiliateLink: 'https://amazon.co.jp/chemex-6cup-classic',
    equipmentType: {
      id: '5',
      name: 'ポアオーバー',
      description: '重力を利用したドリップ式抽出器具',
    },
  },
  {
    id: '6',
    name: 'Fellow Ode Brew Grinder',
    brand: 'Fellow',
    description:
      'ドリップコーヒー専用に設計されたフラットバーグラインダー。64mmのステンレススチール製フラットバーを搭載し、均一な粒度でコーヒー豆を挽くことができる。31段階の挽き目調整が可能。',
    affiliateLink: 'https://amazon.co.jp/fellow-ode-grinder',
    equipmentType: {
      id: '6',
      name: 'グラインダー',
      description: 'コーヒー豆を挽く電動器具',
    },
  },
  {
    id: '7',
    name: 'ドリップケトル 雲海',
    brand: 'Kalita',
    description:
      '0.7Lの容量を持つ細口ケトル。注湯のコントロールがしやすく、初心者から上級者まで幅広く愛用されている。ステンレス製で耐久性も抜群。',
    affiliateLink: 'https://amazon.co.jp/kalita-unkai-kettle',
    equipmentType: {
      id: '7',
      name: 'ケトル',
      description: 'お湯を沸かし、注ぐための器具',
    },
  },
];

// 特殊文字を含む器具
const specialCharacterEquipment: DetailedEquipmentInfo[] = [
  {
    id: '8',
    name: 'Chemex® 8-Cup クラシック',
    brand: 'Chemex & Co.',
    description:
      '特許取得済みの濾過システム（※要交換フィルター）。FDA認定の素材を使用し、BPA-フリー設計。',
    affiliateLink: 'https://amazon.co.jp/chemex-8cup-special',
    equipmentType: {
      id: '8',
      name: 'ポアオーバー/ドリッパー',
      description: '一体型抽出器具',
    },
  },
  {
    id: '9',
    name: '温度計 + タイマー',
    brand: 'サーモプロ™',
    description: '±0.1℃の精度での温度測定 & 0.01秒単位のタイマー機能搭載。',
    equipmentType: {
      id: '9',
      name: '測定器具',
      description: '温度・時間を測定する器具',
    },
  },
];

// 最小限の器具データ
const minimalEquipment: DetailedEquipmentInfo[] = [
  {
    id: '10',
    name: 'シンプルドリッパー',
    equipmentType: {
      id: '10',
      name: 'ドリッパー',
    },
  },
];

export const Default: Story = {
  args: {
    equipment: basicEquipment,
  },
};

export const Empty: Story = {
  name: '空の器具',
  args: {
    equipment: [],
  },
  parameters: {
    docs: {
      description: {
        story: '器具が登録されていない場合の表示例。',
      },
    },
  },
};

export const WithoutAffiliateLinks: Story = {
  name: 'アフィリエイトリンクなし',
  args: {
    equipment: noAffiliateEquipment,
  },
  parameters: {
    docs: {
      description: {
        story: 'アフィリエイトリンクがない器具の表示例。購入リンクが表示されません。',
      },
    },
  },
};

export const DetailedEquipment: Story = {
  name: '詳細な器具情報',
  args: {
    equipment: detailedEquipment,
  },
  parameters: {
    docs: {
      description: {
        story: '詳細な説明文を含む器具の表示例。プロ仕様の器具を想定。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字含む',
  args: {
    equipment: specialCharacterEquipment,
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号を含む器具情報の表示例。',
      },
    },
  },
};

export const MinimalInfo: Story = {
  name: '最小情報',
  args: {
    equipment: minimalEquipment,
  },
  parameters: {
    docs: {
      description: {
        story: '必須フィールドのみの最小構成。名前と器具タイプのみ表示。',
      },
    },
  },
};

export const MixedEquipment: Story = {
  name: '混合器具',
  args: {
    equipment: [
      ...basicEquipment,
      ...noAffiliateEquipment.slice(0, 1),
      {
        id: '11',
        name: 'プレミアムフィルター',
        brand: 'Blue Bottle Coffee',
        description: 'Blue Bottle Coffee専用の高品質ペーパーフィルター。',
        affiliateLink: 'https://store.bluebottlecoffee.com/filters',
        equipmentType: {
          id: '11',
          name: 'フィルター',
          description: 'プレミアムペーパーフィルター',
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '様々な種類の器具を混合した表示例。リアルなレシピを想定。',
      },
    },
  },
};

export const SingleEquipment: Story = {
  name: '単一器具',
  args: {
    equipment: [basicEquipment[0]],
  },
  parameters: {
    docs: {
      description: {
        story: '単一の器具のみの表示例。',
      },
    },
  },
};
