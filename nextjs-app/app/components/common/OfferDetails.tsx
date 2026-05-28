"use client"
import { Offer } from "@/sanity.types"
import ImageComp from "../CustomImage";
import PortableText from "@/app/components/PortableText"
import type { PortableTextBlock } from "next-sanity"
import Select from "react-select"
import Link from "next/link";
import { useFormik } from "formik";
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { useEffect, useRef, useState } from "react";
import { getMakeModelList } from '@/app/actions/appointment/makeModelList'
import * as Yup from "yup"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
import { createFleetLead } from "@/app/actions/appointment/createFleet";
import { toast } from "react-toastify"
import Image from "next/image";

type OfferDetailProp = {
    offerDetails: Offer
}

interface FormValues {
    brand: string
    model: string
    year: string
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

export default function OfferDetails({ offerDetails }: OfferDetailProp) {
    const { isMobileDevice, currentLocale } = useDeviceDetection()

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
        const handleWheel = (e: any) => {
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

    const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
    const [models, setModels] = useState<Record<string, { value: string; label: string }[]>>({})
    const [isLoading, setIsLoading] = useState(false)
    const isHydrated = usePersistHydration()
    const targetRef = useRef<HTMLDivElement>(null)
    const [finalSubmitLoader, setFinalSubmitLoader] = useState(false)
    const handleScroll = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Add this useEffect to fetch the data when the component mounts
    useEffect(() => {
        const fetchVehicleData = async () => {
            setIsLoading(true)
            try {
                const data = await getMakeModelList();
                if (data.status && data?.data?.message) {
                    // Process brands
                    const uniqueBrands: string[] = [...new Set((data.data.message as { brand: string }[]).map((item) => item.brand))]
                    const brandOptions = uniqueBrands
                        .filter(Boolean)
                        .sort()
                        .map((brand) => ({
                            value: brand.toLowerCase(),
                            label: brand,
                        }))

                    setBrands(brandOptions)

                    // Process models by brand
                    const modelsByBrand: Record<string, { value: string; label: string }[]> = {}

                    uniqueBrands.forEach((brand: string) => {
                        if (!brand) return

                        // Get all models for this brand that don't have a variant_of (they are parent models)
                        const brandModels = data.data.message
                            .filter((item: any) => item.brand === brand)
                            .map((item: any) => ({
                                value: item.item_name.toLowerCase(),
                                label: item.item_name,
                            }))

                        modelsByBrand[brand.toLowerCase()] = brandModels
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

    const validationSchema = Yup.object({
        brand: Yup.string().required("Brand is required"),
        model: Yup.string().required("Model is required"),
        year: Yup.string().required("Year is required"),
        fullName: Yup.string().required("Full name is required"),
        countryCode: Yup.string().required("Country code is required"),
        phoneNumber: Yup.string()
            .required("Phone number is required")
            .matches(/^\d{9}$/, "Phone number must be 9 digits"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
    });

    // Personal details form
    const formik = useFormik<FormValues>({
        initialValues: {
            brand: "",
            model: "",
            year: "",
            fullName: "",
            countryCode: "+971",
            phoneNumber: "",
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setFinalSubmitLoader(true)
            console.log(values);
            if (!values.brand) return;
            const payload = {
                sender: values.email,
                full_name: `${values.fullName}`,
                mobile_no: `${values.countryCode}${values.phoneNumber}`,
                subject: 'Offer Request - ' + (offerDetails?.title || ''),
                message: '',
                organization: '',
                opportunity_args: {
                    //"vehicle_license_plate": values?.plateNumber,
                    "applies_to_item_brand": values?.brand,
                    "applies_to_item": values?.model,
                    //"vehicle_last_odometer": values?.odometer,
                    "vehicle_model_year": values?.year
                },
            }
            try {
                const response = await createFleetLead(payload)
                console.log(response)
                if (response?.status) {
                    toast.success(response?.message)
                }
                else {
                    toast.error(response?.message)
                }

            } catch (error) {
                console.error("Submission failed. Please check your details and try again.", error)
                toast.error(String(error))
            }
            finally {
                setFinalSubmitLoader(false)
                resetForm()
            }
        }
    })

    // reset react-select inline styles



    // Replace the availableModels calculation with:
    const availableModels = formik.values.brand && models[formik.values.brand] ? models[formik.values.brand] : [];


    if (!isHydrated) {
        return <div></div>
    }
    return (

        <div className="dark:text-[#FAEADC] text-black mt-[180px] min-h-screen pageBg relative  ">
            <div className="container-grid py-8 pt-0 md:pb-0 md:py-12 md:pt-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[15px] mb-0">
                    <Link href={`/${currentLocale}`}>Home</Link>
                    <span>/</span>
                    <Link href={`/${currentLocale}/offers`}>Offers</Link>
                    <span>/</span>
                    <span className="opacity-60">Offer details</span>
                </div>
                <h1>
                    <span className="dark:text-[#FAEADC] text-black font-host">
                        {"Offer"}
                    </span>{" "}
                    <span className="text-[#FF3300] font-host">
                        {"Details"}
                    </span>
                </h1>

                <div className="grid w-full md:grid-cols-2 md:mt-[50px] mt-6 3xl:gap-[40px] 2xl:gap-6 gap-10">
                    {/* hero image */}
                    <div className="w-full relative">
                        <h2 className="mb-6">{offerDetails?.title}</h2>
                        {offerDetails?.detailImage?.altText &&
                            <ImageComp
                                block={offerDetails.detailImage}
                                width={2732}
                                height={918}
                                imageClassName={`w-full ${isMobileDevice ? 'rounded-[20px]' : 'rounded-[50px]'}  h-auto object-cover mb-10 object-left-bottom transition-transform duration-500 group-hover:scale-105`}
                            />
                        }
                        {isMobileDevice &&
                            <button
                                onClick={handleScroll}
                                className="rounded-[10px] mb-10 py-[14.3px] font-bold font-host w-[100%] gradientBG text-[12px]/[100%] tracking-[8%] leading-[100%]">avail this offer
                            </button>
                        }

                        {/* array of richText */}
                        <div className="w-full flex flex-col gap-[40px]">
                            {offerDetails?.richText?.[0]?.offerRichText?.length ? (
                                <div className="w-full border-[#D9D9D9] border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#ffffff]">

                                    <PortableText
                                        className="richTextTitle xl2:p-[60px] xl:p-10 3xl:p-[80px] px-5 py-10"
                                        value={
                                            offerDetails?.richText?.[0]
                                                ?.offerRichText as PortableTextBlock[]
                                        }
                                    />

                                </div>
                            ) : null}

                            {offerDetails?.richText?.[2]?.offerRichText?.length ? (
                                <div className="w-full border-[#D9D9D9] border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#ffffff]">

                                    <PortableText
                                        className="richTextTitle xl2:p-[60px] xl:p-10 3xl:p-[80px] px-5 py-10"
                                        value={
                                            offerDetails?.richText?.[2]
                                                ?.offerRichText as PortableTextBlock[]
                                        }
                                    />

                                </div>
                            ) : null}

                            {offerDetails?.richText?.[3]?.offerRichText?.length ? (
                                <div className="w-full border-[#D9D9D9] border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#ffffff]">

                                    <PortableText
                                        className="richTextTitle xl2:p-[60px] xl:p-10 3xl:p-[80px] px-5 py-10"
                                        value={
                                            offerDetails?.richText?.[3]
                                                ?.offerRichText as PortableTextBlock[]
                                        }
                                    />

                                </div>
                            ) : null}
                        </div>
                    </div>



                    {/* form section */}
                    <div className="w-full" ref={targetRef}>
                        <div className="border-[#FAEADC4D] shadow-2xl dark:bg-black bg-[#FFFFFF] border-[0.83px] rounded-[33.33px] md:p-[66.6px] px-5 py-10">
                            <div className="space-y-6">
                                <h2 className="dark:text-[#FAEADC] text-black font-host">Avail this <span className="text-[#FF3300]">offer now !</span></h2>
                                {/* form */}
                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${formik.errors.brand && formik.touched.brand
                                        ? "border-[#FF3300]"
                                        : "border-[#D9D9D9] dark:border-white/20"
                                        }`}>
                                        <label htmlFor="brand" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                            Brand
                                        </label>
                                        <Select
                                            id="brand"
                                            name="brand"
                                            options={brands}
                                            value={brands.find((option) => option.value === formik.values.brand) || null}
                                            onChange={(option) => {
                                                formik.setFieldValue("brand", option?.value || "")
                                                // Reset model when brand changes
                                                formik.setFieldValue("model", "")
                                            }}
                                            onBlur={formik.handleBlur}
                                            placeholder={isLoading ? "Loading brands..." : "Select"}
                                            isDisabled={isLoading}
                                            styles={customSelectStyles}
                                            isSearchable={isMobileDevice ? false : true}
                                            className="font-urbanist text-[16px] md:text-[20px]"
                                            classNames={selectClassNames}
                                            components={components}
                                        />
                                        {formik.errors.brand && formik.touched.brand && (
                                            <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{formik.errors.brand}</div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${formik.errors.model && formik.touched.model
                                            ? "border-[#FF3300]"
                                            : "border-[#D9D9D9] dark:border-white/20"
                                            }`}>
                                            <label htmlFor="model" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                                Model
                                            </label>
                                            <Select
                                                id="model"
                                                name="model"
                                                options={availableModels}
                                                value={availableModels.find((option) => option.value === formik.values.model) || null}
                                                onChange={(option) => formik.setFieldValue("model", option?.value || "")}
                                                onBlur={formik.handleBlur}
                                                placeholder={isLoading ? "Loading models..." : "Select"}
                                                styles={customSelectStyles}
                                                classNames={selectClassNames}
                                                components={components}
                                                isDisabled={!formik.values.brand || isLoading}
                                                isSearchable={isMobileDevice ? false : true}
                                                className="font-urbanist text-[16px] md:text-[20px]"
                                            />
                                            {formik.errors.model && formik.touched.model && (
                                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{formik.errors.model}</div>
                                            )}
                                        </div>

                                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${formik.errors.year && formik.touched.year
                                            ? "border-[#FF3300]"
                                            : "border-[#D9D9D9] dark:border-white/20"
                                            }`}>
                                            <label htmlFor="year" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                                Year
                                            </label>
                                            <Select
                                                id="year"
                                                name="year"
                                                options={yearOptions}
                                                value={yearOptions.find((option) => option.value === formik.values.year) || null}
                                                onChange={(option) => formik.setFieldValue("year", option?.value || "")}
                                                onBlur={formik.handleBlur}
                                                placeholder={isLoading ? "Loading Years..." : "Select"}
                                                styles={customSelectStyles}
                                                classNames={selectClassNames}
                                                components={components}
                                                isSearchable={isMobileDevice ? false : true}
                                                className="font-urbanist text-[16px] md:text-[20px]"
                                            />
                                            {formik.errors.year && formik.touched.year && (
                                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{formik.errors.year}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${formik.errors.fullName && formik.touched.fullName
                                        ? "border-[#FF3300]"
                                        : "border-[#D9D9D9] dark:border-white/20"
                                        }`}>
                                        <label htmlFor="fullName" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                            Your Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formik.values.fullName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-[#faeadc] text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                        />
                                        {formik.errors.fullName && formik.touched.fullName && (
                                            <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{formik.errors.fullName}</div>
                                        )}
                                    </div>

                                    {/* Integrated Phone Row */}
                                    <div className={`border rounded-[20px] h-[90px] flex items-center w-full overflow-hidden transition-colors ${(formik.errors.phoneNumber && formik.touched.phoneNumber) || (formik.errors.countryCode && formik.touched.countryCode)
                                        ? "border-[#FF3300]"
                                        : "border-[#D9D9D9] dark:border-white/20"
                                        }`}>
                                        {/* Country Code Selection */}
                                        <div className="w-[124px] h-full flex flex-col justify-center px-[24px] pr-[15px] relative border-r border-[#D9D9D9] dark:border-white/20 selectReact no-border">
                                            <label htmlFor="countryCode" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                                Country
                                            </label>
                                            <Select
                                                id="countryCode"
                                                name="countryCode"
                                                options={countryCodes}
                                                value={countryCodes.find((option) => option.value === formik.values.countryCode) || null}
                                                onChange={(option) => formik.setFieldValue("countryCode", option?.value || "")}
                                                onBlur={formik.handleBlur}
                                                placeholder="Code"
                                                styles={customSelectStyles}
                                                classNames={selectClassNames}
                                                components={components}
                                                isSearchable={false}
                                            />
                                        </div>

                                        {/* Phone Number Input */}
                                        <div className="flex-1 h-full flex flex-col justify-center px-[24px] selectReact">
                                            <label htmlFor="phoneNumber" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="text"
                                                placeholder="Enter your phone number"
                                                value={formik.values.phoneNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                            />
                                            {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                                                <div className="text-xs text-[#FF3300] font-host mt-0.5 leading-none">{formik.errors.phoneNumber}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${formik.errors.email && formik.touched.email
                                        ? "border-[#FF3300]"
                                        : "border-[#D9D9D9] dark:border-white/20"
                                        }`}>
                                        <label htmlFor="email" className="block font-urbanist dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                            Your Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-[#faeadc] text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                        />
                                        {formik.errors.email && formik.touched.email && (
                                            <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{formik.errors.email}</div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65 " : ""}rounded-[10px] py-[14.3px] font-bold font-urbanist w-[100%] uppercase gradientBG text-[12px]/[100%] tracking-[8%] leading-[100%] transition-colors hover:bg-[#a00029]`}>
                                        avail this offer

                                        {finalSubmitLoader && (
                                            <Image
                                                src="/images/infinite-spinner.svg"
                                                alt="arrow right"
                                                width={30}
                                                height={15}
                                                className="loaderImage inline-block ml-2"
                                            />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-[40px] mt-10">
                            {offerDetails?.richText?.[1]?.offerRichText?.length ? (
                                <div className="w-full border-[#D9D9D9] border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#ffffff]">

                                    <PortableText
                                        className="richTextTitle xl2:p-[60px] xl:p-10 3xl:p-[80px] px-5 py-10"
                                        value={
                                            offerDetails?.richText?.[1]
                                                ?.offerRichText as PortableTextBlock[]
                                        }
                                    />

                                </div>
                            ) : null}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}