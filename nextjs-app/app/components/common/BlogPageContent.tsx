import type { Blog, GetPageQueryResult, Service } from "@/sanity.types"
import Header from "@/app/components/common/Header"
import Footer from "@/app/components/common/Footer"
import PageBuilderPage from "@/app/components/PageBuilder"
import Link from "next/link"
import ImageComp from "../CustomImage"
type Props = {
  locale: string
  headerData: any
  footerData: any
  blogDetail: Blog
  siteSettingData: any
  services: Service[]
  relatedBlogs?: Blog[]
  allTags?: Array<{ _key?: string; label?: string; value?: string }>
}

export default function BlogPageContent({
  locale,
  headerData,
  footerData,
  blogDetail,
  siteSettingData,
  services,
  relatedBlogs = [],
  allTags = [],
}: Props) {
  const formatDate = (dateString?: string) => {
    const isArabic = locale === "ar"
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
    <div className="main_page mt-[100px] lg:mt-[180px] innerPage">
      <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <div className="blogDetail">
      <div className="dark:text-[#FAEADC] text-black mt-[180px] min-h-screen pageBg">
        <div className="container-grid">
          <div className="flex flex-wrap items-center gap-2 text-[15px] mb-6">
            <Link href={`/${locale}`}>Home</Link>
            <span>/</span>
            <Link href={`/${locale}/blog`}>Blog</Link>
            <span>/</span>
            <span className="opacity-60">{blogDetail?.title}</span>
          </div>
          <h1>
            {blogDetail?.title}
          </h1>

          {blogDetail?.blogImage && (
            <ImageComp
              block={blogDetail?.blogImage}
              imageClassName="w-full max-h-[550px] block md:mt-[50px] mt-6 md:mb-10 mb-6"
              width={1200}
              height={600}
            />
          )}
          <div className="md:grid grid-cols-12">
            <div className="col-span-10 col-start-2">
          <div className="flex items-center gap-3 text-sm mb-4">
            <time className="text-[16px] font-bold">{formatDate(blogDetail?.blogDate)}</time>
            <div className="text-muted-foreground items-center flex gap-3">
              <span>/</span>
              {blogDetail?.categoryTags?.map((tag, index) => (
                <span key={index} className="inline-block px-4 py-2  bg-white text-black font-semibold text-sm uppercase rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                  {tag?.label}
                </span>
              ))}
            </div>
          </div>

          

          <PageBuilderPage page={blogDetail as unknown as GetPageQueryResult} />

          {allTags && allTags.length > 0 && (
            <div className="mt-16 mb-8">
              <div className="flex items-center flex-wrap gap-3 pb-8 border-b border-gray-300">
                <span className="font-semibold">Tags: </span>
                {allTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-5 py-2 bg-white text-black font-semibold text-sm uppercase rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {tag?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          </div>
          </div>

          {relatedBlogs && relatedBlogs.length > 0 && (
            <div className="mt-12 mb-12">
              <h2 className="text-[#C00034] font-shoulders font-bold text-[28px] sm:text-[32px] mb-8 tracking-wider">
                RELATED ARTICLES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.slice(0, 3).map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/${locale}/blog/${blog?.slug?.current?.replace(/^ar\//, "")}`}
                    className="group flex gap-4 hover:opacity-80 transition-opacity"
                  >
                    {/* Image thumbnail on the left */}
                    <div className="flex-shrink-0 w-[140px] h-[100px] rounded-lg overflow-hidden">
                      {blog?.thumbnailImage && (
                        <ImageComp
                          block={blog.thumbnailImage}
                          width={140}
                          height={100}
                          imageClassName="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {/* Content on the right */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-[11px] mb-2">
                        <time className="font-bold uppercase tracking-wide">{formatDate(blog?.blogDate)}</time>
                        <span className="text-gray-400">/</span>
                        <span className="font-bold uppercase tracking-wide">
                          {blog?.categoryTags?.[0]?.label || "CATEGORY"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{blog?.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  )
}
