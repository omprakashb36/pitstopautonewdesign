"use client"
import { Check, Clock, Minus, Plus, ShoppingCart, Square, Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { Squircle } from "corner-smoothing"
import CarSelectorModal from "./CarSelectorModal"
import { useDispatch, useSelector } from "react-redux"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import type { AppointmentFields } from "../../lib/types/types"
import type { RootState } from "../../lib/redux/store"
import type { CartItem } from "../../lib/types/types"
import { setCartItemData, setCartPopup } from "../../lib/redux/slices/carSlice"
import { toast } from "react-toastify"
import type { GetServiceDetailQueryResult, Service, SettingsQueryResult } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import Link from "next/link"
import ServiceModal from "./ServiceModal"
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes"

// Services data
type ServiceDetailProps = {
  allServiceList: GetServiceDetailQueryResult,
  browseServiceList: Service[],
  siteSettingData: SettingsQueryResult
}

export default function ServiceListing({ allServiceList, browseServiceList, siteSettingData }: ServiceDetailProps) {
  const { isMobileDevice, currentLocale } = useDeviceDetection()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isServiceModalOpen, setServiceIsModalOpen] = useState(false)
  const [activeService, setActiveService] = useState<string | null>(null)
  const isHydrated = usePersistHydration()
  const dispatch = useDispatch()
  const router = useRouter()
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);
  const [isPeriodicService, setIsPeriodicService] = useState(false);
  const pathname = usePathname();
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const [carServiceId, setCarServiceId] = useState<string | null>(null);
  const [serviceFeaturePopup, setServiceFeaturePopup] = useState(false);
  const { theme } = useTheme();
  const toggleServiceFeatures = (id: string) => {
    setExpandedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const t = useTranslations("ServiceDetailPage");

  useEffect(() => {
    if (pathname.includes('periodic-services')) {
      setIsPeriodicService(true)
    }
  }, [])

  // Transform Sanity service data to our component format
  const services =
    allServiceList?.pageBuilder?.map((service) => ({
      id: service._key,
      name: service.title,
      description: service.warranty,
      price: 245, // Default price - would need to be added to Sanity schema
      originalPrice: 350, // Default original price - would need to be added to Sanity schema
      discount: 30, // Default discount - would need to be added to Sanity schema
      quantity: 1,
      image: service?.image || "/images/minor-service.png", // Default image if Sanity image is not available
      interval: service.interval,
      duration: service.duration,
      hours: Number.parseInt(service.duration ?? "1") || 1, // Extract hours from duration or default to 1
      recommended: service.recommendation,
      features: service.features || [],
      serviceCode: service.serviceCode || "", // Ensure serviceCode exists
    })) || []

  console.log("Services Data:", services)

  const serviceList = browseServiceList?.map((service) => ({
    id: service._id,
    title: service.title,
    slug: service.slug?.current,
    image: service?.serviceIcon, // Ensure serviceIcon exists in the Service type
    serviceIcon: service?.serviceIcon?.image, // Add serviceIcon explicitly if needed
  })) || []

  // Vehicle info included directly in the component
  const vehicleInfo = {
    make: "BMW",
    model: "Z4",
    year: 2018,
    fuelType: "PETROL",
    mileage: 20000,
  }

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleAddService = (serviceId: string) => {
    const service = services.find((s) => s.serviceCode === serviceId);
    if (!service) return;

    const isAlreadyInCart = cartItems.some((item) => item.serviceCode === serviceId);
    if (isAlreadyInCart) return;

    // If periodic service, restrict to one service only
    if (
      isPeriodicService &&
      cartItems.some((cartItem) =>
        services.some((service) => service.serviceCode === cartItem.serviceCode)
      )
    ) {
      toast.error("Only one service can be added for periodic services");
      return;
    }


    const newItem = {
      id: service.id,
      name: service.name || "Unknown Service",
      price: service.price,
      hours: service.duration,
      quantity: service.quantity,
      type: "service" as const,
      serviceCode: service.serviceCode || "",
    };

    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    dispatch(setCartItemData(updatedCart));
    toast.success(`${newItem.name} added`);
    dispatch(setCartPopup(true));
  };


  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.serviceCode !== itemId))
    dispatch(setCartItemData(cartItems.filter((item) => item.serviceCode !== itemId)))
    toast.success(`Service deleted successfully`)
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const isServiceInCart = (serviceId: string) => {
    if (!serviceId?.trim()) return false; // Return false if serviceId is empty or only spaces
    return cartItems.some((item) => item.serviceCode === serviceId);
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === "product" && item.quantity) {
        return total + item.price * item.quantity
      }
      return total + item.price
    }, 0)
  }

  const handleAppointment = () => {
    router.push(`/${currentLocale}/service-cart`)
  }

  const appointmentData: AppointmentFields = useSelector((state: RootState) => state.carService.appointmentData)
  const CartOpen = useSelector((state: RootState) => state.carService.isCartOpen);
  console.log("Redux Data:", CartOpen);
  const cartItemData: CartItem[] = useSelector((state: RootState) => state.carService.cartItemData)

  // Sync Redux cartItemData to local state on mount
  useEffect(() => {
    setCartItems(cartItemData)
    dispatch(setCartPopup(false));
  }, [])

  // Update Redux when local state changes
  useEffect(() => {
    dispatch(setCartItemData(cartItems))
  }, [cartItems, dispatch])

  const handleClose = () => {
    setServiceIsModalOpen(false)
  }

  const handleServiceSelection = (slug?: string) => {
    if (slug) {
      window.location.href = `/${currentLocale}/services/${slug?.replace(/^ar\//, "")}`
    } else {
      router.push(`/${currentLocale}/service-listing`)
    }
  }

  if (!isHydrated) {
    return <div></div>
  }
  const viewDetailPopup = (serviceId: string) => {
    setCarServiceId(serviceId);
    setServiceFeaturePopup(true);
  }


  const selectedService = services.find((s) => s.serviceCode === carServiceId);

  return (
    <>
      <div className="dark:text-[#FAEADC] text-black md:mt-[180px] mt-[100px] min-h-screen pageBg relative">
        <div className="py-8 md:pb-0 md:py-12 pt-0 md:pt-0">
          <div className="container-grid">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[15px] mb-6 md:mb-0">
            <Link href={`/${currentLocale}/services`}>{t("serviceBreadcrumbs")}</Link>
            <span>/</span>
            <span className="opacity-60">{allServiceList?.title || "Periodic Services"}</span>
          </div>



          {/* Services Grid */}
          <div className="lg:grid grid-cols-1 gap-10 lg:grid-cols-12 relative">
            {/* Service Cards */}
            <div className="w-full lg:col-span-7">
              {/* Left side - Title and Browse button */}
              <div className="flex justify-between flex-col md:flex-row md:mb-[40px]  md:items-center gap-4 md:gap-8 w-full">
                <h1 className="md:mb-0 mb-10">
                  <span className="dark:text-[#FAEADC] text-black">
                    {allServiceList?.title?.split(" ")[0] || "PERIODIC"}
                  </span>{" "}
                  <span className="text-[#C00034]">
                    {allServiceList?.title?.split(" ").slice(1).join(" ") || "SERVICES"}
                  </span>
                </h1>
                {/* Custom button instead of importing Button component */}

                <button
                  onClick={() => setServiceIsModalOpen(true)}
                  className="gradientBG mhidden gradientBGTrans text-[#FAEADC] lg:min-w-[240px] 3xl:min-w-[280px] px-[20px] 3xl:px-[40px] py-[16px] leading-[1] rounded-[10px] transition-colors"
                >
                  {allServiceList?.browseServiceCtaLabel || "BROWSE OTHER SERVICES"}
                </button>

              </div>

              {services.map((service) => {
                const isInCart = isServiceInCart(service.serviceCode)
                const hasDiscount = !!(service.discount && appointmentData?.brand)

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-[#161616] border border-[#d9d9d9] dark:border-white/20 rounded-[40px] overflow-hidden flex flex-col justify-between mb-12 shadow-2xl relative w-full"
                  >
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row items-stretch gap-[24px] w-full pt-[40px] pr-4 md:pr-[30px] relative">
                      
                      {/* Left: Service Image */}
                      <div className="relative w-full md:w-[240px] h-[200px] md:h-[246px] rounded-br-[40px] rounded-tr-[40px] bg-neutral-900 shrink-0">
                        <Image
                          src={urlForImage(service?.image)?.url() || ""}
                          alt={service?.name || "Service Image"}
                          width={240}
                          height={246}
                          className="object-cover w-full h-full rtl:scale-x-[-1]"
                        />
                        {service.recommended && (
                          <div className="absolute bg-[#1daf65] text-white text-[12px] md:text-[14px] font-host font-bold px-[12px] py-[8px] rounded-[8px] top-[-16px] left-[16px] md:left-[48px] z-10 shadow-md">
                            {siteSettingData?.recommended?.toString() ?? "RECOMMENDED"}
                          </div>
                        )}
                      </div>

                      {/* Right: Service Details */}
                      <div className="flex-1 flex flex-col gap-[24px] md:gap-[30px] 3xl:gap-[40px] px-6 md:px-0">
                        {/* Title and Description */}
                        <div className="flex flex-col gap-[12px] w-full">
                          <h3 className="text-[24px] font-host font-bold text-[#211D1D] dark:text-[#FAEADC] leading-[1.3]">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-[14px] text-black/70 dark:text-[#FAEADC]/70 leading-[1.5]">
                              {service.description}
                            </p>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-[16px] items-center">
                            {service?.interval && (
                              <div className="bg-[#eaeaea] dark:bg-white/10 px-[12px] py-[8px] rounded-[8px] text-[12px] font-host font-bold text-[#211d1d] dark:text-[#FAEADC] leading-none uppercase">
                                {service.interval}
                              </div>
                            )}
                            <div className="bg-[#eaeaea] dark:bg-white/10 px-[12px] py-[8px] rounded-[8px] text-[12px] font-host font-bold text-[#211d1d] dark:text-[#FAEADC] leading-none uppercase flex items-center gap-[8px]">
                              <Clock className="w-[14px] h-[14px] text-[#211d1d] dark:text-[#FAEADC]" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Checklist Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] md:gap-x-[30px] 3xl:gap-x-[60px] gap-y-[16px] pb-6 md:pb-0">
                          {(!isMobileDevice 
                            ? (expandedServiceIds.includes(service.id) ? service.features : service.features.slice(0, 4))
                            : []
                          ).map((feature, index) => (
                            <div key={index} className="flex items-center gap-[8px]">
                              <div className="bg-[#eaeaea] dark:bg-white/10 rounded-[6px] p-[4px] w-[20px] h-[20px] flex items-center justify-center shrink-0">
                                <Check className="w-[12px] h-[12px] text-[#211d1d] dark:text-white" />
                              </div>
                              <span className="text-[16px] text-[#211d1d] dark:text-[#FAEADC] font-host font-medium">
                                {feature}
                              </span>
                            </div>
                          ))}

                          {service.features.length > 4 && !isMobileDevice && (
                            <button
                              onClick={() => toggleServiceFeatures(service.id)}
                              className="text-[#1DAF65] font-host font-bold text-[16px] flex items-center mt-2 hover:opacity-80 transition-opacity"
                            >
                              {expandedServiceIds.includes(service.id) ? "Show less" : `+ ${t("view")} ${service.features.length - 4} ${t("more")}`}
                            </button>
                          )}
                          {isMobileDevice && (
                            <button 
                              onClick={() => viewDetailPopup(service?.serviceCode)} 
                              className="text-[#1DAF65] font-host font-bold text-[16px] flex items-center mt-2 hover:opacity-80 transition-opacity"
                            >
                              + {t("viewInfo")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Cost Strip & CTA Row */}
                    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-[20px] mt-6 md:mt-[30px] ltr:pr-4 ltr:sm:pr-[30px] rtl:pl-4 rtl:sm:pl-[30px] pb-4 sm:pb-[30px]">
                     

                      {/* Right: CTA Button */}
                      <div className="flex items-center justify-end px-4 sm:px-0 shrink-0">
                        {isInCart ? (
                          <button className="bg-[#1DAF65] leading-none uppercase text-white text-[14px] sm:text-[16px] font-host font-bold px-[24px] sm:px-[32px] py-[14px] sm:py-[16px] rounded-[12px] justify-center flex items-center gap-2 hover:opacity-90 transition-opacity">
                            {siteSettingData?.serviceAdded as any || "Added"}
                            <ShoppingCart className="w-[16px] h-[16px]" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (!appointmentData?.brand) {
                                setIsModalOpen(true)
                              } else {
                                handleAddService(service.serviceCode)
                              }
                            }}
                            className={`uppercase font-host font-bold text-[14px] sm:text-[16px] px-[24px] sm:px-[32px] py-[14px] sm:py-[16px] rounded-[12px] transition-colors leading-none
                              ${!appointmentData?.brand 
                                ? "bg-[#eaeaea] text-[#898989] hover:bg-neutral-200" 
                                : "bg-[#C00034] text-white hover:bg-[#C00034]/90"
                              }`}
                          >
                            {!appointmentData?.brand 
                              ? (siteSettingData?.addVehicleToContinue as any || "Add Vehicle") 
                              : (siteSettingData?.addThisService as any || "Add This Service")
                            }
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>

            {/* Cart Section */}
            <div
              className={`lg:col-span-5 ${!appointmentData?.brand ? 'md:mt-[55px]' : 'mt-0'} w-full ${!CartOpen && isMobileDevice ? 'hidden' : ''} ${isMobileDevice ? 'fixed bottom-0  inset-0 z-50 backdropBlur-40 overflow-y-auto  w-full h-full flex flex-col justify-end' : 'sticky top-10'} self-start`}
            >
              {/* Right side - Vehicle info and Change button */}
              {appointmentData?.brand && (
                <div className={`${isMobileDevice ? 'rounded-t-[30px] mobileCart bg-white dark:bg-black top-[20px]' : 'rounded-[40px] bg-white dark:bg-[#0A0A0A]'} border border-[#d9d9d9] dark:border-white/10 p-5 md:p-6 flex w-full justify-between items-center gap-4 ${isMobileDevice ? '-mb-4 md:mb-0 max-md:p-5 shadow-sm' : 'mb-[40px] shadow-sm'}`}>
                  <div>
                    <h2 className="text-[16px] md:text-xl font-host font-extrabold dark:text-[#FAEADC] text-black uppercase leading-tight">
                      {appointmentData?.model.toUpperCase()}, {appointmentData?.year}
                    </h2>
                    <p className="text-[10px] md:text-sm opacity-60 dark:text-[#FAEADC]/60 uppercase mt-1 font-host text-black dark:text-[#FAEADC]">
                      {vehicleInfo.fuelType} · {vehicleInfo.mileage.toLocaleString()} KM
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className={isMobileDevice 
                      ? "border text-[12px] font-host font-bold uppercase border-[#C00034] text-[#C00034] rounded-[10px] px-4 py-2 hover:bg-[#C00034]/10 transition-colors"
                      : "gradientBG mhidden gradientBGTrans text-[#FAEADC] px-[20px] 3xl:px-[40px] py-[16px] leading-[1] rounded-[10px] transition-colors"
                    }
                  >
                    {allServiceList?.changeCtaLabel || "CHANGE"}
                  </button>
                </div>
              )}
              {!appointmentData?.brand && !isMobileDevice && (
                <div className="flex p-4 px-[30px] gap-[10px] -z-10 top-[-55px] pb-14 pt-6 items-center absolute w-full left-0 bg-[#801b01] rounded-t-[40px] shadow-lg">
                  <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center text-[#801b01] font-bold text-[20px] shrink-0">
                    !
                  </div>
                  <p className="font-host font-bold text-[18px] sm:text-[20px] text-white">
                    {siteSettingData?.serviceAlert?.toString() ?? "Add the vehicle to get the estimates"}
                  </p>
                </div>
              )}

              <div className={cartItems.length === 0
                ? "md:mt-5 h-fit relative w-full"
                : `${isMobileDevice ? 'rounded-t-[30px] mt-3 bg-[#fafafa] dark:bg-[#0A0A0A]' : 'rounded-[40px] bg-[#fafafa] dark:bg-[#0A0A0A]'} border border-[#d9d9d9] dark:border-[#FAEADC]/10 h-fit flex flex-col shadow-lg md:mt-5 w-full relative`
              }>
                <div className={`${!isMobileDevice ? 'hidden' : ''} absolute ltr:right-[32px] rtl:left-[32px] top-[32px] cursor-pointer z-10`} onClick={() => dispatch(setCartPopup(false))}>
                  <Image
                    src={`${theme === 'dark' ? '/images/icons/cross-icon.svg' : '/images/lightThemeClose.svg'}`}
                    alt="cross icon"
                    width={20}
                    height={20}
                    className=""
                  />
                </div>
                {isMobileDevice && !appointmentData?.brand && (
                  <div className="flex p-4 px-[30px] gap-[10px] -z-10 top-[-75px] pb-14 pt-6 items-center absolute w-full left-0 bg-[#801b01] rounded-t-[30px] shadow-lg">
                    <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center text-[#801b01] font-bold text-[20px] shrink-0">
                      !
                    </div>
                    <p className="font-host font-bold text-[1rem] text-white opacity-90">
                      {siteSettingData?.serviceAlert?.toString() ?? "Add the vehicle to get the estimates"}
                    </p>
                  </div>
                )}

                {cartItems.length === 0 ? (
                  isMobileDevice ? (
                    <div className="flex flex-col items-center p-6 bg-[#fafafa] dark:bg-[#161616] rounded-[30px] border border-[#FAEADC33] w-full">
                      <Image
                        src="/images/car-image-mobile.png"
                        alt="Car illustration"
                        width={260}
                        height={150}
                        className="mb-4 rtl:scale-x-[-1]"
                      />
                      <div className="flex flex-col items-center text-center gap-2 mb-6">
                        <h3 className="text-[18px] font-urbanist font-bold dark:text-[#FAEADC] text-black">
                          {siteSettingData?.bookService?.toString() ?? "Ready to Book a Service?"}
                        </h3>
                        <p className="text-black/75 dark:text-[#FAEADC]/75 text-[12px] max-w-[280px]">
                          {siteSettingData?.bookServiceDes?.toString() ?? "Looks like you haven’t added any services yet. Browse our offerings and book a service to keep your car running smoothly!"}
                        </p>
                      </div>
                      {!appointmentData?.brand && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="w-full bg-[#f30] hover:bg-[#f30]/95 text-white font-host font-bold py-[13px] rounded-xl transition-colors uppercase text-[15px]"
                        >
                          {siteSettingData?.addVehicle?.toString() ?? "Add Vehicle"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full">
                      {/* Empty Cart Card */}
                      <div className="bg-[#fafafa] dark:bg-[#161616] border border-[#d9d9d9] dark:border-white/20 rounded-[40px] h-[340px] relative overflow-hidden w-full p-[40px] flex flex-col justify-between shadow-2xl">
                        {/* Car Image on Left (overflows left & bottom) */}
                        <div className="absolute ltr:left-[-20px] rtl:right-[-20px] bottom-[-20px] 3xl:w-[330px] 3xl:h-[265px] w-[200px] h-[175px] pointer-events-none z-0">
                          <Image
                            src="/images/no-cart-image.png"
                            alt="Car illustration"
                            fill
                            className="object-contain rtl:scale-x-[-1]"
                          />
                        </div>

                        {/* Cart Title */}
                        <h2 className="text-[32px] font-host font-extrabold text-[#211d1d] dark:text-[#FAEADC] leading-none relative z-10">
                          Cart
                        </h2>

                        {/* Right content box */}
                        <div className="flex gap-[24px] items-center justify-end ltr:ml-auto mt-auto mb-2 relative z-10">
                          <div className="flex flex-col gap-[16px] items-end text-right max-w-[230px] 3xl:max-w-[270px]">
                            <h3 className="text-[22px] font-host font-bold text-[#211d1d] dark:text-[#FAEADC] leading-[1.3] capitalize">
                              {siteSettingData?.bookService?.toString() ?? "Ready to Book a Service?"}
                            </h3>
                            <p className="text-[12px] opacity-80 text-[#211d1d] dark:text-[#FAEADC] leading-[1.5]">
                              {siteSettingData?.bookServiceDes?.toString() ?? "Looks like you haven’t added any services yet. Browse our offerings and book a service to keep your car running smoothly!"}
                            </p>
                            {!appointmentData?.brand && (
                              <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#f30] hover:bg-[#f30]/90 text-white font-host font-extrabold uppercase px-[40px] py-[16px] rounded-[12px] transition-colors text-[16px] leading-none"
                              >
                                {siteSettingData?.addVehicle?.toString() ?? "Add Vehicle"}
                              </button>
                            )}
                          </div>
                          {/* Vertical Red Line */}
                          <div className="w-[2px] h-[120px] bg-[#f30] shrink-0" />
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className={`${isMobileDevice ? 'px-[24px] py-[2.1rem]' : 'px-[30px] py-[40px]'} flex flex-col gap-[30px] md:gap-[40px] w-full`}>
                    <h2 className={`${isMobileDevice ? 'text-[26.6px]' : 'text-[32px]'} font-host dark:text-[#FAEADC] text-[#211d1d] font-extrabold uppercase leading-[1.1] ${isMobileDevice ? '' : 'hidden md:block'}`}>Cart</h2>
                    
                    {/* Cart Items */}
                    <div className="flex flex-col gap-[20px] md:gap-[24px]">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4 w-full">
                          <div className="flex-1 pr-4">
                            <h3 className="font-host font-bold text-[16px] md:text-[18px] text-[#211d1d] dark:text-[#FAEADC]">{item.name}</h3>
                            <p className="font-host font-medium opacity-60 text-[11px] md:text-[12px] text-[#211d1d] dark:text-[#FAEADC] mt-0.5 md:mt-1">
                              {item.hours ? `${item.hours}` : ""}
                            </p>
                          </div>
                          <div className="flex gap-[10px] md:gap-[12px] items-center">
                            {item.type === "product" && item.quantity && (
                              <div className="flex items-center gap-2 md:gap-3 bg-[#eaeaea] dark:bg-[#202020] rounded-[6px] px-2 py-0.5 md:py-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                  className="text-[#211d1d] dark:text-white"
                                >
                                  <Minus className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" />
                                </button>
                                <span className="font-host font-bold text-[11px] md:text-[12px] min-w-4 text-center text-[#211d1d] dark:text-white">
                                  {String(item.quantity || 1).padStart(2, '0')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                  className="text-[#211d1d] dark:text-white"
                                >
                                  <Plus className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" />
                                </button>
                              </div>
                            )}
                            <div className="text-right">
                              <span className="font-host font-bold text-[16px] md:text-[18px] text-[#211d1d] dark:text-[#FAEADC]">AED {item.price.toLocaleString()}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.serviceCode || item.id)}
                              className="bg-[rgba(192,0,52,0.08)] dark:bg-[rgba(192,0,52,0.15)] hover:bg-[rgba(192,0,52,0.15)] size-[28px] md:size-[30px] rounded-[6px] md:rounded-[8px] flex items-center justify-center transition-colors flex-shrink-0 text-[#C00034]"
                            >
                              <Trash2 className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Section */}
                    <div className="flex flex-col gap-[20px] md:gap-[24px]">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col">
                          <h3 className="font-host font-bold text-[20px] md:text-[24px] text-[#211d1d] dark:text-[#FAEADC]">
                            {allServiceList?.estimatedTotalLabel || "Estimated total*"}
                          </h3>
                          <p className="text-[11px] md:text-[12px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-0.5 md:mt-1 max-w-[200px] md:max-w-[280px]">
                            *Actual cost may vary based on vehicle assessment
                          </p>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <span className="font-host font-bold text-[20px] md:text-[24px] text-[#211d1d] dark:text-[#FAEADC]">
                            AED {calculateTotal().toLocaleString()}
                          </span>
                          <p className="text-[11px] md:text-[12px] opacity-60 text-[#211d1d] dark:text-[#FAEADC]/60 mt-0.5 md:mt-1 uppercase">
                            {allServiceList?.taxLabel || "VAT INCLUDED"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleAppointment}
                      disabled={appointmentData?.brand ? false : true}
                      className={`bg-[#801b01] text-[#fcf3ed] w-full py-3.5 md:py-4 rounded-[10px] md:rounded-[12px] font-host font-extrabold uppercase text-[15px] md:text-[16px] leading-[1.5] transition-all hover:opacity-90 ${
                        !appointmentData?.brand ? "cursor-not-allowed opacity-65 bg-[#eaeaea] text-[#898989]" : ""
                      }`}
                    >
                      {allServiceList?.submitCtaLabel || "confirm and next"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
          </div>
        </div>
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

      <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettingData} />

      {isMobileDevice && carServiceId && (
        <div
          className={`fixed bottom-0 left-0 w-full   z-50 inset-0  flex items-end  backdropBlur-40 overflow-y-auto ${!serviceFeaturePopup ? 'hidden' : ''}`}
        >

          <Squircle cornerRadius={40} className={`dark:bg-[#161616] bg-[#F7F7F7]  w-full p-6 relative `}>
            <div
              className="absolute ltr:right-[32px] rtl:left-[32px] top-[32px] cursor-pointer z-50"
              onClick={() => setServiceFeaturePopup(false)}
            >
              <Image
                src={`${theme === 'dark' ? '/images/icons/cross-icon.svg' : '/images/lightThemeClose.svg'}`}
                alt="cross icon"
                width={20}
                height={20}
                className=""
              />
            </div>
            {selectedService && (
              <>
                <h2 className="text-2xl font-shoulders darK:text-white text-black uppercase font-semibold mb-6">
                  {t("serviceInfo")}
                </h2>
                <h3 className="text-[18px] lg:text-2xl darK:text-white text-black font-bold mb-1">{selectedService.name}</h3>
                <p className="darK:text-[#FAEADC]/70 text-black/70 mb-4 text-[10px]">{selectedService.description}</p>
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm darK:text-white text-black">{feature}</span>
                  </div>
                ))}
              </>
            )}
            <div className="mt-10">
              {isServiceInCart(carServiceId) ? (
                <Squircle cornerRadius={10}>
                  <button className="bg-[#02331A] uppercase leading-1 text-[#FAEADC] text-[12px] font-urbanist md:w-auto w-full font-bold px-[26px] py-[13px] rounded justify-center flex items-center gap-2">
                    <ShoppingCart size={14} />
                    {siteSettingData?.serviceAdded as any}
                  </button>
                </Squircle>
              ) : (
                <Squircle cornerRadius={10}>
                  <button
                    onClick={() => handleAddService(carServiceId)}
                    disabled={appointmentData?.brand ? false : true}
                    className={`${!appointmentData?.brand ? 'cursor-not-allowed bg-[#EAEAEA] text-[#000]' : 'bg-[#C00034] text-[#FAEADC]'} md:w-auto w-full gradientBG px-[26px] py-[13px] rounded hover:bg-[#C00034]/90 transition-colors md:mt-0`}
                  >
                    {!appointmentData?.brand ? (siteSettingData?.addVehicleToContinue as any) : (siteSettingData?.addThisService as any)}
                  </button>
                </Squircle>
              )}
            </div>
          </Squircle>

        </div>

      )}

    </>
  )
}
