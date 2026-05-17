import Link from 'next/link'
import React from 'react'
import { ImageRichText } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";
import ImageComp from "../CustomImage"

type ImageRichTextProps = {
  block: ImageRichText;
  index: number;
};

export default function ImageRichTextComp({ block }: ImageRichTextProps) {
  return (
    <>
      {/* Image Grid and Autocare Section */}
      <div className="grid md:grid-cols-2 justify-center items-center imageRichText gap-24 max-w-[1180px] mx-auto px-4 md:px-0 md:py-24 py-10">
        {/* Image Grid and Autocare Section */}
        {/* Image Grid */}
        <div className="leftImage">
          {block.leftImage?.altText && (
            <ImageComp
              block={block.leftImage}
              imageClassName="w-auto"
              width={580}
              height={800}
            />
          )}
        </div>
        {/* Autocare Section */}
        <div className="flex flex-col">
          {block?.aboutAutocare?.length && (
            <PortableText
              className=""
              value={block.aboutAutocare as PortableTextBlock[]}
            />
          )}
        </div>
      </div>
    </>
  )

}