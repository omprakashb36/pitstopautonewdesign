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
  services : Service[];
  
};

export default function HomePageContent({ locale, headerData, footerData, siteSettingData, page, services }: Props) {
  useLenis();

  return (
    <div className="homePage">
      <Header services ={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
      <PageBuilderPage page={page} />
      <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
