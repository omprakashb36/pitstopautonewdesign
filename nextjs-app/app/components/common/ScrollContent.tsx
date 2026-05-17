"use client"
import { useState, useEffect, useRef } from "react"
import type { ScrollContent } from "@/sanity.types"
import { motion } from "framer-motion"

type ScrollContentProps = {
  block: ScrollContent
  index: number
}

export default function ScrollContentComp({ block }: ScrollContentProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down")
      } else {
        setScrollDirection("up")
      }

      lastScrollY.current = currentScrollY

      // Apply scroll effect with direction
      if (textRef.current) {
        const scrollFactor = scrollDirection === "down" ? 0.1 : -0.1
        textRef.current.style.transform = `translateX(${currentScrollY * scrollFactor}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollDirection])

  const [isHovering, setIsHovering] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let animationId: number
    let position = 0
    const speed = 0.5

    const scroll = () => {
      if (isHovering) {
        animationId = requestAnimationFrame(scroll)
        return
      }

      // Change direction based on scroll direction
      const scrollSpeed = scrollDirection === "down" ? -speed : speed
      position += scrollSpeed

      // Reset position when needed
      const containerWidth = scrollContainer.scrollWidth / 2
      if (scrollDirection === "down" && position <= -containerWidth) {
        position = 0
      } else if (scrollDirection === "up" && position >= containerWidth) {
        position = 0
      }

      scrollContainer.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isHovering, scrollDirection])

  const titles = block?.title ?? []

  return (
    <div
      className="relative overflow-hidden md:mb-20 mb-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={scrollContainerRef} className="whitespace-nowrap whitespace-scroll inline-flex" style={{ willChange: "transform" }}>
        <div className="flex items-center scrollTxt" ref={textRef}>
          {titles.map((word, idx) => (
            <motion.div
              key={idx}
              className="inline-block mx-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <span className="text-[166px] leading-1 font-shoulders dark:text-white text-black">{word.toUpperCase()}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </div>
  )
}
