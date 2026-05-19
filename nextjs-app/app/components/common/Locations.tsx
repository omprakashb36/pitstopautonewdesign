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
import Link from "next/link"

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
    <section className="text-pitstop-oil-black dark:text-white bg-white dark:bg-black">
      {/* 
        ========================================================
        FILTERS SECTION - GRID ALIGNED
        ======================================================== 
      */}
      {block?.showFilters && (
        <div className="container-grid mx-auto w-full px-6 lg:px-0 py-8 lg:py-12 z-40 relative">
          <h3 className="text-[20px] font-bold mb-4 font-host rtl:font-cairo">Search via city / service</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2 flex-1 p-4">
              <label
                className="block font-host rtl:font-cairo opacity-60 text-xs uppercase"
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
                closeMenuOnScroll={(event) => event.target === document}
                onMenuOpen={() => { if (isMobileDevice) document.body.style.overflow = "hidden" }}
                onMenuClose={() => { if (isMobileDevice) document.body.style.overflow = "unset" }}
              />
            </div>

            <div className="formLabel border dark:border-white/20 border-black/20 rounded-[15px] space-y-2 flex-1 p-4">
              <label
                className="block font-host rtl:font-cairo opacity-60 text-xs uppercase"
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
                closeMenuOnScroll={(event) => event.target === document}
                onMenuOpen={() => { if (isMobileDevice) document.body.style.overflow = "hidden" }}
                onMenuClose={() => { if (isMobileDevice) document.body.style.overflow = "unset" }}
              />
            </div>
          </div>
        </div>
      )}

      {isMobileDevice && !block?.showFilters && !toggle && (
        <div className="px-6 my-8 hidden">
          <button
            onClick={() => setToggle(true)}
            className="block w-full px-6 py-4 bg-pitstop-fiery-orange rounded-xl text-white font-host font-bold hover:bg-pitstop-fiery-orange/90 transition-colors"
          >
            {block?.mobileButton}
          </button>
        </div>
      )}

      {/* 
        ========================================================
        MAP & LOCATIONS SECTION
        ======================================================== 
      */}
      <div className="relative w-full bg-[#f7f7f7] dark:bg-[#121212] lg:h-[1000px] 3xl:h-[1274px]">
        
        {/* Absolute Full-Width Map Background Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" ref={mapContainerRef}>
          <Image
            src="/images/uae-map.webp"
            alt="Map of Pitstop locations in UAE"
            fill
            className="object-cover opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
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

        {/* Interactive Markers Layer (Absolute to Map) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {mapDimensions.width > 0 && mapDimensions.height > 0 &&
            filteredLocations?.map((location) => {
              const markerPosition = getMarkerPosition(location?.coordinates as any)
              const isActive = activeLocation === location.mapId
              const isHovered = hoveredLocation === location.mapId

              return (
                <div
                  key={location.mapId}
                  className="absolute pointer-events-auto"
                  style={{
                    left: markerPosition.left,
                    top: markerPosition.top,
                    transform: "translate(-50%, -50%)",
                    zIndex: isHovered || isActive ? 50 : 10,
                  }}
                  onMouseEnter={() => setHoveredLocation(location.mapId!)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  {/* The Dot */}
                  <div
                    className={`w-[44px] h-[44px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
                      isActive ? "bg-pitstop-fiery-orange text-white" : "bg-pitstop-oil-black dark:bg-[#2A2A2A] text-white"
                    } ${isHovered ? "scale-110" : ""}`}
                    onClick={() => handleLocationSelect(location.mapId!)}
                  >
                    <span className="font-host font-bold text-[28px] uppercase mt-1">
                      {location.mapId}
                    </span>
                  </div>

                  {/* The Popup Box */}
                  {(isHovered || isActive) && (
                    <div
                      className={`
                        absolute 
                        left-1/2 -translate-x-1/2 rtl:translate-x-1/2
                        top-[5%] mb-4 w-[320px] md:w-[400px]
                        bg-white dark:bg-[#1A1A1A] shadow-xl p-[24px] 
                        rounded-[30px] locationAddressTxt border border-pitstop-fiery-orange z-50
                      `}
                    >
                      <div className="mb-4">
                        <h3 className="font-host font-bold text-[24px] text-pitstop-oil-black dark:text-white capitalize mb-1 leading-[1.2]">
                          {location.poptitle}
                        </h3>
                        <p className="text-[12px] font-host font-medium opacity-80 text-pitstop-oil-black dark:text-white">
                          {location.serviceName}
                        </p>
                      </div>

                      <div className="flex items-start gap-[11px] mb-4">
                        <Navigation className="w-[24px] h-[24px] shrink-0 text-pitstop-oil-black dark:text-white" />
                        <div className="text-[16px] font-host text-pitstop-oil-black dark:text-white whitespace-pre-line leading-[1.5]">
                          {location?.address?.length && (
                            <PortableText value={location?.address as PortableTextBlock[]} />
                          )}
                        </div>
                      </div>

                      {location?.phoneNo && (
                        <div className="flex items-center gap-[11px] mb-4">
                          <Image
                            src="/images/phone-icon.svg"
                            alt="Phone"
                            width={24}
                            height={24}
                            className="shrink-0 dark:invert"
                          />
                          <p className="text-[16px] font-host font-bold text-pitstop-oil-black dark:text-white leading-[1.5]">
                            {location.phoneNo}
                          </p>
                        </div>
                      )}

                      <div className="border-t border-[#D9D9D9] dark:border-white/10 w-full mb-4" />

                      <div className="flex items-start gap-[11px]">
                        <Image
                          src="/images/calendar-icon.svg"
                          alt="Hours"
                          width={24}
                          height={24}
                          className="shrink-0 dark:invert"
                        />
                        <div className="flex-1 flex flex-col gap-[11px] font-host text-[16px] text-pitstop-oil-black dark:text-white">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-normal opacity-80">{location.timingLabel1}</span>
                            <span className="font-bold">{location.workingHours}</span>
                          </div>

                          <div className="flex justify-between items-start w-full">
                            <span className="font-normal opacity-80">
                              {location?.fridayTiming?.fridayTimingLabel || "Friday"}
                            </span>
                            <div className="flex flex-col items-end font-bold">
                              <p>{location?.fridayTiming?.morning}</p>
                              <p>{location?.fridayTiming?.evening}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center w-full">
                            <span className="font-normal opacity-80">{location.timingLabel3 || "Sat"}</span>
                            <span className="font-bold">{location.saturdayTime}</span>
                          </div>
                        </div>
                      </div>

                      {location.mapUrl && (
                        <div className="mt-6">
                          <Link
                            href={location.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full bg-pitstop-fiery-orange hover:bg-pitstop-fiery-orange/90 text-white py-3 px-4 rounded-xl font-host font-bold transition-colors"
                          >
                            <Navigation className="w-5 h-5 mr-2" />
                            Get Directions
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>

        {/* Foreground Content constrained to Grid */}
        <div className="relative z-10 container-grid mx-auto w-full h-full px-6 lg:px-0 pt-12 lg:pt-[100px] pb-12 pointer-events-none">
          
          {/* Location List Panel (4 columns) */}
          <div className="w-full lg:w-[420px] 3xl:w-[500px] flex flex-col gap-[24px] pointer-events-auto 3xl:mt-[200px] 2xl:mt-[344px]">
            
            <h2 className="text-[40px] font-extrabold text-pitstop-fiery-orange leading-[1.1] rtl:font-cairo ltr:font-host font-host">
              {block?.heading || "Our Locations"}
            </h2>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-[30px] 3xl:p-[40px] flex flex-col gap-[40px] shadow-sm w-full">
              <h3 className="text-[28px] 3xl:text-[32px] font-extrabold text-pitstop-oil-black dark:text-white rtl:font-cairo ltr:font-host font-host leading-[1.1]">
                {block?.subHeading || "NAVIGATE"}
              </h3>
              
              {/* Scrollable list */}
              <div className="max-h-[350px] 3xl:max-h-[500px] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-[24px] w-full">
                {filteredLocations?.map((location) => {
                  const isActive = activeLocation === location.mapId;
                  
                  return (
                    <div
                      key={location.mapId}
                      className="flex items-center gap-[12px] cursor-pointer transition-colors duration-300 group w-full"
                      onClick={() => handleLocationSelect(location.mapId!)}
                      onMouseEnter={() => setHoveredLocation(location.mapId!)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      {/* The list dot */}
                      <div
                        className={`shrink-0 w-[44px] h-[44px] rounded-[100px] flex items-center justify-center transition-colors ${
                          isActive 
                            ? "bg-pitstop-fiery-orange text-white" 
                            : "bg-pitstop-oil-black dark:bg-[#333] text-white group-hover:bg-pitstop-fiery-orange/80"
                        }`}
                      >
                        <p className="font-host font-bold text-[28px] uppercase mt-[2px] leading-[1.5]">
                          {location.mapId}
                        </p>
                      </div>
                      
                      {/* Text */}
                      <div className="flex flex-col w-full text-pitstop-oil-black dark:text-white leading-[1.5]">
                        <p className={`font-host font-bold text-[20px] 3xl:text-[24px] capitalize ${isActive ? "text-pitstop-fiery-orange" : ""}`}>
                          {location.title}
                        </p>
                        <p className="font-host font-medium text-[12px] opacity-80">
                          {location.serviceName || "Pitstop Automotive Services LLC"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
