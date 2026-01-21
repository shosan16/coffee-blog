import { useMemo } from 'react';

type UseTagOverflowReturn = {
  /** UI上に直接表示されるタグ */
  visibleTags: string[];
  /** ポップオーバー内に表示される隠れたタグ */
  hiddenTags: string[];
  /** タグ数が最大表示数を超えているか */
  hasOverflow: boolean;
};

/**
 * タグリストのオーバーフロー管理フック
 *
 * タグの数が最大表示数を超えた場合、表示タグと隠しタグに分割する。
 * Phase 1 では固定の最大表示数で制御し、DOM計測は行わない。
 *
 * @param tags - タグの配列
 * @param maxVisible - 最大表示タグ数（デフォルト: 6）
 */
export function useTagOverflow(tags: string[], maxVisible: number = 6): UseTagOverflowReturn {
  return useMemo(() => {
    if (tags.length <= maxVisible) {
      return {
        visibleTags: tags,
        hiddenTags: [],
        hasOverflow: false,
      };
    }

    return {
      visibleTags: tags.slice(0, maxVisible),
      hiddenTags: tags.slice(maxVisible),
      hasOverflow: true,
    };
  }, [tags, maxVisible]);
}
