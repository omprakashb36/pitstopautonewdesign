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
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: "200px",
        overflowY: "auto",
      }),
      menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
      }),
    }

    const CustomMenuList = (props: any) => {
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation()
        const target = e.currentTarget as HTMLElement
        const { scrollTop, scrollHeight, clientHeight } = target

        // Only prevent default if we're not at the boundaries
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
      <div className="homeForm">
        <form onSubmit={carFormik.handleSubmit}>
          <div className="flex gap-5">
            <div className="formLabel min-w-[35%] selectReact border border-black/15 dark:border-white/20 rounded-[15px] space-y-2">
              <label htmlFor="brand" className="block font-urbanist sandDrift text-xs uppercase text-gray-700">
                {block?.brandName || "Brand"}
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
                placeholder={isLoading ? "Loading brands..." : block?.brandPlaceholder || "Select Brand"}
                styles={customSelectStyles}
                classNames={selectClassNames}
                components={components}
                isDisabled={isLoading}
                isSearchable={!isMobileDevice}
                className="font-urbanist"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                captureMenuScroll={false}
                closeMenuOnScroll={(event) => {
                  return event.target === document
                }}
                onMenuOpen={() => {
                  // Prevent body scroll when menu is open on mobile
                  if (isMobileDevice) {
                    document.body.style.overflow = "hidden"
                  }
                }}
                onMenuClose={() => {
                  // Restore body scroll when menu closes
                  if (isMobileDevice) {
                    document.body.style.overflow = "unset"
                  }
                }}
                formatOptionLabel={(option: any) => (
                  <div className="flex items-center gap-2">
                    {option.image?.image?.asset?._ref && (
                      <Image
                        src={option.image?.image ? urlForImage(option.image.image)?.width(24)?.height(24)?.url() ?? "" : ""} // Sanity image helper
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
                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.brand}</div>
              )}
            </div>

            <div className="formLabel min-w-[35%] selectReact border border-black/15 dark:border-white/20 rounded-[15px] space-y-2">
              <label htmlFor="model" className="block sandDrift font-urbanist text-xs uppercase text-gray-700">
                {block?.brandModelName || "Model"}
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
                placeholder={isLoading ? "Loading models..." : block?.brandModelPlaceholder || "Select Model"}
                styles={customSelectStyles}
                classNames={selectClassNames}
                components={components}
                isDisabled={!carFormik.values.brand || isLoading}
                isSearchable={!isMobileDevice}
                className="font-urbanist"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                captureMenuScroll={false}
                closeMenuOnScroll={(event) => {
                  return event.target === document
                }}
                onMenuOpen={() => {
                  // Prevent body scroll when menu is open on mobile
                  if (isMobileDevice) {
                    document.body.style.overflow = "hidden"
                  }
                }}
                onMenuClose={() => {
                  // Restore body scroll when menu closes
                  if (isMobileDevice) {
                    document.body.style.overflow = "unset"
                  }
                }}
              />
              {carFormik.errors.model && carFormik.touched.model && (
                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.model}</div>
              )}
            </div>

            <div className="min-w-[200px]">
              <Squircle cornerRadius={12} className="relative">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#C00034] h-[68.6px] text-[#FAEADC] font-urbanist font-medium hover:bg-[#C00034] hover:text-[#fff] transition-colors"
                >
                  {block?.SearchButtonText || "Search"}
                </button>
              </Squircle>
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
                  <div className="absolute inset-0 bgtrans z-10" />
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
                  <div className="absolute md:bottom-[150px] bottom-[50px] ltr:xl:left-[116px] rtl:xl:right-[116px] ltr:md:left-[20px] rtl:md:right-[20px] z-[160] md:max-w-[650px] w-full md:px-0 px-5">
                    {!isMobileDevice && (
                      <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="relative inline-block">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-block px-6 py-3 gradientBG text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
                        >
                          {slide.buttonText}
                        </button>
                      </Squircle>
                    )}
                    <h2 className="md:text-[40px] md:mt-6 text-[30px] uppercase font-shoulders font-normal leading-[1] text-[#FAEADC] tracking-tight">
                      {slide.heading}
                    </h2>
                    <h3 className="md:text-[55px] text-[40px] uppercase text-[#C00034] leading-[1] font-shoulders font-bold tracking-tight">
                      {slide.subHeading}
                    </h3>
                    {isMobileDevice && (
                      <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="mt-5 relative">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-block w-full px-6 py-3 gradientBG text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
                        >
                          {slide.buttonText}
                        </button>
                      </Squircle>
                    )}
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
                    <div className="absolute inset-0 bgtrans z-10" />
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
                    <div className="absolute md:bottom-[185px] bottom-[50px] ltr:xl:left-[116px] rtl:xl:right-[116px] ltr:md:left-[20px] rtl:md:right-[20px] z-20 md:max-w-[700px] w-full md:px-0 px-5">
                      <h2 className="md:text-[24px] md:mt-6 text-[20px] uppercase font-urbanist font-bold leading-[1] text-[#000000] tracking-tight">
                        {slide.heading}
                      </h2>
                      <h3 className="md:text-[40px] text-[30px] uppercase text-[#C00034] leading-[1] font-urbanist font-black tracking-tight">
                        {slide.subHeading}
                      </h3>
                      {isMobileDevice && (
                        <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="mt-5 relative">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block w-full px-6 py-3 gradientBG text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
                          >
                            {slide.buttonText}
                          </button>
                        </Squircle>
                      )}
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
          src={theme === "light" ? "/images/scrollDownLight.svg" : "/images/scrollDown.svg"}
        />
      </button>
      <div
        className="absolute carSelectorForm dark:md:bottom-[60px] md:bottom-[90px] bottom-[50px] ltr:xl:left-[116px] rtl:xl:right-[116px] ltr:md:left-[20px] rtl:md:right-[20px] z-20 md:w-[calc(100%-40px)] 
  xl:w-[calc(100%-116px)] w-full md:px-0 px-5"
      >
        <CarSelectorForm />
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
