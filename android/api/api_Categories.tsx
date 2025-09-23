import { IpAPI } from "@/constants/IpAPI";

export async function api_getCategories() {
    try {
        const response = await fetch(IpAPI + "categories");
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

