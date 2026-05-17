"use server";
import axios from 'axios';
import { CommonResponse } from '../types';
import { POLARIS_SMS_API_TOKEN, POLARIS_SMS_API_URL } from './api';
import { generateOtp } from './utils';
import { getOtpFromDatabase, saveOtpInDatabase } from '../upstash/otp';

export async function sendPhoneOtp(phone: string): Promise<CommonResponse> {
    console.log("sendPhoneOtp() - ", phone);

    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return {
            status: false,
            message: "Invalid phone number format",
            data: null,
        };
    }

    //generate OTP
    const otp = generateOtp(6); // Generate a 6-digit OTP
    console.log("Generated OTP: ", otp);

    //save otp in redis or database for verification later
    await saveOtpInDatabase(phone, otp); // Save OTP in the database

    const data = JSON.stringify({
        receiver_list: [phone],
        message: `Your OTP is ${otp}`,
        priority: 2,
        queue: 0,
        is_promotional: 0
    });

    const config = {
        method: 'post',
        url: POLARIS_SMS_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${POLARIS_SMS_API_TOKEN}`,
        },
        data: data,
    };

    try {
        const response = await axios(config);
        console.log("sendPhoneOtp() response ", JSON.stringify(response.data));
        return {
            status: true,
            message: "OTP sent successfully",
            data: response.data,
        };
    } catch (error) {
        console.error("sendPhoneOtp() error", error);
        return {
            status: false,
            message: "Failed to send OTP",
            data: null,
        };
    }
}

export async function verifyPhoneOtp(phone: string, otp: string): Promise<CommonResponse> {
    console.log("verifyPhoneOtp() - ", phone, otp);

    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return {
            status: false,
            message: "Invalid phone number format",
            data: null,
        };
    }

    // Verify OTP from the database or cache
    const storedOtp = await getOtpFromDatabase(phone);
    if (!storedOtp) {
        console.log(`OTP for phone ${phone} has expired or does not exist`);
        return {
            status: false,
            message: "OTP has expired or does not exist",
            data: null,
        }
    }
    console.log(`Stored OTP for phone ${phone}: ${storedOtp}`);

    const isValidOtp = storedOtp.toString() === otp;
    console.log(`Is the provided OTP valid? ${isValidOtp}`);

    if (isValidOtp) {
        return {
            status: true,
            message: "OTP verified successfully",
            data: null,
        };
    } else {
        return {
            status: false,
            message: "Invalid OTP",
            data: null,
        };
    }
}

