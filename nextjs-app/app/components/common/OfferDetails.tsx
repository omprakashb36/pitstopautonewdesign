"use client";
import { Offer } from "@/sanity.types";
import ImageComp from "../CustomImage";
import PortableText from "@/app/components/PortableText";
import type { PortableTextBlock } from "next-sanity";
import Select from "react-select";
import Link from "next/link";
import { useFormik } from "formik";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import { useEffect, useRef, useState } from "react";
import { getMakeModelList } from "@/app/actions/appointment/makeModelList";
import * as Yup from "yup";
import { usePersistHydration } from "@/app/hooks/usePersistHydration";
import { selectStyles, selectClassNames } from "@/app/utils/formStyles";
import { create } from "domain";
import { createFleetLead } from "@/app/actions/appointment/createFleet";
import { toast } from "react-toastify";
import Image from "next/image";
import OfferDetailsCards from "./OfferDetailsCards";

type OfferDetailProp = {
  offerDetails: Offer;
};

interface FormValues {
  brand: string;
  model: string;
  year: string;
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
}

const yearOptions = Array.from({ length: 25 }, (_, i) => {
  const year = 2025 - i;
  return { value: year.toString(), label: year.toString() };
});

const countryCodes = [{ value: "+971", label: "+971" }];

export default function OfferDetails({ offerDetails }: OfferDetailProp) {
  const { isMobileDevice, currentLocale } = useDeviceDetection();
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [models, setModels] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const isHydrated = usePersistHydration();
  const targetRef = useRef<HTMLDivElement>(null);
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false);
  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add this useEffect to fetch the data when the component mounts
  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsLoading(true);
      try {
        const data = await getMakeModelList();
        if (data.status && data?.data?.message) {
          // Process brands
          const uniqueBrands: string[] = [
            ...new Set(
              (data.data.message as { brand: string }[]).map(
                (item) => item.brand,
              ),
            ),
          ];
          const brandOptions = uniqueBrands
            .filter(Boolean)
            .sort()
            .map((brand) => ({
              value: brand.toLowerCase(),
              label: brand,
            }));

          setBrands(brandOptions);

          // Process models by brand
          const modelsByBrand: Record<
            string,
            { value: string; label: string }[]
          > = {};

          uniqueBrands.forEach((brand: string) => {
            if (!brand) return;

            // Get all models for this brand that don't have a variant_of (they are parent models)
            const brandModels = data.data.message
              .filter((item: any) => item.brand === brand)
              .map((item: any) => ({
                value: item.item_name.toLowerCase(),
                label: item.item_name,
              }));

            modelsByBrand[brand.toLowerCase()] = brandModels;
          });

          setModels(modelsByBrand);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  const validationSchema = Yup.object({
    brand: Yup.string().required("Brand is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.string().required("Year is required"),
    fullName: Yup.string().required("Full name is required"),
    countryCode: Yup.string().required("Country code is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{9}$/, "Phone number must be 9 digits"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Personal details form
  const formik = useFormik<FormValues>({
    initialValues: {
      brand: "",
      model: "",
      year: "",
      fullName: "",
      countryCode: "+971",
      phoneNumber: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setFinalSubmitLoader(true);
      console.log(values);
      if (!values.brand) return;
      const payload = {
        sender: values.email,
        full_name: `${values.fullName}`,
        mobile_no: `${values.countryCode}${values.phoneNumber}`,
        subject: "Offer Request - " + (offerDetails?.title || ""),
        message: "",
        organization: "",
        opportunity_args: {
          //"vehicle_license_plate": values?.plateNumber,
          applies_to_item_brand: values?.brand,
          applies_to_item: values?.model,
          //"vehicle_last_odometer": values?.odometer,
          vehicle_model_year: values?.year,
        },
      };
      try {
        const response = await createFleetLead(payload);
        console.log(response);
        if (response?.status) {
          toast.success(response?.message);
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        console.error(
          "Submission failed. Please check your details and try again.",
          error,
        );
        toast.error(String(error));
      } finally {
        setFinalSubmitLoader(false);
        resetForm();
      }
    },
  });

  // reset react-select inline styles

  // Replace the availableModels calculation with:
  const availableModels =
    formik.values.brand && models[formik.values.brand]
      ? models[formik.values.brand]
      : [];
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      border: state.isFocused
        ? "1px solid rgba(255, 255, 255, 0.4)"
        : "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "0px",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgba(255, 255, 255, 0.4)",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#FFFFFF",
      fontFamily: "var(--font-urbanist)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.5)",
      fontFamily: "var(--font-urbanist)",
      backgroundColor: "#00000",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#1b1b1b",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "0 0 8px 8px",
      borderRadius: "8px",
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#c00034"
        : state.isFocused
          ? "rgba(192, 0, 52, 0.2)"
          : "transparent",
      color: "#FFFFFF",
      fontFamily: "var(--font-urbanist)",
      "&:hover": {
        backgroundColor: "rgba(192, 0, 52, 0.2)",
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#FFFFFF",
      fontFamily: "var(--font-urbanist)",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0",
      color: "rgba(255, 255, 255, 0.5)",
      "&:hover": {
        color: "#FFFFFF",
      },
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  if (!isHydrated) {
    return <div></div>;
  }
  return (
    <div className="dark:text-[#FAEADC] text-black mt-[180px]  relative  ">
      <div className="container-grid pb-0 md:pb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[15px] mb-6 font-host">
          <Link href={`/${currentLocale}`}>Home</Link>
          <span>/</span>
          <Link href={`/${currentLocale}/offers`}>Offers</Link>
          <span>/</span>
          <span className="opacity-60">Offer details</span>
        </div>
        <h1 className="text-[30px] md:text-5xl xl:text-[60px] font-bold ">
          <span className="dark:text-[#FAEADC] text-black capitalize font-host">
            {offerDetails?.title?.split(" ")[0] || ""}
          </span>{" "}
          <span className="text-[#FF3300] capitalize font-host">
            {offerDetails?.title?.split(" ").slice(1).join(" ") || ""}
          </span>
        </h1>

        <OfferDetailsCards offerDetails = {offerDetails}/>
      </div>
    </div>
  );
}
