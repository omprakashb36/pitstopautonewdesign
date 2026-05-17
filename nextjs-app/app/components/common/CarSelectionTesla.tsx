"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { X, ArrowLeft, Check } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { Squircle } from "corner-smoothing"
import { getMakeModelList } from "@/app/actions/appointment/makeModelList"
import type { Swiper as SwiperType } from "swiper";
import { createLead } from "@/app/actions/appointment/createLead"
import { createAppointment } from "@/app/actions/appointment/createAppointment"
import type { LeadData, AppointmentData } from "@/app/actions/types"
import { setLeadId, setBookingData } from "../../lib/redux/slices/carSlice"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"
import { RootState } from "@/app/lib/redux/store"
import { sendContactCustomerEmail } from "@/app/services/email/contact";
import { sendCRMCreateAppointemntEmail } from "@/app/services/email/crm";
import { CreateAppointemntProps } from "@/app/types/email";
import { fetchLead } from "@/app/actions/appointment/fetchLead"
import { getWorkshopList } from "@/app/actions/appointment/workshopList"
import type { HomeTesla } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { useTheme } from "next-themes"
import { getTimeSlotsDateRange } from "@/app/actions/appointment/getTimeSlotsDateRange"
import { getTimeSlots } from "@/app/actions/appointment/getTimeSlots"


interface CarSelectionTeslaProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TeslaCarData) => void
  block: HomeTesla
}

interface TeslaCarData {
  countryCode: string
  phoneNumber: string
  model: string
  year: string
  plateNumber: string
  appointment?: {
    location: string
    date: string
    time: string
  }
  personalInfo?: {
    fullName: string
    email: string
    consentToComms: boolean
  }
}

// Workshop location
interface WorkshopLocation {
  id: string
  name: string
}

interface LocationData {
  id: string
  name: string
  [key: string]: any
}

// Time slot
interface TimeSlot {
  time: string
  available: boolean
  availableSlots?: number
  available_agents?: string[]
}

// Date option
interface DateOption {
  date: string // Changed to string to match API date format
  day: string
  month: string
  year: number
  fullDate: Date
  availableSlots?: number
  totalSlots?: number
  isHoliday?: boolean
  timeslots?: any[]
}

const yearOptions = Array.from({ length: 15 }, (_, i) => {
  const year = 2025 - i
  return { value: year.toString(), label: year.toString() }
})

const countryCodes = [{ value: "+971", label: "+971" }]

// Validation schema for Tesla car details
const carValidationSchema = Yup.object({
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{9}$/, "Phone number must be 9 digits"),
  model: Yup.string().required("Model is required"),
  year: Yup.string().required("Year is required"),
  plateNumber: Yup.string()
    /*.matches(/^[A-Za-z]{3}-[A-Za-z]{2}-\d{5}$/, 'Invalid vehicle plate format (e.g., DXB-BB-28705)')*/
    .required("Vehicle plate is required"),
})

// Validation schema for appointment details
const appointmentValidationSchema = Yup.object({
  appointment: Yup.object({
    location: Yup.string().required("Location is required"),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
  }),
})

// Validation schema for personal information
const personalInfoValidationSchema = Yup.object({
  personalInfo: Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email address").required("Email address is required"),
    consentToComms: Yup.boolean().oneOf([true], "You must provide consent to proceed"),
  }),
})

