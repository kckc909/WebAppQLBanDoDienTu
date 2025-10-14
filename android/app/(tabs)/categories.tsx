import { useRouter } from "expo-router";
import CategoriesScreen from "../category";
import { useEffect } from "react";

export default function CategoryPage() {
    const router = useRouter();

    useEffect(() => {
        // router.push('./app/category')
    }, [])

    return <>
        <CategoriesScreen />
    </>

}