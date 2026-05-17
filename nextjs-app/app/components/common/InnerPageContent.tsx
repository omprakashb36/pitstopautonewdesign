// app/components/InnerPageContent.tsx
'use client';

import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import PageBuilderPage from "@/app/components/PageBuilder";
import { GetPageQueryResult,Service } from "@/sanity.types";
import { useLenis } from "@/app/hooks/useLenis";

type Props = {
  locale: string;
  headerData: any;
  footerData: any;
  siteSettingData: any;
  page: GetPageQueryResult;
  services: Service[];
};

export default function InnerPageContent({
  locale,
  headerData,
  footerData,
  siteSettingData,
  page,
  services
}: Props) {
  useLenis();

  return (
    <div className="main_page innerPage">
      <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <div className="text-white mt-[180px] min-h-[400px] pageBg relative">
        <PageBuilderPage page={page} />
      </div>
      <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
