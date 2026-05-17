"use client"
import { getFeaturedBlog } from "@/app/actions/common/sanityData"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"
import type { Blog } from "@/sanity.types"
import { useEffect, useState } from "react"
import BlogsCards from "./BlogCards"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import type { HomeBlog } from "@/sanity.types"

type HomeBlogProps = {
  block: HomeBlog
  index: number
}

export default function HomeBlogComp({ block }: HomeBlogProps) {
  const [blogData, setBlogData] = useState<Blog[]>([])
  const { currentLocale, isMobileDevice } = useDeviceDetection()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const data: Blog[] = await getFeaturedBlog({ locale: currentLocale })
        setBlogData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [currentLocale])

  return (
    <div className="xl:px-[60px] 3xl:px-[116px] px-0 mt-[0px]">
      <div className="flex justify-between mb-10 md:px-0 px-6">
        <h3 className="text-3xl xl:text-[49.8px] font-shoulders text-black dark:text-[#e6d9c0]">
          {block?.sectionTitle} <span className="text-[#c00034]">{block?.sectionSubTitle}</span>
        </h3>
        {!isMobileDevice &&
          <Link
            href={`/${currentLocale}/blog`}
            className="text-[#c00034] border font-semibold px-8 py-4 text-sm uppercase hover:bg-[#c00034] hover:text-white rounded-xl border-[#c00034] font-urbanist"
          >
            {block?.allArticleButton?.buttonText}
          </Link>
        }
      </div>

      {/* Mobile Swiper */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          pagination={{
            clickable: true,
            el: ".blog-pagination",
            bulletClass: "blog-bullet",
            bulletActiveClass: "blog-bullet-active",
          }}
          className="blog-swiper"
        >
          {blogData.map((blog) => (
            <SwiperSlide className="pb-8 px-6" key={blog._id}>
              <BlogsCards blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="blog-pagination flex justify-center mt-8"></div>
      </div>

      {isMobileDevice &&
        <div className="px-6">
          <Link
            href={`/${currentLocale}/blog`}
            className="block text-center mt-10 w-full px-6 py-3 gradientBG rounded-xl text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
          >
            {block?.allArticleButton?.buttonText}
          </Link>
        </div>
      }



      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-[33px] gap-5">
        {blogData.map((blog) => (
          <BlogsCards blog={blog} key={blog._id} />
        ))}
      </div>

      <style jsx global>{`
        .blog-pagination {
          position: relative;
          bottom: 0 !important;
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .blog-bullet {
          width: 0.75rem;
          height: 0.75rem;
          display: inline-block;
          border-radius: 9999px;
          background-color: rgba(214, 214, 214, 0.3);
          margin: 0 0.25rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .blog-bullet-active {
          background-color: #C00034;
        }
        
        .blog-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  )
}
