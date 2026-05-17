import type { Metadata } from "next";
import { getAllServicesQuery, getPageQuery } from "@/sanity/lib/queries";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData";
import InnerPageContent from "@/app/components/common/InnerPageContent";
import { GetPageQueryResult } from "@/sanity.types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const page = await sanityFetchCustom({
    query: getPageQuery,
    params: { slug: updatedSlug },
    tags: [`page:${updatedSlug}`],
  });

  return {
    title: "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
    description: page?.heading,
  };
}

export default async function Page(props: Props) {
  const { locale, slug } = await props.params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const [headerData, footerData, siteSettingData, page, services] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSiteSettingData({ locale }),
    sanityFetchCustom({
      query: getPageQuery,
      params: { slug: updatedSlug },
      tags: [`page:${slug}`],
    }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["services"],
    }),
  ]);

  if (!page?._id) return notFound();

  return (
    <InnerPageContent
      locale={locale}
      headerData={headerData}
      footerData={footerData}
      siteSettingData={siteSettingData}
      page={page as GetPageQueryResult}
      services={services}
    />
  );
}
