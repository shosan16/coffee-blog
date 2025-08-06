import type { RoastLevel, GrindSize } from '@prisma/client';
import React from 'react';

import ConditionFilter from './ConditionFilter';
import EquipmentFilter from './EquipmentFilter';
import type { FilterHandlers } from './FilterHandlers';

/**
 * フィルター内容コンポーネントのProps
 */
export type FilterContentProps = {
  /** 選択された器具一覧 */
  selectedEquipment: string[];
  /** 選択された焙煎レベル一覧 */
  selectedRoastLevels: RoastLevel[];
  /** 選択された挽き目一覧 */
  selectedGrindSizes: GrindSize[];
  /** 豆の重量範囲 */
  beanWeightRange: { min?: number; max?: number };
  /** 湯温範囲 */
  waterTempRange: { min?: number; max?: number };
  /** 湯量範囲 */
  waterAmountRange: { min?: number; max?: number };
  /** フィルター変更ハンドラー群 */
  handlers: FilterHandlers;
};

/**
 * レシピフィルター条件の入力フォーム部分
 *
 * @description ユーザーがレシピ検索のフィルター条件を設定するためのUI部分を提供する。
 * 抽出器具（グラインダー、ドリッパーなど）の選択と、抽出条件（焙煎度、挽き目、重量範囲など）
 * の設定を1つの画面にまとめて表示する。
 *
 * 各フィルター項目の変更は即座に内部状態に反映されるが、実際の検索への適用は
 * FilterActionsコンポーネントの「絞り込む」ボタンが押されるまで保留される。
 *
 * @param props.selectedEquipment 現在選択されている器具ID一覧
 * @param props.selectedRoastLevels 現在選択されている焙煎レベル一覧
 * @param props.selectedGrindSizes 現在選択されている挽き目一覧
 * @param props.beanWeightRange 豆の重量の範囲設定
 * @param props.waterTempRange 湯温の範囲設定
 * @param props.waterAmountRange 湯量の範囲設定
 * @param props.handlers 各フィルター項目変更時のコールバック関数群
 */
export default function FilterContent({
  selectedEquipment,
  selectedRoastLevels,
  selectedGrindSizes,
  beanWeightRange,
  waterTempRange,
  waterAmountRange,
  handlers,
}: FilterContentProps) {
  return (
    <div className="mt-6 space-y-6 px-4 sm:px-6">
      {/* 抽出器具フィルター */}
      <div>
        <EquipmentFilter
          selectedEquipment={selectedEquipment}
          onChange={handlers.equipmentChangeHandler}
        />
      </div>

      {/* 抽出条件フィルター */}
      <div>
        <ConditionFilter
          roastLevels={selectedRoastLevels}
          grindSizes={selectedGrindSizes}
          beanWeight={beanWeightRange}
          waterTemp={waterTempRange}
          waterAmount={waterAmountRange}
          onRoastLevelChange={handlers.roastLevelChangeHandler}
          onGrindSizeChange={handlers.grindSizeChangeHandler}
          onBeanWeightChange={handlers.beanWeightChangeHandler}
          onWaterTempChange={handlers.waterTempChangeHandler}
          onWaterAmountChange={handlers.waterAmountChangeHandler}
        />
      </div>
    </div>
  );
}
