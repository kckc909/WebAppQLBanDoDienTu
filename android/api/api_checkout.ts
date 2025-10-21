
import { IpAPI } from "@/constants/IpAPI";

interface CheckoutItem {
    variant_id: number;
    quantity: number;
}

interface CreateOrderPayload {
    address_id: number;
    payment_method: string;
    note?: string;
    items: CheckoutItem[];
    voucher_ownership_id?: number | null;
}

export async function api_checkout_getData(items: CheckoutItem[]) {
    try {
        const res = await fetch(`${IpAPI}checkout/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // token
                // "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ items }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.text);
        }

        return data; // Trả về data trực tiếp, không cần response.data.data
    } catch (error) {
        console.error('api_checkout_getData error:', error);
        throw error;
    }
}

export async function api_checkout_checkStock(items: CheckoutItem[]) {
    try {
        const res = await fetch(`${IpAPI}/checkout/check-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Không thể kiểm tra tồn kho");
        }

        return data;
    } catch (error) {
        console.error('api_checkout_checkStock error:', error);
        throw error;
    }
}

export async function api_checkout_createOrder(payload: CreateOrderPayload) {
    try {
        const res = await fetch(`${IpAPI}/checkout/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Không thể tạo đơn hàng");
        }

        return data;
    } catch (error) {
        console.error('api_checkout_createOrder error:', error);
        throw error;
    }
}

export async function api_checkout_addAddress(addressData: any) {
    try {
        const res = await fetch(`${IpAPI}/checkout/add-address`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Không thể thêm địa chỉ mới");
        }

        return data;
    } catch (error) {
        console.error('api_checkout_addAddress error:', error);
        throw error;
    }
}
