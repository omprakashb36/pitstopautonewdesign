"use client"
import type { ExtendedWarrantyForm } from "@/sanity.types"
import { Squircle } from "corner-smoothing"
import { useFormik } from "formik"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import "react-datepicker/dist/react-datepicker.css"
import type { SingleValue } from "react-select"
import { createFleetLead } from "@/app/actions/appointment/createFleet"
import { useEffect, useState } from "react"
import type { FleetData } from "../../actions/types"
import { toast } from "react-toastify"
import Image from "next/image"
import { customStyles } from "../../lib/types/types"
import { getMakeModelList } from "@/app/actions/appointment/makeModelList"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";

const Select = dynamic(() => import("react-select"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
})

type ExtendedWarrantyProps = {
    block: ExtendedWarrantyForm
    index: number
}

function ExtendedWarranty({ block }: ExtendedWarrantyProps) {
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
            <form autoComplete="off" className="md:w-[920px] px-5 md:px-0 warrantyForm m-auto mt-10 space-y-10" onSubmit={warrantyForm.handleSubmit} action="">
                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] text-black dark:text-[#e6d9c0]">{block.personalDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="firstName">
                                {block.personalDetails?.firstname?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.firstName}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder={block.personalDetails?.firstname?.placeholder}
                            />
                            {warrantyForm.errors.firstName && warrantyForm.touched.firstName ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.firstName}</p>
                            ) : null}
                        </div>
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="">
                                {block.personalDetails?.lastname?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.lastName}
                                className="bg-transparent px-4 w-full py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder={block.personalDetails?.lastname?.placeholder}
                            />
                            {warrantyForm.errors.lastName && warrantyForm.touched.lastName ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.lastName}</p>
                            ) : null}
                        </div>
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="emai">
                                {block.personalDetails?.email?.label}
                            </label>
                            <input
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                                value={warrantyForm.values.email}
                                className="bg-transparent px-4 py-3 w-full font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="email"
                                name="email"
                                id="email"
                                placeholder={block.personalDetails?.email?.placeholder}
                            />
                            {warrantyForm.errors.email && warrantyForm.touched.email ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.email}</p>
                            ) : null}
                        </div>
                        <div className="md:grid md:grid-cols-3 gap-4">
                            <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                                <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="contactNumber">
                                    {block.personalDetails?.contact?.country?.label}
                                </label>
                                <Select
                                    name="country"
                                    id="country"
                                    options={countryCodes}
                                    // styles={customStyles}
                                    styles={selectStyles}
                                    classNames={selectClassNames}
                                    value={countryCodes.find((option) => option.value === warrantyForm.values.country)}
                                    onChange={(newValue, _actionMeta) => {
                                        const option = newValue as SingleValue<{ value: string; label: string }>;
                                        warrantyForm.setFieldValue("country", option?.value || "")
                                    }}
                                    onBlur={warrantyForm.handleBlur}
                                    onFocus={() => warrantyForm.setFieldTouched("countryCode", false)}
                                    placeholder={block.personalDetails?.contact?.country?.placeholder}
                                />
                                {warrantyForm.errors.country && warrantyForm.touched.country ? (
                                    <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.country}</p>
                                ) : null}
                            </div>
                            <div className="formLabel border col-span-2 dark:border-white/20  border-black/20 rounded-[15px]  space-y-2">
                                <label htmlFor="phoneNumber" className="block font-fustat text-xs uppercase sandDrift">
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
                                    className="bg-transparent w-full px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                />
                                {warrantyForm.errors.phoneNumber && warrantyForm.touched.phoneNumber && (
                                    <div className="mt-1 text-sm text-[#c00034] font-fustat ">{warrantyForm.errors.phoneNumber}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] text-black dark:text-[#e6d9c0]">{block.vehicleDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="formLabel selectReact border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="">
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
                                    // Reset model when brand changes
                                    warrantyForm.setFieldValue("model", "")
                                }}
                                onBlur={warrantyForm.handleBlur}
                                placeholder={isLoading ? "Loading brands..." : "Select"}
                                isDisabled={isLoading}
                                styles={selectStyles}
                                classNames={selectClassNames}
                                isSearchable
                            />
                            {warrantyForm.errors.brand && warrantyForm.touched.brand && (
                                <div className="mt-1 text-sm text-[#c00034] font-urbanist">{warrantyForm.errors.brand}</div>
                            )}
                        </div>
                        <div className="formLabel selectReact border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="model">
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
                                styles={selectStyles}
                                classNames={selectClassNames}
                                isDisabled={!warrantyForm.values.brand || isLoading}
                                isSearchable
                            />
                            {warrantyForm.errors.model && warrantyForm.touched.model && (
                                <div className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.model}</div>
                            )}
                        </div>
                        <div className="formLabel selectReact border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="year">
                                {block.vehicleDetails?.year?.labelPlaceholder?.label}
                            </label>
                            <Select
                                id="year"
                                name="year"
                                options={block?.vehicleDetails?.year?.years?.map((year) => ({ value: year.toString(), label: year.toString() }))}
                                value={
                                    Object.values(years)
                                        .map((year) => ({ value: year.toString(), label: year.toString() }))
                                        .find((option) => option.value === warrantyForm.values.year) || null
                                }
                                onChange={(newValue, _actionMeta) => {
                                    const option = newValue as SingleValue<{ value: string; label: string }>;
                                    warrantyForm.setFieldValue("year", option?.value || "")
                                }}
                                onBlur={warrantyForm.handleBlur}
                                placeholder={block.vehicleDetails?.year?.labelPlaceholder?.placeholder}
                                styles={selectStyles}
                                classNames={selectClassNames}
                                isSearchable
                            />
                            {warrantyForm.errors.year && warrantyForm.touched.year && (
                                <div className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.year}</div>
                            )}
                        </div>
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="vin">
                                {block.vehicleDetails?.plateNumber?.label}
                            </label>
                            <input
                                className="bg-transparent px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                placeholder={block.vehicleDetails?.plateNumber?.placeholder}
                                id="plateNumber"
                                name="plateNumber"
                                value={warrantyForm.values.plateNumber}
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                            />
                            {warrantyForm.errors.plateNumber && warrantyForm.touched.plateNumber ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.plateNumber}</p>
                            ) : null}
                        </div>

                        <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat sandDrift text-xs uppercase" htmlFor="odometer">
                                {block.vehicleDetails?.odometer?.labelPlaceholder?.label}
                            </label>
                            <input
                                className="bg-transparent px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="number"
                                placeholder={block.vehicleDetails?.odometer?.labelPlaceholder?.placeholder}
                                id="odometer"
                                name="odometer"
                                value={warrantyForm.values.odometer || ""}
                                onChange={warrantyForm.handleChange}
                                onBlur={warrantyForm.handleBlur}
                            />
                            {warrantyForm.errors.odometer && warrantyForm.touched.odometer ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{warrantyForm.errors.odometer}</p>
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
