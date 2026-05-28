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
import ImageComp from "../CustomImage";

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
        <button className="h-10 md:hidden w-10 absolute z-[49] top-[28px] ltr:right-[62px] rtl:left-[62px]" onClick={() => { dispatch(setCartPopup(true)); }}>
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
        className="absolute overflow-hidden z-[48]  top-0 grid w-full grid-cols-3 items-center justify-center gap-4 space-y-0 pt-4 lg:space-y-0 lg:pt-[40px]"
        style={{ opacity: 1, transform: "none" }}
      >
        <div className="w-[100vw] py-[10px]">
          <div className="container-grid mx-auto w-full">
            <div className="flex items-center 3xl:gap-[40px] gap-5">
              <div>
                <button
                  type="button"
                  aria-label="Toggle Menu"
                  className="relative right-0 z-40 flex size-10 cursor-pointer items-center justify-center p-0"
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
                  <div className="flex h-full w-full flex-col dark:bg-[#faeadb] bg-white px-6 lg:pl-[80px] xl:pl-[100px] 2xl:pl-[80px] 3xl:pl-[140px] pt-[30px] 3xl:pt-[69px] pb-[30px] lg:pb-[40px] xl:w-[800px] 3xl:w-[900px] overflow-y-auto overflow-x-hidden relative">
                    {/* Close Button Row */}
                    <div className="flex shrink items-center justify-between gap-4 lg:justify-normal">
                      <button
                        type="button"
                        aria-label="Toggle Menu"
                        className="relative z-40 flex cursor-pointer items-center justify-center w-[30px] h-[30px]"
                        onClick={toggleMenu}
                      >
                        <Image
                          src="/images/close-icon.svg"
                          alt="menu close-icon"
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      </button>

                      <div className="langbtn lg:hidden ml-auto">
                        {currentLocale === "en" && (
                          <button onClick={() => switchLanguage("ar")} className="font-host font-bold text-[#801b01] text-sm border border-[#801b01] rounded-[12px] px-[20px] py-[8px] hover:bg-[#801b01] hover:text-white transition-colors duration-200">
                            العربية
                          </button>
                        )}
                        {currentLocale === "ar" && (
                          <button onClick={() => switchLanguage("en")} className="font-host font-bold text-[#801b01] text-sm border border-[#801b01] rounded-[12px] px-[20px] py-[8px] hover:bg-[#801b01] hover:text-white transition-colors duration-200">
                            English
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="flex grow flex-col mt-[40px] 3xl:mt-[71px] w-full max-w-[660px]">
                      <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[80px] w-full">
                        <div className="flex flex-col gap-[12px] w-full lg:w-[282px]">
                          {services?.slice(0, 7).map((item, index) => (
                            <div
                              key={index}
                              style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: "translateY(0px)",
                                transition: `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`,
                              }}
                            >
                              <Link
                                className="font-host text-[20px] 3xl:text-[24px] capitalize font-normal text-[#211D1D] transition-colors hover:text-[#C00034] whitespace-nowrap"
                                href={`/${currentLocale}/services/${item.slug?.current?.replace(/^ar\//, "")}`}
                              >
                                {item.title}
                              </Link>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-[12px] w-full lg:w-[214px]">
                          {services?.slice(7, services?.length - 1).map((item, index) => (
                            <div
                              key={index}
                              style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: "translateY(0px)",
                                transition: `opacity 0.3s ease ${(index + 8) * 0.05}s, transform 0.3s ease ${(index + 8) * 0.05}s`,
                              }}
                            >
                              <Link
                                className="font-host text-[20px] 3xl:text-[24px] capitalize font-normal text-[#211D1D] transition-colors hover:text-[#C00034] whitespace-nowrap"
                                href={`/${currentLocale}/services/${item.slug?.current?.replace(/^ar\//, "")}`}
                              >
                                {item.title}
                              </Link>
                            </div>
                          ))}

                          <div
                            className="md:hidden mt-4"
                            style={{
                              opacity: isMenuOpen ? 1 : 0,
                              transform: "translateY(24px)",
                              transition: "opacity 0.3s ease 0.5s, transform 0.3s ease 0.5s",
                            }}
                          >
                            <Link
                              className="font-host text-[20px] lg:text-[24px] capitalize font-bold text-[#C00034] transition-colors"
                              href={`/${currentLocale}/services`}
                            >
                              View All Services
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#393d45] h-px opacity-20 w-full my-[24px] shrink-0" />

                      <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[80px] w-full">
                        <div className="flex flex-col gap-[12px] w-full lg:w-[214px]">
                          {(fragment?.header?.headerLink?.links as any)?.slice(0, 2).map((item: any, index: number) => (
                            <div
                              key={index}
                              style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: "translateY(0px)",
                                transition: `opacity 0.3s ease 0.4s, transform 0.3s ease 0.4s`,
                              }}
                            >
                              <Link
                                className={`font-host text-[20px] 3xl:text-[24px] capitalize ${index === 1 ? 'font-bold' : 'font-normal'} text-[#211D1D] transition-colors hover:text-[#C00034]`}
                                href={`/${currentLocale}/${item?.link?.page?.slug || 'about-us'}`}
                              >
                                {item?.linkText}
                              </Link>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-[12px] w-full lg:w-[214px]">
                          {(fragment?.header?.headerLink?.links as any)?.slice(2, 3).map((item: any, index: number) => (
                            <div
                              key={index}
                              style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: "translateY(0px)",
                                transition: `opacity 0.3s ease 0.5s, transform 0.3s ease 0.5s`,
                              }}
                            >
                              <Link
                                className="font-host text-[20px] 3xl:text-[24px] capitalize font-normal text-[#211D1D] transition-colors hover:text-[#C00034]"
                                href={`/${currentLocale}/${item?.link?.page?.slug || 'about-us'}`}
                              >
                                {item?.linkText}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex flex-col lg:flex-row gap-[40px] 3xl:gap-[149px] w-full mt-[0px] 3xl:mt-[137px] pt-[40px] lg:pt-0 pb-[20px]">

                      {/* Address & Hours */}
                      <div
                        className="flex flex-col gap-[24px] w-full lg:w-[320px] shrink-0"
                        style={{
                          opacity: isMenuOpen ? 1 : 0,
                          transform: "translateY(24px)",
                          transition: "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
                        }}
                      >
                        <div className="flex flex-col text-[#211d1d] leading-[1.5]">
                          <p className="font-host font-bold text-[22px]">
                            {siteSettingData?.fragmentItem?.pitstopContact}
                          </p>
                          <p className="font-host font-normal text-[14px]">
                            {siteSettingData?.fragmentItem?.pitstopEmail}
                          </p>
                        </div>
                        <p className="font-host font-normal text-[14px] text-[#393d45] leading-[1.5]">
                          {String(siteSettingData?.fragmentItem?.addressLine1 || "")}
                          <br />
                          {String(siteSettingData?.fragmentItem?.addressLine2 || "")}
                        </p>

                        <div className="flex flex-col gap-[4px] w-full">
                          <p className="font-host font-normal text-[28px] text-[#211d1d] leading-[1.5]">
                            {siteSettingData?.fragmentItem?.openTime}—{siteSettingData?.fragmentItem?.closeTime}
                          </p>
                          <div className="flex gap-[8px] items-center w-full max-w-[200px]">
                            <p className="font-host font-medium text-[12px] text-[#393d45]">
                              {String(siteSettingData?.fragmentItem?.OpenDay || "Mo")}
                            </p>
                            <div className="bg-[#393d45] flex-[1_0_0] h-px opacity-20" />
                            <p className="font-host font-medium text-[12px] text-[#393d45]">
                              {String(siteSettingData?.fragmentItem?.endDay || "Fr")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Socials & Legal */}
                      <div
                        className="flex flex-col gap-[16px] lg:items-end w-full lg:w-auto mt-6 lg:mt-0"
                        style={{
                          opacity: isMenuOpen ? 1 : 0,
                          transform: "translateY(24px)",
                          transition: "opacity 0.4s ease 0.4s, transform 0.4s ease 0.4s",
                        }}
                      >
                        <p className="font-host font-medium text-[12px] text-[#393d45] leading-[1.5]">
                          {String(siteSettingData?.fragmentItem?.followUs || 'Follow us')}
                        </p>

                        <div className="flex flex-wrap items-center gap-[8px] font-host font-normal text-[16px]">
                          {[
                            { key: "instagram", link: siteSettingData?.fragmentItem?.instagramLink, title: siteSettingData?.fragmentItem?.instagramTitle || 'Instagram' },
                            { key: "facebook", link: siteSettingData?.fragmentItem?.facebookLink, title: siteSettingData?.fragmentItem?.facebookTitle || 'Facebook' },
                            { key: "twitter", link: siteSettingData?.fragmentItem?.twitterLink, title: siteSettingData?.fragmentItem?.twitterTitle || 'Twitter' },
                            { key: "youtube", link: siteSettingData?.fragmentItem?.youtubeLink, title: siteSettingData?.fragmentItem?.youtubeTitle || 'YouTube' },
                          ].map(({ key, link, title }, index, arr) =>
                            link ? (
                              <div key={key} className="flex items-center gap-[8px]">
                                <Link
                                  href={link}
                                  target="_blank"
                                  className="text-[#211d1d] hover:text-[#C00034] transition-colors"
                                >
                                  {String(title)}
                                </Link>
                                {index < arr.length - 1 && (
                                  <span className="text-[#393d45] opacity-20">/</span>
                                )}
                              </div>
                            ) : null
                          )}
                        </div>

                        <div className="flex flex-wrap lg:justify-end gap-[24px] font-host font-medium text-[12px] text-[#393d45]">
                          {[
                            { name: "Terms of service", href: `/${currentLocale}/terms-and-conditions` },
                            { name: "Privacy", href: `/${currentLocale}/privacy-policy` },
                            { name: "Cookie policy", href: `/${currentLocale}/cookie-policy` },
                          ].map((link, index) => (
                            <Link
                              key={index}
                              href={link.href}
                              className="hover:text-[#211d1d] transition-colors"
                            >
                              {link.name}
                            </Link>
                          ))}
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
                  <p className="font-host dark:text-[#FAEADC] text-black text-sm lg:text-[18px] opacity-50 font-semibold">
                    {fragment?.header?.callUs}
                  </p>
                  <p className="font-host font-extrabold dark:text-[#FAEADC] text-black text-eyebrow-lg leading-none lg:text-[32px]">
                    {fragment?.header?.contact}
                  </p>
                </div>
                <div className="langbtn">
                  {currentLocale === "en" && (
                    <button onClick={() => switchLanguage("ar")} className="font-cairo font-bold dark:text-[#FAEADC] text-black text-sm lg:text-[15px] border dark:border-[#FAEADC] border-black rounded-[10px] px-[26px] py-[13px] transition-colors duration-200 ease-in-out">
                      العربية
                    </button>
                  )}
                  {currentLocale === "ar" && (
                    <button onClick={() => switchLanguage("en")} className="font-host font-bold dark:text-[#FAEADC] text-black text-sm lg:text-[15px] border dark:border-[#FAEADC] border-black rounded-[10px] px-[26px] py-[13px] transition-colors duration-200 ease-in-out">
                      English
                    </button>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-start-2 flex items-center justify-center">
          <Link href={`/${currentLocale}`}>
            {fragment?.header?.headerLogo?.altText && (
              <ImageComp
                block={fragment?.header?.headerLogo}
                imageClassName="logoHome"
                width={318}
                height={41}
              />
            )}
            <Image
              src="/images/logo-new.svg"
              alt="logo dark icon"
              width={318}
              height={41}
              className="logoInner"
            />
          </Link>
        </div>
      </div>
      <div className="lg:absolute fixed bottom-0 topBtnFixed z-50 w-full ltr:md:max-w-[227px] rtl:md:max-w-[240px] h-[51px] 3xl:h-[74px] max-w-[190px] lg:bottom-auto 3xl:top-[40px] lg:top-[47px] ltr:right-0 rtl:left-0">
        <Link href={`/${currentLocale}/contact-us`} className="w-full md:h-auto h-[51px] 3xl:h-[74px]">
          <div className="flex">
            <svg className="3xl:mr-[-1px] mr-[-10px] shrink h-[51px] 3xl:h-[74px] rtl:scale-x-[-1] rtl:transform text-[#801B01]" width="58" height="74" viewBox="0 0 58 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.5801 0.78495L8.52956 73.215H1.00891L20.2432 0.78495H28.5801ZM29.6001 0H19.6513L9.72748e-05 74H9.11497L29.6001 0Z" fill="#801B01" />
              <path d="M42.2 0L21.7172 74H12.6L32.2522 0H42.2Z" fill="#801B01" />
              <path d="M54.8 0L34.3173 74H25.2L44.8523 0H54.8Z" fill="#801B01" />
              <path d="M57.0776 74L57.0776 0L37.8 74H57.0776Z" fill="#FF3300" />
            </svg>


            <p className="flex grow md:h-auto h-[55px] items-center text-white font-extrabold justify-center whitespace-nowrap text-[20px] uppercase leading-none tracking-wide lg:text-[22px] bg-[#FF3300]">
              {fragment?.header?.cornerLogo}
            </p>

          </div>
        </Link>
      </div>
      <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettingData} />
    </>
  );
}
