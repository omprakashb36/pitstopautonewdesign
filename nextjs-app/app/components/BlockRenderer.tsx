import React from "react";
import Cta from "@/app/components/Cta";
import Info from "@/app/components/InfoSection";
import { dataAttr } from "@/sanity/lib/utils";
import RichTextTitleComp from "./RichTextTitleComp";
import HomeTesla from "@/app/components/common/HomeTesla";
import HomeIntro from "@/app/components/common/HomeIntro";
import HomeFleet from "@/app/components/common/HomeFleet";
import HomeCta from "@/app/components/common/HomeCta";
import HeroSlider from "@/app/components/common/HeroSlider";
import CarServicesList from "@/app/components/common/CarServicesList";
import LogoList from "@/app/components/common/LogoList";
import HowWeDoIt from "@/app/components/common/HowWeDoIt";
import Testimonial from "@/app/components/common/Testimonial";
import TermsAndConditions from "@/app/components/common/TermsAndConditions";
import ServiceListing from "@/app/components/common/ServiceListing"
import FAQ from "@/app/components/common/Faq"
import ScrollContent from "@/app/components/common/ScrollContent"
import ImageRichText from "@/app/components/common/ImageRichText"
import ServiceBookedTesla from "@/app/components/common/ServiceBookedTesla"
import ServiceBooked from "@/app/components/common/ServiceBooked"
import ServiceCart from "@/app/components/common/ServiceCart"
import Locations from "@/app/components/common/Locations"
import ExtendedWarranty from "@/app/components/common/ExtendedWarranty"
import FleetManagement from "@/app/components/common/FleetManagement"
import ContactUsForm  from "@/app/components/common/ContactUsForm"
import CarSelectionTesla from "./common/CarSelectionTesla";
import HomeBlogComp from "./common/HomeBlogComp";
import RichText from "./common/RichText";
import BlogImage from "./common/BlogImage";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
  richTextTitle: RichTextTitleComp,
  homeTesla: HomeTesla,
  homeIntro: HomeIntro,
  homeFleet: HomeFleet,
  homeCta: HomeCta,
  homeHeroSlider : HeroSlider,
  carServicesList: CarServicesList,
  logoList: LogoList,
  homeWorkFlow: HowWeDoIt,
  testimonial: Testimonial,
  termsAndConditionSection: TermsAndConditions,
  serviceListing : ServiceListing,
  faqSection : FAQ,
  scrollContent : ScrollContent,
  imageRichText : ImageRichText,
  serviceBookedTesla : ServiceBookedTesla,
  serviceBooked : ServiceBooked,
  serviceCart : ServiceCart,
  location : Locations,
  extendedWarrantyForm : ExtendedWarranty,
  fleetManagement : FleetManagement,
  contactUsForm : ContactUsForm,
  teslaAppointmentForm:  CarSelectionTesla,
  homeBlog : HomeBlogComp,
  richText : RichText,
  blogImage : BlogImage
};

/**x
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */

export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
        })}
      </div>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
