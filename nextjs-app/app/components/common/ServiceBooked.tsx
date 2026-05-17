"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { Squircle } from "corner-smoothing"
import { BookingFields } from "@/app/lib/types/types"
import { useSelector } from "react-redux"
import { RootState } from "@/app/lib/redux/store"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import Link from "next/link"
import { ServiceBooked } from "@/sanity.types"
import { PortableText, PortableTextBlock } from "next-sanity"
import { urlForImage } from "@/sanity/lib/utils"
import { useEffect } from "react"
import type { CartItem } from "../../lib/types/types"

type ServiceBookedProps = {
  block: ServiceBooked;
  index: number;
}
interface BookingItem {
  name: string
  price: number
  originalPrice?: number
  hours?: number
  quantity?: number
  address?: string
}

interface BookingDetails {
  appointmentNumber: string
  appointmentDate: string
  appointmentTime: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  vehicleFuelType: string
  vehicleMileage: number
  items: BookingItem[]
}

export default function ServiceBookedComp({ block }: ServiceBookedProps) {
  // Sample booking details
  const booking: BookingDetails = {
    appointmentNumber: "APT-038907",
    appointmentDate: "24th March 2024",
    appointmentTime: "1:30pm",
    vehicleMake: "BMW",
    vehicleModel: "Z4",
    vehicleYear: 2018,
    vehicleFuelType: "PETROL",
    vehicleMileage: 20000,
    items: [
      {
        name: "Basic Service",
        price: 350,
        originalPrice: 425,
        hours: 6,
      },
      {
        name: "Bridgestone Dueler HP Sport",
        price: 3483,
        hours: 2,
        quantity: 4,
      },
      {
        name: "Pickup & Drop Service",
        price: 150,
        originalPrice: 250,
        address: "120, Abc Residency, Dubai, UAE",
      },
    ],
  }

  // Calculate subtotal
  const subtotal = booking.items.reduce((total, item) => {
    if (item.quantity) {
      return total + item.price * item.quantity
    }
    return total + item.price
  }, 0)

  // Format day of week
  const getDayOfWeek = (dateString: string) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Extract date parts from string like "24th March 2024"
    const parts = dateString.split(" ")
    const day = Number.parseInt(parts[0].replace(/\D/g, ""))
    const month = months.indexOf(parts[1])
    const year = Number.parseInt(parts[2])

    const date = new Date(year, month, day)
    return days[date.getDay()]
  }

  const bookingData: BookingFields = useSelector((state: RootState) => state.carService.bookingData)
  const isHydrated = usePersistHydration()
  const { currentLocale } = useDeviceDetection()

  function formatAppointmentDate(dateStr: string, timeStr: string): string {
    const fullDateTime = new Date(`${dateStr}T${timeStr}`);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[fullDateTime.getDay()];
    const date = fullDateTime.getDate();
    const monthName = months[fullDateTime.getMonth()];
    const year = fullDateTime.getFullYear();

    // Get ordinal (st, nd, rd, th)
    const ordinal = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    // Format time (hh:mm am/pm)
    let hours = fullDateTime.getHours();
    const minutes = fullDateTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert 0 to 12
    const timeFormatted = `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    return `${dayName}, ${date}${ordinal(date)} ${monthName} ${year} at ${timeFormatted}`;
  }

  const formatted = formatAppointmentDate(bookingData?.scheduled_date, bookingData?.scheduled_time);

  const cartItemData: CartItem[] = useSelector((state: RootState) => state.carService.cartItemData)

  useEffect(() => {
    if (!bookingData?.party_name) {
      window.location.href = "/en";
    }
  }, []);

  if (!isHydrated) {
    return <div></div>
  }

  return (
    <>
      <div className="px-4 xl:px-[60px] 3xl:px-[140px] py-8 md:py-12 serviceBooked">
        {/* Breadcrumb */}
        <div className="dark:text-[#FAEADC] text-black flex items-center gap-2 text-sm mb-6">
          <Link href={`${currentLocale}/services`}>{block?.titles?.title}</Link>
          <span>/</span>
          <span>{block?.titles?.subTitle}</span>
        </div>

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">

            {block?.heading?.length && (
              <PortableText
                value={block.heading as PortableTextBlock[]}
              />
            )}

          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Booking Details */}
          <div className="dark:bg-black/40 bg-[#F7F7F7] rounded-[20px] p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-4xl font-shoulders font-normal tracking-wider text-[#000] dark:text-[#FAEADC]">#{bookingData?.name}</h2>
              <div className="dark:bg-emerald-900/60 bg-[#E5E5E5] dark:text-emerald-400 text-black font-urbanist px-4 py-2 rounded-md flex items-center gap-2 mt-4 md:mt-0">
                <Check size={18} className="text-emerald-400" />
                <span className="font-urbanist font-medium">
                  {formatted}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 my-6"></div>
            <div className="flex flex-col md:flex-row gap-6 steps">
              <div className="md:w-3/5">
                {block?.nextSteps?.steps?.length && (
                  <PortableText
                    value={block.nextSteps?.steps as PortableTextBlock[]}
                  />
                )}
              </div>
              <div className="md:w-2/5 flex items-center justify-center md:justify-end">
                {block?.nextSteps?.stepsBackgroundImage && (
                  <Image
                    src={urlForImage(block?.nextSteps?.stepsBackgroundImage?.image)?.url() || ""}
                    alt="Car top view"
                    width={400}
                    height={200}
                    className=" opacity-80"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="dark:bg-black/40 bg-[#F7F7F7] rounded-lg p-6 hidden flex items-center gap-4">
              <div className="bg-white hidden rounded-full p-2 w-16 h-16 flex items-center justify-center">
                <Image src="/images/bmw-logo.svg" alt="BMW Logo" width={50} height={50} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {bookingData?.applies_to_item_name}
                </h2>
                <p className="text-[#FAEADC]/70 uppercase">
                  {bookingData?.applies_to_variant_of_name} {bookingData?.vehicle_license_plate}
                </p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="dark:bg-black/40 bg-[#F7F7F7] rounded-[20px] p-6">
              <h2 className="text-2xl font-shoulders font-normal text-[#000] dark:text-[#FAEADC] mb-6">{block.BookingSummary?.title}</h2>

              <div className="space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-medium text-[#000] dark:text-[#FAEADC]">{block.BookingSummary?.vehicleWorkshop}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#000] dark:text-[#FAEADC]">{bookingData?.vehicle_workshop}</div>
                      <p className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                        {block?.BookingSummary?.branchLabel} - {bookingData?.branch}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-medium text-[#000] dark:text-[#FAEADC]">{block?.BookingSummary?.custroInfo}</h3>

                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#000] dark:text-[#FAEADC]">{block?.BookingSummary?.nameLabel} : {bookingData?.customer_name}</div>
                      <p className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                        {block?.BookingSummary?.emialLabel} : {bookingData?.contact_email}
                      </p>
                      <p className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                        {block?.BookingSummary?.contactLabel} : {bookingData?.contact_mobile}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-medium text-[#000] dark:text-[#FAEADC]">{block?.BookingSummary?.vehicleDetails}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#000] dark:text-[#FAEADC]">
                        {formatted}
                      </p>

                      <p className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                        {block?.BookingSummary?.modelLabel} : {bookingData?.applies_to_item}
                      </p>
                      <p className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                        {block?.BookingSummary?.plateNoLabel}: {bookingData?.vehicle_license_plate}
                      </p>


                    </div>
                  </div>
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-medium text-[#000] dark:text-[#FAEADC]">Selected Services</h3>
                    </div>
                    <div className="text-right">

                      {cartItemData.map((item) => (

                        <p key={item.id} className="text-sm text-[#000] dark:text-[#FAEADC]/70">
                          {item.name}
                        </p>
                      ))}


                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="pt-4 hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xl">Subtotal</h3>
                      <p className="text-xs text-[#FAEADC]/70">{booking?.items?.length} ITEMS</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl">AED {subtotal?.toLocaleString()}</p>
                      <p className="text-xs text-[#FAEADC]/70">VAT INCLUDED</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 hidden">
              <Squircle cornerRadius={10} className="flex-1 min-w-[50%] block">
                <button className="gradientBG text-[#FAEADC] px-[26px] w-full py-[13px] block rounded-lg">
                  DOWNLOAD INVOICE
                </button>
              </Squircle>
              <button className="border border-[#FAEADC] text-[12px] text-[#FAEADC] px-[26px] py-[13px] rounded-lg font-bold flex-1 hover:gradientBG transition-colors">
                MANAGE BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

