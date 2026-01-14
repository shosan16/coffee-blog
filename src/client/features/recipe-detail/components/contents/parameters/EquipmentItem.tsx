import type { DetailedEquipmentInfo } from '@/client/features/recipe-detail/types/recipe-detail';

type EquipmentItemProps = {
  /** 器具詳細情報 */
  item: DetailedEquipmentInfo;
};

/**
 * 器具アイテムコンポーネント
 *
 * affiliateLinkの有無で要素タイプを切り替え、
 * 共通のレイアウトとスタイルを提供する。
 * カテゴリーと器具名を縦並びで表示。
 */
export default function EquipmentItem({ item }: EquipmentItemProps) {
  // 共通スタイル
  const baseClassName =
    'flex flex-col gap-1.5 rounded-xl border border-border bg-muted p-4 transition-all hover:bg-muted/80 hover:border-border/80';

  // 器具情報の共通コンテンツ
  const content = (
    <>
      {/* カテゴリー（器具タイプ） */}
      <div className="text-muted-foreground text-xs tracking-wide uppercase">
        {item.equipmentType.name}
      </div>

      {/* 器具名 */}
      <div className="text-card-foreground text-sm font-medium md:text-base">{item.name}</div>
    </>
  );

  // アフィリエイトリンクがある場合はaタグでラップ
  // TODO: 将来的に外部リンクアイコンなどを追加し、クリック可能であることを明示する
  if (item.affiliateLink) {
    return (
      <a
        href={item.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
        aria-label={`${item.name}の購入リンク`}
      >
        {content}
      </a>
    );
  }

  // アフィリエイトリンクがない場合は通常のdiv
  return (
    <div className={baseClassName} role="article" aria-label={`${item.name}の情報`}>
      {content}
    </div>
  );
}
