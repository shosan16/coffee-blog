---
name: feature
description: 機能実装のオーケストレーション。新機能追加時に使用。
argument-hint: 【プロンプトを記載】
---

# 機能実装: $ARGUMENTS

以下の順序で実装を進める：

## 1. 設計フェーズ

architect エージェント（Task tool）で設計を行う。

設計内容:

- 現状分析（関連する既存コード）
- 設計方針（アーキテクチャ決定）
- 実装計画（ステップと担当）
- リスク（潜在的課題と対策）

## 2. 実装フェーズ

設計結果を参照し、対象領域に応じて実装：

- **フロントエンド** (src/app/, src/client/) → frontend-developer エージェント
- **バックエンド** (src/server/, src/app/api/, src/lib/, src/db/) → backend-developer エージェント
- **両方** → 順に実行

各エージェントは TDD サイクル（Red-Green-Refactor）で実装を進める。

## 3. レビューフェーズ

code-reviewer エージェントでレビューを実行。

確認内容:

- 設計方針との整合性
- コード品質（設計原則、命名、型安全性）
- セキュリティ
- ドキュメント品質

## 4. 完了

- テスト実行 (`npm run check-all`)
- コミット
- 必要に応じてプルリクエスト作成
