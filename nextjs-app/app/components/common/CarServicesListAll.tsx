"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Squircle } from "corner-smoothing"
import { Service } from "@/sanity.types"
import ImageComp from "../CustomImage"
import useDeviceDetection from "../../hooks/useDeviceDetection"

type ServicesProps = {
  services: Service[] // <- Array instead of single object
}

export default function CarServicesListAll({ services }: ServicesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[60px] 3xl:px-[116px] dark:bg-black bg-[#fff] text-white py-8 md:py-12 md:pt-0">
      <div className="grid carServiceList grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-[40px]">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            isHovered={hoveredId === service._id}
            onHover={() => setHoveredId(service._id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function ServiceCard({ service, isHovered, onHover, onLeave }: ServiceCardProps) {

  const title = service.title || "Untitled Service"
  const slug = service.slug?.current || "#"
  const { currentLocale } = useDeviceDetection()

  return (
    <Link
      href={`/${currentLocale}/services/${(slug as string)?.replace(/^ar\//, "") || ""}`}
      className={`h-[190px] min-h-[150px] md:h-[203px] overflow-hidden relative serviceCardList transition-transform duration-300 ${isHovered ? "serviceCardListActive" : ""}`} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div
        className={`sListContent h-full transition-transform duration-300 ${isHovered ? "sListContentActive" : ""}`}>
        <div className=" flex flex-col">
          <h3 className="text-[1rem] md:text-[23px] dark:text-[#FAEADC] text-black leading-[1] uppercase font-semibold font-shoulders">
            {title}
          </h3>
          <span className="text-[10px] mt-[6px] dark:text-white text-[#C00034] font-bold tracking-wider font-urbanist uppercase">{service?.shceduleNow || 'SCHEDULE NOW'}</span>

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
    </Link>
  )
}
