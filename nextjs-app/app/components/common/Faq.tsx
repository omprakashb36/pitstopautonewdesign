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
    <div className=" dark:text-[#FAEADC] text-black py-16 md:pt-0 md:py-24">
      <div className="container mx-auto px-4 md:px-140">
        <h2 className="text-[40px] font-shoulders md:text-5xl font-normal text-center mb-12">{block?.heading}</h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <div key={item._id} className="dark:bg-[#18181c] bg-[#F0F0F0] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item._id)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-medium text-black dark:text-[#FAEADC]">{String(item.question) || "No question available"}</span>
                {openItem === item._id ? (
                  <X size={20} className="text-[#C00034] flex-shrink-0" />
                ) : (
                  <Plus size={20} className="text-[#C00034] flex-shrink-0" />
                )}
              </button>

              {openItem === item._id && <div className="">
                {item.answer && (
                  <PortableText
                    className="px-6 text-base pb-6 dark:text-[#FAEADC]/80 text-black/80 leading-relaxed"
                    value={item.answer as unknown as PortableTextBlock[]}
                  />
                )}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
