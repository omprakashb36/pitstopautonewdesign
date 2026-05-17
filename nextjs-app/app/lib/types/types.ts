export type AppointmentFields = {
  brand: string;
  model: string;
  year: string;
  plateNumber: string;
  personalDetails: {
    fullName: string;
    countryCode: string;
    phoneNumber: string;
    email: string;
  };
  selectedService: string;
};

export type CartItem = {
  id: string
  name: string
  price: number
  originalPrice?: number
  hours?: string
  quantity?: number
  type: "service" | "product"
  serviceCode?: string
}

export type BookingFields = {
  bookingId: string;
  appointment_type: string;
  vehicle_workshop: string;
  scheduled_date: string;
  scheduled_time: string;
  name?: string;
  owner?: string;
  idx?: number;
  naming_series?: string;
  appointment_source?: string;
  disable_automated_notifications?: number;
  company?: string;
  branch?: string;
  scheduled_day_of_week?: string;
  appointment_duration?: number; // in minutes
  scheduled_dt?: string; // full ISO datetime
  end_dt?: string; // full ISO datetime
  appointment_for?: string;
  party_name?: string;
  customer_name?: string;
  contact_display?: string;
  contact_mobile?: string;
  contact_email?: string;
  secondary_contact_display?: string;
  applies_to_variant_of?: string;
  applies_to_variant_of_name?: string;
  applies_to_item?: string;
  applies_to_item_name?: string;
  vehicle_license_plate?: string;
  vehicle_unregistered?: number;
  vehicle_license_chassis?: string;
  vehicle_last_odometer?: number;
  doctype?: string; // "Appointment"
};

export const customStyles = {
   control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      border: state.isFocused ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
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
      backgroundColor: state.isSelected ? "#c00034" : state.isFocused ? "rgba(192, 0, 52, 0.2)" : "transparent",
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
}