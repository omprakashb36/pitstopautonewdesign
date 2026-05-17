"use server"
import axios from "axios"
import type { CommonResponse, FleetData } from "../types"
import { POLARIS_API_TOKEN, POLARIS_API_URL } from "./api"

// Function to validate lead data
export async function validateFleetData(fleetData: FleetData): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  if (!fleetData.sender) errors.push("Email is required.")
  if (!fleetData.full_name) errors.push("Full Name is required.")
  if (!fleetData.mobile_no) errors.push("Mobile no is required.")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function createFleetLead(fleetData: FleetData): Promise<CommonResponse> {
  console.log("createLead() payload - ", fleetData)

  const validation = await validateFleetData(fleetData)
  if (!validation.isValid) {
    return {
      status: false,
      message: "Validation failed",
      data: validation.errors,
    }
  }

  const formData = new URLSearchParams();
  formData.append("sender", fleetData.sender);
  formData.append("full_name", fleetData?.full_name);
  formData.append("mobile_no", fleetData?.mobile_no);
  formData.append("phone_no", fleetData?.phone_no || "");
  formData.append("subject", fleetData?.subject || "");
  formData.append("message", fleetData?.message || "");
  formData.append("organization", "");
  formData.append("opportunity_args", JSON.stringify(fleetData.opportunity_args || {}))

  try {
    // Using axios.post directly instead of the config object
    const response = await axios.post(`${POLARIS_API_URL}/api/method/crm.crm.doctype.opportunity.opportunity.make_opportunity_from_lead_form`, formData, {
      headers: {
        Authorization: `token ${POLARIS_API_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    console.log("createLead() response ", JSON.stringify(response.data))
    return {
      status: true,
      message: "Your request has been successfully submitted.",
      data: response.data,
    }
  } catch (error: any) {
    console.log("Error details:", error.response?.data || error.message)

    // Extract the actual error message from the response
    let errorMessage = "Submission failed. Please check your details and try again."

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
