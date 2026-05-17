"use client"

import type { Blog } from "@/sanity.types"
import BlogsCards from "./BlogCards"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

type BlogListProps = {
  blogs: Blog[]
}

const RESULTS_PER_PAGE_OPTIONS = [9, 18, 27, 36]
const BLOGS_PER_PAGE = 9

export default function Blogs({ blogs }: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE_OPTIONS[0])

  const totalPages = Math.ceil(blogs.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentBlogs = blogs.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisThreshold = 7

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value)
    setCurrentPage(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <section className="">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-[33px] gap-5">
          {currentBlogs.map((blog) => (
            <BlogsCards blog={blog} key={blog._id} />
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 mb-8">
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-transparent dark:text-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="sr-only">Back</span>
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex items-center justify-center w-10 h-10 dark:text-white text-black"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`flex items-center justify-center border  w-10 h-10 rounded-md font-medium transition-colors ${currentPage === page
                        ? "bg-[#C00034] text-white"
                        : "bg-transparent dark:text-white text-black  hover:bg-gray-100 dark:hover:bg-gray-800 border-[#D6D6D6] "
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center  gap-1 px-3 h-10 rounded-md bg-transparent dark:text-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Next page" style={{ 'border': "1px solid #D6D6D6" }}
                >
                  <span className="text-sm font-medium ">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm dark:text-white text-black">Results per page:</span>
              <div className="relative">
                <select
                  value={resultsPerPage}
                  onChange={(e) => handleResultsPerPageChange(Number(e.target.value))}
                  className="appearance-none bg-white dark:bg-gray-800 dark:text-white text-black border border-gray-300 dark:border-gray-600 rounded-md px-3 pr-8 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C00034]"
                >
                  {RESULTS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none dark:text-white text-black" />
              </div>
            </div>

          </div>
        )}
      </section>
    </>
  )
}
