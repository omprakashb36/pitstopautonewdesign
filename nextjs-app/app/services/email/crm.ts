"use server"
import { CreateAppointemntProps } from "@/app/types/email";
import { sendEmail } from "../../utils/sendgrid";

export async function sendCRMCreateAppointemntEmail(props: CreateAppointemntProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMCreateAppointemntEmail() ", props, currentLocale, formType);
    try {
        if (!currentLocale) {
            console.log("Server Side Error (CRM Email sending ) : ", "Invalid locale");
            return { status: false, msg: 'Invalid Locale' };
        }
        const toEmail = process.env.SENDGRID_CRM_TO_EMAIL;
        if (!toEmail) {
            console.log("Server Side Error (CRM Email sending ) : ", "Invalid To Email");
            return { status: false, msg: 'Invalid To Email' };
        }


        await sendEmail({
            to: toEmail || "",
            templateId: process.env.SENDGRID_APPOINTMENT_CUSTOMER_TEMPLATE ?? "",
            dynamicTemplateData: {
                fname: props.fname,
                lang: currentLocale.toUpperCase(),
            },
        });
        console.log("CRM Email Sent Success to - " + toEmail);
        return { status: true, msg: 'Email sent successfully' };
    } catch (error: any) {
        console.log("Server Side Error (CRM Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}

