import { CartItemType } from "@/constants/custom.d";
import { useState } from "react";
import CartList from "./CartList";
import { useRouter } from "expo-router";

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [selectedItems, setSelectedItems] = useState();

    return (
        <>


        </>
    );
}