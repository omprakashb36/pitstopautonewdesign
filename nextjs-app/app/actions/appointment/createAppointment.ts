"use server"
import axios from "axios"
import type { AppointmentData, CommonResponse } from "../types"
import { POLARIS_API_TOKEN, POLARIS_API_URL } from "./api"

// Made validation function async to match pattern in createLead.ts
export async function validateAppointmentData(
  appointmentData: AppointmentData,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  if (!appointmentData.appointment_type) errors.push("Appointment type is required.")
  if (!appointmentData.scheduled_date) errors.push("Scheduled date is required.")
  if (!appointmentData.scheduled_time) errors.push("Scheduled time is required.")
  if (!appointmentData.party_name) errors.push("Party name is required.")
  if (!appointmentData.applies_to_item) errors.push("Applies to item is required.")
  if (!appointmentData.vehicle_license_plate) errors.push("Vehicle license plate is required.")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function createAppointment(appointmentData: AppointmentData): Promise<CommonResponse> {
  console.log("createAppointment() payload - ", appointmentData)

  const validation = await validateAppointmentData(appointmentData)
  if (!validation.isValid) {
    return {
      status: false,
      message: "Validation failed",
      data: validation.errors,
    }
  }

  // Keeping the data structure exactly as specified
  const data = {
    data: {
      appointment_type: appointmentData.appointment_type,
      vehicle_workshop: appointmentData.appointment_type,
      appointment_source: "Website",
      company: "Pitstop Automotive Services LLC",
      scheduled_date: appointmentData.scheduled_date,
      scheduled_time: appointmentData.scheduled_time,
      appointment_for: "Lead",
      party_name: appointmentData.party_name,
      applies_to_item: appointmentData.applies_to_item,
      vehicle_license_plate: appointmentData.vehicle_license_plate,
      sales_person: appointmentData.sales_person || "",
      description: appointmentData.description || "",
      service_templates: appointmentData.service_templates || [],
    },
  }

  try {
    // Using axios.post directly instead of the config object
    const response = await axios.post(`${POLARIS_API_URL}/api/resource/Appointment`, data, {
      headers: {
        Authorization: `token ${POLARIS_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    console.log("createAppointment() response ", JSON.stringify(response.data))
    return {
      status: true,
      message: "Appointment created successfully",
      data: response.data,
    }
  } catch (error: any) {
    console.log("Error details:", error.response?.data || error.message)

    // Extract the actual error message from the response
    let errorMessage = "Failed to create appointment"

    if (error.response?.data) {
      // Check for Frappe-specific error format
      if (error.response.data.exception) {
        // Parse the exception message
        const exceptionMatch = error.response.data.exception.match(/: (.+)$/)
        if (exceptionMatch && exceptionMatch[1]) {
          errorMessage = exceptionMatch[1]
        }
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message
      }
    }

    return {
      status: false,
      message: errorMessage,
      data: error.response?.data || null,
    }
  }
}
