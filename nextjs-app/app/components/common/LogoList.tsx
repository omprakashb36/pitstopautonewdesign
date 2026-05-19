"use client"

import Image from "next/image"
import type { LogoList } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { useEffect, useRef } from "react"
import useDeviceDetection from "../../hooks/useDeviceDetection"

type LogoListProps = {
  block: LogoList
  index: number
}

export default function LogoListComp({ block }: LogoListProps) {
  const { isMobileDevice } = useDeviceDetection()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollWidth = scrollContainer.scrollWidth
    const containerWidth = scrollContainer.clientWidth

    // Reset animation and start continuous scroll
    scrollContainer.style.animation = "none"
    scrollContainer.offsetHeight // Trigger reflow
    scrollContainer.style.animation = `scroll-left ${scrollWidth / 100}s linear infinite`

    return () => {
      if (scrollContainer) {
        scrollContainer.style.animation = "none"
      }
    }
  }, [block?.logoList])

  const cloneLogos = Array(20)
    .fill(block?.logoList || [])
    .flat()

  return (
    <div className="relative logoListSlider w-full mx-auto bg-transparent pb-8 z-30 3xl:-mt-[100px] lg:-mt-20 -mt-10 pointer-events-none">
      <div className="container-grid">
        <div className="3xl:px-[123px] 2xl:px-[80px]">
          <div className="overflow-hidden">
            <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

            <div
              ref={scrollRef}
              className="flex gap-[30px] items-center w-max opacity-50 hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: "scroll-left 30s linear infinite",
              }}
            >
              {cloneLogos.map((logo, index) => (
                <div
                  key={`${logo._key}-${index}`}
                  className="flex items-center justify-center w-[60px] h-[60px] flex-shrink-0 pointer-events-auto"
                  title={logo.logoImage?.altText}
                >
                  <Image
                    src={urlForImage(logo?.logoImage?.image)?.url() || ""}
                    alt={logo?.logoImage?.altText || "logo"}
                    width={60}
                    height={60}
                    className="object-contain filter grayscale hover:grayscale-0 transition-all hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
