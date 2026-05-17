"use server"
import axios from 'axios';
import { getBranchList } from './branchList';
import { CommonResponse } from '../types';
import { POLARIS_API_TOKEN, POLARIS_API_URL } from './api';

export type Branch = {
    name: string;
    abbreviation: string;
};
export async function getWorkshopList(): Promise<CommonResponse> {
    const response = await getBranchList();
    const branches = response.data?.data as Branch[];

    console.log("Workshop List branches", JSON.stringify(branches));

    if (!branches || branches.length === 0) {
        return {
            status: false,
            message: "No Published branches found",
            data: null,
        };
    }

    const branchNames = branches.map(b => b.name);

    const filters = {
        branch: ["in", ["Musaffah", "Sajja", "Sharjah Industrial Area","Al Quoz 4","Al Ain"]],
    };


    const url = `${POLARIS_API_URL}/api/resource/Vehicle Workshop?fields=["name","branch","default_cost_center"]&filters=${encodeURIComponent(JSON.stringify(filters))}&limit=99999`;
    console.log("Workshop List URL: ", url);
    const config = {
        method: 'get' as const,
        url,
        headers: {
            'Authorization': `token ${POLARIS_API_TOKEN}`,
        }
    };

    try {
        const response = await axios(config);
        console.log("Workshop List response ", JSON.stringify(response.data));
        return {
            status: true,
            message: "Success",
            data: response.data,
        }
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);
        } else {
            console.error("Unexpected error: ", error);
        }
        return {
            status: false,
            message: "Failed to fetch workshop list",
            data: null,
        };
    }
}