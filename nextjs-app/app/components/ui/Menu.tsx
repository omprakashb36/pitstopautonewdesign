"use client";
import React from "react";

type MenuProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  state?: "Default" | "Hover";
};

export function Menu({ className = "", state = "Default", ...props }: MenuProps) {
  const isHover = state === "Hover";
  
  return (
    <button className={`h-[10px] relative w-[40px] flex flex-col justify-between items-center bg-transparent border-none cursor-pointer group ${isHover ? "" : "overflow-clip"} ${className}`} {...props}>
      <div className={`w-full h-[2px] bg-pitstop-oil-black transition-transform duration-300 ${isHover ? "-translate-y-1" : ""}`}></div>
      <div className={`w-full h-[2px] bg-pitstop-oil-black transition-transform duration-300 ${isHover ? "translate-y-1" : ""}`}></div>
    </button>
  );
}
