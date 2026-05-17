"use client";

import { useState } from "react";
import Link from "next/link";
import CarSelectorModal from "./CarSelectorModal"
import Image from "next/image";
import type { HeaderQueryResult, SettingsQueryResult, Service } from "@/sanity.types"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { usePathname, useRouter } from "next/navigation"
import { setCartPopup } from "../../lib/redux/slices/carSlice"
import { useDispatch } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes"

type HeaderProps = {
  locale: string
  fragment: HeaderQueryResult
  siteSettingData: SettingsQueryResult
  services: Service[]
}

export default function Header({ fragment, siteSettingData, services }: HeaderProps) {
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentLocale, isMobileDevice } = useDeviceDetection()

  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme();

  const switchLanguage = (lang: string) => {
    if (lang != currentLocale) {
      const newPath = `/${lang}${pathname.replace(`/${currentLocale}`, "")}`
      router.push(newPath)
    }
  }

  const shouldShowButton = pathname.includes('service-cart') || pathname.includes('services');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {!isMenuOpen &&
        <ThemeToggle />
      }
      {shouldShowButton && isMobileDevice && !isMenuOpen &&
        <button className="h-10 md:hidden w-10 absolute z-[49] top-12 ltr:right-[62px] rtl:left-[62px]" onClick={() => { dispatch(setCartPopup(true)); }}>
          <Image
            src={`${theme === 'dark' ? '/images/icons/cart-icon.svg' : '/images/icons/cart-icon-light.svg'}`}
            alt="cart icon"
            width={40}
            height={40}
            className=""
          />
        </button>
      }
      <div
        className="absolute z-[48]  top-0 grid w-full grid-cols-3 items-center justify-center gap-4 space-y-0 px-6 xl:px-[60px] 2xl:px-[116px] pt-4 lg:space-y-0 lg:pt-[45px]"
        style={{ opacity: 1, transform: "none" }}
      >
        <div className="flex items-center gap-[33px]">
          <div>
            <button
              type="button"
              aria-label="Toggle Menu"
              className="relative right-0 z-40 flex size-14 cursor-pointer items-center justify-center p-2"
              onClick={toggleMenu}
            >
              <div className="w-full toggleButton">
                <div
                  className={`before relative top-[5px] mx-auto block h-px bg-black dark:bg-white transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`}
                ></div>
                <div
                  className={`after relative -top-[5px] mx-auto block h-px dark:bg-white bg-black  transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
                ></div>
              </div>
            </button>

            <div
              className="fixed ltr:left-0 rtl:right-0 top-0 z-[100] flex h-screen w-full bg-black/30 text-sand-drift backdrop-blur-sm"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen
                  ? "none"
                  : (currentLocale === "ar"
                    ? "translateX(100%) translateZ(0px)"
                    : "translateX(-100%) translateZ(0px)"),
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: isMenuOpen ? "auto" : "none",
              }}
            >
              <div className="flex w-full flex-col dark:bg-[#faeadb] bg-white px-3 lg:px-6 xl:px-[60px] 3xl:px-[116px] py-4 pb-10 lg:w-3/5 gap-y-2 2xl:gap-[1rem] lg:py-12 ">
                <div className="flex shrink items-center justify-between gap-4 lg:justify-normal">
                  <button
                    type="button"
                    aria-label="Toggle Menu"
                    className="relative right-0 z-40 flex size-14 cursor-pointer items-center justify-center p-2"
                    onClick={toggleMenu}
                  >
                    <Image
                      src="/images/close-icon.svg"
                      alt="menu close-icon"
                      width={25}
                      height={25}
                    />

                  </button>
                  <div className="lead flex items-center gap-4 col-start-3 justify-end">
                    <div className="langbtn">
                      {currentLocale === "en" && (
                        <button onClick={() => switchLanguage("ar")} className="font-urbanist font-bold text-[#C00034] text-sm lg:text-[15px] border dark:border-[#C00034] border-[#000] rounded-[10px] px-[26px] py-[13px] hover:bg-[#C00034] hover:text-white transition-colors duration-200 ease-in-out">
                          العربية
                        </button>
                      )}
                      {currentLocale === "ar" && (
                        <button onClick={() => switchLanguage("en")} className="font-urbanist font-bold text-[#C00034] text-sm lg:text-[15px] border border-[#C00034] rounded-[10px] px-[26px] py-[13px] hover:bg-[#C00034] hover:text-white transition-colors duration-200 ease-in-out">
                          English
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="menuWrap">

                <div className="flex grow flex-col gap-2 lg:flex-row lg:gap-20 xl:gap-32 2xl:gap-40 xl:max-h-[285px] md:max-h-[185px] overflow-y-auto pb-10 custom-scrollbar">
                  <div className="space-y-2">
                    {services?.slice(0, 8).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          opacity: isMenuOpen ? 1 : 0,
                          transform: "translateY(24px) translateZ(0px)",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                        }}
                      >
                        <Link
                          className="font-urbanist md:text-[17px] text-[16px] font-normal text-[#000] transition-colors duration-200 ease-in-out hover:text-[#C00034]"
                          href={`/${currentLocale}/services/${item.slug?.current?.replace(/^ar\//, "")}`}
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 md:hidden">
                    <div
                      style={{
                        opacity: isMenuOpen ? 1 : 0,
                        transform: "translateY(24px) translateZ(0px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      <Link
                        className="font-urbanist md:text-[17px] text-[16px] font-normal text-[#c00034] transition-colors duration-200 ease-in-out hover:text-[#C00034]"
                        href={`/${currentLocale}/services`}
                      >
                        View All Services
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2 mhidden">
                    {services?.slice(8, services?.length - 1).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          opacity: isMenuOpen ? 1 : 0,
                          transform: "translateY(24px) translateZ(0px)",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                        }}
                      >
                        <Link
                          className="font-urbanist md:text-[17px] text-[16px] font-normal text-[#000] transition-colors duration-200 ease-in-out hover:text-[#C00034]"
                          href={`/${currentLocale}/services/${item.slug?.current?.replace(/^ar\//, "")}`}
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-5 headerLink">
                  {(fragment?.header?.headerLink?.links as any)?.map((item: any, index: number) => (
                    <Link
                      key={index}
                      className="font-urbanist md:text-[17px] text-[16px] font-normal text-[#000] transition-colors duration-200 ease-in-out hover:text-[#C00034]"
                      href={`/${currentLocale}/${item?.link?.page?.slug || 'about-us'}`}
                    >
                      {item?.linkText}
                    </Link>
                  ))}
                </div>
                </div>
                 <div className="menuWrapBtm absolute bottom-10 md:w-[55%]">
                <div className="flex flex-col gap-6 lg:w-[110%] lg:flex-row lg:items-end lg:justify-between">
                  <div
                    className="space-y-6"
                    style={{
                      opacity: isMenuOpen ? 1 : 0,
                      transform: "translateY(24px) translateZ(0px)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-shoulders font-bold text-black text-base lg:text-[22px] text-foreground">
                        {siteSettingData?.fragmentItem?.pitstopContact}
                      </p>
                      <p className="font-urbanist text-black text-foreground text-xs lg:text-sm">
                        {siteSettingData?.fragmentItem?.pitstopEmail}
                      </p>
                    </div>
                    {siteSettingData?.fragmentItem?.addressLine1 && 
                    <p className="font-urbanist md:max-w-[200px] text-foreground text-xs lg:text-sm text-justify opacity-50">
                      {String(siteSettingData?.fragmentItem?.addressLine1 || "")}<br />{String(siteSettingData?.fragmentItem?.addressLine2 || "")}
                    </p>
}
                    <div className="w-64 space-y-1 text-sand-drift">
                      <div className="flex items-center justify-between">
                        <p className="font-shoulders text-base lg:text-3xl dark:text-sand-drift text-[#000000]">
                          {siteSettingData?.fragmentItem?.openTime}
                        </p>
                        <div className="mx-1 grow border-t-2 border-sand-drift"></div>
                        <p className="font-shoulders text-base lg:text-3xl dark:text-sand-drift text-[#000000]">
                          {siteSettingData?.fragmentItem?.closeTime}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <p className="font-urbanist text-xs lg:text-sm dark:text-sand-drift text-[#000000]">
                          {String(siteSettingData?.fragmentItem?.OpenDay || "")}
                        </p>
                        <div className="mx-2 grow border-t border-sand-drift/50"></div>
                        <p className="font-urbanist text-xs lg:text-sm dark:text-sand-drift text-[#000000]">
                          {String(siteSettingData?.fragmentItem?.endDay || "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      opacity: isMenuOpen ? 1 : 0,
                      transform: "translateY(24px) translateZ(0px)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    <div>
                      <h3 className="font-shoulders md:ltr:text-right rtl:text-left text-xs lg:text-sm mb-4 uppercase text-[#000000]">
                        {String(siteSettingData?.fragmentItem?.followUs || '')}
                      </h3>
                      <nav aria-label="breadcrumb" className="relative z-10">
                        <ol className="flex flex-nowrap items-center whitespace-nowrap">


                          {[
                            { key: "facebook", link: siteSettingData?.fragmentItem?.facebookLink, title: siteSettingData?.fragmentItem?.facebookTitle },
                            { key: "instagram", link: siteSettingData?.fragmentItem?.instagramLink, title: siteSettingData?.fragmentItem?.instagramTitle },
                            { key: "twitter", link: siteSettingData?.fragmentItem?.twitterLink, title: siteSettingData?.fragmentItem?.twitterTitle },
                            { key: "youtube", link: siteSettingData?.fragmentItem?.youtubeLink, title: siteSettingData?.fragmentItem?.youtubeTitle },
                          ].map(({ key, link, title }, index, arr) =>
                            link ? (
                              <li
                                key={key}
                                className="inline-flex items-center hover:accent-muted"
                              >
                                <Link
                                  key={key}
                                  href={link}
                                  target="_blank"
                                  className="font-urbanist text-xs lg:text-sm flex items-center font-light text-[#000000]"
                                >
                                  {String(title)}
                                </Link>
                                {index < arr.length - 1 && (
                                  <span className="mx-2 dark:text-neutral-500 text-[#000000]">/</span>
                                )}
                              </li>
                            ) : null
                          )}
                        </ol>
                      </nav>
                      <div className="mt-4 flex gap-4">
                        {[
                          { name: "Terms of service", href: "/en/terms-and-conditions" },
                          { name: "Privacy", href: "/en/privacy-policy" },
                          { name: "Cookie policy", href: "/en/cookie-policy" },
                        ].map((link, index) => (
                          <Link
                            key={index}
                            href={link.href}
                            className="font-urbanist text-xs dark:text-neutral-500 text-[#000000] hover:text-neutral-950"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <svg
                className="-mr-1 hidden h-full w-fit dark:text-[#faeadb] text-white lg:block rtl:-ml-1 rtl:mr-0 rtl:-scale-x-100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m0 0 212 1080H0V0ZM260 1080h-31L17 0h29l214 1080ZM303 1080h-31L60 0h29l214 1080Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>

          <div className="space-y-1 items-center callBtn justify-center  gap-[33px] hidden lg:flex">
            <div>
              <p className="font-urbanist dark:text-[#FAEADC] text-black text-sm lg:text-[15px] opacity-50 font-semibold">
                {fragment?.header?.callUs}
              </p>
              <p className="font-shoulders font-semibold dark:text-[#FAEADC] text-black text-eyebrow-lg leading-none lg:text-[33px]">
                {fragment?.header?.contact}
              </p>
            </div>
            <div className="langbtn">
              {currentLocale === "en" && (
                <button onClick={() => switchLanguage("ar")} className="font-urbanist font-bold dark:text-[#FAEADC] text-black text-sm lg:text-[15px] border dark:border-[#FAEADC] border-black rounded-[10px] px-[26px] py-[13px] transition-colors duration-200 ease-in-out">
                  العربية
                </button>
              )}
              {currentLocale === "ar" && (
                <button onClick={() => switchLanguage("en")} className="font-urbanist font-bold dark:text-[#FAEADC] text-black text-sm lg:text-[15px] border dark:border-[#FAEADC] border-black rounded-[10px] px-[26px] py-[13px] transition-colors duration-200 ease-in-out">
                  English
                </button>
              )}


            </div>
          </div>
        </div>

        <div className="col-start-2 flex items-center justify-center">
          <Link href={`/${currentLocale}`}>
            <Image
              src="/images/lightLogo.svg"
              alt="logo icon"
              width={101}
              height={106}
              className="logoHome"
            />
            <Image
              src="/images/darkLogo.svg"
              alt="logo dark icon"
              width={101}
              height={106}
              className="logoInner"
            />
          </Link>
        </div>
      </div>
      <div className="md:absolute fixed bottom-0 topBtnFixed z-50 w-full ltr:md:max-w-[227px] rtl:md:max-w-[240px] md:h-[61px] h-[51px] max-w-[190px] lg:bottom-auto lg:top-[58px] ltr:right-0 rtl:left-0">
        <Link href={`/${currentLocale}/contact-us`} className="w-full md:h-auto h-[51px]">
          <div className="flex">
            <svg
              className="-mr-px shrink  md:h-[61px] h-[51px] rtl:scale-x-[-1] rtl:transform text-[#c20034]"
              viewBox="0 0 86 95"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M70 95L43.7045 0L32 0L57.2292 95H70Z"
                fill="currentColor"
              ></path>
              <path
                d="M86 95V47.5V0L48 0L73.2292 95H86Z"
                fill="currentColor"
              ></path>
              <path
                d="M54 95L27.7045 0L16 0L41.2292 95H54Z"
                fill="currentColor"
              ></path>
              <path
                d="M36.6905 93.9924L10.95 1.00777L1.29509 1.00777L25.9877 93.9924H36.6905ZM38 95.0001H25.2279L-1.00091e-06 6.10352e-05L11.7015 6.10352e-05L38 95.0001Z"
                fill="currentColor"
              ></path>
            </svg>
            <p className="flex grow font-shoulders md:h-auto h-[55px] items-center text-[#FAEADC] font-bold justify-center whitespace-nowrap text-[20px] uppercase leading-none tracking-wide lg:text-[24px] bg-[#C00034]">
              {fragment?.header?.cornerLogo}
            </p>

          </div>
        </Link>
      </div>
      <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettingData} />
    </>
  );
}
