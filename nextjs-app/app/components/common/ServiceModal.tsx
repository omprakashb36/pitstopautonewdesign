'use client'

import Image from 'next/image'
import {  X } from 'lucide-react'
import { Squircle } from "corner-smoothing"
import { urlForImage } from "@/sanity/lib/utils"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import Link from "next/link"

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
  return (
    <Squircle
      cornerRadius={40}
      className="fixed inset-0 z-50 flex items-center justify-center backdropBlur-40 overflow-y-auto"
    >
      <div className="relative w-full max-w-[90%] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[30px] dark:bg-[#0f0f0f] bg-[#F7F7F7] p-8 md:p-12 my-4 mx-4">
        <button
          onClick={handleClose}
          className="absolute ltr:right-6 rtl:left-6 top-6 dark:text-white text-black hover:text-gray-300"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center mb-8">
            <h2 className="font-shoulders text-3xl md:text-4xl">
              <span className="dark:text-white text-black">BROWSE</span>{' '}
              <span className="text-[#c00034]">SERVICES</span>
            </h2>
          </div>

          <div className="grid gridColPopup grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceList.map((service) => {
              const isActive = service.id === activeService
              return (
                <button
                  type="button"
                  key={service.id}
                  className={`relative rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                  ${isActive
                      ? 'bg-[#c00034]/20 border border-[#c00034]'
                      : 'dark:bg-black/30 border dark:border-gray-700 border-black'
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
                  <div className="text-center">
                    <p
                      className={`${isActive ? 'text-[#c00034]' : 'dark:text-gray-300 text-black'
                        } font-medium`}
                    >
                      {service.title}
                    </p>
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
