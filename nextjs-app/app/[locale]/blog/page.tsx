import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData";
import Blogs from "@/app/components/common/Blogs";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { getAllServicesQuery, getBlogQuery, getBlogPageQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;

  const page = await sanityFetchCustom({
    query: getBlogPageQuery(locale),
    params: { locale },
    tags: ["page"],
  });

  return {
    title: page?.seo?.metaTitle || "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
    description: page?.seo?.metaDescription,
  };
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;
    const [headerData, footerData, siteSettingData, services, blogs] = await Promise.all([
        getHeader(locale),
        getFooter(locale),
        getSiteSettingData({ locale: locale }),
        sanityFetchCustom({
            query: getAllServicesQuery(locale),
            params: { locale },
            tags: ["service"],
        }),
        sanityFetchCustom({
            query: getBlogQuery(locale),
            params: { locale },
            tags: ["blog"],
        }),
        sanityFetchCustom({
            query: getBlogPageQuery(locale),
            params: { locale },
            tags: ["page:" + locale === "ar" ? "ar/blog" : "blog"],
        }),
    ]);


    return (
        <div className={`main_page innerPage`}>
            <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
            <div className=" dark:text-white text-black mt-[180px] min-h-screen  pageBg relative mb-16">
                <div className="py-8 md:pb-0 md:py-12 md:pt-0">
                    <div className="container-grid">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[15px] mb-6">
                        <Link href={`/${locale}`}>Home</Link>
                        <span>/</span>
                        <span className="opacity-60">{"Blog"}</span>
                    </div>
                    <h1 className="h1 mb-[50px] uppercase">latest <span className="text-[#C00034]">article</span></h1>
                    <Blogs blogs={blogs} />
                </div>
                </div>
            </div>
            <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
        </div>
    )
}