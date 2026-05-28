"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { Testimonial, Testimonials } from "@/sanity.types";
import useDeviceDetection from "@/app/hooks/useDeviceDetection"
import { getTestimonials } from "@/app/actions/common/sanityData";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils";

type TestimonialProps = {
  block: Testimonial
  index: number
}

export default function TestimonialComp({ block }: TestimonialProps) {
  const [testimonialItems, setTestimonialItems] = useState<Testimonials[]>([]);
  const { currentLocale } = useDeviceDetection()
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        setLoading(true);
        const data: Testimonials[] = await getTestimonials({ locale: currentLocale });
        setTestimonialItems(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [currentLocale]);

  return (
    <div className="w-full bg-white dark:bg-black py-12 lg:py-[80px] relative overflow-hidden">
      {/* ========================================================
          PIXEL-PERFECT CSS GRID CONTAINER
          1920px screen -> 1640px container, 40px gap
          1440px screen -> 1280px container, 24px gap
          ======================================================== */}
      <div className="container-grid mx-auto w-full px-6 lg:px-0 flex flex-col">
        
        {/* Header - Centered as per Figma */}
        <div className="flex flex-col w-full text-center leading-[1.1] items-center justify-center">
          {block?.heading && (
            <h2 className="display-l font-extrabold rtl:font-cairo ltr:font-host font-host text-pitstop-oil-black dark:text-white tracking-tight">
              <span className="textStroke">{block?.heading}</span>{" "}
              <span className=" text-black">{block?.subHeading}</span>
            </h2>
          )}
        </div>
        </div>

        {/* Testimonial Slider */}
        <div className="w-full relative mt-12 lg:mt-[80px]">
          <Swiper
            modules={[Pagination, Autoplay]}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
              bulletClass: "testimonial-bullet",
              bulletActiveClass: "testimonial-bullet-active",
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 1.4, spaceBetween: 24 },
              1024: { slidesPerView: 2.4, spaceBetween: 24 }, // lg: 1280px container / 3 = 410px cards
              1536: { slidesPerView: 3.4, spaceBetween: 40 }, // 3xl: 1640px container / 3 = 520px cards
            }}
            className="w-full !px-2 !pb-10 !pt-6 -mt-6 -mx-2"
          >
            {testimonialItems.map((testimonial) => (
              <SwiperSlide key={testimonial._id} className="h-auto">
                <div className="relative h-full min-h-[350px]">
                  
                  {/* Rotated background shadow (5 degrees) */}
                  <div className="absolute inset-0 bg-[#EAEAEA] dark:bg-[#1A1A1A] rounded-[24px] rotate-[5deg] z-0 origin-center transition-transform hover:rotate-[7deg]"></div>
                  
                  {/* Main Card */}
                  <div className="relative z-10 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-[24px] px-[24px] py-[30px] lg:px-[35px] flex flex-col justify-between min-h-[350px] h-full">
                    
                    {/* Review Text */}
                    <div className="mb-8">
                      {testimonial.review && (
                        <div className="text-pitstop-oil-black reviewText dark:text-white opacity-80 text-[16px] lg:text-[18px] leading-[1.5] rtl:font-cairo ltr:font-host font-host whitespace-pre-wrap">
                          <PortableText value={testimonial.review as unknown as PortableTextBlock[]} />
                        </div>
                      )}
                    </div>

                    {/* Bottom Section */}
                    <div>
                      {/* Divider */}
                      <div className="w-full border-t border-[#D9D9D9] dark:border-white/10 mb-4 lg:mb-6"></div>

                      {/* Author Info */}
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-[16px]">
                          {testimonial?.avatar?.asset && (
                            <div className="w-[50px] h-[50px] rounded-[52px] overflow-hidden relative shrink-0">
                              <Image
                                src={urlForImage(testimonial?.avatar)?.url() || "/placeholder.svg"}
                                alt="avatar"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col leading-[1.5]">
                            <h4 className="font-bold text-[18px] lg:text-[20px] text-pitstop-oil-black dark:text-white rtl:font-cairo ltr:font-host font-host">
                              {String(testimonial.name) || ""}
                            </h4>
                            <p className="text-[14px] text-[#393D45] dark:text-[#898989] rtl:font-cairo ltr:font-host font-host">
                              {testimonial?.profession}
                            </p>
                          </div>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`${i < (Number(testimonial.stars) || 0) ? "text-pitstop-fiery-orange fill-pitstop-fiery-orange" : "text-gray-300 dark:text-gray-700 fill-gray-300 dark:fill-gray-700"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="testimonial-pagination flex justify-center mt-4"></div>
        </div>
      

      <style jsx global>{`
        .testimonial-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        
        .testimonial-bullet {
          width: 12px;
          height: 12px;
          display: inline-block;
          border-radius: 9999px;
          background-color: #D9D9D9;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .testimonial-bullet-active {
          background-color: #000;
          width: 12px;
        }
        
        .dark .testimonial-bullet {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .dark .testimonial-bullet-active {
          background-color: #FF3300;
        }
      `}</style>
    </div>
  )
}

