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
    <footer className="dark:bg-black bg-[#EEEEEE] text-white pt-16 relative mt-[170px]">
      {/* Hero Car Image */}
      <div className="relative w-full h-64 md:mb-8 mb-0 md:mt-[-170px]">
        <Image
          src={urlForImage(fragment?.footer?.centerFarrari?.image)?.url() || ""}
          alt={fragment?.footer?.centerFarrari?.altText || ""}
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1080px] mx-auto px-4 md:pb-8 pb-0">
        <div className="grid-cols-1 lg:grid-cols-3 gap-8 md:grid hidden">
          {/* Services Column */}
          <div className="col-span-2">
            <h3 className="dark:text-[#FAEADC] text-black opacity-50 text-[12px] mb-[26.5px] font-urbanist">
              {fragment?.footer?.servicesList?.title}
            </h3>
            <div className="flex flex-wrap">
              {services.map((service, index) => (
                <div key={service?._id} className="flex items-center">
                  <Link
                    href={`/${currentLocale}/services/${service.slug?.current?.replace(/^ar\//, "")}`}
                    className="sandDrift text-[15px] hover:text-red-500 transition-colors font-urbanist"
                  >
                    {service.title}
                  </Link>
                  {index < services.length - 1 && (
                    <span className="mx-2 text-gray-600">/</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-[42px] flex flex-wrap gap-8">
              {fragment?.footer?.linkList?.links?.map((link) => (
                <Link
                  key={link._key}
                  href={getLinkHref(link.link)}
                  className="sandDrift hover:text-red-500 opacity-50 text-[15px] transition-colors font-urbanist hover:opacity-100"
                >
                  {link.linkText}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <div className="flex flex-col md:items-end">
              <p className="text-[16.6px] font-urbanist font-light mb-1 sandDrift">
                {siteSettingData?.fragmentItem?.pitstopContact}
              </p>
              <Link
                href=
                {`mailto:${siteSettingData?.fragmentItem?.pitstopEmail}`}
                className="sandDrift hover:text-red-500 text-[11.62px] transition-colors font-urbanist"
              >
                {siteSettingData?.fragmentItem?.pitstopEmail}
              </Link>

              <div className="mt-5 md:text-right text-[11.62px]">
                <p className="sandDrift opacity-50 font-urbanist">
                  {String(siteSettingData?.fragmentItem?.addressLine1 || "")}
                </p>
                <p className="sandDrift opacity-50 font-urbanist">
                  {String(siteSettingData?.fragmentItem?.addressLine2 || '#')}
                </p>
              </div>

              <div className="mt-5 md:ltr:text-right md:rtl:text-left">
                <p className="text-2xl sandDrift font-light font-urbanist">{siteSettingData?.fragmentItem?.openTime}—{siteSettingData?.fragmentItem?.closeTime}</p>
                <div className="flex md:justify-end items-center gap-2 mt-1">
                  <span className="sandDrift opacity-50 font-urbanist text-[10px]">{String(siteSettingData?.fragmentItem?.OpenDay || "")}
                  </span>
                  <div className="w-16 h-px bg-gray-700"></div>
                  <span className="sandDrift opacity-50 font-urbanist text-[10px]">{String(siteSettingData?.fragmentItem?.endDay || "")}</span>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Bottom Row with AGMC, Pitstop Logo, and Follow Us */}
        <div className="mt-[73.5px] grid grid-cols-1 md:grid-cols-3 items-center relative">
          {/* AGMC Section */}
          <div className="block items-center md:justify-start justify-center mb-8 md:mb-0">
            <div className="relative w-24 h-12">

              {fragment?.footer?.agmcLogo?.altText && (
                <ImageComp
                  block={fragment?.footer?.agmcLogo}
                  imageClassName="w-[96px] h-[48px] dark:flex hidden"
                  width={100}
                  height={105}
                />
              )}
              <Image
                src="/images/agmc-dark.svg"
                alt="agmc logo"
                width={16.7}
                height={16.7}
                className="w-[96px] h-[48px] dark:hidden flex"
              />
            </div>
            <p className=" text-gray-500 mt-5 text-sm font-urbanist">
              {fragment?.footer?.copyrightText}
            </p>
          </div>

          {/* Pitstop Logo */}
          <div className="flex justify-center mb-8 md:mb-0 absolute md:static ltr:right-0 rtl:left-0">
            <div className="w-24 h-24 relative">
              {fragment?.footer?.footerLogo2?.altText && (
                <ImageComp
                  block={fragment?.footer?.footerLogo2}
                  imageClassName="w-[96px] h-[96px] "
                  width={100}
                  height={105}
                />
              )}
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="md:flex flex-col items-center md:items-end hidden">
            <p className="font-urbanist sandDrift text-[8.3px] mb-4 uppercase opacity-50">
              {String(siteSettingData?.fragmentItem?.followUs || '')}
            </p>
            <div className="flex gap-4 text-[13.28px]">
              {[
                { key: "facebook", link: siteSettingData?.fragmentItem?.facebookLink, title: siteSettingData?.fragmentItem?.facebookTitle },
                { key: "instagram", link: siteSettingData?.fragmentItem?.instagramLink, title: siteSettingData?.fragmentItem?.instagramTitle },
                { key: "twitter", link: siteSettingData?.fragmentItem?.twitterLink, title: siteSettingData?.fragmentItem?.twitterTitle },
                { key: "youtube", link: siteSettingData?.fragmentItem?.youtubeLink, title: siteSettingData?.fragmentItem?.youtubeTitle },
              ].map(({ key, link, title }) =>
                link ? (
                  <Link
                    key={key}
                    href={link}
                    target="_blank"
                    className="sandDrift hover:text-red-500 transition-colors font-urbanist"
                  >
                    {String(title)}
                  </Link>
                ) : null
              )}


            </div>
            <div className="mt-[18px] flex gap-6 justify-end">
              {fragment?.footer?.privacyPolicyLink?.links?.map((link) => (
                <Link
                  key={link._key}
                  href={getLinkHref(link.link)}
                  className="sandDrift text-[10px] opacity-50 hover:text-red-500 transition-colors font-urbanist"
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
