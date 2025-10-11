const pool = require('../common/db');

async function getAll() {
	const [rows] = await pool.query(`
		SELECT 
		* 
		FROM products 
		
		`);
	return rows;
}

async function getById(product_id) {
	const [rows] = await pool.query('SELECT * FROM `products` WHERE `product_id` = ?', [product_id]);
	return rows[0];
}

async function create(data) {
	const [res] = await pool.query('INSERT INTO `products` SET ?', [data]);
	return res.insertId;
}

async function update(product_id, data) {
	const [res] = await pool.query('UPDATE `products` SET ? WHERE `product_id` = ?', [data, product_id]);
	return res.affectedRows;
}

async function remove(product_id) {
	const [res] = await pool.query('DELETE FROM `products` WHERE `product_id` = ?', [product_id]);
	return res.affectedRows;
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
			p.product_id,
			p.name,
			p.brand,
			p.thumbnail_url,
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


module.exports = {
	getAll, getById, create, update, remove, get_product_detail, get_product_search, get_product_list

};
