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
  const bookingData: BookingFields = useSelector((state: RootState) => state.carService.bookingData)
  const isHydrated = usePersistHydration()
  const { currentLocale } = useDeviceDetection()
  const cartItemData: CartItem[] = useSelector((state: RootState) => state.carService.cartItemData)

  // Calculate dynamic subtotal and original subtotal from cartItemData
  const subtotal = (cartItemData || []).reduce((total, item) => {
    return total + ((item.price || 0) * (item.quantity || 1))
  }, 0)

  const originalSubtotal = (cartItemData || []).reduce((total, item) => {
    return total + (((item.originalPrice || item.price) || 0) * (item.quantity || 1))
  }, 0)

  function formatAppointmentDate(dateStr?: string, timeStr?: string): string {
    if (!dateStr || !timeStr) return "";
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

  useEffect(() => {
    if (!bookingData?.party_name) {
      window.location.href = "/en";
    }
  }, []);
  if (!isHydrated) {
    return <div className="min-h-[400px]"></div>
  }

  // Get booking summary split title
  const bookingSummaryTitle = block.BookingSummary?.title || "Booking Summary";
  const titleWords = bookingSummaryTitle.split(" ");
  const titleFirstWord = titleWords[0] || "Booking";
  const titleRest = titleWords.slice(1).join(" ") || "Summary";

  return (
    <>
      <div className="container-grid py-8 px-4 md:px-0 serviceBooked">

        {/* Header Row */}
        {block?.heading?.length ? (
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full richTextTitle">
              <PortableText
                value={block.heading as PortableTextBlock[]}
              />
            </div>
          </div>
        ) : null}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column - Booking Details Card */}
          <div className="lg:col-span-7 relative overflow-hidden bg-[#FAFAFA] dark:bg-black/40 border border-[#D9D9D9] dark:border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-[80px] min-h-[500px]">

            {/* Header Row of the Card */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 md:mb-10 gap-6 relative z-10">
              <h2 className="font-host font-normal leading-[1.1] text-[36px] md:text-[48px] lg:text-[60px] text-[#801B01] dark:text-[#FAEADC] tracking-normal whitespace-nowrap">
                #{bookingData?.name}
              </h2>

              <div className="bg-[#EAEAEA] dark:bg-zinc-800 rounded-[18px] px-5 py-3 md:px-[30px] md:py-[16px] flex items-center gap-3 md:gap-[16px] shrink-0 w-fit">
                <div className="bg-emerald-500 dark:bg-emerald-600 text-white rounded-full p-[3px] flex items-center justify-center shrink-0 w-6 h-6">
                  <Check size={14} strokeWidth={3} className="text-white" />
                </div>
                <p className="font-host font-bold text-[14px] md:text-[16px] leading-[1.5] text-[#211D1D] dark:text-[#FAEADC]">
                  {formatted}
                </p>
              </div>
            </div>

            {/* Solid Divider Line */}
            <div className="border-t border-[#D9D9D9] dark:border-white/10 my-8 relative z-10"></div>

            {/* Next Steps Content */}
            <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
              <div className="w-full md:w-3/5">

                <div className="steps text-[#211D1D] dark:text-[#FAEADC] font-host font-normal text-[16px] md:text-[18px] leading-[1.5]">
                  {block?.nextSteps?.steps?.length && (
                    <PortableText
                      value={block.nextSteps?.steps as PortableTextBlock[]}
                    />
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/5 hidden md:block"></div>
            </div>

            {/* Rotated Top-View Car Image Background on the Right */}
            <div className="absolute right-[-140px] bottom-[15%] w-[400px] lg:w-[480px] xl:w-[522px] h-[272px] pointer-events-none opacity-20 dark:opacity-30 md:opacity-90 hidden md:flex items-center justify-center z-0">
              <div className="origin-center scale-90 lg:scale-100">
                {block?.nextSteps?.stepsBackgroundImage ? (
                  <Image
                    src={urlForImage(block?.nextSteps?.stepsBackgroundImage?.image)?.url() || "/assets/e5bd83254a3701f400ec07f6cc6894da49099c07.png"}
                    alt="Car top view"
                    width={522}
                    height={272}
                    className="object-contain"
                  />
                ) : (
                  <img
                    src="/assets/e5bd83254a3701f400ec07f6cc6894da49099c07.png"
                    alt="Car top view"
                    className="w-[272px] h-[522px] object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Booking Summary Main Container */}
            <div className="bg-[#FAFAFA] dark:bg-black/40 border border-[#D9D9D9] dark:border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-[40px] flex flex-col justify-between">

              <div>
                <h2 className="font-host font-extrabold text-[24px] md:text-[32px] leading-[1.1] mb-6 md:mb-[30px]">
                  <span className="text-[#211D1D] dark:text-white">{titleFirstWord} </span>
                  <span className="text-[#FF3300]">{titleRest}</span>
                </h2>

                <div className="space-y-4">
                  {/* Selected Services Listing (Figma specs) */}
                  {cartItemData && cartItemData.length > 0 ? (
                    <div className="space-y-4">
                      {cartItemData.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-[#D9D9D9] dark:border-white/10 last:border-b-0">
                          <div>
                            <p className="font-host font-bold text-[16px] md:text-[18px] text-[#211D1D] dark:text-[#FAEADC]">{item.name}</p>
                            {item.hours && (
                              <p className="font-host font-medium text-[12px] opacity-60 text-[#211D1D] dark:text-[#FAEADC] mt-0.5">{item.hours} hours</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-host font-bold text-[16px] md:text-[18px] text-[#211D1D] dark:text-[#FAEADC]">AED {item.price}</p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="font-host font-medium text-[12px] opacity-80 text-[#211D1D] dark:text-[#FAEADC] line-through mt-0.5">AED {item.originalPrice}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2.5 text-[#211D1D]/60 dark:text-[#FAEADC]/60 font-host text-[14px]">
                      No services selected.
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-[#D9D9D9] dark:border-white/10 my-4"></div>

                  {/* Workshop Details Row */}
                  <div className="flex justify-between items-start py-2 border-b border-[#D9D9D9] dark:border-white/10">
                    <div>
                      <h3 className="font-host font-medium text-[#211D1D] dark:text-[#FAEADC] text-[14px] md:text-[16px]">{block.BookingSummary?.vehicleWorkshop}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-host font-bold text-[#211D1D] dark:text-white text-[14px] md:text-[16px]">{bookingData?.vehicle_workshop}</div>
                      <p className="text-[12px] font-host text-[#211D1D]/70 dark:text-[#FAEADC]/70 mt-0.5">
                        {block?.BookingSummary?.branchLabel} - {bookingData?.branch}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info Row */}
                  <div className="flex justify-between items-start py-2 border-b border-[#D9D9D9] dark:border-white/10">
                    <div>
                      <h3 className="font-host font-medium text-[#211D1D] dark:text-[#FAEADC] text-[14px] md:text-[16px]">{block?.BookingSummary?.custroInfo}</h3>
                    </div>
                    <div className="text-right text-[12px] md:text-[14px]">
                      <div className="font-host font-bold text-[#211D1D] dark:text-white">
                        {block?.BookingSummary?.nameLabel}: {bookingData?.customer_name}
                      </div>
                      <p className="font-host text-[#211D1D]/70 dark:text-[#FAEADC]/70 mt-0.5">
                        {block?.BookingSummary?.emialLabel}: {bookingData?.contact_email}
                      </p>
                      <p className="font-host text-[#211D1D]/70 dark:text-[#FAEADC]/70 mt-0.5">
                        {block?.BookingSummary?.contactLabel}: {bookingData?.contact_mobile}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Details Row */}
                  <div className="flex justify-between items-start py-2 border-b border-[#D9D9D9] dark:border-white/10">
                    <div>
                      <h3 className="font-host font-medium text-[#211D1D] dark:text-[#FAEADC] text-[14px] md:text-[16px]">{block?.BookingSummary?.vehicleDetails}</h3>
                    </div>
                    <div className="text-right text-[12px] md:text-[14px]">
                      <p className="font-host font-bold text-[#211D1D] dark:text-white">
                        {formatted}
                      </p>
                      <p className="font-host text-[#211D1D]/70 dark:text-[#FAEADC]/70 mt-0.5">
                        {block?.BookingSummary?.modelLabel}: {bookingData?.applies_to_item}
                      </p>
                      <p className="font-host text-[#211D1D]/70 dark:text-[#FAEADC]/70 mt-0.5">
                        {block?.BookingSummary?.plateNoLabel}: {bookingData?.vehicle_license_plate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Total Footer (Figma specs) */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#D9D9D9] dark:border-white/10">
                <div className="flex flex-col items-start">
                  <p className="font-host font-bold text-[20px] md:text-[24px] text-[#211D1D] dark:text-white leading-[1.5]">
                    Estimated total*
                  </p>
                  <p className="font-host font-normal text-[11px] md:text-[12px] opacity-80 text-[#211D1D] dark:text-[#FAEADC] mt-0.5">
                    *Actual cost may vary based on vehicle assessment
                  </p>
                </div>

                <div className="flex flex-col items-end text-right">
                  <p className="font-host font-bold text-[20px] md:text-[24px] text-[#211D1D] dark:text-white leading-[1.5]">
                    AED {subtotal?.toLocaleString()}
                  </p>
                  <p className="font-host font-normal text-[11px] md:text-[12px] opacity-80 text-[#211D1D] dark:text-[#FAEADC] uppercase mt-0.5">
                    VAT included
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons (Figma & original code mapping) */}
            <div className="flex flex-col sm:flex-row gap-4 hidden">
              <Squircle cornerRadius={12} className="flex-1 block">
                <button className="bg-[#801B01] hover:bg-[#A32202] text-[#FAEADC] py-3.5 px-6 w-full text-xs font-bold font-host rounded-xl transition-all duration-300 uppercase tracking-wider">
                  DOWNLOAD INVOICE
                </button>
              </Squircle>
              <button className="border border-[#801B01] dark:border-[#FAEADC] hover:bg-[#801B01] hover:text-[#FAEADC] dark:hover:bg-[#FAEADC] dark:hover:text-black text-[#801B01] dark:text-[#FAEADC] text-xs font-bold py-3.5 px-6 rounded-xl font-host transition-all duration-300 uppercase tracking-wider flex-1">
                MANAGE BOOKING
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

