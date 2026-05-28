"use client"

import { useEffect, useState } from "react"
import { X, Plus } from "lucide-react"
import { Faq, FaqSection } from "@/sanity.types";
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { getFaqs } from "@/app/actions/common/sanityData";
import PortableText from "@/app/components/PortableText";
import { type PortableTextBlock } from "next-sanity";

type faqProps = {
  block: FaqSection
  index: number
}

export default function FAQ({ block }: faqProps) {
  const [openItem, setOpenItem] = useState<string | null>("faq-1")
  const [faqItems, setFaqItems] = useState<Faq[]>([]);
  const { currentLocale } = useDeviceDetection()
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        setLoading(true);
        const data: Faq[] = await getFaqs({ locale: currentLocale });
        setFaqItems(data);
        if (data.length > 0) {
          setOpenItem(data[0]._id); 
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [currentLocale]); // 
  
  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <div className="w-full faqSection py-16 md:py-24 md:pt-0 dark:text-[#FAEADC] text-[#211D1D]">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <h2 className="font-host font-extrabold text-[32px] md:text-[40px] leading-[1.1] text-[#211D1D] dark:text-[#FAEADC] opacity-80 mb-10 text-left">
          {String(block?.heading || "FREQUENTLY ANSWERED QUESTIONS").toUpperCase()}
        </h2>

        <div className="flex flex-col gap-4">
          {faqItems.map((item) => {
            const isOpen = openItem === item._id;
            return (
              <div key={item._id} className="w-full overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleItem(item._id)}
                  className={`w-full flex justify-between items-center gap-4 p-5 md:p-[30px] text-left focus:outline-none transition-all duration-300 ${
                    isOpen
                      ? "bg-[#eaeaea] dark:bg-[#25252b] rounded-t-[18px]"
                      : "bg-[#fafafa] dark:bg-[#1c1c21] rounded-[18px]"
                  }`}
                >
                  <span className={`font-host ${isOpen ? "font-bold" : "font-normal"} text-[16px] md:text-[18px] leading-[1.5] text-[#211D1D] dark:text-[#FAEADC]`}>
                    {String(item.question) || "No question available"}
                  </span>
                  {isOpen ? (
                    <X className="text-[#211D1D] dark:text-[#FAEADC] flex-shrink-0 size-6" />
                  ) : (
                    <Plus className="text-[#211D1D] dark:text-[#FAEADC] flex-shrink-0 size-6" />
                  )}
                </button>

                {isOpen && (
                  <div className="bg-[#fafafa] dark:bg-[#1c1c21] rounded-b-[18px] px-5 py-6 md:px-[30px] md:py-[40px] transition-all duration-300">
                    {item.answer && (
                      <PortableText
                        className="font-host font-normal text-[16px] md:text-[18px] leading-[1.5] text-[#211D1D] dark:text-[#FAEADC]/80"
                        value={item.answer as unknown as PortableTextBlock[]}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
