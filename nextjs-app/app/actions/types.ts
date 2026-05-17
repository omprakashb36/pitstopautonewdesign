export type CommonResponse = {
    status : boolean;
    message : string;
    data : any ,
}

export type CommonValidationResponse = {
    status : boolean;
    message : string;
}

// Define the type for the appointment data
export interface AppointmentData {
    appointment_type: string;
    scheduled_date: string;
    scheduled_time: string;
    party_name: string; // lead id
    applies_to_item?: string;  // make model list - name property
    vehicle_license_plate?: string;
    sales_person?: string;
    description?: string;
    service_templates?: Array<{
        idx: number;
        service_template: string;
    }>;
}

// Define the type for the lead data
export interface LeadData {
    lead_name: string;
    mobile_no: string;
    email_id: string;
    custom_vehicle_make: string;
    custom_vehicle_model: string;
    custom_vehicle_year: string;
}

export interface FleetData {
  sender: string; // Email address (mandatory)
  message?: string;
  subject?: string;
  full_name: string;
  organization?: string;
  mobile_no: string; // Valid UAE or International format
  phone_no?: string; // Unvalidated landline number
  opportunity_args?: Record<string, any>; // Additional dynamic fields
};
