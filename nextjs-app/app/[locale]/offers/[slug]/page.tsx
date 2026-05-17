import { getFooter, getHeader, getSiteSettingData } from "@/app/actions/common/sanityData";
import OfferPageContent from "@/app/components/common/OfferPageContent";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { offerDetailsQuery, getAllServicesQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";


export default async function name({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const updatedSlug = locale === 'ar' ? `ar/${slug}` : slug;

    const [headerData, footerData, offerDetails, siteSettingData, service] = await Promise.all([getHeader(locale),
    getFooter(locale),
    sanityFetchCustom({
        query: offerDetailsQuery,
        params: { slug: updatedSlug },
        tags: [`offer`],
    }),
    getSiteSettingData({ locale }),
    sanityFetchCustom({
        query: getAllServicesQuery(locale),
        params: { locale },
        tags: ["service"],
    }),
    ]);

    if (!offerDetails?._id) return notFound();

    return (

        <OfferPageContent
            locale={locale}
            headerData={headerData}
            footerData={footerData}
            offerDetail={offerDetails}
            siteSettingData={siteSettingData}
            services={service}
        />

    )
}