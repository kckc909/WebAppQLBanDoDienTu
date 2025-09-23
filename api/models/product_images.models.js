const pool = require('../common/db');

// Lấy tất cả ảnh theo product_id
async function getByProduct(productId) {
  const [rows] = await pool.query(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, created_at DESC',
    [productId]
  );
  return rows;
}

// Tạo bản ghi ảnh mới (trước khi có file_url)
async function create(productId, sortOrder = 0, altText = '') {
  const [res] = await pool.query(
    'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
    [productId, '', altText, sortOrder]
  );
  return res.insertId;
}

// Cập nhật url sau khi lưu file
async function updateImageUrl(imageId, url) {
  await pool.query(
    'UPDATE product_images SET image_url = ? WHERE image_id = ?',
    [url, imageId]
  );
}

// Xoá ảnh
async function remove(imageId) {
  const [rows] = await pool.query(
    'SELECT * FROM product_images WHERE image_id = ?',
    [imageId]
  );
  if (rows.length === 0) return null;

  await pool.query('DELETE FROM product_images WHERE image_id = ?', [imageId]);
  return rows[0]; // để biết file_path mà xoá file
}

module.exports = { getByProduct, create, updateImageUrl, remove };
