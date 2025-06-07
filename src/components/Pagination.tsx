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
} from '@/client/shared/ui/pagination';

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

  // ページ番号を生成する関数
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 2; // 現在のページの前後に表示するページ数

    if (totalPages <= 7) {
      // 7ページ以下の場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 常に最初のページを表示
      pages.push(1);

      // 現在のページが最初の方にある場合
      if (currentPage <= delta + 3) {
        for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > delta + 3) {
          pages.push('ellipsis');
        }
      }
      // 現在のページが最後の方にある場合
      else if (currentPage >= totalPages - delta - 2) {
        if (totalPages > delta + 3) {
          pages.push('ellipsis');
        }
        for (let i = Math.max(totalPages - delta - 2, 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      }
      // 現在のページが中間にある場合
      else {
        pages.push('ellipsis');
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      }

      // 常に最後のページを表示
      if (totalPages > 1) {
        pages.push(totalPages);
      }
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
