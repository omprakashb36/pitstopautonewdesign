"use server"

import { CommonResponse } from "../types";
import { redis } from "./redis";

export async function saveOtpInDatabase(phone: string, otp: string): Promise<CommonResponse> {
    console.log(`Saving OTP ${otp} for phone ${phone} in the upstash database`);
    if (!phone || !otp) {
        return {
            status: false,
            message: "Phone number and OTP are required",
            data: null,
        };
      }
    
      const key = `otp:${phone}`;
      const ttl = 600; // 10 minutes in seconds
    
      await redis.set(key, otp, { ex: ttl });

      return {
        status: true,
        message: "OTP saved successfully",
        data: null,
      };
}

export async function getOtpFromDatabase(phone: string): Promise<string | null> {
    console.log(`Fetching OTP for phone ${phone} from the upstash database`);
    if (!phone) {
        return null;
    }
    
    const key = `otp:${phone}`;
    const otp = await redis.get(key) as string | null;
    
    return otp;
}