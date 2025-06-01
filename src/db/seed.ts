import { faker } from '@faker-js/faker/locale/ja';
import { PrismaClient, GrindSize, RoastLevel } from '@prisma/client';

// グローバル変数の宣言
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// PrismaClientのシングルトンインスタンスを作成
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 開発環境では、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const TOTAL_POSTS = 40;

const ROAST_LEVEL_LABELS = {
  [RoastLevel.LIGHT]: 'ライト',
  [RoastLevel.LIGHT_MEDIUM]: 'ライトミディアム',
  [RoastLevel.MEDIUM]: 'ミディアム',
  [RoastLevel.MEDIUM_DARK]: 'ミディアムダーク',
  [RoastLevel.DARK]: 'ダーク',
  [RoastLevel.FRENCH]: 'フレンチ',
};

const GRIND_SIZE_LABELS = {
  [GrindSize.EXTRA_FINE]: '極細挽き',
  [GrindSize.FINE]: '細挽き',
  [GrindSize.MEDIUM_FINE]: '中細挽き',
  [GrindSize.MEDIUM]: '中挽き',
  [GrindSize.MEDIUM_COARSE]: '中粗挽き',
  [GrindSize.COARSE]: '粗挽き',
  [GrindSize.EXTRA_COARSE]: '極粗挽き',
};

const WATER_TEMPS = [85, 88, 90, 92, 94, 96];

const BREWING_METHODS = [
  'ハンドドリップ',
  'フレンチプレス',
  'エアロプレス',
  'サイフォン',
  'エスプレッソ',
  'ペーパードリップ',
  'ネルドリップ',
  '水出し',
];

const COFFEE_ORIGINS = [
  'エチオピア',
  'コロンビア',
  'ブラジル',
  'グアテマラ',
  'コスタリカ',
  'ケニア',
  'インドネシア',
  'ルワンダ',
  'タンザニア',
  'ホンジュラス',
  'ペルー',
  'ベトナム',
];

const DRIPPER_EQUIPMENT = [
  'HARIO V60',
  'Kalita Wave',
  'ORIGAMI ドリッパー',
  'KONO 名門ドリッパー',
  'TORCH マウンテンドリッパー',
  'CHEMEX',
  'メリタ式ドリッパー',
  'エアロプレス',
  'ボダム フレンチプレス',
  'ユニフレーム コーヒーバネット',
  'ロケッツ ミレニアム',
];

const GRINDER_EQUIPMENT = [
  'Timemore C2',
  'コマンダンテ C40',
  'ポーレックス ミニ',
  'ハリオ スマート G',
  'Wilfa Svart',
  'バラッツァ エンコア',
  'カリタ ナイスカット G',
  'ナイトフォール K0',
  'フェロー オデ',
  'カフラーノ ORO',
  '1Zpresso K-Plus',
];

const FILTER_EQUIPMENT = [
  'HARIO V60ペーパーフィルター',
  'Kalita ウェーブフィルター',
  'KONO 円錐フィルター',
  'CHEMEX フィルター',
  'メリタ バンブーフィルター',
  'アビー コーヒーフィルター',
  'ブルーボトル コーヒーフィルター',
  'エアロプレス フィルター',
  'ネルドリップ クロス',
  'CAFEC アバカフィルター',
  'クナ ステンレスフィルター',
];

// 器具タイプごとの機器マップ
const EQUIPMENT_MAP: Record<string, string[]> = {
  '1': DRIPPER_EQUIPMENT,
  '2': GRINDER_EQUIPMENT,
  '3': FILTER_EQUIPMENT,
};

