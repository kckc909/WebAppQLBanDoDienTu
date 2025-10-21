const pool = require('../common/db');
const db = pool;

class ProductVariant {
    static async create(product_id, data) {
        const [result] = await db.query(
            `INSERT INTO product_variants 
        (product_id, sku, name, price, list_price, stock, thumbnail_url, variant_attributes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                product_id,
                data.sku,
                data.name,
                data.price,
                data.list_price,
                data.stock,
                data.thumbnail_url,
                JSON.stringify(data.variant_attributes || {})
            ]
        );
        return result.insertId;
    }

    static async update(variant_id, data) {
        await db.query(
            `UPDATE product_variants 
        SET sku = ?, name = ?, price = ?, list_price = ?, stock = ?, 
            thumbnail_url = ?, variant_attributes = ?, updated_at = NOW()
        WHERE variant_id = ?`,
            [
                data.sku,
                data.name,
                data.price,
                data.list_price,
                data.stock,
                data.thumbnail_url,
                JSON.stringify(data.variant_attributes || {}),
                variant_id
            ]
        );
    }

    static async delete(variant_id) {
        await db.query(`DELETE FROM variant_images WHERE variant_id = ?`, [variant_id]);
        await db.query(`DELETE FROM product_variants WHERE variant_id = ?`, [variant_id]);
    }
}

module.exports = { ProductVariant }