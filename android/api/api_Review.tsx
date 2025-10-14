import { reviews } from "@/constants/custom.d";
import { IpAPI } from "../constants/IpAPI";

export async function get_review_by_product(product_id: number) {
    try {
        const res = await fetch(`${IpAPI}reviews/product/${product_id}}`)
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.log("Lỗi : " + err)
    }
}

export async function post_review(review: reviews) {
    try {
        const res = await fetch(`${IpAPI}reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review),
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        // console.log("Lỗi - " + err)
    }
}