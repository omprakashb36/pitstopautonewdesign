import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { GetPageQueryResult } from "@/sanity.types";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { getFooter, getHeader, getSiteSettingData, } from "@/app/actions/common/sanityData";
import { getServicePageQuery, getAllServicesQuery } from "@/sanity/lib/queries";
import CarServicesListAll from "@/app/components/common/CarServicesListAll";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const { data: page } = await sanityFetchCustom({
    query: getServicePageQuery(locale),
    params: { locale },
    tags: [`page`],
  });

  return {
    title: page?.name || "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
    description: page?.heading || "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
  } satisfies Metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const [headerData, footerData, siteSettingData, services, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSiteSettingData({ locale: locale }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["service"],
    }),
    sanityFetchCustom({
      query: getServicePageQuery(locale),
      params: { locale },
      tags: ["page"],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  /*console.log("services", services);*/

  return (
    <div className={`main_page innerPage`}>
      <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <div className=" text-white mt-[180px] min-h-screen pageBg relative">
        <PageBuilderPage page={page as GetPageQueryResult} />
        <CarServicesListAll services={services} />
      </div>
      <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
