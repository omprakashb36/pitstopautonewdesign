"use client";
import React from "react";
import Image from "next/image";

type PhoneProps = React.InputHTMLAttributes<HTMLInputElement> & {
  state?: "Default" | "Filled" | "Error" | "Disabled";
  label?: string;
  countryCode?: string;
  errorMessage?: string;
};

export function Phone({ className = "", state = "Default", label = "PHONE NUMBER", countryCode = "+971", errorMessage, disabled, ...props }: PhoneProps) {
  const isDisabled = state === "Disabled" || disabled;
  const isError = state === "Error";
  const isFilled = state === "Filled";
  
  return (
    <div className={`h-[88px] relative rounded-[16px] w-full max-w-[379px] transition-colors flex ${isError ? "border border-pitstop-burnt-red" : isDisabled ? "bg-pitstop-action-grey" : "border border-[#d9d9d9]"} ${className}`}>
      
      {/* Country Code Section */}
      <div className={`flex flex-col justify-center items-start pl-[24px] pr-[12px] h-full ${isError ? "" : "text-pitstop-oil-black"}`}>
        <label className={`font-extrabold rtl:font-cairo ltr:font-host font-host text-[12px] whitespace-nowrap ${isError ? "text-pitstop-burnt-red" : "opacity-60"}`}>
          COUNTRY
        </label>
        <div className="flex items-center gap-2 mt-1 cursor-pointer">
          <span className={`font-normal rtl:font-cairo ltr:font-host font-host text-[20px] ${isError ? "opacity-60 text-pitstop-oil-black" : isDisabled ? "opacity-60" : ""}`}>
            {countryCode}
          </span>
          <div className="relative shrink-0 size-[16px]">
             <Image src="/assets/icon-chevron-down.svg" alt="Chevron Down" fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-full bg-[#d9d9d9] bg-opacity-50"></div>

      {/* Phone Number Input */}
      <div className={`flex flex-col justify-center flex-1 px-[24px] h-full ${isError ? "" : "text-pitstop-oil-black"}`}>
        <label className={`font-extrabold rtl:font-cairo ltr:font-host font-host text-[12px] whitespace-nowrap ${isError ? "text-pitstop-burnt-red" : isFilled || isDisabled ? "opacity-60" : ""}`}>
          {label}
        </label>
        <input 
          disabled={isDisabled}
          className={`font-normal rtl:font-cairo ltr:font-host font-host text-[20px] w-full outline-none bg-transparent mt-1 ${isError ? "opacity-60 text-pitstop-oil-black" : isDisabled ? "opacity-60" : ""}`}
          placeholder="555 8080 889"
          {...props}
        />
      </div>

      {isError && errorMessage && (
        <span className="text-pitstop-burnt-red text-xs mt-1 absolute -bottom-5 rtl:font-cairo ltr:font-host font-host">{errorMessage}</span>
      )}
    </div>
  );
}
