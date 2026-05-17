import { type PortableTextBlock } from "next-sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { RichText } from "@/sanity.types";

type RichTextProps = {
  block: RichText;
  index: number;
};

// Custom components for PortableText
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value) return null;
      const imageBuilder = urlForImage(value);
      const imageUrl = imageBuilder ? imageBuilder.width(800).url() : "";
      return (
        <div className="relative w-full h-[400px] my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "Sanity Image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      );
    },
  },
};

export default function RichTexComponent({ block }: RichTextProps) {
  return (
    <section className="richTextPara">
      <div>
        {block?.content?.length ? (
          <PortableText
            value={block.content as PortableTextBlock[]}
            components={components}
          />
        ) : null}
      </div>
    </section>
  );
}
