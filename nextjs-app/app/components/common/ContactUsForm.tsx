"use client"
import type { ContactUsForm } from "@/sanity.types"
import { Squircle } from "corner-smoothing"
import { useFormik } from "formik"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import { createFleetLead } from "@/app/actions/appointment/createFleet"
import { useEffect, useState } from "react"
import type { FleetData } from "../../actions/types"
import { toast } from "react-toastify"
import Image from "next/image"
// import { customStyles } from "../../lib/types/types"

import { selectStyles, selectClassNames } from "@/app/utils/formStyles";

const Select = dynamic(() => import("react-select"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
})

type ContactUsProps = {
    block: ContactUsForm
    index: number
}

function ContactUs({ block, index }: ContactUsProps) {
    const contactFormValidationSchema = Yup.object({
        firstName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        contactNumber: Yup.string()
            .matches(/^[0-9]+$/, "Phone number must be only digits")
            .min(9, "Phone number must be at least 9 digits")
            .required("Phone number is required"),
        country: Yup.string().required("Country code is required"),
        message: Yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
    })

    const [fleetFormData, setFleetFormData] = useState<FleetData>({
        sender: '',
        message: '',
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

    const contactForm = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            contactNumber: "",
            country: "+971",
            subject: "",
            message: "",
        },
        validationSchema: contactFormValidationSchema,
        validateOnBlur: true,
        onSubmit: (values, { resetForm }) => {
            console.log("contact_form_details", values)
            const payload = {
                sender: values.email,
                full_name: `${values.firstName}`,
                mobile_no: `${values.country}${values.contactNumber}`,
                subject: values.message,
                organization: '',
                opportunity_args: {}
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
            <form autoComplete="off" className="md:w-[920px] contactForm md:px-0 px-5 m-auto mt-7 space-y-10" onSubmit={contactForm.handleSubmit} action="">
                <h3 className="mb-4 font-urbanist font-bold text-[20px] dark:text-[#faeadc] text-black">{block?.heading}</h3>
                <div className="md:grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="formLabel md:mb-0 mb-5 border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                        <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="firstName">
                            {block?.firstNameLabel}
                        </label>
                        <input
                            onChange={contactForm.handleChange}
                            onBlur={contactForm.handleBlur}
                            value={contactForm.values.firstName}
                            className="bg-transparent w-full px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder={block?.firstNamePlaceholder}
                        />
                        {contactForm.errors.firstName && contactForm.touched.firstName ? (
                            <p className="mt-1 text-sm text-[#c00034] font-fustat">{contactForm.errors.firstName}</p>
                        ) : null}
                    </div>
                    <div className="formLabel md:mb-0 mb-5 border dark:border-white/20  border-black/20 rounded-[15px] space-y-2">
                        <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="email">
                            {block?.emailLabel}
                        </label>
                        <input
                            onChange={contactForm.handleChange}
                            onBlur={contactForm.handleBlur}
                            value={contactForm.values.email}
                            className="bg-transparent w-full px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                            type="email"
                            name="email"
                            id="email"
                            placeholder={block?.emailPlaceholder}
                        />
                        {contactForm.errors.email && contactForm.touched.email ? (
                            <p className="mt-1 text-sm text-[#c00034] font-fustat">{contactForm.errors.email}</p>
                        ) : null}
                    </div>





                    <div className="flex gap-4 col-span-2 md:mb-0 mb-5">
                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 w-1/3">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="country">
                                {block?.countryLabel}
                            </label>
                            <Select
                                name="country"
                                id="country"
                                options={countryCodes}
                                styles={selectStyles}
                                classNames={selectClassNames}
                                value={countryCodes.find((option) => option.value === contactForm.values.country)}
                                onChange={(newValue: unknown) => {
                                    const option = newValue as { value: string; label: string } | null
                                    contactForm.setFieldValue("country", option?.value || "")
                                }}
                                defaultValue={countryCodes[0]}
                                placeholder="+971"
                                isSearchable={false}
                            />
                            {contactForm.errors.country && contactForm.touched.country ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{contactForm.errors.country}</p>
                            ) : null}
                        </div>

                        <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 flex-1">
                            <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="contactNumber">
                                {block?.contactNumberLabel}
                            </label>
                            <input
                                onChange={contactForm.handleChange}
                                onBlur={contactForm.handleBlur}
                                value={contactForm.values.contactNumber}
                                className="bg-transparent w-full px-4 py-3 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none"
                                type="text"
                                name="contactNumber"
                                id="contactNumber"
                                placeholder={block?.contactNumberPlaceholder}
                            />
                            {contactForm.errors.contactNumber && contactForm.touched.contactNumber ? (
                                <p className="mt-1 text-sm text-[#c00034] font-fustat">{contactForm.errors.contactNumber}</p>
                            ) : null}
                        </div>
                    </div>



                    <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 col-span-2">
                        <label className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase" htmlFor="message">
                            {block?.queryBoxLabel}
                        </label>
                        <textarea
                            onChange={contactForm.handleChange}
                            onBlur={contactForm.handleBlur}
                            value={contactForm.values.message}
                            className="bg-transparent w-full px-0 py-1 pt-0 font-fustat dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none min-h-[100px] resize-y"
                            name="message"
                            id="message"
                            placeholder={block?.queryBoxPlaceholder}
                        />
                        {contactForm.errors.message && contactForm.touched.message ? (
                            <p className="mt-1 text-sm text-[#c00034] font-fustat">{contactForm.errors.message}</p>
                        ) : null}
                    </div>
                </div>

                <Squircle cornerRadius={10}>
                    <button
                        type="submit"
                        className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""} mt-2 w-40 uppercase rounded-lg px-[26px] py-[13px] gradientBG font-fustat text-white transition-colors hover:bg-[#a00029]`}
                    >
                        {block?.submitBtnText}
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

export default ContactUs
