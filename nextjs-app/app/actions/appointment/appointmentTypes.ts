"use server"
import axios from 'axios';
import { CommonResponse } from '../types';
import { POLARIS_API_TOKEN, POLARIS_API_URL } from './api';

export async function getAppointmentTypes() : Promise<CommonResponse> {
   console.log("getAppointmentTypes()");
    var config = {
        method: 'get',
        url: `${POLARIS_API_URL}/api/resource/Appointment Type`,
        headers: {
            'Authorization': `token ${POLARIS_API_TOKEN}`,
        }
    };

    try {
        const response = await axios(config);
        console.log("getAppointmentTypes() response ",JSON.stringify(response.data));        
        return {
            status: true,
            message: "Success",
            data: response.data,
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to fetch appointment types",
            data: null,
        };
    }

}