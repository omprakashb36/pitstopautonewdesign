"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Image from "next/image"
import { Check, Minus, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { Squircle } from "corner-smoothing"
import { useDispatch, useSelector } from "react-redux"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import type { AppointmentFields } from "../../lib/types/types"
import type { RootState } from "../../lib/redux/store"
import { useRouter } from "next/navigation"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { setCartItemData, setCartPopup, setBookingData, setLeadId } from "../../lib/redux/slices/carSlice"
import CarSelectorModal from "./CarSelectorModal"
import { createLead } from "@/app/actions/appointment/createLead"
import { createAppointment } from "@/app/actions/appointment/createAppointment"
import type { LeadData, AppointmentData } from "@/app/actions/types"
import { toast } from "react-toastify"
import Select from "react-select"
import type { Swiper as SwiperType } from "swiper"
import { getServiceList } from "@/app/actions/common/sanityData"
import type { Service, ServiceCart } from "@/sanity.types"
import ServiceModal from "./ServiceModal"
import { verify } from "crypto"
import { urlForImage } from "@/sanity/lib/utils"
import { sendContactCustomerEmail } from "@/app/services/email/contact";
import { sendCRMCreateAppointemntEmail } from "@/app/services/email/crm";
import { CreateAppointemntProps } from "@/app/types/email";
import { sendPhoneOtp, verifyPhoneOtp } from "@/app/actions/appointment/phoneOtp"
import { getWorkshopList } from "@/app/actions/appointment/workshopList"
import Link from "next/link"
import { getSiteSettingData } from "@/app/actions/common/sanityData";
import { SettingsQueryResult } from "@/sanity.types";
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
import { getTimeSlotsDateRange } from "@/app/actions/appointment/getTimeSlotsDateRange"
import { getTimeSlots } from "@/app/actions/appointment/getTimeSlots"


// Cart item interface
interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  hours?: string
  quantity?: number
  type: "service" | "product"
  serviceCode?: string
}

interface LocationData {
  id: string;
  name: string;
  [key: string]: any;
}

// Form steps
type FormStep = "verify" | "schedule" | "personal" | "payment" | "pickup"

// Workshop location
interface WorkshopLocation {
  id: string
  name: string
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
  date: string
  day: string
  month: string
  year: number
  fullDate: Date
  availableSlots?: number
  totalSlots?: number
  isHoliday?: boolean
  timeslots?: any[]
}

interface PickupDropAddress {
  addressLine1: string
  addressLine2: string
  townArea: string
  emirate: string
  sameDropoffAddress: boolean
}

type serviceCartProps = {
  block: ServiceCart
  index: number
}

