"use-client"
import { Offer } from "@/sanity.types"
import ImageComp from "../CustomImage"
import Link from "next/link"
import useDeviceDetection from "@/app/hooks/useDeviceDetection";

type OfferCardProps = {
    offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {

    const slug = offer.slug?.current || "#"
    const { currentLocale } = useDeviceDetection();

    return (
        <>
            <div className="border-[#FAEADC4D] border-[0.83px] rounded-[33.33px] dark:bg-black bg-[#F9F9F9] hover:bg-white  shadow-xl overflow-hidden">
                <div className="min-h-[150px] object-cover w-[100%] relative">
                    {offer?.thumbnail && (
                        <ImageComp
                            block={offer?.thumbnail}
                            width={433}
                            height={250}
                            imageClassName="w-full rounded-[10px] h-full object-cover object-left-bottom transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                </div>
                <div className="md:p-[33px] px-4 py-6">
                    <h2 className="dark:text-[#FAEADC] text-black font-urbanist font-extrabold md:text-[20px] text-[18px] leading-[1] tracking-[0] mb-5">{offer?.title}</h2>
                    <p className="md:text-[15px]/[100%] text-[12px] text-black dark:text-[#FAEADC] opacity-80 font-[400] tracking-[0] mb-5">{offer.shortDescription}</p>
                    <Link
                        href={`/${currentLocale}/offers/${(slug as string)?.replace(/^ar\//, "") || ""}`}>
                        <button className="rounded-[10px] py-[13.33px] w-[100%] gradientBG text-[12px]/[100%] tracking-[0]">{offer.buttonText}</button>
                    </Link>
                </div>
            </div>
        </>
    )
}