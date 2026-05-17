"use server"
import { CommonResponse } from "../types";
import axios from "axios";
import { POLARIS_API_TOKEN, POLARIS_API_URL } from "./api";


export async function fetchLead(mobile : string, email : string) : Promise<CommonResponse>{
    console.log("fetchLead() - mobile: ", mobile, " email: ", email);
    if (!mobile || !email) {
        return {
            status: false,
            message: "Mobile and email are required.",
            data: null
        };
    }

    const encodedMobile = encodeURIComponent(mobile);
    const encodedMobileAlt = encodeURIComponent(
        mobile.startsWith("+971") ? "0" + mobile.slice(4) : "+971" + mobile.slice(1)
    );

    const url = `${POLARIS_API_URL}/api/resource/Lead?fields=["name", "mobile_no","email_id", "lead_name"]&filters={"mobile_no":["in",["${encodedMobile}","${encodedMobileAlt}"]],"email_id":"${email}"}&limit=1&order_by=creation desc`;
    console.log("fetchLead() - URL: ", url);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${POLARIS_API_TOKEN}`,
            }
        });
        console.log("fetchLead() - Response: ", JSON.stringify(response.data));
        return {
            status: true,
            message: "Lead fetched successfully.",
            data: response.data
        };
    } catch (error: any) {
        console.error("fetchLead() - Error: ", error);
        console.error("fetchLead() - Error response: ", error?.response?.data);
        return {
            status: false,
            message: error?.response?.data?.message || "Failed to fetch lead.",
            data: null
        };
    }
}