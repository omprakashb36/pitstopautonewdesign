"use server"
import axios from 'axios';
import { CommonResponse } from '../types';
import { POLARIS_API_TOKEN, POLARIS_API_URL } from './api';

export async function getMakeModelList() : Promise<CommonResponse> {
   
    var config = {
        method: 'get',
        url: `${POLARIS_API_URL}/api/method/agmc_custom.api.get_vehicle_model_list?fields=["name", "item_name", "variant_of", "item_group", "brand"]&filters={"is_vehicle": 1, "disabled": 0,"has_variants": 0}&limit=0`,
        headers: {
            'Authorization': `token ${POLARIS_API_TOKEN}`,
        }
    };

    try {
        const response = await axios(config);
        console.log("Make Model List response ",JSON.stringify(response.data));        
        return {
            status: true,
            message: "Success",
            data: response.data,
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to fetch make model list",
            data: null,
        };
    }

}