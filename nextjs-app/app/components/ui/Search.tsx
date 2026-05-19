"use client";
import React from "react";
import Image from "next/image";

type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  state?: "Default" | "Filled";
  label?: string;
};

export function Search({ className = "", state = "Default", label = "SEARCH", ...props }: SearchProps) {
  const isFilled = state === "Filled";
  return (
    <div className={`border border-[#d9d9d9] border-solid content-stretch flex flex-col items-start px-[16px] py-[20px] relative rounded-[20px] w-full max-w-[379px] ${className}`}>
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="overflow-clip relative shrink-0 size-[24px]">
          <Image src="/assets/icon-search.svg" alt="Search" fill className="object-contain" />
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start leading-[1.5] min-w-px relative text-pitstop-oil-black">
          <label className={`font-extrabold rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[12px] w-full ${isFilled ? "opacity-60" : ""}`}>
            {label}
          </label>
          <input
            className={`font-normal rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[20px] w-full bg-transparent outline-none ${isFilled ? "" : "opacity-40"}`}
            placeholder="Try oil filter for Audi A4"
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
