export interface addresses {
    address_id: number;
    user_id: number;
    receiver_name: string | undefined;
    phone: string | undefined;
    province: string | undefined;
    district: string | undefined;
    ward: string | undefined;
    address_text: string | undefined;
    is_default: number | undefined;
    created_at: Date | undefined;
}

export interface banners {
    banner_id: number;
    title: string | undefined;
    image_url: string | undefined;
    link_url: string | undefined;
    position: string | undefined;
    start_date: Date | undefined;
    end_date: Date | undefined;
    is_active: number | undefined;
    sort_order: number | undefined;
    created_at: Date | undefined;
}

export interface cart_items {
    cart_item_id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    added_at: Date | undefined;
}

export interface carts {
    cart_id: number;
    user_id: number;
    created_at: Date | undefined;
    updated_at: Date | undefined;
}

export interface categories {
    category_id: number;
    name: string;
    slug: string | undefined;
    description: string | undefined;
    parent_id: number | undefined;
    sort_order: number | undefined;
    icon: string | undefined;
    created_at: Date | undefined;
}

export interface coupons {
    coupon_id: number;
    code: string;
    description: string | undefined;
    discount_type: any;
    discount_value: number;
    max_discount_amount: number | undefined;
    min_order_amount: number | undefined;
    usage_limit: number | undefined;
    used_count: number | undefined;
    start_date: Date | undefined;
    end_date: Date | undefined;
    is_active: number | undefined;
    created_at: Date | undefined;
}

export interface order_items {
    order_item_id: number;
    order_id: number;
    product_id: number;
    product_name_snapshot: string;
    sku_snapshot: string | undefined;
    quantity: number;
    price: number;
    created_at: Date | undefined;
}

export interface orders {
    order_id: number;
    user_id: number;
    address_id: number | undefined;
    total: number;
    shipping_fee: number | undefined;
    coupon_id: number | undefined;
    status: any | undefined;
    payment_method: any | undefined;
    tracking_number: string | undefined;
    note: string | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
}

export interface product_images {
    image_id: number;
    product_id: number;
    image_url: string;
    alt_text: string | undefined;
    sort_order: number | undefined;
    created_at: Date | undefined;
}

export interface products {
    product_id: number;
    category_id: number | undefined;
    name: string;
    slug: string | undefined;
    short_description: string | undefined;
    description: string | undefined;
    brand: string | undefined;
    price: number;
    list_price: number | undefined;
    stock: number | undefined;
    sku: string | undefined;
    attributes: string | undefined;
    is_active: number | undefined;
    thumbnail_url: string | undefined;

    created_at: Date | undefined;
    updated_at: Date | undefined;
}

export interface reviews {
    review_id: number;
    product_id: number;
    user_id: number;
    rating: number;
    title: string | undefined;
    comment: string | undefined;
    images: string | undefined;
    created_at: Date | undefined;
}

export interface users {
    user_id: number;
    fullname: string;
    email: string;
    password: string;
    phone: string | undefined;
    role: any | undefined;
    avatar_url: string | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
    is_deleted: number;
}

