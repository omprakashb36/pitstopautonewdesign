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
      <div className="dark:text-[#FAEADC] text-black mt-[180px] min-h-screen pageBg relative">
        <div className="px-4 xl:px-[60px] 2xl:px-[116px] py-8 md:pb-0 md:py-12 md:pt-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[15px] mb-6">
            <Link href={`/${currentLocale}/services`}>{t("serviceBreadcrumbs")}</Link>
            <span>/</span>
            <span className="opacity-60">{allServiceList?.title || "Periodic Services"}</span>
          </div>



          {/* Services Grid */}
          <div className="lg:flex flex flex-wrap lg:flex-nowrap gap-8 relative">
            {/* Service Cards */}
            <div className="space-y-6 w-full xl:min-w-[60%] lg:min-w-[60%] xl:w-[55%] lg:w-[60%]">
              {/* Left side - Title and Browse button */}
              <div className="flex justify-between flex-col md:flex-row md:mb-[53px]  md:items-center gap-4 md:gap-8 w-full">
                <h1 className="text-[30px] md:text-5xl font-bold">
                  <span className="dark:text-[#FAEADC] text-black uppercase font-shoulders">
                    {allServiceList?.title?.split(" ")[0] || "PERIODIC"}
                  </span>{" "}
                  <span className="text-[#C00034] uppercase font-shoulders">
                    {allServiceList?.title?.split(" ").slice(1).join(" ") || "SERVICES"}
                  </span>
                </h1>
                {/* Custom button instead of importing Button component */}

                <button
                  onClick={() => setServiceIsModalOpen(true)}
                  className="gradientBG mhidden gradientBGTrans text-[#FAEADC] px-[26px] py-[13.33px] leading-[1] rounded-[10px] transition-colors"
                >
                  {allServiceList?.browseServiceCtaLabel || "BROWSE OTHER SERVICES"}
                </button>

              </div>

              {services.map((service) => (
                <div key={service.id} className="">
                  {/* Service Card */}
                  <div className="dark:bg-black/80 bg-white border-black/[8%] dark:border-[1px] dark:border-[#FAEADC33] rounded-[33px] mb-12 overflow-hidden shadow-2xl">
                    <div className="md:flex">
                      {/* Service Image */}
                      <div className="relative md:w-1/3 md:max-w-[200px] w-full">
                        <Image
                          src={urlForImage(service?.image)?.url() || ""}
                          alt={service?.name || "Service Image"}
                          width={200}
                          height={205}
                          className="md:h-full object-cover max-h-[205px] rtl:scale-x-[-1]  md:mt-[2.1rem] w-full md:w-[200px] h-[205px] rounded-tr-[2.2rem] md:rounded-br-[2.2rem]"
                        />
                        {service.recommended && (
                          /* Custom badge instead of importing Badge component */
                          <div className="absolute letterSpacing top-[20px] font-urbanist md:left-[40px] left-[20px] bg-[#1DAF65] text-[#FAEADC] text-[11.67px] font-bold py-[6.67px] px-[10px] md:rounded-[6.67px]  rounded-lg">
                            {siteSettingData?.recommended?.toString() ?? ""}
                          </div>
                        )}
                      </div>

                      {/* Service Details */}
                      <div className="flex-1 p-4 md:p-6 md:pt-[44px]">
                        <h3 className="text-[18px] dark:text-[#FAEADC] text-black font-urbanist lg:text-[20px] font-extrabold">{service.name}</h3>
                        {service.description && <p className="dark:text-[#FAEADC]/70 text-black/70 mt-1 text-[10px]">{service.description}</p>}

                        {/* Service Interval */}
                        <div className="flex gap-2 md:gap-4 mt-[10px] md:mb-[33.3px] mb-4">
                          {service?.interval &&
                            <div className="dark:bg-[#202020] bg-[#EFEFEF] text-black dark:text-[#FAEADC] rounded-md font-urbanist font-bold px-3 leading-[1] lg:px-[10px] py-[6.6px] text-[10px] uppercase">
                              {service.interval}
                            </div>
                          }
                          <div className="dark:bg-[#202020] bg-[#EFEFEF] text-black dark:text-[#FAEADC]  font-urbanist font-bold px-3 lg:px-[10px] leading-[1] rounded-md py-[6.6px] text-[10px] uppercase flex justify-center items-center gap-2">
                            <Image
                              src="/images/time-fast.svg"
                              alt={service?.name || "Service Image"}
                              width={12}
                              height={12}
                              className=""
                            />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 md:mb-[13.3px] mb-1">
                          {!isMobileDevice && (expandedServiceIds.includes(service.id) ? service.features : service.features.slice(0, 4)).map((feature, index) => (
                            <div key={index} className="flex items-start gap-1">
                              <Image
                                src="/images/tick.svg"
                                alt="right tick"
                                width={16.7}
                                height={16.7}
                                className="mt-[2px] dark:flex hidden"
                              />
                              <Image
                                src="/images/tick-icon.svg"
                                alt="right tick"
                                width={16.7}
                                height={16.7}
                                className="mt-[2px] dark:hidden flex"
                              />
                              <span className="text-[13.33px] text-black dark:text-[#FAEADC] font-urbanist font-medium">{feature}</span>
                            </div>
                          ))}

                          {service.features.length > 4 && !isMobileDevice && (
                            <button
                              onClick={() => toggleServiceFeatures(service.id)}
                              className="text-emerald-500 text-sm flex items-center mt-2 hover:underline"
                            >
                              {expandedServiceIds.includes(service.id) ? "Show less" : `+ ${t("view")} ${service.features.length - 4} ${t("more")}`}
                            </button>
                          )}
                          {
                            isMobileDevice && (
                              <button id="view-detail" onClick={() => viewDetailPopup(service?.serviceCode)} className="text-emerald-500 text-sm flex items-center mt-2 hover:underline">
                                + {t("viewInfo")}
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="md:flex items-center justify-end pb-5 p-4 pt-0">
                      <div className="flex items-center gap-3 hidden">
                        {service.originalPrice && (
                          <span
                            className={`${appointmentData?.brand ? "line-through text-sm text-[#FAEADC]/60" : "text-[18px] font-bold text-[#FAEADC]"}`}
                          >
                            {appointmentData?.brand ? `AED ${service.originalPrice}` : "Starting from:"}
                          </span>
                        )}
                        <span className="text-2xl font-bold">AED {service.price}</span>
                        {service.discount && appointmentData?.brand && (
                          <div className="bg-[#FAEADC] text-[#121212] rounded-tr-[2rem] font-bold p-[13px] pr-[19px] text-center">
                            <div className="text-lg">{service.discount}%</div>
                            <div className="text-xs">OFF</div>
                          </div>
                        )}
                      </div>

                      {/* Custom button instead of importing Button component */}

                      {isServiceInCart(service?.serviceCode) ? (
                        <Squircle cornerRadius={10}>
                          <button className="dark:bg-[#02331A] bg-[#1DAF65] leading-1 uppercase text-[#FAEADC] text-[11.67px] font-urbanist md:w-auto w-full font-bold px-[26.66px] py-[13.33px] rounded-[10px] justify-center flex items-center gap-2">

                            {siteSettingData?.serviceAdded as any}
                            <ShoppingCart size={14} />
                          </button>
                        </Squircle>
                      ) : (
                        <Squircle cornerRadius={10}>
                          {isMobileDevice && !appointmentData?.brand && service?.serviceCode &&
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className={`bg-[#C00034] md:w-auto w-full gradientBG text-[#FAEADC] px-[26px] py-[13px] rounded hover:bg-[#C00034]/90 transition-colors md:mt-0`}
                            >
                              {!appointmentData?.brand ? (siteSettingData?.addVehicleToContinue as any) : (siteSettingData?.addThisService as any)}
                            </button>
                          }
                          {isMobileDevice && appointmentData?.brand && service?.serviceCode &&
                            <button
                              onClick={() => handleAddService(service.serviceCode)}
                              disabled={appointmentData?.brand ? false : true}
                              className={`${!appointmentData?.brand ? 'cursor-not-allowed bg-[#EAEAEA] text-[#000]' : 'bg-[#C00034] text-[#FAEADC]'}  font-urbanist font-bold md:w-auto w-full text-[11.67px] px-[26px] uppercase py-[13px] rounded md:mt-0`}
                            >
                              {!appointmentData?.brand ? (siteSettingData?.addVehicleToContinue as any) : (siteSettingData?.addThisService as any)}
                            </button>
                          }
                          {!isMobileDevice && service?.serviceCode &&
                            <button
                              onClick={() => handleAddService(service.serviceCode)}
                              disabled={appointmentData?.brand ? false : true}
                              className={`${!appointmentData?.brand ? 'cursor-not-allowed bg-[#EAEAEA] text-[#000]' : 'bg-[#C00034] text-[#FAEADC]'} md:w-auto font-urbanist font-bold w-full px-[26px] text-[11.67px] uppercase py-[13px] rounded  md:mt-0`}
                            >
                              {!appointmentData?.brand ? (siteSettingData?.addVehicleToContinue as any) : (siteSettingData?.addThisService as any)}
                            </button>
                          }
                        </Squircle>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Section */}
            <div
              className={`min-w-[38%] md:w-[38%] ${!appointmentData?.brand ? 'md:mt-[55px]' : 'mt-0'} w-full ${!CartOpen && isMobileDevice ? 'hidden' : ''} ${isMobileDevice ? 'fixed bottom-0  inset-0 z-50 backdropBlur-40 overflow-y-auto  w-full h-full flex flex-col justify-end' : 'sticky top-10'} self-start`}
            >
              {/* Right side - Vehicle info and Change button */}
              {appointmentData?.brand && (

                <div className={`${isMobileDevice ? 'rounded-t-[30px] dark:bg-[#202020] bg-[#EFEFEF] pb-[34px] mobileCart' : 'rounded-[40px] max-md:bg-[#0A0A0A]'} flex -mb-4 md:mb-[53px] max-md:p-5  w-full justify-between relative items-center gap-4`}>

                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-full w-10 h-10 hidden p-2 md:w-16 md:h-16 flex items-center justify-center">
                      <Image className="" src="/images/bmw-logo.svg" alt="BMW Logo" width={50} height={50} />
                    </div>
                    <div>
                      <h2 className="text-[16px] md:text-xl font-bold dark:text-[#FAEADC] text-[#000000]">
                        {appointmentData?.model.toUpperCase()}, {appointmentData?.year}
                      </h2>
                      <p className="text-[#FAEADC]/70 text-[10px] hidden uppercase">
                        {vehicleInfo.fuelType} · {vehicleInfo.mileage.toLocaleString()} KM
                      </p>
                    </div>
                  </div>
                  {/* Custom button instead of importing Button component */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="gradientBG gradientBGTrans text-[#FAEADC] px-[26px] py-[13px] rounded-[10px] transition-colors"
                  >
                    {allServiceList?.changeCtaLabel || "CHANGE"}
                  </button>
                </div>

              )}
              {!appointmentData?.brand && !isMobileDevice && (
                <>
                  <div className="flex p-4 px-[30px] gap-[10px] -z-10 top-[-55px] pb-14 pt-6 items-center absolute w-full left-0 dark:bg-[#C000344D] bg-[#C00034] rounded-t-[30px]">
                    <Image
                      src="/images/alertIcon.svg"
                      alt="alert icon"
                      width={30}
                      height={30}
                      className="mb-0"
                    />
                    <p className="font-urbanist font-bold text-[1rem] dark:text-[#FAEADC] text-white"> {siteSettingData?.serviceAlert?.toString() ?? ""}</p>
                  </div>
                </>
              )}



              <div className={`${isMobileDevice ? 'rounded-t-[30px] mt-3' : 'rounded-[40px]'} bg-[#F9F9F9] dark:bg-[#161616]  md:border-[1px] border-[#FAEADC33] md:p-8 pb-6 md:pb-0 ${cartItems.length === 0 ? 'ltr:md:pr-[60px] rtl:md:pl-[60px]' : 'ltr:md:pr-[0px] rtl:md:pl-[0px]'}  md:mt-5 ltr:md:pl-0 rtl:md:pr-0 h-fit relative`}>
                <div className={`${!isMobileDevice ? 'hidden' : ''} absolute ltr:right-[32px] rtl:left-[32px] top-[32px]`} onClick={() => dispatch(setCartPopup(false))}>
                  <Image
                    src={`${theme === 'dark' ? '/images/icons/cross-icon.svg' : '/images/lightThemeClose.svg'}`}
                    alt="cross icon"
                    width={20}
                    height={20}
                    className=""
                  />
                </div>
                {isMobileDevice && !appointmentData?.brand &&
                  <div className="flex p-4 px-[30px] gap-[10px] -z-10 top-[-75px] pb-14 pt-6 items-center absolute w-full left-0 bg-[rgba(192,0,52,0.7)] rounded-t-[30px]">
                    <Image
                      src="/images/alertIcon.svg"
                      alt="alert icon"
                      width={30}
                      height={30}
                      className="mb-0"
                    />
                    <p className="font-urbanist font-bold text-[1rem] text-[#FAEADC] opacity-80">{siteSettingData?.serviceAlert?.toString() ?? ""}</p>
                  </div>
                }

                <h2 className="text-[26px] dark:text-[#FAEADC] text-black font-shoulders uppercase max-md:p-6  ltr:md:pl-8 rtl:md:pr-8 pb-0 font-semibold mb-0">
                  {allServiceList?.cartLabel || "CART"}
                </h2>
                {cartItems.length === 0 ? (
                  <div className="md:flex flex-row items-center gap-5 justify-center pb-0">
                    <Image
                      src={`${isMobileDevice ? '/images/car-image-mobile.png' : '/images/no-cart-image.png'}`}
                      alt="Car illustration"
                      width={260}
                      height={150}
                      className={`mb-0 m-auto md:min-w-[58%] min-w-[50%] rtl:scale-x-[-1]`}
                    />
                    <div className="w-[85%] md:w-full md:flex max-md:mx-6 ltr:max-md:pl-5 rtl:max-md:pr-5 borderLeft items-end flex-col relative before:absolute before:[content:''] before:w-[2px] before:h-[89%] before:bg-[#C00034] before:top-0">
                      <h3 className="text-[18px] font-urbanist font-semibold mb-2 md:text-right dark:text-[#FAEADC] text-black max-w-[160px]">
                        {siteSettingData?.bookService?.toString() ?? ""}
                      </h3>
                      <p className="text-black dark:text-[#FAEADC] text-[10px] md:text-right md:mb-4">
                        {siteSettingData?.bookServiceDes?.toString() ?? ""}
                      </p>
                      {!appointmentData?.brand &&
                        <Squircle cornerRadius={10}>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full gradientBG bg-[#C00034] text-[#FAEADC] mb-5 mhidden px-[15px] py-[13px] rounded-md font-medium"
                          >
                            {siteSettingData?.addVehicle?.toString() ?? ""}
                          </button>
                        </Squircle>
                      }
                    </div>
                    {isMobileDevice && !appointmentData?.brand && (
                      <Squircle cornerRadius={10}>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="gradientMobileBtn gradientBG bg-[#C00034] text-[#FAEADC] m-5 mb-0 px-[26px] py-[13px] rounded-md font-medium"
                        >
                           {siteSettingData?.addVehicle?.toString() ?? ""}
                        </button>
                      </Squircle>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6  md:pl-8 md:pb-8 p-6 ">
                    {/* Cart Items */}
                    <div className="space-y-4">
                      {cartItemData.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b border-white/10 pb-4">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium dark:text-[#FAEADC]/70 text-black/70">{item.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="font-bold hidden">AED {item.price.toLocaleString()}</span>
                                {item.type === "service" && (
                                  <button
                                    onClick={() => handleRemoveItem(item.serviceCode || item.id)}
                                    className="text-[#C00034] hover:text-[#C00034]/80"
                                  >
                                    <Image
                                      src="/images/delete-icon.svg"
                                      alt="delete icon"
                                      width={25}
                                      height={25}
                                      className="mb-0"
                                    />

                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-black/70 dark:text-[#FAEADC]/70">{item.hours}</p>

                            {/* Quantity controls for products */}
                            {item.type === "product" && item.quantity && (
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                  className="bg-black/60 rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                  className="bg-black/60 rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                  <Plus size={14} />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.serviceCode || item.id)}
                                  className="text-[#C00034] hover:text-[#C00034]/80 ml-auto"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="space-y-2 hidden">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{allServiceList?.estimatedTotalLabel || "Estimated total*"}</h3>
                          <p className="text-xs text-[#FAEADC]/70">{cartItems.length} ITEMS</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl hidden">AED {calculateTotal().toLocaleString()}</p>
                          <p className="text-xs text-[#FAEADC]/70">{allServiceList?.taxLabel || "VAT INCLUDED"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Squircle cornerRadius={10}>
                      <button
                        onClick={handleAppointment}
                        disabled={appointmentData?.brand ? false : true}
                        className={`${!appointmentData?.brand ? 'cursor-not-allowed bg-[#EAEAEA] text-[#000]' : 'bg-[#C00034] text-[#FAEADC]'} w-full gradientBG py-[13px] rounded-md font-medium`}
                      >
                        {allServiceList?.submitCtaLabel || "confirm and next"}
                      </button>
                    </Squircle>
                  </div>
                )}
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
