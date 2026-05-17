"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`${theme === "dark" ? 'dark:text-black dark:bg-black border border-solid border-white' : 'text-black bg-gray-200'} p-2 themeButton absolute ltr:right-[245px] rtl:left-[255px] top-[70px] z-[49] rounded-xl transition`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`${theme === "dark" ? '#fff' : '#000'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun h-4 w-4 rotate-0 scale-100 transition-all "><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
      {theme === "dark" ? "" : ""}
    </button>
  );
}
