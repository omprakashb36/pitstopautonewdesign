import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getAllServicesQuery, getPageQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { getFooter, getHeader, getSiteSettingData, } from "@/app/actions/common/sanityData";
import { getOfferPageQuery, getOffersQuery } from "@/sanity/lib/queries";
import Offers from "@/app/components/common/Offers";
import Link from "next/link";

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
    query: getOfferPageQuery(locale),
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

  const [headerData, footerData, siteSettingData, offers, page, services] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSiteSettingData({ locale: locale }),
    sanityFetchCustom({
      query: getOffersQuery(locale),
      params: { locale },
      tags: ["offer"],
    }),
    sanityFetchCustom({
      query: getOfferPageQuery(locale),
      params: { locale },
      tags: ["page"],
    }),
    sanityFetchCustom({
      query: getAllServicesQuery(locale),
      params: { locale },
      tags: ["service"],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className={`main_page innerPage offerMain`}>
      <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <div className=" dark:text-white text-black mt-[180px] min-h-screen  pageBg relative">
        <div className="container-grid py-8 md:pb-0 md:py-12 md:pt-0">
        {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[15px] mb-6">
            <Link href={`/${locale}`}>Home</Link>
            <span>/</span>
            <span className="opacity-60">{"Offers"}</span>
          </div>
        <PageBuilderPage page={page as GetPageQueryResult}/>
        <Offers offers={offers} />
      </div>
      </div>
      <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
