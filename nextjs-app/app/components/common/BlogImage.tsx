import Image from "next/image";
import { BlogImage } from "@/sanity.types";
import ImageComp from "../CustomImage"
import { urlForImage } from "@/sanity/lib/utils"

type BlogImageGalleryProps = {
    block: BlogImage;
};

export default function BlogImageGallery({ block }: BlogImageGalleryProps) {
    if (!block?.layoutType) return null;

    const renderFullWidth = () => {
        if (!block.fullImage?.image) return null;

        return (
            <div className="w-full rounded-xl overflow-hidden">
                <ImageComp
                    block={block?.fullImage}
                    imageClassName="w-full h-auto object-cover mb-6"
                    width={1200}
                    height={600}
                />
            </div>
        );
    };

    const renderTwoColumn = () => {
        if (!block.twoColImages || block.twoColImages.length !== 2) return null;

        return (
            <div className="grid grid-cols-2 gap-4 mb-6">
                {block.twoColImages.map((img, i) => (
                    <div key={i} className="relative w-full rounded-xl overflow-hidden">
                        {img?.image &&

                            <Image
                                src={urlForImage(img?.image)?.url() || "/placeholder.svg"}
                                alt={"img"}
                                width={900}
                                height={600}
                                className={`w-full h-auto object-cover`}
                            />
                        }
                    </div>
                ))}
            </div>
        );
    };

    const renderThreeColumn = () => {
        if (!block.threeColImages || block.threeColImages.length !== 3) return null;

        return (
            <div className="grid grid-cols-3 gap-4 mb-6">
                {block.threeColImages.map((img, i) => (
                    <div key={i} className="relative w-full rounded-xl overflow-hidden">

                        <Image
                            src={urlForImage(img?.image)?.url() || "/placeholder.svg"}
                            alt={"img"}
                            width={900}
                            height={600}
                            className={`w-full h-auto object-cover`}
                        />
                    </div>
                ))}
            </div>
        );
    };

    switch (block.layoutType) {
        case "full":
            return renderFullWidth();

        case "two":
            return renderTwoColumn();

        case "three":
            return renderThreeColumn();

        default:
            return null;
    }
}
