import type { Metadata } from "next";
import { getServiceDetailQuery,getAllServicesQuery } from "@/sanity/lib/queries";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData";
import InnerPageServiceContent from "@/app/components/common/InnerPageServiceContent";
import { GetServiceDetailQueryResult,SettingsQueryResult } from "@/sanity.types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const page = await sanityFetchCustom({
    query: getServiceDetailQuery,
    params: { slug: updatedSlug },
    tags: [`service:${updatedSlug}`],
  });

  return {
    title: "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
  };
}

export default async function Page(props: Props) {
  const { locale, slug } = await props.params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const [headerData, footerData, siteSettingData, page,browseServiceList] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSiteSettingData({ locale }),
    sanityFetchCustom({
      query: getServiceDetailQuery,
      params: { slug: updatedSlug },
      tags: [`service:${slug}`],
    }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["service"],
    }),
  ]);

  if (!page?._id) return notFound();
  /*console.log("page", page);*/

  return (
    <InnerPageServiceContent
      locale={locale}
      headerData={headerData}
      footerData={footerData}
      siteSettingData={siteSettingData as SettingsQueryResult}
      page={page as GetServiceDetailQueryResult}
      browseServiceList={browseServiceList}
    />
  );
}
