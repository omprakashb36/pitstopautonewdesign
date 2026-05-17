import { Offer, Service } from "@/sanity.types"
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import OfferDetails from "./OfferDetails";

type Props = {
    locale: string,
    headerData: any,
    footerData: any,
    offerDetail: Offer,
    siteSettingData: any
    services: Service[];
}

export default function OfferPageContent({ locale, headerData, footerData, offerDetail, siteSettingData, services }: Props) {
    return (
        <div className="main_page offersPage innerPage">
            <Header services={services} siteSettingData={siteSettingData} locale={locale} fragment={headerData} />
            <OfferDetails offerDetails={offerDetail} />
            <Footer services={services} siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
        </div>
    )
}