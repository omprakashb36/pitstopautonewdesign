"use server"
import axios from "axios"
import type { CommonResponse, LeadData } from "../types"
import { POLARIS_API_TOKEN, POLARIS_API_URL } from "./api"

// Function to validate lead data
export async function validateLeadData(leadData: LeadData): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  if (!leadData.lead_name) errors.push("Lead name is required.")
  if (!leadData.mobile_no) errors.push("Mobile number is required.")
  if (!leadData.email_id) errors.push("Email ID is required.")
  if (!leadData.custom_vehicle_make) errors.push("Vehicle make is required.")
  if (!leadData.custom_vehicle_model) errors.push("Vehicle model is required.")
  if (!leadData.custom_vehicle_year) errors.push("Vehicle year is required.")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function createLead(leadData: LeadData): Promise<CommonResponse> {
  console.log("createLead() payload - ", leadData)

  const validation = await validateLeadData(leadData)
  if (!validation.isValid) {
    return {
      status: false,
      message: "Validation failed",
      data: validation.errors,
    }
  }

  // Format the data exactly as expected by the API
  const data = {
    data: {
      lead_name: leadData.lead_name,
      mobile_no: leadData.mobile_no,
      email_id: leadData.email_id,
      custom_vehicle_make: leadData.custom_vehicle_make,
      custom_vehicle_model: leadData.custom_vehicle_model,
      custom_vehicle_year: leadData.custom_vehicle_year,
    },
  }

  try {
    // Using axios.post directly instead of the config object
    const response = await axios.post(`${POLARIS_API_URL}/api/resource/Lead`, data, {
      headers: {
        Authorization: `token ${POLARIS_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    console.log("createLead() response ", JSON.stringify(response.data))
    return {
      status: true,
      message: "Lead created successfully",
      data: response.data,
    }
  } catch (error: any) {
    console.log("Error details:", error.response?.data || error.message)

    // Extract the actual error message from the response
    let errorMessage = "Failed to create lead"

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
