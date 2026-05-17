import "server-only";

export const POLARIS_API_URL = process.env.POLARIS_API_URL;
export const POLARIS_API_TOKEN = process.env.POLARIS_API_TOKEN;
export const ETISALAT_OTP_API_URL = process.env.ETISALAT_OTP_API_URL;
export const POLARIS_SMS_API_URL = process.env.POLARIS_SMS_API_URL;
export const POLARIS_SMS_API_TOKEN = process.env.POLARIS_SMS_API_AUTHORIZATION_TOKEN;

if(!POLARIS_API_URL || !POLARIS_API_TOKEN) {
    throw new Error("Polaris API URL and Token must be defined");
}

if(!ETISALAT_OTP_API_URL) {
    throw new Error("Etisalat OTP API URL must be defined");
}

if(!POLARIS_SMS_API_URL || !POLARIS_SMS_API_TOKEN) {
    throw new Error("Polaris SMS API URL and Token must be defined");
}