type TeslaAppointmentFormProps = {
  block: HomeTesla
  index: number
}
export default function CarSelectionTesla({ isOpen, onClose, onSubmit, block }: CarSelectionTeslaProps) {
  const [step, setStep] = useState<"car" | "appointment" | "personalInfo">("car")
  const [carData, setCarData] = useState<TeslaCarData | null>(null)
  const [appointmentData, setAppointmentData] = useState<{
    location: string
    date: string
    time: string
  } | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // Changed to string to match API date format
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [models, setModels] = useState<Record<string, { value: string; label: string }[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [workshopLocations, setWorkshopLocations] = useState<WorkshopLocation[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState<{ month: string; year: number } | null>(null)
  const [workshopSelected, setWorkshopSelected] = useState(false)
  const [availableDates, setAvailableDates] = useState<any[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const swiperRef2 = useRef<SwiperType | null>(null)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false)
  const { currentLocale } = useDeviceDetection()
  const [leadResponse, setLeadResponse] = useState<boolean>(false)
  const [salesPerson, setSalesPerson] = useState('')
  const { theme } = useTheme();
  const [leadAppointemntType, setLeadAppointemntType] = useState('')

  const leadId: string = useSelector((state: RootState) => state.carService.leadId)

  const dispatch = useDispatch()

  // Car details form
  const carFormik = useFormik({
    initialValues: {
      countryCode: "+971",
      phoneNumber: "",
      model: "model3",
      year: "2025",
      plateNumber: "",
    },
    validationSchema: carValidationSchema,
    onSubmit: async (values) => {
      setCarData(values)
      setStep("appointment")
    },
  })

  // Appointment form
  const appointmentFormik = useFormik({
    initialValues: {
      appointment: {
        location: "",
        date: "",
        time: "",
      },
    },
    validationSchema: appointmentValidationSchema,
    onSubmit: async (values) => {
      setAppointmentData(values.appointment)
      /*console.log("Appointment Data:", values.appointment)*/
    },
  })

  // Personal information form
  const personalInfoFormik = useFormik({
    initialValues: {
      personalInfo: {
        fullName: "",
        email: "",
        consentToComms: false,
      },
    },
    validationSchema: personalInfoValidationSchema,
    onSubmit: async (values) => {
      if (carData && appointmentData) {
        const combinedData = {
          ...carData,
          appointment: appointmentData,
          personalInfo: values.personalInfo,
        }

        const data: LeadData = {
          lead_name: combinedData?.personalInfo?.fullName || "",
          mobile_no: combinedData?.countryCode + combinedData?.phoneNumber || "",
          email_id: combinedData?.personalInfo?.email || "",
          custom_vehicle_make: block?.brand === 'tesla' ? 'TESLA' : 'LUCID',
          custom_vehicle_model: combinedData?.model || "",
          custom_vehicle_year: combinedData?.year?.toString() || "",
        }
        setLeadData(data)
      }
    },
  })

  // Add this useEffect to fetch the data when the component mounts
  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsLoading(true)
      try {
        const data = await getMakeModelList()
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
                value: item.item_name,
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

  // Fetch workshop locations
  useEffect(() => {
    const fetchWorkshopLocations = async () => {
      try {
        const response = await getWorkshopList()
        if (!response.message) {
          throw new Error("Failed to fetch workshop locations")
        }

        const data = response?.data?.data
        /*console.log("API location:", data)*/

        const allowedLocations = ["Sajja", "Sharjah Industrial Area", "Musaffah", "Al Ain", "Al Quoz 4"]
        const keyword = "AutoWorks"

        const filteredLocations = (data as LocationData[])
          .filter((location: LocationData) => {
            return (
              location.name.includes(keyword) && allowedLocations.some((loc: string) => location.name.includes(loc))
            )
          })
          .map((location: LocationData) => {
            if (location.name.includes("Al Quoz 4")) {
              return {
                ...location,
                name: location.name.replace("Al Quoz 4", "Al Quoz 4 Dubai"),
              }
            }
            return location
          })

        /*console.log("Filtered Workshop locations:", filteredLocations)*/
        setWorkshopLocations(filteredLocations)
      } catch (err) {
        console.error("Error fetching workshop locations:", err)
      }
    }

    fetchWorkshopLocations()
  }, [])
  // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!appointmentFormik.values.appointment?.location) return

      let selectedLocation = appointmentFormik.values.appointment.location

      // Map "Al Quoz 4 dubai" → "Al Quoz 4"
      if (selectedLocation === "Al Quoz 4 Dubai - AutoWorks") {
        selectedLocation = "Al Quoz 4 - AutoWorks"
      }
      setLeadAppointemntType(selectedLocation);

      setIsLoadingDates(true)

      try {
        // Get date range (today + 31 days)
        const today = new Date()
        const fromDate = new Date()
        fromDate.setDate(today.getDate() + 1)
        const toDate = new Date()
        toDate.setDate(today.getDate() + 32)

        // Format helper
        const formatDate = (date: Date) => {
          return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`
        }

        const fromDateFormatted = formatDate(fromDate)
        const toDateFormatted = formatDate(toDate)

        const response = await getTimeSlotsDateRange(fromDateFormatted, toDateFormatted, selectedLocation)
        console.log("Available dates response:", response)

        if (response && response?.data?.message) {
          setAvailableDates(response.data.message)
        } else {
          setAvailableDates([])
        }
      } catch (error) {
        console.error("Error fetching available dates:", error)
        setAvailableDates([])
      } finally {
        setIsLoadingDates(false)
      }
    }

    if (appointmentFormik.values.appointment?.location) {
      fetchAvailableDates()
    }
  }, [appointmentFormik.values.appointment?.location])

  const generateDateOptionsFromAPI = (): DateOption[] => {
    if (!availableDates || availableDates.length === 0) return []

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return availableDates.map((dateData) => {
      const date = new Date(dateData.date)

      return {
        date: dateData.date, // Use API date string instead of day number
        day: days[date.getDay()],
        month: months[date.getMonth()],
        year: date.getFullYear(),
        fullDate: date,
        availableSlots: dateData.available_timeslots,
        totalSlots: dateData.no_of_timeslots,
        isHoliday: dateData.is_holiday,
        timeslots: dateData.timeslots,
      }
    })
  }

  const dateOptions = useMemo(() => generateDateOptionsFromAPI(), [availableDates])

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !appointmentFormik.values.appointment?.location) return

      if (isLoadingTimeSlots) return

      setIsLoadingTimeSlots(true)

      try {
        // Get the selected date object
        const selectedDateObj = dateOptions.find((d) => d.date === selectedDate)
        if (!selectedDateObj) return

        const formattedDate = new Date(selectedDateObj.date)
          .toISOString()
          .split("T")[0];

        const response = await getTimeSlots(formattedDate, leadAppointemntType)
        console.log("Time slots response:", response)

        if (response && response?.data?.message) {
          // Transform API response to our TimeSlot format
          const messageData =
            typeof response.message === "string" && response.message.trim().startsWith("{")
              ? JSON.parse(response.message)
              : response.message
          // console.log("Message data:", messageData)
          const formattedTimeSlots = response?.data?.message?.timeslots.map((slot: any) => {
            // Parse start and end times
            const startTime = new Date(slot.timeslot_start)
            const endTime = new Date(slot.timeslot_end)

            // Format times as HH:MM AM/PM
            const formatTime = (date: Date) => {
              let hours = date.getHours()
              const minutes = date.getMinutes()
              const ampm = hours >= 12 ? "PM" : "AM"
              hours = hours % 12
              hours = hours ? hours : 12 // the hour '0' should be '12'
              const minutesStr = minutes < 10 ? "0" + minutes : minutes
              return `${hours}:${minutesStr} ${ampm}`
            }

            const timeDisplay = `${formatTime(startTime)} - ${formatTime(endTime)}`

            return {
              time: timeDisplay,
              available: slot.available > 0,
              availableSlots: slot.available,
              available_agents: slot.available_agents || [],
            }
          })

          setTimeSlots(formattedTimeSlots)
        } else {
          // If it's a holiday or no slots available
          setTimeSlots([])
        }
      } catch (error) {
        console.error("Error fetching time slots:", error)
        setTimeSlots([])
      } finally {
        setIsLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate, appointmentFormik.values.appointment?.location])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("car")
      setCarData(null)
      setAppointmentData(null)
      setSelectedDate(null)
      setSelectedTime("")
      setWorkshopSelected(false)
      setAvailableDates([]) // Reset available dates

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
    if (step === "appointment") {
      setStep("car")
    } else if (step === "personalInfo") {
      setStep("appointment")
    }
  }

  // Get Tesla models from the fetched data or use default if not available
  const getTeslaModels = () => {
    // Default Tesla models in case the API doesn't return any
    const defaultTeslaModels = [{ value: "Loading...", label: "Loading..." }]

    // Check if we have Tesla models from the API
    if (block?.brand === "tesla") {
      if (models["tesla"] && models["tesla"].length > 0) {
        return models["tesla"]
      }
    } else {
      if (models["lucid"] && models["lucid"].length > 0) {
        return models["lucid"]
      }
    }

    return defaultTeslaModels
  }

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    // Handle date selection with API date format
    setSelectedDate(dateString)
    const selectedDateObj = dateOptions.find((d) => d.date === dateString)
    if (selectedDateObj) {
      appointmentFormik.setFieldValue("appointment.date", selectedDateObj.fullDate.toISOString())
    }
  }

  // Handle time selection
  const handleTimeSelect = (time: string, name: string) => {
    setSelectedTime(time)
    setSalesPerson(name)
    console.log(name)
    appointmentFormik.setFieldValue("appointment.time", time)
  }

  const handleSubmitAppointment = () => {
    console.log("Appointment Data click:", appointmentFormik.values.appointment)
    setStep("personalInfo")
  }

  // Handle workshop location change
  const handleWorkshopChange = (locationId: string) => {
    appointmentFormik.setFieldValue("appointment.location", locationId)
    setWorkshopSelected(true)
    setSelectedDate(null) // Reset selected date when workshop changes
    setTimeSlots([]) // Reset time slots when workshop changes
  }

  /*  generate lead id */
  useEffect(() => {
    const fetchLeadId = async () => {
      try {
        setFinalSubmitLoader(true)
        // Format the selected date for the lead data
        const selectedDateObj = dateOptions.find((d) => d.date === selectedDate)
        if (selectedDateObj) {
          // Prepare lead data
          // Call createLead API
          if (leadData) {
            const response = await fetchLead(
              (carData?.countryCode || "+971") + carData?.phoneNumber,
              personalInfoFormik?.values?.personalInfo?.email,
            )
            console.log("fetchLead response: ", response)
            if (response?.status && response?.data?.data && response?.data?.data.length > 0) {
              console.log(response?.data.data[0])
              dispatch(setLeadId(response?.data.data[0]?.name))
              setLeadResponse(true)
            } else {
              const response = await createLead(leadData)
              console.log(response)
              if (response.status) {
                dispatch(setLeadId(response?.data?.data?.name))
                setLeadResponse(true)
              } else {
                toast.error(response.message)
              }
            }
          } else {
            console.error("Lead data is null and cannot be submitted.")
          }
        }
      } catch (error) {
        console.error("Error creating lead:", error)
        toast.error(String(error))
      } finally {
        setFinalSubmitLoader(false)
      }
    }

    if (selectedDate && selectedTime) {
      fetchLeadId()
    }
  }, [leadData])

  const selectedDateObj = dateOptions.find((d) => d.date === selectedDate)
  /*  final submit form */
  useEffect(() => {
    const fetchCreateAppointment = async () => {
      try {
        if (selectedDateObj) {
          setFinalSubmitLoader(true)
          const date = new Date(selectedDateObj.fullDate)
          const formattedDate = date.toISOString().split("T")[0] //

          const startTimeStr = selectedTime ? selectedTime.split(" - ")[0] : ""

          const dateObj = new Date(`1970-01-01T${new Date(`1970-01-01 ${startTimeStr}`).toTimeString().slice(0, 8)}Z`)
          const formattedTime = dateObj.toISOString().substr(11, 8)

          // Call createAppointment API
          if (leadData && leadResponse) {
            const appointmentData: AppointmentData = {
              appointment_type: leadAppointemntType,
              scheduled_date: formattedDate,
              scheduled_time: formattedTime,
              party_name: leadId,
              applies_to_item: leadData.custom_vehicle_model,
              vehicle_license_plate: carData?.plateNumber || "",
              sales_person: salesPerson,
            }
            const response = await createAppointment(appointmentData)
            if (!response.status) {
              toast.error(response.message)
            } else {
              await sendContactCustomerEmail(
                appointmentData as AppointmentData,
                personalInfoFormik.values.personalInfo.fullName,
                personalInfoFormik.values.personalInfo.email,
                currentLocale,
                "createAppointement",
              )
              const crmEmailProps: CreateAppointemntProps = {
                email: personalInfoFormik.values.personalInfo.email,
                fname: personalInfoFormik.values.personalInfo.fullName.split(" ")[0] || "",
                lname: personalInfoFormik.values.personalInfo.fullName.split(" ")[1] || "",
              }
              const pageUrl = window.location.href
              await sendCRMCreateAppointemntEmail(crmEmailProps, currentLocale, "Create Appointement Form", pageUrl)
              dispatch(setBookingData(response?.data?.data))
              /*toast.success("Appointment created successfully");*/
              window.location.href = `/${currentLocale}/appointment-confirmation-tesla`
            }
          } else {
            console.error("Appointment is null and cannot be submitted.")
          }
        }
      } catch (error) {
        console.error("Error creating Appointment:", error)
        toast.error(String(error))
      } finally {
        setFinalSubmitLoader(false)
      }
    }
    if (leadResponse) {
      fetchCreateAppointment()
    }
  }, [leadResponse, leadData])

  /*console.log("car tesla ", block);*/

  if (!isOpen) return null

  return (
    <Squircle
      cornerRadius={40}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative carTeslaPopup max-h-[90vh] min-h-[500px] overflow-y-auto custom-scrollbar w-full max-w-[1130px] rounded-[30px] dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 2xl:p-[48px] md:p-12 ltr:md:pr-0 rtl:md:pl-0 my-4 mx-4">
        <button
          onClick={onClose}
          className="absolute z-10 ltr:2xl:right-[48px] rtl:2xl:left-[48px] ltr:right-8 rtl:left-8 2xl:top-[48px] top-8 dark:text-white text-black hover:text-gray-300"
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
            <div className="flex flex-col md:min-w-[560px] gap-6">
              <h2 className="font-shoulders text-3xl md:text-4xl">
                <span className="dark:text-white text-black uppercase">{block?.teslaForm?.whiteHeading}</span>{" "}
                <span className="text-[#c00034] uppercase">{block?.teslaForm?.redHeading}</span>
              </h2>

              <form autoComplete="off" onSubmit={carFormik.handleSubmit} className="space-y-6">
                <div className="md:grid md:grid-cols-3 gap-4">
                  <div className="formLabel selectReact border dark:border-white/20 border-black/20  rounded-[15px] md:mb-0 mb-5 space-y-2">
                    <label htmlFor="countryCode" className="block font-urbanist text-xs uppercase sandDrift">
                      {block?.teslaForm?.stepOne?.countryLabel}
                    </label>
                    <Select
                      id="countryCode"
                      name="countryCode"
                      options={countryCodes}
                      value={countryCodes.find((option) => option.value === carFormik.values.countryCode) || null}
                      onChange={(option) => carFormik.setFieldValue("countryCode", option?.value || "")}
                      onBlur={carFormik.handleBlur}
                      placeholder="Select"
                      // styles={customStyles}
                      styles={selectStyles}
                      classNames={selectClassNames}
                      className="font-urbanist"
                    />
                    {carFormik.errors.countryCode && carFormik.touched.countryCode && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.countryCode}</div>
                    )}
                  </div>

                  <div className="formLabel col-span-2 border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                    <label htmlFor="phoneNumber" className="block font-urbanist text-xs uppercase sandDrift">
                      {block?.teslaForm?.stepOne?.phoneLabel || "Phone Number"}
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder={block?.teslaForm?.stepOne?.phonePlaceholder || "Enter your phone number"}
                      value={carFormik.values.phoneNumber}
                      onChange={carFormik.handleChange}
                      onBlur={carFormik.handleBlur}
                      className={`w-full rounded-lg border ${carFormik.errors.phoneNumber && carFormik.touched.phoneNumber
                        ? "border-[#c00034]"
                        : "border-white/20 focus:border-white/40"
                        } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                    />
                    {carFormik.errors.phoneNumber && carFormik.touched.phoneNumber && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.phoneNumber}</div>
                    )}
                  </div>
                </div>

                <div className="formLabel selectReact border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="model" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepOne?.modelLabel || "Select Your Tesla Model"}
                  </label>
                  <Select
                    id="model"
                    name="model"
                    options={getTeslaModels()}
                    value={getTeslaModels().find((option) => option.value === carFormik.values.model) || null}
                    onChange={(option) => carFormik.setFieldValue("model", option?.value || "")}
                    onBlur={carFormik.handleBlur}
                    placeholder={
                      isLoading ? "Loading models..." : block?.teslaForm?.stepOne?.modelPlaceholder || "Select"
                    }
                    isLoading={isLoading}
                    // styles={customStyles}
                    styles={selectStyles}
                    classNames={selectClassNames}
                    className="font-urbanist"
                  />
                  {carFormik.errors.model && carFormik.touched.model && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.model}</div>
                  )}
                </div>

                <div className="formLabel selectReact border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="year" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepOne?.yearLabel || "Select Your Tesla Year"}
                  </label>
                  <Select
                    id="year"
                    name="year"
                    options={yearOptions}
                    value={yearOptions.find((option) => option.value === carFormik.values.year) || null}
                    onChange={(option) => carFormik.setFieldValue("year", option?.value || "")}
                    onBlur={carFormik.handleBlur}
                    placeholder={block?.teslaForm?.stepOne?.yearPlaceholder || "Select"}
                    // styles={customStyles}
                    styles={selectStyles}
                    classNames={selectClassNames}
                    isSearchable={false}
                    className="font-urbanist"
                  />
                  {carFormik.errors.year && carFormik.touched.year && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">{carFormik.errors.year}</div>
                  )}
                </div>

                <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="plateNumber" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepOne?.plateNumberLabel || "Vehicle Plate Number"}
                  </label>
                  <input
                    id="plateNumber"
                    name="plateNumber"
                    type="text"
                    placeholder={block?.teslaForm?.stepOne?.plateNumberPlaceholder || "DXB - BB - 28705"}
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
                    {block?.teslaForm?.stepOne?.proceed}
                  </button>
                </Squircle>
              </form>
            </div>

            <div className="ltr:pl-8 rtl:pr-8 hidden md:flex flex-col items-end justify-between">
              <div className="relative h-full w-full">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaImage?.image)?.url() || ""}
                  alt="Tesla Model 3"
                  width={600}
                  height={400}
                  className="absolute bottom-0 ltr:right-0 rtl:left-0 rtl:scale-x-[-1]  h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-auto ltr:mr-5 rtl:ml-5 mb-2">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaLogo?.image)?.url() || ""}
                  alt="Tesla Logo"
                  width={120}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {step === "appointment" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-6 md:min-w-[560px]">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="ltr:mr-4 rtl:ml-4 dark:text-white text-black hover:text-gray-300"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="font-shoulders text-3xl md:text-4xl">
                  <span className="dark:text-white text-black uppercase">{block?.teslaForm?.whiteHeading}</span>{" "}
                  <span className="text-[#c00034] uppercase">{block?.teslaForm?.redHeading}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={appointmentFormik.handleSubmit} className="space-y-6 min-h-[400px]">
                <div className="formLabel selectReact border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="location" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepTwo?.workshopLabel || "Select Workshop Location"}
                  </label>
                  <Select
                    id="location"
                    name="appointment.location"
                    options={
                      workshopLocations &&
                      workshopLocations.map((location) => ({
                        value: location.name,
                        label: location.name,
                      }))
                    }
                    value={
                      appointmentFormik.values.appointment.location
                        ? {
                          value: appointmentFormik.values.appointment.location,
                          label: appointmentFormik.values.appointment.location,
                        }
                        : null
                    }
                    onChange={(option) => handleWorkshopChange(option?.value || "")}
                    onBlur={appointmentFormik.handleBlur}
                    placeholder={block?.teslaForm?.stepTwo?.workshopPlaceholder || "Select Workshop Location"}
                    // styles={customStyles}
                    styles={selectStyles}
                    classNames={selectClassNames}
                    className="font-urbanist"
                  />
                  {appointmentFormik.errors.appointment?.location &&
                    appointmentFormik.touched.appointment?.location && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">
                        {appointmentFormik.errors.appointment.location}
                      </div>
                    )}
                </div>

                {workshopSelected && isLoadingDates && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c00034]"></div>
                  </div>
                )}

                {/* Date Selection - Only show when workshop is selected and dates are loaded */}
                {workshopSelected && !isLoadingDates && dateOptions.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-center text-sm uppercase w-full dark:text-[#FAEADC] text-black">
                        {selectedDate && dateOptions.find((d) => d.date === selectedDate)
                          ? `${dateOptions.find((d) => d.date === selectedDate)?.month} ${dateOptions.find((d) => d.date === selectedDate)?.year}`
                          : visibleMonth
                            ? `${visibleMonth.month.toUpperCase()} ${visibleMonth.year}`
                            : ""}
                      </div>
                    </div>
                    <div className="relative dateSwiperContainer">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={6}
                        slidesPerView="auto"
                        navigation={{
                          prevEl: ".swiper-button-prev",
                          nextEl: ".swiper-button-next",
                        }}
                        className="dateSwiper"
                        onSlideChange={(swiper) => {
                          const currentIndex = swiper.activeIndex
                          const currentDateOption = dateOptions[currentIndex]
                          if (currentDateOption) {
                            if (
                              !visibleMonth ||
                              visibleMonth.month !== currentDateOption.month ||
                              visibleMonth.year !== currentDateOption.year
                            ) {
                              setVisibleMonth({
                                month: currentDateOption.month,
                                year: currentDateOption.year,
                              })
                            }
                          }
                        }}
                        onInit={(swiper) => {
                          if (dateOptions.length > 0) {
                            setVisibleMonth({
                              month: dateOptions[0].month,
                              year: dateOptions[0].year,
                            })
                          }
                        }}
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper
                        }}
                        breakpoints={{
                          320: {
                            slidesPerView: 3,
                            spaceBetween: 8,
                          },
                          480: {
                            slidesPerView: 4,
                            spaceBetween: 8,
                          },
                          640: {
                            slidesPerView: 5,
                            spaceBetween: 8,
                          },
                          768: {
                            slidesPerView: 8,
                            spaceBetween: 8,
                          },
                          1024: {
                            slidesPerView: 6,
                            spaceBetween: 7,
                          },
                        }}
                      >
                        {dateOptions.map((dateOption) => {
                          const dayNumber = new Date(dateOption.date).getDate()
                          return (
                            <SwiperSlide key={dateOption.date} className="!w-auto px-2">
                              <button
                                disabled={dateOption?.isHoliday}
                                onClick={() => handleDateSelect(dateOption.date)}
                                className={`${dateOption?.isHoliday ? ' bg-gray-300 opacity-40' : ''} flex flex-col items-center leading-[1] justify-center py-3 px-4 rounded-lg ${selectedDate === dateOption.date
                                  ? "bg-[#c00034] text-white font-semibold"
                                  : "bg-black/60 text-white hover:bg-[#c00034]/20"
                                  }`}
                              >
                                <span className="text-[2.1rem] font-shoulders font-light">{dayNumber}</span>
                                <span className="text-xs">{dateOption.day}</span>
                                <span className="text-[10px] opacity-75 min-h-[10px]">{`${dateOption?.isHoliday ? '' : dateOption.availableSlots + ' slots'}`}</span>
                              </button>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>

                      {/* Custom navigation buttons */}
                      <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-0 top-[30%] z-10 flex items-center justify-center w-8 h-8 bg-black/60 rounded-full cursor-pointer"
                        aria-label="Previous models"
                      >
                        <Image src="/images/angle-left.svg" alt="back icon" width={16} height={16} className="mb-0" />
                      </button>

                      <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-0 top-[30%] z-10 flex items-center justify-center w-8 h-8 bg-black/60 rounded-full cursor-pointer"
                        aria-label="Next models"
                      >
                        <Image src="/images/angle-right.svg" alt="back icon" width={16} height={16} className="mb-0" />
                      </button>
                    </div>
                  </div>
                )}

                {workshopSelected && !isLoadingDates && dateOptions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="dark:text-[#FAEADC] text-black">No available dates for this location.</p>
                  </div>
                )}

                {/* Time Selection - Only show when date is selected */}
                {selectedDate && (
                  <>
                    {isLoadingTimeSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c00034]"></div>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="mt-8">
                        <h3 className="font-shoulders hidden text-xl darK:text-white text-black mb-4">
                          SELECT TIME SLOT
                        </h3>
                        <div className="relative dateSwiperContainer">
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={8}
                            slidesPerView={2}
                            navigation={{
                              prevEl: ".swiper-time-prev",
                              nextEl: ".swiper-time-next",
                            }}
                            className="dateSwiper"
                            onSwiper={(swiper) => {
                              swiperRef2.current = swiper
                            }}
                            breakpoints={{
                              640: {
                                slidesPerView: 3,
                              },
                              768: {
                                slidesPerView: 3,
                                spaceBetween: 14,
                              },
                            }}
                          >
                            {timeSlots.map((slot, index) => (
                              <SwiperSlide key={`${slot.time}-${index}`} className="!w-auto">
                                <button
                                  onClick={() =>
                                    handleTimeSelect(
                                      slot.time,
                                      Array.isArray(slot.available_agents) ? slot.available_agents[0] : "",
                                    )
                                  }
                                  disabled={!slot.available}
                                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg border ${selectedTime === slot.time
                                    ? "border-[#c00034] bg-[#c00034]/10 dark:text-white text-black"
                                    : slot.available
                                      ? "border-gray-700 dark:text-white text-black hover:bg-gray-800 hover:text-white dark:hover:black"
                                      : "border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
                                    }`}
                                >
                                  <span className="text-[20px] font-shoulders">{slot.time}</span>
                                  <span className="font-urbanist text-xs text-gray-400">
                                    {slot.available ? `available - ${slot.availableSlots}` : "unavailable"}
                                  </span>
                                </button>
                              </SwiperSlide>
                            ))}
                          </Swiper>

                          {/* Custom navigation buttons */}
                          <button
                            onClick={() => swiperRef2.current?.slidePrev()}
                            className="absolute left-0 top-[30%] z-10 flex items-center justify-center w-8 h-8 bg-black/60 rounded-full cursor-pointer"
                            aria-label="Previous models"
                          >
                            <Image
                              src="/images/angle-left.svg"
                              alt="back icon"
                              width={16}
                              height={16}
                              className="mb-0"
                            />
                          </button>

                          <button
                            onClick={() => swiperRef2.current?.slideNext()}
                            className="absolute right-0 top-[30%] z-10 flex items-center justify-center w-8 h-8 bg-black/60 rounded-full cursor-pointer"
                            aria-label="Next models"
                          >
                            <Image
                              src="/images/angle-right.svg"
                              alt="back icon"
                              width={16}
                              height={16}
                              className="mb-0"
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="dark:text-[#FAEADC] text-black">No time slots available for this date.</p>
                      </div>
                    )}
                  </>
                )}

                {/* Continue Button */}
                <Squircle cornerRadius={10}>
                  <button
                    type="button"
                    onClick={handleSubmitAppointment}
                    disabled={!selectedTime}
                    className={`mt-2 uppercase px-[26.66px] gradientBG py-[13.33px] text-[11.66px] leading-[1] font-bold rounded-lg font-urbanist transition-colors
                    ${selectedTime ? "text-white gradientBG hover:bg-[#a00029]" : " text-[#FAEADC]/50 cursor-not-allowed"}`}
                  >
                    {block?.teslaForm?.stepTwo?.selectAndProceed}
                  </button>
                </Squircle>
              </form>
            </div>

            <div className="hidden md:flex flex-col items-end justify-between">
              <div className="relative h-full w-full">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaImage?.image)?.url() || ""}
                  alt="Tesla Model 3"
                  width={600}
                  height={400}
                  className="absolute bottom-0 ltr:right-0 rtl:scale-x-[-1] md:min-h-[350px]  rtl:left-0 h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-auto">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaLogo?.image)?.url() || ""}
                  alt="Tesla Logo"
                  width={120}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {step === "personalInfo" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <button onClick={handleBack} className="ltr:mr-4 rtl:ml-4" aria-label="Back">
                  <Image
                    src={theme === "light" ? "/images/lightthemeArrow.svg" : "/images/backIcon.svg"}
                    alt="back icon"
                    width={17}
                    height={23}
                    className="mb-0"
                  />
                </button>
                <h2 className="font-shoulders text-3xl md:text-4xl">
                  <span className="dark:text-white text-black uppercase">{block?.teslaForm?.whiteHeading}</span>{" "}
                  <span className="text-[#c00034] uppercase">{block?.teslaForm?.redHeading}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={personalInfoFormik.handleSubmit} className="space-y-6">
                <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="fullName" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepThree?.fullNameLabel || "YOUR FULL NAME"}
                  </label>
                  <input
                    id="fullName"
                    name="personalInfo.fullName"
                    type="text"
                    placeholder={block?.teslaForm?.stepThree?.fullNamePlaceholder || "Enter your full name"}
                    value={personalInfoFormik.values.personalInfo.fullName}
                    onChange={personalInfoFormik.handleChange}
                    onBlur={personalInfoFormik.handleBlur}
                    className={`w-full rounded-lg border ${personalInfoFormik.errors.personalInfo?.fullName &&
                      personalInfoFormik.touched.personalInfo?.fullName
                      ? "border-[#c00034]"
                      : "border-white/20 focus:border-white/40"
                      } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                  />
                  {personalInfoFormik.errors.personalInfo?.fullName &&
                    personalInfoFormik.touched.personalInfo?.fullName && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">
                        {personalInfoFormik.errors.personalInfo.fullName}
                      </div>
                    )}
                </div>

                <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2">
                  <label htmlFor="email" className="block font-urbanist text-xs uppercase sandDrift">
                    {block?.teslaForm?.stepThree?.emailLabel || "YOUR EMAIL ADDRESS"}
                  </label>
                  <input
                    id="email"
                    name="personalInfo.email"
                    type="email"
                    placeholder={block?.teslaForm?.stepThree?.emailPlaceholder || "Enter your email address"}
                    value={personalInfoFormik.values.personalInfo.email}
                    onChange={personalInfoFormik.handleChange}
                    onBlur={personalInfoFormik.handleBlur}
                    className={`w-full rounded-lg border ${personalInfoFormik.errors.personalInfo?.email && personalInfoFormik.touched.personalInfo?.email
                      ? "border-[#c00034]"
                      : "border-white/20 focus:border-white/40"
                      } bg-transparent px-4 py-3 font-urbanist dark:text-white text-black placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none`}
                  />
                  {personalInfoFormik.errors.personalInfo?.email && personalInfoFormik.touched.personalInfo?.email && (
                    <div className="mt-1 text-sm text-[#c00034] font-urbanist">
                      {personalInfoFormik.errors.personalInfo.email}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <label className="flex items-start cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="personalInfo.consentToComms"
                        checked={personalInfoFormik.values.personalInfo.consentToComms}
                        onChange={personalInfoFormik.handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded border ${personalInfoFormik.values.personalInfo.consentToComms
                          ? "border-[#c00034]  bg-[#c00034]"
                          : "dark:border-white/20 border-black/20"
                          }`}
                      >
                        {personalInfoFormik.values.personalInfo.consentToComms && (
                          <Check className="h-4 w-4 dark:text-white text-black " />
                        )}
                      </div>
                    </div>
                    <span className="ltr:ml-3 rtl:mr-3 text-sm dark:text-white/80 text-black/80 font-urbanist">
                      {block?.teslaForm?.stepThree?.declaration}
                    </span>
                  </label>
                  {personalInfoFormik.errors.personalInfo?.consentToComms &&
                    personalInfoFormik.touched.personalInfo?.consentToComms && (
                      <div className="mt-1 text-sm text-[#c00034] font-urbanist">
                        {personalInfoFormik.errors.personalInfo.consentToComms}
                      </div>
                    )}
                </div>
                <Squircle cornerRadius={10}>
                  <button
                    type="submit"
                    className={`${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""} mt-2 px-[26.66px] py-[13.33px] leading-[1] gradientBG rounded-lg font-urbanist text-white transition-colors bg-[#c00034] hover:bg-[#a00029]`}
                  >
                    {block?.teslaForm?.stepThree?.scheduleAppointment}
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

            <div className="hidden md:flex flex-col items-end justify-between">
              <div className="relative h-full w-full">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaImage?.image)?.url() || ""}
                  alt="Tesla Model 3"
                  width={600}
                  height={400}
                  className="absolute bottom-0 ltr:right-0 rtl:left-0 rtl:scale-x-[-1] h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-auto">
                <Image
                  src={urlForImage(block?.teslaForm?.teslaLogo?.image)?.url() || ""}
                  alt="Tesla Logo"
                  width={120}
                  height={50}
                  className="h-12 w-auto object-contain ltr:mr-12 rtl:ml-12"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .swiper-button-prev::after,
        .swiper-button-next::after,
        .swiper-time-prev::after,
        .swiper-time-next::after {
          display: none;
        }
        
        .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </Squircle>
  )
}
