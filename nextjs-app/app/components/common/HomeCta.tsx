"use client";
import CarSelectorModal from "./CarSelectorModal"
import { useState, useEffect } from "react"
import { HomeCta } from "@/sanity.types";
import ImageComp from "../CustomImage";
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { getSiteSettingData } from "@/app/actions/common/sanityData";
import { SettingsQueryResult } from "@/sanity.types";
import { Button } from "@/app/components/ui/Button";

type HomeCtaProps = {
  block: HomeCta
  index: number
}

export default function HomeCtaComp({ block }: HomeCtaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentLocale } = useDeviceDetection()
  const [siteSettings, setSiteSettings] = useState<SettingsQueryResult>();

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const data: SettingsQueryResult = await getSiteSettingData({ locale: currentLocale })
        setSiteSettings(data);
      } catch (error) {
        console.log("no site setting data found", error)
      }
    }
    fetchSiteSettings();
  }, [currentLocale]);

  return (
    <>
      {siteSettings && (
        <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettings} />
      )}
      
      <div className="w-full bg-[#EAEAEA] dark:bg-[#141414] overflow-hidden relative py-12 lg:py-0 md:mb-[100px] mb-8">
        {/* ========================================================
            PIXEL-PERFECT CSS GRID CONTAINER
            1920px screen -> 1640px container, 40px gap
            1440px screen -> 1280px container, 24px gap
            ======================================================== */}
        <div className="container-grid mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-[40px] lg:gap-x-[24px] 3xl:gap-x-[40px] px-6 lg:px-0 lg:h-[452px] items-center">
          
          {/* Left Image (5 columns) */}
          <div className="col-span-1 lg:col-span-5 relative h-auto lg:h-[452px] w-full flex items-end lg:items-center justify-center lg:justify-start">
             {block.leftImage?.altText && (
                <div className="hidden lg:block w-full h-full">
                  <ImageComp
                    block={block.leftImage}
                    imageClassName="object-contain w-full h-full object-left-bottom rtl:scale-x-[-1]"
                    width={708}
                    height={452}
                  />
                </div>
              )}
              {block.mobileLeftImage?.altText && (
                <div className="block lg:hidden w-full h-full">
                  <ImageComp
                    block={block.mobileLeftImage}
                    imageClassName="object-cover object-bottom w-full h-full"
                    width={608}
                    height={400}
                  />
                </div>
              )}
          </div>

          {/* Right Content (7 columns) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center lg:items-start gap-[24px] w-full text-center lg:text-left">
            
            <div className="flex flex-col leading-[1.1] w-full">
              {block.heading && (
                <p className="font-medium text-[30px] lg:text-[40px] 3xl:text-[50px] text-pitstop-oil-black dark:text-white rtl:font-cairo leading-[1.1] ltr:font-host font-host tracking-[-1.5px] lg:tracking-[-2.5px]">
                  {block.heading}
                </p>
              )}
              {block.subHeading && (
                <p className="font-extrabold text-[40px] lg:text-[60px] 3xl:text-[80px] text-pitstop-fiery-orange rtl:font-cairo leading-[1.1] ltr:font-host font-host tracking-[-2px] lg:tracking-[-4px]">
                  {block.subHeading}
                </p>
              )}
            </div>

            {block.ButtonUrl?.buttonText && (
              <div className="w-full sm:w-auto mt-4 lg:mt-0">
                <Button 
                  variant="orange"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto tracking-wide"
                >
                  {block.ButtonUrl.buttonText}
                </Button>
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  )
}

