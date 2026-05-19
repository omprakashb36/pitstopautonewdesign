import localFont from "next/font/local"
import { Urbanist, Host_Grotesk, Cairo } from "next/font/google"

/* ---------- GOOGLE FONT ---------- */
export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  display: "swap",
})

export const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-host-grotesk",
});

export const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

/* ---------- LOCAL FONT ---------- */
export const bigShoulders = localFont({
  src: [
    { path: "../public/fonts/BigShoulders-Thin.woff2", weight: "100" },
    { path: "../public/fonts/BigShoulders-Light.woff2", weight: "300" },
    { path: "../public/fonts/BigShoulders-Regular.woff2", weight: "400" },
    { path: "../public/fonts/BigShoulders-Medium.woff2", weight: "500" },
    { path: "../public/fonts/BigShoulders-SemiBold.woff2", weight: "600" },
    { path: "../public/fonts/BigShoulders-Bold.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-big-shoulders",
})
