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
import { create } from "domain";
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
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "transparent",
            border: state.isFocused ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "0px",
            boxShadow: "none",
            "&:hover": {
                border: "1px solid rgba(255, 255, 255, 0.4)",
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: "#FFFFFF",
            fontFamily: "var(--font-urbanist)",
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-urbanist)",
            backgroundColor: "#00000",
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: "#1b1b1b",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "0 0 8px 8px",
            borderRadius: "8px",
            zIndex: 9999,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#c00034" : state.isFocused ? "rgba(192, 0, 52, 0.2)" : "transparent",
            color: "#FFFFFF",
            fontFamily: "var(--font-urbanist)",
            "&:hover": {
                backgroundColor: "rgba(192, 0, 52, 0.2)",
            },
        }),
        input: (provided: any) => ({
            ...provided,
            color: "#FFFFFF",
            fontFamily: "var(--font-urbanist)",
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: "0",
            color: "rgba(255, 255, 255, 0.5)",
            "&:hover": {
                color: "#FFFFFF",
            },
        }),
        menuList: (provided: any) => ({
            ...provided,
            maxHeight: "150px",
            overflowY: "auto",
            padding: "0",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
    }


    if (!isHydrated) {
        return <div></div>
    }
    return (

        <div className="dark:text-[#FAEADC] text-black mt-[180px] min-h-screen pageBg relative  ">
            <div className="px-4 xl:px-[60px] 2xl:px-[116px] py-8 md:pb-0 md:py-12 md:pt-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[15px] mb-6">
                    <Link href={`/${currentLocale}`}>Home</Link>
                    <span>/</span>
                    <Link href={`/${currentLocale}/offers`}>Offers</Link>
                    <span>/</span>
                    <span className="opacity-60">Offer details</span>
                </div>
                <h1 className="text-[30px] md:text-5xl font-bold">
                    <span className="dark:text-[#FAEADC] text-black uppercase font-shoulders">
                        {offerDetails?.title?.split(" ")[0] || ""}
                    </span>{" "}
                    <span className="text-[#C00034] uppercase font-shoulders">
                        {offerDetails?.title?.split(" ").slice(1).join(" ") || ""}
                    </span>
                </h1>
                {/* hero image */}
                <div className="w-full relative md:mt-[50px] mt-[30px]">
                    {offerDetails?.detailImage?.altText &&
                        <ImageComp
                            block={offerDetails.detailImage}
                            width={2732}
                            height={918}
                            imageClassName={`w-full ${isMobileDevice ? 'rounded-[20px]' : 'rounded-[50px]'}  h-full object-cover object-left-bottom transition-transform duration-500 group-hover:scale-105`}
                        />
                    }
                    {isMobileDevice &&
                        <button
                            onClick={handleScroll}
                            className="rounded-[10px] mt-8 py-[14.3px] font-bold font-urbanist w-[100%] gradientBG text-[12px]/[100%] tracking-[8%] leading-[100%]">avail this offer
                        </button>
                    }
                </div>
                <div className="grid w-full md:grid-cols-2 mt-[50px] gap-[33px]">
                    {/* array of richText */}
                    <div className="w-full flex flex-col gap-[20.67px]">
                        {offerDetails?.richText?.map((rich) => (
                            <div key={rich._key} className="w-full border-[#FAEADC4D] shadow-2xl border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#F9F9F9]">
                                {rich.offerRichText?.length && (
                                    <PortableText
                                        className="richTextTitle md:p-[66.6px] px-5 py-10"
                                        value={rich?.offerRichText as PortableTextBlock[]}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* form section */}
                    <div className="w-full" ref={targetRef}>
                        <div className="border-[#FAEADC4D] shadow-2xl dark:bg-black bg-[#FFFFFF] border-[0.83px] rounded-[33.33px] md:p-[66.6px] px-5 py-10">
                            <div className="space-y-6">
                                <h1 className="text-[#C00034] text-[30px] md:text-[50px]/[100%] uppercase tracking-0 font-[600] font-shoulders">Avail this offer now !</h1>
                                {/* form */}
                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    <div className="formLabel selectReact border dark:border-white/20 border-black/20  rounded-[15px] space-y-2">
                                        <label htmlFor="brand" className="block font-urbanist sandDrift text-xs uppercase">
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
                                            // styles={customStyles}
                                            styles={selectStyles}
                                            isSearchable={isMobileDevice ? false : true}
                                            className="font-urbanist"
                                            classNames={selectClassNames}
                                        />
                                        {formik.errors.brand && formik.touched.brand && (
                                            <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.brand}</div>
                                        )}
                                    </div>


                                    <div className="flex flex-col gap-5 md:flex-row md:flex-wrap">
                                        <div className="formLabel md:w-[calc(50%-10px)] selectReact border dark:border-white/20 border-black/20  rounded-[15px] space-y-2">
                                            <label htmlFor="model" className="block font-urbanist sandDrift text-xs uppercase">
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
                                                // styles={customStyles}
                                                styles={selectStyles}
                                                classNames={selectClassNames}
                                                isDisabled={!formik.values.brand || isLoading}
                                                isSearchable={isMobileDevice ? false : true}
                                                className="font-urbanist"
                                            />
                                            {formik.errors.model && formik.touched.model && (
                                                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.model}</div>
                                            )}
                                        </div>

                                        <div className="formLabel md:w-[calc(50%-10px)] selectReact border dark:border-white/20 border-black/20  rounded-[15px] space-y-2">
                                            <label htmlFor="year" className="block font-urbanist sandDrift text-xs uppercase">
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
                                                // styles={customStyles}
                                                styles={selectStyles}
                                                classNames={selectClassNames}
                                                isSearchable={isMobileDevice ? false : true}
                                                className="font-urbanist"
                                            />
                                            {formik.errors.year && formik.touched.year && (
                                                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.year}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                                        <label htmlFor="fullName" className="block font-urbanist text-xs uppercase sandDrift">
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
                                            className={`w-full rounded-lg border ${formik.errors.fullName && formik.touched.fullName
                                                ? "border-[#c00034]"
                                                : "border-white/20 focus:border-white/40"
                                                } bg-transparent px-4 py-3 font-urbanist dark:text-[#FAEADC] text-black/80 dark:placeholder:text-[#FAEADC]/50 placeholder:text-[#0000]/50 focus:outline-none`}
                                        />
                                        {formik.errors.fullName && formik.touched.fullName && (
                                            <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.fullName}</div>
                                        )}
                                    </div>

                                    <div className="md:grid md:grid-cols-3 gap-4">
                                        <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] md:mb-0 mb-5 space-y-2">
                                            <label htmlFor="countryCode" className="block font-urbanist text-xs uppercase sandDrift">
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
                                                // styles={customStyles}
                                                styles={selectStyles}
                                                classNames={selectClassNames}
                                                className="font-urbanist"
                                            />
                                            {formik.errors.countryCode && formik.touched.countryCode && (
                                                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.countryCode}</div>
                                            )}
                                        </div>

                                        <div className="formLabel border col-span-2 dark:border-white/20 border-black/20 rounded-[15px]  space-y-2">
                                            <label htmlFor="phoneNumber" className="block font-urbanist text-xs uppercase sandDrift">
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
                                                className={`w-full rounded-lg border ${formik.errors.phoneNumber && formik.touched.phoneNumber
                                                    ? "border-[#c00034]"
                                                    : "border-white/20 focus:border-white/40"
                                                    } bg-transparent px-4 py-3 font-urbanist dark:text-[#FAEADC] text-black/80 dark:placeholder:text-[#FAEADC]/50 placeholder:text-[#0000]/50 focus:outline-none`}
                                            />
                                            {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                                                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.phoneNumber}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="formLabel border dark:border-white/20 border-black/20  rounded-[15px] space-y-2">
                                        <label htmlFor="email" className="block font-urbanist text-xs uppercase sandDrift">
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
                                            className={`w-full rounded-lg border ${formik.errors.email && formik.touched.email
                                                ? "border-[#c00034]"
                                                : "border-white/20 focus:border-white/40"
                                                } bg-transparent px-4 py-3 font-urbanist dark:text-[#FAEADC] text-black/80 dark:placeholder:text-[#FAEADC]/50 placeholder:text-[#0000]/50 focus:outline-none`}
                                        />
                                        {formik.errors.email && formik.touched.email && (
                                            <div className="mt-1 text-sm text-[#c00034] font-urbanist">{formik.errors.email}</div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""}rounded-[10px] py-[14.3px] font-bold font-urbanist w-[100%] gradientBG text-[12px]/[100%] tracking-[8%] leading-[100%]`}>
                                            avail this offer

                                        {finalSubmitLoader && (
                                            <Image
                                                src="/images/infinite-spinner.svg"
                                                alt="arrow right"
                                                width={30}
                                                height={15}
                                                className="loaderImage inline-block"
                                            />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}