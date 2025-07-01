import type { Meta, StoryObj } from '@storybook/react';

import ServerRecipeDetailError from './ServerRecipeDetailError';

const meta = {
  title: 'Features/Recipes/Detail/ServerRecipeDetailError',
  component: ServerRecipeDetailError,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'サーバーサイドエラー用の表示コンポーネント。レシピ取得に失敗した場合に表示されます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'エラーのタイトル',
      control: { type: 'text' },
    },
    message: {
      description: 'エラーメッセージ',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ServerRecipeDetailError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'エラーが発生しました',
    message: '予期しないエラーが発生しました。',
  },
};

export const ServerError: Story = {
  name: 'サーバーエラー',
  args: {
    title: 'サーバーエラー',
    message: 'レシピの取得中にエラーが発生しました。しばらく待ってから再度お試しください。',
  },
  parameters: {
    docs: {
      description: {
        story: 'サーバー側でエラーが発生した場合の表示例。',
      },
    },
  },
};

export const NotFound: Story = {
  name: 'レシピが見つからない',
  args: {
    title: 'レシピが見つかりません',
    message: '指定されたレシピは存在しないか、削除された可能性があります。',
  },
  parameters: {
    docs: {
      description: {
        story: 'レシピが見つからない場合の表示例。404エラーを想定。',
      },
    },
  },
};

export const NetworkError: Story = {
  name: 'ネットワークエラー',
  args: {
    title: 'ネットワークエラー',
    message: 'インターネット接続を確認してから再度お試しください。',
  },
  parameters: {
    docs: {
      description: {
        story: 'ネットワーク接続に問題がある場合の表示例。',
      },
    },
  },
};

export const DatabaseError: Story = {
  name: 'データベースエラー',
  args: {
    title: 'データ取得エラー',
    message: 'データベースとの接続に問題が発生しています。システム管理者にお問い合わせください。',
  },
  parameters: {
    docs: {
      description: {
        story: 'データベース接続エラーの表示例。',
      },
    },
  },
};

export const AccessDenied: Story = {
  name: 'アクセス拒否',
  args: {
    title: 'アクセス権限エラー',
    message: 'このレシピにアクセスする権限がありません。ログインしてから再度お試しください。',
  },
  parameters: {
    docs: {
      description: {
        story: 'アクセス権限がない場合の表示例。403エラーを想定。',
      },
    },
  },
};

export const MaintenanceMode: Story = {
  name: 'メンテナンス中',
  args: {
    title: 'メンテナンス中',
    message:
      '現在システムメンテナンスを実施しております。しばらく時間をおいてからアクセスしてください。',
  },
  parameters: {
    docs: {
      description: {
        story: 'システムメンテナンス中の表示例。',
      },
    },
  },
};

export const LongErrorMessage: Story = {
  name: '長いエラーメッセージ',
  args: {
    title: '詳細なエラー情報',
    message:
      'このエラーは複数の原因により発生している可能性があります。まず、インターネット接続を確認してください。次に、ブラウザのキャッシュをクリアしてから再度アクセスしてみてください。それでも問題が解決しない場合は、しばらく時間を置いてから再度お試しいただくか、システム管理者までお問い合わせください。ご不便をおかけして申し訳ございません。',
  },
  parameters: {
    docs: {
      description: {
        story: '長いエラーメッセージの表示例。詳細な説明が必要な場合を想定。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字含む',
  args: {
    title: 'HTTP 500エラー',
    message:
      'サーバー内部エラーが発生しました（エラーコード: ERR_500_INTERNAL）。詳細: データベース接続タイムアウト（30秒）',
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号を含むエラーメッセージの表示例。',
      },
    },
  },
};

export const WithEmojis: Story = {
  name: '絵文字含む',
  args: {
    title: '⚠️ 一時的なエラー',
    message:
      '🔧 メンテナンス中です。しばらくお待ちください... 📱 モバイルアプリもご利用いただけます。',
  },
  parameters: {
    docs: {
      description: {
        story: '絵文字を含むエラーメッセージの表示例。親しみやすい表現を想定。',
      },
    },
  },
};

export const EmptyTitle: Story = {
  name: '空のタイトル',
  args: {
    title: '',
    message: 'タイトルが設定されていないエラーです。',
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルが空の場合の表示例。',
      },
    },
  },
};

export const EmptyMessage: Story = {
  name: '空のメッセージ',
  args: {
    title: 'エラータイトルのみ',
    message: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'メッセージが空の場合の表示例。',
      },
    },
  },
};

export const MultilineMessage: Story = {
  name: '複数行メッセージ',
  args: {
    title: '複数の問題が発生',
    message:
      '以下の問題が発生している可能性があります：\n\n1. ネットワーク接続の問題\n2. サーバーの一時的な障害\n3. ブラウザキャッシュの問題\n\n各項目をご確認ください。',
  },
  parameters: {
    docs: {
      description: {
        story: '改行を含む複数行メッセージの表示例。',
      },
    },
  },
};
