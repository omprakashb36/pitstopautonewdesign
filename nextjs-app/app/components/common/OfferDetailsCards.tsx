"use client";
import { Offer } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import type { PortableTextBlock } from "next-sanity";
import ImageComp from "../CustomImage";
import CustomPortableText from "@/app/components/PortableText";
import useDeviceDetection from "@/app/hooks/useDeviceDetection";

type OfferDetailProp = {
  offerDetails: Offer;
};

export default function OfferDetailsCards({ offerDetails }: OfferDetailProp) {
     const { isMobileDevice, currentLocale } = useDeviceDetection();
  return (
    <>
      <div className="xl:space-y-[24px] 3xl:space-y-10 space-y-5 mt-10 pb-[120px] xl:pb-[60px] ">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-[24px] 3xl:gap-10 gap-5">
          <div className="">
            {offerDetails?.richText?.slice(0, 1).map((rich) => (
              <div key={rich._key} className="w-full">
                {rich.offerRichText?.length ? (
                  <PortableText
                    className="richTextImage"
                    value={rich.offerRichText as PortableTextBlock[]}
                  />
                ) : null}
              </div>
            ))}
            <div className="mt-10">
              {offerDetails?.detailImage?.altText && (
                <ImageComp
                  block={offerDetails.detailImage}
                  width={2732}
                  height={918}
                  imageClassName={`w-full ${isMobileDevice ? "rounded-[20px]" : "rounded-[60px]"}  h-full object-cover object-left-bottom transition-transform duration-500 group-hover:scale-105`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start md:grid-cols-2 xl:gap-[24px] 3xl:gap-10 gap-5">
          <div className="border border-[#D9D9D9] rounded-[20px] xl:rounded-[30px] 3xl:rounded-[40px]">
            {offerDetails?.richText?.slice(1, 2).map((rich) => (
              <div key={rich._key} className="w-full">
                {rich.offerRichText?.length ? (
                  <PortableText
                    className="richTextTitle"
                    value={rich.offerRichText as PortableTextBlock[]}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5 xl:gap-6 3xl:gap-10">
            <div className="border border-[#D9D9D9] rounded-[20px] xl:rounded-[30px] 3xl:rounded-[40px]">
              {offerDetails?.richText?.slice(2, 3).map((rich) => (
                <div key={rich._key} className="w-full">
                  {rich.offerRichText?.length ? (
                    <PortableText
                      className="richTextTitle"
                      value={rich.offerRichText as PortableTextBlock[]}
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="border border-[#D9D9D9] rounded-[20px] xl:rounded-[30px] 3xl:rounded-[40px]">
              {offerDetails?.richText?.slice(3, 4).map((rich) => (
                <div key={rich._key} className="w-full">
                  {rich.offerRichText?.length ? (
                    <PortableText
                      className="richTextTitle"
                      value={rich.offerRichText as PortableTextBlock[]}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
