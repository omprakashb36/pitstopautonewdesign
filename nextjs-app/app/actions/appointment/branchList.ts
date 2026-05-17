"use server"

import axios from 'axios';
import { POLARIS_API_TOKEN, POLARIS_API_URL } from './api';
import { CommonResponse } from '../types';

export async function getBranchList() : Promise<CommonResponse> {

    try {
        const config = {
            method: 'get',
            url: `${POLARIS_API_URL}/api/resource/Branch?fields=["name", "abbreviation"]&filters={"publish_on_website": 1}&limit=99999`,
            headers: {
                'Authorization': `token ${POLARIS_API_TOKEN}`,
            }
        };

        const response = await axios(config);
        console.log("Branch List response", JSON.stringify(response.data));
        return {
            status: true,
            message: "Success",
            data: response.data,
        };
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to fetch branch list",
            data: null,
        };
    }

}