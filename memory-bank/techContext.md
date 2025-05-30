# 技術コンテキスト

本ファイルでは、本プロジェクトで採用する技術スタック、開発環境、および依存関係に関する詳細を記述します。

---

## フロントエンド

フロントエンドは、ユーザーインターフェースの構築とクライアントサイドのロジック実装を目的として、以下の技術を採用します：

- **Next.js**
  サーバーサイドレンダリングや静的サイト生成に対応したReactフレームワーク
- **TypeScript**
  静的型付けにより、堅牢なコード品質と開発効率の向上を実現
- **Tailwind CSS**
  ユーティリティファーストなCSSフレームワークで、迅速なUIデザインをサポート
- **Shadcn UI**
  高品質なUIコンポーネントライブラリとして利用
- **Zustand**
  シンプルかつ効率的な状態管理のためのライブラリ
- **React Hook Form**
  フォームの状態管理とバリデーションを容易に行うためのツール
- **zod**
  スキーマベースのデータバリデーションライブラリ
- **date-fns**
  日付操作を効率化するユーティリティライブラリ

---

## バックエンド

バックエンドは、データ管理や認証、API提供などを担い、以下の技術およびツールを採用します：

- **Next.js APIルート**
  REST APIの実装をNext.jsの機能で提供
- **Prisma**
  型安全なORMとして、データベースとの連携を効率化
- **Faker**
  開発やテスト用のダミーデータ生成に利用
- **Google SSO（NextAuth.js）**
  Googleアカウントを利用したシングルサインオン認証を実装
- **zod**
  入力データのバリデーションに再利用
- **PostgreSQL**
  信頼性とパフォーマンスに優れたリレーショナルデータベース管理システム

---

## 品質管理・テスト

プロジェクト全体の品質を担保するため、以下のツールを利用します：

- **Prettier**
  コードフォーマットの統一と自動整形を実施
- **ESLint**
  静的コード解析により、潜在的なエラーやコード品質の問題を検出
- **Jest**
  ユニットテストを実施し、各機能の正確な動作を検証
- **Supertest**
  APIエンドポイントの統合テストを行い、REST APIの品質を保証

---

この技術コンテキストは、プロジェクトの初期段階での技術選定の根拠となり、今後の開発および技術的改善のための基盤として活用されます。
