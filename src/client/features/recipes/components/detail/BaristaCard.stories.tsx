import type { Meta, StoryObj } from '@storybook/react';

import BaristaCard from './BaristaCard';
import type { BaristaInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/BaristaCard',
  component: BaristaCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'バリスタ情報を表示するカードコンポーネント。プロフィール、所属、SNSリンクを表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    barista: {
      description: 'バリスタの詳細情報',
    },
  },
} satisfies Meta<typeof BaristaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なバリスタ情報
const basicBarista: BaristaInfo = {
  id: '1',
  name: '佐藤花子',
  affiliation: 'Specialty Coffee Shop ARIA',
  socialLinks: [
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/coffee_hanako',
    },
    {
      id: '2',
      platform: 'Twitter',
      url: 'https://twitter.com/coffee_hanako',
    },
  ],
};

// 所属なしバリスタ
const independentBarista: BaristaInfo = {
  id: '2',
  name: '田中太郎',
  socialLinks: [
    {
      id: '3',
      platform: 'YouTube',
      url: 'https://youtube.com/@coffee_taro',
    },
  ],
};

// SNSなしバリスタ
const noSocialBarista: BaristaInfo = {
  id: '3',
  name: '山田次郎',
  affiliation: 'Independent Coffee Roaster',
  socialLinks: [],
};

// 多数のSNSリンクを持つバリスタ
const multiSocialBarista: BaristaInfo = {
  id: '4',
  name: 'Emily Wilson',
  affiliation: 'Tokyo International Coffee House',
  socialLinks: [
    {
      id: '4',
      platform: 'Instagram',
      url: 'https://instagram.com/emily_coffee',
    },
    {
      id: '5',
      platform: 'Twitter',
      url: 'https://twitter.com/emily_coffee',
    },
    {
      id: '6',
      platform: 'YouTube',
      url: 'https://youtube.com/@emily_coffee',
    },
    {
      id: '7',
      platform: 'TikTok',
      url: 'https://tiktok.com/@emily_coffee',
    },
    {
      id: '8',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/emily-coffee',
    },
  ],
};

export const Default: Story = {
  args: {
    barista: basicBarista,
  },
};

export const WithoutAffiliation: Story = {
  name: '所属なし',
  args: {
    barista: independentBarista,
  },
  parameters: {
    docs: {
      description: {
        story: '所属情報がないバリスタの表示例。フリーランスや独立系のバリスタを想定。',
      },
    },
  },
};

export const WithoutSocialLinks: Story = {
  name: 'SNSリンクなし',
  args: {
    barista: noSocialBarista,
  },
  parameters: {
    docs: {
      description: {
        story: 'SNSリンクがないバリスタの表示例。SNSセクション自体が表示されません。',
      },
    },
  },
};

export const WithMultipleSocialLinks: Story = {
  name: '複数SNSリンク',
  args: {
    barista: multiSocialBarista,
  },
  parameters: {
    docs: {
      description: {
        story: '複数のSNSプラットフォームを使用しているバリスタの表示例。',
      },
    },
  },
};

export const WithLongName: Story = {
  name: '長い名前',
  args: {
    barista: {
      id: '5',
      name: 'Christopher Alessandro Rodriguez-Martinez',
      affiliation: 'European Coffee Culture Research Institute & Academy',
      socialLinks: [
        {
          id: '9',
          platform: 'Instagram',
          url: 'https://instagram.com/chris_coffee_research',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '長い名前と所属名の表示例。テキストの折り返しとレイアウトの確認。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字',
  args: {
    barista: {
      id: '6',
      name: "O'Connor & Smith-Johnson",
      affiliation: 'Café "L\'Excellence" ★★★',
      socialLinks: [
        {
          id: '10',
          platform: 'インスタグラム',
          url: 'https://instagram.com/oconnor_coffee',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号、日本語を含む情報の表示例。エスケープ処理の確認。',
      },
    },
  },
};

export const Minimal: Story = {
  name: '最小構成',
  args: {
    barista: {
      id: '7',
      name: '最小バリスタ',
      socialLinks: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '必須フィールドのみの最小構成。名前のみ表示。',
      },
    },
  },
};
