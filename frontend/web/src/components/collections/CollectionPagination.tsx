"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionPaginationProps {
  currentPage: number;
  totalPages: number;
  category: string;
}

export function CollectionPagination({
  currentPage,
  totalPages,
  category,
}: CollectionPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisAfter = currentPage < totalPages - 3;
    const showEllipsisBefore = currentPage > 4;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show ellipsis or pages before current
      if (showEllipsisBefore) {
        pages.push("...");
        if (currentPage > 2) {
          pages.push(currentPage - 1);
        }
      } else {
        for (let i = 2; i < currentPage; i++) {
          pages.push(i);
        }
      }

      // Show current page if not first or last
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }

      // Show ellipsis or pages after current
      if (showEllipsisAfter) {
        if (currentPage < totalPages - 1) {
          pages.push(currentPage + 1);
        }
        pages.push("...");
      } else {
        for (let i = currentPage + 1; i < totalPages; i++) {
          pages.push(i);
        }
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const buildPageUrl = (page: number) => {
    return `/collections/${category}?page=${page}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-10">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 transition rounded"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Trang trước</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Trang trước</span>
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center text-sm font-medium rounded transition ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 transition rounded"
        >
          <span className="hidden sm:inline">Trang tiếp theo</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
          <span className="hidden sm:inline">Trang tiếp theo</span>
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}
