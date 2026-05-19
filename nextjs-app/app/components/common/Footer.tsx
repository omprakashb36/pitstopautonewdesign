"use client"
import Image from "next/image";
import Link from "next/link";
import type { FooterQueryResult, SettingsQueryResult, Service } from "@/sanity.types"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import ImageComp from "../CustomImage"
import { urlForImage } from "@/sanity/lib/utils";

type FooterProps = {
  locale: string
  fragment: FooterQueryResult
  siteSettingData: SettingsQueryResult
  services: Service[]
}

export default function Footer({ locale, fragment, siteSettingData, services }: FooterProps) {
  const { isMobileDevice, currentLocale } = useDeviceDetection()
  const getLinkHref = (link: any) => {
    if (link?.linkType === "href") {
      return link.href ?? "#";
    } else if (link?.linkType === "path") {
      return link.path ?? "#";
    } else if (link?.linkType === "car") {
      return `/${locale}/car/${link.car.slug}`;
    } else if (link?.page?.slug) {
      let slug = link.page.slug;
      // Remove locale prefix if it exists (e.g., "ar/pagelink" -> "pagelink")
      if (slug.startsWith(`${locale}/`)) {
        slug = slug.replace(`${locale}/`, "");
      }
      return `/${locale}/${slug}`;
    } else {
      return "#";
    }
  };

  return (
    <footer className="bg-[#fafafa] dark:bg-[#121212] pt-24 md:pt-[120px] pb-8 md:pb-12 relative mt-[120px] md:mt-[165px]">
      
      {/* Background Pattern (Optional placeholder for the ellipse/image graphic) */}
      <div className="absolute right-0 top-0 w-1/3 h-[80%] opacity-20 pointer-events-none hidden lg:block mask-image-gradient">
        {/* Abstract pattern space */}
      </div>

      {/* Hero Car Image */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[-100px] md:top-[-180px] 3xl:top-[-165px] w-full max-w-[600px] md:max-w-[400px] 3xl:max-w-[546px] aspect-[16/9] z-20 pointer-events-none">
        <Image
          src={urlForImage(fragment?.footer?.centerFarrari?.image)?.url() || ""}
          alt={fragment?.footer?.centerFarrari?.altText || "Pitstop Car"}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="container-grid mx-auto px-0 2xl:px-[100px] 3xl:px-[140px] relative z-30 flex flex-col h-full">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[40px] mt-10 3xl:mt-[60px]">
          
          {/* Left Column: Services & Links (Span 8) */}
          <div className="col-span-1 lg:col-span-9 flex flex-col justify-between">
            
            {/* Services List */}
            <div className="mb-8">
              <h3 className="font-host font-medium text-[12px] text-pitstop-oil-black/50 dark:text-white/50 uppercase tracking-widest mb-6">
                {fragment?.footer?.servicesList?.title || "SERVICES"}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[12px]">
                {services.map((service, index) => (
                  <div key={service?._id} className="flex items-center gap-[12px]">
                    <Link
                      href={`/${currentLocale}/services/${service.slug?.current?.replace(/^ar\//, "")}`}
                      className="font-host font-normal text-[16px] md:text-[18px] text-pitstop-oil-black dark:text-white hover:text-pitstop-fiery-orange transition-colors whitespace-nowrap"
                    >
                      {service.title}
                    </Link>
                    {index < services.length - 1 && (
                      <span className="font-host text-[18px] text-pitstop-oil-black/20 dark:text-white/20 select-none">
                        /
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav Links */}
            <div className="flex flex-wrap gap-[24px]">
              {fragment?.footer?.linkList?.links?.map((link) => (
                <Link
                  key={link._key}
                  href={getLinkHref(link.link)}
                  className="font-host font-normal text-[16px] md:text-[18px] text-pitstop-oil-black/50 dark:text-white/50 hover:text-pitstop-fiery-orange transition-colors hover:opacity-100 whitespace-nowrap"
                >
                  {link.linkText}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Contact Info (Span 4) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col items-start lg:items-end justify-start lg:text-right gap-[24px]">
            
            {/* Phone & Email */}
            <div className="flex flex-col items-start lg:items-end w-full">
              <Link href={`tel:${siteSettingData?.fragmentItem?.pitstopContact}`} className="font-host font-bold text-[22px] text-pitstop-oil-black dark:text-white hover:text-pitstop-fiery-orange transition-colors">
                {siteSettingData?.fragmentItem?.pitstopContact}
              </Link>
              <Link href={`mailto:${siteSettingData?.fragmentItem?.pitstopEmail}`} className="font-host font-normal text-[14px] text-pitstop-oil-black dark:text-white hover:text-pitstop-fiery-orange transition-colors">
                {siteSettingData?.fragmentItem?.pitstopEmail}
              </Link>
            </div>

            {/* Address */}
            <div className="flex flex-col items-start lg:items-end w-full">
              <p className="font-host font-normal caption-14 text-[#393D45] dark:text-gray-400">
                {String(siteSettingData?.fragmentItem?.addressLine1 || "")}
                <br />
                {String(siteSettingData?.fragmentItem?.addressLine2 || "")}
              </p>
            </div>

            {/* Working Hours */}
            <div className="flex flex-col items-start lg:items-end w-full gap-[4px]">
              <p className="font-host font-normal text-[28px] text-pitstop-oil-black dark:text-white">
                {siteSettingData?.fragmentItem?.openTime}—{siteSettingData?.fragmentItem?.closeTime}
              </p>
              <div className="flex items-center justify-center gap-[8px] w-full lg:w-auto">
                <span className="font-host font-medium text-[12px] text-[#393D45] dark:text-gray-400">
                  {String(siteSettingData?.fragmentItem?.OpenDay || "Mo")}
                </span>
                <div className="h-px w-[60px] md:w-[100px] bg-[#393D45] dark:bg-gray-400 opacity-20"></div>
                <span className="font-host font-medium text-[12px] text-[#393D45] dark:text-gray-400">
                  {String(siteSettingData?.fragmentItem?.endDay || "Fr")}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="mt-10 lg:mt-[60px] 3xl:mt-[90px] grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-0 items-end">
          
          {/* AGMC Section (Left) */}
          <div className="flex flex-col items-center md:items-start justify-end order-3 md:order-1 text-center md:text-left">
            <div className="relative w-[154px] h-6 mb-4">
              {fragment?.footer?.agmcLogo?.altText && (
                <ImageComp
                  block={fragment?.footer?.agmcLogo}
                  imageClassName="w-full h-full object-contain"
                  width={154}
                  height={24}
                />
              )}
            </div>
            <p className="font-host font-medium text-[12px] text-pitstop-oil-black/60 dark:text-white/60">
              {fragment?.footer?.copyrightText || "©2026. Pitstop. All Rights Reserved"}
            </p>
          </div>

          {/* Pitstop Logo (Center) */}
          <div className="flex justify-center items-end order-1 md:order-2">
            <div className="w-[180px] md:w-[220px] 3xl:w-[280px] h-[40px] md:h-[60px] relative">
              {fragment?.footer?.footerLogo2?.altText ? (
                <ImageComp
                  block={fragment?.footer?.footerLogo2}
                  imageClassName="w-full h-full object-contain"
                  width={280}
                  height={60}
                />
              ) : (
                <Image
                  src="/images/logo-dark.svg"
                  alt="Pitstop360 Logo"
                  fill
                  className="object-contain dark:invert"
                />
              )}
            </div>
          </div>

          {/* Follow Us Section (Right) */}
          <div className="flex flex-col items-center md:items-end justify-end order-2 md:order-3 text-center md:text-right gap-[16px]">
            <p className="font-host font-medium text-[12px] text-[#393D45] dark:text-gray-400">
              {String(siteSettingData?.fragmentItem?.followUs || 'Follow us')}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-[8px]">
              {[
                { key: "instagram", link: siteSettingData?.fragmentItem?.instagramLink, title: siteSettingData?.fragmentItem?.instagramTitle || "Instagram" },
                { key: "facebook", link: siteSettingData?.fragmentItem?.facebookLink, title: siteSettingData?.fragmentItem?.facebookTitle || "Facebook" },
                { key: "twitter", link: siteSettingData?.fragmentItem?.twitterLink, title: siteSettingData?.fragmentItem?.twitterTitle || "Twitter" },
                { key: "youtube", link: siteSettingData?.fragmentItem?.youtubeLink, title: siteSettingData?.fragmentItem?.youtubeTitle || "YouTube" },
              ].map(({ key, link, title }, index, arr) =>
                link ? (
                  <div key={key} className="flex items-center gap-[8px]">
                    <Link
                      href={link}
                      target="_blank"
                      className="font-host font-normal text-[16px] text-pitstop-oil-black dark:text-white hover:text-pitstop-fiery-orange transition-colors"
                    >
                      {String(title)}
                    </Link>
                    {index < arr.length - 1 && (
                      <span className="font-host text-[16px] text-[#393D45] dark:text-gray-400 opacity-20 select-none">
                        /
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-[24px]">
              {fragment?.footer?.privacyPolicyLink?.links?.map((link) => (
                <Link
                  key={link._key}
                  href={getLinkHref(link.link)}
                  className="font-host font-medium text-[12px] text-pitstop-oil-black/60 dark:text-white/60 hover:text-pitstop-fiery-orange transition-colors"
                >
                  {link.linkText}
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
