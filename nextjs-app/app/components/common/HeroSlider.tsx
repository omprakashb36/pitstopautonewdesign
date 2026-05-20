"use client"

import { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import { Squircle } from "corner-smoothing"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { HomeHeroSlider, SettingsQueryResult } from "@/sanity.types"
import { useDispatch } from "react-redux"
import { clearBookingData, clearLeadId, clearAppointmentData, clearCartItemData } from "../../lib/redux/slices/carSlice"
import { getSiteSettingData } from "@/app/actions/common/sanityData"
import { useTheme } from "next-themes";

import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { getMakeModelList } from "@/app/actions/appointment/makeModelList"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles"



// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import Link from "next/link"
import ImageComp from "../CustomImage"
import CarSelectorModal from "./CarSelectorModal"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"



type HeroSliderProps = {
  block: HomeHeroSlider;
  index: number;
}

const carValidationSchema = Yup.object({
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
})

export default function HeroSlider({ block }: HeroSliderProps) {
  const [mounted, setMounted] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isMobileDevice, currentLocale } = useDeviceDetection()
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SettingsQueryResult>();
  const { theme } = useTheme();

  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [models, setModels] = useState<Record<string, { value: string; label: string }[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  const carFormik = useFormik({
    initialValues: {
      brand: "",
      model: "",
    },
    validationSchema: carValidationSchema,
    onSubmit: async (values) => {
      setIsModalOpen(true)
    },
  })

  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsLoading(true)
      try {
        const [data, commonData] = await Promise.all([
          getMakeModelList(),
          getSiteSettingData({ locale: "en" }),
        ])
        setSiteSettings(commonData)

        if (data.status && data?.data?.message) {
          // Brands to exclude (case-insensitive)
          const excludedBrands = ["articulated", "ford usa"]

          const uniqueBrands: string[] = [
            ...new Set((data.data.message as { brand: string }[]).map((item) => item.brand)),
          ]

          const brandOptions = uniqueBrands
            .filter(
              (brand) =>
                Boolean(brand) &&
                !excludedBrands.includes(brand.toLowerCase()) // only compare in lowercase
            )
            .sort()
            .map((brand) => {
              const match = commonData?.brands?.find(
                (b: any) => b.brandValue?.toLowerCase() === brand.toLowerCase()
              )

              return {
                value: brand, // keep as-is
                label: brand, // keep as-is
                image: match?.carImage || null,
              }
            })

          setBrands(brandOptions)

          const modelsByBrand: Record<string, { value: string; label: string }[]> = {}

          uniqueBrands.forEach((brand: string) => {
            if (!brand || excludedBrands.includes(brand.toLowerCase())) return

            const brandModels = data.data.message
              .filter((item: any) => item.brand === brand)
              .map((item: any) => ({
                value: item.item_name,
                label: item.item_name,
              }))

            modelsByBrand[brand] = brandModels
          })

          setModels(modelsByBrand)
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicleData()
  }, [])


  useEffect(() => {
    dispatch(clearBookingData())
    dispatch(clearLeadId())
    dispatch(clearAppointmentData())
    dispatch(clearCartItemData())
  }, [dispatch])

  useEffect(() => {
    setMounted(true)

    // Set up video ended event listener
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd)

      // Optional: For testing purposes, you can force the video to end after a certain time
      // const timer = setTimeout(() => setVideoEnded(true), 5000);

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd)
        // clearTimeout(timer);
      }
    }
  }, [])


  const handleVideoEnd = () => {
    setVideoEnded(true)
  }
  const handleScrollToSection = () => {
    const element = document.getElementById('carListHome');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const CarSelectorForm = () => {
    const availableModels =
      carFormik.values.brand && models[carFormik.values.brand] ? models[carFormik.values.brand] : []

    const customSelectStyles = {
      ...selectStyles,
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        minHeight: "auto",
        padding: 0,
        "&:hover": {
          border: "none",
        },
        cursor: "pointer",
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        padding: 0,
      }),
      input: (provided: any) => ({
        ...provided,
        margin: 0,
        padding: 0,
        color: "white",
        fontFamily: "'Host Grotesk', sans-serif",
        fontSize: "20px",
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "white",
        fontFamily: "'Host Grotesk', sans-serif",
        fontSize: "20px",
        margin: 0,
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: "rgba(255, 255, 255, 0.6)",
        fontFamily: "'Host Grotesk', sans-serif",
        fontSize: "20px",
        margin: 0,
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (provided: any) => ({
        ...provided,
        color: "white",
        padding: 0,
        "&:hover": {
          color: "white",
        },
      }),
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: "200px",
        overflowY: "auto",
        backgroundColor: "#1a1a1a",
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#FF3300" : "transparent",
        color: "white",
        fontFamily: "'Host Grotesk', sans-serif",
        "&:active": {
          backgroundColor: "#FF3300",
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(217,217,217,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }),
    }

    const CustomMenuList = (props: any) => {
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation()
        const target = e.currentTarget as HTMLElement
        const { scrollTop, scrollHeight, clientHeight } = target

        if ((e.deltaY < 0 && scrollTop > 0) || (e.deltaY > 0 && scrollTop < scrollHeight - clientHeight)) {
          e.preventDefault()
        }
      }

      return (
        <div
          {...props}
          onWheel={handleWheel}
          style={{
            ...props.style,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        />
      )
    }

    const components = {
      MenuList: CustomMenuList,
    }

    return (
      <div className="w-full">
        <form onSubmit={carFormik.handleSubmit} className="w-full">
          <div className="backdrop-blur-[30.5px] bg-[#FF3300]/[0.08] border border-[#ff3300] rounded-[40px] p-[20px] md:p-[20px] 3xl:p-[40px] flex flex-col md:flex-row items-center gap-[16px] w-full">

            <div className="flex-1 bg-white/[0.04] border border-[#d9d9d9]/10 rounded-[20px] px-[24px] 3xl:py-[20px] py-[15px] w-full flex flex-col justify-center 3xl:h-[88px] h-[78px]">
              <label htmlFor="brand" className="block font-host font-medium text-[12px] uppercase text-white mb-[2px]">
                {block?.brandName || "BRAND"}
              </label>
              <Select
                id="brand"
                name="brand"
                options={brands}
                value={brands.find((option) => option.value === carFormik.values.brand) || null}
                onChange={(option) => {
                  carFormik.setFieldValue("brand", option?.value || "")
                  carFormik.setFieldValue("model", "")
                }}
                onBlur={carFormik.handleBlur}
                placeholder={isLoading ? "Loading..." : block?.brandPlaceholder || "Select"}
                styles={customSelectStyles}
                components={components}
                isDisabled={isLoading}
                isSearchable={!isMobileDevice}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                captureMenuScroll={false}
                closeMenuOnScroll={(event) => {
                  return event.target === document
                }}
                onMenuOpen={() => {
                  if (isMobileDevice) {
                    document.body.style.overflow = "hidden"
                  }
                }}
                onMenuClose={() => {
                  if (isMobileDevice) {
                    document.body.style.overflow = "unset"
                  }
                }}
                formatOptionLabel={(option: any) => (
                  <div className="flex items-center gap-2">
                    {option.image?.image?.asset?._ref && (
                      <Image
                        src={option.image?.image ? urlForImage(option.image.image)?.width(24)?.height(24)?.url() ?? "" : ""}
                        alt={option.image.altText || option.label}
                        width={24}
                        height={24}
                        className="rounded-full grayscale brandImage object-contain"
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
              />
              {carFormik.errors.brand && carFormik.touched.brand && (
                <div className="mt-1 text-sm text-[#FF3300] font-host absolute -bottom-6">{carFormik.errors.brand}</div>
              )}
            </div>

            <div className="flex-1 bg-white/[0.04] border border-[#d9d9d9]/10 rounded-[20px] px-[24px] 3xl:py-[20px] py-[15px] w-full flex flex-col justify-center 3xl:h-[88px] h-[78px]">
              <label htmlFor="model" className="block font-host font-medium text-[12px] uppercase text-white mb-[2px]">
                {block?.brandModelName || "MODEL"}
              </label>
              <Select
                id="model"
                name="model"
                options={availableModels}
                value={availableModels.find((option) => option.value === carFormik.values.model) || null}
                onChange={(option) => {
                  carFormik.setFieldValue("model", option?.value || "")
                }}
                onBlur={carFormik.handleBlur}
                placeholder={isLoading ? "Loading..." : block?.brandModelPlaceholder || "Select"}
                styles={customSelectStyles}
                components={components}
                isDisabled={!carFormik.values.brand || isLoading}
                isSearchable={!isMobileDevice}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                captureMenuScroll={false}
                closeMenuOnScroll={(event) => {
                  return event.target === document
                }}
                onMenuOpen={() => {
                  if (isMobileDevice) {
                    document.body.style.overflow = "hidden"
                  }
                }}
                onMenuClose={() => {
                  if (isMobileDevice) {
                    document.body.style.overflow = "unset"
                  }
                }}
              />
              {carFormik.errors.model && carFormik.touched.model && (
                <div className="mt-1 text-sm text-[#FF3300] font-host absolute -bottom-6">{carFormik.errors.model}</div>
              )}
            </div>

            <div className="flex-1 w-full md:w-auto 3xl:h-[88px] h-[78px]">
              <button
                type="submit"
                className="w-full h-full bg-[#FF3300] rounded-[20px] text-[#FCF3ED] font-host font-extrabold text-[16px] uppercase hover:bg-opacity-90 transition-colors flex items-center justify-center px-[40px] py-[16px]"
              >
                {block?.SearchButtonText || "SEARCH"}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }


  if (!mounted) {
    return (
      <div className="min-h-[650px] md:min-h-screen flex items-center justify-center">

      </div>
    )
  }



  return (
    <div className="overflow-x-hidden md:min-h-screen min-h-[650px]">
      {theme === "dark" && (
        <div className="overflow-x-hidden">
          <div className="relative heroSlide w-full min-h-[600px] md:h-screen overflow-x-hidden rounded-3xl">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              slidesPerView={1}
              navigation={false}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active",
                bulletClass: "swiper-pagination-bullet",
                renderBullet: (index, className) =>
                  `<span class="${className} ${index === 1 ? "bg-rose-600" : ""}" style="width: 12px; height: 12px; margin: 0 6px;"></span>`,
              }}

              loop={true}
              className="md:h-full min-h-[680px]"
            >
              {block?.slides?.map((slide) => (
                <SwiperSlide key={slide._key} className="relative md:h-full min-h-[680px]">
                  <div className="absolute bgtrans z-10" />
                  <div className="relative inline-block w-full h-full heroSlideinner">



                    {slide?.desktopImage?.altText && !isMobileDevice && (
                      <ImageComp
                        block={slide?.desktopImage}
                        imageClassName="object-cover relative w-full h-full"
                        width={1920}
                        height={1080}
                      />
                    )}
                    {slide?.mobileImage?.altText && isMobileDevice && (
                      <ImageComp
                        block={slide?.mobileImage}
                        imageClassName="object-cover w-full md:h-full h-[680px]"
                        width={620}
                        height={624}
                      />
                    )}

                  </div>
                  <div className="absolute lg:bottom-[240px] 3xl:bottom-[310px] bottom-[150px] left-1/2 -translate-x-1/2 z-20 w-full">
                    <div className="container-grid">
                      <div className="3xl:px-[123px] 2xl:px-[80px]">
                        <div className="body-m font-host font-bold leading-[1.5] text-white">
                          {slide.heading}
                        </div>
                        <h2 className="font-host font-extrabold text-[#FF3300] leading-[1.1]">
                          {slide.subHeading}
                        </h2>
                      </div>
                    
                    {isMobileDevice && (
                      <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="mt-5 relative">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-block w-full px-6 py-3 bg-[#FF3300] text-[#FAEADC] font-medium hover:bg-[#FAEADC] transition-colors"
                        >
                          {slide.buttonText}
                        </button>
                      </Squircle>
                    )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      {theme === "light" && (
        <div className="relative bg-[#fff] heroSlide w-full min-h-[600px] md:h-screen overflow-x-hidden">
          <>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              slidesPerView={1}
              navigation={false}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active",
                bulletClass: "swiper-pagination-bullet",
                renderBullet: (index, className) =>
                  `<span class="${className} ${index === 1 ? "bg-rose-600" : ""}" style="width: 12px; height: 12px; margin: 0 6px;"></span>`,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="md:h-full min-h-[680px]"
            >
              {block?.slides
                ?.filter((slide) => slide?.desktopImageLight?.altText) // only keep slides with image
                .map((slide) => (

                  <SwiperSlide key={slide._key} className="relative md:h-full min-h-[680px]">
                    <div className="absolute bgtrans z-10" />
                    <div className="relative inline-block heroSlidelight w-full h-full">



                      {slide?.desktopImageLight?.altText && !isMobileDevice && (
                        <ImageComp
                          block={slide?.desktopImageLight}
                          imageClassName="object-cover w-full h-full"
                          width={1920}
                          height={1080}
                        />
                      )}
                      {slide?.mobileImage?.altText && isMobileDevice && (
                        <ImageComp
                          block={slide?.mobileImage}
                          imageClassName="object-cover w-full md:h-full h-[680px]"
                          width={620}
                          height={624}
                        />
                      )}

                    </div>
                    <div className="absolute lg:bottom-[240px] 3xl:bottom-[310px] bottom-[150px] left-1/2 -translate-x-1/2 z-20 w-full">
                      <div className="container-grid">
                        <div className="3xl:px-[123px] 2xl:px-[80px]">
                          <div className="body-m font-host font-bold leading-[1.5] text-white">
                            {slide.heading}
                          </div>
                          <h2 className="font-host font-extrabold text-[#FF3300] leading-[1.1]">
                            {slide.subHeading}
                          </h2>
                        </div>
                      
                      {isMobileDevice && (
                        <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="mt-5 relative">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block w-full px-6 py-3 bg-[#FF3300] text-[#FAEADC] font-medium hover:bg-[#FAEADC] transition-colors"
                          >
                            {slide.buttonText}
                          </button>
                        </Squircle>
                      )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </>
        </div>
      )}
      <button
        className="absolute mhidden bottom-[95px] z-10 cursor-pointer xl:ltr:right-[66px] xl:rtl:left-[66px] ltr:right-[25px] rtl:left-[25px]"
        onClick={handleScrollToSection}
      >
        <Image
          width={50}
          height={150}
          alt="scroll down image"
          src={theme === "light" ? "/images/scrollDown.svg" : "/images/scrollDown.svg"}
        />
      </button>
      <div
        className="absolute carSelectorForm 3xl:bottom-[124px] lg:bottom-[100px] md:bottom-[90px] bottom-[50px] left-1/2 -translate-x-1/2 z-20 w-full"
      >
        <div className="container-grid">
          <div className="3xl:px-[123px] 2xl:px-[80px]">
            <CarSelectorForm />
          </div>
        </div>
      </div>
      {siteSettings && (
        <CarSelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          siteSettingData={siteSettings}
          initialData={{
            brand: carFormik.values.brand,
            model: carFormik.values.model,
            plateNumber: "",
          }}
        />
      )}
    </div>
  )
}
