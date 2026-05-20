"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { X, ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Button } from "../ui/Button"



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
      <div className="relative carTeslaPopup max-h-[90vh] min-h-[500px] overflow-y-auto custom-scrollbar w-full max-w-[1200px] 3xl:max-w-[1360px] rounded-3xl  2xl:rounded-[60px] dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 md:p-[60px] 3xl:p-[80px] ltr:md:pr-0 rtl:md:pl-0 my-4 mx-4">
        <button
          onClick={onClose}
          className="absolute z-10 ltr:2xl:right-[48px] rtl:2xl:left-[48px] ltr:3xl:right-[80px] rtl:3xl:left-[80px] ltr:right-8 rtl:left-8 2xl:top-[48px] 3xl:top-[80px] top-8 dark:text-white text-black hover:text-gray-300"
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
              <h2 className="dark:text-white text-black font-host font-extrabold leading-[1.1]">
                <span>{block?.teslaForm?.whiteHeading}</span>{" "}
                <span className="text-[#FF3300]">{block?.teslaForm?.redHeading}</span>
              </h2>

              <form autoComplete="off" onSubmit={carFormik.handleSubmit} className="space-y-6">
                {/* Phone row with Country code integrated */}
                <div className={`border rounded-[20px] h-[90px] flex items-center w-full overflow-hidden transition-colors ${
                  carFormik.errors.phoneNumber && carFormik.touched.phoneNumber
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  {/* Country Code Selection */}
                  <div className="w-[124px] h-full flex flex-col justify-center px-[24px] pr-[15px] relative border-r border-[#D9D9D9] dark:border-white/20 selectReact no-border">
                    <label htmlFor="countryCode" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-white text-black">
                      {block?.teslaForm?.stepOne?.countryLabel || "COUNTRY"}
                    </label>
                    <Select
                      id="countryCode"
                      name="countryCode"
                      options={countryCodes}
                      value={countryCodes.find((option) => option.value === carFormik.values.countryCode) || null}
                      onChange={(option) => carFormik.setFieldValue("countryCode", option?.value || "")}
                      onBlur={carFormik.handleBlur}
                      placeholder="Select"
                      styles={selectStyles}
                      classNames={selectClassNames}
                      className="font-host text-[16px] md:text-[20px]"
                    />
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1 h-full flex flex-col justify-center px-[24px] selectReact">
                    <label htmlFor="phoneNumber" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-white text-black">
                      {block?.teslaForm?.stepOne?.phoneLabel || "PHONE NUMBER"}
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder={block?.teslaForm?.stepOne?.phonePlaceholder || "Enter your phone number"}
                      value={carFormik.values.phoneNumber}
                      onChange={carFormik.handleChange}
                      onBlur={carFormik.handleBlur}
                      className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                    />
                    {carFormik.errors.phoneNumber && carFormik.touched.phoneNumber && (
                      <div className="text-xs text-[#FF3300] font-host mt-0.5 leading-none">
                        {carFormik.errors.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Row */}
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                  carFormik.errors.model && carFormik.touched.model
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="model" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {block?.teslaForm?.stepOne?.modelLabel || "SELECT YOUR TESLA MODEL"}
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
                    styles={selectStyles}
                    classNames={selectClassNames}
                    className="font-host text-[16px] md:text-[20px]"
                  />
                  {carFormik.errors.model && carFormik.touched.model && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
                      {carFormik.errors.model}
                    </div>
                  )}
                </div>

                {/* Year Row */}
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                  carFormik.errors.year && carFormik.touched.year
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="year" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {block?.teslaForm?.stepOne?.yearLabel || "SELECT YOUR TESLA YEAR"}
                  </label>
                  <Select
                    id="year"
                    name="year"
                    options={yearOptions}
                    value={yearOptions.find((option) => option.value === carFormik.values.year) || null}
                    onChange={(option) => carFormik.setFieldValue("year", option?.value || "")}
                    onBlur={carFormik.handleBlur}
                    placeholder={block?.teslaForm?.stepOne?.yearPlaceholder || "Select"}
                    styles={selectStyles}
                    classNames={selectClassNames}
                    isSearchable={false}
                    className="font-host text-[16px] md:text-[20px]"
                  />
                  {carFormik.errors.year && carFormik.touched.year && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
                      {carFormik.errors.year}
                    </div>
                  )}
                </div>

                {/* Vehicle Plate Row */}
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  carFormik.errors.plateNumber && carFormik.touched.plateNumber
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="plateNumber" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
                    {block?.teslaForm?.stepOne?.plateNumberLabel || "VEHICLE PLATE NUMBER"}
                  </label>
                  <input
                    id="plateNumber"
                    name="plateNumber"
                    type="text"
                    placeholder={block?.teslaForm?.stepOne?.plateNumberPlaceholder || "DXB - BB - 28705"}
                    value={carFormik.values.plateNumber}
                    onChange={carFormik.handleChange}
                    onBlur={carFormik.handleBlur}
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {carFormik.errors.plateNumber && carFormik.touched.plateNumber && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
                      {carFormik.errors.plateNumber}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="orange"
                  className="w-fit mt-4"
                >
                  {block?.teslaForm?.stepOne?.proceed}
                </Button>
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
                  className="ltr:mr-4 rtl:ml-4"
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
                <h2 className="dark:text-white text-black font-host font-extrabold leading-[1.1]">
                  <span>{block?.teslaForm?.whiteHeading}</span>{" "}
                  <span className="text-[#FF3300]">{block?.teslaForm?.redHeading}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={appointmentFormik.handleSubmit} className="flex flex-col gap-[40px] items-start w-full max-w-[670px] min-h-[400px]">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${
                    appointmentFormik.errors.appointment?.location && appointmentFormik.touched.appointment?.location
                      ? "border-[#FF3300]"
                      : "border-[#D9D9D9] dark:border-white/20"
                  }`}>
                    <label htmlFor="location" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
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
                      styles={selectStyles}
                      classNames={selectClassNames}
                      className="font-host text-[16px] md:text-[20px]"
                    />
                    {appointmentFormik.errors.appointment?.location &&
                      appointmentFormik.touched.appointment?.location && (
                        <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
                          {appointmentFormik.errors.appointment.location}
                        </div>
                      )}
                  </div>

                  {workshopSelected && isLoadingDates && (
                    <div className="flex justify-center py-8 w-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3300]"></div>
                    </div>
                  )}

                  {/* Date Selection - Only show when workshop is selected and dates are loaded */}
                  {workshopSelected && !isLoadingDates && dateOptions.length > 0 && (
                    <div className="flex items-center gap-[40px] w-full relative px-[12px]">
                      {/* Left navigation button */}
                      <button
                        type="button"
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="flex items-center justify-center text-black/60 dark:text-white/60 hover:text-[#FF3300] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        aria-label="Previous dates"
                      >
                        <ChevronLeft className="h-[20px] w-[20px]" />
                      </button>

                      {/* Swiper */}
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={7}
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
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper
                        }}
                        className="dateSwiper flex-grow max-w-[480px]"
                        breakpoints={{
                          320: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                          },
                          480: {
                            slidesPerView: 4,
                            spaceBetween: 12,
                          },
                          640: {
                            slidesPerView: 5,
                            spaceBetween: 14,
                          },
                          768: {
                            slidesPerView: 7,
                            spaceBetween: 16,
                          },
                        }}
                      >
                        {dateOptions.map((dateOption) => {
                          const dayNumber = new Date(dateOption.date).getDate()
                          const isSelected = selectedDate === dateOption.date
                          return (
                            <SwiperSlide key={dateOption.date} className="!w-auto">
                              <button
                                type="button"
                                disabled={dateOption?.isHoliday}
                                onClick={() => handleDateSelect(dateOption.date)}
                                className={`flex flex-col items-center justify-center w-[66px] h-[57px] transition-all duration-200 ${
                                  dateOption?.isHoliday 
                                    ? 'opacity-30 cursor-not-allowed text-[#211D1D] dark:text-white/60' 
                                    : isSelected
                                      ? "bg-[#FF3300] text-white rounded-[12px] shadow-sm"
                                      : "text-[#211D1D] dark:text-white/90 hover:bg-[#FF3300]/10 rounded-[12px]"
                                }`}
                              >
                                <span className={`text-[24px] font-host leading-[1.2] ${isSelected ? "font-bold" : "font-normal"}`}>
                                  {dayNumber}
                                </span>
                                <span className={`text-[14px] font-host leading-[1.2] ${isSelected ? "font-normal" : "font-normal opacity-50"}`}>
                                  {dateOption.day.toLowerCase()}
                                </span>
                              </button>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>

                      {/* Right navigation button */}
                      <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        className="flex items-center justify-center text-black/60 dark:text-white/60 hover:text-[#FF3300] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        aria-label="Next dates"
                      >
                        <ChevronRight className="h-[20px] w-[20px]" />
                      </button>
                    </div>
                  )}

                  {workshopSelected && !isLoadingDates && dateOptions.length === 0 && (
                    <div className="text-center py-4 w-full">
                      <p className="dark:text-[#FAEADC] text-black">No available dates for this location.</p>
                    </div>
                  )}
                </div>

                {/* Divider & Month Pill - Only show when date is selected */}
                {selectedDate && (
                  <div className="relative flex items-center justify-center w-full max-w-[558px] mx-auto shrink-0 my-2">
                    <div className="w-full border-t border-[#D9D9D9] dark:border-white/20"></div>
                    <div className="absolute bg-[#211D1D] dark:bg-white text-[#FCF3ED] dark:text-[#211D1D] px-[12px] py-[8px] rounded-[8px] text-[12px] font-bold font-host uppercase tracking-wider">
                      {selectedDate && dateOptions.find((d) => d.date === selectedDate)
                        ? `${dateOptions.find((d) => d.date === selectedDate)?.month} ${dateOptions.find((d) => d.date === selectedDate)?.year}`
                        : visibleMonth
                          ? `${visibleMonth.month} ${visibleMonth.year}`
                          : ""}
                    </div>
                  </div>
                )}

                {/* Time Selection - Only show when date is selected */}
                {selectedDate && (
                  <div className="w-full">
                    {isLoadingTimeSlots ? (
                      <div className="flex justify-center py-8 w-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3300]"></div>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="flex items-center gap-[40px] w-full relative px-[12px]">
                        {/* Left navigation button */}
                        <button
                          type="button"
                          onClick={() => swiperRef2.current?.slidePrev()}
                          className="flex items-center justify-center text-black/60 dark:text-white/60 hover:text-[#FF3300] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                          aria-label="Previous times"
                        >
                          <ChevronLeft className="h-[20px] w-[20px]" />
                        </button>

                        {/* Swiper */}
                        <Swiper
                          modules={[Navigation]}
                          spaceBetween={16}
                          slidesPerView={5}
                          onSwiper={(swiper) => {
                            swiperRef2.current = swiper
                          }}
                          className="timeSwiper flex-grow max-w-[558px]"
                          breakpoints={{
                            320: {
                              slidesPerView: 2,
                              spaceBetween: 10,
                            },
                            480: {
                              slidesPerView: 3,
                              spaceBetween: 12,
                            },
                            640: {
                              slidesPerView: 4,
                              spaceBetween: 14,
                            },
                            768: {
                              slidesPerView: 5,
                              spaceBetween: 16,
                            },
                          }}
                        >
                          {timeSlots.map((slot, index) => {
                            const isSelected = selectedTime === slot.time;
                            const timeDisplay = slot.time.split(" - ")[0].replace(":", ".");
                            return (
                              <SwiperSlide key={`${slot.time}-${index}`} className="!w-auto">
                                <button
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() =>
                                    handleTimeSelect(
                                      slot.time,
                                      Array.isArray(slot.available_agents) ? slot.available_agents[0] : "",
                                    )
                                  }
                                  className={`flex flex-col items-center justify-center w-[98px] h-[58px] rounded-[12px] border transition-all duration-200 ${
                                    isSelected
                                      ? "border-[#FF3300] bg-[#FF3300]/9 text-[#FF3300]"
                                      : slot.available
                                        ? "border-[#D9D9D9] dark:border-white/20 text-[#211D1D] dark:text-white/90 hover:border-[#FF3300] hover:bg-[#FF3300]/5"
                                        : "border-gray-200 dark:border-neutral-800 text-gray-400 dark:text-neutral-600 opacity-40 cursor-not-allowed"
                                  }`}
                                >
                                  <span className={`text-[16px] font-host leading-[1.2] ${isSelected ? "font-bold" : "font-normal"}`}>
                                    {timeDisplay}
                                  </span>
                                  <span className="text-[12px] font-host leading-[1.2] opacity-80 mt-0.5">
                                    {slot.available ? "available" : "unavailable"}
                                  </span>
                                </button>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>

                        {/* Right navigation button */}
                        <button
                          type="button"
                          onClick={() => swiperRef2.current?.slideNext()}
                          className="flex items-center justify-center text-black/60 dark:text-white/60 hover:text-[#FF3300] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                          aria-label="Next times"
                        >
                          <ChevronRight className="h-[20px] w-[20px]" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 w-full">
                        <p className="dark:text-[#FAEADC] text-black">No time slots available for this date.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  type="button"
                  variant={selectedTime ? "orange" : "disabled"}
                  onClick={handleSubmitAppointment}
                  disabled={!selectedTime}
                  className="w-fit mt-0"
                >
                  {block?.teslaForm?.stepTwo?.selectAndProceed}
                </Button>
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
                <h2 className="dark:text-white text-black font-host font-extrabold leading-[1.1]">
                  <span>{block?.teslaForm?.whiteHeading}</span>{" "}
                  <span className="text-[#FF3300]">{block?.teslaForm?.redHeading}</span>
                </h2>
              </div>

              <form autoComplete="off" onSubmit={personalInfoFormik.handleSubmit} className="space-y-6">
                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  personalInfoFormik.errors.personalInfo?.fullName && personalInfoFormik.touched.personalInfo?.fullName
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="fullName" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
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
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {personalInfoFormik.errors.personalInfo?.fullName &&
                    personalInfoFormik.touched.personalInfo?.fullName && (
                      <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
                        {personalInfoFormik.errors.personalInfo.fullName}
                      </div>
                    )}
                </div>

                <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${
                  personalInfoFormik.errors.personalInfo?.email && personalInfoFormik.touched.personalInfo?.email
                    ? "border-[#FF3300]"
                    : "border-[#D9D9D9] dark:border-white/20"
                }`}>
                  <label htmlFor="email" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-white text-black">
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
                    className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                  />
                  {personalInfoFormik.errors.personalInfo?.email && personalInfoFormik.touched.personalInfo?.email && (
                    <div className="text-xs text-[#FF3300] font-host mt-1 leading-none">
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
                        className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${personalInfoFormik.values.personalInfo.consentToComms
                          ? "border-[#FF3300] bg-[#FF3300]"
                          : "dark:border-white/20 border-black/20"
                          }`}
                      >
                        {personalInfoFormik.values.personalInfo.consentToComms && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="ltr:ml-3 rtl:mr-3 text-sm dark:text-white/80 text-black/80 font-host">
                      {block?.teslaForm?.stepThree?.declaration}
                    </span>
                  </label>
                  {personalInfoFormik.errors.personalInfo?.consentToComms &&
                    personalInfoFormik.touched.personalInfo?.consentToComms && (
                      <div className="mt-1 text-sm text-[#FF3300] font-host">
                        {personalInfoFormik.errors.personalInfo.consentToComms}
                      </div>
                    )}
                </div>

                <Button
                  type="submit"
                  variant="orange"
                  disabled={finalSubmitLoader}
                  className="w-fit mt-4 flex items-center gap-2"
                >
                  <span>{block?.teslaForm?.stepThree?.scheduleAppointment}</span>
                  {finalSubmitLoader && (
                    <Image
                      src="/images/infinite-spinner.svg"
                      alt="loading"
                      width={30}
                      height={15}
                      className="loaderImage inline-block invert dark:invert-0"
                    />
                  )}
                </Button>
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
