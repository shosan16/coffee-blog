# 指示

下記のようなエンティティ別ディレクトリ構造に修正してください。
4大原則（YAGNI・KISS・SOLID・DRY）に従った設計・実装を行ってください。

## 推奨構造（エンティティ別ディレクトリ）

```

src/server/domain/recipe/entities/
├── barista/
│   ├── Barista.entity.ts
│   ├── Barista.entity.test.ts
│   ├── BaristaSchema.ts
│   ├── BaristaSchema.test.ts
│   ├── Barista.types.ts
│   └── index.ts                    # baristaモジュールのエクスポート
├── equipment/
│   ├── Equipment.entity.ts
│   ├── Equipment.entity.test.ts
│   ├── EquipmentSchema.ts
│   ├── EquipmentSchema.test.ts
│   ├── Equipment.types.ts
│   └── index.ts                    # equipmentモジュールのエクスポート
├── recipe/
│   ├── Recipe.entity.ts
│   ├── Recipe.entity.test.ts
│   ├── Recipe.types.ts             # 必要に応じて
│   └── index.ts                    # recipeモジュールのエクスポート
└── index.ts                        # 全エンティティのエクスポート集約

```

## この構造の優位性

### 1. **スケーラビリティの大幅向上**

```

entities/
├── barista/           ← Baristaに関するすべて
├── equipment/         ← Equipmentに関するすべて
└── recipe/            ← Recipeに関するすべて

```

**利点**: 新しいエンティティが追加されても、entitiesディレクトリが散らからない

### 2. **境界の明確化（DDDの集約境界）**

各ディレクトリが一つの集約を表現：

- **barista/**: Baristaドメインの完全な実装
- **equipment/**: Equipmentドメインの完全な実装
- **recipe/**: Recipeドメインの完全な実装

### 3. **チーム開発の効率化**

```bash
# チームAはBaristaを担当
src/server/domain/recipe/entities/barista/

# チームBはEquipmentを担当
src/server/domain/recipe/entities/equipment/

# 並行開発時の競合が最小化される
```

### 4. **モジュール性の向上**

各エンティティが独立したモジュールとして機能し、他のエンティティへの依存を管理しやすい

## 実装例

### barista/index.ts

```typescript
// src/server/domain/recipe/entities/barista/index.ts
export { Barista } from './Barista.entity';
export * from './BaristaSchema';
export * from './Barista.types';
```

### equipment/index.ts

```typescript
// src/server/domain/recipe/entities/equipment/index.ts
export { Equipment } from './Equipment.entity';
export * from './EquipmentSchema';
export * from './Equipment.types';
```

### entities/index.ts（全体の集約）

```typescript
// src/server/domain/recipe/entities/index.ts
export * from './barista';
export * from './equipment';
export * from './recipe';
```

## インポート例

### 使用側でのインポート

```typescript
// ✅ 推奨: 特定エンティティのみ使用
import { Barista, BaristaCreateSchema } from '../entities/barista';

// ✅ 推奨: 複数エンティティ使用
import { Barista } from '../entities/barista';
import { Equipment } from '../entities/equipment';

// ✅ 推奨: まとめてインポート
import { Barista, Equipment, Recipe } from '../entities';

// ❌ 避ける: 深いパス直接アクセス
import { Barista } from '../entities/barista/Barista.entity';
```