export default function ServiceCart({ block }: serviceCartProps) {
  // Form submission state
  const [submitting, setSubmitting] = useState(false)

  // Verification completed state
  const [verificationCompleted, setVerificationCompleted] = useState(false)

  // Schedule completed state
  const [scheduleCompleted, setScheduleCompleted] = useState(false)

  // Personal details completed state
  const [personalDetailsCompleted, setPersonalDetailsCompleted] = useState(false)

  // Pickup address completed state
  const [pickupAddressCompleted, setPickupAddressCompleted] = useState(false)

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Selected time state
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [serviceData, setServiceData] = useState<Service[]>([])

  // Active form step
  const [activeStep, setActiveStep] = useState<FormStep>("verify")
  const isHydrated = usePersistHydration()
  const appointmentData: AppointmentFields = useSelector((state: RootState) => state.carService.appointmentData)
  const leadId: string = useSelector((state: RootState) => state.carService.leadId)

  // OTP verification states
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [workshopLocations, setWorkshopLocations] = useState<WorkshopLocation[]>([])
  const [error, setError] = useState(null)

  // Add this state after other state declarations
  const [workshopSelected, setWorkshopSelected] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState<{ month: string; year: number } | null>(null)
  const [isServiceModalOpen, setServiceIsModalOpen] = useState(false)
  const [activeService, setActiveService] = useState<string | null>(null)
  const router = useRouter()
  const { currentLocale, isMobileDevice } = useDeviceDetection()
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [isLeadIdStep, setIsLeadIdStep] = useState(false)
  const [personalFormSubmit, setPersonalFormSubmit] = useState(false)
  const [finalSubmit, setFinalSubmit] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false)
  const [salesPerson, setSalesPerson] = useState('')
  const [leadAppointemntType, setLeadAppointemntType] = useState('')
  const [availableDates, setAvailableDates] = useState<any[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)

  // site setting
  const [siteSettings, setSiteSettings] = useState<SettingsQueryResult>();

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
  };

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

  // site settings
  useEffect(() => {
    async function siteSettings() {
      try {
        const data: SettingsQueryResult = await getSiteSettingData({ locale: currentLocale })
        setSiteSettings(data);
        /*console.log("site settign daata home slider", siteSettings);*/
      }
      catch (error) {
        console.log("no site setting data found", error)
      }
    }
    siteSettings();
  }, [currentLocale]);

  const serviceList =
    (serviceData &&
      serviceData?.map((service) => ({
        id: service._id,
        title: service.title,
        slug: service.slug?.current,
        image: service?.serviceIcon, // Ensure serviceIcon exists in the Service type
        serviceIcon: service?.serviceIcon?.image, // Add serviceIcon explicitly if needed
      }))) ||
    []

  useEffect(() => {
    // Validate initial phone number if it exists
    if (appointmentData?.personalDetails?.phoneNumber) {
      const isValid = validatePhoneNumber(appointmentData.personalDetails.phoneNumber)
      setIsPhoneValid(isValid)
    }
  }, [appointmentData?.personalDetails?.phoneNumber])

  // get Workshop locations
  useEffect(() => {
    const fetchWorkshopLocations = async () => {
      try {
        const response = await getWorkshopList()
        if (!response.message) {
          throw new Error("Failed to fetch workshop locations")
        }
        const data = response?.data?.data
        console.log("API location", data)
        const allowedLocations = ["Sajja", "Sharjah Industrial Area", "Musaffah", "Al Ain", "Al Quoz 4"]
        const keyword = appointmentData?.selectedService === "car-care-and-detailing" ? "AutoCare" : "AutoWorks"
        const filteredLocations = (data as LocationData[])
          .filter((location: LocationData) => {
            return (
              location.name.includes(keyword) &&
              allowedLocations.some((loc: string) =>
                location.name.includes(loc)
              )
            );
          })
          .map((location) => {
            if (location.name.includes("Al Quoz 4")) {
              return { ...location, name: location.name.replace("Al Quoz 4", "Al Quoz 4 Dubai") };
            }
            return location;
          });

        console.log("Filtered Workshop locations:", filteredLocations)
        setWorkshopLocations(filteredLocations)
      } catch (err) {
        console.log(err)
      }
    }

    fetchWorkshopLocations()
  }, []) // Empty dependency array means this runs once on mount

  const cartItemData: CartItem[] = useSelector((state: RootState) => state.carService.cartItemData)
  const CartOpen = useSelector((state: RootState) => state.carService.isCartOpen);

  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Sync Redux cartItemData to local state on mount
  useEffect(() => {
    setCartItems(cartItemData)
    dispatch(setCartPopup(false));
  }, [])

  // Update Redux when local state changes
  useEffect(() => {
    dispatch(setCartItemData(cartItems))
  }, [cartItems, dispatch])

  // Vehicle info
  const vehicleInfo = {
    make: "BMW",
    model: "Z4",
    year: 2018,
    fuelType: "PETROL",
    mileage: 20000,
  }

  // Recommended service
  const recommendedService = {
    id: "pickup-drop",
    name: "Pick Up & Drop Service",
    description: "Handled by Pitstop",
    price: 50,
    originalPrice: 100,
    discount: 50,
    features: [
      "Convenient Scheduling",
      "Safe & Secure Handling",
      "Flexible Locations",
      "Time-Saving Solution",
      "Timely Updates",
    ],
  }

  // Validation schema for verify step
  const verifyValidationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^\d{9,11}$/, "Phone number must be between 9-11 digits")
      .required("Phone number is required"),
    oneTimePassword: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  })

  // Validation schema for schedule step
  const scheduleValidationSchema = Yup.object({
    workshopLocation: Yup.string().required("Workshop location is required"),
    appointmentDate: Yup.string().required("Appointment date is required"),
    appointmentTime: Yup.string().required("Appointment time is required"),
  })

  // Validation schema for personal details step
  const personalDetailsValidationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email address").required("Email address is required"),
    consentToComms: Yup.boolean().oneOf([true], "You must agree to receive communications"),
  })

  // Pickup & Drop service added state
  const [pickupServiceAdded, setPickupServiceAdded] = useState(false)

  // Pickup address form state
  const [pickupAddress, setPickupAddress] = useState<PickupDropAddress>({
    addressLine1: "",
    addressLine2: "",
    townArea: "",
    emirate: "Dubai",
    sameDropoffAddress: true,
  })

  // Add validation schema for pickup address form
  const pickupAddressValidationSchema = Yup.object({
    addressLine1: Yup.string().required("Address line 1 is required"),
    townArea: Yup.string().required("Town/Area is required"),
    emirate: Yup.string().required("Emirate is required"),
  })

  // Add state for pickup address form errors
  const [pickupAddressErrors, setPickupAddressErrors] = useState<{
    addressLine1?: string
    addressLine2?: string
    townArea?: string
    emirate?: string
  }>({})

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      phoneNumber: appointmentData?.personalDetails?.phoneNumber || "",
      countryCode: "+971",
      oneTimePassword: "",
      workshopLocation: "",
      appointmentDate: "",
      appointmentTime: "",
      fullName: appointmentData?.personalDetails?.fullName || "",
      email: appointmentData?.personalDetails?.email || "",
      consentToComms: false,
    },
    validationSchema:
      activeStep === "verify"
        ? verifyValidationSchema
        : activeStep === "schedule"
          ? scheduleValidationSchema
          : personalDetailsValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log(values)

        // Move to next step based on current step
        if (activeStep === "verify") {
          // Here you would typically verify the OTP with your backend
          const response = await verifyPhoneOtp(values.countryCode + values.phoneNumber, values.oneTimePassword);
          console.log("OTP verification response:", response)
          if (response.status) {
            formik.setFieldValue("oneTimePassword", "");
            toast.success("OTP verified successfully")
          } else {
            toast.error(response.message)
            return
          }
          setVerificationCompleted(true)
          setActiveStep("schedule")
        } else if (activeStep === "schedule") {
          setScheduleCompleted(true)
          setActiveStep("personal")
        } else if (activeStep === "personal") {
          setPersonalFormSubmit(true)

          // If pickup service is added and not completed, go to pickup step
          if (pickupServiceAdded && !pickupAddressCompleted) {
            setActiveStep("pickup")
          } else {
            if (isLeadIdStep) {
              setActiveStep("payment")
            }
          }
        }
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!formik.values.workshopLocation) return

      let selectedLocation = formik.values.workshopLocation

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
        toDate.setDate(today.getDate() + 31)

        // Format helper
        const formatDate = (date: Date) => {
          return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`
        }

        const fromDateFormatted = formatDate(fromDate)
        const toDateFormatted = formatDate(toDate)

        const response = await getTimeSlotsDateRange(fromDateFormatted, toDateFormatted, selectedLocation)
        console.log("Available dates response:", response)

        if (response && response?.data?.message) {
          setAvailableDates(response.data.message)
          setTimeSlots([])
        } else {
          setAvailableDates([])
          setTimeSlots([])
        }
      } catch (error) {
        console.error("Error fetching available dates:", error)
        setAvailableDates([])

      } finally {
        setIsLoadingDates(false)
      }
    }

    if (formik.values.workshopLocation) {
      fetchAvailableDates()
    }
  }, [formik.values.workshopLocation])

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

  const dateOptions = generateDateOptionsFromAPI()


  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !formik.values.workshopLocation) return

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
  }, [selectedDate, formik.values.workshopLocation])

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString)
    const selectedDateObj = dateOptions.find((d) => d.date === dateString)
    if (selectedDateObj) {
      formik.setFieldValue("appointmentDate", selectedDateObj.fullDate.toISOString())
    }
  }

  // Handle time selection
  const handleTimeSelect = (time: string, name: string) => {
    setSelectedTime(time)
    setSalesPerson(name)
    formik.setFieldValue("appointmentTime", time)
  }

  // Handle workshop location change
  const handleWorkshopChange = (locationId: string) => {
    formik.setFieldValue("workshopLocation", locationId)
    setWorkshopSelected(true)
    setSelectedTime(null)
    setSelectedDate(null)
  }

  // Handle edit verification
  const handleEditVerification = () => {
    setActiveStep("verify")
    setVerificationCompleted(false)
  }

  // Handle edit schedule
  const handleEditSchedule = () => {
    setActiveStep("schedule")
    setScheduleCompleted(false)
  }

  // Handle edit personal details
  const handleEditPersonalDetails = () => {
    setActiveStep("personal")
    setPersonalDetailsCompleted(false)
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const handleRemoveItem = (itemId: string) => {
    if (itemId === "pickup-drop") {
      setPickupServiceAdded(false)
      setPickupAddressCompleted(false)
    }
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
    toast.success(`Service deleted successfully`)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === "product" && item.quantity) {
        return total + item.price * item.quantity
      }
      return total + item.price
    }, 0)
  }

  // Handle add recommended service
  const handleAddRecommendedService = () => {
    if (cartItems.some((item) => item.id === recommendedService.id)) return

    setCartItems([
      ...cartItems,
      {
        id: recommendedService.id,
        name: recommendedService.name,
        price: recommendedService.price,
        type: "service",
      },
    ])

    // Set pickup service added to true
    setPickupServiceAdded(true)
    setPickupAddressCompleted(false)

    // If we're at the payment step, go back to pickup step
    if (activeStep === "payment") {
      setActiveStep("pickup")
    }
  }

  // Validate phone number
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{9,11}$/
    return phoneRegex.test(phoneNumber)
  }

  // Handle phone validation and OTP sending
  const handleSendOTP = async () => {
    if (validatePhoneNumber(formik.values.phoneNumber)) {
      setIsPhoneValid(true)
      setOtpSent(true)
      setTimerActive(true)
      setOtpTimer(60)

      // Start the timer
      const interval = setInterval(() => {
        setOtpTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval)
            setTimerActive(false)
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)

      console.log("Sending OTP to", formik.values.countryCode + formik.values.phoneNumber)
      // Here you would typically call your API to send the OTP
      const response = await sendPhoneOtp(formik.values.countryCode + formik.values.phoneNumber);
      if (response.status) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        toast.error(response.message);
      }


    } else {
      formik.setFieldError("phoneNumber", "Phone number must be between 9-11 digits")
      formik.setFieldTouched("phoneNumber", true, false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!timerActive) {
      setOtpTimer(60)
      setTimerActive(true)

      // Start the timer again
      const interval = setInterval(() => {
        setOtpTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval)
            setTimerActive(false)
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)

      console.log("Resending OTP...")
      // Implement OTP resend logic here
      const response = await sendPhoneOtp(formik.values.countryCode + formik.values.phoneNumber);
      if (response.status) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        toast.error(response.message);
      }
    }
  }

  // Continue to personal details
  const handleContinueToPersonalDetails = () => {
    if (selectedDate && selectedTime) {
      setScheduleCompleted(true)
      setActiveStep("personal")
    }
  }

  /*  generate lead id */
  useEffect(() => {
    const fetchLeadId = async () => {
      try {
        // Format the selected date for the lead data
        const selectedDateObj = dateOptions.find((d) => d.date === selectedDate)
        if (selectedDateObj && leadId === "") {
          // Prepare lead data
          const data: LeadData = {
            lead_name: appointmentData?.personalDetails?.fullName || "",
            mobile_no: appointmentData?.personalDetails?.countryCode + formik.values.phoneNumber || appointmentData?.personalDetails?.countryCode + appointmentData?.personalDetails?.phoneNumber || "",
            email_id: formik.values.email || appointmentData?.personalDetails?.email,
            custom_vehicle_make: appointmentData?.brand || "",
            custom_vehicle_model: appointmentData?.model || "",
            custom_vehicle_year: appointmentData?.year?.toString() || "",
          }

          // Call createLead API
          console.log("Creating lead with data:", data)
          const response = await createLead(data)
          console.log(response)
          if (!response.status) {
            toast.error(response.message)
            setIsLeadIdStep(false)
            setPersonalFormSubmit(false)
          } else {
            dispatch(setLeadId(response?.data?.data?.name))
            setIsLeadIdStep(true)
            setPersonalDetailsCompleted(true)
            setActiveStep("payment")
            setPersonalFormSubmit(false)
          }
        }
        else {
          console.log("Lead ID already exists")
          setIsLeadIdStep(true)
          setPersonalDetailsCompleted(true)
          setActiveStep("payment")
          setPersonalFormSubmit(false)
        }
      } catch (error) {
        console.error("Error creating lead:", error)
        toast.error(String(error))
      }
    }
    if (selectedDate && selectedTime && personalFormSubmit) {
      fetchLeadId()
    }
  }, [selectedDate, selectedTime, personalFormSubmit])

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

          // Prepare lead data
          const data: AppointmentData = {
            appointment_type: leadAppointemntType,
            scheduled_date: formattedDate,
            scheduled_time: formattedTime,
            party_name: leadId,
            applies_to_item: appointmentData?.model,
            vehicle_license_plate: appointmentData?.plateNumber,
            sales_person: salesPerson,
            service_templates: cartItems.map((item, index) => ({
              service_template: item?.serviceCode || '',
              idx: index + 1,
            })),
          }
          /*console.log(data)*/
          const dataForMail: AppointmentData = {
            ...data,
            service_templates: cartItems.map((item, index) => ({
              service_template: item?.name || '',
              idx: index + 1,
            })),
          };

          // Call createAppointment API
          const response = await createAppointment(data)
          console.log(response)
          if (!response.status) {
            toast.error(response.message)
          } else {
            await sendContactCustomerEmail(dataForMail as AppointmentData, formik.values.fullName, formik.values.email, currentLocale, "createAppointement");
            // const crmEmailProps: CreateAppointemntProps = {
            //   email: formik.values.email,
            //   fname: formik.values.fullName.split(" ")[0] || "",
            //   lname: formik.values.fullName.split(" ")[1] || "",
            // };
            // const pageUrl = window.location.href;
            // await sendCRMCreateAppointemntEmail(crmEmailProps, currentLocale, "Create Appointement Form", pageUrl);
            dispatch(setBookingData(response?.data?.data))
            /*toast.success("Appointment created successfully")*/
            window.location.href = `/${currentLocale}/appointment-confirmation`
          }

        }
      } catch (error) {
        console.error("Error creating lead:", error)
        toast.error(String(error))
      } finally {
        setFinalSubmitLoader(false)
        setFinalSubmit(false)
      }
    }
    if (finalSubmit) {
      fetchCreateAppointment()
    }
  }, [finalSubmit])

  // Get day suffix (st, nd, rd, th)
  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  // Handle confirm and book
  const handleConfirmAndBook = () => {
    // If all steps are completed, proceed to payment
    if (verificationCompleted && scheduleCompleted && personalDetailsCompleted) {
      // If pickup service is added but address not completed, show pickup form
      if (pickupServiceAdded && !pickupAddressCompleted) {
        setActiveStep("pickup")
      } else {
        console.log("Proceeding to payment...")
        // Here you would typically redirect to payment page or show payment form
        setFinalSubmit(true)
      }
    } else {
      // If not all steps are completed, go to the first incomplete step
      if (!verificationCompleted) {
        setActiveStep("verify")
      } else if (!scheduleCompleted) {
        setActiveStep("schedule")
      } else if (!personalDetailsCompleted) {
        setActiveStep("personal")
      }
    }
  }

  // Update the handlePickupAddressChange function to clear errors on change
  const handlePickupAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setPickupAddress({
        ...pickupAddress,
        [name]: checked,
      })
    } else {
      setPickupAddress({
        ...pickupAddress,
        [name]: value,
      })
    }

    // Clear error for this field when user types
    if (pickupAddressErrors[name as keyof typeof pickupAddressErrors]) {
      setPickupAddressErrors({
        ...pickupAddressErrors,
        [name]: undefined,
      })
    }
  }

  // Update the handleSaveAddress function to include validation
  const handleSaveAddress = () => {
    // Validate the form
    try {
      pickupAddressValidationSchema.validateSync(pickupAddress, { abortEarly: false })
      // If validation passes, proceed
      console.log("Saving address:", pickupAddress)
      setPickupAddressCompleted(true)
      setActiveStep("payment")
      setPickupAddressErrors({})
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Transform validation errors into an object
        const errors: Record<string, string> = {}
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message
          }
        })
        setPickupAddressErrors(errors)
      }
    }
  }

  // Check if all required steps are completed
  const allStepsCompleted = () => {
    if (!verificationCompleted || !scheduleCompleted || !personalDetailsCompleted) {
      return false
    }

    // If pickup service is added, check if pickup address is completed
    if (pickupServiceAdded && !pickupAddressCompleted) {
      return false
    }

    return true
  }

  const handleServiceSelection = (slug?: string) => {
    if (slug) {
      window.location.href = `/${currentLocale}/services/${slug}`
    } else {
      router.push(`/${currentLocale}/service-listing`)
    }
  }

  useEffect(() => {
    if (!appointmentData?.brand) {
      window.location.href = "/en"
    }
  }, [])

  if (!isHydrated) {
    return <div></div>
  }

  return (
    <>
      <div className="text-[#FAEADC] min-h-[400px] serviceCart">
        <div className="py-8 md:py-12 md:pt-0">

          {/* Main Content */}
          <div className="lg:flex flex flex-wrap lg:flex-nowrap gap-8 relative">
            {/* Left Column - Form Steps */}
            <div className="space-y-6 w-full xl:min-w-[60%] lg:min-w-[60%] xl:w-[55%] lg:w-[60%]">
              {/* Verify Step */}

              {/* Header Row */}

              {/* Left side - Title and Browse button */}
              <div className="flex justify-between flex-col md:flex-row md:mb-[53px]  md:items-center gap-4 md:gap-8 w-full">
                <h1>
                  <span className="dark:text-[#FAEADC] text-black">{block?.heading}</span>{" "}
                  <span className="text-[#C00034]">{block?.subHeading}</span>
                </h1>

                <button
                  onClick={() => setServiceIsModalOpen(true)}
                  className="gradientBG mhidden gradientBGTrans text-[#FAEADC] lg:min-w-[240px] 3xl:min-w-[280px] px-[20px] 3xl:px-[40px] py-[16px] leading-[1] rounded-[10px] transition-colors"
                >
                  {block.browseServiceLabel}
                </button>
              </div>

              {block?.verifySection && block?.verifySection.length > 0 && block.verifySection?.slice(0, 1).map(verify => (
                <div key={verify._key} className="bg-white dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-white/10 overflow-hidden rounded-[40px] shadow-sm">
                  <div className="p-6 md:p-[40px]">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[32px] font-host font-extrabold text-[#211d1d] dark:text-[#FAEADC] uppercase">
                        {verify.verify || "Verify"}
                      </h2>
                      {verificationCompleted && (
                        <div className="flex items-center gap-4">
                          <div className="flex min-w-[100px] items-center p-2 rounded-md gap-2 dark:bg-[#0C1B13] bg-white">
                            <div className="p-0">
                              <Image
                                src="/images/verified.svg"
                                alt="verified icon"
                                width={20}
                                height={20}
                                className="mb-0"
                              />
                            </div>
                            <span className="text-[#1DAF65] text-[12px]">
                              {formik.values.countryCode + formik.values.phoneNumber || appointmentData?.personalDetails?.phoneNumber} Verified
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleEditVerification}
                            className="border border-[#C00034] font-host font-bold text-[12px] rounded-lg text-[#C00034] px-4 py-1.5 hover:bg-[#C00034]/10 transition-colors uppercase"
                          >
                            {verify.editBtnLabel}
                          </button>
                        </div>
                      )}
                    </div>

                    {activeStep === "verify" && (
                      <form autoComplete="off" className="paymentForm pt-0 mt-6" onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Phone Number Field */}
                          <div className={`border rounded-[20px] h-[90px] flex items-center w-full overflow-hidden transition-colors ${!otpSent ? "md:col-span-2" : ""
                            } ${formik.errors.phoneNumber && formik.touched.phoneNumber
                              ? "border-[#FF3300]"
                              : "border-[#D9D9D9] dark:border-white/20"
                            }`}>
                            {/* Country Code Selection */}
                            <div className="w-[124px] h-full flex flex-col justify-center px-[24px] pr-[15px] relative border-r border-[#D9D9D9] dark:border-white/20 selectReact no-border">
                              <label htmlFor="countryCode" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-[#FAEADC] text-black">
                                {verify.countryLabel || "COUNTRY"}
                              </label>
                              <Select
                                id="countryCode"
                                name="countryCode"
                                options={[
                                  { value: "+971", label: "+971" },
                                  { value: "+1", label: "+1" },
                                  { value: "+44", label: "+44" },
                                  { value: "+91", label: "+91" },
                                ]}
                                value={{ value: formik.values.countryCode, label: formik.values.countryCode }}
                                onChange={(option) => formik.setFieldValue("countryCode", option?.value || "")}
                                onBlur={() => formik.setFieldTouched("countryCode", true)}
                                isDisabled={otpSent}
                                styles={customSelectStyles}
                                classNames={selectClassNames}
                                components={components}
                                isSearchable={false}
                                className="font-host text-[16px] md:text-[20px]"
                              />
                            </div>
                            {/* Phone Number Input */}
                            <div className="flex-1 h-full flex flex-col justify-center px-[24px]">
                              <label htmlFor="phoneNumber" className="block font-host font-medium opacity-60 text-[10px] md:text-[12px] uppercase dark:text-[#FAEADC] text-black">
                                {"PHONE NUMBER"}
                              </label>
                              <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="555 8080 889"
                                value={formik.values.phoneNumber}
                                onChange={(e) => {
                                  formik.handleChange(e)
                                  setIsPhoneValid(validatePhoneNumber(e.target.value))
                                }}
                                onBlur={formik.handleBlur}
                                className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* OTP Field - Only show when OTP is sent */}
                          {otpSent && (
                            <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${formik.errors.oneTimePassword && formik.touched.oneTimePassword
                                ? "border-[#FF3300]"
                                : "border-[#D9D9D9] dark:border-white/20"
                              }`}>
                              <label
                                htmlFor="oneTimePassword"
                                className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-[#FAEADC] text-black"
                              >
                                {verify.otpLabel || "ONE TIME PASSWORD"}
                              </label>
                              <input
                                type="text"
                                id="oneTimePassword"
                                name="oneTimePassword"
                                placeholder="78009"
                                value={formik.values.oneTimePassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 flex-col sm:flex-row items-center">
                          {!otpSent ? (
                            <button
                              type="button"
                              onClick={handleSendOTP}
                              disabled={!isPhoneValid || submitting}
                              className="bg-[#801b01] text-[#fcf3ed] px-[40px] py-[16px] rounded-[12px] font-host font-extrabold uppercase text-[16px] leading-[1.5] w-full sm:w-[417px] disabled:opacity-50 transition-all text-center hover:opacity-90"
                            >
                              {submitting ? "PROCESSING..." : verify.sendOtpButtonLabel || "SEND OTP"}
                            </button>
                          ) : (
                            <>
                              <button
                                type="submit"
                                disabled={
                                  submitting ||
                                  !formik.values.oneTimePassword ||
                                  formik.values.oneTimePassword.length !== 6
                                }
                                className="bg-[#801b01] text-[#fcf3ed] px-[40px] py-[16px] rounded-[12px] font-host font-extrabold uppercase text-[16px] leading-[1.5] w-full sm:w-[417px] disabled:opacity-50 transition-all text-center hover:opacity-90"
                              >
                                {submitting ? "PROCESSING..." : verify.verifyBtnLabel || "CONTINUE"}
                              </button>

                              <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={timerActive}
                                className={`border border-[#801b01] text-[#801b01] rounded-[12px] py-[16px] px-[40px] font-host font-extrabold uppercase text-[16px] leading-[1.5] transition-all hover:bg-[#801b01]/10 ${timerActive ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                              >
                                {timerActive ? `Resend OTP in ${otpTimer}s` : verify?.sendOtpLabel || "RESEND OTP"}
                              </button>
                            </>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {/* Schedule Appointment Step */}
              {block?.appointmentSection && block?.appointmentSection?.length > 0 && block?.appointmentSection?.slice(0, 1).map(appoint => {
                const isStepActive = activeStep === "schedule";
                return (
                  <div key={appoint._key} className={`bg-white dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden transition-all duration-300 ${!verificationCompleted ? "opacity-70 pointer-events-none" : ""}`}>
                    <div className="p-6 md:p-[40px]">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-[32px] font-host font-extrabold text-[#211d1d] dark:text-[#FAEADC] uppercase">
                          {appoint.appointment || "Schedule appointment"}
                        </h2>
                        {scheduleCompleted && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center md:min-w-[215px] p-2 rounded-md gap-2 dark:bg-[#0C1B13] bg-white">
                              <div className="p-0">
                                <Image
                                  src="/images/verified.svg"
                                  alt="verified icon"
                                  width={20}
                                  height={20}
                                  className="mb-0"
                                />
                              </div>
                              <span className="text-[#1DAF65] text-[13px]">
                                {selectedDateObj
                                  ? `${selectedDateObj.day}, ${selectedDateObj.date}${getDaySuffix(
                                    parseInt(selectedDateObj.date, 10),
                                  )}  `
                                  : ""}{" "}
                                - {formik.values.appointmentTime.split(" - ")[0] || ""}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleEditSchedule}
                              className="border border-[#C00034] font-host font-bold text-[12px] rounded-lg text-[#C00034] px-4 py-1.5 hover:bg-[#C00034]/10 transition-colors uppercase"
                            >
                              {appoint.editBtnLabel}
                            </button>
                          </div>
                        )}
                        {!scheduleCompleted && (
                          <div className="bg-[#eaeaea] dark:bg-[#202020] text-[#211d1d] dark:text-[#FAEADC] rounded-[8px] font-host font-bold px-[12px] py-[8px] text-[12px] uppercase">
                            {appoint?.availableTimeSlotLabel || "Select the available time slot"}
                          </div>
                        )}
                      </div>

                      {isStepActive && (
                        <div className="space-y-6 pt-6">
                          {/* Workshop Location */}
                          <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center selectReact w-full transition-colors ${formik.errors.workshopLocation && formik.touched.workshopLocation
                              ? "border-[#FF3300]"
                              : "border-[#D9D9D9] dark:border-white/20"
                            }`}>
                            <label className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-[#FAEADC] text-black">
                              {appoint.selectWorkShopLabel}
                            </label>
                            <Select
                              id="workshopLocation"
                              name="workshopLocation"
                              options={
                                workshopLocations &&
                                workshopLocations.map((location) => ({
                                  value: location.name,
                                  label: location.name,
                                }))
                              }
                              value={
                                formik.values.workshopLocation
                                  ? {
                                    value: formik.values.workshopLocation,
                                    label: formik.values.workshopLocation,
                                  }
                                  : null
                              }
                              onChange={(option) => handleWorkshopChange(option?.value || "")}
                              placeholder={appoint.workshopPlaceholder}
                              styles={customSelectStyles}
                              classNames={selectClassNames}
                              components={components}
                              isSearchable={!isMobileDevice}
                              className="font-host text-[16px] md:text-[20px]"
                            />
                          </div>

                          {workshopSelected && isLoadingDates && (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3300]"></div>
                            </div>
                          )}

                          {/* Date Selection - Only show when workshop is selected */}
                          {workshopSelected && !isLoadingDates && dateOptions.length > 0 && (
                            <div className="flex flex-col gap-6">
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
                                    const currentIndex = swiper.activeIndex;
                                    const currentDateOption = dateOptions[currentIndex];
                                    if (currentDateOption) {
                                      if (
                                        !visibleMonth ||
                                        visibleMonth.month !== currentDateOption.month ||
                                        visibleMonth.year !== currentDateOption.year
                                      ) {
                                        setVisibleMonth({
                                          month: currentDateOption.month,
                                          year: currentDateOption.year,
                                        });
                                      }
                                    }
                                  }}
                                  onInit={(swiper) => {
                                    if (dateOptions.length > 0) {
                                      setVisibleMonth({
                                        month: dateOptions[0].month,
                                        year: dateOptions[0].year,
                                      });
                                    }
                                  }}
                                  onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
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
                                    const dayNumber = new Date(dateOption.date).getDate();
                                    const isSelected = selectedDate === dateOption.date;
                                    return (
                                      <SwiperSlide key={dateOption.date} className="!w-auto">
                                        <button
                                          type="button"
                                          disabled={dateOption?.isHoliday}
                                          onClick={() => handleDateSelect(dateOption.date)}
                                          className={`flex flex-col items-center justify-center w-[66px] h-[57px] transition-all duration-200 ${dateOption?.isHoliday
                                              ? 'opacity-30 cursor-not-allowed text-[#211D1D] dark:text-white/60'
                                              : isSelected
                                                ? "bg-[#FF3300] text-white rounded-[12px] shadow-sm font-bold"
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
                                    );
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

                              {/* Month Divider Pill */}
                              <div className="flex flex-col items-center relative w-full my-4">
                                <div className="border-t border-[#d9d9d9] dark:border-white/10 w-full absolute top-1/2" />
                                <div className="z-10 bg-[#211d1d] text-[#fcf3ed] px-[12px] py-[8px] rounded-[8px] font-host font-bold text-[12px] uppercase tracking-wide">
                                  {visibleMonth && selectedDateObj
                                    ? `${selectedDateObj.month} ${selectedDateObj.year}`
                                    : visibleMonth
                                      ? `${visibleMonth.month} ${visibleMonth.year}`
                                      : "SELECT DATE"}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Time Selection - Only show when date is selected */}
                          {selectedDate && (
                            <div className="flex flex-col gap-6">
                              {isLoadingTimeSlots ? (
                                <div className="flex justify-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3300]"></div>
                                </div>
                              ) : timeSlots.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                  <div className="text-center font-host font-bold uppercase text-[12px] text-[#211d1d] dark:text-[#FAEADC] tracking-wide">
                                    {appoint.timeSlotLabel || "SELECT TIME SLOT"}
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-4">
                                    {timeSlots.map((slot) => {
                                      const isSelected = selectedTime === slot.time;
                                      return (
                                        <button
                                          key={slot.time}
                                          type="button"
                                          onClick={() => handleTimeSelect(slot.time, Array.isArray(slot.available_agents) ? slot.available_agents[0] : "")}
                                          disabled={!slot.available}
                                          className={`flex flex-col items-center justify-center p-3 rounded-[12px] w-[110px] transition-all border ${isSelected
                                              ? "bg-[rgba(255,51,0,0.09)] border-[#FF3300] text-[#FF3300] font-bold"
                                              : "bg-transparent border-[#d9d9d9] text-[#211d1d] dark:text-[#FAEADC] hover:bg-[#FF3300]/10"
                                            } ${!slot.available ? "opacity-30 cursor-not-allowed" : ""}`}
                                        >
                                          <span className="text-[16px] font-host font-medium">{slot.time}</span>
                                          <span className="text-[12px] font-host opacity-60">
                                            {slot.available ? "available" : "unavailable"}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4 dark:text-[#FAEADC] text-black">
                                  No time slots available for this date or this is a holiday.
                                </div>
                              )}
                            </div>
                          )}

                          {/* Continue Button */}
                          {selectedDate && selectedTime && (
                            <div className="flex justify-end pt-4">
                              <button
                                type="button"
                                onClick={handleContinueToPersonalDetails}
                                className="bg-[#801b01] text-[#fcf3ed] px-[50px] py-[13px] rounded-[12px] font-host font-extrabold uppercase text-[16px] hover:opacity-90 transition-all"
                              >
                                {appoint.continueBtnLabel || "CONTINUE"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Personal Details Step */}
              {block?.personalDetailsSection && block?.personalDetailsSection?.length > 0 && block?.personalDetailsSection?.slice(0, 1).map(personal => (
                <div key={personal._key} className={`bg-white dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden transition-all duration-300 ${!verificationCompleted || !scheduleCompleted ? "opacity-70 pointer-events-none" : ""}`}>
                  <div className="p-6 md:p-[40px]">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[32px] font-host font-extrabold text-[#211d1d] dark:text-[#FAEADC] uppercase">
                        {personal.appointment || "Personal details"}
                      </h2>
                      {isLeadIdStep && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center min-w-[100px] p-2 rounded-md gap-2 dark:bg-[#0C1B13] bg-white">
                            <div className="p-0 min-w-5">
                              <Image
                                src="/images/verified.svg"
                                alt="verified icon"
                                width={20}
                                height={20}
                                className="mb-0"
                              />
                            </div>
                            <span className="text-[#1DAF65] uppercase text-[12px]">{personal.continueBtnLabel}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleEditPersonalDetails}
                            className="border uppercase border-[#C00034] font-host font-bold text-[12px] rounded-lg text-[#C00034] px-4 py-1.5 hover:bg-[#C00034]/10 transition-colors"
                          >
                            {personal.editBtnLabel}
                          </button>
                        </div>
                      )}
                    </div>

                    {activeStep === "personal" && (
                      <form autoComplete="off" className="space-y-6 mt-6" onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Full Name Field */}
                          <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${formik.errors.fullName && formik.touched.fullName
                              ? "border-[#FF3300]"
                              : "border-[#D9D9D9] dark:border-white/20"
                            }`}>
                            <label htmlFor="fullName" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-[#FAEADC] text-black">
                              {personal.fullNameLabel || "YOUR FULL NAME"}
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              placeholder="Mayank Sethi"
                              value={formik.values.fullName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                              <div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>
                            )}
                          </div>

                          {/* Email Field */}
                          <div className={`border rounded-[20px] px-[24px] h-[90px] flex flex-col justify-center w-full transition-colors ${formik.errors.email && formik.touched.email
                              ? "border-[#FF3300]"
                              : "border-[#D9D9D9] dark:border-white/20"
                            }`}>
                            <label htmlFor="email" className="block font-host font-medium opacity-60 text-[12px] uppercase dark:text-[#FAEADC] text-black">
                              {personal.emailLabel || "YOUR EMAIL ADDRESS"}
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              placeholder="mayank@bluup.in"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full bg-transparent font-host text-[16px] md:text-[20px] dark:text-white text-black placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none"
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            )}
                          </div>
                        </div>

                        {/* Consent Checkbox */}
                        <div className="flex items-start gap-4 mt-6 select-none">
                          <div
                            onClick={() => formik.setFieldValue("consentToComms", !formik.values.consentToComms)}
                            className={`cursor-pointer border border-[#211d1d] dark:border-[#FAEADC] rounded-[4px] size-6 flex items-center justify-center flex-shrink-0 ${formik.values.consentToComms ? "bg-[#211d1d] dark:bg-[#FAEADC]" : "bg-transparent"
                              }`}
                          >
                            {formik.values.consentToComms && (
                              <Check className={`size-4 ${formik.values.consentToComms ? "text-white dark:text-[#0A0A0A]" : "text-transparent"}`} />
                            )}
                          </div>
                          <label
                            onClick={() => formik.setFieldValue("consentToComms", !formik.values.consentToComms)}
                            className="text-[14px] leading-[1.5] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 cursor-pointer"
                          >
                            {personal.declaration || "I hereby provide my consent to receive communications from Pitstop via WhatsApp, SMS, and email."}
                          </label>
                        </div>
                        {formik.touched.consentToComms && formik.errors.consentToComms && (
                          <div className="text-red-500 text-xs mt-1">{formik.errors.consentToComms}</div>
                        )}

                        {/* Continue Button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={submitting || !formik.isValid}
                            className="bg-[#801b01] text-[#fcf3ed] px-[50px] py-[13px] rounded-[12px] font-host font-extrabold uppercase text-[16px] hover:opacity-90 transition-all w-full sm:w-[417px] disabled:opacity-50"
                          >
                            {submitting ? "PROCESSING..." : personal?.continueBtnLabel || "CONTINUE"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {/* Pickup & Drop Service Step */}
              {pickupServiceAdded && (
                <div
                  className={`bg-black/40 rounded-lg hidden overflow-hidden ${activeStep !== "pickup" && !pickupAddressCompleted ? "opacity-70" : ""}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-[26.6px] font-shoulders font-semibold">PICK UP & DROP SERVICE</h2>
                      <div className="bg-emerald-700 text-[#FAEADC] px-4 py-1 rounded flex items-center gap-2">
                        <span>ADDED</span>
                      </div>
                    </div>

                    {(activeStep === "pickup" || !pickupAddressCompleted) && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Address Line 1 */}
                          <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px]">
                            <label
                              htmlFor="addressLine1"
                              className="block text-xs uppercase mb-2 font-urbanist sandDrift"
                            >
                              ADDRESS LINE 1
                            </label>
                            <input
                              type="text"
                              id="addressLine1"
                              name="addressLine1"
                              placeholder="Enter here"
                              value={pickupAddress.addressLine1}
                              onChange={handlePickupAddressChange}
                              className={`bg-black/60 text-[#FAEADC] rounded px-3 py-3 border ${pickupAddressErrors.addressLine1 ? "border-red-500" : "border-[#333333]"
                                } focus:outline-none focus:border-[#C00034] w-full`}
                            />
                            {pickupAddressErrors.addressLine1 && (
                              <div className="text-red-500 text-xs mt-1">{pickupAddressErrors.addressLine1}</div>
                            )}
                          </div>

                          {/* Address Line 2 */}
                          <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px]">
                            <label
                              htmlFor="addressLine2"
                              className="block text-xs uppercase mb-2 font-urbanist sandDrift"
                            >
                              ADDRESS LINE 2
                            </label>
                            <input
                              type="text"
                              id="addressLine2"
                              name="addressLine2"
                              placeholder="Enter here"
                              value={pickupAddress.addressLine2}
                              onChange={handlePickupAddressChange}
                              className="bg-black/60 text-[#FAEADC] rounded px-3 py-3 border border-[#333333] focus:outline-none focus:border-[#C00034] w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Town/Area */}
                          <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px]">
                            <label htmlFor="townArea" className="block text-xs uppercase mb-2 font-urbanist sandDrift">
                              TOWN / AREA
                            </label>
                            <input
                              type="text"
                              id="townArea"
                              name="townArea"
                              placeholder="Enter here"
                              value={pickupAddress.townArea}
                              onChange={handlePickupAddressChange}
                              className={`bg-black/60 text-[#FAEADC] rounded px-3 py-3 border ${pickupAddressErrors.townArea ? "border-red-500" : "border-[#333333]"
                                } focus:outline-none focus:border-[#C00034] w-full`}
                            />
                            {pickupAddressErrors.townArea && (
                              <div className="text-red-500 text-xs mt-1">{pickupAddressErrors.townArea}</div>
                            )}
                          </div>

                          {/* Emirate */}
                          <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px]">
                            <label htmlFor="emirate" className="block text-xs uppercase mb-2 font-urbanist sandDrift">
                              EMIRATE
                            </label>
                            <Select
                              id="emirate"
                              name="emirate"
                              options={[
                                { value: "Dubai", label: "Dubai" },
                                { value: "Abu Dhabi", label: "Abu Dhabi" },
                                { value: "Sharjah", label: "Sharjah" },
                                { value: "Ajman", label: "Ajman" },
                                { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
                              ]}
                              value={
                                pickupAddress.emirate
                                  ? {
                                    value: pickupAddress.emirate,
                                    label: pickupAddress.emirate,
                                  }
                                  : null
                              }
                              onChange={(option) => {
                                const event = {
                                  target: {
                                    name: "emirate",
                                    value: option?.value || "",
                                  },
                                } as unknown as React.ChangeEvent<HTMLSelectElement>
                                handlePickupAddressChange(event)
                              }}
                              placeholder="Select Emirate"
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor: pickupAddressErrors.emirate
                                    ? "#ef4444"
                                    : state.isFocused
                                      ? "rgba(255, 255, 255, 0.4)"
                                      : "rgba(255, 255, 255, 0.2)",
                                }),
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Same Address Checkbox */}
                        <div className="flex items-center gap-2 mb-6">
                          <input
                            type="checkbox"
                            id="sameDropoffAddress"
                            name="sameDropoffAddress"
                            checked={pickupAddress.sameDropoffAddress}
                            onChange={handlePickupAddressChange}
                            className="mt-1"
                          />
                          <label htmlFor="sameDropoffAddress" className="text-sm">
                            Drop off at the same address.
                          </label>
                        </div>

                        {/* Save Address Button */}
                        <Squircle cornerRadius={10}>
                          <button
                            onClick={handleSaveAddress}
                            className="rounded-lg px-[50px] py-[13px] gradientBG font-urbanist text-[#FAEADC] font-medium"
                          >
                            SAVE ADDRESS
                          </button>
                        </Squircle>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Service */}
              {!pickupServiceAdded && (
                <Squircle cornerRadius={50}>
                  <div className="bg-[#161616] hidden rounded-lg mb-12 overflow-hidden">
                    <div className="flex">
                      {/* Service Image */}
                      <div className="relative w-1/3 max-w-[200px] hidden md:block">
                        <Image
                          src="/images/intermediate-service.png"
                          alt={recommendedService.name}
                          width={200}
                          height={205}
                          className="h-full pt-[2.2rem] w-full rounded-tr-[2.2rem] rounded-br-[2.2rem]"
                        />

                        <div className="absolute top-7 left-8 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                          RECOMMENDED
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="flex-1 p-6 pt-[2.2rem]">
                        <div className="mb-3 md:hidden bg-emerald-500 text-white text-xs px-2 py-1 rounded inline-block">
                          RECOMMENDED
                        </div>

                        <h3 className="text-2xl font-bold mb-1">{recommendedService.name}</h3>
                        <p className="text-[#FAEADC]/70 mb-4">{recommendedService.description}</p>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                          {recommendedService.features.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check size={18} className="text-emerald-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                          {recommendedService.features.length > 4 && (
                            <button className="text-emerald-500 text-sm flex items-center mt-2 hover:underline">
                              + View {recommendedService.features.length - 4} more
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-3">
                        {recommendedService.originalPrice && (
                          <span className={`text-[#FAEADC]/60 ${appointmentData?.brand ? "line-through" : ""} text-sm`}>
                            {appointmentData?.brand ? `AED ${recommendedService.originalPrice}` : "Starting from:"}
                          </span>
                        )}
                        <span className="text-2xl font-bold">AED {recommendedService.price}</span>
                        {recommendedService.discount && appointmentData?.brand && (
                          <div className="bg-[#FAEADC] text-[#121212] rounded-tr-[2rem] font-bold p-[13px] pr-[19px] text-center">
                            <div className="text-lg">{recommendedService.discount}%</div>
                            <div className="text-xs">OFF</div>
                          </div>
                        )}
                      </div>

                      {/* Custom button instead of importing Button component */}

                      <Squircle cornerRadius={10}>
                        <button
                          onClick={handleAddRecommendedService}
                          className="bg-[#C00034] gradientBG text-[#FAEADC] px-[26px] py-[13px] rounded hover:bg-[#C00034]/90 transition-colors"
                        >
                          ADD THIS SERVICE
                        </button>
                      </Squircle>
                    </div>
                  </div>
                </Squircle>
              )}
            </div>

            {/* Right Column - Cart Summary */}

            {block?.cartSection && block?.cartSection?.length > 0 && block?.cartSection?.slice(0, 1).map(cart => (
              <div key={cart._key} className="w-full sticky top-10 self-start">
                {/* Right side - Vehicle info */}
                {appointmentData?.brand && (
                  <div className="rounded-[40px] bg-white dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-white/10 p-5 md:p-6 flex w-full justify-between items-center gap-4 mb-[40px] shadow-sm">
                    <div>
                      <h2 className="text-[20px] font-host font-extrabold dark:text-[#FAEADC] text-black uppercase">
                        {appointmentData?.model.toUpperCase()}, {appointmentData?.year}
                      </h2>
                      <p className="text-[12px] opacity-60 dark:text-[#FAEADC]/60 text-black uppercase mt-1 font-host">
                        {vehicleInfo.fuelType} · {vehicleInfo.mileage.toLocaleString()} KM
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="gradientBG mhidden gradientBGTrans text-[#FAEADC] px-[20px] 3xl:px-[40px] py-[16px] leading-[1] rounded-[10px] transition-colors"
                    >
                      {block.chengeLabel || "CHANGE"}
                    </button>
                  </div>
                )}

                <div className="bg-[#fafafa] dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-[#FAEADC]/10 rounded-[40px] px-[30px] py-[40px] h-fit flex flex-col gap-[30px] shadow-sm">
                  <h2 className="text-[32px] font-host dark:text-[#FAEADC] text-[#211d1d] font-extrabold uppercase leading-[1.1]">{cart.heading || "Cart"}</h2>
                  {cartItems.length === 0 ? (
                    // Empty cart UI
                    <div className="flex flex-col items-center justify-center py-10">
                      <Image
                        src={urlForImage(cart.emptyCartImage?.image)?.url() || ''}
                        alt={cart.emptyCartImage?.altText || ''}
                        width={240}
                        height={120}
                        className="mb-6"
                      />
                      <h3 className="text-xl font-bold mb-2">{cart.emptyCartHeading}</h3>
                      <p className="text-center text-[#FAEADC]/70 mb-4">{cart.emptyCartSubHeading}</p>
                    </div>
                  ) : (
                    // Cart content
                    <div className="flex flex-col gap-[40px]">
                      <div className="flex flex-col gap-[24px]">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
                            <div className="flex-1 pr-4">
                              <h3 className="font-host font-bold text-[18px] text-[#211d1d] dark:text-[#FAEADC]">{item.name}</h3>
                              <p className="font-host font-medium opacity-60 text-[12px] text-[#211d1d] dark:text-[#FAEADC] mt-1">
                                {item.hours ? `${item.hours}` : item.id === "pickup-drop" ? "Add pickup & drop off address" : ""}
                              </p>
                            </div>
                            <div className="flex gap-[12px] items-center">
                              {item.type === "product" && (
                                <div className="flex items-center gap-3 bg-[#eaeaea] dark:bg-[#202020] rounded-[6px] px-2 py-1 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                    className="text-[#211d1d] dark:text-white"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="font-host font-bold text-[12px] min-w-4 text-center text-[#211d1d] dark:text-white">
                                    {String(item.quantity || 1).padStart(2, '0')}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                    className="text-[#211d1d] dark:text-white"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              )}
                              <div className="text-right">
                                <span className="font-host font-bold text-[18px] text-[#211d1d] dark:text-[#FAEADC]">AED {item.price.toLocaleString()}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="bg-[rgba(192,0,52,0.08)] dark:bg-[rgba(192,0,52,0.15)] hover:bg-[rgba(192,0,52,0.15)] size-[30px] rounded-[8px] flex items-center justify-center transition-colors flex-shrink-0 text-[#C00034]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Upgrade Offer Banner */}
                      <div className="bg-[rgba(29,175,101,0.04)] hidden border border-[#1daf65]/10 rounded-[18px] px-6 py-4 flex gap-4 items-center">
                        <div className="bg-[#1daf65] text-white size-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                          %
                        </div>
                        <p className="font-host font-semibold text-[14px] text-[#1daf65]">
                          Upgrade to Minor Service and save AED 150.{" "}
                          <span className="text-[#801b01] font-bold cursor-pointer hover:underline">Click here</span>
                        </p>
                      </div>

                      {/* Estimated Total */}
                      <div className="flex flex-col gap-[24px]">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col">
                            <h3 className="font-host font-bold text-[24px] text-[#211d1d] dark:text-[#FAEADC]">Estimated total*</h3>
                            <p className="text-[12px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-1 max-w-[280px]">
                              *Actual cost may vary based on vehicle assessment
                            </p>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="font-host font-bold text-[24px] text-[#211d1d] dark:text-[#FAEADC]">
                              AED {calculateTotal().toLocaleString()}
                            </span>
                            <p className="text-[12px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-1 uppercase">
                              VAT included
                            </p>
                          </div>
                        </div>

                        {/* Apply Promo Box */}
                        <div className="bg-white hidden dark:bg-[#1a1a1a] border border-[#d9d9d9] dark:border-white/10 border-dashed rounded-[20px] px-6 py-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-all shadow-sm">
                          <div className="flex items-center gap-3">
                            <Image src="/images/delete-icon.svg" alt="promo" width={20} height={20} className="mb-0 hidden" />
                            <span className="font-host font-medium text-[14px] text-[#211d1d] dark:text-[#FAEADC]">Apply Promo Code</span>
                          </div>
                          <Image src="/images/angle-left.svg" alt="arrow" width={16} height={16} className="mb-0 dark:invert rotate-180" />
                        </div>
                      </div>

                      {/* Schedule Button */}
                      <button
                        onClick={handleConfirmAndBook}
                        disabled={finalSubmitLoader}
                        className={`bg-[#801b01] text-[#fcf3ed] w-full py-4 rounded-[12px] font-host font-extrabold uppercase text-[16px] leading-[1.5] transition-all hover:opacity-90 ${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""
                          }`}
                      >
                        {pickupServiceAdded && !pickupAddressCompleted
                          ? "ADD PICKUP & DROP OFF ADDRESS TO CONTINUE"
                          : cart?.scheduleLabel || "Schedule & pay at the workshop"}
                        {finalSubmitLoader && (
                          <Image
                            src="/images/infinite-spinner.svg"
                            alt="loading spinner"
                            width={30}
                            height={15}
                            className="loaderImage inline-block ml-2"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
        <style jsx global>{`
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
        
        .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .timeSwiper .swiper-slide {
          width: auto;
        }

        .time-swiper-button-prev.swiper-button-disabled,
        .time-swiper-button-next.swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      </div>

      {isServiceModalOpen && (
        <ServiceModal
          serviceList={serviceList}
          activeService={activeService}
          setActiveService={setActiveService}
          handleClose={() => setServiceIsModalOpen(false)}
          handleServiceSelection={handleServiceSelection}
        />
      )}

      {siteSettings &&
        <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettings} />
      }

      {/* Cart Section */}
      {CartOpen && isMobileDevice &&
        <div
          className={`min-w-[45%] md:w-[45%] fixed bottom-0 serviceCartPage  inset-0 z-50 backdropBlur-40 overflow-y-auto w-full h-full flex flex-col justify-end self-start`}
        >
          {block?.cartSection && block?.cartSection?.length > 0 && block?.cartSection?.slice(0, 1).map(cart => (
            <div key={cart._key} className="w-full sticky top-10 self-start">
              {/* Right side - Vehicle info */}
              {appointmentData?.brand && (
                <div className={`${isMobileDevice ? 'rounded-t-[30px] mobileCart bg-white dark:bg-black top-[20px]' : 'rounded-[40px] bg-white dark:bg-[#0A0A0A]'} border border-[#d9d9d9] dark:border-white/10 flex -mb-4 md:mb-0 max-md:p-5 w-full justify-between relative items-center gap-4 shadow-sm`}>
                  <div>
                    <h2 className="text-[16px] md:text-xl font-host font-extrabold dark:text-[#FAEADC] text-black uppercase">
                      {appointmentData?.model.toUpperCase()}, {appointmentData?.year}
                    </h2>
                    <p className="text-[10px] md:text-sm opacity-60 dark:text-[#FAEADC]/60 uppercase mt-1 font-host">
                      {vehicleInfo.fuelType} · {vehicleInfo.mileage.toLocaleString()} KM
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="border text-[12px] font-host font-bold uppercase border-[#C00034] text-[#C00034] rounded-[10px] px-4 py-2 hover:bg-[#C00034]/10 transition-colors"
                  >
                    {block.chengeLabel || "CHANGE"}
                  </button>
                </div>
              )}
              <div
                className={`${isMobileDevice ? 'rounded-t-[30px]' : 'rounded-[40px]'} w-full mt-5 relative`}
              >
                <div className={`${!isMobileDevice ? 'hidden' : ''} absolute ltr:right-[32px] rtl:left-[32px] top-[32px] cursor-pointer z-10`} onClick={() => dispatch(setCartPopup(false))}>
                  <Image
                    src="/images/icons/cross-icon.svg"
                    alt="cross icon"
                    width={20}
                    height={20}
                    className=""
                  />
                </div>
                <div className="bg-[#fafafa] dark:bg-[#0A0A0A] border border-[#d9d9d9] dark:border-[#FAEADC]/10 rounded-tr-[30px] rounded-tl-[30px] px-[24px] py-[2.1rem] h-fit flex flex-col gap-[30px] shadow-lg">
                  <h2 className="text-[26.6px] font-host dark:text-[#FAEADC] text-[#211d1d] font-extrabold uppercase leading-[1.1]">{cart.heading || "Cart"}</h2>

                  {cartItems.length === 0 ? (
                    // Empty cart UI
                    <div className="flex flex-col items-center justify-center py-10">
                      <Image
                        src={urlForImage(cart.emptyCartImage?.image)?.url() || ''}
                        alt={cart.emptyCartImage?.altText || ''}
                        width={240}
                        height={120}
                        className="mb-6"
                      />
                      <h3 className="text-xl font-bold mb-2">{cart.emptyCartHeading}</h3>
                      <p className="text-center text-[#FAEADC]/70 mb-4">{cart.emptyCartSubHeading}</p>
                    </div>
                  ) : (
                    // Cart content
                    <div className="flex flex-col gap-[30px]">
                      <div className="flex flex-col gap-[20px]">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
                            <div className="flex-1 pr-4">
                              <h3 className="font-host font-bold text-[16px] text-[#211d1d] dark:text-[#FAEADC]">{item.name}</h3>
                              <p className="font-host font-medium opacity-60 text-[11px] text-[#211d1d] dark:text-[#FAEADC] mt-0.5">
                                {item.hours ? `${item.hours}` : item.id === "pickup-drop" ? "Add pickup & drop off address" : ""}
                              </p>
                            </div>
                            <div className="flex gap-[10px] items-center">
                              {item.type === "product" && (
                                <div className="flex items-center gap-2 bg-[#eaeaea] dark:bg-[#202020] rounded-[6px] px-2 py-0.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                    className="text-[#211d1d] dark:text-white"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="font-host font-bold text-[11px] min-w-4 text-center text-[#211d1d] dark:text-white">
                                    {String(item.quantity || 1).padStart(2, '0')}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                    className="text-[#211d1d] dark:text-white"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              )}
                              <div className="text-right">
                                <span className="font-host font-bold text-[16px] text-[#211d1d] dark:text-[#FAEADC]">AED {item.price.toLocaleString()}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="bg-[rgba(192,0,52,0.08)] dark:bg-[rgba(192,0,52,0.15)] hover:bg-[rgba(192,0,52,0.15)] size-[28px] rounded-[6px] flex items-center justify-center transition-colors flex-shrink-0 text-[#C00034]"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Upgrade Offer Banner */}
                      <div className="bg-[rgba(29,175,101,0.04)] border border-[#1daf65]/10 rounded-[14px] px-4 py-3 flex gap-3 items-center">
                        <div className="bg-[#1daf65] text-white size-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          %
                        </div>
                        <p className="font-host font-semibold text-[12px] text-[#1daf65]">
                          Upgrade to Minor Service and save AED 150.{" "}
                          <span className="text-[#801b01] font-bold cursor-pointer hover:underline">Click here</span>
                        </p>
                      </div>

                      {/* Estimated Total */}
                      <div className="flex flex-col gap-[20px]">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col">
                            <h3 className="font-host font-bold text-[20px] text-[#211d1d] dark:text-[#FAEADC]">Estimated total*</h3>
                            <p className="text-[11px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-0.5 max-w-[200px]">
                              *Actual cost may vary based on vehicle assessment
                            </p>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="font-host font-bold text-[20px] text-[#211d1d] dark:text-[#FAEADC]">
                              AED {calculateTotal().toLocaleString()}
                            </span>
                            <p className="text-[11px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-0.5 uppercase">
                              VAT included
                            </p>
                          </div>
                        </div>

                        {/* Apply Promo Box */}
                        <div className="bg-white dark:bg-[#1a1a1a] border border-[#d9d9d9] dark:border-white/10 border-dashed rounded-[16px] px-4 py-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-all shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-host font-medium text-[13px] text-[#211d1d] dark:text-[#FAEADC]">Apply Promo Code</span>
                          </div>
                          <Image src="/images/angle-left.svg" alt="arrow" width={14} height={14} className="mb-0 dark:invert rotate-180" />
                        </div>
                      </div>

                      {/* Schedule Button */}
                      <button
                        onClick={handleConfirmAndBook}
                        disabled={finalSubmitLoader}
                        className={`bg-[#801b01] text-[#fcf3ed] w-full py-3.5 rounded-[10px] font-host font-extrabold uppercase text-[15px] leading-[1.5] transition-all hover:opacity-90 ${finalSubmitLoader ? "cursor-not-allowed opacity-65" : ""
                          }`}
                      >
                        {pickupServiceAdded && !pickupAddressCompleted
                          ? "ADD PICKUP & DROP OFF ADDRESS TO CONTINUE"
                          : cart?.scheduleLabel || "Schedule & pay at the workshop"}
                        {finalSubmitLoader && (
                          <Image
                            src="/images/infinite-spinner.svg"
                            alt="loading spinner"
                            width={30}
                            height={15}
                            className="loaderImage inline-block ml-2"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      }

    </>
  )
}
