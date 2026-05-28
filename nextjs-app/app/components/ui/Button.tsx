"use client";
import React from "react";
import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "orange" | "disabled";
  href?: string;
};

export function Button({
  variant = "solid",
  className = "",
  children,
  disabled,
  href,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === "disabled";
  
  const baseClasses = "flex items-center justify-center px-[40px] py-[16px] rounded-[12px] text-[16px] font-extrabold uppercase leading-[1.5] transition-colors rtl:font-cairo rtl:leading-[1.2] ltr:font-host font-host";

  let variantClasses = "";
  if (isDisabled) {
    variantClasses = "bg-pitstop-action-grey text-pitstop-action-dark-grey cursor-not-allowed";
  } else if (variant === "outline") {
    variantClasses = "bg-transparent border border-pitstop-burnt-red text-pitstop-burnt-red hover:bg-pitstop-burnt-red hover:text-pitstop-near-white";
  } else if (variant === "orange") {
    variantClasses = "bg-pitstop-fiery-orange text-pitstop-near-white hover:bg-pitstop-burnt-red";
  } else {
    variantClasses = "bg-pitstop-burnt-red text-pitstop-near-white hover:bg-pitstop-fiery-orange";
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  if (href && !isDisabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={isDisabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
