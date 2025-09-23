import { IpAPI } from "@/constants/IpAPI";

export async function api_getProducts() {
    const ipProducts = IpAPI + "products";
    try {
        const res = await fetch(ipProducts);
        const data = await res.json();
        return data;
    }

    catch (err) {
        console.error("Products API error:", err);
        throw err;
    }
}

export async function api_getProductDetail() {

}