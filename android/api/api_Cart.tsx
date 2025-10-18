import { IpAPI } from "@/constants/IpAPI";

export async function api_get_cartById(id: any) {
    try {
        const url = `${IpAPI}carts/${id}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log("Lỗi : " + err)
    }
}

export async function api_add_cart(cart: any) {
    // user_id, cart_id
    try {
        const url = `${IpAPI}carts`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log("Lỗi : " + err)
    }
}

export async function api_add_cart_items(cart_items: any) {
    // cart_item_id | cart_id, product_id, variant_id, quantity, price_snapshot
    try {
        const url = `${IpAPI}cart_items`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart_items)
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log("Lỗi : " + err)
    }
}