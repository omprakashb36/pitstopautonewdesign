"use client"

import type { Blog } from "@/sanity.types"
import ImageComp from "../CustomImage"
import Link from "next/link"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"

type BlogCardProps = {
  blog: Blog
}

export default function BlogsCards({ blog }: BlogCardProps) {
  const { currentLocale } = useDeviceDetection()
  const isArabic = currentLocale === "ar"

  const rawSlug = blog?.slug?.current || ""
  const slug = rawSlug.replace(/^ar\//, "")

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)

    const formatted = date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    return formatted
  }

  return (
    <Link
      href={`/${currentLocale}/blog/${slug}`}
      className="border border-[#EAEAEA] dark:border-[#FAEADC20] rounded-[40px] dark:bg-[#1A1717] bg-white drop-shadow-[0px_10px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl group"
    >
      {/* Image */}
      <div className="h-auto md:h-[300px] w-full relative shrink-0 overflow-hidden rounded-[40px]">
        {blog?.thumbnailImage && (
          <ImageComp
            block={blog.thumbnailImage}
            width={433}
            height={300}
            imageClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col items-start p-[24px] md:p-[40px] w-full grow">
        <div className="flex flex-col gap-[16px] items-start w-full">
          {/* Meta Info */}
          <div className="flex items-center gap-[8px] flex-wrap text-[#0D0D0D] dark:text-[#FAEADC]">
            <time className="font-host font-bold text-[12px] uppercase whitespace-nowrap">
              {formatDate(blog?.blogDate)}
            </time>
            <span className="font-host font-normal text-[14px] opacity-40">/</span>
            {blog?.categoryTags?.map((tag, index) => (
              <span 
                key={index} 
                className="border border-[#D6D6D6] dark:border-[#FAEADC40] px-[12px] py-[4px] rounded-[8px] font-host font-bold text-[12px] tracking-[0.48px] uppercase whitespace-nowrap"
              >
                {tag?.label}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="capitalize font-host font-extrabold text-[20px] md:text-[24px] leading-tight dark:text-white text-[#0D0D0D] w-full tracking-[0] transition-colors group-hover:text-[#FF3300]">
            {blog?.title}
          </h3>

          {/* Description */}
          <p className="font-host font-normal opacity-80 text-[14px] md:text-[18px] leading-[1.5] dark:text-[#FAEADC] text-black w-full tracking-[0]">
            {blog?.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  )
}
