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
      /*console.log(pathSegments[3]);*/
      const response = await fetchLead(values?.countryCode + values?.phoneNumber, values?.email);
      /*console.log("fetchLead response: ", response);*/
      if (response?.status && response?.data?.data && response?.data?.data.length > 0) {
        console.log(response?.data.data[0]);
        dispatch(setLeadId(response?.data.data[0]?.name));
        dispatch(setAppointmentData({
          personalDetails: {
            fullName: response?.data.data[0]?.lead_name || values?.fullName || '',
            countryCode: '+971',
            phoneNumber: values?.phoneNumber || '',
            email: response?.data.data[0]?.email_id || values?.email || '',
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
      className="fixed inset-0 z-50 flex items-center rounded-[35px] justify-center backdropBlur-40 overflow-y-auto"
    >
      <div className="relative carModalPopup max-h-[90vh] min-h-[500px] overflow-y-auto custom-scrollbar w-full max-w-[1130px] rounded-[30px] dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 2xl:p-[66px] md:p-12 ltr:md:pr-0 rtl:md:pl-0 my-4 mx-4">
        <button onClick={onClose} className="absolute z-10 ltr:2xl:right-[66px] rtl:2xl:left-[66px] ltr:right-8 rtl:left-8 2xl:top-[86px] top-8 text-white hover:text-gray-300" aria-label="Close">
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
              <h2 className="font-shoulders text-3xl 2xl:text-[50px] md:text-4xl 2xl:mb-[36px] md:mb-2 mb-0">
                <span className="dark:text-white text-black">{String(siteSettingData?.serviceBookForm?.stepOne?.whiteHeading) || ''}</span> <span className="text-[#c00034]">{String(siteSettingData?.serviceBookForm?.stepOne?.redHeading) || ''}</span>
              </h2>

              <form autoComplete="off" onSubmit={carFormik.handleSubmit} className="space-y-6">
                <div className="formLabel selectReact  border  border-black/15 dark:border-white/20 rounded-[15px] space-y-2">
                  <label htmlFor="brand" className="block font-urbanist sandDrift text-xs uppercase">
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
                    className="font-urbanist"
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
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.brand}</div>
                  )}
                </div>

                <div className="formLabel selectReact border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="model" className="block font-urbanist sandDrift text-xs uppercase">
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
                    // styles={customStyles}
                    styles={customSelectStyles}
                    classNames={selectClassNames}
                    components={components}
                    isDisabled={!carFormik.values.brand || isLoading}
                    isSearchable={isMobileDevice ? false : true}
                    className="font-urbanist"
                  />
                  {carFormik.errors.model && carFormik.touched.model && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.model}</div>
                  )}
                </div>

                <div className="formLabel selectReact border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="year" className="block font-urbanist sandDrift text-xs uppercase">
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
                    className="font-urbanist"
                  />
                  {carFormik.errors.year && carFormik.touched.year && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.year}</div>
                  )}
                </div>



                <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="plateNumber" className="block font-urbanist sandDrift text-xs uppercase">
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
                    className={`w-full rounded-lg border ${carFormik.errors.plateNumber && carFormik.touched.plateNumber
                      ? "border-[#c00034]"
                      : "border-white/20 focus:border-white/40"
                      } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                  />
                  {carFormik.errors.plateNumber && carFormik.touched.plateNumber && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.plateNumber}</div>
                  )}
                </div>
                <Squircle cornerRadius={10}>
                  <button
                    type="submit"
                    className="mt-2 2xl:mt-8 rounded-lg px-[26px] leading-[1] py-[13px] gradientBG font-urbanist text-white transition-colors hover:bg-[#a00029]"
                  >
                    {String(siteSettingData?.serviceBookForm?.stepOne?.proceedBtn) || ''}
                  </button>
                </Squircle>
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
                <h2 className="font-shoulders text-3xl 2xl:text-[50px] md:text-4xl">
                  <span className="dark:text-white text-black">{String(siteSettingData?.serviceBookForm?.stepTwo?.whiteHeading)}</span> <span className="text-[#c00034]">{String(siteSettingData?.serviceBookForm?.stepTwo?.redHeading)}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={personalFormik.handleSubmit} className="space-y-6 ">
                <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="fullName" className="block font-urbanist text-xs uppercase sandDrift">
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
                    className={`w-full rounded-lg border ${personalFormik.errors.fullName && personalFormik.touched.fullName
                      ? "border-[#c00034]"
                      : "border-white/20 focus:border-white/40"
                      } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                  />
                  {personalFormik.errors.fullName && personalFormik.touched.fullName && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{personalFormik.errors.fullName}</div>
                  )}
                </div>

                <div className="md:grid md:grid-cols-3 gap-4">
                  <div className="formLabel border dark:border-white/20  border-black/20rounded-[15px] md:mb-0 mb-5 space-y-2">
                    <label htmlFor="countryCode" className="block font-urbanist text-xs uppercase sandDrift">
                      {String(siteSettingData?.serviceBookForm?.stepTwo?.countryLabel) || ''}
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
                      className="font-urbanist"
                    />
                    {personalFormik.errors.countryCode && personalFormik.touched.countryCode && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">{personalFormik.errors.countryCode}</div>
                    )}
                  </div>

                  <div className="formLabel border col-span-2 dark:border-white/20  border-black/20 rounded-[15px]  space-y-2">
                    <label htmlFor="phoneNumber" className="block font-urbanist text-xs uppercase sandDrift">
                      {String(siteSettingData?.serviceBookForm?.stepTwo?.phoneLabel) || ''}
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder={String(siteSettingData?.serviceBookForm?.stepTwo?.phonePlaceholder) || ''}
                      value={personalFormik.values.phoneNumber}
                      onChange={personalFormik.handleChange}
                      onBlur={personalFormik.handleBlur}
                      className={`w-full rounded-lg border ${personalFormik.errors.phoneNumber && personalFormik.touched.phoneNumber
                        ? "border-[#c00034]"
                        : "border-white/20 focus:border-white/40"
                        } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                    />
                    {personalFormik.errors.phoneNumber && personalFormik.touched.phoneNumber && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">{personalFormik.errors.phoneNumber}</div>
                    )}
                  </div>
                </div>

                <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="email" className="block font-urbanist text-xs uppercase sandDrift">
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
                    className={`w-full rounded-lg border ${personalFormik.errors.email && personalFormik.touched.email
                      ? "border-[#c00034]"
                      : "border-white/20 focus:border-white/40"
                      } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                  />
                  {personalFormik.errors.email && personalFormik.touched.email && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{personalFormik.errors.email}</div>
                  )}
                </div>
                <Squircle cornerRadius={10}>
                  <button
                    type="submit"
                    className={`${submitting ? "cursor-not-allowed opacity-65" : ""} mt-2 2xl:mt-8 rounded-lg px-[26px] leading-[1] py-[13px] gradientBG font-urbanist text-white transition-colors hover:bg-[#a00029]`}
                  >
                    {String(siteSettingData?.serviceBookForm?.stepTwo?.proceedBtn) || ''}
                    {submitting && (
                      <Image
                        src="/images/infinite-spinner.svg"
                        alt="arrow right"
                        width={30}
                        height={15}
                        className="loaderImage inline-block"
                      />
                    )}
                  </button>
                </Squircle>
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
          <div className="flex flex-col ltr:md:pr-12 rtl:md:pl-12 step3Services">
            <div className="flex items-center mb-8">
              <button onClick={handleBack} className="ltr:mr-4 rtl:ml-4 text-white hover:text-gray-300" aria-label="Back">
                <Image
                  src={theme === "light" ? "/images/lightthemeArrow.svg" : "/images/backIcon.svg"}
                  alt="back icon"
                  width={17}
                  height={23}
                  className="mb-0"
                />
              </button>
              <h2 className="font-shoulders text-3xl md:text-4xl">
                <span className="dark:text-white text-black">BROWSE</span> <span className="text-[#c00034]">SERVICES</span>
              </h2>
            </div>

            <div className="grid gridColPopup grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {serviceData?.map((service) => {
                const isActive = service._id === activeService

                return (
                  <Link
                    href={`/${currentLocale}/services/${service.slug?.current?.replace(/^ar\//, "")}`}
                    key={service._id}
                    className={`relative rounded-2xl md:p-6 p-3 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
              ${isActive ? "bg-[#c00034]/20 border border-[#c00034]" : "dark:bg-black/30 border dark:border-gray-700 border-black"}`}
                    onClick={() => setActiveService(service._id)}
                  >
                    <div className={isActive ? "text-[#c00034]" : "dark:text-white text-black"}>

                      {service?.serviceIcon?.altText && (
                        <ImageComp
                          block={service?.serviceIcon}
                          imageClassName="w-12 h-12 object-contain"
                          width={50}
                          height={50}
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`${isActive ? "text-[#c00034]" : "dark:text-gray-300 text-black"} font-medium`}>{service.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Squircle cornerRadius={10} className="flex md:absolute hidden top-[-20px] ltr:right-20 rtl:left-20">
              <button
                onClick={() => {
                  const selectedService = serviceData.find((service) => service._id === activeService);
                  if (selectedService) {
                    handleServiceSelection(selectedService);
                  }
                }}
                className={`${activeService ? 'block' : 'hidden'} mt-12 m-w-52 mx-auto rounded-lg px-[26px] py-[13px] gradientBG inline-block font-shoulders text-white transition-colors hover:bg-[#a00029]`}
              >
                VIEW {serviceData.find((service) => service._id === activeService)?.title} SERVICE
              </button>
            </Squircle>

          </div>
        )}
      </div>
    </div>
  )
}
