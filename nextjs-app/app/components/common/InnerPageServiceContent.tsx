// app/components/InnerPageContent.tsx
'use client';

import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { GetServiceDetailQueryResult,SettingsQueryResult } from "@/sanity.types";
import { useLenis } from "@/app/hooks/useLenis";
import ServiceListing from "./ServiceListing";
import { Service } from "@/sanity.types"
import TestimonialComp from "./Testimonial";
import Faq from "./Faq";

type Props = {
  locale: string;
  headerData: any;
  footerData: any;
  siteSettingData: SettingsQueryResult;
  page: GetServiceDetailQueryResult;
  browseServiceList: Service[];
};

export default function InnerPageContent({
  locale,
  headerData,
  footerData,
  siteSettingData,
  page,
  browseServiceList,
}: Props) {
  useLenis();


  return (
    <div className="main_page innerPage">
      <Header services={browseServiceList} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <div className="text-white md:mt-[180px] min-h-screen relative serviceDetailPage">
        <ServiceListing siteSettingData={siteSettingData} browseServiceList={browseServiceList} allServiceList={page} />
      </div>
      <TestimonialComp
        block={{
          _type: "testimonial",
          heading: siteSettingData?.testimonialHeading?.toString() ?? "",
          subHeading: siteSettingData?.testimonialSubHeading?.toString() ?? "",
        }}
        index={0}
      />
      <Faq block={{
        _type: "faqSection",
        heading: siteSettingData?.faqTitle?.toString() ?? "",
      }}
        index={0} />

      <Footer services={browseServiceList} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
