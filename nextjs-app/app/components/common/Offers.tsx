"use client"
import type { Offer } from "@/sanity.types"
import OfferCard from "./OfferCard";

type OfferListProps = {
  offers: Offer[]
}

export default function OffersComp({ offers }: OfferListProps) {
  return (
    <>
      <section className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-[24px] 3xl:gap-10 gap-5">
          {offers.map((offer)=>(
            <OfferCard offer={offer} key={offer._id}/>
          ))}         
        </div>
      </section>
    </>
  )
}
