const pool = require('../common/db');
const db = pool;

class VariantImage {
    static async createMany(variant_id, images) {
        if (images.length === 0) return;

        const values = images.map((img, index) => [
            variant_id,
            img.image_url,
            img.alt_text || '',
            index,
            new Date()
        ]);

        await db.query(
            `INSERT INTO variant_images (variant_id, image_url, alt_text, sort_order, created_at) VALUES ?`,
            [values]
        );
    }

    static async deleteByVariantId(variant_id) {
        await db.query(`DELETE FROM variant_images WHERE variant_id = ?`, [variant_id]);
    }
}


module.exports = { VariantImage }