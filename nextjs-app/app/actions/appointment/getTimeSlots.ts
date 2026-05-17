"use server"
import axios from 'axios';
import qs from 'qs';
import { CommonResponse } from '../types';
import { POLARIS_API_TOKEN, POLARIS_API_URL } from './api';

export async function getTimeSlots(scheduledDate: string, appointmentType: string): Promise<CommonResponse> {
    console.log("getTimeSlots()");
    const data = qs.stringify({
        'scheduled_date': scheduledDate,
        'appointment_type': appointmentType,
        'include_available_agents': 1,
    });

    const config = {
        method: 'get',
        url: `${POLARIS_API_URL}/api/method/crm.crm.doctype.appointment.appointment.get_appointment_timeslots`,
        headers: {
            'Authorization': `token ${POLARIS_API_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log("getTimeSlots() response ", JSON.stringify(response.data));
        return {
            status: true,
            message: "Success",
            data: response.data,
        };
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to fetch time slots",
            data: null,
        };
    }
}