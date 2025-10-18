const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `cart_items`');
  return rows;
}

async function getById(cart_item_id) {
  const [rows] = await pool.query('SELECT * FROM `cart_items` WHERE `cart_item_id` = ?', [cart_item_id]);
  return rows[0];
}

async function create(cartItems) {
  // Kiểm tra nếu cartItems không phải mảng hoặc rỗng
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Danh sách sản phẩm không hợp lệ hoặc rỗng');
  }

  const connection = await pool.getConnection(); // Sử dụng kết nối để đảm bảo transaction
  try {
    await connection.beginTransaction(); // Bắt đầu transaction

    const result = {
      insertIds: [],
      updatedRows: 0,
      affectedRows: 0
    };

    for (const item of cartItems) {
      const { cart_id, product_id, variant_id, quantity, price_snapshot } = item;

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
      const [existing] = await connection.query(
        'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
        [cart_id, product_id, variant_id, variant_id]
      );

      if (existing.length > 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật quantity và price_snapshot
        const newQuantity = existing[0].quantity + quantity;
        await connection.query(
          'UPDATE cart_items SET quantity = ?, price_snapshot = ? WHERE cart_item_id = ?',
          [newQuantity, price_snapshot, existing[0].cart_item_id]
        );
        result.updatedRows += 1;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        const [res] = await connection.query(
          'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price_snapshot) VALUES (?, ?, ?, ?, ?)',
          [cart_id, product_id, variant_id || null, quantity, price_snapshot]
        );
        result.insertIds.push(res.insertId);
        result.affectedRows += res.affectedRows;
      }
    }

    await connection.commit(); // Xác nhận transaction
    return result;
  } catch (error) {
    await connection.rollback(); // Hoàn tác nếu có lỗi
    throw new Error(`Lỗi khi xử lý giỏ hàng: ${error.message}`);
  } finally {
    connection.release(); // Giải phóng kết nối
  }
}

async function update(cart_item_id, data) {
  const [res] = await pool.query('UPDATE `cart_items` SET ? WHERE `cart_item_id` = ?', [data, cart_item_id]);
  return res.affectedRows;
}

async function remove(cart_item_id) {
  const [res] = await pool.query('DELETE FROM `cart_items` WHERE `cart_item_id` = ?', [cart_item_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
