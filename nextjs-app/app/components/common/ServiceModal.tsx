'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { Squircle } from "corner-smoothing"
import { urlForImage } from "@/sanity/lib/utils"
import useDeviceDetection from "../../hooks/useDeviceDetection"

type Service = {
  id: string
  title?: string
  slug?: string
  serviceIcon?: any
}

type Props = {
  serviceList: Service[]
  activeService: string | null
  setActiveService: (id: string) => void
  handleClose: () => void
  handleServiceSelection: (slug?: string) => void
}

const ServiceModal = ({
  serviceList,
  activeService,
  setActiveService,
  handleClose,
  handleServiceSelection,
}: Props) => {
  const { currentLocale } = useDeviceDetection()
  
  // Helper function to split service title for modern design styling
const splitServiceTitle = (title: string) => {
  if (title.includes("&")) {
    const idx = title.indexOf("&")
    return [title.substring(0, idx + 1).trim(), title.substring(idx + 1).trim()]
  }
  // Try splitting by space
  const words = title.split(" ")
  if (words.length > 1) {
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
  }
  return [title, ""]
}

  return (
    <Squircle
      cornerRadius={40}
      className="fixed inset-0 z-50 flex items-center justify-center backdropBlur-40 overflow-y-auto"
    >
      <div className="relative w-full max-w-[1200px] 3xl:max-w-[1360px] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[30px] dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 md:p-[60px] 3xl:p-[80px] my-4 mx-4">
        <button
          onClick={handleClose}
          className="absolute ltr:right-8 rtl:left-8 top-8 md:ltr:right-[80px] md:rtl:left-[80px] md:top-[80px] dark:text-white text-black hover:text-gray-300"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center mb-8">
            <h2 className="font-host text-3xl md:text-4xl">
              <span className="dark:text-white text-black">BROWSE</span>{' '}
              <span className="text-[#c00034]">SERVICES</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[24px] w-full">
            {serviceList.map((service) => {
              const isActive = service.id === activeService
              const [line1, line2] = splitServiceTitle(service.title || "")
              return (
                <button
                  type="button"
                  key={service.id}
                  className={`relative rounded-[40px] p-[24px] flex flex-col justify-between items-start cursor-pointer transition-all duration-300 w-full aspect-square max-w-[180px] mx-auto border
                      ${isActive
                        ? "bg-[#FF3300]/[0.05] border-[#FF3300]"
                        : "bg-transparent border-[#898989] dark:border-white/20 hover:border-[#FF3300]/50"
                      }`}
                  onClick={() => {
                    setActiveService(service.id);
                    window.location.href = `/${currentLocale}/services/${service.slug?.replace(/^ar\//, "")}`;
                  }}
                >
                  <div className={isActive ? 'text-[#c00034]' : 'text-white'}>
                    {service?.serviceIcon && (
                      <Image
                        src={urlForImage(service.serviceIcon)?.url() || ''}
                        alt={service.title || 'Service Icon'}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                  <div className="[word-break:break-word] flex ltr:text-left flex-col font-host font-bold items-start leading-[1.5] text-[16px] w-full mt-auto">
                      <div className={isActive ? "text-[#FF3300]" : "text-[#393D45] dark:text-gray-300"}>
                        {line1}
                      </div>
                      {line2 && (
                        <div className={isActive ? "text-[#801B01]" : "text-[#393D45] dark:text-gray-300"}>
                          {line2}
                        </div>
                      )}
                    </div>
                </button>
              )
            })}
          </div>


        </div>
      </div>
    </Squircle>
  )
}

export default ServiceModal
