'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/client/shared/shadcn/pagination';

type RecipePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function RecipePagination({
  currentPage,
  totalPages,
  totalItems: _totalItems,
}: RecipePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page));
  };

  // シンプルなページ番号生成（7ページ以下）
  const generateSimplePages = (totalPages: number): number[] => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 開始部分のページ番号を生成
  const generateStartPages = (delta: number, totalPages: number): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [1];
    for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
      pages.push(i);
    }
    if (totalPages > delta + 3) {
      pages.push('ellipsis');
    }
    return pages;
  };

  // 終了部分のページ番号を生成
  const generateEndPages = (delta: number, totalPages: number): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [1];
    if (totalPages > delta + 3) {
      pages.push('ellipsis');
    }
    for (let i = Math.max(totalPages - delta - 2, 2); i <= totalPages - 1; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 中間部分のページ番号を生成
  const generateMiddlePages = (currentPage: number, delta: number): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [1, 'ellipsis'];
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
    return pages;
  };

  // ページ番号を生成する関数
  const generatePageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数

    if (totalPages <= 7) {
      return generateSimplePages(totalPages);
    }

    let pages: (number | 'ellipsis')[];

    if (currentPage <= delta + 3) {
      pages = generateStartPages(delta, totalPages);
    } else if (currentPage >= totalPages - delta - 2) {
      pages = generateEndPages(delta, totalPages);
    } else {
      pages = generateMiddlePages(currentPage, delta);
    }

    // 常に最後のページを表示
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* ページネーション */}
      <Pagination>
        <PaginationContent>
          {/* 前のページ */}
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : undefined}
              onClick={(e) => {
                if (currentPage <= 1) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>前へ</span>
            </PaginationPrevious>
          </PaginationItem>

          {/* ページ番号 */}
          {pages.map((page, pageIndex) => (
            <PaginationItem key={page === 'ellipsis' ? `ellipsis-${pageIndex}` : page}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(page)}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 次のページ */}
          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : undefined}
              onClick={(e) => {
                if (currentPage >= totalPages) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              <span>次へ</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
