"use-client"
import { Offer } from "@/sanity.types"
import ImageComp from "../CustomImage"
import useDeviceDetection from "@/app/hooks/useDeviceDetection";
import { Button } from "../ui/Button";

type OfferCardProps = {
    offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
    const slug = offer.slug?.current || "#"
    const { currentLocale } = useDeviceDetection();

    return (
        <div className="border border-[#EAEAEA] dark:border-[#FAEADC20] rounded-[40px] dark:bg-[#1A1717] bg-white drop-shadow-[0px_10px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-xl group">
            {/* Image Section */}
            <div className="h-auto md:h-[300px] w-full relative shrink-0 overflow-hidden">
                {offer?.thumbnail && (
                    <ImageComp
                        block={offer?.thumbnail}
                        width={433}
                        height={300}
                        imageClassName="w-full h-full object-cover rounded-[40px] transition-transform duration-500 group-hover:scale-105"
                    />
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-[24px] md:gap-[40px] items-start p-[24px] md:p-[40px] w-full grow">
                <div className="flex flex-col gap-[12px] md:gap-[16px] items-start w-full text-[#211d1d] dark:text-[#FAEADC]">
                    <h2 className="capitalize font-host font-bold text-[20px] md:text-[24px] leading-[1.5] w-full tracking-[0]">
                        {offer?.title}
                    </h2>
                    <p className="font-host font-normal opacity-80 body-xs leading-[1.5] w-full tracking-[0]">
                        {offer.shortDescription}
                    </p>
                </div>
                
                <Button
                    variant="orange"
                    href={`/${currentLocale}/offers/${(slug as string)?.replace(/^ar\//, "") || ""}`}
                    className="mt-auto"
                >
                    {offer.buttonText}
                </Button>
            </div>
        </div>
    )
}