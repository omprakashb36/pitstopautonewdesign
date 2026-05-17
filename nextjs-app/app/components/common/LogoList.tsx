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
    <div className="relative logoListSlider mx-auto px-2 sm:px-6 md:px-[160px] bg-white dark:bg-black py-4">
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
          className="flex gap-5 w-max"
          style={{
            animation: "scroll-left 30s linear infinite",
          }}
        >
          {cloneLogos.map((logo, index) => (
            <div
              key={`${logo._key}-${index}`}
              className="flex items-center justify-center w-[45px] h-[40px] flex-shrink-0"
              title={logo.logoImage?.altText}
            >
              <Image
                src={urlForImage(logo?.logoImage?.image)?.url() || ""}
                alt={logo?.logoImage?.altText || "logo"}
                width={45}
                height={40}
                className="object-contain filter grayscale opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
