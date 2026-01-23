'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/client/shared/shadcn/popover';

import { useTagOverflow } from '../hooks/useTagOverflow';

/**
 * タグ情報の型
 */
type TagInfo = {
  id: string;
  name: string;
};

type RecipeTagListProps = {
  /** レシピの特徴や味わいを表すタグ */
  tags: TagInfo[];
  /** 最大表示タグ数（デフォルト: 6） */
  maxVisible?: number;
};

/**
 * レシピタグリストコンポーネント
 *
 * タグを2行程度で表示し、オーバーフロー時は「他N件」ボタンと
 * ポップオーバーで残りのタグを表示する。
 */
export default function RecipeTagList({ tags, maxVisible = 6 }: RecipeTagListProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const tagNames = tags.map((tag) => tag.name);
  const { visibleTags, hasOverflow } = useTagOverflow(tagNames, maxVisible);

  if (tags.length === 0) {
    return null;
  }

  const handleTagClick = (tagId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    router.push(`/?tags=${encodeURIComponent(tagId)}`);
  };

  // visibleTags/hiddenTagsのインデックスから元のタグ情報を取得
  const visibleTagInfos = tags.slice(0, visibleTags.length);
  const hiddenTagInfos = tags.slice(visibleTags.length);

  return (
    <div className="relative min-h-[56px]">
      <div className="flex flex-wrap gap-1.5">
        {/* 表示されるタグ */}
        {visibleTagInfos.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={(e) => handleTagClick(tag.id, e)}
            aria-label={`${tag.name}でフィルター`}
            className="rounded bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:bg-gray-800 hover:text-white"
          >
            {tag.name}
          </button>
        ))}

        {/* オーバーフロー時の「他N件」ボタン */}
        {hasOverflow && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="inline-flex items-center gap-1 rounded bg-gray-200 px-2.5 py-1 text-[11px] text-gray-500 transition-colors hover:bg-gray-600 hover:text-white"
              >
                他{hiddenTagInfos.length}件
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-3"
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap gap-1.5">
                {hiddenTagInfos.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={(e) => {
                      handleTagClick(tag.id, e);
                      setIsOpen(false);
                    }}
                    aria-label={`${tag.name}でフィルター`}
                    className="rounded bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
