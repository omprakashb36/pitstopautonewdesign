"use client"
import type { FleetManagement } from "@/sanity.types"
import { Squircle } from "corner-smoothing"
import { useFormik } from "formik"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import { createFleetLead } from "@/app/actions/appointment/createFleet"
import { useEffect, useState } from "react"
import type { FleetData } from "../../actions/types"
import { toast } from "react-toastify"
import Image from "next/image"
import { customStyles } from "../../lib/types/types"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";

const Select = dynamic(() => import("react-select"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
})

type FleetManagementProps = {
    block: FleetManagement
    index: number
}


function FleetManagement({ block, index }: FleetManagementProps) {
    const fleetFormValidationSchema = Yup.object({
        companyName: Yup.string().required("Company name is required"),
        fleetManagerName: Yup.string().required("Fleet manager's name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        contactNumber: Yup.string().required("Contact number is required"),
        country: Yup.string().required("Country code is required"),
        numberOfVehicles: Yup.number().required("Number of vehicles is required").positive("Must be a positive number"),
        preferredGarage: Yup.string().required("Preferred garage is required"),
    })

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
        { value: "+1", label: "+1" },
        { value: "+44", label: "+44" },
        { value: "+91", label: "+91" },
    ]

    const garages = [
        { value: "garage1", label: "Musaffah - AutoWorks" },
        { value: "garage2", label: "Sajja - AutoWorks" },
        { value: "garage3", label: "Sharjah Industrial Area - AutoWorks" },
    ]

    const fleetForm = useFormik({
        initialValues: {
            companyName: "",
            fleetManagerName: "",
            email: "",
            contactNumber: "",
            country: "+971",
            numberOfVehicles: "",
            preferredGarage: "",
        },
        validationSchema: fleetFormValidationSchema,
        validateOnBlur: true,
        onSubmit: (values, { resetForm }) => {
            console.log("fleet_management_details", values)
            const payload = {
                sender: values.email,
                full_name: `${values.fleetManagerName}`,
                mobile_no: `${values.country}${values.contactNumber}`,
                subject: 'Fleet Care',
                message: '',
                organization: values?.companyName,
                opportunity_args: {
                    "preferred_workshop": values?.preferredGarage,
                    "fleet_qty": values?.numberOfVehicles,
                },
            };
            setFleetFormData(payload)
            resetForm();
        },
    })

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
            <form autoComplete="off" className="md:w-[920px] px-5 md:px-0 m-auto mt-7 space-y-10 fleetForm" onSubmit={fleetForm.handleSubmit} action="">
                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] dark:text-[#faeadc] text-black">{block.companyAndFleetDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="companyName">
                                {block.companyAndFleetDetails?.companyNameLabel}
                            </label>
                            <input
                                onChange={fleetForm.handleChange}
                                onBlur={fleetForm.handleBlur}
                                value={fleetForm.values.companyName}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-[#faeadc] text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                name="companyName"
                                id="companyName"
                                placeholder={block.companyAndFleetDetails?.companyNamePlaceholder}
                            />
                            {fleetForm.errors.companyName && fleetForm.touched.companyName ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.companyName}</p>
                            ) : null}
                        </div>

                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="fleetManagerFirstName">
                                {block.companyAndFleetDetails?.managerFirstNameLabel}
                            </label>
                            <input
                                onChange={fleetForm.handleChange}
                                onBlur={fleetForm.handleBlur}
                                value={fleetForm.values.fleetManagerName}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-[#FAEADC] text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                name="fleetManagerName"
                                id="fleetManagerName"
                                placeholder={block.companyAndFleetDetails?.managerFirstNamePlaceholder}
                            />
                            {fleetForm.errors.fleetManagerName && fleetForm.touched.fleetManagerName ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.fleetManagerName}</p>
                            ) : null}
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">






                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="email">
                                {block.companyAndFleetDetails?.emailLabel}
                            </label>
                            <input
                                onChange={fleetForm.handleChange}
                                onBlur={fleetForm.handleBlur}
                                value={fleetForm.values.email}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-[#FAEADC] text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="email"
                                name="email"
                                id="email"
                                placeholder={block.companyAndFleetDetails?.emailPlaceholder}
                            />
                            {fleetForm.errors.email && fleetForm.touched.email ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.email}</p>
                            ) : null}
                        </div>

                        <div className="flex gap-4">
                            <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 w-1/3">
                                <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="country">
                                    {block.companyAndFleetDetails?.countryLabel}
                                </label>
                                <Select
                                    name="country"
                                    id="country"
                                    options={countryCodes}
                                    // styles={customStyles}
                                    styles={selectStyles}
                                    classNames={selectClassNames}
                                    value={countryCodes.find((option) => option.value === fleetForm.values.country)}
                                    onChange={(newValue: unknown, _actionMeta: any) => {
                                        const option = newValue as { value: string; label: string } | null
                                        fleetForm.setFieldValue("country", option?.value || "")
                                    }}
                                    defaultValue={countryCodes[0]}
                                    placeholder="+971"
                                    isSearchable={false}
                                />
                                {fleetForm.errors.country && fleetForm.touched.country ? (
                                    <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.country}</p>
                                ) : null}
                            </div>

                            <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 flex-1">
                                <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="contactNumber">
                                    {block.companyAndFleetDetails?.contactNumberLabel}
                                </label>
                                <input
                                    onChange={fleetForm.handleChange}
                                    onBlur={fleetForm.handleBlur}
                                    value={fleetForm.values.contactNumber}
                                    className="bg-transparent w-full px-4 py-3 font-fustat dark:text-[#FAEADC]  text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                    type="text"
                                    name="contactNumber"
                                    id="contactNumber"
                                    placeholder={block.companyAndFleetDetails?.contactNumberPlaceholder}
                                />
                                {fleetForm.errors.contactNumber && fleetForm.touched.contactNumber ? (
                                    <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.contactNumber}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-6 font-urbanist font-bold text-[20px] dark:text-[#faeadc] text-black">{block.fleetDetails?.heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="numberOfVehicles">
                                {block.fleetDetails?.numberOfVehicleLabel}
                            </label>
                            <input
                                onChange={fleetForm.handleChange}
                                onBlur={fleetForm.handleBlur}
                                value={fleetForm.values.numberOfVehicles}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-[#FAEADC]  text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="number"
                                name="numberOfVehicles"
                                id="numberOfVehicles"
                                placeholder={block.fleetDetails?.numberOfVehiclePlaceholder}
                            />
                            {fleetForm.errors.numberOfVehicles && fleetForm.touched.numberOfVehicles ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.numberOfVehicles}</p>
                            ) : null}
                        </div>

                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="preferredGarage">
                                {block.fleetDetails?.prferedGarageLabel}
                            </label>
                            <Select
                                id="preferredGarage"
                                name="preferredGarage"
                                options={garages}
                                // styles={customStyles}
                                styles={selectStyles}
                                classNames={selectClassNames}
                                value={garages.find((option) => option.value === fleetForm.values.preferredGarage) || null}
                                onChange={(newValue: unknown) => {
                                    const option = newValue as { value: string; label: string } | null;
                                    fleetForm.setFieldValue("preferredGarage", option?.value || "")
                                }}
                                onBlur={() => fleetForm.setFieldTouched("preferredGarage", true)}
                                placeholder={block.fleetDetails?.prferedGaragePlaceholder}
                                className="font-fustat"
                            />
                            {fleetForm.errors.preferredGarage && fleetForm.touched.preferredGarage ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{fleetForm.errors.preferredGarage}</p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <Squircle cornerRadius={10}>
                    <button
                        type="submit"
                        className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""} mt-2 w-40 uppercase rounded-lg px-[26px] py-[13px] gradientBG font-fustat text-white transition-colors hover:bg-[#a00029]`}
                    >
                        {block?.submitText}
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

export default FleetManagement
