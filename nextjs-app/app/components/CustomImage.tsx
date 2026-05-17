import { CustomImage } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";

type imageProps = {
  block: CustomImage;
  index?: number;
  width: number;
  height: number;
  imageClassName?: string;
};

export default function ImageComp({
  block,
  imageClassName,
  width = 1640,
  height = 686,
}: imageProps) {
  return (
    <>
      {block?.image?.asset?._ref && block?.isImageFullWidth ? (
        <div className="rounded-[60px] fullWidthImg mainContainer mt-10 2xl:mt-[6.23rem] md:mt-[80px]">
          <Image
            alt={block?.altText || ""}
            className={imageClassName}
            width={width}
            height={height}
            src={urlForImage(block?.image)?.url() as string}
          />
        </div>
      ) : (
        <Image
          alt={block?.altText || ""}
          className={imageClassName}
          width={width}
          height={height}
          src={urlForImage(block?.image)?.url() as string}
        />
      )}
    </>
  );
}
