import { IpAPI } from "@/constants/IpAPI";

export async function api_get_product_list() {
    const ipProducts = IpAPI + "products/list";
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

export async function api_getProductById(id: string | number) {
    const ipProductById = IpAPI + "products/" + id;
    try {
        const res = await fetch(ipProductById);
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Product By Id API error:", err);
        throw err;
    }
}

export async function api_getProductDetail(id: string | number) {
    const ipProductDetail = IpAPI + "products/detail/" + id;

    try {
        const res = await fetch(ipProductDetail);

        const data = await res.json();

        return data;
    }
    catch (err) {
        console.error("Product Detail API error:", err);
        throw err;
    }
}

export async function api_product_search(keyword = "", filters = {}, limit = 10, offset = 0) {
    try {
        const params = new URLSearchParams({
            keyword,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        const res = await fetch(`${IpAPI}products/search?${params.toString()}`);
        if (!res.ok) throw new Error("Không thể gửi kết nối!");
        
        return await res.json(); 
    } catch (err) {
        console.error("Search API Error:", err);
        return [];
    }
};
