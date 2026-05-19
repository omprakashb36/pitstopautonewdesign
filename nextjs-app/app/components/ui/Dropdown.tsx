"use client";
import React from "react";
import Image from "next/image";

type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  state?: "Default" | "Filled" | "Error";
  label?: string;
};

export function Dropdown({ className = "", state = "Default", label = "LABEL", children, ...props }: DropdownProps) {
  const isError = state === "Error";
  const isFilled = state === "Filled";
  
  return (
    <div className={`border border-solid content-stretch flex items-center px-[24px] py-[20px] relative rounded-[20px] w-full max-w-[379px] ${isError ? "border-pitstop-burnt-red gap-[4px] h-[92px] justify-center" : "border-[#d9d9d9] justify-between"} ${className}`}>
      <div className={`content-stretch flex flex-col items-start leading-[1.5] relative shrink-0 w-full ${isError ? "" : "text-pitstop-oil-black"}`}>
        <label className={`font-extrabold rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[12px] whitespace-nowrap ${isError ? "text-pitstop-burnt-red" : isFilled ? "opacity-60" : ""}`}>
          {label}
        </label>
        <select
          className={`font-normal rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[20px] w-full bg-transparent outline-none appearance-none ${isError ? "opacity-60 text-pitstop-oil-black" : isFilled ? "" : "opacity-60"}`}
          {...props}
        >
          {children}
        </select>
      </div>
      <div className="relative shrink-0 size-[16px] pointer-events-none">
        <Image src="/assets/icon-chevron-down.svg" alt="Chevron Down" fill className="object-contain" />
      </div>
    </div>
  );
}
