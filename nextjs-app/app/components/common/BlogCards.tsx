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

    return isArabic ? formatted : formatted
  }

  return (
    <Link
      href={`/${currentLocale}/blog/${slug}`}
      className="group border-[#FAEADC4D] border-[0.83px] block md:min-w-[400px] rounded-[40px] dark:bg-black bg-[#F9F9F9] overflow-hidden shadow-xl hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative rounded-[40px] w-full aspect-video overflow-hidden">
        {blog?.thumbnailImage && (
          <ImageComp
            block={blog.thumbnailImage}
            width={433}
            height={250}
            imageClassName="w-full h-full object-cover object-left-bottom rounded-[10px] transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5 xl:p-8 3xl:p-10 dark:text-[#FAEADC] text-black space-y-4 font-urbanist">
        {/* Meta Info */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          <time className="text-xs font-bold capitalize">{formatDate(blog?.blogDate)}</time>/
          {blog?.categoryTags?.map((tag, index) => (
            <span key={index} className="text-xs px-3 py-1 font-bold rounded-[8px]" style={{ "border": "1px solid #D6D6D6" }}>
              {tag?.label}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl xl:text-2xl font-extrabold leading-tight group-hover:text-primary transition-colors">
          {blog?.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base 3xl:text-lg leading-snug dark:text-[#FAEADC] text-black">{blog?.shortDescription}</p>
      </div>
    </Link>
  )
}
