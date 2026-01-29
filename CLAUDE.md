# CLAUDE.md

## プロジェクト概要

Next.js 15 + TypeScript のコーヒーレシピブログアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 15.3, React 18.3
- **言語**: TypeScript 5.8
- **テスト**: Vitest 3.1, Testing Library
- **バリデーション**: Zod 3.24
- **ログ**: Pino 9.7
- **DB**: Prisma 6.6, PostgreSQL

## 開発コマンド

- `npm run dev` - 開発サーバー起動
- `npm run check-all` - 品質チェック（format, lint, type-check, test）
- `npm run test` - テスト実行
- `npm run build` - ビルド

## 言語設定

- 日本語で回答
- ファイルは UTF-8 エンコーディング

## 開発ワークフロー

YOU MUST: 以下のワークフローは例外なく全てのコード変更に適用する。Task tool を使用してエージェントを呼び出すこと。

1. **探索**: `/context-prime` を実行し、コードを探索
2. **設計**: `Task tool` で `architect` エージェントを呼び出し、現状分析・設計・実装計画を立案
3. **実装・レビューサイクル**: 以下を品質基準を満たすまで繰り返す
   - **実装**: `Task tool` で `frontend-developer` または `backend-developer` エージェントを呼び出し、TDD で実装
   - **レビュー**: `Task tool` で `code-reviewer`、`qa-engineer`、`tech-writer` エージェントを呼び出し、品質確認
   - **判定**: 指摘事項があれば実装に戻る。なければ次へ
4. **完了**: check-all、コミット、PR 作成

### 役割分担

| 担当         | 作業内容                                |
| ------------ | --------------------------------------- |
| エージェント | ファイルの作成・編集（Write/Edit tool） |
| 親セッション | git 操作（add, commit, push）、PR 作成  |

エージェントは git 操作を行わない。変更完了後、親セッションがコミットを実行する。

### 禁止事項

- エージェントを経由せずに直接 Edit/Write tool でコードを変更すること
- 「計画が既にある」「シンプルな変更」を理由にエージェントをスキップすること
- エージェントが git add / commit / push / branch 作成を行うこと

## 交渉不可能な制約

### セキュリティ

- 本番環境への操作は明示的なユーザー確認が必要
- シークレットをコードにハードコードしない

### 品質管理

- テスト失敗・リンティングエラーが残るコードは提出しない
- 実装完了後は `npm run check-all` を実行し、通るまで修正

### プロジェクト管理

- タスクスコープ外の変更は行わない
- package.json の技術スタックバージョンを無断変更しない
