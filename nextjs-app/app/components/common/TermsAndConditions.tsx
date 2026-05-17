import Link from 'next/link'
import React from 'react'
import { TermsAndConditionSection } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";

type termsAndConditionSectionProps = {
  block: TermsAndConditionSection;
  index: number;
};

export default function TermsAndConditions({ block }: termsAndConditionSectionProps) {
  return (
    <>
      <div className="max-w-[880px] mx-auto px-4 pb-24 centerAlignRichText">
        <div className="font-urbanist space-y-8">
           {block?.richText?.length && (
                    <PortableText
                      className=""
                      value={block.richText as PortableTextBlock[]}
                    />
                  )}
        </div>
      </div>
    </>
  )

}