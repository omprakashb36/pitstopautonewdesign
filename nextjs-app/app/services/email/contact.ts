"use server"
import { sendEmail } from "../../utils/sendgrid";
import { getEmailTemplate } from "./util";
import type { AppointmentData } from "@/app/actions/types"

export async function sendContactCustomerEmail(data : AppointmentData, firstName : string, toEmail : string, currentLocale : string, templateName: string) {
    console.log("==> sendContactCustomerEmail() ", data,  firstName, toEmail, currentLocale, templateName);
    try {
        console.log("==> sendContactCustomerEmail() ", firstName, toEmail, currentLocale);
        if (!currentLocale) {
            console.log("Server Side Error (Contact Email sending ) : ", "Invalid locale");
            return { status: false, msg: 'Invalid Locale' };
        }
        if(!toEmail || !firstName) {
            console.log("Server Side Error (Customer Email sending ) : ", "Invalid To Email or Invalid firstname");
            return { status: false, msg: "Invalid To Email or Invalid firstname" };
        }
        const templateId = getEmailTemplate(currentLocale, templateName);
        console.log("==> sendContactCustomerEmail() ", templateId);
        if (!templateId) {
            console.log("Server Side Error (Contact Customer Email sending ) : ", "Template ID not found for locale: " + currentLocale);
            return { status: false, msg: 'Template ID not found for locale' };  
        }
        await sendEmail({
            to: toEmail || "",
            templateId: templateId,
            dynamicTemplateData: {
                firstName,
                appointment_type: data.appointment_type,
                scheduled_date: data.scheduled_date,
                scheduled_time: data.scheduled_time,
                party_name: data.party_name,
                applies_to_item: data.applies_to_item || "",
                vehicle_license_plate: data.vehicle_license_plate || "",
                selected_vehicles: (data?.service_templates?.map(item => item?.service_template || '') || []).join(', ')
            },
        });
        console.log("Contact Customer Email Sent Success to - " + toEmail );
        return { status: true, msg: 'Email sent successfully' };
    } catch (error : any) {
        console.log("Server Side Error (Contact Customer Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}