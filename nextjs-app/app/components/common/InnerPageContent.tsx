'use client';

import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import PageBuilderPage from "@/app/components/PageBuilder";
import { GetPageQueryResult, Service } from "@/sanity.types";
import { useLenis } from "@/app/hooks/useLenis";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  locale: string;
  headerData: any;
  footerData: any;
  siteSettingData: any;
  page: GetPageQueryResult;
  services: Service[];
};

export default function InnerPageContent({
  locale,
  headerData,
  footerData,
  siteSettingData,
  page,
  services
}: Props) {

  useLenis();

  const pathname = usePathname();

  // Remove locale from path
  const pathSegments = pathname
    ?.replace(`/${locale}`, "")
    ?.split("/")
    ?.filter(Boolean);

  return (
    <div className="main_page innerPage">

      <Header
        services={services}
        siteSettingData={siteSettingData}
        locale={locale}
        fragment={headerData}
      />

      <div className="text-white mt-[180px] min-h-[400px] pageBg relative">

        <div
          className={
            page?.layoutType === "fullWidth"
              ? "w-full"
              : page?.layoutType === "centerText"
                ? "container-grid md:grid grid-cols-12 3xl:gap-10 md:gap-6 centerTextLayout"
              : page?.layoutType === "colSpan8"
              ? "container-grid md:grid grid-cols-12 3xl:gap-10 md:gap-6"
              : "container-grid"
          }
        >

          <div
            className={
              page?.layoutType === "fullWidth"
                ? "w-full"
                : page?.layoutType === "centerText"
                  ? "col-span-10 col-start-2"
                  : page?.layoutType === "colSpan8"
                  ? "col-span-8 col-start-3"
                  : "w-full"
            }
          >
            {/* Breadcrumb */}
            <div
              className={
                page?.layoutType === "fullWidth"
                  ? "container-grid"
                    : "w-full"
              }
            >



              <div className="flex items-center gap-2 text-[15px] mb-0 flex-wrap">
                <Link
                  href={`/${locale}`}
                  className="dark:text-[#C00034] text-black"
                >
                  Home
                </Link>

                {pathSegments?.map((segment, index) => {

                  const href =
                    `/${locale}/` +
                    pathSegments
                      .slice(0, index + 1)
                      .join("/");

                  const isLast =
                    index === pathSegments.length - 1;

                  return (
                    <div
                      key={segment}
                      className="flex items-center gap-2"
                    >

                      <span className="dark:text-[#C00034] text-black">
                        /
                      </span>

                      {isLast ? (

                        <span className="dark:text-[#C00034] text-black opacity-60 capitalize">
                          {segment.replace(/-/g, " ")}
                        </span>

                      ) : (

                        <Link
                          href={href}
                          className="dark:text-[#C00034] text-black capitalize"
                        >
                          {segment.replace(/-/g, " ")}
                        </Link>

                      )}

                    </div>
                  );
                })}

              </div>
            </div>

            <PageBuilderPage page={page} />

          </div>

        </div>

      </div>

      <Footer
        services={services}
        siteSettingData={siteSettingData}
        locale={locale}
        fragment={footerData}
      />

    </div>
  );
}