"use client";
import React from "react";
import Image from "next/image";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function Logo({ className = "", width = 150, height = 50 }: LogoProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Light Theme Logo */}
      <div className="dark:hidden">
        <Image
          src="/assets/logo-light.svg"
          alt="Pitstop360 Logo"
          width={width}
          height={height}
          priority
        />
      </div>
      {/* Dark Theme Logo */}
      <div className="hidden dark:block">
        <Image
          src="/assets/logo-dark.svg"
          alt="Pitstop360 Logo"
          width={width}
          height={height}
          priority
        />
      </div>
    </div>
  );
}
