"use client"

import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { X, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { Squircle } from "corner-smoothing"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"

import { setAppointmentData } from "../../lib/redux/slices/carSlice"
import { useDispatch } from "react-redux"
import { getMakeModelList } from '@/app/actions/appointment/makeModelList'
import { getServiceList } from "@/app/actions/common/sanityData"
import ImageComp from "../CustomImage"
import { Service, SettingsQueryResult } from "@/sanity.types"
import Link from "next/link"
import { fetchLead } from "@/app/actions/appointment/fetchLead"
import { setLeadId } from "../../lib/redux/slices/carSlice"
import { urlForImage } from "@/sanity/lib/utils"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
import { useTheme } from "next-themes";
import { getSiteSettingData } from "@/app/actions/common/sanityData";
import { Button } from "../ui/Button";


interface CarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  siteSettingData: SettingsQueryResult;
}

interface CarSelectorData {
  brand: string
  model: string
  year: string
  plateNumber: string
  personalDetails?: PersonalDetailsData
}
interface CarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  siteSettingData: SettingsQueryResult
  initialData?: {
    brand?: string
    model?: string
    plateNumber?: string
  }
}

interface PersonalDetailsData {
  fullName: string
  countryCode: string
  phoneNumber: string
  email: string
}

const yearOptions = Array.from({ length: 25 }, (_, i) => {
  const year = 2025 - i
  return { value: year.toString(), label: year.toString() }
})

const countryCodes = [
  { value: "+971", label: "+971" },
]

// Validation schema for car selection
const carValidationSchema = Yup.object({
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.string().required("Year is required"),
  plateNumber: Yup.string()
    /*.matches(/^[A-Za-z]{3}-[A-Za-z]{2}-\d{5}$/, 'Invalid vehicle plate format (e.g., DXB-BB-28705)')*/
    .required("Vehicle plate is required"),
})

// Validation schema for personal details
const personalDetailsValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{9}$/, "Phone number must be 9 digits"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
})

// Helper function to split service title for modern design styling
const splitServiceTitle = (title: string) => {
  if (title.includes("&")) {
    const idx = title.indexOf("&")
    return [title.substring(0, idx + 1).trim(), title.substring(idx + 1).trim()]
  }
  // Try splitting by space
  const words = title.split(" ")
  if (words.length > 1) {
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
  }
  return [title, ""]
}

