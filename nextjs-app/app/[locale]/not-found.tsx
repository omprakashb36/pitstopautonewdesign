import type { Metadata } from "next";
import Link from "next/link";
import NotFound from "@/app/components/common/NotFound";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Premium Car Detailing Services in Sharjah | Pit Stop Auto",
  } satisfies Metadata;
}

export default async function Page({ params }: { params: { locale?: string } }) {
  const locale = params?.locale ?? "en";


  return (
    <div className="notFoundPage">
    <NotFound/>
  </div>
  );
}
