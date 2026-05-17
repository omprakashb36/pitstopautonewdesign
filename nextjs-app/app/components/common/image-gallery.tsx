import Image from "next/image"

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
  }>
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null
  }
  // Determine grid columns based on number of images
  const getGridClass = (count: number): string => {
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    return "grid-cols-3"
  }

  return (
    <div className={`grid ${getGridClass(images.length)} gap-4 w-full`}>
      {images.map((image, index) => (
        <div key={index} className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}
