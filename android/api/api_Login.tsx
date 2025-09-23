// services/authApi.ts
import { IpAPI } from "../constants/IpAPI";

export async function apiLogin(email: string, password: string) {
    const ipLogin = `${IpAPI}users/login`;

    try {
        const res = await fetch(ipLogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Login API error:", err);
        throw err;
    }
}
