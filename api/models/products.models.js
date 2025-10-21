const pool = require('../common/db');
const db = pool;
const mt = require('../utils/imageHandle');

async function findAll({ search, category_id, is_active, page = 1, limit = 10 }) {
	let query = `
		SELECT p.*, c.name as category_name, c.slug as category_slug
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.category_id
		WHERE 1=1
    `;
	const params = [];

	if (search) {
		query += ` AND (p.name LIKE ? OR p.brand LIKE ?)`;
		params.push(`%${search}%`, `%${search}%`);
	}

	if (category_id) {
		query += ` AND p.category_id = ?`;
		params.push(category_id);
	}

	if (is_active !== undefined) {
		query += ` AND p.is_active = ?`;
		params.push(is_active);
	}

	query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
	params.push(parseInt(limit), (page - 1) * limit);

	const [rows] = await db.query(query, params);

	// Parse JSON attributes
	return rows.map(row => ({
		...row,
		product_attributes: this.parseJSON(row.product_attributes)
	}));
}

async function findById(product_id) {
	const [products] = await db.query(
		`SELECT p.*, c.name as category_name, c.slug as category_slug
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.category_id
		WHERE p.product_id = ?`,
		[product_id]
	);

	if (products.length === 0) return null;

	const product = products[0];
	product.product_attributes = this.parseJSON(product.product_attributes);

	// Get variants
	const [variants] = await db.query(
		`SELECT * FROM product_variants WHERE product_id = ?`,
		[product_id]
	);

	// Get images for each variant
	for (let variant of variants) {
		variant.variant_attributes = this.parseJSON(variant.variant_attributes);

		const [images] = await db.query(
			`SELECT * FROM variant_images WHERE variant_id = ? ORDER BY sort_order`,
			[variant.variant_id]
		);
		variant.images = images;
	}

	product.variants = variants;
	return product;
}

