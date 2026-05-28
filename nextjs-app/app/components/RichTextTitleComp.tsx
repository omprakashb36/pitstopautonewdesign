import { RichTextTitle } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";

type RichTextTitleProps = {
  block: RichTextTitle;
  index: number;
};

export default function RichTextTitleComp({ block }: RichTextTitleProps) {
  return (
 <div className={`${block?.isFullWidth ? "container-grid" : "max-w-[845px] 3xl:max-w-[1080px]"}  richTextTitle mx-auto pb-0`}>
      <div className="max-w-[628px] 3xl:max-w-[800px]">
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
