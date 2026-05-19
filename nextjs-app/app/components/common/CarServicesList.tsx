"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Squircle } from "corner-smoothing"
import { getServiceList } from "@/app/actions/common/sanityData"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import type { CarServicesList, CustomImage, Service } from "@/sanity.types"
import ImageComp from "../CustomImage"
import { useTheme } from "next-themes";
import Image from "next/image"


interface carServiceListProps {
  block: {
    _type: string
    _key: string
    title: string
    description: string
    muchMore?: string
    browseAll?: string
    serviceCard?: Array<{
      _key: string
      _type: string
      title: string
      thumbnailImage: CustomImage
      selectServiceLink: string
      scheduleNow: string
    }>
  }
}

interface ServiceCardProps {
  service: {
    id: string
    title: string
    schedule: string
    thumbnail: CustomImage
    highlight?: boolean
    link: string
    currentLocale: string
  }
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function ServiceCard({ service, isHovered, onHover, onLeave }: ServiceCardProps) {
  const { currentLocale, link } = service;
  const { isMobileDevice } = useDeviceDetection()
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Link
      href={`/${currentLocale}/services/${(link as any)?.slug?.replace(/^ar\//, "") || ""}`}
      className={`h-[190px] min-h-[150px] md:h-[259px] overflow-hidden relative serviceCardList ${service.highlight ? "serviceCardListActive" : ""} transition-transform duration-300 ${isHovered ? "serviceCardListActive" : ""}`} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div
        className={`sListContent  h-full ${service.highlight ? "sListContentActive" : ""} transition-transform duration-300 ${isHovered ? "sListContentActive" : ""}`}>
        <div className=" flex flex-col">
          <h3 className=" dark:text-[#FAEADC] text-[#000000] text-[14px] 2xl:text-[20px] 3xl:text-[28px] body-l">
            {service?.title}
          </h3>
          <span className="text-[12px] mt-[6px] dark:text-white text-[#C00034] uppercase font-bold tracking-wider">{service?.schedule}</span>
          <div className="absolute bottom-0 serviceThumbnail ltr:right-0 rtl:right-0 md:h-auto h-[95px]  max-h-[127px] w-full">
            {service?.thumbnail?.altText && (
              <ImageComp
                block={service?.thumbnail}
                imageClassName="object-contain md:h-auto h-full w-full object-right-bottom ltr:max-h-[127px] rtl:max-h-[110px]"
                width={634}
                height={225}
              />
            )}
          </div>
        </div>
      </div>
      <Image className="absolute md:ltr:right-5 md:rtl:left-5 md:top-7 ltr:right-[10px] rtl:left-[10px] top-[28px]" width={16} height={16}
        alt="scroll down image"
        src={theme === "light" ? "/images/arrow-service-lightTheme.svg" : "/images/arrow-service-darkTheme.svg"}
      />
    </Link>
  )
}

export default function CarServicesList({ block }: carServiceListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { currentLocale, isMobileDevice } = useDeviceDetection()
  const [error, setError] = useState<string | null>(null)
  const [serviceData, setServiceData] = useState<Service[]>([])

  /*console.log("block", block);*/

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data: Service[] = await getServiceList({ locale: currentLocale })
        setServiceData(data)
      } catch (err: any) {
        console.error("Error fetching services:", err)
        setError(err.message)
      }
    }
    fetchServices()
  }, [currentLocale])


  // Determine what data to display
  const displayData = serviceData.length > 0 ? serviceData : [];

  return (
    <div id="carListHome" className="w-full mx-auto dark:bg-black bg-white text-white py-8 md:py-12 lg:py-16">
      <div className="container-grid">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-[20px] 2xl:gap-8 3xl:gap-10 cardListHome">
        {block.serviceCard?.slice(0, 7).map((service, index) => {
          const rawSlug = service.selectServiceLink || ""
          // const cleanedSlug = rawSlug.startsWith("ar/") ? rawSlug.replace(/^ar\//, "") : rawSlug;
          return (
            <ServiceCard
              key={service._key + index}
              service={{
                id: service._key,
                title: service.title || "Untitled",
                thumbnail: service.thumbnailImage || ({} as CustomImage),
                link: service?.selectServiceLink,
                currentLocale: currentLocale,
                highlight: false,
                schedule: service?.scheduleNow || "Schedule Now",
              }}
              isHovered={hoveredId === service._key}
              onHover={() => setHoveredId(service._key)}
              onLeave={() => setHoveredId(null)}
            />
          )
        })}

        {/* Browse All Card */}
        {!isMobileDevice &&
          <Link
            href={`/${currentLocale}/services`}
            className="relative hover:text-[#fff] hover:dark:bg-[#C00034] hover:bg-[#C00034] rounded-3xl overflow-hidden dark:bg-black border bg-[#F7F7F7] border-neutral-800 flex flex-col items-center justify-center p-6 md:p-8 min-h-[220px] md:min-h-[201px]"
          >
            <div className="text-center">
              <h3 className="text-sm dark:text-[#FAEADC] text-black md:text-[18px] font-medium font-urbanist mb-4">{block?.muchMore}</h3>
              <p className="inline-block dark:text-[#FAEADC] text-[12px] text-black tracking-wider font-urbanist transition-colors uppercase">
                {block?.browseAll}
              </p>
            </div>
          </Link>
        }
        {isMobileDevice &&
          <Squircle cornerRadius={isMobileDevice ? 9 : 12} className="mt-5 w-full relative block">
            <Link
              href={`/${currentLocale}/services`}
              className="inline-block px-6 min-w-full text-center m-0 py-3 gradientBG text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
            >
              {block?.browseAll}
            </Link>
          </Squircle>
        }
      </div>
      </div>
    </div>
  )
}