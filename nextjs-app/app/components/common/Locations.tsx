"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Navigation } from "lucide-react"
import Select from "react-select"
import PortableText from "@/app/components/PortableText"
import type { PortableTextBlock } from "next-sanity"
import type { Location } from "@/sanity.types"
import { selectStyles, selectClassNames } from "@/app/utils/formStyles"

type LocationProps = {
  block: Location
  index: number
}

// Use a more standard media query approach
const useDeviceDetection = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobileDevice(e.matches);
    
    // Initial check
    setIsMobileDevice(mql.matches);

    // Modern listener
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return { isMobileDevice };
};

export default function Locations({ block }: LocationProps) {
  const { isMobileDevice } = useDeviceDetection()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })
  const [toggle, setToggle] = useState(false)

  const [activeLocation, setActiveLocation] = useState("A")
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  const allServices = Array.from(
    new Set(
      block?.locations?.flatMap(
        (loc) =>
          loc.relatedServices?.map((service) => {
            // service can be either a populated object with slug/title or a reference {_ref: string}
            const id = (service as any)?.slug?.current || (service as any)?._ref || ""
            const title = (service as any)?.title || ""
            return { id, title }
          }) || [],
      ) || [],
    ),
  ).reduce(
    (acc, service) => {
      if (!acc.find((s) => s.id === service.id)) {
        acc.push(service)
      }
      return acc
    },
    [] as Array<{ id: string; title: string }>,
  )

  const serviceOptions = [
    { value: "all", label: "All services" },
    ...allServices.map((service) => ({
      value: service.id,
      label: service.title,
    })),
  ]

  const availableLocations =
    selectedService === "all"
      ? block?.locations
      : block?.locations?.filter((location) =>
          location.relatedServices?.some((service) => (service as any)?.slug?.current === selectedService),
        )

  const locationOptions = [
    { value: "all", label: "All locations" },
    ...(availableLocations?.map((location) => ({
      value: location.mapId || "",
      label: location.title || "",
    })) || []),
  ]

  const filteredLocations = block?.locations?.filter((location) => {
    const serviceMatch =
      selectedService === "all" ||
      location.relatedServices?.some((service) => (service as any)?.slug?.current === selectedService)

    const locationMatch = selectedLocation === "all" || location.mapId === selectedLocation

    return serviceMatch && locationMatch
  })

  useEffect(() => {
    console.log("Filtered Locations Data:", {
      selectedService,
      selectedLocation,
      filteredLocations,
      totalLocations: filteredLocations?.length || 0,
    })
  }, [selectedService, selectedLocation, filteredLocations])

  useEffect(() => {
    if (selectedService !== "all" && selectedLocation !== "all") {
      const isLocationAvailable = availableLocations?.some((loc) => loc.mapId === selectedLocation)
      if (!isLocationAvailable) {
        setSelectedLocation("all")
      }
    }
  }, [selectedService, selectedLocation, availableLocations])

  useEffect(() => {
    if (isDropdownOpen && isMobileDevice) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [isDropdownOpen, isMobileDevice])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("location-dropdown")
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLocationSelect = (locationId: string) => {
    setActiveLocation(locationId)
    if (isMobileDevice) {
      setIsDropdownOpen(false)
    }
  }

  const activeLocationDetails = filteredLocations?.find((loc) => loc.mapId === activeLocation)

  const getMarkerPosition = (location: any) => {
    const pixelX = (location?.x / 100) * mapDimensions.width
    const pixelY = (location?.y / 100) * mapDimensions.height

    return {
      left: `${pixelX}px`,
      top: `${pixelY}px`,
    }
  }

  const CustomMenuList = (props: any) => {
    const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
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

  const customComponents = {
    MenuList: CustomMenuList,
  }

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

  return (
    <section className="text-white">
      {block?.showFilters && (
        <div className="px-5 md:px-[116px] py-8 md:pt-0">
          <div className="max-w-[1080px] mx-auto relative z-40 px-4 md:mb-10">
            <h3 className="text-xl font-semibold mb-4 dark:text-[#faeadc] text-black">Search via city / service</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="formLabel border dark:border-white/20  border-black/20 rounded-[15px] space-y-2 flex-1 p-4">
                <label
                  className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase"
                  htmlFor="service-select"
                >
                  Select Service
                </label>
                <Select
                  id="service-select"
                  name="service"
                  options={serviceOptions}
                  styles={customSelectStyles}
                  classNames={selectClassNames}
                  components={customComponents}
                  value={serviceOptions.find((option) => option.value === selectedService)}
                  onChange={(newValue: unknown) => {
                    const option = newValue as { value: string; label: string } | null
                    setSelectedService(option?.value || "all")
                  }}
                  placeholder="All services"
                  isSearchable={!isMobileDevice}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  menuPosition="fixed"
                  menuPlacement="auto"
                  captureMenuScroll={false}
                  closeMenuOnScroll={(event) => {
                    return event.target === document
                  }}
                  onMenuOpen={() => {
                    if (isMobileDevice) {
                      document.body.style.overflow = "hidden"
                    }
                  }}
                  onMenuClose={() => {
                    if (isMobileDevice) {
                      document.body.style.overflow = "unset"
                    }
                  }}
                />
              </div>

              <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2 flex-1 p-4">
                <label
                  className="block font-fustat dark:text-[#faeadc] text-black text-xs uppercase"
                  htmlFor="location-select"
                >
                  Select Location
                </label>
                <Select
                  id="location-select"
                  name="location"
                  options={locationOptions}
                  styles={customSelectStyles}
                  classNames={selectClassNames}
                  components={customComponents}
                  value={locationOptions.find((option) => option.value === selectedLocation)}
                  onChange={(newValue: unknown) => {
                    const option = newValue as { value: string; label: string } | null
                    const locationValue = option?.value || "all"
                    setSelectedLocation(locationValue)
                    if (locationValue !== "all") {
                      setActiveLocation(locationValue)
                    }
                  }}
                  placeholder="All locations"
                  isSearchable={!isMobileDevice}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  menuPosition="fixed"
                  menuPlacement="auto"
                  captureMenuScroll={false}
                  closeMenuOnScroll={(event) => {
                    return event.target === document
                  }}
                  onMenuOpen={() => {
                    if (isMobileDevice) {
                      document.body.style.overflow = "hidden"
                    }
                  }}
                  onMenuClose={() => {
                    if (isMobileDevice) {
                      document.body.style.overflow = "unset"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileDevice && !block?.showFilters && !toggle && (
        <div className="px-5 my-12 hidden">
          <div className="relative block">
            <button
              onClick={() => setToggle(true)}
              className="block w-full px-6 py-3 gradientBG rounded-xl text-[#FAEADC] font-urbanist font-medium hover:bg-[#FAEADC] transition-colors"
            >
              {block?.mobileButton}
            </button>
          </div>
        </div>
      )}

      <div
        className={`${toggle || block?.showFilters ? "mobileNavToggle" : "mobileNavToggle"} relative mapLocation lg:h-screen`}
      >
        <div className={`lg:w-[500px] z-10 lg:absolute left-0 top-12 lg:pl-[40px] xl:pl-[116px] ${isMobileDevice ? "w-full px-4" : ""}`}>
          <div className="mb-8">
            <h1 className="text-[30px] md:text-start text-center text-[#FAEADC] md:text-6xl font-semibold font-shoulders">
              {block?.heading}
            </h1>
          </div>

          <div className="dark:bg-[#1A1A1A] navContainer rounded-[25px] bg-white md:px-[43px] md:py-[41px] px-[20px] py-[20px] mb-0">
            <h2 className="md:text-[49px] leading-[1] text-[28px] text-[#FAEADC] font-shoulders sandDrift mb-8">
              {block?.subHeading}
            </h2>

            
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-6">
                  {filteredLocations?.map((location) => (
                    <div
                      key={location.mapId}
                      className={`flex items-center cursor-pointer transition-colors duration-300 ${
                        activeLocation === location.mapId ? "text-[#C00034]" : "text-gray-500"
                      }`}
                      onClick={() => handleLocationSelect(location.mapId!)}
                      onMouseEnter={() => setHoveredLocation(location.mapId!)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      <div
                        className={`min-w-10 min-h-10 ltr:mr-2 rtl:ml-2 rounded-full flex items-center justify-center ${
                          activeLocation === location.mapId ? "bg-red-600 text-white" : "dark:bg-gray-800 bg-gray-50"
                        }`}
                      >
                        <span className="font-shoulders font-normal text-[25px]">{location.mapId}</span>
                      </div>
                      <div>
                        <p className={`font-urbanist font-bold text-[20px] `}>{location.title}</p>
                        <p className="text-sm">{location.serviceName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            
          </div>
        </div>

        <div className="w-full md:h-full relative" ref={mapContainerRef}>
          <div className="w-full h-full relative">
            <Image
              src="/images/uae-map.webp"
              alt="Map of Pitstop locations in UAE"
              fill
              className="object-cover md:absolute mapImage"
              priority
              onLoad={() => {
                setTimeout(() => {
                  if (mapContainerRef.current) {
                    const { width, height } = mapContainerRef.current.getBoundingClientRect()
                    setMapDimensions({ width, height })
                  }
                }, 50)
              }}
            />
          </div>

          {mapDimensions.width > 0 &&
            mapDimensions.height > 0 &&
            filteredLocations?.map((location) => {
              const markerPosition = getMarkerPosition(location?.coordinates as any)

              return (
                <div
                  key={location.mapId}
                  className="absolute locationPointsCntr"
                  style={{
                    left: markerPosition.left,
                    top: markerPosition.top,
                    transform: "translate(-50%, -50%)",
                    zIndex: hoveredLocation === location.mapId || activeLocation === location.mapId ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredLocation(location.mapId!)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <div
                    className={`w-8 h-8 rounded-full locationPoints flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      activeLocation === location.mapId ? "bg-red-600" : "bg-white"
                    } ${hoveredLocation === location.mapId ? "scale-110" : ""}`}
                    
                  >
                    <span className={`font-bold ${activeLocation === location.mapId ? "text-white" : "text-black"}`}>
                      {location.mapId}
                    </span>
                  </div>

                  {(hoveredLocation === location.mapId || activeLocation === location.mapId) && (
                    <div
                      className={`
      absolute 
      md:left-1/2 md:-translate-x-1/2 rtl:md:right-1/2 rtl:md:translate-x-1/2 
      right-0 rtl:left-0 
      md:top-[-140px] top-[-40px] 
      mb-2 md:w-[350px] w-[240px] 
      dark:bg-black bg-white shadow-lg locationPopup p-4 z-20 rounded-[1.5rem] border-[1px] border-[#c00034]
    `}
                    >
                      <div className="mb-2">
                        <h3 className="font-urbanist font-bold text-[#C00034] mb-0 leading-1">{location.poptitle}</h3>
                        <p className="md:text-sm text-[11px] dark:text-gray-300 text-[#343232] font-bold mb-2">
                          {location.serviceName}
                        </p>
                      </div>

                      <div className="flex items-start gap-4 mb-2">
                        <Image
                          src="/images/map-icon.svg"
                          alt="Location"
                          width={24}
                          height={24}
                          className="flex-shrink-0"
                        />
                        <div className="text-2xl text-[#000000] whitespace-pre-line">
                          {location?.address?.length && (
                            <PortableText
                              className="text-sm dark:text-gray-300"
                              value={location?.address as PortableTextBlock[]}
                            />
                          )}
                        </div>
                      </div>

                      {location?.phoneNo && (
                        <div className="flex items-center gap-4 mb-2">
                          <Image
                            src="/images/phone-icon.svg"
                            alt="Phone"
                            width={24}
                            height={24}
                            className="flex-shrink-0"
                          />
                          <p className="text-sm text-[#000000] dark:text-gray-300 font-medium">{location.phoneNo}</p>
                        </div>
                      )}

                      <div className="border-t border-gray-300 mb-2" />

                      <div className="flex items-start gap-4">
                        <Image
                          src="/images/calendar-icon.svg"
                          alt="Hours"
                          width={24}
                          height={24}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#000000] dark:text-gray-300">{location.timingLabel1}</span>
                            <span className="text-sm text-[#000000] dark:text-gray-300 font-medium">
                              {location.workingHours}
                            </span>
                          </div>

                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-[#000000] dark:text-gray-300">
                              {location?.fridayTiming?.fridayTimingLabel}
                            </span>
                            <div className="text-right">
                              <p className="text-sm text-[#000000] dark:text-gray-300 font-medium">
                                {location?.fridayTiming?.morning}
                              </p>
                              <p className="text-sm text-[#000000] dark:text-gray-300 font-medium">
                                {location?.fridayTiming?.evening}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#000000] dark:text-gray-300">{location.timingLabel3}</span>
                            <span className="text-sm text-[#000000] dark:text-gray-300 font-medium">
                              {location.saturdayTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {location.mapUrl && (
                        <div className="mt-6">
                          <a
                            href={location.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors duration-200"
                          >
                            <Navigation className="w-3.5 h-3.5 mr-1.5" />
                            Get Directions
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
