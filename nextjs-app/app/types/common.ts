export type CommonResponse = {
    status : boolean;
    message : string;
    data : any ,
}

export type CommonValidationResponse = {
    status : boolean;
    message : string;
}

export interface CaptchaVerificationResponse {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: string;
    hostname: string;
    [key: string]: any;
  }

 export type CRMEmailProps = {
    fname: string;
    lname : string;
    email: string;
    phone: string;
}

export type LeadProps = {
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    fleetSize?: string;
    companyName?: string;
    comments?: string;
    formType?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    location?: string;
    modelYear?: string;
    serviceCenter?: string;
    type?: string;
    contactYou?: string;
    pageUrl? : string;
  };