async function create(data) {
	const [result] = await db.query(
		`INSERT INTO products 
		(name, slug, short_description, description, brand, category_id, thumbnail_url, product_attributes, is_active, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
		[
			data.name,
			data.slug,
			data.short_description,
			data.description,
			data.brand,
			data.category_id,
			data.thumbnail_url,
			JSON.stringify(data.product_attributes || {}),
			data.is_active ? 1 : 0
		]
	);
	return result.insertId;
}

async function update(product_id, data) {
	const [res] = await pool.query('UPDATE `products` SET ? WHERE `product_id` = ?', [data, product_id]);
	return res.affectedRows;
}

async function softDelete(product_id) {
	await db.query(
		`UPDATE products 
		SET is_active = 0
		WHERE product_id = ${product_id}`);
}

async function remove(product_id) {
	// Xóa ảnh trong uploads

	await mt.deleteProductImages(product_id);

	// Xóa đường dẫn ảnh 
	await db.query(
		`DELETE vi FROM variant_images vi
		INNER JOIN product_variants pv ON vi.variant_id = pv.variant_id
		WHERE pv.product_id = ?`,
		[product_id]
	);

	// Xóa variants
	await db.query(`DELETE FROM product_variants WHERE product_id = ?`, [product_id]);

	// Xóa product
	await db.query(`DELETE FROM products WHERE product_id = ?`, [product_id]);
}

async function get_product_search(limit = 20, offset = 0, keyword = "") {
	let query = `
    SELECT 
		p.product_id,
		p.category_id,
		p.name,
		p.slug,
		p.brand,
		p.thumbnail_url,
		MIN(v.price) AS min_price,
		MAX(v.price) AS max_price,
		SUM(v.stock) AS total_stock,
		COUNT(v.variant_id) AS variant_count
    FROM products p
		LEFT JOIN product_variants v 
			ON p.product_id = v.product_id
    WHERE p.is_active = 1
	`;

	const params = [];

	if (keyword && keyword.trim() !== "") {
		const words = keyword.trim().split(/\s+/);
		const likeClauses = [];
		const relevanceParts = [];

		for (const word of words) {
			const likePattern = `%${word}%`;
			likeClauses.push(`
        (p.name LIKE ? 
        OR p.brand LIKE ? 
        OR p.slug LIKE ?
        OR p.product_id LIKE ?)`);
			// Mỗi lần khớp 1 trường → cộng điểm
			relevanceParts.push(`
        (CASE 
			WHEN p.name LIKE ? THEN 2
			WHEN p.brand LIKE ? THEN 1
			WHEN p.slug LIKE ? THEN 1
			WHEN p.product_id LIKE ? THEN 1
		ELSE 0 
        END)
		`);
			// push 2 lần vì LIKE dùng ở cả WHERE và tính relevance
			params.push(likePattern, likePattern, likePattern, likePattern);
			params.push(likePattern, likePattern, likePattern, likePattern);
		}

		query += ` AND (${likeClauses.join(" OR ")})`;
		query += `
		GROUP BY 
			p.product_id, 
			p.category_id, 
			p.name, 
			p.slug, 
			p.brand, 
			p.thumbnail_url
		ORDER BY 
        (${relevanceParts.join(" + ")}) DESC,
        p.created_at DESC
		LIMIT ? OFFSET ?;
    `;
	} else {
		query += `
		GROUP BY 
			p.product_id, 
			p.category_id, 
			p.name, 
			p.slug, 
			p.brand, 
			p.thumbnail_url
		ORDER BY p.created_at DESC
		LIMIT ? OFFSET ?;
    `;
	}

	params.push(limit, offset);

	const [rows] = await pool.query(query, params);
	return rows;
}

// Lấy thông tin trên trang product detail theo id sản phẩm
async function get_product_detail(product_id) {
	const [rows] = await pool.query(
		`
		SELECT	
			p.product_id,
			p.category_id,
			p.name,
			p.short_description,
			p.brand,
			p.product_attributes,
			p.description,

			v.variant_id,
			v.name,
			v.sku,
			v.price,
			v.list_price,
			v.variant_attributes,
			
			vi.variant_image_id,
			vi.image_url,
			vi.alt_text
		FROM products p
		LEFT JOIN product_variants v ON v.product_id = p.product_id
		LEFT JOIN variant_images vi ON vi.variant_id = v.variant_id
		WHERE p.product_id = ? and p.is_active = 1;
		`,
		[product_id]
	);
	if (!rows || rows.length === 0) return null;

	// Gom dữ liệu sản phẩm
	const product = {
		id: rows[0].product_id,
		category_id: rows[0].category_id,
		name: rows[0].name,
		short_description: rows[0].short_description,
		description: rows[0].description,
		attributes: rows[0].product_attributes,
		brand: rows[0].brand,
		variants: [],
		images: []
	};

	// Map để gom variant
	const variantMap = {};

	rows.forEach((row) => {
		if (!row.variant_id) return;

		// Nếu variant chưa tồn tại trong map → thêm mới
		if (!variantMap[row.variant_id]) {
			variantMap[row.variant_id] = {
				id: row.variant_id,
				sku: row.sku,
				name: row.name,
				price: row.price,
				list_price: row.list_price,
				attributes: row.variant_attributes,
				images: []
			};
		}

		// Thêm ảnh cho variant
		if (row.variant_image_id) {
			product.images.push({
				variant_id: row.variant_id,
				id: row.variant_image_id,
				url: row.image_url,
				alt: row.alt_text
			});
		}
	});

	// Gán variants vào product
	product.variants = Object.values(variantMap);

	return product;

}

async function get_product_list(limit = 10, offset = 0) {
	const [rows] = await pool.query(`
		SELECT 
			p.*,
			v.variant_id,
			v.sku,
			v.price
		FROM products p
			LEFT JOIN product_variants v 
			ON v.product_id = p.product_id
			AND v.price = (
				SELECT MIN(v2.price)
				FROM product_variants v2
				WHERE v2.product_id = p.product_id
			)
		WHERE p.is_active = 1
		ORDER BY p.product_id DESC
		LIMIT ? OFFSET ?;
	`, [limit, offset]);

	return rows;
}

function parseJSON(jsonString) {
	if (!jsonString) return {};
	try {
		return JSON.parse(jsonString);
	} catch (e) {
		return {};
	}
}

module.exports = {
	findAll, findById, create, update, remove, get_product_detail, get_product_search, get_product_list, softDelete, parseJSON
};
