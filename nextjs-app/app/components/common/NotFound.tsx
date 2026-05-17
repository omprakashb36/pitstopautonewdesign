"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-2">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-2"
      >
        <Image
          src="/images/pitstop-logo.svg"
          alt="Pitstop Logo"
          width={200}
          height={100}
          className="w-auto h-20"
        />
      </motion.div>

      {/* 404 Text */}
      <motion.h1
        className="text-white text-9xl md:text-[15rem] font-shoulders leading-none z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        404
      </motion.h1>

      {/* Car Image */}
      <div className="relative w-full max-w-3xl my-4 md:my-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
          <Image
            src="/images/notfound.png"
            alt="Car covered with red cloth"
            width={800}
            height={400}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* Not Found Text */}
      <motion.h2
        className="text-white text-4xl md:text-6xl font-light font-shoulders tracking-wider relative z-10 mt-4 md:-mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        NOT FOUND
      </motion.h2>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <Link
          href="/en"
          className="gradientBG hover:bg-red-700 text-white font-urbanist py-3 px-8 rounded-md transition-colors duration-300"
        >
          BACK TO HOME
        </Link>
      </motion.div>
    </div>
  )
}
