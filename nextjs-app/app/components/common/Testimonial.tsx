"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
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
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [testimonialItems, setTestimonialItems] = useState<Testimonials[]>([]);
  const { currentLocale } = useDeviceDetection()
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        setLoading(true);
        const data: Testimonials[] = await getTestimonials({ locale: currentLocale });
        setTestimonialItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [currentLocale]); // 

  // Navigation references for Swiper
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)

  return (
    <div className="text-[#FAEADC] py-16 pb-8 md:py-24 dark:bg-black bg-white ">
      <div className="mx-auto ltr:pl-5 rtl:pr-5 md:px-0">
        <h2 className="text-[40px] md:text-[99.6px] text-5xl font-bold ltr:text-left rtl:text-right md:mx-[116px] mb-6 md:mb-12">
          <span className="text-[#FAEADC] font-shoulders textStroke font-normal">{block?.heading}</span>{" "}
          <span className="dark:text-[#FAEADC] text-black font-normal font-shoulders">{block?.subHeading}</span>
        </h2>

        <div className="relative">
          {/* Testimonial Slider */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={5}
            slidesPerView={1}
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
            navigation={false}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = navigationPrevRef.current
              // @ts-ignore
              swiper.params.navigation.nextEl = navigationNextRef.current
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              768: {
                slidesPerView: 3.4,
              },
            }}
            className="testimonial-swiper"
          >
            {testimonialItems.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <div className="testimonial-card-wrapper p-8">
                  <div
                    className={`testimonial-card dark:bg-[#18181c] bg-[#F9F9F9] hover:dark:bg-[#1f1f1f] hover:bg-[#F9F9F9] relative transition-all duration-300 transform hover:scale-105 h-full ${isHovering == Number(testimonial?._id) ? "scale-105 shadow-xl" : "scale-100"
                      }`}
                    onMouseEnter={() => setIsHovering(Number(testimonial._id))}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <div className="md:h-48 mb-6 overflow-hidden">
                      {testimonial.review && (
                        <PortableText
                          className="text-[#FAEADC]/80 text-xs md:text-[15px] leading-relaxed"
                          value={testimonial.review as unknown as PortableTextBlock[]}
                        />
                      )}

                    </div>
                    <div className="border-t border-white/10 pt-4"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full overflow-hidden border-2 border-[#C00034]">
                          {testimonial?.avatar?.asset &&
                            <Image
                              src={urlForImage(testimonial?.avatar)?.url() || "/placeholder.svg"}
                              alt="avatar"
                              width={40}
                              height={40}
                              className="object-cover w-10 h-10"
                            />
                          }
                        </div>
                        <div>
                          <h3 className="font-bold text-sm dark:text-white text-black md:text-[16.6px]">{String(testimonial.name) || ""}</h3>
                          <p className="md:text-[11.62px] text-xs text-[#FAEADC]/60">{testimonial?.profession}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${i < (Number(testimonial.stars) || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="testimonial-pagination flex justify-center mt-8"></div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-pagination {
          position: relative;
          bottom: 0 !important;
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .testimonial-bullet {
          width: 0.75rem;
          height: 0.75rem;
          display: inline-block;
          border-radius: 9999px;
          background-color: rgba(250, 234, 220, 0.3);
          margin: 0 0.25rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .testimonial-bullet-active {
          background-color: #C00034;
        }
        
        .testimonial-swiper .swiper-slide {
          height: auto;
        }
        
        .testimonial-card {
          // background-color: #18181c;
          padding: 1.5rem;
          position: relative;
        }
        .testimonial-card > * {
          position: relative;
          z-index: 1;
        }
        
        .testimonial-card:hover {
          // background-color: #1f1f1f;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  )
}

