"use client";

import { useEffect, useState } from "react";

export const usePersistHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Set to true once hydration is complete
  }, []);

  return isHydrated;
};