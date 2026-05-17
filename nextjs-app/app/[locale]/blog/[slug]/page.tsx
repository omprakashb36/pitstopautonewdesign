import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData"
import BlogPageContent from "@/app/components/common/BlogPageContent"
import { sanityFetchCustom } from "@/sanity/lib/client"
import { getAllServicesQuery, blogDetailsQuery, getRelatedBlogsQuery, getAllBlogTagsQuery } from "@/sanity/lib/queries"
import { notFound } from "next/navigation"

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug

  const [headerData, footerData, blogDetails, siteSettingData, service, allTags] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    sanityFetchCustom({
      query: blogDetailsQuery,
      params: { slug: updatedSlug },
      tags: [`blog`],
    }),
    getSiteSettingData({ locale }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["service"],
    }),
    sanityFetchCustom({
      query: getAllBlogTagsQuery(locale),
      params: { locale },
      tags: ["blog"],
    }),
  ])

  if (!blogDetails?._id) return notFound()

  const uniqueTags =
    allTags?.filter(
      (tag: any, index: number, self: any[]) => index === self.findIndex((t: any) => t._key === tag._key),
    ) || []

  const tagIds =
    blogDetails?.categoryTags
      ?.map((tag: any) => {
        if (typeof tag === "string") return tag
        if (tag?._key) return tag._key
        if (tag?.value) return tag.value
        if (tag?._ref) return tag._ref
        if (tag?._id) return tag._id
        return null
      })
      .filter(Boolean) || []

  let relatedBlogs = []
  if (tagIds.length > 0) {
    relatedBlogs = await sanityFetchCustom({
      query: getRelatedBlogsQuery,
      params: {
        currentBlogId: blogDetails._id,
        tagIds,
        locale,
      },
      tags: [`blog`],
    })
  } else {
    console.log("No tags found, skipping related blogs query")
  }

  return (
    <BlogPageContent
      locale={locale}
      headerData={headerData}
      footerData={footerData}
      blogDetail={blogDetails}
      siteSettingData={siteSettingData}
      services={service}
      relatedBlogs={relatedBlogs}
      allTags={uniqueTags}
    />
  )
}
