import { RichTextTitle } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";

type RichTextTitleProps = {
  block: RichTextTitle;
  index: number;
};

export default function RichTextTitleComp({ block }: RichTextTitleProps) {
  return (
 <div className="max-w-[1080px] richTextTitle mx-auto px-4 py-16 pb-6">
      <div className="md:mb-8 max-w-[580px]">
        {block?.aboutsection?.length && (
          <PortableText
            className=""
            value={block.aboutsection as PortableTextBlock[]}
          />
        )}
      </div>
    </div>
  );
}