// ブランド名のマップ
const BRAND_MAP: Record<string, string> = {
  'HARIO V60': 'HARIO',
  'Kalita Wave': 'Kalita',
  'ORIGAMI ドリッパー': 'ORIGAMI',
  'KONO 名門ドリッパー': 'KONO',
  'TORCH マウンテンドリッパー': 'TORCH',
  CHEMEX: 'CHEMEX',
  メリタ式ドリッパー: 'メリタ',
  エアロプレス: 'Aerobie',
  'ボダム フレンチプレス': 'BODUM',
  'ユニフレーム コーヒーバネット': 'UNIFLAME',
  'ロケッツ ミレニアム': 'Rocket Espresso',
  'Timemore C2': 'Timemore',
  'コマンダンテ C40': 'Comandante',
  'ポーレックス ミニ': 'Porlex',
  'ハリオ スマート G': 'HARIO',
  'Wilfa Svart': 'Wilfa',
  'バラッツァ エンコア': 'Baratza',
  'カリタ ナイスカット G': 'Kalita',
  'ナイトフォール K0': 'Nightfall',
  'フェロー オデ': 'Fellow',
  'カフラーノ ORO': 'Cafflano',
  '1Zpresso K-Plus': '1Zpresso',
  'HARIO V60ペーパーフィルター': 'HARIO',
  'Kalita ウェーブフィルター': 'Kalita',
  'KONO 円錐フィルター': 'KONO',
  'CHEMEX フィルター': 'CHEMEX',
  'メリタ バンブーフィルター': 'メリタ',
  'アビー コーヒーフィルター': 'Abbie',
  'ブルーボトル コーヒーフィルター': 'Blue Bottle',
  'エアロプレス フィルター': 'Aerobie',
  'ネルドリップ クロス': '野田琺瑯',
  'CAFEC アバカフィルター': 'CAFEC',
  'クナ ステンレスフィルター': 'KUNA',
};

// 器具タイプの説明
const EQUIPMENT_DESCRIPTIONS: Record<string, string[]> = {
  '1': [
    // ドリッパー
    'クリアな味わいを引き出す定番器具',
    '均一な抽出を実現する人気ドリッパー',
    '丁寧な抽出で奥深い味わいを楽しめる',
    '初心者でも扱いやすい設計の抽出器具',
    'プロバリスタ御用達の高性能ドリッパー',
  ],
  '2': [
    // ミル
    '均一な粒度を実現する高性能グラインダー',
    '手挽きの楽しさを味わえるコーヒーミル',
    '調整機能が優れた人気のミル',
    '静音性に優れた使いやすいグラインダー',
    '耐久性バツグンのステンレス刃のミル',
  ],
  '3': [
    // フィルター
    '雑味を取り除き、クリアな味わいを実現',
    '環境に優しい素材を使用したフィルター',
    '繊細な風味を逃さないこだわりのフィルター',
    '長持ちして経済的なリユーザブルタイプ',
    '注ぎやすい形状で初心者にもおすすめ',
  ],
};

const IMAGE_BASE_URL = 'https://example.com/images';

// レシピタイトル生成用のテンプレート
const TITLE_TEMPLATES = [
  '{{原産地}}産の豆で作る絶品{{抽出方法}}',
  '{{ロースト}}焙煎の{{原産地}}豆を使った{{抽出方法}}レシピ',
  '初めての{{抽出方法}}！{{原産地}}豆の魅力を引き出す方法',
  '{{原産地}}の{{ロースト}}豆で試す{{抽出方法}}テクニック',
  '時短でも美味しい！{{原産地}}豆の{{抽出方法}}',
  '{{ロースト}}焙煎のコクを活かした{{抽出方法}}',
  '{{原産地}}豆の酸味を楽しむ{{抽出方法}}',
  'プロが教える{{原産地}}豆の{{抽出方法}}',
  '自宅で簡単！{{原産地}}豆の{{抽出方法}}マスター法',
  '{{抽出方法}}で{{原産地}}豆の香りを最大限に引き出す',
];

