import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const useDeviceDetection = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileDevice(window.innerWidth <= 940);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return { isMobileDevice, currentLocale };
};

export default useDeviceDetection;
