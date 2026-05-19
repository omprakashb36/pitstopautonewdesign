"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  state?: "Default" | "Filled" | "Error";
  label?: string;
  errorMessage?: string;
};

export function Input({ className = "", state = "Default", label = "LABEL", errorMessage, ...props }: InputProps) {
  const isError = state === "Error";
  const isFilled = state === "Filled";
  
  return (
    <div className={`border border-solid content-stretch flex flex-col items-start px-[24px] py-[20px] relative rounded-[20px] w-full max-w-[379px] transition-colors ${isError ? "border-pitstop-burnt-red" : "border-[#d9d9d9] text-pitstop-oil-black"} ${className}`}>
      <label className={`font-extrabold rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[12px] w-full transition-opacity ${isError ? "text-pitstop-burnt-red" : isFilled ? "opacity-60" : ""}`}>
        {label}
      </label>
      <input
        className={`font-normal rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[20px] w-full outline-none bg-transparent ${isError ? "opacity-60 text-pitstop-oil-black" : isFilled ? "" : "opacity-60"}`}
        placeholder="Enter here"
        {...props}
      />
      {isError && errorMessage && (
        <span className="text-pitstop-burnt-red text-xs mt-1 absolute -bottom-5 rtl:font-cairo ltr:font-host font-host">{errorMessage}</span>
      )}
    </div>
  );
}
