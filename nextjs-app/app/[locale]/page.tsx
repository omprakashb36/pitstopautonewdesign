// app/[locale]/page.tsx or similar
import type { Metadata } from "next";
import { getAllServicesQuery, getHomePageQuery } from "@/sanity/lib/queries";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData";
import HomePageContent from "@/app/components/common/HomePageContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;

  const page = await sanityFetchCustom({
    query: getHomePageQuery(locale),
    params: { locale },
    tags: ["page"],
  });

  return {
    title: page?.seo?.metaTitle || "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
    description: page?.seo?.metaDescription,
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;

  const [headerData, footerData, siteSettingData, page, services] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSiteSettingData({ locale }),
    sanityFetchCustom({
      query: getHomePageQuery(locale),
      params: { locale },
      tags: ["page"],
    }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["service"],
    }),
  ]);

  if (!page?._id) return notFound();

  return (
    <HomePageContent
      locale={locale}
      headerData={headerData}
      footerData={footerData}
      siteSettingData={siteSettingData}
      page={page}
      services={services}
    />
  );
}
