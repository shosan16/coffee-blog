'use client';

import { Users, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { BaristaInfo } from '@/client/features/recipe-detail/types/recipe-detail';
import { Card } from '@/client/shared/shadcn/card';

type BaristaCardProps = {
  /** バリスタ情報 */
  barista: BaristaInfo;
};

/**
 * バリスタ情報を表示するアコーディオンカード
 *
 * デフォルトで閉じた状態で、クリックで詳細情報（SNSリンク）を展開する。
 * アコーディオンパターンを使用し、適切なARIA属性でアクセシビリティを確保している。
 */
export default function BaristaCard({ barista }: BaristaCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Card className="border-border bg-card overflow-hidden shadow-sm">
      {/* トグルボタン */}
      <button
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between p-4 md:p-5"
        aria-expanded={isOpen}
        aria-controls="barista-details"
        aria-label="バリスタ情報を表示"
      >
        <div className="flex items-center gap-3">
          {/* アバター */}
          <div className="bg-accent text-accent-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
            <Users className="h-5 w-5" />
          </div>

          {/* 名前と所属 */}
          <div className="flex min-w-0 flex-col items-start">
            <div className="text-card-foreground truncate font-medium">{barista.name}</div>
            {barista.affiliation && (
              <div className="text-muted-foreground truncate text-sm">{barista.affiliation}</div>
            )}
          </div>
        </div>

        {/* シェブロンアイコン */}
        <ChevronDown
          className={`text-muted-foreground h-5 w-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          data-testid="chevron-icon"
        />
      </button>

      {/* アコーディオンコンテンツ */}
      <div
        id="barista-details"
        role="region"
        aria-labelledby="barista-toggle-button"
        className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
          isOpen ? 'max-h-32' : 'max-h-0'
        }`}
      >
        {barista.socialLinks.length > 0 && (
          <div className="px-4 pb-4 md:px-5 md:pb-5">
            <div className="flex flex-wrap gap-2">
              {barista.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
                >
                  <span>{link.platform}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
