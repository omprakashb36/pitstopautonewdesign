
export const getEmailTemplate = (currentLocale: string, templateName: string) => {
    switch (templateName) {
        case 'contact':
            return process.env[`SENDGRID_APPOINTMENT_CUSTOMER_TEMPLATE${currentLocale.toUpperCase()}`];
        case 'createAppointement':
            return process.env[`SENDGRID_APPOINTMENT_CUSTOMER_TEMPLATE_${currentLocale.toUpperCase()}`];
        default:
            throw new Error(`Template "${templateName}" not found for locale "${currentLocale}"`);
    }
}