"use client";
import React from "react";

type OtpProps = {
  className?: string;
  state?: "Empty" | "Filled" | "Error";
  value?: string; // e.g. "1234"
  onChange?: (val: string) => void;
};

export function Otp({ className = "", state = "Empty", value = "", onChange }: OtpProps) {
  const isError = state === "Error";
  
  // Create an array of 4 slots
  const slots = Array.from({ length: 4 }).map((_, i) => {
    const val = value[i];
    const isFilled = !!val;
    
    return (
      <div 
        key={i} 
        className={`border border-solid relative rounded-[16px] shrink-0 w-[58px] h-[69px] flex items-center justify-center transition-colors ${
          isError ? "border-pitstop-burnt-red" : 
          isFilled ? "border-[#d9d9d9]" : "border-[#d9d9d9]"
        }`}
      >
        <input 
           maxLength={1}
           value={val || ""}
           onChange={(e) => {
              if (onChange) {
                const newVal = value.split("");
                newVal[i] = e.target.value;
                onChange(newVal.join(""));
              }
           }}
           className={`font-host font-normal text-pitstop-oil-black text-[20px] text-center w-full h-full bg-transparent outline-none ${isError ? "text-pitstop-burnt-red" : ""}`}
        />
      </div>
    );
  });

  return (
    <div className={`flex gap-[8px] items-start relative ${className}`}>
      {slots}
    </div>
  );
}
