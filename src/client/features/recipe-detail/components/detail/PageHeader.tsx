'use client';

import { ArrowLeft, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PageHeaderProps = {
  /** レシピタイトル */
  title: string;
  /** レシピID（シェア用） */
  recipeId?: string;
};

/**
 * レシピ詳細ページヘッダーコンポーネント
 *
 * 戻るボタン、レシピタイトル、シェアボタンを含むページヘッダー。
 * wip-prompt.mdの要件に従い、固定ヘッダーではない通常配置。
 */
export default function PageHeader({ title, recipeId }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    // 前のページに戻る（履歴がない場合はレシピ一覧へ）
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleShare = async () => {
    // Web Share API対応端末では共有メニューを表示
    if ('share' in navigator) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title,
          text: `${title}のレシピをチェックしてみてください！`,
          url: recipeId ? `${window.location.origin}/recipes/${recipeId}` : window.location.href,
        });
      } catch {
        // シェアがキャンセルされた場合は何もしない
      }
    } else if ('clipboard' in navigator) {
      // フォールバック：URLをクリップボードにコピー
      const url = recipeId ? `${window.location.origin}/recipes/${recipeId}` : window.location.href;

      try {
        await (navigator as Navigator & { clipboard: Clipboard }).clipboard.writeText(url);
        // TODO: トースト通知でコピー完了を表示
      } catch {
        // クリップボードコピーに失敗した場合は何もしない
      }
    }
  };

  const handleShareClick = () => {
    void handleShare();
  };

  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* 戻るボタン */}
        <button
          onClick={handleBack}
          className="text-muted-foreground hover:text-card-foreground flex items-center gap-2 transition-colors"
          aria-label="前のページに戻る"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">戻る</span>
        </button>

        {/* レシピタイトル */}
        <h1 className="text-card-foreground min-w-0 flex-1 truncate text-center text-xl font-bold sm:text-2xl">
          {title}
        </h1>

        {/* シェアボタン */}
        <button
          onClick={handleShareClick}
          className="text-muted-foreground hover:text-card-foreground flex items-center gap-2 transition-colors"
          aria-label="レシピをシェア"
        >
          <span className="hidden sm:inline">シェア</span>
          <Share className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