export default function CarSelectorModal({ isOpen, onClose, siteSettingData, initialData }: CarSelectorModalProps) {
  const [step, setStep] = useState<"car" | "personal" | "services">("car")
  const [carData, setCarData] = useState<CarSelectorData | null>(null)
  const [personalData, setPersonalData] = useState<PersonalDetailsData | null>(null)
  const [activeService, setActiveService] = useState<string | null>(null)
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [models, setModels] = useState<Record<string, { value: string; label: string }[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { currentLocale, isMobileDevice } = useDeviceDetection()
  const dispatch = useDispatch()
  const isHydrated = usePersistHydration()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [serviceData, setServiceData] = useState<Service[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { theme } = useTheme();


  const pathname = usePathname();
  const pathSegments = pathname.split("/");


  // Add this useEffect to fetch the data when the component mounts
  useEffect(() => {
  const fetchVehicleData = async () => {
    setIsLoading(true)
    try {
      const [data, siteSettingData] = await Promise.all([
        getMakeModelList(),
        getSiteSettingData({ locale: "en" }),
      ])

      if (data.status && data?.data?.message) {
        // Brands to exclude (case-insensitive)
        const excludedBrands = ["articulated", "ford usa"]

        // Process brands
        const uniqueBrands: string[] = [
          ...new Set((data.data.message as { brand: string }[]).map((item) => item.brand)),
        ]

        const brandOptions = uniqueBrands
          .filter(
            (brand) =>
              Boolean(brand) &&
              !excludedBrands.includes(brand.toLowerCase()) // only check lowercased
          )
          .sort()
          .map((brand) => {
            const match = siteSettingData?.brands?.find(
              (b: any) => b.brandValue?.toLowerCase() === brand.toLowerCase()
            )

            return {
              value: brand, // ✅ keep as-is
              label: brand, // ✅ keep as-is
              image: match?.carImage || null, // attach Sanity image if found
            }
          })

        setBrands(brandOptions)

        // Process models by brand
        const modelsByBrand: Record<string, { value: string; label: string }[]> = {}

        uniqueBrands.forEach((brand: string) => {
          if (!brand || excludedBrands.includes(brand.toLowerCase())) return 

          const brandModels = data.data.message
            .filter((item: any) => item.brand === brand)
            .map((item: any) => ({
              value: item.name, 
              label: item.name, 
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
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data: Service[] = await getServiceList({ locale: currentLocale })
        setServiceData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [currentLocale])

  // Select the first service by default when serviceData loads
  useEffect(() => {
    if (serviceData.length > 0 && !activeService) {
      setActiveService(serviceData[0]._id)
    }
  }, [serviceData, activeService])

  useEffect(() => {
    if (initialData && isOpen) {
      carFormik.setValues({
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: carFormik.values.year, // Keep existing year value
        plateNumber: initialData.plateNumber || "",
      })
    }
  }, [initialData, isOpen])

  useEffect(() => {
    if (isOpen) {
      // Reset step when modal opens
      setStep("car")
      setCarData(null)
      setPersonalData(null)

      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = "auto"
    }

    return () => {
      // Cleanup function to re-enable scrolling when component unmounts
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleBack = () => {
    if (step === "personal") {
      setStep("car")
    } else if (step === "services") {
      setStep("personal")
    }
  }

  // Car selection form
  const carFormik = useFormik({
    initialValues: {
      brand: carData?.brand || "",
      model: carData?.model || "",
      year: carData?.year || "",
      plateNumber: carData?.plateNumber || "",
    },
    validationSchema: carValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Store car data and move to next step
      setCarData(values)
      setStep("personal")
    },
  })

  // Personal details form
  const personalFormik = useFormik({
    initialValues: {
      fullName: personalData?.fullName || "",
      countryCode: personalData?.countryCode || "+971",
      phoneNumber: personalData?.phoneNumber || "",
      email: personalData?.email || "",
    },
    validationSchema: personalDetailsValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Store personal data and move to services step
      setSubmitting(true)
      setPersonalData(values)
      /*console.log("Personal details:", values)*/
      const combinedData = {
        ...carData,
        personalDetails: values,
        selectedService: pathSegments[3], // Provide a default or actual value for selectedService
      }
      if (values?.fullName) {
        dispatch(setAppointmentData({
          personalDetails: {
            fullName: values?.fullName || '',
            countryCode: '+971',
            phoneNumber: values?.phoneNumber || '',
            email:values?.email || '',
          },
          brand: combinedData.brand || "",
          model: combinedData.model || "",
          year: combinedData.year || "",
          plateNumber: combinedData.plateNumber || "",
          selectedService: pathSegments[3],
        }))
        if (pathname.includes('services')) {
          window.location.href = `/${currentLocale}/services/${pathSegments[3]}`
        }
        else {
          setStep("services")
        }
      }
      else {
        dispatch(setAppointmentData({
          personalDetails: {
            fullName: values?.fullName || '',
            countryCode: '+971',
            phoneNumber: values?.phoneNumber || '',
            email: values?.email || '',
          },
          brand: combinedData.brand || "",
          model: combinedData.model || "",
          year: combinedData.year || "",
          plateNumber: combinedData.plateNumber || "",
          selectedService: pathSegments[3],
        }))
        if (pathname.includes('services')) {
          window.location.href = `/${currentLocale}/services/${pathSegments[3]}`
        }
        else {
          setStep("services")
        }
      }
      setSubmitting(false)
    }
  })



  const handleServiceSelection = (service: Service) => {
    if (carData && personalData) {
      window.location.href = `/${currentLocale}/services/${service.slug?.current?.replace(/^ar\//, "")}`
    }
  }

  useEffect(() => {
    if (carData) {
      carFormik.setValues({
        brand: carData.brand || "",
        model: carData.model || "",
        year: carData.year || "",
        plateNumber: carData.plateNumber || "",
      })
    }
  }, [carData])

  useEffect(() => {
    if (personalData) {
      personalFormik.setValues({
        fullName: personalData.fullName || "",
        countryCode: personalData.countryCode || "+971",
        phoneNumber: personalData.phoneNumber || "",
        email: personalData.email || "",
      })
    }
  }, [personalData])

  // Replace the availableModels calculation with:
  const availableModels = carFormik.values.brand && models[carFormik.values.brand] ? models[carFormik.values.brand] : []

  useEffect(() => {
    /*console.log("Current step:", step)*/
  }, [step])

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

  if (!isOpen) return null
  if (!isHydrated) {
    return <div></div>
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center rounded-[35px] justify-center backdropBlur-40 overflow-y-auto"
    >
      <div className={`relative max-w-[1200px] 3xl:max-w-[1360px] rounded-3xl  2xl:rounded-[60px] carModalPopup max-h-[90vh] min-h-[500px] overflow-y-auto custom-scrollbar w-full dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 md:p-[60px] 3xl:p-[80px] my-4 mx-4 transition-all duration-300`}>
        <button
          onClick={onClose}
          className={`absolute z-10 text-white hover:text-gray-300 transition-colors
            ${step === "services"
              ? "ltr:right-8 rtl:left-8 top-8 md:ltr:right-[80px] md:rtl:left-[80px] md:top-[80px]"
              : "ltr:2xl:right-[66px] rtl:2xl:left-[66px] ltr:right-8 rtl:left-8 2xl:top-[86px] top-8"
            }`}
          aria-label="Close"
        >
          <Image
            src={theme === "light" ? "/images/lightThemeClose.svg" : "/images/formCloseIcon.svg"}
            alt="Form close icon"
            width={20}
            height={20}
            className="mb-0"
          />
        </button>
        {step === "car" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-6 max-w-[490px]">
              <h2 className="font-host font-extrabold mb-4">
                <span className="dark:text-white text-black">{String(siteSettingData?.serviceBookForm?.stepOne?.whiteHeading) || ''}</span>{" "}
                <span className="text-[#FF3300]">{String(siteSettingData?.serviceBookForm?.stepOne?.redHeading) || ''}</span>
              </h2>

              <form autoComplete="off" onSubmit={carFormik.handleSubmit} className="space-y-6">
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                  carFormik.errors.brand && carFormik.touched.brand
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="brand" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepOne?.brandLabel) || ''}
                  </label>
                  <Select
                    id="brand"
                    name="brand"
                    options={brands}
                    value={brands.find((option) => option.value === carFormik.values.brand) || null}
                    onChange={(option) => {
                      carFormik.setFieldValue("brand", option?.value || "")
                      carFormik.setFieldValue("model", "") // Reset model when brand changes
                    }}
                    onBlur={carFormik.handleBlur}
                    placeholder={String(
                      isLoading
                        ? "Loading brands..."
                        : siteSettingData?.serviceBookForm?.stepOne?.brandPlaceholder || ""
                    )}
                    isDisabled={isLoading}
                    styles={customSelectStyles}
                    classNames={selectClassNames}
                    components={components}
                    isSearchable={!isMobileDevice}
                    className="font-host text-[16px] md:text-[20px]"
                    formatOptionLabel={(option: any) => (
                      <div className="flex items-center gap-2">
                        {option.image?.image?.asset?._ref && (
                          <Image
                            src={option.image?.image ? urlForImage(option.image.image)?.width(28)?.height(28)?.url() ?? "" : ""} // Sanity image helper
                            alt={option.image.altText || option.label}
                            width={28}
                            height={28}
                            className="rounded-full grayscale brandImage object-contain"
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    )}
                  />

                  {carFormik.errors.brand && carFormik.touched.brand && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{carFormik.errors.brand}</div>
                  )}
                </div>

                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                  carFormik.errors.model && carFormik.touched.model
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="model" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepOne?.modelLabel) || ''}
                  </label>
                  <Select
                    id="model"
                    name="model"
                    options={availableModels}
                    value={availableModels.find((option) => option.value === carFormik.values.model) || null}
                    onChange={(option) => carFormik.setFieldValue("model", option?.value || "")}
                    onBlur={carFormik.handleBlur}
                    placeholder={String(isLoading ? "Loading models..." : siteSettingData?.serviceBookForm?.stepOne?.modelPlaceholder || '')}
                    styles={customSelectStyles}
                    classNames={selectClassNames}
                    components={components}
                    isDisabled={!carFormik.values.brand || isLoading}
                    isSearchable={isMobileDevice ? false : true}
                    className="font-host text-[16px] md:text-[20px]"
                  />
                  {carFormik.errors.model && carFormik.touched.model && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{carFormik.errors.model}</div>
                  )}
                </div>

                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                  carFormik.errors.year && carFormik.touched.year
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="year" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepOne?.yearLabel) || ''}
                  </label>
                  <Select
                    id="year"
                    name="year"
                    options={yearOptions}
                    value={yearOptions.find((option) => option.value === carFormik.values.year) || null}
                    onChange={(option) => carFormik.setFieldValue("year", option?.value || "")}
                    onBlur={carFormik.handleBlur}
                    placeholder={String(isLoading ? "Loading Year..." : siteSettingData?.serviceBookForm?.stepOne?.yearPlaceholder || '')}
                    styles={customSelectStyles}
                    classNames={selectClassNames}
                    components={components}
                    isSearchable={isMobileDevice ? false : true}
                    className="font-host text-[16px] md:text-[20px]"
                  />
                  {carFormik.errors.year && carFormik.touched.year && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{carFormik.errors.year}</div>
                  )}
                </div>

                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  carFormik.errors.plateNumber && carFormik.touched.plateNumber
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="plateNumber" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepOne?.numberPlateLabel) || ''}
                  </label>
                  <input
                    id="plateNumber"
                    name="plateNumber"
                    type="text"
                    placeholder={String(siteSettingData?.serviceBookForm?.stepOne?.numberPlatePlaceholder) || ''}
                    value={carFormik.values.plateNumber}
                    onChange={carFormik.handleChange}
                    onBlur={carFormik.handleBlur}
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {carFormik.errors.plateNumber && carFormik.touched.plateNumber && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{carFormik.errors.plateNumber}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="orange"
                  className="w-fit mt-4"
                >
                  {String(siteSettingData?.serviceBookForm?.stepOne?.proceedBtn) || ''}
                </Button>
              </form>
            </div>

            <div className="hidden md:block">
              <div className="relative h-full w-full">
                <Image
                  src={urlForImage(siteSettingData?.serviceBookForm?.carImage?.image)?.url() || ''}
                  alt="Red sports car"
                  width={931}
                  height={269}
                  className="absolute top-1/2 translate-y-[-50%] rtl:scale-x-[-1] ltr:right-0 rtl:left-0 h-auto max-h-full w-[90%] max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {step === "personal" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center 2xl:mb-[36px] md:mb-2 mb-0">
                <button onClick={handleBack} className="ltr:mr-4 rtl:ml-4" aria-label="Back">
                  <Image
                    src={theme === "light" ? "/images/lightthemeArrow.svg" : "/images/backIcon.svg"}
                    alt="back icon"
                    width={17}
                    height={23}
                    className="mb-0"
                  />
                </button>
                <h2 className="font-host font-extrabold">
                  <span className="dark:text-white text-black">{String(siteSettingData?.serviceBookForm?.stepTwo?.whiteHeading)}</span>{" "}
                  <span className="text-[#FF3300]">{String(siteSettingData?.serviceBookForm?.stepTwo?.redHeading)}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={personalFormik.handleSubmit} className="space-y-6">
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  personalFormik.errors.fullName && personalFormik.touched.fullName
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="fullName" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepTwo?.nameLabel) || ''}
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={String(siteSettingData?.serviceBookForm?.stepTwo?.namePlaceholder) || ''}
                    value={personalFormik.values.fullName}
                    onChange={personalFormik.handleChange}
                    onBlur={personalFormik.handleBlur}
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {personalFormik.errors.fullName && personalFormik.touched.fullName && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{personalFormik.errors.fullName}</div>
                  )}
                </div>

                {/* Phone row with Country code integrated */}
                <div className={`border rounded-[20px] h-[90px] flex items-center w-full overflow-hidden transition-colors ${
                  (personalFormik.errors.phoneNumber && personalFormik.touched.phoneNumber) || (personalFormik.errors.countryCode && personalFormik.touched.countryCode)
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  {/* Country Code Selection */}
                  <div className="w-[124px] h-full flex flex-col justify-center px-[24px] pr-[15px] relative border-r border-[#D9D9D9] dark:border-white/20 selectReact no-border">
                    <label htmlFor="countryCode" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-white text-black">
                      {String(siteSettingData?.serviceBookForm?.stepTwo?.countryLabel) || 'COUNTRY'}
                    </label>
                    <Select
                      id="countryCode"
                      name="countryCode"
                      options={countryCodes}
                      value={countryCodes.find((option) => option.value === personalFormik.values.countryCode) || null}
                      onChange={(option) => personalFormik.setFieldValue("countryCode", option?.value || "")}
                      onBlur={personalFormik.handleBlur}
                      placeholder="Code"
                      styles={selectStyles}
                      classNames={selectClassNames}
                      className="font-host text-[16px] md:text-[20px]"
                    />
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1 h-full flex flex-col justify-center px-[24px] selectReact">
                    <label htmlFor="phoneNumber" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-white text-black">
                      {String(siteSettingData?.serviceBookForm?.stepTwo?.phoneLabel) || 'PHONE NUMBER'}
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder={String(siteSettingData?.serviceBookForm?.stepTwo?.phonePlaceholder) || ''}
                      value={personalFormik.values.phoneNumber}
                      onChange={personalFormik.handleChange}
                      onBlur={personalFormik.handleBlur}
                      className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                    />
                    {personalFormik.errors.phoneNumber && personalFormik.touched.phoneNumber && (
                      <div className="text-xs text-[#FF3300] font-host mt-0.5 leading-none">
                        {personalFormik.errors.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  personalFormik.errors.email && personalFormik.touched.email
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="email" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {String(siteSettingData?.serviceBookForm?.stepTwo?.emailLabel) || ''}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={String(siteSettingData?.serviceBookForm?.stepTwo?.emailPlaceholder) || ''}
                    value={personalFormik.values.email}
                    onChange={personalFormik.handleChange}
                    onBlur={personalFormik.handleBlur}
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {personalFormik.errors.email && personalFormik.touched.email && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{personalFormik.errors.email}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant={submitting ? "disabled" : "orange"}
                  disabled={submitting}
                  className="w-fit mt-4"
                >
                  <span className="flex items-center gap-2">
                    {String(siteSettingData?.serviceBookForm?.stepTwo?.proceedBtn) || ''}
                    {submitting && (
                      <Image
                        src="/images/infinite-spinner.svg"
                        alt="loader"
                        width={30}
                        height={15}
                        className="loaderImage inline-block"
                      />
                    )}
                  </span>
                </Button>
              </form>
            </div>

            <div className="hidden md:block">
              <div className="relative h-full w-full">
                <Image
                  src={urlForImage(siteSettingData?.serviceBookForm?.carImage?.image)?.url() || ''}
                  alt="Red sports car"
                  width={931}
                  height={269}
                  className="absolute top-1/2 translate-y-[-50%] ltr:right-0 rtl:left-0 rtl:scale-x-[-1] h-auto max-h-full w-[90%] max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {step === "services" && (
          <div className="flex flex-col step3Services w-full">
            <div className="flex items-center justify-between w-full mb-[40px]">
              <div className="flex items-center gap-[40px]">
                <button
                  onClick={handleBack}
                  className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="Back"
                >
                  <Image
                    src={theme === "light" ? "/images/lightthemeArrow.svg" : "/images/backIcon.svg"}
                    alt="back icon"
                    width={17}
                    height={23}
                    className="mb-0 rtl:scale-x-[-1]"
                  />
                </button>
                <h2 className="font-host font-extrabold">
                  <span className="dark:text-white text-[#211D1D]">Browse</span>{" "}
                  <span className="text-[#FF3300]">Services</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[24px] w-full">
              {serviceData?.map((service) => {
                const isActive = service._id === activeService
                const [line1, line2] = splitServiceTitle(service.title || "")

                return (
                  <div
                    key={service._id}
                    className={`relative rounded-[40px] p-[24px] flex flex-col justify-between items-start cursor-pointer transition-all duration-300 w-full aspect-square max-w-[180px] mx-auto border
                      ${isActive
                        ? "bg-[#FF3300]/[0.05] border-[#FF3300]"
                        : "bg-transparent border-[#898989] dark:border-white/20 hover:border-[#FF3300]/50"
                      }`}
                    onClick={() => setActiveService(service._id)}
                  >
                    <div className="w-[60px] h-[60px] relative">
                      {service?.serviceIcon?.altText && (
                        <ImageComp
                          block={service?.serviceIcon}
                          imageClassName="w-[60px] h-[60px] object-contain"
                          width={60}
                          height={60}
                        />
                      )}
                    </div>
                    <div className="[word-break:break-word] ltr:text-left flex flex-col font-host font-bold items-start leading-[1.5] text-[16px] w-full mt-auto">
                      <div className={isActive ? "text-[#FF3300]" : "text-[#393D45] dark:text-gray-300"}>
                        {line1}
                      </div>
                      {line2 && (
                        <div className={isActive ? "text-[#801B01]" : "text-[#393D45] dark:text-gray-300"}>
                          {line2}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex justify-start w-full">
              <Button
                variant="orange"
                onClick={() => {
                  const selectedService = serviceData.find((service) => service._id === activeService);
                  if (selectedService) {
                    handleServiceSelection(selectedService);
                  }
                }}
              >
                VIEW {serviceData.find((service) => service._id === activeService)?.title || "SERVICE"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
