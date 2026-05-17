// @ts-ignore
import "../globals.css";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { toPlainText } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import DraftModeToast from "@/app/components/DraftModeToast";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "../client-utils";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import StoreProvider from '../StoreProvider';
import { ToastContainer } from "react-toastify";
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import GoogleTagManager from "@/app/components/GoogleTagManager"
import Script from "next/script";
import { urbanist, bigShoulders } from "../fonts"
import WhatsAppButton from '@/app/components/WhatsAppButton';

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: "no",
};

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  const { locale } = await params;
  const messages = await getMessages();
  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";

  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${urbanist.className} ${bigShoulders.variable}`}
    >
      <body>
        <>
        <Script
          src='//eun.fw-cdn.com/40231094/143861.js'
          strategy="afterInteractive"
          data-chat="true"
        />
         <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tc4g8ytxe9");
          `}
        </Script>
        <GoogleTagManager />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          <SanityLive onError={handleError} />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <main className="">
          <ToastContainer />
          <StoreProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
            </StoreProvider>
          </main>
          </ThemeProvider>
          {settings?.whatsAppNumber && <WhatsAppButton phoneNumber={settings.whatsAppNumber} />}
        </>
       
      </body>
    </html>
  );
}
