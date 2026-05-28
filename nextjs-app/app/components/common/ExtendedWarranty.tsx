"use client"
import type { ExtendedWarrantyForm } from "@/sanity.types"
import { Squircle } from "corner-smoothing"
import { useFormik } from "formik"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import type { SingleValue } from "react-select"
import { createFleetLead } from "@/app/actions/appointment/createFleet"
import { useEffect, useState } from "react"
import type { FleetData } from "../../actions/types"
import { toast } from "react-toastify"
import Image from "next/image"
import { customStyles } from "../../lib/types/types"
import { getMakeModelList } from "@/app/actions/appointment/makeModelList"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
import useDeviceDetection from "../../hooks/useDeviceDetection"

const Select = dynamic(() => import("react-select"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
})

type ExtendedWarrantyProps = {
    block: ExtendedWarrantyForm
    index: number
}

function ExtendedWarranty({ block }: ExtendedWarrantyProps) {
    const { isMobileDevice } = useDeviceDetection()
    const warrantyFormValidationSchema = Yup.object({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        plateNumber: Yup.string().required("Plate no is required"),
        brand: Yup.string().required("Brand is required"),
        model: Yup.string().required("Model is required"),
        country: Yup.string().required("Country code is required"),
        year: Yup.string().required("Year is required"),
        odometer: Yup.number().required("Odometer is required").positive("Must be a positive number"),
    })
    const [isLoading, setIsLoading] = useState(false)
    const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
    const [models, setModels] = useState<Record<string, { value: string; label: string }[]>>({})


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

    const [fleetFormData, setFleetFormData] = useState<FleetData>({
        sender: '',
        message: '',
        subject: '',
        full_name: '',
        organization: '',
        mobile_no: '',
        phone_no: '',
        opportunity_args: {},
    });
    const [finalSubmitLoader, setFinalSubmitLoader] = useState(false)

    const countryCodes = [
        { value: "+971", label: "+971" },
    ]

    const years = {
        year1: 2018,
        year2: 2019,
        year3: 2020,
        year4: 2021,
        year5: 2022,
    }

    const warrantyForm = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            country: "+971",
            plateNumber: "",
            brand: "",
            model: "",
            year: "",
            odometer: "",
        },
        validationSchema: warrantyFormValidationSchema,
        validateOnBlur: true,
        onSubmit: (values, { resetForm }) => {
            console.log("persnal_details", values)
            const payload = {
                sender: values.email,
                full_name: `${values.firstName} ${values.lastName}`,
                mobile_no: `${values.country}${values.phoneNumber}`,
                subject: 'Extended Warranty',
                message: '',
                organization: '',
                opportunity_args: {
                    "vehicle_license_plate": values?.plateNumber,
                    "applies_to_item_brand": values?.brand,
                    "applies_to_item": values?.model,
                    "vehicle_last_odometer": values?.odometer,
                    "vehicle_model_year": values?.year
                },
            };
            setFleetFormData(payload)
            resetForm();
        },
    })

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

    // Replace the availableModels calculation with:
    const availableModels = warrantyForm.values.brand && models[warrantyForm.values.brand] ? models[warrantyForm.values.brand] : []
    /*  Create Fleet Lead */
    useEffect(() => {
        const fetchFleetLead = async () => {
            setFinalSubmitLoader(true)
            console.log(fleetFormData);
            try {
                const response = await createFleetLead(fleetFormData)
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
            }
        }
        if (fleetFormData?.sender) {
            fetchFleetLead()
        }
    }, [fleetFormData])

    return (
        <div>
            <form autoComplete="off" className="md:w-[845px] 3xl:w-[1080px] px-5 md:px-0 warrantyForm m-auto mt-10 space-y-10" onSubmit={warrantyForm.handleSubmit} action="">
                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] text-black dark:text-[#e6d9c0]">{block.personalDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                            warrantyForm.errors.firstName && warrantyForm.touched.firstName
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="firstName">
                                {block.personalDetails?.firstname?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.firstName}
                                className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder={block.personalDetails?.firstname?.placeholder}
                            />
                            {warrantyForm.errors.firstName && warrantyForm.touched.firstName ? (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.firstName}</div>
                            ) : null}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                            warrantyForm.errors.lastName && warrantyForm.touched.lastName
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="lastName">
                                {block.personalDetails?.lastname?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.lastName}
                                className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder={block.personalDetails?.lastname?.placeholder}
                            />
                            {warrantyForm.errors.lastName && warrantyForm.touched.lastName ? (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.lastName}</div>
                            ) : null}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                            warrantyForm.errors.email && warrantyForm.touched.email
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="email">
                                {block.personalDetails?.email?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.email}
                                className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                type="email"
                                name="email"
                                id="email"
                                placeholder={block.personalDetails?.email?.placeholder}
                            />
                            {warrantyForm.errors.email && warrantyForm.touched.email ? (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.email}</div>
                            ) : null}
                        </div>

                        <div className={`border rounded-[20px] h-[90px] flex items-center w-full overflow-hidden transition-colors ${
                            (warrantyForm.errors.phoneNumber && warrantyForm.touched.phoneNumber) || (warrantyForm.errors.country && warrantyForm.touched.country)
                                 ? "border-[#FF3300]"
                                 : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            {/* Country Code Selection */}
                            <div className="w-[124px] h-full flex flex-col justify-center px-[24px] pr-[15px] relative border-r border-[#D9D9D9] dark:border-white/20 selectReact no-border">
                                <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="country">
                                     {block.personalDetails?.contact?.country?.label}
                                 </label>
                                 <Select
                                     name="country"
                                     id="country"
                                     options={countryCodes}
                                     styles={customSelectStyles}
                                     classNames={selectClassNames}
                                     components={components}
                                     value={countryCodes.find((option) => option.value === warrantyForm.values.country)}
                                     onChange={(newValue, _actionMeta) => {
                                         const option = newValue as SingleValue<{ value: string; label: string }>;
                                         warrantyForm.setFieldValue("country", option?.value || "")
                                     }}
                                     onBlur={warrantyForm.handleBlur}
                                     placeholder={block.personalDetails?.contact?.country?.placeholder}
                                     isSearchable={false}
                                 />
                            </div>

                            {/* Phone Number Input */}
                            <div className="flex-1 h-full flex flex-col justify-center px-[24px] selectReact">
                                <label htmlFor="phoneNumber" className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium">
                                    {block.personalDetails?.contact?.phone?.label}
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    placeholder={block.personalDetails?.contact?.phone?.placeholder}
                                    value={warrantyForm.values.phoneNumber}
                                    onChange={warrantyForm.handleChange}
                                    onBlur={warrantyForm.handleBlur}
                                    className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                />
                                {warrantyForm.errors.phoneNumber && warrantyForm.touched.phoneNumber && (
                                    <div className="text-xs text-[#FF3300] font-host mt-0.5 leading-none">{warrantyForm.errors.phoneNumber}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] text-black dark:text-[#e6d9c0]">{block.vehicleDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                            warrantyForm.errors.brand && warrantyForm.touched.brand
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="brand">
                                {block.vehicleDetails?.brand?.labelPlaceholder?.label}
                            </label>
                            <Select
                                id="brand"
                                name="brand"
                                options={brands}
                                value={brands.find((option) => option.value === warrantyForm.values.brand) || null}
                                onChange={(newValue, _actionMeta) => {
                                    const option = newValue as SingleValue<{ value: string; label: string }>;
                                    warrantyForm.setFieldValue("brand", option?.value || "")
                                    warrantyForm.setFieldValue("model", "")
                                }}
                                onBlur={warrantyForm.handleBlur}
                                placeholder={isLoading ? "Loading brands..." : "Select"}
                                isDisabled={isLoading}
                                styles={customSelectStyles}
                                classNames={selectClassNames}
                                components={components}
                                isSearchable={!isMobileDevice}
                                className="font-fustat text-[16px] md:text-[20px]"
                            />
                            {warrantyForm.errors.brand && warrantyForm.touched.brand && (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.brand}</div>
                            )}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                            warrantyForm.errors.model && warrantyForm.touched.model
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="model">
                                {block.vehicleDetails?.model?.labelPlaceholder?.label}
                            </label>
                            <Select
                                id="model"
                                name="model"
                                options={availableModels}
                                value={availableModels.find((option) => option.value === warrantyForm.values.model) || null}
                                onChange={(newValue, _actionMeta) => {
                                    const option = newValue as SingleValue<{ value: string; label: string }>;
                                    warrantyForm.setFieldValue("model", option?.value || "");
                                }}
                                onBlur={warrantyForm.handleBlur}
                                placeholder={isLoading ? "Loading models..." : "Select"}
                                styles={customSelectStyles}
                                classNames={selectClassNames}
                                components={components}
                                isDisabled={!warrantyForm.values.brand || isLoading}
                                isSearchable={!isMobileDevice}
                                className="font-fustat text-[16px] md:text-[20px]"
                            />
                            {warrantyForm.errors.model && warrantyForm.touched.model && (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.model}</div>
                            )}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                            warrantyForm.errors.year && warrantyForm.touched.year
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="year">
                                {block.vehicleDetails?.year?.labelPlaceholder?.label}
                            </label>
                            <Select
                                id="year"
                                name="year"
                                options={block?.vehicleDetails?.year?.years?.map((year) => ({ value: year.toString(), label: year.toString() }))}
                                value={
                                    (block?.vehicleDetails?.year?.years?.map((year) => ({ value: year.toString(), label: year.toString() })) ||
                                     Object.values(years).map((year) => ({ value: year.toString(), label: year.toString() })))
                                        .find((option) => option.value === warrantyForm.values.year) || null
                                }
                                onChange={(newValue, _actionMeta) => {
                                    const option = newValue as SingleValue<{ value: string; label: string }>;
                                    warrantyForm.setFieldValue("year", option?.value || "")
                                }}
                                onBlur={warrantyForm.handleBlur}
                                placeholder={block.vehicleDetails?.year?.labelPlaceholder?.placeholder}
                                styles={customSelectStyles}
                                classNames={selectClassNames}
                                components={components}
                                isSearchable={false}
                                className="font-fustat text-[16px] md:text-[20px]"
                            />
                            {warrantyForm.errors.year && warrantyForm.touched.year && (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.year}</div>
                            )}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                            warrantyForm.errors.plateNumber && warrantyForm.touched.plateNumber
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="vin">
                                {block.vehicleDetails?.plateNumber?.label}
                            </label>
                            <input
                                className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                type="text"
                                placeholder={block.vehicleDetails?.plateNumber?.placeholder}
                                id="plateNumber"
                                name="plateNumber"
                                value={warrantyForm.values.plateNumber}
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                            />
                            {warrantyForm.errors.plateNumber && warrantyForm.touched.plateNumber ? (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.plateNumber}</div>
                            ) : null}
                        </div>

                        <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                            warrantyForm.errors.odometer && warrantyForm.touched.odometer
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                        }`}>
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-[12px] uppercase opacity-60 font-medium" htmlFor="odometer">
                                {block.vehicleDetails?.odometer?.labelPlaceholder?.label}
                            </label>
                            <input
                                className="bg-transparent w-full font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                                type="number"
                                placeholder={block.vehicleDetails?.odometer?.labelPlaceholder?.placeholder}
                                id="odometer"
                                name="odometer"
                                value={warrantyForm.values.odometer || ""}
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                            />
                            {warrantyForm.errors.odometer && warrantyForm.touched.odometer ? (
                                <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">{warrantyForm.errors.odometer}</div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <Squircle cornerRadius={10}>
                    <button
                        type="submit"
                        className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""} mt-2 w-40 uppercase rounded-lg px-[26px] py-[13px] gradientBG font-fustat text-white transition-colors hover:bg-[#a00029]`}
                    >
                        {block?.submitButton?.buttonText}
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
                </Squircle>
            </form>
        </div>
    )
}

export default ExtendedWarranty
