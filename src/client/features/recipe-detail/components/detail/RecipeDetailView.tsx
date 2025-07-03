import type { RecipeDetailInfo } from '../../types/recipe-detail';

import BaristaCard from './BaristaCard';
import RecipeEquipmentList from './RecipeEquipmentList';
import RecipeHeader from './RecipeHeader';
import RecipeInfoCards from './RecipeInfoCards';
import RecipeSteps from './RecipeSteps';
import RecipeTagList from './RecipeTagList';

type RecipeDetailViewProps = {
  /** レシピ詳細情報 */
  recipe: RecipeDetailInfo;
};

/**
 * レシピ詳細画面のメインビュー
 *
 * レシピの全詳細情報を表示する。
 * レスポンシブレイアウトで、デスクトップでは2カラム、
 * モバイルでは1カラムで表示する。
 */
export default function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ヘッダー */}
          <RecipeHeader recipe={recipe} />

          {/* レイアウト: デスクトップ2カラム、モバイル1カラム */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* メインコンテンツ */}
            <div className="min-w-0 flex-1 space-y-8">
              {/* 基本情報カード */}
              <RecipeInfoCards recipe={recipe} />

              {/* 手順 */}
              <RecipeSteps steps={recipe.steps} />

              {/* 器具一覧 */}
              <RecipeEquipmentList equipment={recipe.equipment} />
            </div>

            {/* サイドバー */}
            <aside className="w-full flex-shrink-0 space-y-6 lg:w-80">
              {/* バリスタ情報 */}
              {recipe.barista && <BaristaCard barista={recipe.barista} />}

              {/* タグ */}
              <RecipeTagList tags={recipe.tags} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
