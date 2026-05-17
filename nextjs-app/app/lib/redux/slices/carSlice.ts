import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentFields, CartItem, BookingFields } from "../../types/types";

type CarState = {
  appointmentData: AppointmentFields;
  cartItemData: CartItem[]; // Assuming it's an array; adjust if it's an object
  leadId: string;
  bookingData: BookingFields;
  isCartOpen: boolean;
};

const initialState: CarState = {
  appointmentData: {
    brand: '',
    model: '',
    year: '',
    plateNumber: '',
    personalDetails: {
      fullName: '',
      countryCode: '',
      phoneNumber: '',
      email: '',
    },
    selectedService: '',
  },
  cartItemData: [],
  leadId: '',
  bookingData: {
    bookingId: '',
    appointment_type: '',
    vehicle_workshop: '',
    scheduled_date: '',
    scheduled_time: '',
    name: '',
    owner: '',
  },
  isCartOpen: false,
};

const carSlice = createSlice({
  name: "carService",
  initialState,
  reducers: {
    setAppointmentData(state, action: PayloadAction<AppointmentFields>) {
      state.appointmentData = action.payload;
    },
    clearAppointmentData(state) {
      state.appointmentData = {
        brand: '',
        model: '',
        year: '',
        plateNumber: '',
        personalDetails: {
          fullName: '',
          countryCode: '',
          phoneNumber: '',
          email: '',
        },
        selectedService: '',
      };
    },
    setCartItemData(state, action: PayloadAction<CartItem[]>) {
      state.cartItemData = action.payload;
    },
    clearCartItemData(state) {
      state.cartItemData = [];
    },
    setLeadId(state, action: PayloadAction<string>) {
      state.leadId = action.payload;
    },
    clearLeadId(state) {
      state.leadId = '';
    },
    setBookingData(state, action: PayloadAction<BookingFields>) {
      state.bookingData = action.payload;
    },
    clearBookingData(state) {
        state.bookingData = {
        bookingId: '',
        appointment_type: '',
        vehicle_workshop: '',
        scheduled_date: '',
        scheduled_time: '',
      };
    },
    setCartPopup(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
      // This action is not defined in the initial state, so it can be removed or implemented as needed.
      // state.cartPopup = action.payload; // Uncomment if you have a cartPopup state
    }
  },
});

export const {
  setAppointmentData,
  clearAppointmentData,
  setCartItemData,
  clearCartItemData,
  setLeadId,
  clearLeadId,
  setBookingData,
  clearBookingData,
  setCartPopup
} = carSlice.actions;

export default carSlice.reducer;