async function main(): Promise<void> {
  console.log(`Start seeding ...`);

  // EquipmentTypeの作成
  const dripperType = await prisma.equipmentType.upsert({
    where: { id: 1n },
    update: {},
    create: {
      name: 'ドリッパー',
      description: 'コーヒーを抽出するための器具',
    },
  });

  const grinderType = await prisma.equipmentType.upsert({
    where: { id: 2n },
    update: {},
    create: {
      name: 'コーヒーミル',
      description: 'コーヒー豆を挽くための器具',
    },
  });

  const filterType = await prisma.equipmentType.upsert({
    where: { id: 3n },
    update: {},
    create: {
      name: 'フィルター',
      description: 'コーヒー粉を濾過するための消耗品',
    },
  });

  const kettleType = await prisma.equipmentType.upsert({
    where: { id: 4n },
    update: {},
    create: {
      name: 'ケトル',
      description: 'お湯を注ぐための器具',
    },
  });

  const scaleType = await prisma.equipmentType.upsert({
    where: { id: 5n },
    update: {},
    create: {
      name: 'スケール',
      description: '豆やお湯の重さを量るための器具',
    },
  });

  const equipmentTypes = [dripperType, grinderType, filterType, kettleType, scaleType];

  console.log(
    `Created equipment types: ${dripperType.name}, ${grinderType.name}, ${filterType.name}, ${kettleType.name}, ${scaleType.name}`
  );

  // タグの作成
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'beginner' },
      update: {},
      create: {
        name: '初心者向け',
        slug: 'beginner',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'fruity' },
      update: {},
      create: {
        name: 'フルーティ',
        slug: 'fruity',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'rich' },
      update: {},
      create: {
        name: 'コク深い',
        slug: 'rich',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'quick' },
      update: {},
      create: {
        name: '時短',
        slug: 'quick',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'sour' },
      update: {},
      create: {
        name: '酸味強め',
        slug: 'sour',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'single-origin' },
      update: {},
      create: {
        name: 'シングルオリジン',
        slug: 'single-origin',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'advanced' },
      update: {},
      create: {
        name: '上級者向け',
        slug: 'advanced',
      },
    }),
  ]);

  console.log(`Created ${tags.length} tags`);

  // 著者の作成
  const admin = await prisma.author.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: '管理者',
      email: 'admin@example.com',
      passwordHash: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.PK', // "password"のハッシュ
      bio: 'サイト管理者です',
      isAdmin: true,
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // バリスタの作成
  const barista = await prisma.barista.upsert({
    where: { id: 1n },
    update: {},
    create: {
      name: '田中コーヒー',
      affiliation: 'カフェ・モカ',
      socialLinks: {
        create: [
          {
            platform: 'Twitter',
            url: 'https://twitter.com/tanakacoffee',
          },
          {
            platform: 'Instagram',
            url: 'https://instagram.com/tanakacoffee',
          },
        ],
      },
    },
  });

  const barista2 = await prisma.barista.upsert({
    where: { id: 2n },
    update: {},
    create: {
      name: '鈴木エスプレッソ',
      affiliation: 'カフェ・ラテ',
      socialLinks: {
        create: [
          {
            platform: 'Twitter',
            url: 'https://twitter.com/suzukiespresso',
          },
          {
            platform: 'YouTube',
            url: 'https://youtube.com/suzukiespresso',
          },
        ],
      },
    },
  });

  const barista3 = await prisma.barista.upsert({
    where: { id: 3n },
    update: {},
    create: {
      name: '佐藤ブリュワー',
      affiliation: '自家焙煎珈琲店・アロマ',
      socialLinks: {
        create: [
          {
            platform: 'Instagram',
            url: 'https://instagram.com/satobrewer',
          },
          {
            platform: 'Blog',
            url: 'https://coffee-blog.com/sato',
          },
        ],
      },
    },
  });

  // 追加のバリスタをfakerで生成
  const additionalBaristas = [];
  for (let i = 0; i < 7; i++) {
    const newBarista = await prisma.barista.upsert({
      where: { id: BigInt(i + 4) },
      update: {},
      create: {
        name: `${faker.person.lastName()} ${faker.word.sample()}`,
        affiliation: `${faker.company.name()} ${faker.helpers.arrayElement(['カフェ', 'コーヒーハウス', 'ロースタリー', '珈琲館'])}`,
        socialLinks: {
          create: [
            {
              platform: faker.helpers.arrayElement([
                'Twitter',
                'Instagram',
                'YouTube',
                'TikTok',
                'Blog',
              ]),
              url: `https://${faker.helpers.arrayElement(['twitter', 'instagram', 'youtube', 'tiktok', 'blog'])}.com/${faker.internet.userName()}`,
            },
            {
              platform: faker.helpers.arrayElement([
                'Twitter',
                'Instagram',
                'YouTube',
                'TikTok',
                'Blog',
              ]),
              url: `https://${faker.helpers.arrayElement(['twitter', 'instagram', 'youtube', 'tiktok', 'blog'])}.com/${faker.internet.userName()}`,
            },
          ],
        },
      },
    });
    additionalBaristas.push(newBarista);
  }

  const allBaristas = [barista, barista2, barista3, ...additionalBaristas];
  console.log(
    `Created ${allBaristas.length} baristas: ${allBaristas.map((b) => b.name).join(', ')}`
  );

  // サンプル投稿の作成
  const post = await prisma.post.create({
    data: {
      title: 'はじめてのハンドドリップ',
      authorId: admin.id,
      baristaId: barista.id,
      summary: '初心者向けの基本的なハンドドリップの方法を紹介します。',
      remarks: '豆の挽き目は中細挽きがおすすめです。',
      grindSize: GrindSize.MEDIUM_FINE,
      roastLevel: RoastLevel.MEDIUM,
      beanWeight: 15,
      waterAmount: 225,
      waterTemp: 90,
      brewingTime: 120,
      viewCount: 0,
      isPublished: true,
      publishedAt: new Date(),
      steps: {
        create: [
          {
            stepOrder: 1,
            description: 'フィルターをセットし、お湯で濡らします。',
            timeSeconds: 30,
          },
          {
            stepOrder: 2,
            description: 'コーヒー粉を入れ、お湯を少量注いで蒸らします。',
            timeSeconds: 30,
          },
          {
            stepOrder: 3,
            description: '残りのお湯をゆっくりと注いでいきます。',
            timeSeconds: 60,
          },
        ],
      },
      equipment: {
        create: [
          {
            typeId: dripperType.id,
            name: 'HARIO V60',
            brand: 'HARIO',
            description: '円錐形のドリッパー',
            affiliateLink: 'https://example.com/v60',
          },
          {
            typeId: grinderType.id,
            name: 'コマンダンテ C40',
            brand: 'Comandante',
            description: '高品質な手挽きミル',
          },
        ],
      },
      tags: {
        create: [
          {
            tagId: tags[0].id, // 初心者向け
          },
          {
            tagId: tags[2].id, // コク深い
          },
        ],
      },
    },
  });

  // 追加のサンプル投稿
  const post2 = await prisma.post.create({
    data: {
      title: 'エチオピア産豆の最適な抽出法',
      authorId: admin.id,
      baristaId: barista2.id,
      summary:
        'フルーティな香りが特徴的なエチオピア産豆の魅力を最大限に引き出す抽出方法を解説します。',
      remarks: '豆の鮮度が特に重要です。焙煎後2週間以内のものを使用しましょう。',
      grindSize: GrindSize.MEDIUM,
      roastLevel: RoastLevel.LIGHT_MEDIUM,
      beanWeight: 18,
      waterAmount: 270,
      waterTemp: 92,
      brewingTime: 150,
      viewCount: 12,
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 一週間前
      steps: {
        create: [
          {
            stepOrder: 1,
            description: 'フィルターをドリッパーにセットし、95℃のお湯でリンスします。',
            timeSeconds: 20,
          },
          {
            stepOrder: 2,
            description: '粉を入れて中央を少し凹ませ、30gのお湯を注いで30秒蒸らします。',
            timeSeconds: 30,
          },
          {
            stepOrder: 3,
            description: '円を描くように120gまでお湯を注ぎ、1分待ちます。',
            timeSeconds: 60,
          },
          {
            stepOrder: 4,
            description: '残りのお湯を注ぎ、合計2分30秒で抽出を完了させます。',
            timeSeconds: 40,
          },
        ],
      },
      equipment: {
        create: [
          {
            typeId: dripperType.id,
            name: 'ORIGAMI ドリッパー',
            brand: 'ORIGAMI',
            description: '日本製の美しいドリッパー',
            affiliateLink: `${IMAGE_BASE_URL}/origami-dripper`,
          },
          {
            typeId: grinderType.id,
            name: 'バラッツァ エンコア',
            brand: 'Baratza',
            description: '家庭用電動グラインダーの定番',
            affiliateLink: `${IMAGE_BASE_URL}/baratza-encore`,
          },
          {
            typeId: kettleType.id,
            name: 'フェロー スタッグ ケトル',
            brand: 'Fellow',
            description: '温度調整機能付きの高性能ケトル',
            affiliateLink: `${IMAGE_BASE_URL}/fellow-stagg`,
          },
          {
            typeId: scaleType.id,
            name: 'アカイア パール',
            brand: 'ACAIA',
            description: 'バリスタ御用達の高精度スケール',
            affiliateLink: `${IMAGE_BASE_URL}/acaia-pearl`,
          },
        ],
      },
      tags: {
        create: [
          {
            tagId: tags[1].id, // フルーティ
          },
          {
            tagId: tags[4].id, // 酸味強め
          },
          {
            tagId: tags[5].id, // シングルオリジン
          },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'ブラジル産深煎り豆の濃厚レシピ',
      authorId: admin.id,
      baristaId: barista3.id,
      summary: 'ブラジル産の深煎り豆を使った、コクと甘みを楽しむためのレシピです。',
      remarks: '牛乳との相性も抜群です。カフェオレにしても美味しいでしょう。',
      grindSize: GrindSize.MEDIUM_COARSE,
      roastLevel: RoastLevel.DARK,
      beanWeight: 20,
      waterAmount: 240,
      waterTemp: 88,
      brewingTime: 180,
      viewCount: 45,
      isPublished: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 二週間前
      steps: {
        create: [
          {
            stepOrder: 1,
            description: 'ネルドリップのフィルターをお湯で湿らせておきます。',
            timeSeconds: 40,
          },
          {
            stepOrder: 2,
            description: 'コーヒー粉をセットし、40gのお湯で蒸らします。',
            timeSeconds: 45,
          },
          {
            stepOrder: 3,
            description: '3回に分けてゆっくりとお湯を注ぎます。',
            timeSeconds: 95,
          },
        ],
      },
      equipment: {
        create: [
          {
            typeId: filterType.id,
            name: 'ネルドリップ クロス',
            brand: '野田琺瑯',
            description: '布製のフィルター',
            affiliateLink: `${IMAGE_BASE_URL}/nel-filter`,
          },
          {
            typeId: grinderType.id,
            name: 'Wilfa Svart',
            brand: 'Wilfa',
            description: '北欧デザインの電動ミル',
            affiliateLink: `${IMAGE_BASE_URL}/wilfa-svart`,
          },
        ],
      },
      tags: {
        create: [
          {
            tagId: tags[2].id, // コク深い
          },
          {
            tagId: tags[6].id, // 上級者向け
          },
        ],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: '忙しい朝に！3分で完成するエアロプレスレシピ',
      authorId: admin.id,
      baristaId: barista.id,
      summary: '時間がない朝でも美味しいコーヒーを楽しむためのクイックレシピです。',
      remarks: '細挽きにすることで短時間でも十分な抽出ができます。',
      grindSize: GrindSize.FINE,
      roastLevel: RoastLevel.MEDIUM,
      beanWeight: 16,
      waterAmount: 200,
      waterTemp: 85,
      brewingTime: 60,
      viewCount: 78,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3日前
      steps: {
        create: [
          {
            stepOrder: 1,
            description: 'エアロプレスにフィルターをセットし、お湯で濡らします。',
            timeSeconds: 10,
          },
          {
            stepOrder: 2,
            description: 'コーヒー粉を入れ、一気に200gのお湯を注ぎます。',
            timeSeconds: 10,
          },
          {
            stepOrder: 3,
            description: '10秒ほど待ち、かき混ぜます。',
            timeSeconds: 10,
          },
          {
            stepOrder: 4,
            description: 'プランジャーをセットし、30秒かけてゆっくり押し下げます。',
            timeSeconds: 30,
          },
        ],
      },
      equipment: {
        create: [
          {
            typeId: dripperType.id,
            name: 'エアロプレス',
            brand: 'Aerobie',
            description: '短時間で抽出できる便利な器具',
            affiliateLink: `${IMAGE_BASE_URL}/aeropress`,
          },
          {
            typeId: grinderType.id,
            name: 'ポーレックス ミニ',
            brand: 'Porlex',
            description: 'コンパクトな手挽きミル',
            affiliateLink: `${IMAGE_BASE_URL}/porlex-mini`,
          },
        ],
      },
      tags: {
        create: [
          {
            tagId: tags[0].id, // 初心者向け
          },
          {
            tagId: tags[3].id, // 時短
          },
        ],
      },
    },
  });

  console.log(
    `Created initial posts: ${post.title}, ${post2.title}, ${post3.title}, ${post4.title}`
  );

  // Fakerを使用して追加の投稿を生成
  const additionalPosts = [];

  // タイトル生成関数
  const generateTitle = (): string => {
    const template = faker.helpers.arrayElement(TITLE_TEMPLATES);
    return template
      .replace('{{原産地}}', faker.helpers.arrayElement(COFFEE_ORIGINS))
      .replace('{{抽出方法}}', faker.helpers.arrayElement(BREWING_METHODS))
      .replace('{{ロースト}}', faker.helpers.arrayElement(Object.values(ROAST_LEVEL_LABELS)));
  };

  // ランダムな日付を生成する関数
  const randomPastDate = (): Date => {
    // 過去1年以内でランダムな日付を生成
    const daysAgo = faker.number.int({ min: 1, max: 365 });
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  };

  // 表示名からEnumを取得する関数
  const getRoastLevelEnum = (displayName: string): RoastLevel => {
    const entry = Object.entries(ROAST_LEVEL_LABELS).find(([, label]) => label === displayName);
    return entry ? (entry[0] as RoastLevel) : RoastLevel.MEDIUM; // デフォルト値
  };

  const getGrindSizeEnum = (displayName: string): GrindSize => {
    const entry = Object.entries(GRIND_SIZE_LABELS).find(([, label]) => label === displayName);
    return entry ? (entry[0] as GrindSize) : GrindSize.MEDIUM; // デフォルト値
  };

  // ダミーの投稿を生成
  for (let i = 0; i < TOTAL_POSTS; i++) {
    const baristaId = faker.helpers.arrayElement(allBaristas).id;
    const roastLevelLabel = faker.helpers.arrayElement(Object.values(ROAST_LEVEL_LABELS));
    const grindSizeLabel = faker.helpers.arrayElement(Object.values(GRIND_SIZE_LABELS));
    const roastLevel = getRoastLevelEnum(roastLevelLabel);
    const grindSize = getGrindSizeEnum(grindSizeLabel);
    const waterTemp = faker.helpers.arrayElement(WATER_TEMPS);
    const brewingMethod = faker.helpers.arrayElement(BREWING_METHODS);
    const coffeeOrigin = faker.helpers.arrayElement(COFFEE_ORIGINS);

    // ランダムなタグを2-4個選択
    const selectedTags = faker.helpers.arrayElements(tags, faker.number.int({ min: 2, max: 4 }));

    // 豆の量と水の量をランダムに生成（一般的な比率に基づく）
    const beanWeight = faker.number.int({ min: 15, max: 25 });
    const waterAmount = beanWeight * faker.number.int({ min: 13, max: 17 }); // 豆:水 = 1:13〜1:17

    // 抽出時間を生成
    const brewingTime = faker.number.int({ min: 60, max: 240 });

    // 投稿日時を生成
    const publishedAt = randomPastDate();

    // ステップ数を決定
    const stepCount = faker.number.int({ min: 3, max: 7 });

    // 閲覧数を生成
    const viewCount = faker.number.int({ min: 0, max: 500 });

    // 投稿のタイトルと概要を生成
    const title = generateTitle();
    const summary = `${coffeeOrigin}産の豆を使った${brewingMethod}のレシピです。`;

    // 備考を生成
    const remarks = faker.helpers.arrayElement([
      `${roastLevelLabel}の豆がおすすめです。`,
      `${grindSizeLabel}で抽出すると最高の味わいになります。`,
      `水温は${waterTemp}℃前後が最適です。`,
      `${faker.number.int({ min: 1, max: 4 })}回に分けてお湯を注ぐのがポイントです。`,
      `蒸らし時間を${faker.number.int({ min: 20, max: 40 })}秒取ると香りが引き立ちます。`,
      `${faker.helpers.arrayElement(['柑橘系', 'ナッツ系', 'チョコレート系', 'フルーティ', 'フローラル'])}の風味を楽しめます。`,
      `${faker.helpers.arrayElement(['朝食', '午後のブレイク', 'デザートと一緒に'])}におすすめです。`,
    ]);

    // 投稿を作成
    const newPost = await prisma.post.create({
      data: {
        title,
        authorId: admin.id,
        baristaId,
        summary,
        remarks,
        grindSize,
        roastLevel,
        beanWeight,
        waterAmount,
        waterTemp,
        brewingTime,
        viewCount,
        isPublished: true,
        publishedAt,
        steps: {
          create: Array.from({ length: stepCount }).map((_, index) => ({
            stepOrder: index + 1,
            description: faker.lorem.sentence(faker.number.int({ min: 5, max: 20 })),
            timeSeconds: faker.number.int({ min: 10, max: 120 }),
          })),
        },
        equipment: {
          create: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(() => {
            // ドリッパー、ミル、フィルターのみを選択するため、最初の3つのタイプに限定
            const limitedTypes = equipmentTypes.slice(0, 3);
            const randomType = faker.helpers.arrayElement(limitedTypes);

            // BigInt型のIDを文字列に変換してマップから取得
            const typeIdStr = randomType.id.toString();

            // 機器タイプに基づいて適切なリストから選択
            const equipmentList = EQUIPMENT_MAP[typeIdStr] ?? [];
            const equipmentName = faker.helpers.arrayElement(equipmentList);

            // ブランド名をマッピングから取得
            const brandName = BRAND_MAP[equipmentName] ?? equipmentName.split(' ')[0];

            // 器具の説明文
            const typeDescriptions = EQUIPMENT_DESCRIPTIONS[typeIdStr] ?? [];
            const description = faker.helpers.arrayElement(
              typeDescriptions.length > 0 ? typeDescriptions : ['高品質な器具です']
            );

            return {
              typeId: randomType.id,
              name: equipmentName,
              brand: brandName,
              description,
              affiliateLink: faker.helpers.maybe(
                () => `${IMAGE_BASE_URL}/${faker.helpers.slugify(equipmentName)}`,
                { probability: 0.7 }
              ),
            };
          }),
        },
        tags: {
          create: selectedTags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
    });

    additionalPosts.push(newPost);
  }

  console.log(`Created ${additionalPosts.length} additional posts with faker`);
  console.log(`Total posts created: ${4 + additionalPosts.length}`);
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
