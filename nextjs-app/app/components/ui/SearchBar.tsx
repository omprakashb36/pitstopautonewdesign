"use client";
import React from "react";
import Image from "next/image";
import { Button } from "./Button";

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  onSearch?: () => void;
};

export function SearchBar({ className = "", onSearch, ...props }: SearchBarProps) {
  return (
    <div className={`border border-[#d9d9d9] border-solid flex gap-[4px] items-center px-[16px] py-[20px] relative rounded-[20px] w-full max-w-[1200px] bg-white ${className}`}>
      <div className="flex flex-[1_0_0] gap-[12px] items-center min-w-px relative pl-2">
        <div className="relative shrink-0 size-[24px]">
           <Image src="/assets/icon-search.svg" alt="Search" fill className="object-contain" />
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start leading-[1.5] min-w-px relative text-pitstop-oil-black">
          <p className="font-extrabold rtl:font-cairo ltr:font-host font-host opacity-60 relative shrink-0 text-[12px] w-full uppercase">
            SEARCH
          </p>
          <input 
            className="font-normal rtl:font-cairo ltr:font-host font-host relative shrink-0 text-[20px] w-full outline-none bg-transparent"
            placeholder="Service for Audi A4"
            {...props}
          />
        </div>
      </div>
      <Button variant="orange" onClick={onSearch} className="px-[40px] py-[16px] rounded-[12px]">
        search services
      </Button>
    </div>
  );
}
